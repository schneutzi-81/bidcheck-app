import React, { useState } from 'react';
import {
  MessageSquare, AlertTriangle, FileText, TrendingUp, BarChart2, Euro,
  Loader2, AlertCircle, Send, ChevronDown, ChevronUp, CheckCircle
} from 'lucide-react';
import { api } from '../api/client';

// ── Shared helpers ────────────────────────────────────────────────────────────

function LoadingState({ label }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <Loader2 className="w-10 h-10 text-violet-400 animate-spin" />
      <p className="text-sm text-slate-400">{label}</p>
      <p className="text-xs text-slate-600">This may take 10–20 seconds</p>
    </div>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center gap-4 py-12">
      <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-center max-w-md">
        <AlertCircle className="w-8 h-8 text-rose-400 mx-auto mb-2" />
        <p className="text-sm text-rose-300">{message}</p>
      </div>
      <button onClick={onRetry} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-sm text-slate-300 transition-all">
        Try Again
      </button>
    </div>
  );
}

function RunButton({ label, icon: Icon, onClick, loading }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-sm font-semibold transition-all shadow-lg shadow-violet-500/20"
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Icon className="w-4 h-4" />}
      {loading ? 'Running analysis…' : label}
    </button>
  );
}

// ── Chat View ─────────────────────────────────────────────────────────────────

