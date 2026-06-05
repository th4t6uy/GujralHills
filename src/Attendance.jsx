import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from './supabaseClient';

const STATUS_CFG = {
  Present:   { color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0', emoji: '✅' },
  Late:      { color: '#d97706', bg: '#fffbeb', border: '#fde68a', emoji: '🕐' },
  'Half Day':{ color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe', emoji: '🌓' },
  Absent:    { color: '#dc2626', bg: '#fef2f2', border: '#fecaca', emoji: '❌' },
  'On Leave':{ color: '#0891b2', bg: '#ecfeff', border: '#a5f3fc', emoji: '🏖️' },
};

const inp = {
  width: '100%', padding: '9px 12px', borderRadius: 10, fontSize: 13,
  border: '1.5px solid #e5e7eb', outline: 'none', boxSizing: 'border-box',
  fontFamily: 'inherit', background: '#fafafa', marginBottom: 10,
};

function todayStr() {
  return new Date().toISOString().split('T')[0];
}

function nowTime() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
}

function monthKey(dateStr) {
  return dateStr.slice(0, 7); // YYYY-MM
}

export default function Attendance({ session }) {
  const userEmail = session?.user?.email || '';
  const today = todayStr();

  const [records, setRecords]     = useState([]);
  const [todayRec, setTodayRec]   = useState(null);
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [view, setView]           = useState('today');   // 'today' | 'history'
  const [selMonth, setSelMonth]   = useState(today.slice(0, 7));
  const [form, setForm]           = useState({ status: 'Present', time_in: nowTime(), time_out: '', notes: '' });
  const [saved, setSaved]         = useState(false);

  const loadRecords = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('attendance')
      .select('*')
      .eq('staff_email', userEmail)
      .order('date', { ascending: false });

    if (error) {
      console.error('Attendance load error:', error);
      setLoading(false);
      return;
    }

    if (data) {
      setRecords(data);
      const tr = data.find(r => r.date === today) || null;
      setTodayRec(tr);
      if (tr) {
        setForm({ status: tr.status, time_in: tr.time_in || '', time_out: tr.time_out || '', notes: tr.notes || '' });
      }
    }
    setLoading(false);
  }, [userEmail, today]);

  useEffect(() => { loadRecords(); }, [loadRecords]);

  async function markAttendance() {
    if (!userEmail) return;
    setSaving(true);
    const record = {
      id:           `${userEmail}__${today}`,   // deterministic — upsert won't duplicate
      date:         today,
      staff_email:  userEmail,
      status:       form.status,
      time_in:      form.time_in,
      time_out:     form.time_out,
      notes:        form.notes,
      updated_at:   new Date().toISOString(),
    };

    const { error } = await supabase
      .from('attendance')
      .upsert(record, { onConflict: 'id' });

    if (error) {
      console.error('Attendance save error:', error);
      alert('Save failed: ' + error.message);
      setSaving(false);
      return;
    }

    // Update local state immediately — no re-fetch needed
    setTodayRec(record);
    setRecords(prev => {
      const idx = prev.findIndex(r => r.date === today);
      if (idx >= 0) { const n = [...prev]; n[idx] = record; return n; }
      return [record, ...prev];
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    setSaving(false);
  }

  // ── Monthly summary ─────────────────────────────────────────────────────────
  const monthRecords = records.filter(r => monthKey(r.date) === selMonth);
  const summary = Object.keys(STATUS_CFG).reduce((acc, s) => {
    acc[s] = monthRecords.filter(r => r.status === s).length;
    return acc;
  }, {});
  const workingDays = monthRecords.length;

  // ── Available months for filter ──────────────────────────────────────────────
  const months = [...new Set(records.map(r => monthKey(r.date)))].sort().reverse();
  if (!months.includes(today.slice(0, 7))) months.unshift(today.slice(0, 7));

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div>
      <div style={{ fontSize: 16, fontWeight: 800, color: '#1a2744', marginBottom: 12 }}>Attendance</div>

      {/* Tab switcher */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
        {[['today', "Today's Entry"], ['history', 'History']].map(([v, label]) => (
          <button key={v} onClick={() => setView(v)}
            style={{ flex: 1, padding: '8px', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer',
              border: 'none', background: view === v ? '#1a2744' : '#f3f4f6',
              color: view === v ? '#fff' : '#374151' }}>
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#9ca3af' }}>Loading…</div>
      ) : view === 'today' ? (

        // ── TODAY TAB ─────────────────────────────────────────────────────────
        <div>
          {/* Current status banner */}
          {todayRec ? (
            <div style={{ background: STATUS_CFG[todayRec.status]?.bg, border: `1.5px solid ${STATUS_CFG[todayRec.status]?.border}`, borderRadius: 12, padding: '12px 14px', marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 2 }}>Already marked today</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: STATUS_CFG[todayRec.status]?.color }}>
                {STATUS_CFG[todayRec.status]?.emoji} {todayRec.status}
              </div>
              {todayRec.time_in && <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>In: {todayRec.time_in}{todayRec.time_out ? `  ·  Out: ${todayRec.time_out}` : ''}</div>}
              <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>You can update it below</div>
            </div>
          ) : (
            <div style={{ background: '#fff7ed', border: '1.5px solid #fed7aa', borderRadius: 12, padding: '10px 14px', marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#c2410c' }}>⚠️ Not marked yet — {formatDate(today)}</div>
            </div>
          )}

          {/* Mark / Update form */}
          <div style={{ background: '#fff', borderRadius: 14, padding: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 10 }}>
              {todayRec ? 'Update Today\'s Entry' : 'Mark Attendance'}
            </div>

            {/* Status buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7, marginBottom: 12 }}>
              {Object.entries(STATUS_CFG).map(([s, c]) => (
                <button key={s} onClick={() => setForm(f => ({ ...f, status: s }))}
                  style={{
                    padding: '9px 6px', borderRadius: 9, fontSize: 12, fontWeight: 700, cursor: 'pointer',
                    border: form.status === s ? `2px solid ${c.color}` : '1.5px solid #e5e7eb',
                    background: form.status === s ? c.bg : '#fff',
                    color: form.status === s ? c.color : '#6b7280',
                  }}>
                  {c.emoji} {s}
                </button>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <div>
                <label style={{ fontSize: 11, color: '#6b7280', fontWeight: 600, display: 'block', marginBottom: 3 }}>Time In</label>
                <input type="time" value={form.time_in} onChange={e => setForm(f => ({ ...f, time_in: e.target.value }))} style={{ ...inp, marginBottom: 0 }} />
              </div>
              <div>
                <label style={{ fontSize: 11, color: '#6b7280', fontWeight: 600, display: 'block', marginBottom: 3 }}>Time Out</label>
                <input type="time" value={form.time_out} onChange={e => setForm(f => ({ ...f, time_out: e.target.value }))} style={{ ...inp, marginBottom: 0 }} />
              </div>
            </div>
            <div style={{ marginTop: 8 }}>
              <input placeholder="Notes (optional)" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} style={inp} />
            </div>

            <button onClick={markAttendance} disabled={saving}
              style={{ width: '100%', padding: '11px', background: saved ? '#16a34a' : '#1a2744', color: '#fff',
                border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', transition: 'background 0.2s' }}>
              {saving ? 'Saving…' : saved ? '✅ Saved!' : todayRec ? 'Update Entry' : 'Mark Present'}
            </button>
          </div>
        </div>

      ) : (

        // ── HISTORY TAB ───────────────────────────────────────────────────────
        <div>
          {/* Month selector */}
          <select value={selMonth} onChange={e => setSelMonth(e.target.value)} style={{ ...inp, marginBottom: 12 }}>
            {months.map(m => (
              <option key={m} value={m}>
                {new Date(m + '-01').toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
              </option>
            ))}
          </select>

          {/* Monthly summary chips */}
          <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 14 }}>
            {Object.entries(STATUS_CFG).map(([s, c]) => summary[s] > 0 && (
              <div key={s} style={{ background: c.bg, border: `1.5px solid ${c.border}`, borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 700, color: c.color }}>
                {c.emoji} {s}: {summary[s]}
              </div>
            ))}
            {workingDays > 0 && (
              <div style={{ background: '#f3f4f6', borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 700, color: '#374151' }}>
                📅 {workingDays} day{workingDays !== 1 ? 's' : ''} recorded
              </div>
            )}
          </div>

          {/* Records list */}
          {monthRecords.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 30, color: '#9ca3af', fontSize: 13 }}>No records for this month</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {monthRecords.sort((a, b) => b.date.localeCompare(a.date)).map(r => {
                const sc = STATUS_CFG[r.status] || STATUS_CFG.Present;
                return (
                  <div key={r.id} style={{ background: '#fff', borderRadius: 12, padding: '12px 14px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#1a2744' }}>{formatDate(r.date)}</div>
                      {(r.time_in || r.time_out) && (
                        <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>
                          {r.time_in && `In: ${r.time_in}`}{r.time_out && `  ·  Out: ${r.time_out}`}
                        </div>
                      )}
                      {r.notes && <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 1 }}>{r.notes}</div>}
                    </div>
                    <div style={{ background: sc.bg, color: sc.color, border: `1.5px solid ${sc.border}`, borderRadius: 8, padding: '4px 10px', fontSize: 11, fontWeight: 800, whiteSpace: 'nowrap' }}>
                      {sc.emoji} {r.status}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
