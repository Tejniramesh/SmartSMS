import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Zap, CheckCircle, Mail, Lock, User, ArrowRight, Eye, EyeOff, Sparkles } from 'lucide-react';

const features = [
  { icon: '⚡', text: 'Send bulk SMS to thousands instantly' },
  { icon: '📅', text: 'Schedule delivery at perfect times' },
  { icon: '📊', text: 'Real-time analytics dashboard' },
  { icon: '👥', text: 'Smart contact management' },
];

export default function Login() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: 'demo@smartsms.io', password: 'password' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (mode === 'login') {
        await login(form.email, form.password);
      } else {
        await register(form.name, form.email, form.password);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex overflow-hidden">
      {/* LEFT SIDE */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #3730a3 0%, #4f46e5 30%, #7c3aed 70%, #a855f7 100%)' }}>
        
        {/* Decorative orbs */}
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #c084fc, transparent)' }} />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #818cf8, transparent)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #e879f9, transparent)' }} />

        {/* Floating dots */}
        {[...Array(6)].map((_, i) => (
          <div key={i}
            className="absolute w-2 h-2 rounded-full bg-white/20 animate-float"
            style={{
              top: `${15 + i * 14}%`,
              left: `${10 + (i % 3) * 30}%`,
              animationDelay: `${i * 0.8}s`
            }} />
        ))}

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center border border-white/30">
            <Zap size={24} className="text-white" />
          </div>
          <div>
            <span className="text-white font-bold text-2xl tracking-tight">SmartSMS</span>
            <span className="ml-2 text-xs bg-white/20 text-white px-2 py-0.5 rounded-full font-medium">PRO</span>
          </div>
        </div>

        {/* Main hero text */}
        <div className="relative z-10 flex-1 flex flex-col justify-center">
          <div className="mb-3">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 text-white/80 text-sm border border-white/20">
              <Sparkles size={12} />
              Intelligent Messaging Platform
            </span>
          </div>
          <h2 className="text-5xl font-bold text-white leading-tight mb-4">
            Message smarter.<br />
            <span style={{ color: '#e879f9' }}>Reach faster.</span>
          </h2>
          <p className="text-indigo-200 text-lg leading-relaxed mb-10 max-w-sm">
            The all-in-one SMS platform for modern businesses. Send, track, and optimize your messaging campaigns.
          </p>

          {/* Feature list */}
          <div className="space-y-4">
            {features.map((f, i) => (
              <div key={i} className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-xl flex-shrink-0 border border-white/20 group-hover:bg-white/25 transition-colors">
                  {f.icon}
                </div>
                <span className="text-indigo-100 font-medium">{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom stats */}
        <div className="relative z-10 grid grid-cols-3 gap-4 pt-6 border-t border-white/20">
          {[
            { num: '50K+', label: 'Messages Sent' },
            { num: '99.2%', label: 'Delivery Rate' },
            { num: '2.5K+', label: 'Happy Clients' },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <p className="text-white font-bold text-xl">{s.num}</p>
              <p className="text-indigo-300/70 text-xs mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #4f46e5, #a855f7)' }}>
              <Zap size={20} className="text-white" />
            </div>
            <span className="font-bold text-2xl gradient-text">SmartSMS</span>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {mode === 'login' ? 'Welcome back 👋' : 'Create account ✨'}
          </h2>
          <p className="text-gray-500 mb-8">
            {mode === 'login'
              ? 'Sign in to your SmartSMS dashboard'
              : 'Get started with 500 free credits'}
          </p>

          {error && (
            <div className="mb-5 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm flex items-center gap-2">
              <span className="text-red-400">⚠</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  className="input-field pl-11"
                  placeholder="Your full name"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
            )}

            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                className="input-field pl-11"
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                className="input-field pl-11 pr-12"
                type={showPass ? 'text' : 'password'}
                placeholder="Password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {mode === 'login' && (
              <div className="flex justify-end">
                <button type="button" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4 flex items-center justify-center gap-3 text-base"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span className="relative z-10">{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
                  <ArrowRight size={18} className="relative z-10" />
                </>
              )}
            </button>
          </form>

          {/* Toggle mode */}
          <p className="text-center text-gray-500 mt-6">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
              className="text-indigo-600 font-semibold hover:text-indigo-700"
            >
              {mode === 'login' ? 'Sign up free' : 'Sign in'}
            </button>
          </p>

          {/* Demo credentials */}
          {mode === 'login' && (
            <div className="mt-6 p-4 rounded-xl border-2 border-dashed border-indigo-200 bg-indigo-50/50">
              <p className="text-center text-xs text-indigo-500 font-semibold mb-2 uppercase tracking-wide">Demo Credentials</p>
              <div className="space-y-1.5 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Email:</span>
                  <code className="bg-white px-2 py-0.5 rounded text-indigo-700 font-mono text-xs border border-indigo-100">
                    demo@smartsms.io
                  </code>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Password:</span>
                  <code className="bg-white px-2 py-0.5 rounded text-indigo-700 font-mono text-xs border border-indigo-100">
                    password
                  </code>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setForm({ name: '', email: 'demo@smartsms.io', password: 'password' })}
                className="mt-2 w-full text-xs text-indigo-600 hover:text-indigo-700 font-medium py-1"
              >
                ↑ Auto-fill credentials
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
