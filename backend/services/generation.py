import logging
from openai import AzureOpenAI
from config import settings as app_settings

logger = logging.getLogger(__name__)


def _get_client() -> AzureOpenAI:
    return AzureOpenAI(
        api_key=app_settings.azure_openai_api_key,
        azure_endpoint=app_settings.azure_openai_endpoint,
        api_version=app_settings.azure_openai_api_version,
    )


def _build_context(chunks: list[dict]) -> str:
    parts = []
    for chunk in chunks:
        parts.append(
            f"[SOURCE: {chunk['doc_name']}, page {chunk['page']}]\n{chunk['text']}"
        )
    return "\n\n---\n\n".join(parts)


def answer_question(query: str, chunks: list[dict], language: str) -> dict:
    """Answer a question strictly from retrieved chunks, with citations."""
    context = _build_context(chunks)

    system_prompt = (
        f"You are a precise assistant analyzing RFP documents.\n"
        f"Answer ONLY based on the provided sources.\n"
        f"Every claim must reference a source using [SOURCE: filename, page N].\n"
        f"If the answer cannot be found in the sources, respond with exactly:\n"
        f"\"Not found in provided documents.\"\n"
        f"Respond in {'German' if language == 'DE' else 'English'}."
    )

    user_prompt = f"Question: {query}\n\nSources:\n{context}"

    client = _get_client()
    response = client.chat.completions.create(
        model=app_settings.azure_openai_deployment_gpt4o,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        temperature=0.2,
    )

    answer = response.choices[0].message.content.strip()

    # Extract citations from the chunks used
    citations = [
        {
            "doc_name": c["doc_name"],
            "page": c["page"],
            "snippet": c["text"][:200],
        }
        for c in chunks
    ]

    return {"answer": answer, "citations": citations}


def run_analysis(analysis_type: str, context: str, language: str) -> dict:
    """Load the correct DE/EN prompt, inject context, call GPT-4o, return parsed JSON.

    analysis_type: one of "gaps" | "risks" | "sow" | "summary"
    language:      "DE" or "EN"
    """
    import json, os

    lang_suffix = "de" if language == "DE" else "en"
    prompt_file = f"{analysis_type}_{lang_suffix}.txt"
    prompt_path = os.path.join(os.path.dirname(__file__), "..", "prompts", prompt_file)

    with open(prompt_path, "r", encoding="utf-8") as f:
        prompt_template = f.read()

    prompt = prompt_template.replace("{context}", context)

    client = _get_client()
    response = client.chat.completions.create(
        model=app_settings.azure_openai_deployment_gpt4o,
        messages=[{"role": "user", "content": prompt}],
        temperature=0,
    )

    raw = response.choices[0].message.content.strip()

    # Strip markdown code fences if present
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
        raw = raw.strip()

    try:
        return json.loads(raw)
    except json.JSONDecodeError as e:
        logger.error(f"JSON parse error in run_analysis ({prompt_file}): {e}\nRaw: {raw[:500]}")
        return {"error": str(e), "raw_response": raw}
