import { useState, useEffect } from 'react';
import { UserPlus, Trash2, Users, Search, Phone, Tag, Send } from 'lucide-react';
import api from '../lib/api';
import { useNavigate } from 'react-router-dom';

const GROUPS = ['General', 'VIP', 'Marketing', 'Support', 'Partners'];
const COLORS = ['#4f46e5', '#7c3aed', '#059669', '#d97706', '#dc2626', '#0891b2'];

function getColor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return COLORS[Math.abs(hash) % COLORS.length];
}

export default function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', phone: '', group: 'General' });
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const fetchContacts = () => {
    api.get('/contacts')
      .then(res => setContacts(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchContacts(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone) return;
    setSaving(true);
    setError('');
    try {
      await api.post('/contacts', form);
      setForm({ name: '', phone: '', group: 'General' });
      setSuccess('Contact added successfully!');
      setTimeout(() => setSuccess(''), 3000);
      fetchContacts();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add contact');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this contact?')) return;
    try {
      await api.delete(`/contacts/${id}`);
      setContacts(prev => prev.filter(c => c._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = contacts.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search) ||
    (c.group || '').toLowerCase().includes(search.toLowerCase())
  );

  const grouped = filtered.reduce((acc, c) => {
    const g = c.group || 'General';
    if (!acc[g]) acc[g] = [];
    acc[g].push(c);
    return acc;
  }, {});

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contacts</h1>
          <p className="text-gray-500 mt-1">{contacts.length} contact{contacts.length !== 1 ? 's' : ''} saved</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add Contact Form */}
        <div className="lg:col-span-1">
          <div className="glass-card p-6 sticky top-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                <UserPlus size={18} className="text-indigo-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Add Contact</h3>
                <p className="text-gray-400 text-xs">Save a new recipient</p>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                ⚠ {error}
              </div>
            )}
            {success && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 text-sm">
                ✓ {success}
              </div>
            )}

            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Full Name
                </label>
                <input
                  className="input-field"
                  placeholder="e.g. Arjun Sharma"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    className="input-field pl-10"
                    placeholder="+91 98765 43210"
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Group
                </label>
                <div className="relative">
                  <Tag size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <select
                    className="input-field pl-10 appearance-none cursor-pointer"
                    value={form.group}
                    onChange={e => setForm({ ...form, group: e.target.value })}
                  >
                    {GROUPS.map(g => <option key={g}>{g}</option>)}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="btn-primary w-full py-3 flex items-center justify-center gap-2"
              >
                {saving
                  ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <span className="relative z-10 flex items-center gap-2"><UserPlus size={16} /> Add Contact</span>
                }
              </button>
            </form>

            {/* Stats */}
            <div className="mt-6 pt-5 border-t border-gray-100 grid grid-cols-2 gap-3">
              {[
                { label: 'Total', value: contacts.length, color: '#4f46e5' },
                { label: 'Groups', value: Object.keys(grouped).length, color: '#7c3aed' },
              ].map(({ label, value, color }) => (
                <div key={label} className="p-3 rounded-xl text-center" style={{ background: `${color}10` }}>
                  <p className="text-2xl font-bold" style={{ color }}>{value}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contacts List */}
        <div className="lg:col-span-2 space-y-5">
          {/* Search */}
          <div className="glass-card p-4">
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search contacts by name, phone, or group..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="input-field pl-10 py-2.5 text-sm"
              />
            </div>
          </div>

          {loading ? (
            <div className="glass-card p-8 flex items-center justify-center">
              <div className="w-8 h-8 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="glass-card p-16 flex flex-col items-center gap-4 text-center">
              <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center">
                <Users size={36} className="text-gray-300" />
              </div>
              <p className="text-gray-400 font-medium text-lg">No contacts yet</p>
              <p className="text-gray-300 text-sm">Add your first contact using the form</p>
            </div>
          ) : (
            Object.entries(grouped).map(([group, groupContacts]) => (
              <div key={group} className="glass-card overflow-hidden">
                <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between"
                  style={{ background: 'rgba(249,250,251,0.8)' }}>
                  <div className="flex items-center gap-2">
                    <Tag size={13} className="text-indigo-400" />
                    <span className="font-semibold text-gray-700 text-sm">{group}</span>
                    <span className="bg-indigo-100 text-indigo-600 text-xs px-2 py-0.5 rounded-full font-medium">
                      {groupContacts.length}
                    </span>
                  </div>
                </div>

                <div className="divide-y divide-gray-50">
                  {groupContacts.map((contact) => {
                    const color = getColor(contact.name);
                    return (
                      <div key={contact._id} className="px-5 py-3.5 flex items-center gap-4 hover:bg-indigo-50/30 transition-colors group">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                          style={{ background: `linear-gradient(135deg, ${color}, ${color}99)` }}>
                          {contact.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 text-sm">{contact.name}</p>
                          <p className="text-gray-400 text-xs font-mono mt-0.5">{contact.phone}</p>
                        </div>

                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => navigate(`/send?to=${contact.phone}`)}
                            className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 hover:bg-indigo-200 transition-colors"
                            title="Send SMS"
                          >
                            <Send size={13} />
                          </button>
                          <button
                            onClick={() => handleDelete(contact._id)}
                            className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-400 hover:bg-red-100 hover:text-red-600 transition-colors"
                            title="Delete contact"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
