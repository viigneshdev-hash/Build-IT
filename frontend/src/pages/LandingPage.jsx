import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, Download, CheckCircle, FileText, Layout, ArrowRight } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-lg border-b border-slate-800 bg-slate-900/50 px-6 py-4 flex justify-between items-center transition-all duration-300">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-tr from-blue-500 to-indigo-600 p-2 rounded-xl">
            <Layout className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400 tracking-tight">
            Build IT
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-slate-400 font-medium">
          <a href="#features" className="hover:text-blue-400 transition-colors">Features</a>
          <a href="#templates" className="hover:text-blue-400 transition-colors">Templates</a>
          <a href="#about" className="hover:text-blue-400 transition-colors">About</a>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="px-5 py-2 text-slate-300 hover:text-white transition-colors duration-200">
            Log in
          </Link>
          <Link 
            to="/signup" 
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(37,99,235,0.4)]"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden flex-1 flex flex-col items-center justify-center">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] -z-10 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] -z-10 animate-pulse delay-700"></div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl text-center space-y-8"
        >
          <motion.div 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold mb-4"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered ATS Optimization</span>
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
            Build Your Perfect <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
              ATS-Friendly Resume
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Stop worrying about automated systems. Our AI ensures your resume is perfectly optimized, 
            professionally styled, and ready to land you that interview.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link 
              to="/signup" 
              className="px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl flex items-center justify-center gap-2 font-bold text-lg transition-all shadow-[0_4px_30px_rgba(37,99,235,0.3)] group"
            >
              Start Building Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              to="/ats" 
              className="px-8 py-4 bg-slate-800 hover:bg-slate-700 rounded-2xl flex items-center justify-center gap-2 font-bold text-lg border border-slate-700 hover:border-slate-600 transition-all"
            >
              Check ATS Score
            </Link>
          </div>
        </motion.div>

        {/* Feature Cards Showcase */}
        <div id="features" className="mt-32 w-full max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              icon: <Sparkles className="w-8 h-8 text-blue-400" />, 
              title: "AI Analysis", 
              desc: "Get instant AI feedback on your resume based on your target job description." 
            },
            { 
              icon: <Layout className="w-8 h-8 text-indigo-400" />, 
              title: "5+ Templates", 
              desc: "Professional layouts designed to pass ATS filters and impress recruiters." 
            },
            { 
              icon: <Download className="w-8 h-8 text-purple-400" />, 
              title: "Instant PDF", 
              desc: "Download your resume in high-quality PDF format with just one click." 
            }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="p-8 rounded-3xl bg-slate-800/40 border border-slate-700 hover:border-blue-500/30 transition-all hover:bg-slate-800/60 group"
            >
              <div className="mb-6 p-4 rounded-2xl bg-slate-900 w-fit group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
              <p className="text-slate-400 leading-relaxed font-medium">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-slate-800 text-center text-slate-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Build IT. Empowering your career with AI.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
