import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const s = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', padding: '20px' },
  card: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '36px', width: '100%', maxWidth: '420px' },
  logo: { fontSize: '20px', fontWeight: 600, color: 'var(--text)', marginBottom: '6px' },
  sub: { fontSize: '13px', color: 'var(--muted)', marginBottom: '28px' },
  label: { display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: '6px' },
  input: { width: '100%', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '8px', padding: '10px 14px', color: 'var(--text)', fontSize: '14px', outline: 'none', transition: '.15s' },
  group: { marginBottom: '16px' },
  btn: { width: '100%', padding: '11px', borderRadius: '8px', border: 'none', background: 'var(--accent)', color: '#0f1117', fontSize: '14px', fontWeight: 600, cursor: 'pointer', marginTop: '6px', transition: '.15s' },
  link: { textAlign: 'center', marginTop: '18px', fontSize: '13px', color: 'var(--muted)' },
};

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await login(form.email, form.password);
    setLoading(false);
    if (res.success) { toast.success('Welcome back!'); navigate('/dashboard'); }
    else toast.error(res.message);
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.logo}>LeadFlow CRM</div>
        <div style={s.sub}>Sign in to your admin panel</div>
        <form onSubmit={submit}>
          <div style={s.group}>
            <label style={s.label}>Email</label>
            <input style={s.input} name="email" type="email" value={form.email} onChange={handle} placeholder="admin@example.com" required />
          </div>
          <div style={s.group}>
            <label style={s.label}>Password</label>
            <input style={s.input} name="password" type="password" value={form.password} onChange={handle} placeholder="••••••••" required />
          </div>
          <button style={s.btn} type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</button>
        </form>
        <div style={s.link}>Don't have an account? <Link to="/register" style={{ color: 'var(--accent)' }}>Register</Link></div>
      </div>
    </div>
  );
}
