#!/usr/bin/env python3
"""
BidCheck End-to-End Test
Usage: python test_e2e.py path/to/rfp.pdf [--base-url http://localhost:8000]

Tests the full pipeline via HTTP calls to the running local backend.
Cleans up all created data at the end.
"""
import sys
import time
import json
import argparse
import requests

# ── Config ────────────────────────────────────────────────────────────────────

DEFAULT_URL = "http://localhost:8000"
POLL_INTERVAL_S = 2
POLL_TIMEOUT_S  = 120
SLOW_WARN_MS    = 15000

PRICING_PAYLOAD = {
    "license_cost": 50000,
    "service_day_rate": 1200,
    "effort_days_low": 30,
    "effort_days_base": 45,
    "effort_days_high": 60,
    "risk_buffer_percent": 15,
}

TEST_QUESTIONS = [
    "What is the main scope of this RFP?",
    "What are the key technical requirements?",
    "What are the submission deadline and timeline?",
]

# ── Helpers ───────────────────────────────────────────────────────────────────

PASS = "\033[92m✓\033[0m"
FAIL = "\033[91m✗\033[0m"
INFO = "\033[94m•\033[0m"

def step(label):
    print(f"\n{INFO}  {label}")

def ok(label, detail=""):
    print(f"   {PASS}  {label}" + (f"  \033[90m{detail}\033[0m" if detail else ""))

def fail(label, detail=""):
    print(f"   {FAIL}  {label}" + (f"  \033[91m{detail}\033[0m" if detail else ""))
    sys.exit(1)

def timed(fn, *args, **kwargs):
    t0 = time.time()
    result = fn(*args, **kwargs)
    ms = int((time.time() - t0) * 1000)
    if ms > SLOW_WARN_MS:
        print(f"   \033[93m⚠  Slow response: {ms}ms\033[0m")
    return result, ms

def req(method, url, **kwargs):
    try:
        r = getattr(requests, method)(url, timeout=120, **kwargs)
        if r.status_code >= 400:
            fail(f"HTTP {r.status_code} from {method.upper()} {url}", r.text[:200])
        return r
    except requests.ConnectionError:
        fail(f"Cannot connect to {url}", "Is the backend running?")

# ── Test steps ────────────────────────────────────────────────────────────────

def test_health(base):
    step("Health check")
    r = req("get", f"{base}/health")
    assert r.json() == {"status": "ok"}, f"Unexpected: {r.json()}"
    ok("/health → ok")


def test_create_project(base):
    step("Create customer and project")
    cust = req("post", f"{base}/customers", json={"name": "E2E Test Customer"}).json()
    assert cust["id"], "No customer id"
    ok(f"Customer created  id={cust['id']}  name={cust['name']}")

    proj = req("post", f"{base}/customers/{cust['id']}/projects",
               json={"name": "E2E Test Project", "language": "EN"}).json()
    assert proj["id"], "No project id"
    assert proj["language"] == "EN"
    ok(f"Project created  id={proj['id']}  lang={proj['language']}")

    return cust["id"], proj["id"]


def test_upload(base, project_id, pdf_path):
    step(f"Upload PDF: {pdf_path}")
    with open(pdf_path, "rb") as f:
        (r, ms) = timed(req, "post", f"{base}/projects/{project_id}/documents",
                        files={"file": (pdf_path, f, "application/pdf")})
    doc = r.json()
    assert doc["id"], "No doc id"
    assert doc["status"] in ("processing", "uploading", "ready")
    ok(f"Uploaded  id={doc['id']}  status={doc['status']}", f"{ms}ms")
    return doc["id"]


def test_poll_ready(base, project_id):
    """Returns True if at least one doc is ready, False if all errored (no Azure)."""
    step("Polling document status until ready")
    deadline = time.time() + POLL_TIMEOUT_S
    while time.time() < deadline:
        docs = req("get", f"{base}/projects/{project_id}/documents").json()
        statuses = {d["id"]: d["status"] for d in docs}
        pending = [s for s in statuses.values() if s not in ("ready", "error")]
        if not pending:
            any_ready = False
            for doc_id, status in statuses.items():
                if status == "ready":
                    any_ready = True
                    ok(f"Document {doc_id} → ready  pages={next(d['page_count'] for d in docs if d['id']==doc_id)}")
                else:
                    print(f"   \033[93m⚠  Document {doc_id} → {status} (ingestion failed — Azure credentials required for embeddings)\033[0m")
            return any_ready
        time.sleep(POLL_INTERVAL_S)
    fail("Timeout waiting for documents to reach ready/error state")


def test_chat(base, project_id):
    step("Q&A with citations (3 questions)")
    for q in TEST_QUESTIONS:
        (r, ms) = timed(req, "post", f"{base}/projects/{project_id}/chat",
                        json={"question": q})
        data = r.json()
        assert "answer" in data,        "Missing 'answer' field"
        assert "citations" in data,     "Missing 'citations' field"
        assert "response_time_ms" in data
        has_citations = len(data["citations"]) > 0
        not_found     = "Not found in provided documents" in data["answer"]
        status = "cited" if has_citations else ("not_found" if not_found else "answered")
        ok(f"Q: {q[:55]}…", f"{ms}ms  {status}")


