import React, { useState } from 'react';
import {
  Lock,
  Mail,
  User,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Sparkles,
  ShieldCheck,
  Wrench,
  Eye,
  EyeOff,
  Check,
  Zap,
} from 'lucide-react';
import { signInWithGoogle, signInWithEmail, signUpWithEmail } from '../lib/supabase';
import { AuthUser } from '../types';

interface LoginPageProps {
  onAuthSuccess: (user: AuthUser, message: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onAuthSuccess }) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signup');
  const [role, setRole] = useState<'customer' | 'artisan'>('customer');

  // Form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Status
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<string | null>(null);

  // Google OAuth Handler
  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setErrorMessage(null);
    try {
      const { user, error } = await signInWithGoogle();
      setIsGoogleLoading(false);
      if (error) {
        setErrorMessage(error);
        return;
      }
      if (user) {
        onAuthSuccess(user, `Signed in with Google as ${user.fullName}`);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to initiate Google sign-in');
      setIsGoogleLoading(false);
    }
  };

  // Form Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessInfo(null);
    setIsLoading(true);

    if (mode === 'signup') {
      if (!fullName.trim()) {
        setErrorMessage('Please enter your full name');
        setIsLoading(false);
        return;
      }
      if (password.length < 6) {
        setErrorMessage('Password must be at least 6 characters long');
        setIsLoading(false);
        return;
      }

      const { user, error } = await signUpWithEmail(email, password, fullName, phone, role);
      setIsLoading(false);

      if (error) {
        setErrorMessage(error);
        return;
      }

      if (user) {
        onAuthSuccess(user, `Welcome to HireNaija, ${user.fullName}!`);
      } else {
        setSuccessInfo('Account created! Please sign in with your email and password.');
        setMode('signin');
      }
    } else {
      // Sign In
      const { user, error } = await signInWithEmail(email, password);
      setIsLoading(false);

      if (error) {
        setErrorMessage(error);
        return;
      }

      if (user) {
        onAuthSuccess(user, `Welcome back, ${user.fullName}!`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between selection:bg-emerald-600 selection:text-white">
      {/* Top Brand Bar */}
      <div className="w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="w-9 h-9 rounded-xl bg-emerald-600 text-white font-extrabold flex items-center justify-center text-sm shadow-md">
            HN
          </span>
          <div>
            <span className="text-lg font-black tracking-tight text-white block leading-none">
              HireNaija
            </span>
            <span className="text-[10px] text-emerald-400 font-medium tracking-wide">
              Verified Nigerian Artisan Directory
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 hidden sm:inline">Registration Required</span>
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold text-[10px]">
            Protected Access
          </span>
        </div>
      </div>

      {/* Main Content: Split Hero & Signup/Login Card */}
      <div className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-16">
        {/* Left Side: Value Proposition for Nigerian Enterprise */}
        <div className="flex-1 max-w-xl text-center lg:text-left space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>CAC &amp; Identity-Verified Artisan Network</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Sign Up to Access Verified Nigerian Artisans
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Create your account to unlock verified Nigerian mechanics, electricians, tailors, plumbers,
            and craft specialists with direct WhatsApp messaging and neighborhood job requests.
          </p>

          {/* Key Value Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-left">
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-800/60 border border-slate-800">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Direct WhatsApp Connect</div>
                <div className="text-[11px] text-slate-400">1-tap chat with real artisans</div>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-800/60 border border-slate-800">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Verified Customer Reviews</div>
                <div className="text-[11px] text-slate-400">Authentic neighborhood feedback</div>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-800/60 border border-slate-800">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                <Wrench className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Neighborhood Job Board</div>
                <div className="text-[11px] text-slate-400">Post urgent repair requests free</div>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-800/60 border border-slate-800">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                <Zap className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">List Your Business</div>
                <div className="text-[11px] text-slate-400">Get discovered by local clients</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: The Sign Up / Sign In Card */}
        <div className="w-full max-w-md bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-semibold tracking-wider uppercase text-emerald-300">
                HireNaija Access Portal
              </div>
              <span className="text-[10px] font-bold bg-emerald-600/60 text-white px-2 py-0.5 rounded-full border border-emerald-400/30">
                {mode === 'signup' ? 'Step 1: Sign Up' : 'Account Sign In'}
              </span>
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight">
              {mode === 'signup' ? 'Create Your Account' : 'Welcome Back'}
            </h2>
            <p className="text-xs text-emerald-100/90 mt-1">
              {mode === 'signup'
                ? 'Join to access artisan contacts, quote requests, and jobs'
                : 'Sign in to access your HireNaija dashboard and directory'}
            </p>
          </div>

          <div className="p-6 space-y-4">
            {/* Error Feedback */}
            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-800">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1 leading-relaxed">{errorMessage}</div>
              </div>
            )}

            {/* Success Feedback */}
            {successInfo && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2.5 text-xs text-emerald-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="flex-1 leading-relaxed">{successInfo}</div>
              </div>
            )}

            {/* Google OAuth Login */}
            <div>
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isGoogleLoading || isLoading}
                className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-3 cursor-pointer disabled:opacity-60"
              >
                {isGoogleLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-700" />
                    <span>Signing in with Google...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>{mode === 'signup' ? 'Sign Up with Google' : 'Sign In with Google'}</span>
                  </>
                )}
              </button>
            </div>

            {/* Divider */}
            <div className="relative flex items-center justify-center">
              <div className="border-t border-slate-200 w-full" />
              <span className="bg-white px-2.5 text-[10px] uppercase tracking-wider text-slate-400 font-semibold shrink-0">
                or use email
              </span>
            </div>

            {/* Role Toggle for Signup */}
            {mode === 'signup' && (
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  I am joining as:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('customer')}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-colors ${
                      role === 'customer'
                        ? 'border-emerald-700 bg-emerald-50 text-emerald-950 font-bold ring-1 ring-emerald-700'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-xs">👤 Customer</div>
                    <div className="text-[10px] text-slate-500">Hire artisans &amp; post jobs</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('artisan')}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-colors ${
                      role === 'artisan'
                        ? 'border-emerald-700 bg-emerald-50 text-emerald-950 font-bold ring-1 ring-emerald-700'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-xs">🛠️ Artisan Pro</div>
                    <div className="text-[10px] text-slate-500">List business &amp; get clients</div>
                  </button>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Babatunde Adeyemi"
                      className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 placeholder:text-slate-400"
                    />
                  </div>
                </div>
              )}

              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone Number (WhatsApp)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs">🇳🇬</span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0803 123 4567"
                      className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 placeholder:text-slate-400"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full pl-9 pr-9 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || isGoogleLoading}
                className="w-full mt-2 py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-sm flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{mode === 'signup' ? 'Creating Account...' : 'Signing In...'}</span>
                  </>
                ) : mode === 'signup' ? (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Create Free Account</span>
                  </>
                ) : (
                  <span>Sign In</span>
                )}
              </button>
            </form>

            {/* Switch Signin / Signup */}
            <div className="pt-3 text-center text-xs text-slate-600 border-t border-slate-100 flex items-center justify-between">
              {mode === 'signup' ? (
                <>
                  <span>Already have an account?</span>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signin');
                      setErrorMessage(null);
                    }}
                    className="text-emerald-700 font-bold hover:underline cursor-pointer"
                  >
                    Sign In
                  </button>
                </>
              ) : (
                <>
                  <span>New to HireNaija?</span>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signup');
                      setErrorMessage(null);
                    }}
                    className="text-emerald-700 font-bold hover:underline cursor-pointer"
                  >
                    Sign Up Free
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-800/80 py-4 px-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} HireNaija Technologies Ltd. · Account Required to Access Directory
      </div>
    </div>
  );
};
