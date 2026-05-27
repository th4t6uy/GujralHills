import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

const STAGES = ['Cold','Warm','Hot','Site Visit','Negotiation','Booked','Sold'];
const STAGE_COLORS = { Cold:'#6b7280',Warm:'#f59e0b',Hot:'#ef4444','Site Visit':'#8b5cf6',Negotiation:'#0891b2',Booked:'#2563eb',Sold:'#16a34a' };
const inp = { width:'100%', padding:'8px 11px', borderRadius:9, fontSize:13, border:'1.5px solid #e5e7eb', outline:'none', boxSizing:'border-box', fontFamily:'inherit', background:'#fafafa', marginBottom:10 };

export default function CRM() {
  const [leads, setLeads] = useState([]);
  const [calls, setCalls] = useState([]);
  const [addLead, setAddLead] = useState(false);
  const [logCall, setLogCall] = useState(null);
  const [viewLead, setViewLead] = useState(null);
  const [lf, setLF] = useState({ name:'', phone:'', email:'', source:'Walk-in', interest:'', budget:'', notes:'' });
  const [cf, setCF] = useState({ type:'Outgoing', duration:'', outcome:'Interested', notes:'', followup:'' });

  useEffect(() => {
    supabase.from('leads').select('*').order('created_at', { ascending: false }).then(({ data }) => data && setLeads(data));
    supabase.from('calls').select('*').order('created_at', { ascending: false }).then(({ data }) => data && setCalls(data));
  }, []);

  async function addNewLead() {
    const lead = { id: Date.now().toString(), ...lf, stage: 'Cold', created_at: new Date().toISOString() };
    await supabase.from('leads').insert([lead]);
    setLeads(prev => [lead, ...prev]);
    setLF({ name:'', phone:'', email:'', source:'Walk-in', interest:'', budget:'', notes:'' });
    setAddLead(false);
  }

  async function moveLead(id, stage) {
    await supabase.from('leads').update({ stage, updated_at: new Date().toISOString() }).eq('id', id);
    setLeads(prev => prev.map(l => l.id === id ? { ...l, stage } : l));
  }

  async function saveCall(lead) {
    const call = { id: Date.now().toString(), lead_id: lead.id, lead_name: lead.name, ...cf, duration: parseFloat(cf.duration) || 0, created_at: new Date().toISOString() };
    await supabase.from('calls').insert([call]);
    setCalls(prev => [call, ...prev]);
    setCF({ type:'Outgoing', duration:'', outcome:'Interested', notes:'', followup:'' });
    setLogCall(null);
  }

  async function deleteLead(id) {
    await supabase.from('leads').delete().eq('id', id);
    setLeads(prev => prev.filter(l => l.id !== id));
    setViewLead(null);
  }

  const today = new Date().toISOString().split('T')[0];
  const followUps = leads.filter(l => calls.some(c => c.lead_id === l.id && c.followup === today));

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
        <div style={{ fontSize:16, fontWeight:800, color:'#1a2744' }}>CRM Pipeline</div>
        <button onClick={() => setAddLead(true)} style={{ border:'none', borderRadius:9, padding:'6px 14px', background:'#1a2744', color:'#fff', fontSize:12, fontWeight:600, cursor:'pointer' }}>+ Lead</button>
      </div>

      {followUps.length > 0 && <div style={{ background:'#fef3c7', border:'1px solid #fcd34d', borderRadius:10, padding:'8px 12px', marginBottom:10, fontSize:12, color:'#92400e', fontWeight:600 }}>📞 {followUps.length} follow-up(s) due today</div>}

      <div style={{ overflowX:'auto' }}>
        <div style={{ display:'flex', gap:10, minWidth: STAGES.length * 160 }}>
          {STAGES.map(stage => {
            const stageLeads = leads.filter(l => l.stage === stage);
            return (
              <div key={stage} style={{ minWidth:155, flex:'0 0 155px' }}>
                <div style={{ background: STAGE_COLORS[stage], color:'#fff', borderRadius:'8px 8px 0 0', padding:'6px 10px', fontSize:11, fontWeight:700, display:'flex', justifyContent:'space-between' }}>
                  <span>{stage}</span><span style={{ background:'rgba(255,255,255,0.25)', borderRadius:20, padding:'0 6px' }}>{stageLeads.length}</span>
                </div>
                <div style={{ background:'#f8fafc', borderRadius:'0 0 8px 8px', padding:6, minHeight:80, display:'flex', flexDirection:'column', gap:6 }}>
                  {stageLeads.map(lead => (
                    <div key={lead.id} style={{ background:'#fff', borderRadius:8, padding:'8px 9px', boxShadow:'0 1px 3px rgba(0,0,0,0.07)', cursor:'pointer' }} onClick={() => setViewLead(lead)}>
                      <div style={{ fontSize:12, fontWeight:700, color:'#1a2744' }}>{lead.name}</div>
                      <div style={{ fontSize:10, color:'#6b7280' }}>{lead.phone}</div>
                      {lead.budget && <div style={{ fontSize:10, color:'#16a34a', fontWeight:600 }}>₹{lead.budget}</div>}
                      <div style={{ display:'flex', gap:4, marginTop:4 }}>
                        <button onClick={e => { e.stopPropagation(); setLogCall(lead); }} style={{ border:'none', background:'#dbeafe', color:'#1d4ed8', borderRadius:6, padding:'2px 7px', fontSize:10, cursor:'pointer', fontWeight:600 }}>📞</button>
                        <select value={lead.stage} onChange={e => { e.stopPropagation(); moveLead(lead.id, e.target.value); }} onClick={e => e.stopPropagation()} style={{ border:'none', background:'#f3f4f6', borderRadius:6, padding:'2px 4px', fontSize:10, cursor:'pointer' }}>
                          {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Lead Modal */}
      {addLead && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:1000, display:'flex', alignItems:'flex-end', justifyContent:'center' }} onClick={() => setAddLead(false)}>
          <div style={{ background:'#fff', borderRadius:'20px 20px 0 0', padding:'20px 16px 32px', width:'100%', maxWidth:480, maxHeight:'85vh', overflowY:'auto' }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize:16, fontWeight:800, color:'#1a2744', marginBottom:16 }}>New Lead</div>
            {[['name','Name','text'],['phone','Phone','tel'],['email','Email','email'],['interest','Plot Interest','text'],['budget','Budget (₹)','text']].map(([k,p,t]) => (
              <input key={k} type={t} placeholder={p} value={lf[k]} onChange={e => setLF({...lf,[k]:e.target.value})} style={inp} />
            ))}
            <select value={lf.source} onChange={e => setLF({...lf,source:e.target.value})} style={inp}>
              {['Walk-in','Referral','Facebook','Instagram','Hoarding','WhatsApp','Other'].map(s => <option key={s}>{s}</option>)}
            </select>
            <div style={{ display:'flex', gap:8 }}>
              <button onClick={addNewLead} style={{ flex:1, padding:'10px', background:'#16a34a', color:'#fff', border:'none', borderRadius:9, fontSize:13, fontWeight:700, cursor:'pointer' }}>Add Lead</button>
              <button onClick={() => setAddLead(false)} style={{ padding:'10px 16px', background:'#f3f4f6', color:'#374151', border:'none', borderRadius:9, fontSize:13, fontWeight:600, cursor:'pointer' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Log Call Modal */}
      {logCall && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:1000, display:'flex', alignItems:'flex-end', justifyContent:'center' }} onClick={() => setLogCall(null)}>
          <div style={{ background:'#fff', borderRadius:'20px 20px 0 0', padding:'20px 16px 32px', width:'100%', maxWidth:480 }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize:16, fontWeight:800, color:'#1a2744', marginBottom:16 }}>Log Call — {logCall.name}</div>
            <select value={cf.type} onChange={e => setCF({...cf,type:e.target.value})} style={inp}>
              {['Outgoing','Incoming','WhatsApp','Site Visit'].map(o => <option key={o}>{o}</option>)}
            </select>
            <input type="number" placeholder="Duration (mins)" value={cf.duration} onChange={e => setCF({...cf,duration:e.target.value})} style={inp} />
            <select value={cf.outcome} onChange={e => setCF({...cf,outcome:e.target.value})} style={inp}>
              {['Interested','Not Interested','Callback','Price Negotiation','Site Visit Planned','Deal Closed','Not Reachable'].map(o => <option key={o}>{o}</option>)}
            </select>
            <input placeholder="Notes" value={cf.notes} onChange={e => setCF({...cf,notes:e.target.value})} style={inp} />
            <input type="date" placeholder="Follow-up date" value={cf.followup} onChange={e => setCF({...cf,followup:e.target.value})} style={inp} />
            <div style={{ display:'flex', gap:8 }}>
              <button onClick={() => saveCall(logCall)} style={{ flex:1, padding:'10px', background:'#16a34a', color:'#fff', border:'none', borderRadius:9, fontSize:13, fontWeight:700, cursor:'pointer' }}>Save Call</button>
              <button onClick={() => setLogCall(null)} style={{ padding:'10px 16px', background:'#f3f4f6', color:'#374151', border:'none', borderRadius:9, fontSize:13, fontWeight:600, cursor:'pointer' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* View Lead Modal */}
      {viewLead && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:1000, display:'flex', alignItems:'flex-end', justifyContent:'center' }} onClick={() => setViewLead(null)}>
          <div style={{ background:'#fff', borderRadius:'20px 20px 0 0', padding:'20px 16px 32px', width:'100%', maxWidth:480, maxHeight:'85vh', overflowY:'auto' }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize:16, fontWeight:800, color:'#1a2744', marginBottom:4 }}>{viewLead.name}</div>
            <div style={{ fontSize:12, color:'#6b7280', marginBottom:12 }}>📱 {viewLead.phone} · {viewLead.source} · Budget: {viewLead.budget || '—'}<br/>Interest: {viewLead.interest || '—'}</div>
            <div style={{ fontSize:11, fontWeight:700, color:'#374151', marginBottom:6 }}>CALL HISTORY</div>
            {calls.filter(c => c.lead_id === viewLead.id).map(c => (
              <div key={c.id} style={{ background:'#f8fafc', borderRadius:8, padding:'8px 10px', marginBottom:6, fontSize:12 }}>
                <div style={{ fontWeight:600 }}>{c.type} · {c.duration}min · {c.outcome}</div>
                <div style={{ color:'#6b7280', fontSize:11 }}>{c.created_at?.split('T')[0]}</div>
                {c.notes && <div style={{ color:'#374151', marginTop:2 }}>{c.notes}</div>}
                {c.followup && <div style={{ color:'#7c3aed', fontWeight:600, fontSize:11 }}>Follow-up: {c.followup}</div>}
              </div>
            ))}
            {calls.filter(c => c.lead_id === viewLead.id).length === 0 && <div style={{ color:'#9ca3af', fontSize:12, marginBottom:12 }}>No calls logged yet.</div>}
            <div style={{ display:'flex', gap:8, marginTop:8 }}>
              <button onClick={() => { setLogCall(viewLead); setViewLead(null); }} style={{ flex:1, padding:'9px', background:'#1a2744', color:'#fff', border:'none', borderRadius:9, fontSize:12, fontWeight:700, cursor:'pointer' }}>📞 Log Call</button>
              <button onClick={() => deleteLead(viewLead.id)} style={{ padding:'9px 14px', background:'#fee2e2', color:'#dc2626', border:'none', borderRadius:9, fontSize:12, fontWeight:600, cursor:'pointer' }}>Delete</button>
              <button onClick={() => setViewLead(null)} style={{ padding:'9px 14px', background:'#f3f4f6', color:'#374151', border:'none', borderRadius:9, fontSize:12, fontWeight:600, cursor:'pointer' }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
