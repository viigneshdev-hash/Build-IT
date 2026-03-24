import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Layout, Mail, Lock, User, ArrowRight, GitBranch, Globe } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        if (authError.message === 'Invalid login credentials') {
          // Check if user exists but wrong password, or doesn't exist at all
          setError('User not found or incorrect password. Please check your credentials or signup.');
        } else {
          setError(authError.message);
        }
        setLoading(false);
        return;
      }

      if (data.user) {
        navigate('/home');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-900 text-white selection:bg-blue-500/30 font-sans">
      {/* Left side: Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 sm:p-12 lg:p-24 bg-slate-900 relative">
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] -z-10"></div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md space-y-10"
        >
          <div className="text-center space-y-3">
            <h1 className="text-4xl font-black tracking-tight">Welcome Back</h1>
            <p className="text-slate-400 font-medium">Log in to your account and continue building.</p>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-sm font-semibold"
              >
                {error}
              </motion.div>
            )}
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-400 uppercase tracking-widest px-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full pl-12 pr-6 py-4 bg-slate-800/50 border border-slate-700 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-white placeholder:text-slate-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">Password</label>
                <a href="#" className="text-sm text-blue-400 hover:text-blue-300 font-semibold transition-colors">Forgot password?</a>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-12 pr-6 py-4 bg-slate-800/50 border border-slate-700 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-white placeholder:text-slate-500"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl shadow-xl shadow-blue-600/20 transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 group disabled:opacity-50"
            >
              {loading ? (
                <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="relative flex items-center gap-4 py-2">
            <div className="flex-1 h-px bg-slate-800"></div>
            <span className="text-slate-500 text-sm font-bold uppercase tracking-wider">Or continue with</span>
            <div className="flex-1 h-px bg-slate-800"></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-3 px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-2xl font-bold transition-all text-slate-200">
              <Globe className="w-5 h-5" />
              Google
            </button>
            <button className="flex items-center justify-center gap-3 px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-2xl font-bold transition-all text-slate-200">
              <GitBranch className="w-5 h-5 text-indigo-400" />
              GitHub
            </button>
          </div>

          <p className="text-center text-slate-400 font-medium">
            New here? <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-bold decoration-2 underline-offset-4 hover:underline transition-all">Create an account</Link>
          </p>
        </motion.div>
      </div>

      {/* Right side: Branding & Hero */}
      <div className="hidden md:flex flex-col flex-1 bg-gradient-to-br from-indigo-900 to-slate-900 p-16 justify-between items-end relative overflow-hidden group">
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] -z-10 animate-pulse transition-transform group-hover:scale-110"></div>
        
        <Link to="/" className="flex items-center gap-3 group/logo">
          <span className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-l from-white to-blue-200 tracking-tighter">
            Build IT
          </span>
          <div className="bg-white/10 backdrop-blur-md p-2 rounded-xl group-hover/logo:bg-white/20 transition-all border border-white/20">
            <Layout className="w-8 h-8 text-white" />
          </div>
        </Link>

        <div className="max-w-md space-y-6 text-right">
          <motion.h2 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-5xl font-extrabold leading-tight tracking-tight drop-shadow-2xl"
          >
            Your Career, <br />
            <span className="text-blue-400">Perfected.</span>
          </motion.h2>
          <p className="text-xl text-blue-200/70 font-medium ml-auto">
            Log in to access your saved resumes and continue your journey to professional success.
          </p>
        </div>

        <div className="p-8 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 w-full max-w-sm group ml-auto text-right">
          <p className="text-sm font-semibold text-blue-100 italic">"The simplest way to create a resume that actually works."</p>
          <p className="text-xs text-blue-300/50 mt-1">— James K., Product Manager</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
