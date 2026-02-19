import React, { useState } from 'react';
import { Upload, X, Loader2, Sparkles, CheckCheck, CheckCircle, AlertCircle, Info, CheckSquare } from 'lucide-react';
import { generateAIExplanation } from '../utils/aiExplanations';

export default function RFPUploader({ opportunityInfo, onAnalysisComplete }) {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [analysisStatus, setAnalysisStatus] = useState('idle');
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisResults, setAnalysisResults] = useState(null);

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(Array.from(e.dataTransfer.files));
  };

  const handleFileSelect = (e) => addFiles(Array.from(e.target.files));

  const addFiles = (newFiles) => {
    const validFiles = newFiles.filter(file => 
      file.name.match(/\.(pdf|doc|docx|xls|xlsx)$/i)
    );
    setFiles(prev => [...prev, ...validFiles.map(file => ({
      file, id: Math.random().toString(36).substr(2, 9), name: file.name, size: file.size
    }))]);
  };

  const removeFile = (id) => setFiles(prev => prev.filter(f => f.id !== id));

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getFileIcon = (name) => {
    if (name.endsWith('.pdf')) return '📄';
    if (name.match(/\.docx?$/)) return '📝';
    if (name.match(/\.xlsx?$/)) return '📊';
    return '📎';
  };

  const simulateAnalysis = () => {
    if (files.length === 0) return;
    
    setAnalysisStatus('uploading');
    setAnalysisProgress(0);

    const uploadInterval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 30) { clearInterval(uploadInterval); return 30; }
        return prev + 5;
      });
    }, 100);

    setTimeout(() => {
      setAnalysisStatus('analyzing');
      const analyzeInterval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 100) { clearInterval(analyzeInterval); return 100; }
          return prev + 2;
        });
      }, 80);
    }, 700);

    setTimeout(() => {
      setAnalysisStatus('complete');
      
      const results = {
        documentsAnalyzed: files.length,
        pagesProcessed: Math.floor(Math.random() * 50) + 20,
        extractedRequirements: Math.floor(Math.random() * 30) + 15,
        keyFindings: [
          { type: 'info', text: 'RFP deadline identified: 4 weeks from submission' },
          { type: 'warning', text: 'Requires ISO 27001 certification - verification needed' },
          { type: 'success', text: 'Service scope matches SWO portfolio (92% alignment)' },
          { type: 'warning', text: 'Public sector tender - ANÜ compliance check recommended' },
          { type: 'info', text: 'Budget indication found: €400K-500K range' },
        ],
        suggestedAnswers: {
          portfolioAlignment: {
            answer: 'yes',
            sources: [
              { document: files[0]?.name || 'RFP.pdf', page: 12, quote: 'The scope of services shall include cloud migration, Microsoft 365 implementation, and ongoing managed services support.', context: 'Section 3.2 - Scope of Services', relevance: 5, confidence: 'high' },
              { document: files[0]?.name || 'RFP.pdf', page: 15, quote: 'Preferred technologies include Microsoft Azure, M365 suite, and modern workplace solutions.', context: 'Section 4.1 - Technical Requirements', relevance: 4, confidence: 'high' }
            ]
          },
          noWorkerLeasing: {
            answer: 'partial',
            sources: [
              { document: files[0]?.name || 'RFP.pdf', page: 8, quote: 'The contractor shall provide dedicated resources to work on-site at customer premises under customer supervision.', context: 'Section 2.4 - Resource Requirements', relevance: 5, confidence: 'medium' }
            ]
          },
          certificationsObtainable: {
            answer: 'partial',
            sources: [
              { document: files[0]?.name || 'RFP.pdf', page: 22, quote: 'Bidders must demonstrate ISO 27001 certification and provide evidence of at least 5 Microsoft certified professionals.', context: 'Section 6.1 - Mandatory Requirements', relevance: 5, confidence: 'high' }
            ]
          },
          deadlineAchievable: {
            answer: 'yes',
            sources: [
              { document: files[0]?.name || 'RFP.pdf', page: 3, quote: 'Proposals must be submitted no later than March 15, 2026. Project kickoff anticipated for Q2 2026.', context: 'Section 1.3 - Timeline', relevance: 5, confidence: 'high' }
            ]
          },
          requirementsDeliverable: {
            answer: 'yes',
            sources: [
              { document: files[0]?.name || 'RFP.pdf', page: 14, quote: 'Required services include: tenant setup, data migration, user training, and 12-month hypercare support.', context: 'Section 3.5 - Deliverables', relevance: 4, confidence: 'high' }
            ]
          },
          informationComplete: {
            answer: 'partial',
            sources: [
              { document: files[0]?.name || 'RFP.pdf', page: 28, quote: 'Detailed technical specifications will be provided to shortlisted vendors.', context: 'Section 7.2 - Additional Information', relevance: 3, confidence: 'medium' }
            ]
          }
        }
      };
      
      setAnalysisResults(results);

      const answers = {};
      const explanations = {};
      const evidenceData = {};
      
      Object.entries(results.suggestedAnswers).forEach(([fieldId, data]) => {
        answers[fieldId] = data.answer;
        explanations[fieldId] = generateAIExplanation(fieldId, data.answer, opportunityInfo.customer || 'the customer');
        evidenceData[fieldId] = { fieldId, suggestedAnswer: data.answer, sources: data.sources, explanation: explanations[fieldId] };
      });

      onAnalysisComplete?.({ answers, explanations, evidence: evidenceData });
    }, 4000);
  };

  const resetAnalysis = () => {
    setAnalysisStatus('idle');
    setAnalysisProgress(0);
    setAnalysisResults(null);
  };

  return (
    <div>
      {analysisStatus === 'idle' && (
        <>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
              isDragging ? 'border-violet-500 bg-violet-500/10' : 'border-slate-700 hover:border-slate-600 hover:bg-slate-800/30'
            }`}
          >
            <input type="file" multiple accept=".pdf,.doc,.docx,.xls,.xlsx" onChange={handleFileSelect} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            <div className="flex flex-col items-center gap-3">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${isDragging ? 'bg-violet-500/20' : 'bg-slate-800'}`}>
                <Upload className={`w-7 h-7 ${isDragging ? 'text-violet-400' : 'text-slate-400'}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-200">{isDragging ? 'Drop files here' : 'Drag & drop RFP documents'}</p>
                <p className="text-xs text-slate-500 mt-1">or click to browse • PDF, Word, Excel</p>
              </div>
            </div>
          </div>

          {files.length > 0 && (
            <div className="mt-4 space-y-2">
              {files.map(file => (
                <div key={file.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{getFileIcon(file.name)}</span>
                    <div>
                      <p className="text-sm font-medium text-slate-200 truncate max-w-xs">{file.name}</p>
                      <p className="text-xs text-slate-500">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <button onClick={() => removeFile(file.id)} className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-rose-400">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              
              <button onClick={simulateAnalysis} className="w-full mt-4 flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 rounded-xl text-sm font-semibold shadow-lg shadow-violet-500/25">
                <Sparkles className="w-5 h-5" />
                Analyze {files.length} Document{files.length !== 1 ? 's' : ''} with AI
              </button>
            </div>
          )}
        </>
      )}

      {(analysisStatus === 'uploading' || analysisStatus === 'analyzing') && (
        <div className="p-6 bg-slate-800/30 rounded-2xl border border-slate-700/50">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-violet-400 animate-spin" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-200">
                {analysisStatus === 'uploading' ? 'Uploading documents...' : 'Analyzing RFP content...'}
              </p>
              <p className="text-xs text-slate-500">
                {analysisStatus === 'uploading' ? 'Preparing files' : 'Extracting requirements, identifying risks'}
              </p>
            </div>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full transition-all duration-300" style={{ width: `${analysisProgress}%` }} />
          </div>
          <p className="text-xs text-slate-500 mt-2 text-right">{analysisProgress}%</p>
        </div>
      )}

      {analysisStatus === 'complete' && analysisResults && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-slate-800/30 rounded-xl border border-slate-700/50 text-center">
              <p className="text-2xl font-bold text-violet-400">{analysisResults.documentsAnalyzed}</p>
              <p className="text-xs text-slate-500 mt-1">Documents</p>
            </div>
            <div className="p-4 bg-slate-800/30 rounded-xl border border-slate-700/50 text-center">
              <p className="text-2xl font-bold text-cyan-400">{analysisResults.pagesProcessed}</p>
              <p className="text-xs text-slate-500 mt-1">Pages</p>
            </div>
            <div className="p-4 bg-slate-800/30 rounded-xl border border-slate-700/50 text-center">
              <p className="text-2xl font-bold text-emerald-400">{analysisResults.extractedRequirements}</p>
              <p className="text-xs text-slate-500 mt-1">Requirements</p>
            </div>
          </div>

          <div className="p-4 bg-slate-800/30 rounded-2xl border border-slate-700/50">
            <div className="flex items-center gap-2 mb-3">
              <CheckCheck className="w-5 h-5 text-emerald-400" />
              <h4 className="text-sm font-medium text-slate-200">Key Findings</h4>
            </div>
            <div className="space-y-2">
              {analysisResults.keyFindings.map((finding, idx) => (
                <div key={idx} className={`flex items-start gap-2 p-2 rounded-lg text-sm ${
                  finding.type === 'success' ? 'bg-emerald-500/10 text-emerald-300' :
                  finding.type === 'warning' ? 'bg-amber-500/10 text-amber-300' : 'bg-slate-700/30 text-slate-300'
                }`}>
                  {finding.type === 'success' ? <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" /> :
                   finding.type === 'warning' ? <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" /> :
                   <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />}
                  <span>{finding.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
            <div className="flex items-center gap-3">
              <CheckSquare className="w-5 h-5 text-emerald-400" />
              <div>
                <p className="text-sm font-medium text-emerald-300">{Object.keys(analysisResults.suggestedAnswers).length} criteria auto-evaluated</p>
                <p className="text-xs text-emerald-400/70">Click "Review Evidence" on each criterion to verify</p>
              </div>
            </div>
            <button onClick={resetAnalysis} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-slate-300">
              Upload More
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
