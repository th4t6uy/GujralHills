import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

const EXP_CATS = ['Construction','Infrastructure','RERA & Legal','Marketing','Brokerage','Architect & Consultant','Site Operations','Office','Other'];
const inp = { width:'100%', padding:'8px 11px', borderRadius:9, fontSize:13, border:'1.5px solid #e5e7eb', outline:'none', boxSizing:'border-box', fontFamily:'inherit', background:'#fafafa', marginBottom:10 };
const fmt = n => new Intl.NumberFormat('en-IN', { style:'currency', currency:'INR', maximumFractionDigits:0 }).format(n||0);

export default function Finance() {
  const [expenses, setExpenses] = useState([]);
  const [plots, setPlots] = useState([]);
  const [advances, setAdvances] = useState(0);
  const [addExp, setAddExp] = useState(false);
  const [eF, setEF] = useState({ date:new Date().toISOString().split('T')[0], category:'Construction', description:'', amount:'', paid_by:'Jasween', mode:'Bank Transfer', voucher:'' });

  useEffect(() => {
    supabase.from('expenses').select('*').order('created_at',{ascending:false}).then(({ data }) => data && setExpenses(data));
    supabase.from('plots').select('id, sale_price, status').then(({ data }) => data && setPlots(data));
    supabase.from('settings').select('value').eq('key','advances_drawn').single().then(({ data }) => data && setAdvances(parseFloat(data.value)||0));
  }, []);

  async function addExpense() {
    const exp = { id:Date.now().toString(), ...eF, amount:parseFloat(eF.amount)||0, created_at:new Date().toISOString() };
    await supabase.from('expenses').insert([exp]);
    setExpenses(prev => [exp, ...prev]);
    setEF({ date:new Date().toISOString().split('T')[0], category:'Construction', description:'', amount:'', paid_by:'Jasween', mode:'Bank Transfer', voucher:'' });
    setAddExp(false);
  }

  async function deleteExp(id) {
    await supabase.from('expenses').delete().eq('id', id);
    setExpenses(prev => prev.filter(e => e.id !== id));
  }

  async function updateAdvances(val) {
    const v = parseFloat(val)||0;
    setAdvances(v);
    await supabase.from('settings').upsert({ key:'advances_drawn', value:String(v) });
  }

  const totalRev = plots.reduce((s,p) => s+(p.sale_price||0), 0);
  const totalExp = expenses.reduce((s,e) => s+e.amount, 0);
  const net = totalRev - totalExp;
  const myFee = net * 0.25;
  const feeBalance = myFee - advances;

  const byCat = {};
  expenses.forEach(e => { byCat[e.category] = (byCat[e.category]||0) + e.amount; });

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
        <div style={{ fontSize:16, fontWeight:800, color:'#1a2744' }}>Finance</div>
        <button onClick={()=>setAddExp(true)} style={{ border:'none', borderRadius:9, padding:'6px 14px', background:'#1a2744', color:'#fff', fontSize:12, fontWeight:600, cursor:'pointer' }}>+ Expense</button>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:12 }}>
        {[
          { l:'Gross Revenue', v:fmt(totalRev), c:'#1a2744' },
          { l:'Total Expenses', v:fmt(totalExp), c:'#dc2626' },
          { l:'Net Surplus', v:fmt(net), c:'#2563eb' },
          { l:'My Fee (25%)', v:fmt(myFee), c:'#7c3aed' },
          { l:'Advances Drawn', v:fmt(advances), c:'#d97706' },
          { l:'Balance Payable', v:fmt(feeBalance), c:'#16a34a' },
        ].map(s => (
          <div key={s.l} style={{ background:s.c, borderRadius:11, padding:'12px', color:'#fff' }}>
            <div style={{ fontSize:9, opacity:0.7, textTransform:'uppercase', letterSpacing:'0.06em' }}>{s.l}</div>
            <div style={{ fontSize:16, fontWeight:800, marginTop:2 }}>{s.v}</div>
          </div>
        ))}
      </div>

      <div style={{ background:'#fff', borderRadius:12, padding:'14px 16px', marginBottom:12, boxShadow:'0 1px 3px rgba(0,0,0,0.06)' }}>
        <div style={{ fontSize:11, fontWeight:700, color:'#374151', marginBottom:6, textTransform:'uppercase', letterSpacing:'0.06em' }}>Update Advances Drawn</div>
        <input type="number" placeholder="Total ₹75k/month drawings to date" value={advances||''} onChange={e=>updateAdvances(e.target.value)} style={inp} />
      </div>

      {Object.keys(byCat).length > 0 && (
        <div style={{ background:'#fff', borderRadius:12, padding:'14px 16px', marginBottom:12, boxShadow:'0 1px 3px rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize:11, fontWeight:700, color:'#374151', marginBottom:8, textTransform:'uppercase', letterSpacing:'0.06em' }}>By Category</div>
          {Object.entries(byCat).sort((a,b)=>b[1]-a[1]).map(([cat,amt]) => (
            <div key={cat} style={{ display:'flex', justifyContent:'space-between', fontSize:12, padding:'4px 0', borderBottom:'1px solid #f3f4f6' }}>
              <span style={{ color:'#374151' }}>{cat}</span>
              <span style={{ fontWeight:700 }}>{fmt(amt)}</span>
            </div>
          ))}
        </div>
      )}

      {expenses.length === 0 && <div style={{ color:'#9ca3af', textAlign:'center', padding:'30px 0', fontSize:13 }}>No expenses recorded yet.</div>}
      {expenses.map(e => (
        <div key={e.id} style={{ background:'#fff', borderRadius:12, padding:'12px 14px', marginBottom:8, display:'flex', justifyContent:'space-between', alignItems:'center', boxShadow:'0 1px 3px rgba(0,0,0,0.06)' }}>
          <div>
            <div style={{ fontSize:12, fontWeight:700 }}>{e.description||e.category}</div>
            <div style={{ fontSize:10, color:'#6b7280' }}>{e.date} · {e.category} · {e.paid_by} · {e.mode}</div>
            {e.voucher && <div style={{ fontSize:10, color:'#9ca3af' }}>Voucher: {e.voucher}</div>}
          </div>
          <div style={{ display:'flex', gap:8, alignItems:'center' }}>
            <span style={{ fontSize:14, fontWeight:800, color:'#dc2626' }}>{fmt(e.amount)}</span>
            <button onClick={()=>deleteExp(e.id)} style={{ border:'none', background:'none', cursor:'pointer', color:'#dc2626', fontSize:16, lineHeight:1 }}>×</button>
          </div>
        </div>
      ))}

      {addExp && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:1000, display:'flex', alignItems:'flex-end', justifyContent:'center' }} onClick={()=>setAddExp(false)}>
          <div style={{ background:'#fff', borderRadius:'20px 20px 0 0', padding:'20px 16px 32px', width:'100%', maxWidth:480, maxHeight:'85vh', overflowY:'auto' }} onClick={e=>e.stopPropagation()}>
            <div style={{ fontSize:16, fontWeight:800, marginBottom:16 }}>Add Expense</div>
            <input type="date" value={eF.date} onChange={e=>setEF({...eF,date:e.target.value})} style={inp} />
            <select value={eF.category} onChange={e=>setEF({...eF,category:e.target.value})} style={inp}>{EXP_CATS.map(c=><option key={c}>{c}</option>)}</select>
            <input placeholder="Description" value={eF.description} onChange={e=>setEF({...eF,description:e.target.value})} style={inp} />
            <input type="number" placeholder="Amount (₹)" value={eF.amount} onChange={e=>setEF({...eF,amount:e.target.value})} style={inp} />
            <select value={eF.paid_by} onChange={e=>setEF({...eF,paid_by:e.target.value})} style={inp}>
              <option>Jasween</option><option>Jasleen</option><option>Triumph Devcon</option><option>Site Supervisor</option>
            </select>
            <select value={eF.mode} onChange={e=>setEF({...eF,mode:e.target.value})} style={inp}>
              {['Bank Transfer','UPI','Cheque','Cash','RTGS/NEFT'].map(m=><option key={m}>{m}</option>)}
            </select>
            <input placeholder="Voucher / Reference No." value={eF.voucher} onChange={e=>setEF({...eF,voucher:e.target.value})} style={inp} />
            <div style={{ display:'flex', gap:8 }}>
              <button onClick={addExpense} style={{ flex:1, padding:'10px', background:'#16a34a', color:'#fff', border:'none', borderRadius:9, fontSize:13, fontWeight:700, cursor:'pointer' }}>Add Expense</button>
              <button onClick={()=>setAddExp(false)} style={{ padding:'10px 16px', background:'#f3f4f6', color:'#374151', border:'none', borderRadius:9, fontSize:13, fontWeight:600, cursor:'pointer' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
