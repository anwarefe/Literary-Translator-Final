import React, { useState } from 'react';
import { supabase, signUpUser } from '../services/supabase.ts';
import { GoogleIcon } from './icons.tsx';

const Auth: React.FC = () => {
  // 🔐 حالة تسجيل الدخول (login)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // 📝 حالة نافذة التسجيل (Sign Up Modal)
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [signUpFirstName, setSignUpFirstName] = useState('');
  const [signUpLastName, setSignUpLastName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');

  // ▶️ تسجيل الدخول – Email + Password فقط
  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) setError(error.message);
    setLoading(false);
  };

  // 🆕 فتح نافذة التسجيل
  const openSignUpModal = () => {
    setError(null);
    setMessage(null);
    setSignUpEmail(email || '');
    setSignUpPassword('');
    setSignUpFirstName('');
    setSignUpLastName('');
    setIsSignUpOpen(true);
  };

  // ✅ تنفيذ التسجيل من النافذة المنبثقة
  const handleSignUpSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      await signUpUser(
        signUpEmail,
        signUpPassword,
        signUpFirstName,
        signUpLastName
      );

      setMessage('Check your email for the verification link!');
      setIsSignUpOpen(false);
      setEmail(signUpEmail); // نملأ إيميل الدخول تلقائياً
    } catch (e: any) {
      setError(e.message || 'An error occurred while signing up.');
    } finally {
      setLoading(false);
    }
  };

  // 🔑 نسيت كلمة المرور
  const handleResetPassword = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (!email) {
      setError('من فضلك أدخل البريد الإلكتروني أولاً.');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) {
      setError(error.message);
    } else {
      setMessage('تم إرسال رابط استعادة كلمة المرور إلى بريدك الإلكتروني.');
    }
    setLoading(false);
  };

  // 🔓 تسجيل الدخول باستخدام Google
  const handleGoogleSignIn = async () => {
    setError(null);
    setMessage(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-slate-800/50 rounded-xl shadow-lg ring-1 ring-slate-700 relative">
        <h1 className="text-3xl font-bold text-center text-sky-400">
          Welcome
        </h1>
        <p className="text-center text-slate-400">
          Sign in to access the translator
        </p>

        {error && (
          <div className="p-3 text-center text-red-400 bg-red-900/20 rounded-lg">
            {error}
          </div>
        )}
        {message && (
          <div className="p-3 text-center text-green-400 bg-green-900/20 rounded-lg">
            {message}
          </div>
        )}

        {/* 🔐 نموذج تسجيل الدخول – Email + Password فقط */}
        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-400"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 mt-1 text-slate-200 bg-slate-900 border border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="you@example.com"
              disabled={loading}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-400"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              required
              minLength={6}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 mt-1 text-slate-200 bg-slate-900 border border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="••••••••"
              disabled={loading}
            />
            <button
              type="button"
              onClick={handleResetPassword}
              disabled={loading || !email}
              className="mt-2 text-xs text-sky-400 hover:underline disabled:opacity-50"
            >
              نسيت كلمة المرور؟
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-sky-500 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
            <button
              type="button"
              onClick={openSignUpModal}
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-slate-600 rounded-md shadow-sm text-sm font-medium text-sky-300 bg-slate-800 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-sky-500 disabled:opacity-50"
            >
              Sign Up
            </button>
          </div>
        </form>

        {/* فاصل */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-slate-800 text-slate-500">
              Or continue with
            </span>
          </div>
        </div>

        {/* زر جوجل فقط */}
        <div className="space-y-4">
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full inline-flex items-center justify-center py-2 px-4 border border-slate-600 rounded-md shadow-sm bg-slate-800 text-sm font-medium text-slate-300 hover:bg-slate-700 disabled:opacity-50"
          >
            <GoogleIcon className="w-5 h-5 mr-3" /> Continue with Google
          </button>
        </div>

        {/* 🪟 نافذة التسجيل المنبثقة */}
        {isSignUpOpen && (
          <div className="fixed inset-0 bg-slate-900/70 flex items-center justify-center z-50">
            <div className="w-full max-w-md bg-slate-800 rounded-xl shadow-lg ring-1 ring-slate-700 p-6 space-y-4">
              <h2 className="text-xl font-semibold text-sky-400 text-center">
                Create a new account
              </h2>

              <form className="space-y-3" onSubmit={handleSignUpSubmit}>
                <div>
                  <label
                    htmlFor="signup-first-name"
                    className="block text-sm font-medium text-slate-400"
                  >
                    First Name
                  </label>
                  <input
                    id="signup-first-name"
                    type="text"
                    value={signUpFirstName}
                    required
                    onChange={(e) => setSignUpFirstName(e.target.value)}
                    className="w-full px-3 py-2 mt-1 text-slate-200 bg-slate-900 border border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder="First Name"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label
                    htmlFor="signup-last-name"
                    className="block text-sm font-medium text-slate-400"
                  >
                    Last Name
                  </label>
                  <input
                    id="signup-last-name"
                    type="text"
                    value={signUpLastName}
                    required
                    onChange={(e) => setSignUpLastName(e.target.value)}
                    className="w-full px-3 py-2 mt-1 text-slate-200 bg-slate-900 border border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder="Last Name"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label
                    htmlFor="signup-email"
                    className="block text-sm font-medium text-slate-400"
                  >
                    Email
                  </label>
                  <input
                    id="signup-email"
                    type="email"
                    value={signUpEmail}
                    required
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    className="w-full px-3 py-2 mt-1 text-slate-200 bg-slate-900 border border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder="you@example.com"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label
                    htmlFor="signup-password"
                    className="block text-sm font-medium text-slate-400"
                  >
                    Password
                  </label>
                  <input
                    id="signup-password"
                    type="password"
                    value={signUpPassword}
                    required
                    minLength={6}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    className="w-full px-3 py-2 mt-1 text-slate-200 bg-slate-900 border border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder="••••••••"
                    disabled={loading}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsSignUpOpen(false)}
                    className="w-1/2 py-2 px-4 rounded-md border border-slate-600 text-sm font-medium text-slate-300 bg-slate-800 hover:bg-slate-700"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-2 px-4 rounded-md text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 disabled:opacity-50"
                    disabled={loading}
                  >
                    {loading ? 'Creating...' : 'Create Account'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;
