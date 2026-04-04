import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { Mail, Lock, Phone, User, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';

export function LoginPage() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(containerRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' });
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error('Please fill all fields');
    
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      // Redirect based on role
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'staff') navigate('/pos');
      else navigate('/profile');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-bk-dark' : 'bg-gradient-to-br from-slate-50 to-slate-100'} px-4 py-20`}>
      <div ref={containerRef} className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-4xl font-black mb-4">🍔</div>
          <h1 className={`font-heading text-3xl font-black ${isDark ? 'text-bk-yellow' : 'text-bk-red'}`}>
            BK Crown
          </h1>
          <p className={`font-body mt-2 ${isDark ? 'text-bk-cream/50' : 'text-gray-600'}`}>
            Sign in to your account
          </p>
        </div>

        {/* Form Card */}
        <div className={`rounded-2xl p-8 border ${isDark ? 'bg-bk-dark-2 border-bk-brown-light/20' : 'bg-white border-gray-200'} shadow-lg`}>
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div>
              <label className={`block text-sm font-heading font-bold mb-2 ${isDark ? 'text-bk-cream' : 'text-gray-900'}`}>
                Email Address
              </label>
              <div className={`flex items-center rounded-lg px-4 py-3 border transition-all ${
                isDark
                  ? 'bg-bk-dark border-bk-brown-light/30 focus-within:border-bk-gold'
                  : 'bg-gray-50 border-gray-300 focus-within:border-bk-red focus-within:ring-1 focus-within:ring-bk-red'
              }`}>
                <Mail size={18} className={isDark ? 'text-bk-cream/40' : 'text-gray-400'} />
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({...form, email: e.target.value})}
                  placeholder="you@example.com"
                  className={`flex-1 ml-2 bg-transparent outline-none ${isDark ? 'text-bk-cream placeholder-bk-cream/30' : 'text-gray-900 placeholder-gray-500'}`}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className={`block text-sm font-heading font-bold mb-2 ${isDark ? 'text-bk-cream' : 'text-gray-900'}`}>
                Password
              </label>
              <div className={`flex items-center rounded-lg px-4 py-3 border transition-all ${
                isDark
                  ? 'bg-bk-dark border-bk-brown-light/30 focus-within:border-bk-gold'
                  : 'bg-gray-50 border-gray-300 focus-within:border-bk-red focus-within:ring-1 focus-within:ring-bk-red'
              }`}>
                <Lock size={18} className={isDark ? 'text-bk-cream/40' : 'text-gray-400'} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm({...form, password: e.target.value})}
                  placeholder="••••••••"
                  className={`flex-1 ml-2 bg-transparent outline-none ${isDark ? 'text-bk-cream placeholder-bk-cream/30' : 'text-gray-900 placeholder-gray-500'}`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <button type="button"
              onClick={() => navigate('/forgot-password')}
              className={`text-sm font-heading font-bold transition-colors hover:underline ${
                isDark ? 'text-bk-gold hover:text-bk-yellow' : 'text-bk-red hover:text-red-600'
              }`}>
              Forgot Password?
            </button>

            {/* Login Button */}
            <button type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-lg font-heading font-bold text-lg transition-all mt-6 ${
                isDark
                  ? 'bg-gold-gradient text-bk-dark hover:shadow-gold disabled:opacity-50'
                  : 'bg-bk-red text-white hover:bg-red-600 disabled:opacity-50'
              }`}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className={`mt-6 pt-6 border-t text-center ${isDark ? 'border-bk-brown-light/20' : 'border-gray-200'}`}>
            <p className={`font-body text-sm ${isDark ? 'text-bk-cream/70' : 'text-gray-600'}`}>
              Don't have an account?{' '}
              <button onClick={() => navigate('/signup')}
                className={`font-bold transition-colors ${isDark ? 'text-bk-gold hover:text-bk-yellow' : 'text-bk-red hover:text-red-600'}`}>
                Sign Up
              </button>
            </p>
          </div>
        </div>

        {/* Demo Credentials */}
        <div className={`mt-6 p-4 rounded-lg border ${isDark ? 'bg-bk-dark-2 border-bk-brown-light/20' : 'bg-blue-50 border-blue-200'} text-center`}>
          <p className={`text-xs font-body ${isDark ? 'text-bk-cream/60' : 'text-blue-700'}`}>
            Demo: use any email/password
          </p>
        </div>
      </div>
    </div>
  );
}

export function SignupPage() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { signup } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(containerRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' });
  }, []);

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.password || !form.confirmPassword) {
      return toast.error('Please fill all fields');
    }
    if (form.password !== form.confirmPassword) {
      return toast.error('Passwords do not match');
    }
    if (form.password.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }

    setLoading(true);
    try {
      await signup(form);
      navigate('/profile');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed. Email may already exist.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-bk-dark' : 'bg-gradient-to-br from-slate-50 to-slate-100'} px-4 py-20`}>
      <div ref={containerRef} className="w-full max-w-md">
        {/* Header */}
        <button onClick={() => navigate('/login')}
          className={`flex items-center gap-2 mb-6 font-heading font-bold transition-colors ${
            isDark ? 'text-bk-gold hover:text-bk-yellow' : 'text-bk-red hover:text-red-600'
          }`}>
          <ArrowLeft size={20} />
          Back to Login
        </button>

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-4xl font-black mb-4">🍔</div>
          <h1 className={`font-heading text-3xl font-black ${isDark ? 'text-bk-yellow' : 'text-bk-red'}`}>
            Create Account
          </h1>
          <p className={`font-body mt-2 ${isDark ? 'text-bk-cream/50' : 'text-gray-600'}`}>
            Join BK Crown today
          </p>
        </div>

        {/* Form Card */}
        <div className={`rounded-2xl p-8 border ${isDark ? 'bg-bk-dark-2 border-bk-brown-light/20' : 'bg-white border-gray-200'} shadow-lg`}>
          <form onSubmit={handleSignup} className="space-y-4">
            {/* Name */}
            <div>
              <label className={`block text-sm font-heading font-bold mb-2 ${isDark ? 'text-bk-cream' : 'text-gray-900'}`}>
                Full Name
              </label>
              <div className={`flex items-center rounded-lg px-4 py-3 border transition-all ${
                isDark
                  ? 'bg-bk-dark border-bk-brown-light/30 focus-within:border-bk-gold'
                  : 'bg-gray-50 border-gray-300 focus-within:border-bk-red focus-within:ring-1 focus-within:ring-bk-red'
              }`}>
                <User size={18} className={isDark ? 'text-bk-cream/40' : 'text-gray-400'} />
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({...form, name: e.target.value})}
                  placeholder="John Doe"
                  className={`flex-1 ml-2 bg-transparent outline-none ${isDark ? 'text-bk-cream placeholder-bk-cream/30' : 'text-gray-900 placeholder-gray-500'}`}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className={`block text-sm font-heading font-bold mb-2 ${isDark ? 'text-bk-cream' : 'text-gray-900'}`}>
                Email Address
              </label>
              <div className={`flex items-center rounded-lg px-4 py-3 border transition-all ${
                isDark
                  ? 'bg-bk-dark border-bk-brown-light/30 focus-within:border-bk-gold'
                  : 'bg-gray-50 border-gray-300 focus-within:border-bk-red focus-within:ring-1 focus-within:ring-bk-red'
              }`}>
                <Mail size={18} className={isDark ? 'text-bk-cream/40' : 'text-gray-400'} />
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({...form, email: e.target.value})}
                  placeholder="you@example.com"
                  className={`flex-1 ml-2 bg-transparent outline-none ${isDark ? 'text-bk-cream placeholder-bk-cream/30' : 'text-gray-900 placeholder-gray-500'}`}
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className={`block text-sm font-heading font-bold mb-2 ${isDark ? 'text-bk-cream' : 'text-gray-900'}`}>
                Phone Number
              </label>
              <div className={`flex items-center rounded-lg px-4 py-3 border transition-all ${
                isDark
                  ? 'bg-bk-dark border-bk-brown-light/30 focus-within:border-bk-gold'
                  : 'bg-gray-50 border-gray-300 focus-within:border-bk-red focus-within:ring-1 focus-within:ring-bk-red'
              }`}>
                <Phone size={18} className={isDark ? 'text-bk-cream/40' : 'text-gray-400'} />
                <input
                  type="tel"
                  value={form.phone}
                  onChange={e => setForm({...form, phone: e.target.value})}
                  placeholder="+91 XXXXXXXXXX"
                  className={`flex-1 ml-2 bg-transparent outline-none ${isDark ? 'text-bk-cream placeholder-bk-cream/30' : 'text-gray-900 placeholder-gray-500'}`}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className={`block text-sm font-heading font-bold mb-2 ${isDark ? 'text-bk-cream' : 'text-gray-900'}`}>
                Password
              </label>
              <div className={`flex items-center rounded-lg px-4 py-3 border transition-all ${
                isDark
                  ? 'bg-bk-dark border-bk-brown-light/30 focus-within:border-bk-gold'
                  : 'bg-gray-50 border-gray-300 focus-within:border-bk-red focus-within:ring-1 focus-within:ring-bk-red'
              }`}>
                <Lock size={18} className={isDark ? 'text-bk-cream/40' : 'text-gray-400'} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm({...form, password: e.target.value})}
                  placeholder="••••••••"
                  className={`flex-1 ml-2 bg-transparent outline-none ${isDark ? 'text-bk-cream placeholder-bk-cream/30' : 'text-gray-900 placeholder-gray-500'}`}
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className={`block text-sm font-heading font-bold mb-2 ${isDark ? 'text-bk-cream' : 'text-gray-900'}`}>
                Confirm Password
              </label>
              <div className={`flex items-center rounded-lg px-4 py-3 border transition-all ${
                isDark
                  ? 'bg-bk-dark border-bk-brown-light/30 focus-within:border-bk-gold'
                  : 'bg-gray-50 border-gray-300 focus-within:border-bk-red focus-within:ring-1 focus-within:ring-bk-red'
              }`}>
                <Lock size={18} className={isDark ? 'text-bk-cream/40' : 'text-gray-400'} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.confirmPassword}
                  onChange={e => setForm({...form, confirmPassword: e.target.value})}
                  placeholder="••••••••"
                  className={`flex-1 ml-2 bg-transparent outline-none ${isDark ? 'text-bk-cream placeholder-bk-cream/30' : 'text-gray-900 placeholder-gray-500'}`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Signup Button */}
            <button type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-lg font-heading font-bold text-lg transition-all mt-6 ${
                isDark
                  ? 'bg-gold-gradient text-bk-dark hover:shadow-gold disabled:opacity-50'
                  : 'bg-bk-red text-white hover:bg-red-600 disabled:opacity-50'
              }`}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(containerRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' });
  }, []);

  const handleReset = async (e) => {
    e.preventDefault();
    if (!email) return toast.error('Please enter your email');

    setLoading(true);
    setTimeout(() => {
      setSent(true);
      toast.success('✅ Reset link sent to your email!');
      setLoading(false);
    }, 1000);
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-bk-dark' : 'bg-gradient-to-br from-slate-50 to-slate-100'} px-4 py-20`}>
      <div ref={containerRef} className="w-full max-w-md">
        {/* Back Button */}
        <button onClick={() => navigate('/login')}
          className={`flex items-center gap-2 mb-6 font-heading font-bold transition-colors ${
            isDark ? 'text-bk-gold hover:text-bk-yellow' : 'text-bk-red hover:text-red-600'
          }`}>
          <ArrowLeft size={20} />
          Back to Login
        </button>

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-4xl font-black mb-4">🔐</div>
          <h1 className={`font-heading text-3xl font-black ${isDark ? 'text-bk-yellow' : 'text-bk-red'}`}>
            Reset Password
          </h1>
          <p className={`font-body mt-2 ${isDark ? 'text-bk-cream/50' : 'text-gray-600'}`}>
            {sent ? 'Check your email for reset link' : 'Enter your email to reset password'}
          </p>
        </div>

        {/* Form Card */}
        <div className={`rounded-2xl p-8 border ${isDark ? 'bg-bk-dark-2 border-bk-brown-light/20' : 'bg-white border-gray-200'} shadow-lg`}>
          {!sent ? (
            <form onSubmit={handleReset} className="space-y-4">
              <div>
                <label className={`block text-sm font-heading font-bold mb-2 ${isDark ? 'text-bk-cream' : 'text-gray-900'}`}>
                  Email Address
                </label>
                <div className={`flex items-center rounded-lg px-4 py-3 border transition-all ${
                  isDark
                    ? 'bg-bk-dark border-bk-brown-light/30 focus-within:border-bk-gold'
                    : 'bg-gray-50 border-gray-300 focus-within:border-bk-red focus-within:ring-1 focus-within:ring-bk-red'
                }`}>
                  <Mail size={18} className={isDark ? 'text-bk-cream/40' : 'text-gray-400'} />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className={`flex-1 ml-2 bg-transparent outline-none ${isDark ? 'text-bk-cream placeholder-bk-cream/30' : 'text-gray-900 placeholder-gray-500'}`}
                  />
                </div>
              </div>

              <button type="submit"
                disabled={loading}
                className={`w-full py-4 rounded-lg font-heading font-bold text-lg transition-all mt-6 ${
                  isDark
                    ? 'bg-gold-gradient text-bk-dark hover:shadow-gold disabled:opacity-50'
                    : 'bg-bk-red text-white hover:bg-red-600 disabled:opacity-50'
                }`}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          ) : (
            <div className="text-center py-8">
              <div className="text-5xl mb-4">✉️</div>
              <p className={`font-body mb-6 ${isDark ? 'text-bk-cream/70' : 'text-gray-600'}`}>
                We've sent a password reset link to <br />
                <span className="font-bold">{email}</span>
              </p>
              <button onClick={() => navigate('/login')}
                className={`w-full py-4 rounded-lg font-heading font-bold transition-all ${
                  isDark
                    ? 'bg-gold-gradient text-bk-dark hover:shadow-gold'
                    : 'bg-bk-red text-white hover:bg-red-600'
                }`}>
                Back to Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
