import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, CheckCircle, XCircle, Users, Zap, Send, TrendingUp, ArrowRight, Activity } from 'lucide-react';
import api from '../lib/api';

const statCards = [
  {
    key: 'totalSent',
    label: 'Total Sent',
    icon: Send,
    gradient: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
    glow: 'rgba(79,70,229,0.3)',
    bg: 'rgba(79,70,229,0.08)',
    iconBg: 'rgba(79,70,229,0.15)',
    textColor: '#4f46e5',
    lightBg: '#eef2ff',
    suffix: 'messages'
  },
  {
    key: 'delivered',
    label: 'Delivered',
    icon: CheckCircle,
    gradient: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
    glow: 'rgba(5,150,105,0.3)',
    bg: 'rgba(5,150,105,0.08)',
    iconBg: 'rgba(5,150,105,0.15)',
    textColor: '#059669',
    lightBg: '#ecfdf5',
    suffix: 'delivered'
  },
  {
    key: 'failed',
    label: 'Failed',
    icon: XCircle,
    gradient: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
    glow: 'rgba(220,38,38,0.3)',
    bg: 'rgba(220,38,38,0.08)',
    iconBg: 'rgba(220,38,38,0.15)',
    textColor: '#dc2626',
    lightBg: '#fef2f2',
    suffix: 'failed'
  },
  {
    key: 'contacts',
    label: 'Contacts',
    icon: Users,
    gradient: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
    glow: 'rgba(217,119,6,0.3)',
    bg: 'rgba(217,119,6,0.08)',
    iconBg: 'rgba(217,119,6,0.15)',
    textColor: '#d97706',
    lightBg: '#fffbeb',
    suffix: 'contacts'
  },
  {
    key: 'credits',
    label: 'Credits Left',
    icon: Zap,
    gradient: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
    glow: 'rgba(124,58,237,0.3)',
    bg: 'rgba(124,58,237,0.08)',
    iconBg: 'rgba(124,58,237,0.15)',
    textColor: '#7c3aed',
    lightBg: '#faf5ff',
    suffix: 'available'
  },
];

const recentActivity = [
  { num: '+91 98765 43210', msg: 'Your OTP is 847291', status: 'delivered', time: '2m ago' },
  { num: '+91 87654 32109', msg: 'Flash Sale! 50% off today only', status: 'delivered', time: '15m ago' },
  { num: '+91 76543 21098', msg: 'Your package has been shipped', status: 'failed', time: '1h ago' },
  { num: '+91 65432 10987', msg: 'Welcome to SmartSMS platform!', status: 'delivered', time: '3h ago' },
];

