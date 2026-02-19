import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, XCircle, HelpCircle, ChevronRight, ChevronDown, Bot, User, Building2, Target, Briefcase, CheckSquare, FileText, TrendingUp, Zap, Download, Save, Send, Info, Sparkles, Database, Clock, Euro, Shield, Lightbulb, Edit3, RefreshCw, Upload, File, X, Loader2, CheckCheck, AlertCircle, BookOpen, ExternalLink, Quote, FileSearch, ChevronLeft, Highlighter, ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react';

// Evidence Reading Panel Component
function EvidencePanel({ isOpen, onClose, evidence, onConfirm, onReject }) {
  const [activeTab, setActiveTab] = useState('evidence');
  const [userComment, setUserComment] = useState('');

  if (!isOpen || !evidence) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      {/* Panel */}
      <div className="relative ml-auto w-full max-w-2xl h-full bg-[#0d1320] border-l border-slate-700/50 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
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
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Criterion Info */}
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
              AI Suggests: {evidence.suggestedAnswer.charAt(0).toUpperCase() + evidence.suggestedAnswer.slice(1)}
            </div>
          </div>
          <p className="text-sm text-slate-400 mt-2">{evidence.explanation}</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-700/50">
          <button
            onClick={() => setActiveTab('evidence')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-all ${
              activeTab === 'evidence' 
                ? 'text-violet-300 border-b-2 border-violet-500 bg-violet-500/5' 
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <Quote className="w-4 h-4" />
              Source Evidence ({evidence.sources?.length || 0})
            </span>
          </button>
          <button
            onClick={() => setActiveTab('document')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-all ${
              activeTab === 'document' 
                ? 'text-violet-300 border-b-2 border-violet-500 bg-violet-500/5' 
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <BookOpen className="w-4 h-4" />
              Document Preview
            </span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'evidence' && (
            <div className="p-6 space-y-4">
              {evidence.sources?.map((source, idx) => (
                <div key={idx} className="p-4 bg-slate-800/40 rounded-xl border border-slate-700/50">
                  {/* Source Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-violet-500/20 text-violet-300 text-xs font-medium rounded">
                        Source {idx + 1}
                      </span>
                      <span className="text-xs text-slate-500">
                        {source.document} • Page {source.page}
                      </span>
                    </div>
                    <button className="flex items-center gap-1 px-2 py-1 text-xs text-slate-400 hover:text-cyan-300 hover:bg-cyan-500/10 rounded transition-all">
                      <ExternalLink className="w-3 h-3" />
                      Jump to page
                    </button>
                  </div>
                  
                  {/* Quoted Text */}
                  <div className="relative pl-4 border-l-2 border-violet-500/50">
                    <Highlighter className="absolute -left-2.5 top-0 w-5 h-5 text-violet-400 bg-[#0d1320] p-0.5" />
                    <p className="text-sm text-slate-300 leading-relaxed italic">
                      "{source.quote}"
                    </p>
                  </div>
                  
                  {/* Context */}
                  <div className="mt-3 p-3 bg-slate-900/50 rounded-lg">
                    <p className="text-xs text-slate-500 mb-1">Section Context</p>
                    <p className="text-xs text-slate-400">{source.context}</p>
                  </div>
                  
                  {/* Relevance Score */}
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">Relevance:</span>
                      <div className="flex gap-0.5">
                        {[1,2,3,4,5].map(i => (
                          <div 
                            key={i} 
                            className={`w-2 h-2 rounded-full ${i <= source.relevance ? 'bg-violet-500' : 'bg-slate-700'}`} 
                          />
                        ))}
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      source.confidence === 'high' ? 'bg-emerald-500/20 text-emerald-400' :
                      source.confidence === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-slate-500/20 text-slate-400'
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
              {/* Simulated Document Preview */}
              <div className="bg-slate-900 rounded-xl border border-slate-700/50 overflow-hidden">
                <div className="px-4 py-3 bg-slate-800/50 border-b border-slate-700/50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-300">{evidence.sources?.[0]?.document || 'RFP Document'}</span>
                  </div>
                  <span className="text-xs text-slate-500">Page {evidence.sources?.[0]?.page || 1}</span>
                </div>
                <div className="p-6 max-h-80 overflow-y-auto">
                  {/* Simulated document content with highlighted sections */}
                  <div className="text-sm text-slate-400 leading-relaxed space-y-4">
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                    
                    {evidence.sources?.[0] && (
                      <p className="bg-yellow-500/20 border-l-4 border-yellow-500 pl-3 py-2 text-slate-200">
                        {evidence.sources[0].quote}
                      </p>
                    )}
                    
                    <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                    
                    {evidence.sources?.[1] && (
                      <p className="bg-yellow-500/20 border-l-4 border-yellow-500 pl-3 py-2 text-slate-200">
                        {evidence.sources[1].quote}
                      </p>
                    )}
                    
                    <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
                  </div>
                </div>
              </div>
              
              <p className="text-xs text-slate-500 mt-3 text-center">
                💡 Highlighted sections show extracted evidence relevant to this criterion
              </p>
            </div>
          )}
        </div>

        {/* Comment Section */}
        <div className="px-6 py-4 border-t border-slate-700/50 bg-slate-900/30">
          <label className="block text-xs font-medium text-slate-400 mb-2">
            <MessageSquare className="w-3 h-3 inline mr-1" />
            Add your comment (optional)
          </label>
          <textarea
            value={userComment}
            onChange={(e) => setUserComment(e.target.value)}
            placeholder="Add notes about this evidence..."
            className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-sm text-slate-200 placeholder:text-slate-600 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all resize-none"
            rows={2}
          />
        </div>

        {/* Actions */}
        <div className="px-6 py-4 border-t border-slate-700/50 bg-slate-900/50">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onReject && onReject(evidence.fieldId, userComment)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 text-rose-300 rounded-xl text-sm font-medium transition-all"
            >
              <ThumbsDown className="w-4 h-4" />
              Reject AI Suggestion
            </button>
            <button
              onClick={() => onConfirm && onConfirm(evidence.fieldId, evidence.suggestedAnswer, userComment)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-emerald-500/25"
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

// RFP Uploader Component
function RFPUploader({ opportunityInfo, onAnalysisComplete, onOpenEvidence }) {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [analysisStatus, setAnalysisStatus] = useState('idle'); // idle, uploading, analyzing, complete, error
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisResults, setAnalysisResults] = useState(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    addFiles(selectedFiles);
  };

  const addFiles = (newFiles) => {
    const validFiles = newFiles.filter(file => {
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
      return validTypes.includes(file.type) || file.name.endsWith('.pdf') || file.name.endsWith('.doc') || file.name.endsWith('.docx') || file.name.endsWith('.xls') || file.name.endsWith('.xlsx');
    });
    setFiles(prev => [...prev, ...validFiles.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type
    }))]);
  };

  const removeFile = (id) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getFileIcon = (fileName) => {
    if (fileName.endsWith('.pdf')) return '📄';
    if (fileName.endsWith('.doc') || fileName.endsWith('.docx')) return '📝';
    if (fileName.endsWith('.xls') || fileName.endsWith('.xlsx')) return '📊';
    return '📎';
  };

  const simulateAnalysis = () => {
    if (files.length === 0) return;
    
    setAnalysisStatus('uploading');
    setAnalysisProgress(0);

    // Simulate upload progress
    const uploadInterval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 30) {
          clearInterval(uploadInterval);
          return 30;
        }
        return prev + 5;
      });
    }, 100);

    // Simulate analysis phases
    setTimeout(() => {
      setAnalysisStatus('analyzing');
      const analyzeInterval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 100) {
            clearInterval(analyzeInterval);
            return 100;
          }
          return prev + 2;
        });
      }, 80);
    }, 700);

    // Complete analysis with simulated results
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
          { type: 'success', text: 'No competitor framework agreements detected in documents' }
        ],
        suggestedAnswers: {
          portfolioAlignment: {
            answer: 'yes',
            sources: [
              {
                document: files[0]?.name || 'RFP_Document.pdf',
                page: 12,
                quote: 'The scope of services shall include cloud migration, Microsoft 365 implementation, and ongoing managed services support.',
                context: 'Section 3.2 - Scope of Services',
                relevance: 5,
                confidence: 'high'
              },
              {
                document: files[0]?.name || 'RFP_Document.pdf',
                page: 15,
                quote: 'Preferred technologies include Microsoft Azure, M365 suite, and modern workplace solutions.',
                context: 'Section 4.1 - Technical Requirements',
                relevance: 4,
                confidence: 'high'
              }
            ]
          },
          noWorkerLeasing: {
            answer: 'partial',
            sources: [
              {
                document: files[0]?.name || 'RFP_Document.pdf',
                page: 8,
                quote: 'The contractor shall provide dedicated resources to work on-site at customer premises under customer supervision for the duration of the project.',
                context: 'Section 2.4 - Resource Requirements',
                relevance: 5,
                confidence: 'medium'
              }
            ]
          },
          certificationsObtainable: {
            answer: 'partial',
            sources: [
              {
                document: files[0]?.name || 'RFP_Document.pdf',
                page: 22,
                quote: 'Bidders must demonstrate ISO 27001 certification and provide evidence of at least 5 Microsoft certified professionals.',
                context: 'Section 6.1 - Mandatory Requirements',
                relevance: 5,
                confidence: 'high'
              }
            ]
          },
          deadlineAchievable: {
            answer: 'yes',
            sources: [
              {
                document: files[0]?.name || 'RFP_Document.pdf',
                page: 3,
                quote: 'Proposals must be submitted no later than March 15, 2026. Project kickoff anticipated for Q2 2026.',
                context: 'Section 1.3 - Timeline',
                relevance: 5,
                confidence: 'high'
              }
            ]
          },
          requirementsDeliverable: {
            answer: 'yes',
            sources: [
              {
                document: files[0]?.name || 'RFP_Document.pdf',
                page: 14,
                quote: 'Required services include: tenant setup, data migration, user training, and 12-month hypercare support.',
                context: 'Section 3.5 - Deliverables',
                relevance: 4,
                confidence: 'high'
              }
            ]
          },
          informationComplete: {
            answer: 'partial',
            sources: [
              {
                document: files[0]?.name || 'RFP_Document.pdf',
                page: 28,
                quote: 'Detailed technical specifications and current infrastructure documentation will be provided to shortlisted vendors.',
                context: 'Section 7.2 - Additional Information',
                relevance: 3,
                confidence: 'medium'
              }
            ]
          }
        }
      };
      
      setAnalysisResults(results);

      // Generate explanations for suggested answers
      const answers = {};
      const explanations = {};
      const evidenceData = {};
      
      Object.entries(results.suggestedAnswers).forEach(([fieldId, data]) => {
        answers[fieldId] = data.answer;
        explanations[fieldId] = generateAIExplanation(fieldId, data.answer, opportunityInfo.customer || 'the customer');
        evidenceData[fieldId] = {
          fieldId,
          suggestedAnswer: data.answer,
          sources: data.sources,
          explanation: explanations[fieldId]
        };
      });

      if (onAnalysisComplete) {
        onAnalysisComplete({
          answers,
          explanations,
          evidence: evidenceData
        });
      }
    }, 4000);
  };

  const resetAnalysis = () => {
    setAnalysisStatus('idle');
    setAnalysisProgress(0);
    setAnalysisResults(null);
  };

  return (
    <div>
      {/* Upload Area */}
      {analysisStatus === 'idle' && (
        <>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
              isDragging 
                ? 'border-violet-500 bg-violet-500/10' 
                : 'border-slate-700 hover:border-slate-600 hover:bg-slate-800/30'
            }`}
          >
            <input
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.xls,.xlsx"
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex flex-col items-center gap-3">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                isDragging ? 'bg-violet-500/20' : 'bg-slate-800'
              }`}>
                <Upload className={`w-7 h-7 ${isDragging ? 'text-violet-400' : 'text-slate-400'}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-200">
                  {isDragging ? 'Drop files here' : 'Drag & drop RFP documents'}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  or click to browse • PDF, Word, Excel supported
                </p>
              </div>
            </div>
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="mt-4 space-y-2">
              {files.map(file => (
                <div 
                  key={file.id}
                  className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl border border-slate-700/50"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{getFileIcon(file.name)}</span>
                    <div>
                      <p className="text-sm font-medium text-slate-200 truncate max-w-xs">{file.name}</p>
                      <p className="text-xs text-slate-500">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(file.id)}
                    className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-rose-400 transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              
              {/* Analyze Button */}
              <button
                onClick={simulateAnalysis}
                className="w-full mt-4 flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40"
              >
                <Sparkles className="w-5 h-5" />
                Analyze {files.length} Document{files.length !== 1 ? 's' : ''} with AI
              </button>
            </div>
          )}
        </>
      )}

      {/* Analysis Progress */}
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
                {analysisStatus === 'uploading' 
                  ? 'Preparing files for analysis' 
                  : 'Extracting requirements, identifying risks, matching to criteria'}
              </p>
            </div>
          </div>
          
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full transition-all duration-300"
              style={{ width: `${analysisProgress}%` }}
            />
          </div>
          <p className="text-xs text-slate-500 mt-2 text-right">{analysisProgress}%</p>
        </div>
      )}

      {/* Analysis Results */}
      {analysisStatus === 'complete' && analysisResults && (
        <div className="space-y-4">
          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-slate-800/30 rounded-xl border border-slate-700/50 text-center">
              <p className="text-2xl font-bold text-violet-400">{analysisResults.documentsAnalyzed}</p>
              <p className="text-xs text-slate-500 mt-1">Documents</p>
            </div>
            <div className="p-4 bg-slate-800/30 rounded-xl border border-slate-700/50 text-center">
              <p className="text-2xl font-bold text-cyan-400">{analysisResults.pagesProcessed}</p>
              <p className="text-xs text-slate-500 mt-1">Pages Analyzed</p>
            </div>
            <div className="p-4 bg-slate-800/30 rounded-xl border border-slate-700/50 text-center">
              <p className="text-2xl font-bold text-emerald-400">{analysisResults.extractedRequirements}</p>
              <p className="text-xs text-slate-500 mt-1">Requirements Found</p>
            </div>
          </div>

          {/* Key Findings */}
          <div className="p-4 bg-slate-800/30 rounded-2xl border border-slate-700/50">
            <div className="flex items-center gap-2 mb-3">
              <CheckCheck className="w-5 h-5 text-emerald-400" />
              <h4 className="text-sm font-medium text-slate-200">Key Findings from RFP Analysis</h4>
            </div>
            <div className="space-y-2">
              {analysisResults.keyFindings.map((finding, idx) => (
                <div 
                  key={idx}
                  className={`flex items-start gap-2 p-2 rounded-lg text-sm ${
                    finding.type === 'success' ? 'bg-emerald-500/10 text-emerald-300' :
                    finding.type === 'warning' ? 'bg-amber-500/10 text-amber-300' :
                    'bg-slate-700/30 text-slate-300'
                  }`}
                >
                  {finding.type === 'success' ? <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" /> :
                   finding.type === 'warning' ? <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" /> :
                   <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />}
                  <span>{finding.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Auto-filled notice with Review Button */}
          <div className="flex items-center justify-between p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
            <div className="flex items-center gap-3">
              <CheckSquare className="w-5 h-5 text-emerald-400" />
              <div>
                <p className="text-sm font-medium text-emerald-300">
                  {Object.keys(analysisResults.suggestedAnswers).length} criteria auto-evaluated
                </p>
                <p className="text-xs text-emerald-400/70">
                  Click "Review Evidence" on each criterion to verify sources
                </p>
              </div>
            </div>
            <button
              onClick={resetAnalysis}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-slate-300 transition-all"
            >
              Upload More
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const CATEGORY_WEIGHTS = {
  exclusion: 0,
  winProbability: 0.30,
  deliveryCapability: 0.25,
  commercialViability: 0.20,
  strategicAlignment: 0.15,
  proposalFeasibility: 0.10
};

const FIELDS = {
  exclusion: [
    { id: 'partnerCollision', label: 'No Partner Collision', description: 'No conflict with existing partner agreements (Kundenschutz, SubLAR)?', owner: 'Sales', aiSource: 'CRM/Contract DB', aiPotential: 'high' },
    { id: 'customerNotCompetitor', label: 'Customer is Not a Competitor', description: 'Customer does not compete with SWO services?', owner: 'Sales', aiSource: 'Market Intelligence', aiPotential: 'high' },
    { id: 'notPseudoTender', label: 'Not a Pseudo Tender', description: 'No indication that winner is already pre-selected?', owner: 'Sales', aiSource: 'RFP Analysis', aiPotential: 'medium' },
    { id: 'portfolioAlignment', label: 'Portfolio Alignment', description: 'Request fits within SWO service portfolio?', owner: 'Presales', aiSource: 'Service Catalog', aiPotential: 'high' },
    { id: 'certificationsObtainable', label: 'Certifications Obtainable', description: 'All required certifications are available or obtainable?', owner: 'Delivery', aiSource: 'HR/Cert Database', aiPotential: 'high' },
    { id: 'referencesAvailable', label: 'References Available', description: 'Required references can be provided?', owner: 'Delivery', aiSource: 'Project Database', aiPotential: 'high' },
    { id: 'noWorkerLeasing', label: 'No ANÜ Requirement', description: 'No illegal worker leasing (Arbeitnehmerüberlassung) required?', owner: 'Legal', aiSource: 'RFP NLP Scan', aiPotential: 'high' },
    { id: 'contractTermsAcceptable', label: 'Contract Terms Acceptable', description: 'No unacceptable contract terms or unlimited liability?', owner: 'Legal', aiSource: 'Contract AI', aiPotential: 'high' },
  ],
  winProbability: [
    { id: 'involvedInTenderCreation', label: 'Involved in Tender Creation', description: 'SWO was involved in shaping the RFP requirements?', owner: 'Sales', aiSource: 'Meeting History', aiPotential: 'high', weight: 3 },
    { id: 'existingContract', label: 'Existing Contract', description: 'Current active contract relationship exists?', owner: 'Sales', aiSource: 'CRM', aiPotential: 'high', weight: 2 },
    { id: 'existingServiceCustomer', label: 'Existing Service Customer', description: 'Already delivering professional services?', owner: 'Sales', aiSource: 'CRM', aiPotential: 'high', weight: 2 },
    { id: 'strongRelationship', label: 'Strong Relationship', description: 'Good quality relationship with customer stakeholders?', owner: 'Sales', aiSource: 'CRM Score', aiPotential: 'medium', weight: 2 },
    { id: 'decisionMakersKnown', label: 'Decision Makers Known', description: 'Key decision makers and buying center identified?', owner: 'Sales', aiSource: 'CRM', aiPotential: 'high', weight: 2 },
    { id: 'noCompetitorFramework', label: 'No Competitor Advantage', description: 'Competitors have no existing framework agreement?', owner: 'Sales', aiSource: 'Intel', aiPotential: 'medium', weight: 2 },
    { id: 'positiveWinHistory', label: 'Positive Win History', description: 'Good track record in previous tenders with this customer?', owner: 'Sales', aiSource: 'CRM Analytics', aiPotential: 'high', weight: 2 },
  ],
  deliveryCapability: [
    { id: 'technicalExpertise', label: 'Technical Expertise Available', description: 'Required technical know-how exists in the organization?', owner: 'Delivery', aiSource: 'Skills Matrix', aiPotential: 'high', weight: 3 },
    { id: 'resourceCapacity', label: 'Resource Capacity Available', description: 'Sufficient capacity for project delivery?', owner: 'Delivery', aiSource: 'Resource Planner', aiPotential: 'high', weight: 3 },
    { id: 'requirementsDeliverable', label: 'All Requirements Deliverable', description: 'Can meet all stated service requirements?', owner: 'Delivery', aiSource: 'RFP Matching', aiPotential: 'high', weight: 3 },
    { id: 'profilesAvailable', label: 'CVs/Profiles Available', description: 'Required consultant profiles can be provided?', owner: 'Delivery', aiSource: 'HR System', aiPotential: 'high', weight: 2 },
    { id: 'provenSolution', label: 'Proven Solution', description: 'Not a first-of-a-kind (FOAK) service?', owner: 'Delivery', aiSource: 'Service Catalog', aiPotential: 'high', weight: 2 },
    { id: 'risksAssessed', label: 'Risks Assessed', description: 'Delivery risks identified and evaluated?', owner: 'Presales', aiSource: 'RAID Template', aiPotential: 'high', weight: 2 },
  ],
  commercialViability: [
    { id: 'pricingAboveFloor', label: 'Pricing Above Floor', description: 'Day rates exceed minimum price list or approved?', owner: 'Finance', aiSource: 'Price List', aiPotential: 'high', weight: 3 },
    { id: 'marginAchievable', label: 'Target Margin Achievable', description: 'Can achieve required margin targets?', owner: 'Finance', aiSource: 'Cost Model', aiPotential: 'high', weight: 3 },
    { id: 'customerBudgetExists', label: 'Customer Budget Exists', description: 'Customer has confirmed or indicated budget?', owner: 'Sales', aiSource: 'Customer Intel', aiPotential: 'medium', weight: 2 },
    { id: 'customerCreditworthy', label: 'Customer Creditworthy', description: 'Customer financial health is acceptable?', owner: 'Finance', aiSource: 'Credit API', aiPotential: 'high', weight: 2 },
    { id: 'dealRegPossible', label: 'Deal Registration Possible', description: 'Can register deal with relevant vendors?', owner: 'Sales', aiSource: 'Partner Portals', aiPotential: 'high', weight: 1 },
  ],
  strategicAlignment: [
    { id: 'alignsWithVision', label: 'Aligns with SWO Vision', description: 'Fits strategic direction and target operating model?', owner: 'Sales Leader', aiSource: 'Strategy Docs', aiPotential: 'medium', weight: 3 },
    { id: 'targetSegment', label: 'Target Customer Segment', description: 'Customer is in focus segment?', owner: 'Sales', aiSource: 'Strategy', aiPotential: 'high', weight: 2 },
    { id: 'replicableSolution', label: 'Replicable/Multiplier Potential', description: 'Solution can be replicated for other customers?', owner: 'Presales', aiSource: 'Pattern Analysis', aiPotential: 'medium', weight: 2 },
  ],
  proposalFeasibility: [
    { id: 'effortJustified', label: 'Proposal Effort Justified', description: 'Investment in proposal preparation is justified?', owner: 'Presales', aiSource: 'Historical Benchmarks', aiPotential: 'medium', weight: 2 },
    { id: 'deadlineAchievable', label: 'Deadline Achievable', description: 'Can meet submission deadline with quality?', owner: 'Presales', aiSource: 'Workload Analysis', aiPotential: 'high', weight: 3 },
    { id: 'teamCapacityExists', label: 'Team Capacity Exists', description: 'Bid team has bandwidth for proposal work?', owner: 'Presales', aiSource: 'Resource Calendar', aiPotential: 'high', weight: 2 },
    { id: 'informationComplete', label: 'Information Complete', description: 'All required information is available?', owner: 'Presales', aiSource: 'Checklist AI', aiPotential: 'high', weight: 2 },
  ]
};

// AI explanation templates based on answer and field
const generateAIExplanation = (fieldId, answer, customerName) => {
  const customer = customerName || 'the customer';
  const explanations = {
    // Exclusion
    partnerCollision: {
      yes: `No partner conflicts found. Checked AX system and contract database - no active Kundenschutz or SubLAR agreements exist for ${customer}.`,
      partial: `Potential overlap detected. Found existing partner activity with ${customer} in adjacent service area. Recommend verification with Partner Management.`,
      no: `Partner conflict identified. Active SubLAR agreement exists with Bechtle for ${customer} covering similar service scope. Escalation required.`,
      unknown: `Unable to verify partner status. CRM data incomplete for ${customer}. Manual check with Partner Management recommended.`
    },
    customerNotCompetitor: {
      yes: `${customer} operates in manufacturing sector - no overlap with SWO service portfolio. Company classification: End Customer.`,
      partial: `${customer} has IT consulting subsidiary. Main business non-competing, but subsidiary offers some overlapping services.`,
      no: `${customer} identified as competitor. Company offers managed services and software asset management in DACH region.`,
      unknown: `Insufficient data to classify ${customer}. Recommend market intelligence review.`
    },
    notPseudoTender: {
      yes: `RFP analysis shows balanced requirements. Timeline reasonable (6 weeks). No vendor-specific language detected. Open competitive process likely.`,
      partial: `Some concerning indicators: Very specific technical requirements match one vendor profile. However, timeline is reasonable.`,
      no: `High pseudo-tender risk. RFP contains vendor-specific terminology, unrealistic 2-week timeline, and pre-existing relationship with competitor visible in requirements.`,
      unknown: `Insufficient information to assess. Recommend customer conversation to understand tender background.`
    },
    portfolioAlignment: {
      yes: `Requirements map 95% to existing service catalog. Core services: Cloud Migration, M365 Implementation, Managed Services - all standard offerings.`,
      partial: `70% alignment with portfolio. Gap identified: Customer requires specialized SAP integration not currently in standard offering.`,
      no: `Low portfolio fit. Customer requires hardware deployment and on-site data center services - outside SWO service scope.`,
      unknown: `RFP requirements unclear. Recommend clarification workshop with customer.`
    },
    certificationsObtainable: {
      yes: `All required certifications available. Found: 12 Azure Solutions Architects, 8 M365 certified consultants, ISO 27001 company certification valid until 2027.`,
      partial: `Most certifications covered. Gap: Customer requires 2x AWS Professional certified - currently have 1, second consultant in certification process (completion: 4 weeks).`,
      no: `Critical certification gap. Customer requires TISAX Level 3 - current certification only Level 2. Upgrade timeline: 6+ months.`,
      unknown: `Certification requirements not fully specified in RFP. Recommend clarification.`
    },
    referencesAvailable: {
      yes: `Matching references found: 3 projects in same industry (manufacturing), similar scope (€300K-500K), completed within last 24 months. Reference contacts available.`,
      partial: `Partial match. Found 2 relevant references but customer requires 3. Third reference from adjacent industry available.`,
      no: `Reference gap. Customer requires public sector references from last 12 months - no matching projects in database.`,
      unknown: `Reference requirements need clarification. Industry and volume thresholds not specified.`
    },
    noWorkerLeasing: {
      yes: `RFP analysis complete. No ANÜ indicators found. Project structure based on work packages with defined deliverables - compliant service contract model.`,
      partial: `Some borderline clauses detected. Section 4.3 mentions "resource provision" - recommend legal review to ensure Werkvertrag compliance.`,
      no: `ANÜ risk identified. RFP explicitly requires "staff augmentation" and "time & materials under customer direction" - classic ANÜ indicators.`,
      unknown: `Contract model unclear from RFP. Legal review recommended before proceeding.`
    },
    contractTermsAcceptable: {
      yes: `Contract terms reviewed. Standard liability caps, reasonable SLA penalties, acceptable IP clauses. No unlimited liability requirements.`,
      partial: `Most terms acceptable. Concern: Penalty clause in Section 8 exceeds standard thresholds (15% vs. our max 10%). Negotiation needed.`,
      no: `Unacceptable terms. Contract requires unlimited liability for data breaches and 24-month post-contract non-compete. Outside risk appetite.`,
      unknown: `Contract terms not yet available. Standard terms assumed - to be verified when documents received.`
    },
    // Win Probability
    involvedInTenderCreation: {
      yes: `Active involvement confirmed. 4 workshops held with ${customer} over past 6 months. Requirements shaped based on SWO recommendations. Strong incumbent position.`,
      partial: `Limited involvement. Participated in 1 information session but not in detailed requirements definition.`,
      no: `No prior involvement. RFP received cold via procurement portal. No advance notice or consultation.`,
      unknown: `Unable to verify. Checking with account team for historical engagement records.`
    },
    existingContract: {
      yes: `Active contract found. Current agreement: Software Asset Management (SAM) - €120K/year, valid until Dec 2027. Relationship since 2019.`,
      partial: `Historical contract only. Previous engagement ended 18 months ago. No current active agreement.`,
      no: `No contract history. ${customer} is a new prospect with no previous commercial relationship.`,
      unknown: `CRM data incomplete. Account team to verify contract status.`
    },
    existingServiceCustomer: {
      yes: `Active services customer. Currently delivering: M365 Support (3 FTE), Monthly platform reviews. Customer satisfaction score: 4.5/5.`,
      partial: `Software customer only. Purchasing licenses through SWO but no professional services engagement to date.`,
      no: `No existing services. ${customer} not in current customer base for professional services.`,
      unknown: `Service delivery status to be confirmed with delivery team.`
    },
    strongRelationship: {
      yes: `Strong relationships at multiple levels. Regular contact with CIO (monthly), IT Director (weekly), Procurement lead (quarterly). NPS score: 72.`,
      partial: `Relationship at operational level only. Good contact with IT team but no executive sponsorship established.`,
      no: `Limited relationship. Only transactional contact through procurement. No strategic relationships.`,
      unknown: `Relationship strength to be assessed. Account plan review needed.`
    },
    decisionMakersKnown: {
      yes: `Buying center mapped. Decision maker: CIO Thomas Weber. Influencers: IT Director (technical), CFO (budget), Procurement (process). All contacts in CRM.`,
      partial: `Partial visibility. Know IT Director and Procurement. Decision maker level unclear - likely CIO or COO.`,
      no: `Buying center unknown. RFP received through portal with no named contacts. Discovery needed.`,
      unknown: `Stakeholder mapping incomplete. Recommend LinkedIn research and network check.`
    },
    noCompetitorFramework: {
      yes: `No competitor frameworks identified. ${customer} currently uses multiple vendors without strategic agreements. Open market.`,
      partial: `Partial competitor presence. Accenture has framework for consulting but not for specific services in scope.`,
      no: `Competitor framework exists. T-Systems has 3-year strategic agreement with ${customer} covering IT services. Significant disadvantage.`,
      unknown: `Competitor landscape unclear. Market intelligence to be gathered.`
    },
    positiveWinHistory: {
      yes: `Strong track record. Won 4 of last 5 competitive situations with ${customer}. Last loss was 3 years ago on price.`,
      partial: `Mixed history. Won 2, lost 2 in past engagements. Losses primarily due to pricing and missing references.`,
      no: `Poor win history. Lost last 3 bids with ${customer}. Primary reasons: price and competitor relationships.`,
      unknown: `No historical bid data available for ${customer}. New prospect or data gap.`
    },
    // Delivery Capability
    technicalExpertise: {
      yes: `Full expertise coverage. Skills matrix shows: 15 Azure architects, 8 DevOps engineers, 12 M365 specialists. All required competencies available.`,
      partial: `Core expertise available. Gap in specialized area: Kubernetes (need 3, have 1). Can upskill or subcontract.`,
      no: `Significant expertise gap. Customer requires SAP S/4HANA skills - not a current SWO competency area.`,
      unknown: `Skills requirements to be mapped against RFP. Detailed analysis pending.`
    },
    resourceCapacity: {
      yes: `Capacity available. Resource planner shows: 8 consultants available for Q2 start. Buffer of 2 FTE for contingency.`,
      partial: `Tight capacity. Can staff core team but bench is limited. Risk if scope increases or timeline shifts.`,
      no: `Capacity constraint. Required resources (6 senior consultants) not available until Q3. Project start Q1.`,
      unknown: `Capacity check pending. Resource planning team to confirm availability for proposed timeline.`
    },
    requirementsDeliverable: {
      yes: `All 47 RFP requirements analyzed. 100% coverage with standard service offerings. No gaps identified.`,
      partial: `89% requirements coverage. Gaps: 24/7 support (currently 18/7), on-site presence (remote-first model). Mitigation possible.`,
      no: `Critical gaps. Cannot meet: physical data center operations, proprietary hardware support requirements.`,
      unknown: `Requirements analysis in progress. Full mapping to be completed before go/no-go.`
    },
    profilesAvailable: {
      yes: `All requested profiles available. Can provide: 2x Senior Architects, 4x Consultants, 1x Project Manager. CVs ready for submission.`,
      partial: `Most profiles covered. Need to source 1x Security Specialist externally or from partner network.`,
      no: `Profile gap. Customer requires German language C2 level for all consultants - only 60% of proposed team qualifies.`,
      unknown: `Profile requirements to be matched. HR team preparing availability overview.`
    },
    provenSolution: {
      yes: `Proven solution. Delivered 12 similar projects in last 24 months. Reusable assets: architecture templates, migration scripts, training materials.`,
      partial: `Mostly proven. Core solution delivered before, but customer-specific integration is new (SAP connector).`,
      no: `First of a kind (FOAK). No previous delivery of this solution type. Higher risk and learning curve expected.`,
      unknown: `Solution novelty to be assessed. Checking project database for similar engagements.`
    },
    risksAssessed: {
      yes: `Risk assessment complete. RAID log created with 8 risks identified, all with mitigation plans. Top risk: timeline (mitigation: parallel workstreams).`,
      partial: `Initial risk assessment done. Key risks identified but mitigation plans not yet fully developed.`,
      no: `Risk assessment pending. Cannot evaluate delivery risks until requirements are fully understood.`,
      unknown: `Risk assessment to be completed as part of solution design phase.`
    },
    // Commercial
    pricingAboveFloor: {
      yes: `Pricing validated. Proposed day rates: Senior €1,200 (floor: €1,050), Consultant €950 (floor: €850). All above minimum.`,
      partial: `Most rates acceptable. Junior rate at floor level - limited margin. Senior rates healthy.`,
      no: `Below floor. Customer budget implies €800/day - below minimum €850. Management approval needed for exception.`,
      unknown: `Pricing validation pending. Cost model to be built based on final scope.`
    },
    marginAchievable: {
      yes: `Target margin achievable. Calculated MaS: 28% (target: 25%). Healthy buffer for negotiation.`,
      partial: `Margin at target level. Calculated MaS: 25.5% - minimal buffer. Limited negotiation flexibility.`,
      no: `Below margin target. Calculated MaS: 18% (target: 25%). Would require scope reduction or price increase.`,
      unknown: `Margin calculation pending final pricing and resource mix determination.`
    },
    customerBudgetExists: {
      yes: `Budget confirmed. Customer indicated €450K budget allocation for FY2026. Aligns with our estimate of €420K.`,
      partial: `Budget indicated but not confirmed. Customer mentioned "around €400K" but formal approval pending.`,
      no: `No budget. Customer in early exploration phase. Budget request not yet submitted internally.`,
      unknown: `Budget status unknown. Recommend qualification call to understand funding situation.`
    },
    customerCreditworthy: {
      yes: `Credit check passed. ${customer}: Creditreform rating "very good" (1.8). Revenue €500M, stable financials.`,
      partial: `Moderate credit. Rating "satisfactory" (2.5). Payment terms: recommend milestone-based invoicing.`,
      no: `Credit concern. Rating "weak" (3.8). Recent losses reported. Recommend upfront payment or bank guarantee.`,
      unknown: `Credit check pending. Creditreform query submitted.`
    },
    dealRegPossible: {
      yes: `Deal registration confirmed. Microsoft deal reg approved - 15% discount secured. AWS registration pending (expected approval).`,
      partial: `Partial registration. Microsoft approved, but VMware declined due to existing partner registration.`,
      no: `Registration blocked. Competitor has existing deal registration with all relevant vendors.`,
      unknown: `Deal registration status to be checked with partner management.`
    },
    // Strategic
    alignsWithVision: {
      yes: `Strong strategic fit. Project supports Digital Workplace pillar of SWO strategy. Aligns with "Cloud-First" target operating model.`,
      partial: `Partial alignment. Core services fit strategy, but legacy infrastructure component not in strategic focus.`,
      no: `Limited strategic value. Project is pure body-leasing without solution component - not aligned with value-add strategy.`,
      unknown: `Strategic alignment to be assessed with leadership.`
    },
    targetSegment: {
      yes: `Target segment confirmed. ${customer} is Manufacturing sector, €500M+ revenue - core focus segment for DACH.`,
      partial: `Adjacent segment. Customer is mid-market (€100M) - secondary focus, not primary target.`,
      no: `Non-focus segment. Customer is public sector - not in current strategic focus for services growth.`,
      unknown: `Segment classification to be verified against current strategy.`
    },
    replicableSolution: {
      yes: `High replication potential. Solution applicable to 15+ customers in pipeline. Creating reusable IP and accelerators.`,
      partial: `Some replication possible. Core components reusable, but significant customization per customer needed.`,
      no: `One-off solution. Highly customer-specific with no replication potential. Pure project delivery.`,
      unknown: `Replication potential to be assessed during solution design.`
    },
    // Proposal Feasibility
    effortJustified: {
      yes: `Effort justified. TCV €450K with 35% win probability = €157K expected value. Proposal effort ~40h (€6K) - strong ROI.`,
      partial: `Borderline justification. Lower win probability (20%) reduces expected value. Consider lighter proposal approach.`,
      no: `Effort not justified. Low TCV (€80K) combined with low win chance (15%) - expected value below proposal cost.`,
      unknown: `ROI calculation pending win probability assessment.`
    },
    deadlineAchievable: {
      yes: `Timeline achievable. 4 weeks to deadline, estimated effort 60h. Team availability confirmed. Buffer of 1 week included.`,
      partial: `Tight but possible. 2 weeks to deadline, 80h effort. Requires prioritization and weekend work.`,
      no: `Timeline not achievable. 5 days to deadline, minimum 60h effort required. Quality would be compromised.`,
      unknown: `Timeline feasibility depends on scope clarification expected this week.`
    },
    teamCapacityExists: {
      yes: `Team capacity available. Bid team assigned: 1x Presales Lead (40%), 2x Solution Architects (20%), 1x Commercial (10%).`,
      partial: `Limited capacity. Core team available but stretched across 3 active bids. Prioritization needed.`,
      no: `No capacity. Bid team fully allocated to higher-priority opportunities. Would need to deprioritize other bids.`,
      unknown: `Capacity check with bid management pending.`
    },
    informationComplete: {
      yes: `Information complete. All RFP documents received, Q&A responses available, customer clarifications documented. Ready to proceed.`,
      partial: `Mostly complete. Core requirements clear but pricing template and evaluation criteria still pending from customer.`,
      no: `Information gaps. Missing: technical architecture details, integration requirements, SLA definitions. Cannot proceed without.`,
      unknown: `Information completeness check in progress.`
    }
  };

  const fieldExplanations = explanations[fieldId];
  if (fieldExplanations && fieldExplanations[answer]) {
    return fieldExplanations[answer];
  }
  return `AI analysis pending for this criterion. Click "Generate AI Explanation" to analyze based on available data.`;
};

const ANSWER_OPTIONS = [
  { value: 'yes', label: 'Yes', score: 1, color: 'emerald', icon: CheckCircle },
  { value: 'partial', label: 'Partial', score: 0.5, color: 'amber', icon: HelpCircle },
  { value: 'no', label: 'No', score: 0, color: 'rose', icon: XCircle },
  { value: 'unknown', label: 'Unknown', score: 0.25, color: 'slate', icon: HelpCircle },
];

const OWNERS = ['All', 'Sales', 'Presales', 'Delivery', 'Finance', 'Legal', 'Sales Leader'];

const CATEGORY_CONFIG = {
  exclusion: { label: 'Exclusion Criteria', icon: Shield, color: 'rose', description: 'Any "No" = Automatic NO-GO' },
  winProbability: { label: 'Win Probability', icon: Target, color: 'blue', description: '30% weight' },
  deliveryCapability: { label: 'Delivery Capability', icon: Briefcase, color: 'purple', description: '25% weight' },
  commercialViability: { label: 'Commercial Viability', icon: Euro, color: 'emerald', description: '20% weight' },
  strategicAlignment: { label: 'Strategic Alignment', icon: Lightbulb, color: 'amber', description: '15% weight' },
  proposalFeasibility: { label: 'Proposal Feasibility', icon: Clock, color: 'cyan', description: '10% weight' }
};

export default function GoNoGoApp() {
  const [expandedCategories, setExpandedCategories] = useState(['exclusion']);
  const [answers, setAnswers] = useState({});
  const [aiExplanations, setAiExplanations] = useState({});
  const [editingExplanation, setEditingExplanation] = useState(null);
  const [evidence, setEvidence] = useState({});
  const [evidencePanelOpen, setEvidencePanelOpen] = useState(false);
  const [selectedEvidence, setSelectedEvidence] = useState(null);
  const [confirmedFields, setConfirmedFields] = useState({});
  const [opportunityInfo, setOpportunityInfo] = useState({
    name: '',
    customer: '',
    tcv: '',
    deadline: '',
    archetype: 'B',
    opportunityId: ''
  });
  const [filterOwner, setFilterOwner] = useState('All');
  const [showAIOnly, setShowAIOnly] = useState(false);

  // Get field label by ID
  const getFieldLabel = (fieldId) => {
    for (const fields of Object.values(FIELDS)) {
      const field = fields.find(f => f.id === fieldId);
      if (field) return field.label;
    }
    return fieldId;
  };

  // Open evidence panel for a specific field
  const openEvidencePanel = (fieldId) => {
    const fieldEvidence = evidence[fieldId];
    if (fieldEvidence) {
      setSelectedEvidence({
        ...fieldEvidence,
        criterionLabel: getFieldLabel(fieldId)
      });
      setEvidencePanelOpen(true);
    }
  };

  // Handle evidence confirmation
  const handleConfirmEvidence = (fieldId, answer, comment) => {
    setAnswers(prev => ({ ...prev, [fieldId]: answer }));
    setConfirmedFields(prev => ({ ...prev, [fieldId]: { confirmed: true, comment } }));
    setEvidencePanelOpen(false);
  };

  // Handle evidence rejection
  const handleRejectEvidence = (fieldId, comment) => {
    // Clear the AI suggestion but keep the field for manual input
    setAnswers(prev => {
      const newAnswers = { ...prev };
      delete newAnswers[fieldId];
      return newAnswers;
    });
    setConfirmedFields(prev => ({ ...prev, [fieldId]: { confirmed: false, rejected: true, comment } }));
    setEvidencePanelOpen(false);
  };

  const calculateScores = () => {
    const scores = {};
    let totalWeightedScore = 0;
    let hasExclusionFail = false;
    let exclusionFailures = [];
    let totalAnswered = 0;
    let totalFields = 0;

    FIELDS.exclusion.forEach(field => {
      const answer = answers[field.id];
      if (answer === 'no') {
        hasExclusionFail = true;
        exclusionFailures.push(field.label);
      }
    });

    Object.entries(FIELDS).forEach(([category, fields]) => {
      totalFields += fields.length;
      
      if (category === 'exclusion') {
        const answered = fields.filter(f => answers[f.id]).length;
        totalAnswered += answered;
        scores[category] = hasExclusionFail ? 0 : (answered === fields.length ? 100 : 50);
        return;
      }

      let categoryScore = 0;
      let totalWeight = 0;

      fields.forEach(field => {
        const answer = answers[field.id];
        if (answer) {
          totalAnswered++;
          const option = ANSWER_OPTIONS.find(o => o.value === answer);
          categoryScore += option.score * (field.weight || 1);
          totalWeight += field.weight || 1;
        }
      });

      if (totalWeight > 0) {
        scores[category] = (categoryScore / totalWeight) * 100;
        totalWeightedScore += scores[category] * CATEGORY_WEIGHTS[category];
      } else {
        scores[category] = null;
      }
    });

    const overallScore = hasExclusionFail ? 0 : totalWeightedScore;
    const completionPercent = Math.round((totalAnswered / totalFields) * 100);
    
    return {
      categoryScores: scores,
      overallScore,
      hasExclusionFail,
      exclusionFailures,
      completionPercent,
      recommendation: hasExclusionFail ? 'NO-GO' : 
        overallScore >= 80 ? 'GO' :
        overallScore >= 60 ? 'CONDITIONAL GO' :
        overallScore >= 40 ? 'REVIEW REQUIRED' : 'NO-GO'
    };
  };

  const scores = calculateScores();

  const toggleCategory = (category) => {
    setExpandedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleAnswer = (fieldId, value) => {
    setAnswers(prev => ({ ...prev, [fieldId]: value }));
    // Auto-generate AI explanation when answer is selected
    const explanation = generateAIExplanation(fieldId, value, opportunityInfo.customer);
    setAiExplanations(prev => ({ ...prev, [fieldId]: explanation }));
  };

  const handleExplanationChange = (fieldId, value) => {
    setAiExplanations(prev => ({ ...prev, [fieldId]: value }));
  };

  const regenerateExplanation = (fieldId) => {
    const answer = answers[fieldId];
    if (answer) {
      const explanation = generateAIExplanation(fieldId, answer, opportunityInfo.customer);
      setAiExplanations(prev => ({ ...prev, [fieldId]: explanation }));
    }
  };

  const simulateAIFill = () => {
    const aiAnswers = {};
    const aiExps = {};
    Object.values(FIELDS).flat().forEach(field => {
      if (field.aiPotential === 'high' && !answers[field.id]) {
        const randomOutcome = Math.random();
        const answer = randomOutcome > 0.6 ? 'yes' : randomOutcome > 0.3 ? 'partial' : randomOutcome > 0.15 ? 'unknown' : 'yes';
        aiAnswers[field.id] = answer;
        aiExps[field.id] = generateAIExplanation(field.id, answer, opportunityInfo.customer);
      }
    });
    setAnswers(prev => ({ ...prev, ...aiAnswers }));
    setAiExplanations(prev => ({ ...prev, ...aiExps }));
  };

  const getRecommendationConfig = (rec) => {
    const configs = {
      'GO': { bg: 'bg-emerald-500/20', border: 'border-emerald-500/50', text: 'text-emerald-300', glow: 'shadow-emerald-500/20' },
      'CONDITIONAL GO': { bg: 'bg-amber-500/20', border: 'border-amber-500/50', text: 'text-amber-300', glow: 'shadow-amber-500/20' },
      'REVIEW REQUIRED': { bg: 'bg-orange-500/20', border: 'border-orange-500/50', text: 'text-orange-300', glow: 'shadow-orange-500/20' },
      'NO-GO': { bg: 'bg-rose-500/20', border: 'border-rose-500/50', text: 'text-rose-300', glow: 'shadow-rose-500/20' }
    };
    return configs[rec] || configs['NO-GO'];
  };

  const filteredFields = (fields) => {
    return fields.filter(f => {
      if (filterOwner !== 'All' && f.owner !== filterOwner) return false;
      if (showAIOnly && f.aiPotential !== 'high') return false;
      return true;
    });
  };

  const getScoreColor = (score) => {
    if (score >= 70) return 'text-emerald-400';
    if (score >= 50) return 'text-amber-400';
    return 'text-rose-400';
  };

  const getProgressColor = (score) => {
    if (score >= 70) return 'from-emerald-500 to-emerald-400';
    if (score >= 50) return 'from-amber-500 to-amber-400';
    return 'from-rose-500 to-rose-400';
  };

  const recConfig = getRecommendationConfig(scores.recommendation);

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-white" style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <div className="fixed inset-0 bg-[linear-gradient(rgba(56,189,248,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,0.02)_1px,transparent_1px)] bg-[size:44px_44px]" />
      
      {/* Header */}
      <header className="relative border-b border-slate-800/80 bg-[#0a0f1a]/90 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
                <CheckSquare className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  BidCheck
                </h1>
                <p className="text-sm text-slate-500">Quick Validation • SoftwareOne</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12">
                  <svg className="w-full h-full -rotate-90">
                    <circle cx="24" cy="24" r="20" fill="none" stroke="#1e293b" strokeWidth="4" />
                    <circle 
                      cx="24" cy="24" r="20" fill="none" 
                      stroke="url(#progressGradient)"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeDasharray={`${(scores.completionPercent / 100) * 126} 126`}
                      className="transition-all duration-700"
                    />
                    <defs>
                      <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#22d3ee" />
                        <stop offset="100%" stopColor="#3b82f6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-bold text-cyan-400">{scores.completionPercent}%</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-500">Progress</div>
                  <div className="text-sm font-medium text-slate-300">{Object.keys(answers).length} / {Object.values(FIELDS).flat().length}</div>
                </div>
              </div>

              <button
                onClick={simulateAIFill}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-sm font-medium transition-all shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40"
              >
                <Sparkles className="w-4 h-4" />
                Auto-Fill with AI
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="relative max-w-7xl mx-auto px-6 py-8">
        {/* Opportunity Info Card */}
        <div className="mb-8 p-6 rounded-3xl bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-slate-700/50 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-cyan-400" />
            </div>
            <h2 className="text-lg font-semibold">Opportunity Details</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {[
              { key: 'opportunityId', label: 'Opportunity #', placeholder: 'OPP-2026-001' },
              { key: 'name', label: 'Opportunity Name', placeholder: 'Cloud Migration' },
              { key: 'customer', label: 'Customer', placeholder: 'Customer AG' },
              { key: 'tcv', label: 'TCV (CHF)', placeholder: '450,000' },
              { key: 'deadline', label: 'Deadline', type: 'date' },
              { key: 'archetype', label: 'Archetype', type: 'select', options: [
                { value: 'A', label: 'A - Standard <350K' },
                { value: 'B', label: 'B - Custom <350K' },
                { value: 'C', label: 'C - Complex >350K' }
              ]}
            ].map(field => (
              <div key={field.key}>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">{field.label}</label>
                {field.type === 'select' ? (
                  <select
                    value={opportunityInfo[field.key]}
                    onChange={(e) => setOpportunityInfo(prev => ({ ...prev, [field.key]: e.target.value }))}
                    className="w-full px-3 py-2.5 bg-slate-900/60 border border-slate-700/80 rounded-xl text-sm focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
                  >
                    {field.options.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type || 'text'}
                    value={opportunityInfo[field.key]}
                    onChange={(e) => setOpportunityInfo(prev => ({ ...prev, [field.key]: e.target.value }))}
                    className="w-full px-3 py-2.5 bg-slate-900/60 border border-slate-700/80 rounded-xl text-sm placeholder:text-slate-600 focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
                    placeholder={field.placeholder}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* RFP Upload Section */}
        <div className="mb-8 p-6 rounded-3xl bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-slate-700/50 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl bg-violet-500/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">RFP Document Upload</h2>
              <p className="text-sm text-slate-500">Upload the RFP for AI-powered analysis and auto-evaluation</p>
            </div>
          </div>
          
          <RFPUploader 
            opportunityInfo={opportunityInfo}
            onAnalysisComplete={(results) => {
              setAnswers(prev => ({ ...prev, ...results.answers }));
              setAiExplanations(prev => ({ ...prev, ...results.explanations }));
              setEvidence(prev => ({ ...prev, ...results.evidence }));
            }}
          />
        </div>

        {/* Evidence Review Panel */}
        <EvidencePanel
          isOpen={evidencePanelOpen}
          onClose={() => setEvidencePanelOpen(false)}
          evidence={selectedEvidence}
          onConfirm={handleConfirmEvidence}
          onReject={handleRejectEvidence}
        />

        {/* Score Dashboard */}
        <div className="mb-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Overall Score Card */}
          <div className="lg:col-span-4 p-6 rounded-3xl bg-gradient-to-br from-slate-800/50 to-slate-900/60 border border-slate-700/50 backdrop-blur-sm">
            <h3 className="text-sm font-medium text-slate-400 mb-6">Decision Score</h3>
            
            <div className="flex justify-center mb-6">
              <div className="relative">
                <svg className="w-44 h-44 -rotate-90">
                  <circle cx="88" cy="88" r="76" fill="none" stroke="#1e293b" strokeWidth="12" />
                  <circle 
                    cx="88" cy="88" r="76" fill="none" 
                    stroke={scores.hasExclusionFail ? '#f43f5e' : scores.overallScore >= 60 ? '#10b981' : '#f59e0b'}
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray={`${(scores.overallScore / 100) * 478} 478`}
                    className="transition-all duration-1000 ease-out"
                    style={{ filter: `drop-shadow(0 0 8px ${scores.hasExclusionFail ? '#f43f5e' : scores.overallScore >= 60 ? '#10b981' : '#f59e0b'}40)` }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-5xl font-bold ${getScoreColor(scores.overallScore)}`}>
                    {Math.round(scores.overallScore)}
                  </span>
                  <span className="text-sm text-slate-500 mt-1">of 100</span>
                </div>
              </div>
            </div>
            
            <div className={`text-center py-4 rounded-2xl border-2 ${recConfig.bg} ${recConfig.border} shadow-lg ${recConfig.glow}`}>
              <span className={`text-xl font-bold ${recConfig.text}`}>{scores.recommendation}</span>
            </div>
            
            {scores.hasExclusionFail && (
              <div className="mt-4 p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-rose-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-rose-300 mb-1">Exclusion Criteria Failed</p>
                    <p className="text-xs text-rose-400/80">{scores.exclusionFailures.join(', ')}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Category Scores */}
          <div className="lg:col-span-8 p-6 rounded-3xl bg-gradient-to-br from-slate-800/40 to-slate-900/50 border border-slate-700/50 backdrop-blur-sm">
            <h3 className="text-sm font-medium text-slate-400 mb-5">Category Breakdown</h3>
            <div className="space-y-4">
              {Object.entries(CATEGORY_CONFIG).map(([category, config]) => {
                const score = scores.categoryScores[category];
                const Icon = config.icon;
                const fields = FIELDS[category];
                const answered = fields.filter(f => answers[f.id]).length;
                
                return (
                  <div key={category}>
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl bg-slate-700/30 flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`w-5 h-5 text-slate-300`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-slate-200">{config.label}</span>
                            <span className="text-xs text-slate-500">({answered}/{fields.length})</span>
                          </div>
                          <span className={`text-sm font-semibold ${score !== null ? getScoreColor(score) : 'text-slate-500'}`}>
                            {score !== null ? `${Math.round(score)}%` : '—'}
                          </span>
                        </div>
                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full bg-gradient-to-r ${score !== null ? getProgressColor(score) : 'from-slate-600 to-slate-600'} transition-all duration-700 ease-out`}
                            style={{ width: `${score || 0}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 px-1 py-1 bg-slate-800/50 rounded-xl border border-slate-700/50">
            {OWNERS.map(owner => (
              <button
                key={owner}
                onClick={() => setFilterOwner(owner)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filterOwner === owner 
                    ? 'bg-cyan-500/20 text-cyan-300 shadow-sm' 
                    : 'text-slate-400 hover:text-slate-300 hover:bg-slate-700/50'
                }`}
              >
                {owner}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowAIOnly(!showAIOnly)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all ${
              showAIOnly 
                ? 'bg-violet-500/20 border-violet-500/50 text-violet-300' 
                : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:border-slate-600'
            }`}
          >
            <Bot className="w-4 h-4" />
            AI-Automatable Only
          </button>
        </div>

        {/* Question Categories */}
        <div className="space-y-4">
          {Object.entries(FIELDS).map(([category, fields]) => {
            const filtered = filteredFields(fields);
            if (filtered.length === 0) return null;
            
            const isExpanded = expandedCategories.includes(category);
            const config = CATEGORY_CONFIG[category];
            const Icon = config.icon;
            const answeredCount = filtered.filter(f => answers[f.id]).length;
            const categoryScore = scores.categoryScores[category];
            
            return (
              <div key={category} className="rounded-3xl bg-gradient-to-br from-slate-800/30 to-slate-900/40 border border-slate-700/50 overflow-hidden backdrop-blur-sm">
                <button
                  onClick={() => toggleCategory(category)}
                  className="w-full px-6 py-5 flex items-center justify-between hover:bg-slate-700/20 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      category === 'exclusion' 
                        ? 'bg-rose-500/15 ring-1 ring-rose-500/30'
                        : 'bg-slate-700/30'
                    }`}>
                      <Icon className={`w-6 h-6 ${category === 'exclusion' ? 'text-rose-400' : 'text-slate-300'}`} />
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-slate-100">{config.label}</h3>
                        {category === 'exclusion' && (
                          <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 text-xs font-medium">
                            Critical
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-500 mt-0.5">
                        {answeredCount}/{filtered.length} answered
                        {categoryScore !== null && ` • Score: ${Math.round(categoryScore)}%`}
                      </p>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-slate-800/50">
                    {isExpanded ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
                  </div>
                </button>
                
                {isExpanded && (
                  <div className="border-t border-slate-700/50">
                    {filtered.map((field, idx) => {
                      const currentAnswer = answers[field.id];
                      const currentExplanation = aiExplanations[field.id] || '';
                      const isEditing = editingExplanation === field.id;
                      
                      return (
                        <div 
                          key={field.id}
                          className={`px-6 py-5 ${idx !== filtered.length - 1 ? 'border-b border-slate-700/30' : ''}`}
                        >
                          {/* Question Header */}
                          <div className="flex flex-col xl:flex-row xl:items-start gap-4 mb-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start gap-3 mb-2">
                                <span className="font-medium text-slate-100">{field.label}</span>
                                {field.aiPotential === 'high' && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-violet-500/20 text-violet-300 text-xs font-medium">
                                    <Zap className="w-3 h-3" /> AI
                                  </span>
                                )}
                                {/* Evidence Available Badge */}
                                {evidence[field.id] && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 text-xs font-medium">
                                    <FileSearch className="w-3 h-3" /> Evidence
                                  </span>
                                )}
                                {/* Confirmed Badge */}
                                {confirmedFields[field.id]?.confirmed && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-xs font-medium">
                                    <CheckCheck className="w-3 h-3" /> Verified
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-slate-400 mb-3">{field.description}</p>
                              <div className="flex items-center gap-4 text-xs text-slate-500">
                                <span className="flex items-center gap-1.5 px-2 py-1 bg-slate-800/50 rounded-lg">
                                  <User className="w-3 h-3" /> {field.owner}
                                </span>
                                <span className="flex items-center gap-1.5 px-2 py-1 bg-slate-800/50 rounded-lg">
                                  <Database className="w-3 h-3" /> {field.aiSource}
                                </span>
                                {/* Review Evidence Button */}
                                {evidence[field.id] && (
                                  <button
                                    onClick={() => openEvidencePanel(field.id)}
                                    className="flex items-center gap-1.5 px-3 py-1 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-lg text-cyan-300 transition-all"
                                  >
                                    <BookOpen className="w-3 h-3" />
                                    Review Evidence
                                  </button>
                                )}
                              </div>
                            </div>
                            
                            {/* Answer Buttons */}
                            <div className="flex gap-2 flex-shrink-0">
                              {ANSWER_OPTIONS.map(option => {
                                const isSelected = currentAnswer === option.value;
                                const OptionIcon = option.icon;
                                return (
                                  <button
                                    key={option.value}
                                    onClick={() => handleAnswer(field.id, option.value)}
                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                                      isSelected
                                        ? option.value === 'yes' ? 'bg-emerald-500/20 border-2 border-emerald-500/60 text-emerald-300'
                                          : option.value === 'partial' ? 'bg-amber-500/20 border-2 border-amber-500/60 text-amber-300'
                                          : option.value === 'no' ? 'bg-rose-500/20 border-2 border-rose-500/60 text-rose-300'
                                          : 'bg-slate-500/20 border-2 border-slate-500/60 text-slate-300'
                                        : 'bg-slate-800/60 border-2 border-slate-700/60 text-slate-400 hover:border-slate-600'
                                    }`}
                                  >
                                    <OptionIcon className="w-4 h-4" />
                                    {option.label}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                          
                          {/* AI Explanation Field */}
                          <div className="mt-4 p-4 rounded-2xl bg-slate-900/50 border border-slate-700/50">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <Bot className="w-4 h-4 text-violet-400" />
                                <span className="text-xs font-medium text-slate-400">AI Explanation / Justification</span>
                                {currentExplanation && !isEditing && (
                                  <span className="px-1.5 py-0.5 rounded text-xs bg-violet-500/20 text-violet-300">
                                    AI Generated
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                {currentAnswer && (
                                  <button
                                    onClick={() => regenerateExplanation(field.id)}
                                    className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs text-slate-400 hover:text-violet-300 hover:bg-violet-500/10 transition-all"
                                    title="Regenerate AI explanation"
                                  >
                                    <RefreshCw className="w-3 h-3" />
                                    Regenerate
                                  </button>
                                )}
                                <button
                                  onClick={() => setEditingExplanation(isEditing ? null : field.id)}
                                  className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs transition-all ${
                                    isEditing 
                                      ? 'text-cyan-300 bg-cyan-500/10' 
                                      : 'text-slate-400 hover:text-cyan-300 hover:bg-cyan-500/10'
                                  }`}
                                >
                                  <Edit3 className="w-3 h-3" />
                                  {isEditing ? 'Done' : 'Edit'}
                                </button>
                              </div>
                            </div>
                            
                            {isEditing ? (
                              <textarea
                                value={currentExplanation}
                                onChange={(e) => handleExplanationChange(field.id, e.target.value)}
                                placeholder="Enter your justification or edit the AI-generated explanation..."
                                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-sm text-slate-200 placeholder:text-slate-600 focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all resize-none"
                                rows={4}
                                autoFocus
                              />
                            ) : (
                              <div 
                                className={`text-sm leading-relaxed ${currentExplanation ? 'text-slate-300' : 'text-slate-500 italic'}`}
                                onClick={() => setEditingExplanation(field.id)}
                              >
                                {currentExplanation || 'Select an answer above to generate AI explanation, or click Edit to add your own justification...'}
                              </div>
                            )}
                            
                            {/* Overwrite indicator */}
                            {currentExplanation && !isEditing && (
                              <p className="mt-3 text-xs text-slate-500 flex items-center gap-1">
                                <Info className="w-3 h-3" />
                                Click "Edit" to modify this explanation or "Regenerate" to get a new AI suggestion
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Footer */}
        <div className="mt-10 p-6 rounded-3xl bg-gradient-to-r from-slate-800/50 to-slate-900/50 border border-slate-700/50">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-5 py-3 bg-slate-700/50 hover:bg-slate-700 rounded-xl text-sm font-medium transition-all border border-slate-600/50">
                <Save className="w-4 h-4" />
                Save Draft
              </button>
              <button className="flex items-center gap-2 px-5 py-3 bg-slate-700/50 hover:bg-slate-700 rounded-xl text-sm font-medium transition-all border border-slate-600/50">
                <Download className="w-4 h-4" />
                Export PDF
              </button>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-5 py-3 bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 text-rose-300 rounded-xl text-sm font-medium transition-all">
                <XCircle className="w-4 h-4" />
                Reject (No-Go)
              </button>
              <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-cyan-500/30">
                <Send className="w-4 h-4" />
                Submit for Review
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
