import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileSearch, CheckCircle, AlertCircle, 
  ArrowRight, Upload, Sparkles, 
  Layout, Search, PenTool, TrendingUp
} from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const ATSPage = () => {
  const [resumeText, setResumeText] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const checkATS = async () => {
    if (!resumeText || !jobDesc) {
      alert("Please provide both resume text and job description.");
      return;
    }
    
    setLoading(true);
    setResults(null);

    try {
      // Send to our Django backend
      const response = await axios.post(`${API_URL}/api/check-ats/`, { resumeText, jobDesc });
      setResults(response.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center p-8 sm:p-20 font-sans">
      <nav className="fixed top-0 w-full z-10 backdrop-blur-md bg-slate-900/50 border-b border-slate-800 px-8 py-4 flex justify-between items-center transition-all duration-300">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-xl">
             <Layout className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-black text-white">Build IT</span>
        </div>
        <div className="flex gap-4">
           <a href="/home" className="text-slate-400 hover:text-white font-bold transition-all">Back to Builder</a>
        </div>
      </nav>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-5xl space-y-12 mt-12"
      >
        <div className="text-center space-y-4">
           <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-black uppercase tracking-widest">
              <Sparkles className="w-4 h-4" /> AI Powered Analyzer
           </div>
           <h1 className="text-5xl font-black tracking-tight leading-tight">Master the <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">ATS Challenge</span></h1>
           <p className="text-xl text-slate-400 font-medium max-w-2xl mx-auto italic">Upload your resume and the target job description to see how you rank. Our AI will give you instant ideas to score a 100%.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
           <div className="space-y-4 flex flex-col h-full">
              <div className="flex items-center gap-3 px-1">
                 <PenTool className="w-5 h-5 text-blue-500" />
                 <label className="text-sm font-black text-slate-500 uppercase tracking-widest">Your Resume Content</label>
              </div>
              <textarea 
                 value={resumeText}
                 onChange={(e) => setResumeText(e.target.value)}
                 placeholder="Paste your resume text here..."
                 className="w-full h-80 p-6 bg-slate-800 border border-slate-700/50 rounded-3xl outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-200 resize-none no-scrollbar font-mono text-sm shadow-2xl"
              />
           </div>

           <div className="space-y-4 flex flex-col h-full">
              <div className="flex items-center gap-3 px-1">
                 <Search className="w-5 h-5 text-indigo-500" />
                 <label className="text-sm font-black text-slate-500 uppercase tracking-widest">Job Description</label>
              </div>
              <textarea 
                 value={jobDesc}
                 onChange={(e) => setJobDesc(e.target.value)}
                 placeholder="Paste the job description here..."
                 className="w-full h-80 p-6 bg-slate-800 border border-slate-700/50 rounded-3xl outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-200 resize-none no-scrollbar font-mono text-sm shadow-2xl"
              />
           </div>
        </div>

        <div className="flex justify-center pt-4">
           <button 
              onClick={checkATS}
              disabled={loading}
              className="px-12 py-5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-3xl shadow-[0_0_40px_rgba(37,99,235,0.3)] transition-all transform hover:scale-[1.05] active:scale-95 flex items-center gap-4 disabled:opacity-50 text-xl overflow-hidden group relative"
           >
              {loading ? (
                 <div className="flex items-center gap-3">
                   <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                   Analyzing...
                 </div>
              ) : (
                <>
                  <FileSearch className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                  Analyze My Resume
                </>
              )}
           </button>
        </div>

        <AnimatePresence>
          {results && (
            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-20 mt-10"
            >
               {/* Score Card */}
               <div className="p-10 rounded-[2.5rem] bg-gradient-to-br from-slate-800/80 to-slate-900 border border-slate-700/50 flex flex-col items-center justify-center text-center shadow-2xl group overflow-hidden relative">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                  <TrendingUp className="w-8 h-8 text-blue-500 mb-6 group-hover:scale-110 transition-transform" />
                  <div className="relative mb-6">
                    <svg className="w-40 h-40 transform -rotate-90">
                       <circle cx="80" cy="80" r="70" className="stroke-slate-800" strokeWidth="12" fill="none" />
                       <circle cx="80" cy="80" r="70" className="stroke-blue-500 transition-all duration-1000" strokeWidth="12" fill="none" strokeDasharray="440" strokeDashoffset={440 - (440 * results.score) / 100} strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                       <span className="text-5xl font-black">{results.score}%</span>
                       <span className="text-xs font-black text-slate-500 uppercase tracking-widest mt-1">Match Rate</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-black mb-3">Strong Match!</h3>
                  <p className="text-slate-400 text-sm font-medium italic">{results.summary}</p>
               </div>

               {/* Suggestions Card */}
               <div className="md:col-span-2 p-10 rounded-[2.5rem] bg-slate-800/40 border border-slate-700/50 flex flex-col gap-8 shadow-2xl relative overflow-hidden">
                  <div className="flex items-center gap-3">
                     <AlertCircle className="w-6 h-6 text-amber-500" />
                     <h3 className="text-2xl font-black uppercase tracking-tight">How to Get 100% Score</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-4">
                        <label className="text-[10px] font-black text-blue-500 uppercase tracking-widest">AI Suggestions</label>
                        <ul className="space-y-4">
                          {results.suggestions.map((s, i) => (
                            <li key={i} className="flex gap-3 text-sm font-medium text-slate-300">
                               <div className="w-5 h-5 min-w-[1.25rem] bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center text-[10px] font-black">{i+1}</div>
                               {s}
                            </li>
                          ))}
                        </ul>
                     </div>
                     <div className="space-y-4">
                        <label className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Recommended Keywords</label>
                        <div className="flex flex-wrap gap-2 pt-2">
                           {results.missingKeywords.map((k, i) => (
                              <span key={i} className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs font-black text-slate-400 hover:border-blue-500/50 hover:text-white transition-all">+ {k}</span>
                           ))}
                        </div>
                        <div className="mt-8 p-6 bg-blue-600/10 border border-blue-500/20 rounded-2xl">
                           <p className="text-xs font-bold text-blue-300 leading-relaxed italic">"Recruiters look for these specific terms. Incorporate them naturally into your experience descriptions."</p>
                        </div>
                     </div>
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ATSPage;
