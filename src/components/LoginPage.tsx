import { useState } from 'react';
import { Heart, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import clsx from 'clsx';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@healthos.gov.in');
  const [password, setPassword] = useState('Admin@123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const ok = await login(email, password);
    setLoading(false);
    if (!ok) setError('Invalid credentials. Try admin@healthos.gov.in / Admin@123');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8 border border-white/10">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex w-16 h-16 bg-blue-600 rounded-2xl items-center justify-center mb-4 shadow-lg shadow-blue-500/30">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">HealthOS AI</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">District Health Management System</p>
            <div className="inline-flex items-center gap-1.5 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 text-green-700 dark:text-green-400 text-xs px-3 py-1 rounded-full mt-3">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              UP State Health Mission
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-start gap-2 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-xl px-4 py-3 text-sm text-red-700 dark:text-red-400 animate-slide-in-up">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className={clsx(
                  'w-full px-4 py-3 rounded-xl border text-sm',
                  'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700',
                  'text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                  'transition-all'
                )}
                placeholder="officer@healthos.gov.in"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={clsx(
                    'w-full px-4 py-3 pr-12 rounded-xl border text-sm',
                    'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700',
                    'text-gray-900 dark:text-white placeholder-gray-400',
                    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                    'transition-all'
                  )}
                  autoComplete="current-password"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={clsx(
                'w-full py-3 rounded-xl font-semibold text-white text-sm',
                'bg-blue-600 hover:bg-blue-700 active:bg-blue-800',
                'shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40',
                'transition-all duration-200',
                'disabled:opacity-60 disabled:cursor-not-allowed',
                'flex items-center justify-center gap-2'
              )}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in…
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Demo credentials hint */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
            <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 mb-2">Demo Credentials</p>
            <div className="space-y-1 text-xs text-blue-600 dark:text-blue-500">
              <p><span className="font-medium">Email:</span> admin@healthos.gov.in</p>
              <p><span className="font-medium">Password:</span> Admin@123</p>
            </div>
          </div>
        </div>

        <p className="text-center text-blue-300 text-xs mt-6">
          HealthOS AI v1.0 · Kanpur District, Uttar Pradesh
        </p>
      </div>
    </div>
  );
}
