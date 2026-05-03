import React, { useEffect, useState, useCallback } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const SOURCES = ['Contact Form', 'LinkedIn', 'Referral', 'Google Ads', 'Cold Email', 'Other'];
const STATUSES = ['new', 'contacted', 'converted', 'lost'];

const statusCfg = {
  new:       { color: '#6c8fff', label: 'New' },
  contacted: { color: '#ffb347', label: 'Contacted' },
  converted: { color: '#3cf0b0', label: 'Converted' },
  lost:      { color: '#ff6b6b', label: 'Lost' },
};

const Badge = ({ status }) => {
  const { color, label } = statusCfg[status] || { color: 'var(--muted)', label: status };
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 20, fontSize: 11.5, fontWeight: 600, fontFamily: 'var(--mono)', background: `${color}18`, color, border: `1px solid ${color}33` }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: color, display: 'inline-block' }} />
      {label}
    </span>
  );
};

const inputStyle = { width: '100%', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, padding: '9px 13px', color: 'var(--text)', fontSize: 13.5, outline: 'none', fontFamily: 'inherit' };
const labelStyle = { display: 'block', fontSize: 11.5, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 5 };
const btnStyle = (primary) => ({ padding: '8px 18px', borderRadius: 8, border: `1px solid ${primary ? 'var(--accent)' : 'var(--border)'}`, background: primary ? 'var(--accent)' : 'transparent', color: primary ? '#0f1117' : 'var(--text)', fontSize: 13, fontWeight: primary ? 600 : 400, cursor: 'pointer', fontFamily: 'inherit' });

const emptyForm = { name: '', email: '', phone: '', company: '', source: 'Contact Form', status: 'new' };

