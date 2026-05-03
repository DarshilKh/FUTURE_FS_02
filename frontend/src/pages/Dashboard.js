import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const statCard = (label, value, color, sub) => (
  <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px 22px' }}>
    <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: '10px' }}>{label}</div>
    <div style={{ fontSize: '30px', fontWeight: 600, fontFamily: 'var(--mono)', color: color || 'var(--text)' }}>{value}</div>
    <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '6px' }}>{sub}</div>
    <div style={{ height: '3px', background: 'var(--surface2)', borderRadius: '4px', marginTop: '12px' }}>
      <div style={{ height: '100%', borderRadius: '4px', background: color || 'var(--accent)', width: `${Math.min((value / 20) * 100, 100)}%`, transition: '.5s' }} />
    </div>
  </div>
);

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/leads?limit=5');
        setStats(data.stats);
        setRecent(data.leads);
      } catch (e) {
        toast.error('Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const badge = (status) => {
    const cfg = { new: ['#6c8fff', 'New'], contacted: ['#ffb347', 'Contacted'], converted: ['#3cf0b0', 'Converted'], lost: ['#ff6b6b', 'Lost'] };
    const [color, label] = cfg[status] || ['var(--muted)', status];
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '3px 10px', borderRadius: '20px', fontSize: '11.5px', fontWeight: 600, fontFamily: 'var(--mono)', background: `${color}18`, color, border: `1px solid ${color}33` }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: color, display: 'inline-block' }} />
        {label}
      </span>
    );
  };

  if (loading) return <div style={{ padding: '40px', color: 'var(--muted)', fontSize: '14px' }}>Loading dashboard...</div>;

  const convRate = stats?.total ? Math.round((stats.converted / stats.total) * 100) : 0;

  return (
    <div>
      {/* Topbar */}
      <div style={{ padding: '20px 28px', borderBottom: '1px solid var(--border)', background: 'var(--surface)', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ fontSize: '15px', fontWeight: 600 }}>Dashboard</div>
        <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>Welcome back — here's your lead overview</div>
      </div>

      <div style={{ padding: '24px 28px' }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '28px' }}>
          {statCard('Total Leads', stats?.total || 0, 'var(--text)', 'All time')}
          {statCard('New / Unread', stats?.new || 0, 'var(--warn)', 'Awaiting contact')}
          {statCard('Contacted', stats?.contacted || 0, 'var(--accent)', 'In pipeline')}
          {statCard('Conversion Rate', `${convRate}%`, 'var(--accent2)', `${stats?.converted || 0} converted`)}
        </div>

        {/* Recent leads */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '14px', fontWeight: 600 }}>Recent Leads</div>
            <a href="/leads" style={{ fontSize: '12px', color: 'var(--accent)' }}>View all →</a>
          </div>
          {recent.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--muted)', fontSize: '14px' }}>No leads yet. Add your first lead!</div>
          ) : recent.map((l) => (
            <div key={l._id} style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr', padding: '14px 20px', borderBottom: '1px solid var(--border)', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 500 }}>{l.name}</div>
                <div style={{ fontSize: '12px', color: 'var(--muted)', fontFamily: 'var(--mono)', marginTop: '2px' }}>{l.email}</div>
              </div>
              <div style={{ fontSize: '12px', fontFamily: 'var(--mono)', color: 'var(--muted)' }}>{l.phone || '—'}</div>
              <div><span style={{ fontSize: '11.5px', fontFamily: 'var(--mono)', background: 'var(--surface2)', border: '1px solid var(--border)', padding: '3px 8px', borderRadius: '5px', color: 'var(--muted)' }}>{l.source}</span></div>
              <div>{badge(l.status)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
