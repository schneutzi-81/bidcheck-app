import React, { useState } from 'react';
import { X, FileSearch, Quote, BookOpen, ExternalLink, Highlighter, ThumbsUp, ThumbsDown, MessageSquare, FileText } from 'lucide-react';

export default function EvidencePanel({ isOpen, onClose, evidence, onConfirm, onReject }) {
  const [activeTab, setActiveTab] = useState('evidence');
  const [userComment, setUserComment] = useState('');

  if (!isOpen || !evidence) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative ml-auto w-full max-w-2xl h-full bg-[#0d1320] border-l border-slate-700/50 shadow-2xl flex flex-col animate-slide-in">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700/50 bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
              <FileSearch className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-100">Evidence Review</h3>
              <p className="text-xs text-slate-500">Verify AI findings in source document</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-4 bg-slate-800/30 border-b border-slate-700/50">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs text-slate-500 mb-1">Criterion</p>
              <p className="font-medium text-slate-200">{evidence.criterionLabel}</p>
            </div>
            <div className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
              evidence.suggestedAnswer === 'yes' ? 'bg-emerald-500/20 text-emerald-300' :
              evidence.suggestedAnswer === 'partial' ? 'bg-amber-500/20 text-amber-300' :
              evidence.suggestedAnswer === 'no' ? 'bg-rose-500/20 text-rose-300' :
              'bg-slate-500/20 text-slate-300'
            }`}>
              AI Suggests: {evidence.suggestedAnswer?.charAt(0).toUpperCase() + evidence.suggestedAnswer?.slice(1)}
            </div>
          </div>
          <p className="text-sm text-slate-400 mt-2">{evidence.explanation}</p>
        </div>

        <div className="flex border-b border-slate-700/50">
          <button
            onClick={() => setActiveTab('evidence')}
            className={`flex-1 px-4 py-3 text-sm font-medium ${
              activeTab === 'evidence' ? 'text-violet-300 border-b-2 border-violet-500 bg-violet-500/5' : 'text-slate-400'
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <Quote className="w-4 h-4" />
              Source Evidence ({evidence.sources?.length || 0})
            </span>
          </button>
          <button
            onClick={() => setActiveTab('document')}
            className={`flex-1 px-4 py-3 text-sm font-medium ${
              activeTab === 'document' ? 'text-violet-300 border-b-2 border-violet-500 bg-violet-500/5' : 'text-slate-400'
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <BookOpen className="w-4 h-4" />
              Document Preview
            </span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {activeTab === 'evidence' && (
            <div className="p-6 space-y-4">
              {evidence.sources?.map((source, idx) => (
                <div key={idx} className="p-4 bg-slate-800/40 rounded-xl border border-slate-700/50">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-violet-500/20 text-violet-300 text-xs font-medium rounded">
                        Source {idx + 1}
                      </span>
                      <span className="text-xs text-slate-500">{source.document} • Page {source.page}</span>
                    </div>
                    <button className="flex items-center gap-1 px-2 py-1 text-xs text-slate-400 hover:text-cyan-300 hover:bg-cyan-500/10 rounded">
                      <ExternalLink className="w-3 h-3" />
                      Jump to page
                    </button>
                  </div>
                  
                  <div className="relative pl-4 border-l-2 border-violet-500/50">
                    <Highlighter className="absolute -left-2.5 top-0 w-5 h-5 text-violet-400 bg-[#0d1320] p-0.5" />
                    <p className="text-sm text-slate-300 leading-relaxed italic">"{source.quote}"</p>
                  </div>
                  
                  <div className="mt-3 p-3 bg-slate-900/50 rounded-lg">
                    <p className="text-xs text-slate-500 mb-1">Section Context</p>
                    <p className="text-xs text-slate-400">{source.context}</p>
                  </div>
                  
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">Relevance:</span>
                      <div className="flex gap-0.5">
                        {[1,2,3,4,5].map(i => (
                          <div key={i} className={`w-2 h-2 rounded-full ${i <= source.relevance ? 'bg-violet-500' : 'bg-slate-700'}`} />
                        ))}
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      source.confidence === 'high' ? 'bg-emerald-500/20 text-emerald-400' :
                      source.confidence === 'medium' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-500/20 text-slate-400'
                    }`}>
                      {source.confidence} confidence
                    </span>
                  </div>
                </div>
              ))}
              
              {(!evidence.sources || evidence.sources.length === 0) && (
                <div className="text-center py-8">
                  <FileSearch className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-sm text-slate-500">No direct quotes found</p>
                  <p className="text-xs text-slate-600 mt-1">AI assessment based on overall document analysis</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'document' && (
            <div className="p-6">
              <div className="bg-slate-900 rounded-xl border border-slate-700/50 overflow-hidden">
                <div className="px-4 py-3 bg-slate-800/50 border-b border-slate-700/50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-300">{evidence.sources?.[0]?.document || 'RFP Document'}</span>
                  </div>
                  <span className="text-xs text-slate-500">Page {evidence.sources?.[0]?.page || 1}</span>
                </div>
                <div className="p-6 max-h-80 overflow-y-auto">
                  <div className="text-sm text-slate-400 leading-relaxed space-y-4">
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    {evidence.sources?.[0] && (
                      <p className="bg-yellow-500/20 border-l-4 border-yellow-500 pl-3 py-2 text-slate-200">
                        {evidence.sources[0].quote}
                      </p>
                    )}
                    <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p>
                    {evidence.sources?.[1] && (
                      <p className="bg-yellow-500/20 border-l-4 border-yellow-500 pl-3 py-2 text-slate-200">
                        {evidence.sources[1].quote}
                      </p>
                    )}
                    <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.</p>
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-3 text-center">💡 Highlighted sections show extracted evidence</p>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-slate-700/50 bg-slate-900/30">
          <label className="block text-xs font-medium text-slate-400 mb-2">
            <MessageSquare className="w-3 h-3 inline mr-1" />
            Add your comment (optional)
          </label>
          <textarea
            value={userComment}
            onChange={(e) => setUserComment(e.target.value)}
            placeholder="Add notes about this evidence..."
            className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-sm text-slate-200 placeholder:text-slate-600 focus:border-violet-500/50 outline-none resize-none"
            rows={2}
          />
        </div>

        <div className="px-6 py-4 border-t border-slate-700/50 bg-slate-900/50">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onReject && onReject(evidence.fieldId, userComment)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 text-rose-300 rounded-xl text-sm font-medium"
            >
              <ThumbsDown className="w-4 h-4" />
              Reject AI Suggestion
            </button>
            <button
              onClick={() => onConfirm && onConfirm(evidence.fieldId, evidence.suggestedAnswer, userComment)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 rounded-xl text-sm font-semibold shadow-lg shadow-emerald-500/25"
            >
              <ThumbsUp className="w-4 h-4" />
              Confirm & Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
