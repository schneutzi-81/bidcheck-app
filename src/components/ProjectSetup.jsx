import React, { useState } from 'react';
import { Building2, FolderPlus, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { api } from '../api/client';

export default function ProjectSetup({ onProjectReady }) {
  const [customerName, setCustomerName] = useState('');
  const [projectName, setProjectName]   = useState('');
  const [language, setLanguage]         = useState('EN');
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState(null);

  const handleCreate = async () => {
    if (!customerName.trim() || !projectName.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const customer = await api.createCustomer(customerName.trim());
      const project  = await api.createProject(customer.id, projectName.trim(), language);
      onProjectReady({ customer, project });
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-8 p-6 rounded-3xl bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-slate-700/50 backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-xl bg-cyan-500/10 flex items-center justify-center">
          <FolderPlus className="w-5 h-5 text-cyan-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">Create Project</h2>
          <p className="text-sm text-slate-500">Set up a project to start uploading RFP documents</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Customer Name</label>
          <input
            value={customerName}
            onChange={e => setCustomerName(e.target.value)}
            placeholder="Acme Corp"
            className="w-full px-3 py-2.5 bg-slate-900/60 border border-slate-700/80 rounded-xl text-sm placeholder:text-slate-600 focus:border-cyan-500/50 outline-none transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Project / RFP Name</label>
          <input
            value={projectName}
            onChange={e => setProjectName(e.target.value)}
            placeholder="Cloud Migration RFP 2026"
            className="w-full px-3 py-2.5 bg-slate-900/60 border border-slate-700/80 rounded-xl text-sm placeholder:text-slate-600 focus:border-cyan-500/50 outline-none transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Language</label>
          <select
            value={language}
            onChange={e => setLanguage(e.target.value)}
            className="w-full px-3 py-2.5 bg-slate-900/60 border border-slate-700/80 rounded-xl text-sm focus:border-cyan-500/50 outline-none transition-all"
          >
            <option value="EN">English</option>
            <option value="DE">Deutsch</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="mt-4 flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-sm text-rose-300">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      <button
        onClick={handleCreate}
        disabled={loading || !customerName.trim() || !projectName.trim()}
        className="mt-4 flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-sm font-semibold transition-all shadow-lg shadow-cyan-500/20"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
        {loading ? 'Creating...' : 'Create Project'}
      </button>
    </div>
  );
}