function ChatView({ projectId }) {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);

  const send = async () => {
    if (!question.trim() || loading) return;
    const q = question.trim();
    setQuestion('');
    setMessages(prev => [...prev, { role: 'user', text: q }]);
    setLoading(true);
    setError(null);
    try {
      const result = await api.askQuestion(projectId, q);
      setMessages(prev => [...prev, { role: 'ai', text: result.answer, citations: result.citations, ms: result.response_time_ms }]);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
        {messages.length === 0 && (
          <p className="text-sm text-slate-500 text-center py-8">Ask anything about the uploaded RFP documents. Every answer is citation-backed.</p>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-2xl rounded-2xl px-4 py-3 text-sm ${msg.role === 'user' ? 'bg-violet-600/30 border border-violet-500/40 text-slate-200' : 'bg-slate-800/60 border border-slate-700/50 text-slate-200'}`}>
              <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
              {msg.citations?.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-700/50 space-y-1">
                  {msg.citations.map((c, ci) => (
                    <p key={ci} className="text-xs text-violet-300">
                      [{ci + 1}] {c.doc_name} — page {c.page}
                    </p>
                  ))}
                </div>
              )}
              {msg.ms && <p className="text-xs text-slate-600 mt-2">{msg.ms}ms</p>}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl px-4 py-3">
              <Loader2 className="w-4 h-4 text-violet-400 animate-spin" />
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-sm text-rose-300">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
        </div>
      )}

      <div className="flex gap-2">
        <input
          value={question}
          onChange={e => setQuestion(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
          placeholder="What are the key technical requirements?"
          className="flex-1 px-4 py-2.5 bg-slate-900/60 border border-slate-700/80 rounded-xl text-sm placeholder:text-slate-600 focus:border-violet-500/50 outline-none transition-all"
        />
        <button onClick={send} disabled={!question.trim() || loading}
          className="px-4 py-2.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 rounded-xl transition-all">
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ── Gaps View ─────────────────────────────────────────────────────────────────

function GapsView({ projectId }) {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState(null);

  const run = async () => {
    setLoading(true); setError(null); setData(null);
    try { setData(await api.getGaps(projectId)); }
    catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  const confidenceColor = c => c === 'High' || c === 'Hoch' ? 'text-emerald-400' : c === 'Low' || c === 'Niedrig' ? 'text-rose-400' : 'text-amber-400';

  if (loading) return <LoadingState label="Extracting requirements and gaps from RFP…" />;
  if (error)   return <ErrorState message={error} onRetry={run} />;

  return (
    <div className="space-y-4">
      {!data && <RunButton label="Extract Requirements & Gaps" icon={AlertTriangle} onClick={run} loading={loading} />}
      {data && (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">{Array.isArray(data) ? data.length : 0} items found</p>
            <RunButton label="Re-run" icon={AlertTriangle} onClick={run} loading={loading} />
          </div>
          {data.error ? (
            <pre className="text-xs text-rose-300 bg-rose-500/10 p-4 rounded-xl overflow-auto">{JSON.stringify(data, null, 2)}</pre>
          ) : (
            <div className="space-y-3">
              {(Array.isArray(data) ? data : []).map((item, i) => (
                <div key={i} className="p-4 bg-slate-800/40 border border-slate-700/50 rounded-2xl">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <span className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">{item.category}</span>
                    <span className={`text-xs font-medium ${confidenceColor(item.confidence)}`}>{item.confidence}</span>
                  </div>
                  <p className="text-sm font-medium text-slate-200 mb-1">{item.requirement}</p>
                  {item.gap_type !== 'None' && item.gap_type !== 'Keine' && (
                    <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 mr-2">{item.gap_type}</span>
                  )}
                  <p className="text-xs text-slate-400 mt-2">{item.detail}</p>
                  {item.source && <p className="text-xs text-violet-400 mt-2 font-mono">{item.source}</p>}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ── Risks View ────────────────────────────────────────────────────────────────

function RisksView({ projectId }) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const run = async () => {
    setLoading(true); setError(null); setData(null);
    try { setData(await api.getRisks(projectId)); }
    catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  const impactColor = i => i === 'Critical' || i === 'Kritisch' ? 'text-rose-400 bg-rose-500/20' : i === 'High' || i === 'Hoch' ? 'text-orange-400 bg-orange-500/20' : i === 'Medium' || i === 'Mittel' ? 'text-amber-400 bg-amber-500/20' : 'text-emerald-400 bg-emerald-500/20';
  const recColor = r => (r === 'Go' || r === 'Go mit Bedingungen') ? 'text-emerald-300 border-emerald-500/50 bg-emerald-500/10' : r === 'No-Go' ? 'text-rose-300 border-rose-500/50 bg-rose-500/10' : 'text-amber-300 border-amber-500/50 bg-amber-500/10';

  if (loading) return <LoadingState label="Analysing risks and generating recommendation…" />;
  if (error)   return <ErrorState message={error} onRetry={run} />;

  return (
    <div className="space-y-4">
      {!data && <RunButton label="Analyse Risks" icon={AlertTriangle} onClick={run} loading={loading} />}
      {data && (
        <>
          {data.recommendation && (
            <div className={`p-4 rounded-2xl border-2 text-center font-bold text-xl ${recColor(data.recommendation)}`}>
              {data.recommendation}
            </div>
          )}
          {data.executive_summary && (
            <div className="p-4 bg-slate-800/40 border border-slate-700/50 rounded-2xl">
              <p className="text-xs text-slate-500 mb-1">Executive Summary</p>
              <p className="text-sm text-slate-300">{data.executive_summary}</p>
            </div>
          )}
          {data.recommendation_rationale && (
            <div className="p-4 bg-slate-800/40 border border-slate-700/50 rounded-2xl">
              <p className="text-xs text-slate-500 mb-1">Rationale</p>
              <p className="text-sm text-slate-300">{data.recommendation_rationale}</p>
            </div>
          )}
          <div className="space-y-3">
            {(data.risks || []).map((risk, i) => (
              <div key={i} className="p-4 bg-slate-800/40 border border-slate-700/50 rounded-2xl">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-slate-200">{risk.title}</p>
                  <span className={`text-xs px-2 py-0.5 rounded font-medium ${impactColor(risk.impact)}`}>{risk.impact}</span>
                </div>
                <p className="text-xs text-slate-400 mb-2">{risk.description}</p>
                <p className="text-xs text-emerald-400"><span className="text-slate-500">Mitigation: </span>{risk.mitigation}</p>
                {risk.source && <p className="text-xs text-violet-400 mt-1 font-mono">{risk.source}</p>}
              </div>
            ))}
          </div>
          <RunButton label="Re-run" icon={AlertTriangle} onClick={run} loading={loading} />
        </>
      )}
    </div>
  );
}

// ── SOW View ──────────────────────────────────────────────────────────────────

function SowView({ projectId }) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [open, setOpen]       = useState({});

  const run = async () => {
    setLoading(true); setError(null); setData(null);
    try { setData(await api.getSow(projectId)); }
    catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  const toggle = key => setOpen(prev => ({ ...prev, [key]: !prev[key] }));

  if (loading) return <LoadingState label="Drafting Statement of Work from RFP content…" />;
  if (error)   return <ErrorState message={error} onRetry={run} />;

  const sections = data ? [
    { key: 'scope',         label: 'Scope',          value: data.scope,        type: 'text' },
    { key: 'work_packages', label: 'Work Packages',  value: data.work_packages, type: 'packages' },
    { key: 'deliverables',  label: 'Deliverables',   value: data.deliverables,  type: 'list' },
    { key: 'assumptions',   label: 'Assumptions',    value: data.assumptions,   type: 'list' },
    { key: 'exclusions',    label: 'Exclusions',     value: data.exclusions,    type: 'list' },
    { key: 'dependencies',  label: 'Dependencies',   value: data.dependencies,  type: 'list' },
    { key: 'placeholders',  label: 'Placeholders (TBD)', value: data.placeholders, type: 'list' },
  ] : [];

  return (
    <div className="space-y-4">
      {!data && <RunButton label="Draft Statement of Work" icon={FileText} onClick={run} loading={loading} />}
      {data && (
        <>
          {data.disclaimer && (
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-300 text-center">
              {data.disclaimer}
            </div>
          )}
          {sections.map(({ key, label, value, type }) => value && (
            <div key={key} className="border border-slate-700/50 rounded-2xl overflow-hidden">
              <button onClick={() => toggle(key)} className="w-full flex items-center justify-between px-4 py-3 bg-slate-800/40 hover:bg-slate-800/60 transition-all">
                <span className="text-sm font-medium text-slate-200">{label}</span>
                {open[key] ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>
              {open[key] && (
                <div className="p-4 bg-slate-900/30 text-sm text-slate-300">
                  {type === 'text' && <p className="leading-relaxed">{value}</p>}
                  {type === 'list' && (
                    <ul className="space-y-1.5">
                      {(value || []).map((item, i) => <li key={i} className="flex gap-2"><span className="text-violet-400 mt-1">•</span><span>{item}</span></li>)}
                    </ul>
                  )}
                  {type === 'packages' && (
                    <div className="space-y-3">
                      {(value || []).map((pkg, i) => (
                        <div key={i} className="p-3 bg-slate-800/50 rounded-xl">
                          <p className="font-medium text-slate-200 mb-1">{pkg.title}</p>
                          <p className="text-xs text-slate-400 mb-1">{pkg.description}</p>
                          <p className="text-xs text-emerald-400"><span className="text-slate-500">Deliverable: </span>{pkg.deliverable}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
          <RunButton label="Re-run" icon={FileText} onClick={run} loading={loading} />
        </>
      )}
    </div>
  );
}

// ── Summary View ──────────────────────────────────────────────────────────────

function SummaryView({ projectId }) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const run = async () => {
    setLoading(true); setError(null); setData(null);
    try { setData(await api.getSummary(projectId)); }
    catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  const badge = (val, positiveVals, negativeVals) => {
    if (positiveVals.includes(val)) return 'bg-emerald-500/20 text-emerald-300';
    if (negativeVals.includes(val)) return 'bg-rose-500/20 text-rose-300';
    return 'bg-amber-500/20 text-amber-300';
  };

  if (loading) return <LoadingState label="Generating business case summary…" />;
  if (error)   return <ErrorState message={error} onRetry={run} />;

  return (
    <div className="space-y-4">
      {!data && <RunButton label="Generate Business Case Summary" icon={BarChart2} onClick={run} loading={loading} />}
      {data && (
        <>
          {data.recommendation && (
            <div className={`p-5 rounded-2xl border-2 text-center text-xl font-bold ${badge(data.recommendation, ['Proceed', 'Fortfahren'], ['Do Not Proceed', 'Nicht fortfahren'])} border-current`}>
              {data.recommendation}
            </div>
          )}
          {data.recommendation_rationale && (
            <div className="p-4 bg-slate-800/40 border border-slate-700/50 rounded-2xl">
              <p className="text-xs text-slate-500 mb-1">Rationale</p>
              <p className="text-sm text-slate-300 leading-relaxed">{data.recommendation_rationale}</p>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'Scope Clarity',        val: data.scope_clarity,        notes: data.scope_clarity_notes,     pos: ['Clear', 'Klar'],           neg: ['Unclear', 'Unklar'] },
              { label: 'Pricing Confidence',   val: data.pricing_confidence,   notes: data.pricing_notes,           pos: ['High', 'Hoch'],            neg: ['Low', 'Niedrig'] },
              { label: 'Delivery Feasibility', val: data.delivery_feasibility, notes: data.delivery_notes,          pos: ['Feasible', 'Umsetzbar'],   neg: ['Not Feasible', 'Nicht umsetzbar'] },
            ].map(({ label, val, notes }) => val && (
              <div key={label} className="p-4 bg-slate-800/40 border border-slate-700/50 rounded-2xl">
                <p className="text-xs text-slate-500 mb-2">{label}</p>
                <span className={`text-sm font-semibold px-2 py-1 rounded ${badge(val, ['Clear','Klar','High','Hoch','Feasible','Umsetzbar'], ['Unclear','Unklar','Low','Niedrig','Not Feasible','Nicht umsetzbar'])}`}>{val}</span>
                {notes && <p className="text-xs text-slate-400 mt-2">{notes}</p>}
              </div>
            ))}
          </div>
          {data.key_risks?.length > 0 && (
            <div className="p-4 bg-slate-800/40 border border-slate-700/50 rounded-2xl">
              <p className="text-xs text-slate-500 mb-2">Key Risks</p>
              <ul className="space-y-1">
                {data.key_risks.map((r, i) => <li key={i} className="text-sm text-slate-300 flex gap-2"><span className="text-rose-400">•</span>{r}</li>)}
              </ul>
            </div>
          )}
          {data.customer_intent && (
            <div className="p-4 bg-slate-800/40 border border-slate-700/50 rounded-2xl">
              <p className="text-xs text-slate-500 mb-1">Customer Intent</p>
              <p className="text-sm text-slate-300">{data.customer_intent}</p>
            </div>
          )}
          <RunButton label="Re-run" icon={BarChart2} onClick={run} loading={loading} />
        </>
      )}
    </div>
  );
}

// ── Pricing View ──────────────────────────────────────────────────────────────

function PricingView({ projectId }) {
  const [form, setForm] = useState({
    license_cost: 50000, service_day_rate: 1200,
    effort_days_low: 30, effort_days_base: 45, effort_days_high: 60,
    risk_buffer_percent: 15,
  });
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const run = async () => {
    setLoading(true); setError(null);
    try { setData(await api.calcPricing(projectId, form)); }
    catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  const fmt = n => new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { key: 'license_cost',       label: 'License Cost (€)' },
          { key: 'service_day_rate',   label: 'Day Rate (€)' },
          { key: 'effort_days_low',    label: 'Effort Days – Low' },
          { key: 'effort_days_base',   label: 'Effort Days – Base' },
          { key: 'effort_days_high',   label: 'Effort Days – High' },
          { key: 'risk_buffer_percent',label: 'Risk Buffer (%)' },
        ].map(({ key, label }) => (
          <div key={key}>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">{label}</label>
            <input
              type="number"
              value={form[key]}
              onChange={e => setForm(prev => ({ ...prev, [key]: parseFloat(e.target.value) || 0 }))}
              className="w-full px-3 py-2.5 bg-slate-900/60 border border-slate-700/80 rounded-xl text-sm focus:border-violet-500/50 outline-none transition-all"
            />
          </div>
        ))}
      </div>

      <RunButton label="Calculate Pricing" icon={Euro} onClick={run} loading={loading} />

      {error && (
        <div className="flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-sm text-rose-300">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
        </div>
      )}

      {data && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(data.scenarios).map(([name, s]) => (
              <div key={name} className={`p-4 rounded-2xl border ${name === 'base' ? 'border-violet-500/50 bg-violet-500/10' : 'border-slate-700/50 bg-slate-800/40'}`}>
                <p className="text-xs font-medium text-slate-400 mb-3 uppercase tracking-wider">{name} scenario</p>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between"><span className="text-slate-400">Services</span><span className="text-slate-200">{fmt(s.service_cost)}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Total</span><span className="text-slate-200">{fmt(s.total)}</span></div>
                  <div className="flex justify-between font-semibold border-t border-slate-700 pt-1 mt-1"><span className="text-slate-300">With Buffer</span><span className={name === 'base' ? 'text-violet-300' : 'text-slate-100'}>{fmt(s.with_buffer)}</span></div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
            <p className="text-xs font-medium text-amber-300 mb-1">{data.margin_indicator}</p>
            <ul className="space-y-1">
              {data.assumptions.map((a, i) => <li key={i} className="text-xs text-slate-400 flex gap-2"><span className="text-amber-500">•</span>{a}</li>)}
            </ul>
          </div>
          <p className="text-xs text-slate-600 text-center">{data.disclaimer}</p>
        </div>
      )}
    </div>
  );
}

// ── Main AnalysisPanel ────────────────────────────────────────────────────────

const TABS = [
  { id: 'chat',    label: 'Q&A Chat',   icon: MessageSquare },
  { id: 'gaps',    label: 'Gaps',       icon: AlertTriangle },
  { id: 'risks',   label: 'Risks',      icon: TrendingUp    },
  { id: 'sow',     label: 'SOW Draft',  icon: FileText      },
  { id: 'summary', label: 'Summary',    icon: BarChart2     },
  { id: 'pricing', label: 'Pricing',    icon: Euro          },
];

export default function AnalysisPanel({ projectId, projectName }) {
  const [activeTab, setActiveTab] = useState('chat');

  return (
    <div className="mb-8 p-6 rounded-3xl bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-slate-700/50 backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-xl bg-violet-500/10 flex items-center justify-center">
          <BarChart2 className="w-5 h-5 text-violet-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">AI Analysis</h2>
          <p className="text-sm text-slate-500">{projectName}</p>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 mb-6 p-1 bg-slate-900/50 rounded-xl overflow-x-auto">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === id
                ? 'bg-violet-600/30 text-violet-300 border border-violet-500/40'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'chat'    && <ChatView    projectId={projectId} />}
      {activeTab === 'gaps'    && <GapsView    projectId={projectId} />}
      {activeTab === 'risks'   && <RisksView   projectId={projectId} />}
      {activeTab === 'sow'     && <SowView     projectId={projectId} />}
      {activeTab === 'summary' && <SummaryView projectId={projectId} />}
      {activeTab === 'pricing' && <PricingView projectId={projectId} />}
    </div>
  );
}
