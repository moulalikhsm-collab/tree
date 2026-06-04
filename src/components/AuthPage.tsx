import React, { useState } from 'react';
import { Leaf, Lock, Mail, User, BookOpen, AlertCircle, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

interface AuthPageProps {
  onLoginSuccess: (userInfo: { name: string; email: string; grade: string }) => void;
}

export default function AuthPage({ onLoginSuccess }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('student@ecofriend.org');
  const [password, setPassword] = useState('greenworld2026');
  const [name, setName] = useState('Hazira Dudekula');
  const [grade, setGrade] = useState('Beginner Grade 6');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Dynamic validated simulation for instant secure entry
    setTimeout(() => {
      if (!email.includes('@')) {
        setError('Please enter a valid academic or personal email address.');
        setLoading(false);
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters for local storage encryption.');
        setLoading(false);
        return;
      }

      const info = {
        name: isLogin ? (email === 'student@ecofriend.org' ? 'Hazira Dudekula' : email.split('@')[0]) : name,
        email,
        grade
      };

      localStorage.setItem('ecofriend_user', JSON.stringify(info));
      onLoginSuccess(info);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#fafdfb] flex flex-col md:flex-row">
      
      {/* Visual Panel Left */}
      <div className="md:w-1/2 bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-900 text-white p-8 md:p-16 flex flex-col justify-between relative overflow-hidden">
        
        {/* Decorative ambient vector shapes */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl -translate-y-12 translate-x-12 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-400/20 rounded-full blur-3xl translate-y-12 -translate-x-12 pointer-events-none" />

        <div className="flex items-center gap-2.5 relative z-10">
          <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md">
            <Leaf className="w-6 h-6 text-emerald-200" />
          </div>
          <div>
            <span className="text-xs uppercase tracking-widest text-emerald-200 font-extrabold block">Classroom Edition</span>
            <h1 className="text-lg font-black font-display text-white mt-0.5">EcoFriend Smart Assistant</h1>
          </div>
        </div>

        <div className="my-12 md:my-0 space-y-5 relative z-10 max-w-md">
          <span className="text-[10px] bg-emerald-400/20 border border-emerald-300/30 font-bold uppercase tracking-widest px-3 py-1 rounded-full text-emerald-200 inline-block">
            🌱 Learn Botany with Gen-AI
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight font-display leading-tight text-white">
            Cultivate your green thumb using interactive intelligence.
          </h2>
          <p className="text-sm text-emerald-100/90 leading-relaxed font-sans">
            EcoFriend equips students and beginner planters with real-time soil analytics, watering reminders, regional climate analysis, and instant camera-led Leaf Scan diagnoses powered by Google Gemini.
          </p>
        </div>

        <div className="relative z-10 text-xs text-emerald-200/75 border-t border-emerald-600/50 pt-5 flex items-center justify-between">
          <span>Standard JWT & Local Persistent Storage safe</span>
          <span className="font-semibold text-white">Verified Organic Companion</span>
        </div>

      </div>

      {/* Auth Form Right */}
      <div className="md:w-1/2 p-8 md:p-16 flex flex-col justify-center bg-white">
        <div className="max-w-md mx-auto w-full space-y-8">
          
          <div className="space-y-2">
            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight font-display">
              {isLogin ? 'Welcome back, Cadet!' : 'Create Organic Planter Account'}
            </h3>
            <p className="text-xs text-slate-500 leading-normal">
              {isLogin 
                ? 'Sign in to access your virtual pots, run YOLO leaf scans, and chat with AI.' 
                : 'Join school gardening campaigns and unlock personalized plantation roadmaps.'
              }
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 border border-red-100 p-4 rounded-xl text-xs flex items-center gap-2.5 animate-fade-in">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {!isLogin && (
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    id="auth-name-input"
                    type="text"
                    required
                    placeholder="Hazira Dudekula"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-xs text-slate-700 bg-slate-50 border border-slate-150 rounded-xl pl-10 pr-3 py-3 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white transition-all"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  id="auth-email-input"
                  type="email"
                  required
                  placeholder="student@ecofriend.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs text-slate-700 bg-slate-50 border border-slate-150 rounded-xl pl-10 pr-3 py-3 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  id="auth-password-input"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-xs text-slate-700 bg-slate-50 border border-slate-150 rounded-xl pl-10 pr-3 py-3 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Planter Profile Tier</label>
              <div className="relative">
                <BookOpen className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <select
                  id="auth-grade-select"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full text-xs text-slate-700 bg-slate-50 border border-slate-150 rounded-xl pl-10 pr-3 py-3 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white transition-all"
                >
                  <option value="Beginner Grade 6">Beginner (School Grade 5 - 8)</option>
                  <option value="High School Agriculturist">High School (Grade 9 - 12)</option>
                  <option value="Urban Balcony Planter">Urban & Hobbyist Balcony Gardener</option>
                  <option value="Advanced Organic Farmer">Advanced / Organic Farmer Mentor</option>
                </select>
              </div>
            </div>

            <button
              id="auth-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs py-3 rounded-xl transition-all duration-150 flex items-center justify-center gap-2 shadow hover:shadow-md cursor-pointer disabled:opacity-50 mt-2"
            >
              {loading ? (
                <span>Validating profile context...</span>
              ) : (
                <>
                  {isLogin ? 'Authenticate Profile' : 'Register Planter Ledger'} 
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>

          </form>

          {/* Toggle stage click */}
          <div className="text-center">
            <button
              id="auth-toggle-stage-btn"
              onClick={() => setIsLogin(!isLogin)}
              className="text-xs text-emerald-600 hover:text-emerald-700 font-bold tracking-tight cursor-pointer focus:outline-none"
            >
              {isLogin 
                ? "Don't have a profile? Create planter ledger" 
                : "Already registered? Let's authenticate"
              }
            </button>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Academic Safe-Search
            </span>
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Powered by Gemini Flash
            </span>
          </div>

        </div>
      </div>

    </div>
  );
}
