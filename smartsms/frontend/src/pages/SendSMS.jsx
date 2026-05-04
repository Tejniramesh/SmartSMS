import { useState, useEffect } from 'react';
import { Send, User, Phone, MessageSquare, AlertCircle, CheckCircle, Sparkles, ChevronDown, Users } from 'lucide-react';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';

const SMS_TYPES = [
  { value: 'single', label: 'Single Recipient', icon: User, desc: 'Send to one number' },
  { value: 'bulk', label: 'Bulk SMS', icon: Users, desc: 'Send to multiple numbers' },
];

function getSegments(msg) {
  return Math.max(1, Math.ceil(msg.length / 160));
}

export default function SendSMS() {
  const [type, setType] = useState('single');
  const [recipients, setRecipients] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [contacts, setContacts] = useState([]);
  const { user, updateCredits } = useAuth();

  useEffect(() => {
    api.get('/contacts').then(res => setContacts(res.data)).catch(() => {});
  }, []);

  const recipientList = recipients
    .split(/[\n,]+/)
    .map(r => r.trim())
    .filter(Boolean);
  const segments = getSegments(message);
  const totalCost = recipientList.length * segments;
  const charCount = message.length;
  const remaining = 160 - (charCount % 160 || 160);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || recipientList.length === 0) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await api.post('/sms/send', {
        recipients: recipientList,
        message,
        type
      });
      setResult({ success: true, data: res.data });
      if (user) updateCredits(Math.max(0, (user.credits || 0) - totalCost));
      setMessage('');
      setRecipients('');
    } catch (err) {
      setResult({ success: false, error: err.response?.data?.message || 'Failed to send' });
    } finally {
      setLoading(false);
    }
  };

  const addFromContact = (contact) => {
    const nums = recipients.trim();
    setRecipients(nums ? `${nums}, ${contact.phone}` : contact.phone);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Send SMS</h1>
        <p className="text-gray-500 mt-1">Compose and send messages instantly</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT: Form */}
        <div className="lg:col-span-2 space-y-5">
          {/* Type selector */}
          <div className="glass-card p-5">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Message Type</p>
            <div className="grid grid-cols-2 gap-3">
              {SMS_TYPES.map(({ value, label, icon: Icon, desc }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setType(value)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    type === value
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-100 bg-white hover:border-gray-200'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-2 ${
                    type === value ? 'bg-indigo-100' : 'bg-gray-100'
                  }`}>
                    <Icon size={18} className={type === value ? 'text-indigo-600' : 'text-gray-500'} />
                  </div>
                  <p className={`font-semibold text-sm ${type === value ? 'text-indigo-700' : 'text-gray-700'}`}>{label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Recipient input */}
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Phone size={14} className="text-indigo-500" />
                {type === 'bulk' ? 'Recipients (comma or newline separated)' : 'Recipient Number'}
              </label>
              {contacts.length > 0 && (
                <div className="relative group">
                  <button className="text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1">
                    From contacts <ChevronDown size={12} />
                  </button>
                  <div className="absolute right-0 top-6 w-56 bg-white rounded-xl shadow-xl border border-gray-100 z-10 hidden group-hover:block">
                    <div className="max-h-44 overflow-y-auto py-2">
                      {contacts.map(c => (
                        <button
                          key={c._id}
                          onClick={() => addFromContact(c)}
                          className="w-full px-4 py-2 text-left hover:bg-indigo-50 flex items-center gap-3"
                        >
                          <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-bold">
                            {c.name[0]}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-800">{c.name}</p>
                            <p className="text-xs text-gray-400">{c.phone}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <textarea
              className="input-field resize-none"
              rows={type === 'bulk' ? 4 : 2}
              placeholder={type === 'bulk' ? '+91 98765 43210\n+91 87654 32109\n...' : '+91 98765 43210'}
              value={recipients}
              onChange={e => setRecipients(e.target.value)}
            />
            {type === 'bulk' && (
              <p className="text-xs text-gray-400 mt-2">
                {recipientList.length} recipient{recipientList.length !== 1 ? 's' : ''} detected
              </p>
            )}
          </div>

          {/* Message */}
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <MessageSquare size={14} className="text-indigo-500" />
                Message Content
              </label>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                charCount > 140 ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'
              }`}>
                {charCount} / 160 chars
              </span>
            </div>
            <textarea
              className="input-field resize-none"
              rows={6}
              placeholder="Type your message here..."
              value={message}
              onChange={e => setMessage(e.target.value)}
              maxLength={480}
            />
            <div className="flex justify-between mt-2 text-xs text-gray-400">
              <span>{remaining} characters until next segment</span>
              <span>{segments} segment{segments !== 1 ? 's' : ''}</span>
            </div>
          </div>

          {/* Result notification */}
          {result && (
            <div className={`rounded-xl p-4 flex items-start gap-3 border ${
              result.success
                ? 'bg-emerald-50 border-emerald-200'
                : 'bg-red-50 border-red-200'
            }`}>
              {result.success
                ? <CheckCircle size={20} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                : <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
              }
              <div>
                <p className={`font-semibold text-sm ${result.success ? 'text-emerald-700' : 'text-red-700'}`}>
                  {result.success ? `✅ ${result.data?.sent} message(s) sent successfully!` : '❌ Failed to send'}
                </p>
                <p className="text-xs mt-1 text-gray-500">
                  {result.success
                    ? `Delivery status: All messages queued for delivery`
                    : result.error
                  }
                </p>
              </div>
            </div>
          )}

          {/* Submit button */}
          <button
            onClick={handleSubmit}
            disabled={loading || !message.trim() || recipientList.length === 0}
            className="btn-primary w-full py-4 text-base flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <span className="relative z-10 flex items-center gap-2">
                <Send size={18} />
                Send {recipientList.length > 1 ? `to ${recipientList.length} Recipients` : 'Message'}
              </span>
            )}
          </button>
        </div>

        {/* RIGHT: Summary */}
        <div className="space-y-5">
          {/* Summary card */}
          <div className="glass-card p-5 sticky top-6">
            <div className="flex items-center gap-2 mb-5">
              <Sparkles size={16} className="text-indigo-500" />
              <h3 className="font-bold text-gray-900">Message Summary</h3>
            </div>

            <div className="space-y-3">
              {[
                { label: 'Type', value: type === 'bulk' ? 'Bulk SMS' : 'Single SMS', icon: '📱' },
                { label: 'Recipients', value: `${recipientList.length} number${recipientList.length !== 1 ? 's' : ''}`, icon: '👥' },
                { label: 'Message Length', value: `${charCount} characters`, icon: '✏️' },
                { label: 'Segments', value: `${segments} segment${segments !== 1 ? 's' : ''}`, icon: '📦' },
                { label: 'Total Cost', value: `${totalCost} credit${totalCost !== 1 ? 's' : ''}`, icon: '⚡', highlight: true },
              ].map(({ label, value, icon, highlight }) => (
                <div key={label} className={`flex items-center justify-between p-3 rounded-xl ${
                  highlight ? 'bg-indigo-50 border border-indigo-100' : 'bg-gray-50'
                }`}>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{icon}</span>
                    <span className={`text-sm ${highlight ? 'text-indigo-700 font-semibold' : 'text-gray-500'}`}>{label}</span>
                  </div>
                  <span className={`text-sm font-bold ${highlight ? 'text-indigo-700' : 'text-gray-800'}`}>{value}</span>
                </div>
              ))}
            </div>

            {/* Credits remaining */}
            <div className="mt-5 pt-4 border-t border-gray-100">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">Credits remaining after send</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-gray-900">
                  {Math.max(0, (user?.credits || 0) - totalCost)}
                </span>
                <span className="text-gray-400 text-sm">/ {user?.credits || 0} total</span>
              </div>
              <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.max(0, Math.min(100, ((Math.max(0, (user?.credits || 0) - totalCost)) / 500) * 100))}%`,
                    background: 'linear-gradient(to right, #4f46e5, #a855f7)'
                  }} />
              </div>
            </div>

            {/* Tips */}
            <div className="mt-5 p-3 rounded-xl bg-amber-50 border border-amber-100">
              <p className="text-xs text-amber-700 font-semibold mb-1">💡 Pro Tip</p>
              <p className="text-xs text-amber-600">
                Messages over 160 characters use multiple segments and cost extra credits.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