export default function Dashboard() {
  const [stats, setStats] = useState({ totalSent: 0, delivered: 0, failed: 0, contacts: 0, credits: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/dashboard/stats')
      .then(res => setStats(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const deliveryRate = stats.totalSent > 0
    ? Math.round((stats.delivered / stats.totalSent) * 100)
    : 0;

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Overview</h1>
          <p className="text-gray-500 mt-1">Track your messaging performance at a glance</p>
        </div>
        <button
          onClick={() => navigate('/send')}
          className="btn-primary flex items-center gap-2 px-5 py-3"
        >
          <span className="relative z-10 flex items-center gap-2">
            <Send size={16} />
            Send SMS
          </span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-5">
        {statCards.map((card) => {
          const Icon = card.icon;
          const value = stats[card.key] ?? 0;
          return (
            <div
              key={card.key}
              className="stat-card"
              style={{ background: card.lightBg }}
            >
              {/* Top row */}
              <div className="flex items-start justify-between mb-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ background: card.iconBg }}>
                  <Icon size={20} style={{ color: card.textColor }} />
                </div>
                <TrendingUp size={14} style={{ color: card.textColor }} className="opacity-50 mt-1" />
              </div>

              {/* Value */}
              <div className="mb-1">
                {loading ? (
                  <div className="h-9 w-20 bg-gray-200 rounded-lg animate-pulse" />
                ) : (
                  <p className="text-3xl font-bold" style={{ color: card.textColor }}>
                    {value.toLocaleString()}
                  </p>
                )}
              </div>

              <p className="text-gray-600 font-semibold text-sm">{card.label}</p>
              <p className="text-gray-400 text-xs mt-0.5">{card.suffix}</p>
            </div>
          );
        })}
      </div>

      {/* Middle row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Delivery Rate Card */}
        <div className="glass-card p-6 col-span-1">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-900">Delivery Rate</h3>
            <Activity size={16} className="text-indigo-400" />
          </div>
          
          <div className="flex items-end gap-3 mb-4">
            <span className="text-5xl font-bold gradient-text">{deliveryRate}%</span>
            <span className="text-gray-400 text-sm mb-2">success rate</span>
          </div>

          {/* Progress bar */}
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                width: `${deliveryRate}%`,
                background: 'linear-gradient(to right, #4f46e5, #a855f7)'
              }}
            />
          </div>

          <div className="flex justify-between mt-2 text-xs text-gray-400">
            <span>{stats.delivered} delivered</span>
            <span>{stats.failed} failed</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass-card p-6 col-span-1">
          <h3 className="font-bold text-gray-900 mb-5">Quick Actions</h3>
          <div className="space-y-3">
            {[
              { label: 'Send New SMS', icon: Send, path: '/send', color: '#4f46e5' },
              { label: 'View Messages', icon: MessageSquare, path: '/messages', color: '#7c3aed' },
              { label: 'Manage Contacts', icon: Users, path: '/contacts', color: '#059669' },
            ].map(({ label, icon: Icon, path, color }) => (
              <button
                key={path}
                onClick={() => navigate(path)}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group text-left"
              >
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: `${color}15` }}>
                  <Icon size={16} style={{ color }} />
                </div>
                <span className="font-medium text-gray-700 group-hover:text-gray-900 flex-1">{label}</span>
                <ArrowRight size={14} className="text-gray-400 group-hover:text-gray-600" />
              </button>
            ))}
          </div>
        </div>

        {/* Credit Usage */}
        <div className="glass-card p-6 col-span-1"
          style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white">Credit Usage</h3>
            <Zap size={16} className="text-yellow-400" />
          </div>

          <div className="mb-6">
            <p className="text-indigo-200 text-sm mb-1">Remaining</p>
            <p className="text-5xl font-bold text-white">{stats.credits}</p>
            <p className="text-indigo-300 text-sm mt-1">of 500 credits</p>
          </div>

          <div className="h-2 bg-white/10 rounded-full mb-3">
            <div className="h-full rounded-full"
              style={{
                width: `${Math.min(100, (stats.credits / 500) * 100)}%`,
                background: 'linear-gradient(to right, #818cf8, #c084fc)'
              }} />
          </div>

          <button
            onClick={() => navigate('/send')}
            className="w-full py-2.5 rounded-xl text-sm font-semibold text-indigo-900 mt-2"
            style={{ background: 'linear-gradient(135deg, #c7d2fe, #e879f9)' }}
          >
            Use Credits →
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass-card overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-gray-900">Recent Activity</h3>
          <button
            onClick={() => navigate('/messages')}
            className="text-sm text-indigo-600 font-medium hover:text-indigo-700 flex items-center gap-1"
          >
            View all <ArrowRight size={14} />
          </button>
        </div>
        <div className="divide-y divide-gray-50">
          {recentActivity.map((item, i) => (
            <div key={i} className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
              <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0">
                <MessageSquare size={15} className="text-indigo-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 text-sm">{item.num}</p>
                <p className="text-gray-400 text-xs truncate mt-0.5">{item.msg}</p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className={`badge ${item.status === 'delivered' ? 'badge-success' : 'badge-error'}`}>
                  {item.status === 'delivered' ? '✓' : '✗'} {item.status}
                </span>
                <span className="text-gray-400 text-xs">{item.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