export default function Leads() {
  const [leads, setLeads]         = useState([]);
  const [stats, setStats]         = useState({});
  const [search, setSearch]       = useState('');
  const [statusF, setStatusF]     = useState('');
  const [sourceF, setSourceF]     = useState('');
  const [loading, setLoading]     = useState(true);
  const [modal, setModal]         = useState(null); // null | 'add' | 'edit' | 'view'
  const [selected, setSelected]   = useState(null);
  const [form, setForm]           = useState(emptyForm);
  const [noteText, setNoteText]   = useState('');
  const [saving, setSaving]       = useState(false);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search)  params.set('search', search);
      if (statusF) params.set('status', statusF);
      if (sourceF) params.set('source', sourceF);
      const { data } = await api.get(`/leads?${params}`);
      setLeads(data.leads);
      setStats(data.stats || {});
    } catch (e) {
      toast.error('Failed to load leads');
    } finally {
      setLoading(false);
    }
  }, [search, statusF, sourceF]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const openAdd = () => { setForm(emptyForm); setModal('add'); };
  const openEdit = (l) => { setSelected(l); setForm({ name: l.name, email: l.email, phone: l.phone || '', company: l.company || '', source: l.source, status: l.status }); setModal('edit'); };
  const openView = (l) => { setSelected(l); setNoteText(''); setModal('view'); };
  const closeModal = () => { setModal(null); setSelected(null); setNoteText(''); };

  const handleForm = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const saveLead = async () => {
    if (!form.name || !form.email) { toast.error('Name and email required'); return; }
    setSaving(true);
    try {
      if (modal === 'add') {
        await api.post('/leads', form);
        toast.success('Lead added!');
      } else {
        await api.put(`/leads/${selected._id}`, form);
        toast.success('Lead updated!');
      }
      closeModal();
      fetchLeads();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Error saving lead');
    } finally {
      setSaving(false);
    }
  };

  const deleteLead = async (id) => {
    if (!window.confirm('Delete this lead?')) return;
    try {
      await api.delete(`/leads/${id}`);
      toast.success('Lead deleted');
      fetchLeads();
    } catch (e) {
      toast.error('Error deleting lead');
    }
  };

  const addNote = async () => {
    if (!noteText.trim()) return;
    try {
      const { data } = await api.post(`/leads/${selected._id}/notes`, { text: noteText.trim() });
      setSelected(data.lead);
      setNoteText('');
      toast.success('Note added');
      fetchLeads();
    } catch (e) {
      toast.error('Error adding note');
    }
  };

  const deleteNote = async (noteId) => {
    try {
      const { data } = await api.delete(`/leads/${selected._id}/notes/${noteId}`);
      setSelected(data.lead);
      fetchLeads();
    } catch (e) {
      toast.error('Error deleting note');
    }
  };

  const exportCSV = () => {
    const rows = [['Name','Email','Phone','Company','Source','Status','Date'],...leads.map(l => [l.name,l.email,l.phone||'',l.company||'',l.source,l.status,new Date(l.createdAt).toLocaleDateString()])];
    const csv = rows.map(r => r.join(',')).join('\n');
    const a = document.createElement('a');
    a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    a.download = 'leads.csv'; a.click();
  };

  return (
    <div>
      {/* Topbar */}
      <div style={{ padding: '20px 28px', borderBottom: '1px solid var(--border)', background: 'var(--surface)', position: 'sticky', top: 0, zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>All Leads</div>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{stats.total || 0} total leads in your CRM</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button style={btnStyle(false)} onClick={exportCSV}>↓ Export CSV</button>
          <button style={btnStyle(true)} onClick={openAdd}>+ Add Lead</button>
        </div>
      </div>

      <div style={{ padding: '22px 28px' }}>
        {/* Filters */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 18, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: 300 }}>
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }}>⌕</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name or email..." style={{ ...inputStyle, paddingLeft: 34 }} />
          </div>
          <select value={statusF} onChange={e => setStatusF(e.target.value)} style={{ ...inputStyle, width: 'auto' }}>
            <option value="">All Statuses</option>
            {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
          <select value={sourceF} onChange={e => setSourceF(e.target.value)} style={{ ...inputStyle, width: 'auto' }}>
            <option value="">All Sources</option>
            {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* Table */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1.2fr 1.2fr 1.4fr 90px', padding: '11px 20px', borderBottom: '1px solid var(--border)', background: 'var(--surface2)' }}>
            {['Lead','Email','Source','Status','Date','Actions'].map(h => (
              <div key={h} style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.07em' }}>{h}</div>
            ))}
          </div>

          {loading ? (
            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--muted)' }}>Loading...</div>
          ) : leads.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--muted)', fontSize: 14 }}>No leads found. Try adjusting filters or add a new lead.</div>
          ) : leads.map((l, i) => (
            <div key={l._id} onClick={() => openView(l)} style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1.2fr 1.2fr 1.4fr 90px', padding: '13px 20px', borderBottom: i < leads.length - 1 ? '1px solid var(--border)' : 'none', alignItems: 'center', cursor: 'pointer', transition: '.12s', background: 'transparent' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--surface2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{l.name}</div>
                {l.company && <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 2 }}>{l.company}</div>}
              </div>
              <div style={{ fontSize: 12.5, color: 'var(--muted)', fontFamily: 'var(--mono)' }}>{l.email}</div>
              <div><span style={{ fontSize: 11.5, fontFamily: 'var(--mono)', background: 'var(--surface2)', border: '1px solid var(--border)', padding: '3px 8px', borderRadius: 5, color: 'var(--muted)' }}>{l.source}</span></div>
              <div><Badge status={l.status} /></div>
              <div style={{ fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--muted)' }}>{new Date(l.createdAt).toLocaleDateString()}</div>
              <div style={{ display: 'flex', gap: 6 }} onClick={e => e.stopPropagation()}>
                <button title="Edit" onClick={() => openEdit(l)} style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid var(--border)', background: 'transparent', color: 'var(--muted)', cursor: 'pointer', fontSize: 13 }}>✎</button>
                <button title="Delete" onClick={() => deleteLead(l._id)} style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid var(--border)', background: 'transparent', color: 'var(--danger)', cursor: 'pointer', fontSize: 13 }}>✕</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div onClick={closeModal} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.6)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, width: '100%', maxWidth: modal === 'view' ? 540 : 500, padding: 28, maxHeight: '90vh', overflowY: 'auto' }}>

            {/* View Modal */}
            {modal === 'view' && selected && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <div>
                    <div style={{ fontSize: 17, fontWeight: 600 }}>{selected.name}</div>
                    {selected.company && <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{selected.company}</div>}
                  </div>
                  <button onClick={closeModal} style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: 18, cursor: 'pointer' }}>✕</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
                  {[['Email', selected.email],['Phone', selected.phone || '—'],['Source', selected.source],['Status', null],['Date Added', new Date(selected.createdAt).toLocaleDateString()]].map(([k, v]) => (
                    <div key={k}>
                      <div style={{ ...labelStyle, marginBottom: 4 }}>{k}</div>
                      {k === 'Status' ? <Badge status={selected.status} /> : <div style={{ fontSize: 13, fontFamily: 'var(--mono)', color: 'var(--text)' }}>{v}</div>}
                    </div>
                  ))}
                </div>

                <div style={{ ...labelStyle, marginBottom: 10 }}>Follow-up Notes ({selected.notes?.length || 0})</div>
                {selected.notes?.length === 0 && <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 12 }}>No notes yet.</div>}
                {selected.notes?.map(n => (
                  <div key={n._id} style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px', marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--mono)', marginBottom: 4 }}>{new Date(n.createdAt).toLocaleString()} · {n.createdBy}</div>
                      <div style={{ fontSize: 13, color: 'var(--text)' }}>{n.text}</div>
                    </div>
                    <button onClick={() => deleteNote(n._id)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: 12, marginLeft: 10, flexShrink: 0 }}>✕</button>
                  </div>
                ))}

                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                  <textarea value={noteText} onChange={e => setNoteText(e.target.value)} placeholder="Add a follow-up note..." style={{ ...inputStyle, flex: 1, resize: 'vertical', minHeight: 64 }} />
                </div>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 14 }}>
                  <button style={btnStyle(false)} onClick={closeModal}>Close</button>
                  <button style={btnStyle(false)} onClick={() => openEdit(selected)}>✎ Edit</button>
                  <button style={btnStyle(true)} onClick={addNote}>Add Note</button>
                </div>
              </>
            )}

            {/* Add / Edit Modal */}
            {(modal === 'add' || modal === 'edit') && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <div style={{ fontSize: 16, fontWeight: 600 }}>{modal === 'add' ? 'Add New Lead' : 'Edit Lead'}</div>
                  <button onClick={closeModal} style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: 18, cursor: 'pointer' }}>✕</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  {[['name','Full Name','Priya Sharma'],['email','Email','email@example.com'],['phone','Phone','+91 9876543210'],['company','Company','Acme Inc.']].map(([name,label,ph]) => (
                    <div key={name}>
                      <label style={labelStyle}>{label}</label>
                      <input name={name} value={form[name]} onChange={handleForm} placeholder={ph} style={inputStyle} type={name === 'email' ? 'email' : 'text'} />
                    </div>
                  ))}
                  <div>
                    <label style={labelStyle}>Source</label>
                    <select name="source" value={form.source} onChange={handleForm} style={inputStyle}>
                      {SOURCES.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Status</label>
                    <select name="status" value={form.status} onChange={handleForm} style={inputStyle}>
                      {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 22 }}>
                  <button style={btnStyle(false)} onClick={closeModal}>Cancel</button>
                  <button style={btnStyle(true)} onClick={saveLead} disabled={saving}>{saving ? 'Saving...' : modal === 'add' ? 'Add Lead' : 'Save Changes'}</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
