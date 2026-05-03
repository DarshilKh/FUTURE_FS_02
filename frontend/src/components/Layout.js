import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const s = {
  app: { display: 'grid', gridTemplateColumns: '220px 1fr', minHeight: '100vh' },
  sidebar: { background: 'var(--surface)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', padding: '0' },
  logo: { padding: '22px 20px 18px', borderBottom: '1px solid var(--border)' },
  logoH: { fontSize: '17px', fontWeight: 600, color: 'var(--text)', letterSpacing: '-.3px' },
  logoSub: { fontSize: '11px', color: 'var(--muted)', fontFamily: 'var(--mono)', marginTop: '2px' },
  navSection: { fontSize: '10px', color: 'var(--muted)', padding: '18px 20px 6px', letterSpacing: '.08em', fontWeight: 600, textTransform: 'uppercase' },
  footer: { marginTop: 'auto', padding: '16px 20px', borderTop: '1px solid var(--border)' },
  avatar: { width: '30px', height: '30px', borderRadius: '50%', background: 'linear-gradient(135deg,#6c8fff,#3cf0b0)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 600, color: '#0f1117' },
  main: { background: 'var(--bg)', overflow: 'auto', display: 'flex', flexDirection: 'column' },
  logoutBtn: { background: 'none', border: 'none', color: 'var(--muted)', fontSize: '12px', cursor: 'pointer', padding: '4px 0', marginTop: '6px' },
};

const navStyle = ({ isActive }) => ({
  display: 'flex', alignItems: 'center', gap: '10px',
  padding: '10px 20px', fontSize: '13.5px', color: isActive ? 'var(--accent)' : 'var(--muted)',
  background: isActive ? 'rgba(108,143,255,.08)' : 'transparent',
  borderLeft: isActive ? '2px solid var(--accent)' : '2px solid transparent',
  transition: '.15s', textDecoration: 'none',
});

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
    navigate('/login');
  };

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'AD';

  return (
    <div style={s.app}>
      <aside style={s.sidebar}>
        <div style={s.logo}>
          <div style={s.logoH}>LeadFlow CRM</div>
          <div style={s.logoSub}>Mini CRM · Future Interns</div>
        </div>
        <div style={s.navSection}>Workspace</div>
        <NavLink to="/dashboard" style={navStyle}>◈ Dashboard</NavLink>
        <NavLink to="/leads" style={navStyle}>◎ All Leads</NavLink>
        <div style={s.footer}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={s.avatar}>{initials}</div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 500 }}>{user?.name}</div>
              <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{user?.role}</div>
            </div>
          </div>
          <button style={s.logoutBtn} onClick={handleLogout}>→ Sign out</button>
        </div>
      </aside>
      <main style={s.main}>
        <Outlet />
      </main>
    </div>
  );
}