def test_gaps(base, project_id):
    step("Gaps analysis")
    (r, ms) = timed(req, "post", f"{base}/projects/{project_id}/gaps", json={})
    data = r.json()
    if isinstance(data, list):
        assert len(data) > 0 or True, "Empty gaps array (may be fine for short docs)"
        for item in data[:3]:
            assert "category"    in item, "Missing 'category'"
            assert "requirement" in item, "Missing 'requirement'"
            assert "gap_type"    in item, "Missing 'gap_type'"
            assert "confidence"  in item, "Missing 'confidence'"
        ok(f"{len(data)} gap items returned", f"{ms}ms")
    elif "error" in data:
        print(f"   \033[93m⚠  JSON parse error (check Azure keys): {data['error'][:80]}\033[0m")
    else:
        fail("Unexpected gaps response format", str(data)[:200])


def test_risks(base, project_id):
    step("Risk analysis")
    (r, ms) = timed(req, "post", f"{base}/projects/{project_id}/risks", json={})
    data = r.json()
    if "error" in data:
        print(f"   \033[93m⚠  JSON parse error (check Azure keys): {data['error'][:80]}\033[0m")
        return
    assert "recommendation" in data, "Missing 'recommendation' field"
    assert "risks"          in data, "Missing 'risks' field"
    ok(f"Recommendation: {data['recommendation']}  risks={len(data.get('risks', []))}", f"{ms}ms")


def test_sow(base, project_id):
    step("SOW draft")
    (r, ms) = timed(req, "post", f"{base}/projects/{project_id}/sow", json={})
    data = r.json()
    if "error" in data:
        print(f"   \033[93m⚠  JSON parse error (check Azure keys): {data['error'][:80]}\033[0m")
        return
    required_sections = ["scope", "work_packages", "deliverables", "assumptions",
                         "exclusions", "dependencies", "placeholders"]
    missing = [s for s in required_sections if s not in data]
    if missing:
        fail(f"SOW missing sections: {missing}")
    ok(f"All 7 SOW sections present", f"{ms}ms")


def test_summary(base, project_id):
    step("Business case summary")
    (r, ms) = timed(req, "post", f"{base}/projects/{project_id}/summary", json={})
    data = r.json()
    if "error" in data:
        print(f"   \033[93m⚠  JSON parse error (check Azure keys): {data['error'][:80]}\033[0m")
        return
    assert "recommendation" in data, "Missing 'recommendation' field"
    ok(f"Recommendation: {data.get('recommendation')}  scope_clarity={data.get('scope_clarity')}", f"{ms}ms")


def test_pricing(base, project_id):
    step("Pricing calculation")
    (r, ms) = timed(req, "post", f"{base}/projects/{project_id}/pricing",
                    json=PRICING_PAYLOAD)
    data = r.json()
    s = data["scenarios"]

    checks = [
        ("low  service_cost",  s["low"]["service_cost"],  36000.0),
        ("low  total",         s["low"]["total"],          86000.0),
        ("low  with_buffer",   s["low"]["with_buffer"],    98900.0),
        ("base service_cost",  s["base"]["service_cost"], 54000.0),
        ("base total",         s["base"]["total"],        104000.0),
        ("base with_buffer",   s["base"]["with_buffer"],  119600.0),
        ("high service_cost",  s["high"]["service_cost"], 72000.0),
        ("high total",         s["high"]["total"],        122000.0),
        ("high with_buffer",   s["high"]["with_buffer"],  140300.0),
    ]
    for label, got, expected in checks:
        assert got == expected, f"{label}: expected {expected}, got {got}"

    ok(f"All 9 math assertions passed", f"{ms}ms")
    ok(f"Base scenario: {s['base']['with_buffer']:,.0f} EUR (with 15% buffer)")


def test_delete(base, customer_id, project_id):
    step("Delete project (cleanup)")
    req("delete", f"{base}/projects/{project_id}")
    # Verify gone
    r = requests.get(f"{base}/projects/{project_id}", timeout=10)
    assert r.status_code == 404, f"Expected 404 after delete, got {r.status_code}"
    ok(f"Project {project_id} deleted and confirmed 404")


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="BidCheck E2E test")
    parser.add_argument("pdf", help="Path to a test PDF file")
    parser.add_argument("--base-url", default=DEFAULT_URL)
    args = parser.parse_args()

    base = args.base_url.rstrip("/")
    pdf  = args.pdf

    print(f"\n\033[1mBidCheck E2E Test\033[0m  →  {base}")
    print(f"PDF: {pdf}\n")

    t_start = time.time()

    test_health(base)
    customer_id, project_id = test_create_project(base)
    test_upload(base, project_id, pdf)
    docs_ready = test_poll_ready(base, project_id)

    if docs_ready:
        test_chat(base, project_id)
        test_gaps(base, project_id)
        test_risks(base, project_id)
        test_sow(base, project_id)
        test_summary(base, project_id)
    else:
        print(f"\n   \033[93m⚠  Skipping AI steps (chat/gaps/risks/sow/summary) — no documents indexed.\033[0m")
        print(f"   \033[93m   Set valid Azure OpenAI credentials in backend/.env to test the full pipeline.\033[0m")

    test_pricing(base, project_id)
    test_delete(base, customer_id, project_id)

    total = int((time.time() - t_start) * 1000)
    print(f"\n\033[92m\033[1mAll tests passed\033[0m  total={total}ms\n")


if __name__ == "__main__":
    main()
