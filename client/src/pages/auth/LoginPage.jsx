import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Animated Auth Page combining Login and Signup
 */
export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  // Reset error on tab switch
  useEffect(() => {
    setError('');
  }, [isLogin]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        navigate('/dashboard');
      } else {
        await signup(formData.name, formData.email, formData.password);
        // After signup, automatically login
        await login(formData.email, formData.password);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  }, [isLogin, formData, login, signup, navigate]);

  const handleChange = useCallback((e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  return (
    <div className="min-h-screen w-full flex overflow-hidden bg-[rgb(var(--bg-base))]">
      {/* LEFT PANEL */}
      <div 
        className="hidden lg:flex w-[60%] relative flex-col justify-center p-16 bg-[rgb(var(--bg-base))] dark:bg-[linear-gradient(135deg,#0f0c29_0%,#302b63_50%,#24243e_100%)] transition-colors duration-300"
        style={{
          animation: 'fadeIn 0.8s ease-out, fadeUp 0.8s ease-out'
        }}
      >
        {/* Animated Orbs */}
        <div className="absolute top-[20%] left-[20%] w-64 h-64 bg-indigo-500 rounded-full mix-blend-screen filter blur-[80px] opacity-40 animate-[orb_15s_infinite]" />
        <div className="absolute bottom-[20%] right-[20%] w-72 h-72 bg-cyan-400 rounded-full mix-blend-screen filter blur-[80px] opacity-30 animate-[orb_20s_infinite_reverse]" />
        <div className="absolute top-[50%] left-[50%] w-56 h-56 bg-purple-600 rounded-full mix-blend-screen filter blur-[80px] opacity-30 animate-[float_8s_infinite]" />
        
        {/* Particle Dots (CSS Grid Pattern overlay) */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\\'20\\' height=\\'20\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Ccircle cx=\\'2\\' cy=\\'2\\' r=\\'1\\' fill=\\'rgba(255,255,255,0.05)\\'/%3E%3C/svg%3E')] opacity-50" />

        <div className="relative z-10 max-w-xl">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center text-white text-xl shadow-lg shadow-indigo-500/30">
              ⚡
            </div>
            <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-wide font-display">ZenTask</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-serif italic font-extrabold leading-tight mb-12">
            <span className="text-slate-900 dark:text-white block">Work with clarity.</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-cyan-400 block mt-2 pb-2">
              Execute with focus.
            </span>
          </h1>

          <div className="space-y-6 text-slate-600 dark:text-slate-300">
            {[
              { icon: '✨', text: 'Stay aligned across your team' },
              { icon: '⚡', text: 'Track progress in real time' },
              { icon: '🛡️', text: 'Secure, reliable, and built to scale' }
            ].map((item, i) => (
              <div 
                key={i} 
                className="flex items-center gap-4 stagger-card"
                style={{ '--delay': `${400 + i * 150}ms` }}
              >
                <div className="w-12 h-12 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center text-xl backdrop-blur-sm shadow-[0_4px_16px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.2)]">
                  {item.icon}
                </div>
                <span className="text-lg font-medium font-sans">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div 
        className="w-full lg:w-[40%] bg-[rgb(var(--bg-surface))] flex items-center justify-center p-4 sm:p-8 relative transition-colors duration-300"
        style={{ animation: 'fadeIn 0.8s ease-out 0.2s both' }}
      >
        <div 
          className="w-full max-w-[320px] glass rounded-[2rem] p-6 sm:p-8 shadow-[0_16px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_16px_40px_rgba(0,0,0,0.2)] relative z-10"
          style={{ animation: 'fadeUp 0.8s ease-out 0.5s both' }}
        >
          {/* Error Banner */}
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-full max-w-xs px-4 z-50 overflow-hidden">
            <div 
              className={`bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-xl backdrop-blur-md shadow-lg transition-all duration-300 ${
                error ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
              }`}
            >
              <div className="flex items-center gap-2 text-sm font-medium">
                <span>⚠️</span> {error}
              </div>
            </div>
          </div>

          {/* Pill Tab Switcher */}
          <div className="flex p-1 mb-10 bg-[rgb(var(--bg-base))] rounded-2xl border border-[rgba(var(--glass-border),0.1)] relative shadow-inner">
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 text-sm font-bold rounded-xl transition-all duration-300 z-10 ${isLogin ? 'text-indigo-600 dark:text-indigo-400' : 'opacity-60 hover:opacity-100'}`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 text-sm font-bold rounded-xl transition-all duration-300 z-10 ${!isLogin ? 'text-indigo-600 dark:text-indigo-400' : 'opacity-60 hover:opacity-100'}`}
            >
              Sign Up
            </button>
            {/* Animated Pill Background */}
            <div 
              className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-[rgb(var(--glass-bg))] rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.1)] border border-[rgba(var(--glass-border),0.2)] transition-transform duration-300 ease-out"
              style={{ transform: isLogin ? 'translateX(0)' : 'translateX(100%)' }}
            />
          </div>

          <div className="relative">
            <div className={`transition-all duration-500 ${isLogin ? 'opacity-100 translate-x-0 relative z-10' : 'opacity-0 -translate-x-8 absolute inset-0 z-0 pointer-events-none'}`}>
              <AuthForm 
                isLogin={true} 
                formData={formData} 
                onChange={handleChange} 
                onSubmit={handleSubmit} 
                loading={loading} 
              />
            </div>
            <div className={`transition-all duration-500 ${!isLogin ? 'opacity-100 translate-x-0 relative z-10' : 'opacity-0 translate-x-8 absolute inset-0 z-0 pointer-events-none'}`}>
              <AuthForm 
                isLogin={false} 
                formData={formData} 
                onChange={handleChange} 
                onSubmit={handleSubmit} 
                loading={loading} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Reusable form component for both login and signup
 */
function AuthForm({ isLogin, formData, onChange, onSubmit, loading }) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <div className="mb-2 text-center">
        <h2 className="text-2xl font-bold font-display tracking-tight mb-2">
          {isLogin ? 'Welcome back' : 'Create account'}
        </h2>
        <p className="text-sm opacity-60 font-medium">
          {isLogin ? 'Enter your details to proceed' : 'Sign up to get started'}
        </p>
      </div>

      {!isLogin && (
        <FloatingInput 
          label="Full Name" 
          name="name" 
          type="text" 
          value={formData.name} 
          onChange={onChange} 
          delay="600ms"
          required
        />
      )}
      
      <FloatingInput 
        label="Email Address" 
        name="email" 
        type="email" 
        value={formData.email} 
        onChange={onChange} 
        delay="700ms"
        required
      />
      
      <FloatingInput 
        label="Password" 
        name="password" 
        type="password" 
        value={formData.password} 
        onChange={onChange} 
        delay="800ms"
        required
      />

      <button 
        type="submit" 
        disabled={loading}
        className="btn-primary w-full py-3.5 mt-2 stagger-card rounded-2xl text-[15px] font-bold shadow-lg shadow-indigo-500/25"
        style={{ '--delay': '900ms' }}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
        ) : (
          isLogin ? 'Sign In' : 'Create Account'
        )}
      </button>
    </form>
  );
}

/**
 * Floating label input component
 */
function FloatingInput({ label, name, type, value, onChange, delay, required }) {
  const [focused, setFocused] = useState(false);
  const active = focused || value.length > 0;

  return (
    <div 
      className="relative stagger-card group" 
      style={{ '--delay': delay }}
    >
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        required={required}
        className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl px-4 pt-6 pb-2 text-sm outline-none transition-all duration-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-inner"
      />
      <label 
        htmlFor={name}
        className={`absolute left-4 transition-all duration-300 pointer-events-none ${
          active 
            ? 'top-2 text-[10px] uppercase tracking-wider text-indigo-500 font-bold' 
            : 'top-4 text-sm opacity-50 font-medium'
        }`}
      >
        {label}
      </label>
    </div>
  );
}
