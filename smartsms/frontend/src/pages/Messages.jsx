import { useState, useEffect } from 'react';
import { Search, MessageSquare, RefreshCw, Filter, ChevronDown } from 'lucide-react';
import api from '../lib/api';

function timeAgo(date) {
  const d = new Date(date);
  const now = new Date();
  const diff = (now - d) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return d.toLocaleDateString();
}

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const fetchMessages = () => {
    setLoading(true);
    api.get('/sms', { params: debouncedSearch ? { search: debouncedSearch } : {} })
      .then(res => setMessages(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchMessages(); }, [debouncedSearch]);

  const filtered = filter === 'all'
    ? messages
    : messages.filter(m => m.status === filter);

  const counts = {
    all: messages.length,
    delivered: messages.filter(m => m.status === 'delivered').length,
    failed: messages.filter(m => m.status === 'failed').length,
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Message History</h1>
          <p className="text-gray-500 mt-1">Track all your sent messages</p>
        </div>
        <button
          onClick={fetchMessages}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-gray-100 hover:border-indigo-200 hover:bg-indigo-50 transition-all text-gray-600 hover:text-indigo-600 font-medium text-sm"
        >
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      <div className="glass-card overflow-hidden">
        {/* Table toolbar */}
        <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by number or message..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-field pl-10 py-2.5 text-sm"
            />
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
            {[
              { key: 'all', label: 'All' },
              { key: 'delivered', label: 'Delivered' },
              { key: 'failed', label: 'Failed' },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  filter === key
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {label}
                <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
                  filter === key ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-200 text-gray-500'
                }`}>
                  {counts[key]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/80">
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Recipient</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Message</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Type</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Cost</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="px-6 py-4">
                        <div className="h-4 bg-gray-100 rounded animate-pulse" style={{ width: `${60 + Math.random() * 40}%` }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center">
                        <MessageSquare size={28} className="text-gray-300" />
                      </div>
                      <p className="text-gray-400 font-medium">No messages found</p>
                      <p className="text-gray-300 text-sm">Send your first SMS to see it here</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((msg, i) => (
                  <tr key={msg._id || i} className="hover:bg-indigo-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs flex-shrink-0">
                          {msg.recipient?.[msg.recipient.length - 2] || '#'}
                        </div>
                        <span className="font-medium text-gray-900 text-sm font-mono">{msg.recipient}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-600 text-sm max-w-xs truncate" title={msg.message}>
                        {msg.message}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="badge bg-gray-100 text-gray-600 capitalize">{msg.type || 'single'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`badge ${
                        msg.status === 'delivered' ? 'badge-success' :
                        msg.status === 'failed' ? 'badge-error' : 'badge-pending'
                      }`}>
                        {msg.status === 'delivered' ? '✓' : msg.status === 'failed' ? '✗' : '○'}
                        {' '}{msg.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500 text-sm">⚡</span>
                        <span className="text-sm font-medium text-gray-700">{msg.cost || msg.segments || 1}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-400 text-sm">{timeAgo(msg.createdAt)}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table footer */}
        {filtered.length > 0 && (
          <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-between text-sm text-gray-400">
            <span>Showing {filtered.length} of {messages.length} messages</span>
            <span className="text-green-600 font-medium">
              ✓ {counts.delivered} delivered &nbsp; 
              <span className="text-red-500">✗ {counts.failed} failed</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
