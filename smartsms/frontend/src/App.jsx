import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import SendSMS from './pages/SendSMS';
import Messages from './pages/Messages';
import Contacts from './pages/Contacts';
import Layout from './components/Layout';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)'}}>
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
        <p className="text-white font-semibold text-lg">Loading SmartSMS...</p>
      </div>
    </div>
  );
  return user ? children : <Navigate to="/login" />;
}

function PublicRoute({ children }) {
  const { user } = useAuth();
  return user ? <Navigate to="/dashboard" /> : children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route index element={<Navigate to="/dashboard" />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="send" element={<SendSMS />} />
            <Route path="messages" element={<Messages />} />
            <Route path="contacts" element={<Contacts />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
