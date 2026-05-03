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
  input: { width: '100%', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '8px', padding: '10px 14px', color: 'var(--text)', fontSize: '14px', outline: 'none' },
  group: { marginBottom: '16px' },
  btn: { width: '100%', padding: '11px', borderRadius: '8px', border: 'none', background: 'var(--accent)', color: '#0f1117', fontSize: '14px', fontWeight: 600, cursor: 'pointer', marginTop: '6px' },
  link: { textAlign: 'center', marginTop: '18px', fontSize: '13px', color: 'var(--muted)' },
};

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    const res = await register(form.name, form.email, form.password);
    setLoading(false);
    if (res.success) { toast.success('Account created!'); navigate('/dashboard'); }
    else toast.error(res.message);
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.logo}>Create Account</div>
        <div style={s.sub}>Set up your CRM admin access</div>
        <form onSubmit={submit}>
          <div style={s.group}>
            <label style={s.label}>Full Name</label>
            <input style={s.input} name="name" value={form.name} onChange={handle} placeholder="Your Name" required />
          </div>
          <div style={s.group}>
            <label style={s.label}>Email</label>
            <input style={s.input} name="email" type="email" value={form.email} onChange={handle} placeholder="admin@example.com" required />
          </div>
          <div style={s.group}>
            <label style={s.label}>Password</label>
            <input style={s.input} name="password" type="password" value={form.password} onChange={handle} placeholder="Min 6 characters" required />
          </div>
          <button style={s.btn} type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Account'}</button>
        </form>
        <div style={s.link}>Already have an account? <Link to="/login" style={{ color: 'var(--accent)' }}>Sign in</Link></div>
      </div>
    </div>
  );
}
