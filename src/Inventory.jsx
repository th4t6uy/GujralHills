import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

const CATS = ['Cement','Steel','Bricks','Sand','Aggregate','Electrical','Plumbing','Equipment','Tools','Marketing','Office','Other'];
const inp = { width:'100%', padding:'8px 11px', borderRadius:9, fontSize:13, border:'1.5px solid #e5e7eb', outline:'none', boxSizing:'border-box', fontFamily:'inherit', background:'#fafafa', marginBottom:10 };

export default function Inventory() {
  const [tab, setTab] = useState('stock');
  const [inventory, setInventory] = useState([]);
  const [pos, setPOs] = useState([]);
  const [grs, setGRs] = useState([]);
  const [addItem, setAddItem] = useState(false);
  const [createPO, setCreatePO] = useState(false);
  const [receiveGR, setReceiveGR] = useState(null);
  const [iF, setIF] = useState({ name:'', category:'Cement', unit:'Bags', min_qty:10, qty:0 });
  const [poF, setPOF] = useState({ vendor:'', date:new Date().toISOString().split('T')[0], items:[{item:'',qty:'',rate:'',amount:''}], notes:'', raised_by:'Jasween' });
  const [grF, setGRF] = useState({ received_date:new Date().toISOString().split('T')[0], received_by:'', notes:'' });

  useEffect(() => {
    supabase.from('inventory').select('*').then(({ data }) => data && setInventory(data));
    supabase.from('purchase_orders').select('*').order('created_at',{ascending:false}).then(({ data }) => data && setPOs(data));
    supabase.from('goods_receipts').select('*').order('created_at',{ascending:false}).then(({ data }) => data && setGRs(data));
  }, []);

  async function addInventoryItem() {
    const item = { id:Date.now().toString(), ...iF, qty:parseFloat(iF.qty)||0, min_qty:parseFloat(iF.min_qty)||0, updated_at:new Date().toISOString() };
    await supabase.from('inventory').insert([item]);
    setInventory(prev => [...prev, item]);
    setIF({ name:'', category:'Cement', unit:'Bags', min_qty:10, qty:0 });
    setAddItem(false);
  }

  async function submitPO() {
    const po = { id:Date.now().toString(), po_no:`GH-PO-${String(pos.length+1).padStart(3,'0')}`, ...poF, status:'Pending', total:poF.items.reduce((s,i)=>s+parseFloat(i.amount||0),0), items:poF.items, created_at:new Date().toISOString() };
    await supabase.from('purchase_orders').insert([po]);
    setPOs(prev => [po, ...prev]);
    setCreatePO(false);
  }

  async function submitGR(po) {
    const gr = { id:Date.now().toString(), gr_no:`GH-GR-${String(grs.length+1).padStart(3,'0')}`, po_no:po.po_no, vendor:po.vendor, ...grF, created_at:new Date().toISOString() };
    await supabase.from('goods_receipts').insert([gr]);
    await supabase.from('purchase_orders').update({ status:'Received' }).eq('id', po.id);
    // Update inventory qty
    for (const item of (po.items || [])) {
      const existing = inventory.find(i => i.name === item.item);
      if (existing) {
        const newQty = existing.qty + parseFloat(item.qty || 0);
        await supabase.from('inventory').update({ qty: newQty }).eq('id', existing.id);
        setInventory(prev => prev.map(i => i.id === existing.id ? { ...i, qty: newQty } : i));
      }
    }
    setPOs(prev => prev.map(p => p.id === po.id ? { ...p, status:'Received' } : p));
    setGRs(prev => [gr, ...prev]);
    setReceiveGR(null);
  }

  const fmt = n => new Intl.NumberFormat('en-IN', { style:'currency', currency:'INR', maximumFractionDigits:0 }).format(n||0);
  const lowStock = inventory.filter(i => i.qty <= i.min_qty);

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
        <div style={{ fontSize:16, fontWeight:800, color:'#1a2744' }}>Inventory ERP</div>
        <div style={{ display:'flex', gap:6 }}>
          {tab==='stock' && <button onClick={()=>setAddItem(true)} style={{ border:'none', borderRadius:9, padding:'5px 12px', background:'#f3f4f6', color:'#374151', fontSize:11, fontWeight:600, cursor:'pointer' }}>+ Item</button>}
          {tab==='po' && <button onClick={()=>setCreatePO(true)} style={{ border:'none', borderRadius:9, padding:'5px 12px', background:'#1a2744', color:'#fff', fontSize:11, fontWeight:600, cursor:'pointer' }}>+ PO</button>}
        </div>
      </div>

      {lowStock.length > 0 && <div style={{ background:'#fee2e2', border:'1px solid #fca5a5', borderRadius:10, padding:'8px 12px', marginBottom:10, fontSize:12, color:'#991b1b', fontWeight:600 }}>⚠️ Low stock: {lowStock.map(i=>i.name).join(', ')}</div>}

      <div style={{ display:'flex', gap:6, marginBottom:12 }}>
        {[['stock','Stock'],['po','Purchase Orders'],['gr','GR']].map(([id,label]) => (
          <button key={id} onClick={()=>setTab(id)} style={{ border:'none', borderRadius:8, padding:'6px 12px', fontSize:12, cursor:'pointer', fontWeight:600, background:tab===id?'#1a2744':'#f3f4f6', color:tab===id?'#fff':'#374151' }}>{label}</button>
        ))}
      </div>

      {tab==='stock' && (
        <div>
          {inventory.length === 0 && <div style={{ color:'#9ca3af', textAlign:'center', padding:'30px 0', fontSize:13 }}>No items yet. Add inventory to track stock.</div>}
          {inventory.map(item => (
            <div key={item.id} style={{ background:'#fff', borderRadius:12, padding:'14px 16px', marginBottom:8, display:'flex', justifyContent:'space-between', alignItems:'center', boxShadow:'0 1px 3px rgba(0,0,0,0.06)' }}>
              <div>
                <div style={{ fontSize:13, fontWeight:700 }}>{item.name}</div>
                <div style={{ fontSize:11, color:'#6b7280' }}>{item.category} · Min: {item.min_qty} {item.unit}</div>
              </div>
              <div style={{ textAlign:'right' }}>
                <div style={{ fontSize:20, fontWeight:800, color:item.qty<=item.min_qty?'#dc2626':'#16a34a' }}>{item.qty}</div>
                <div style={{ fontSize:10, color:'#9ca3af' }}>{item.unit}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab==='po' && (
        <div>
          {pos.length === 0 && <div style={{ color:'#9ca3af', textAlign:'center', padding:'30px 0', fontSize:13 }}>No purchase orders yet.</div>}
          {pos.map(po => (
            <div key={po.id} style={{ background:'#fff', borderRadius:12, padding:'14px 16px', marginBottom:8, boxShadow:'0 1px 3px rgba(0,0,0,0.06)' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:6 }}>
                <div>
                  <div style={{ fontSize:13, fontWeight:700 }}>{po.po_no} · {po.vendor}</div>
                  <div style={{ fontSize:11, color:'#6b7280' }}>Raised by {po.raised_by} · {po.date}</div>
                  <div style={{ fontSize:13, fontWeight:700, color:'#1a2744', marginTop:2 }}>{fmt(po.total)}</div>
                </div>
                <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:6 }}>
                  <span style={{ background:po.status==='Received'?'#dcfce7':'#fef3c7', color:po.status==='Received'?'#16a34a':'#d97706', padding:'2px 9px', borderRadius:20, fontSize:10, fontWeight:700 }}>{po.status}</span>
                  {po.status==='Pending' && <button onClick={()=>setReceiveGR(po)} style={{ border:'none', background:'#16a34a', color:'#fff', borderRadius:7, padding:'4px 10px', fontSize:11, fontWeight:600, cursor:'pointer' }}>Receive</button>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab==='gr' && (
        <div>
          {grs.length === 0 && <div style={{ color:'#9ca3af', textAlign:'center', padding:'30px 0', fontSize:13 }}>No goods receipts yet.</div>}
          {grs.map(gr => (
            <div key={gr.id} style={{ background:'#fff', borderRadius:12, padding:'14px 16px', marginBottom:8, boxShadow:'0 1px 3px rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize:13, fontWeight:700 }}>{gr.gr_no} against {gr.po_no}</div>
              <div style={{ fontSize:11, color:'#6b7280' }}>From {gr.vendor} · {gr.received_date} by {gr.received_by}</div>
              {gr.notes && <div style={{ fontSize:11, color:'#374151', marginTop:4 }}>{gr.notes}</div>}
            </div>
          ))}
        </div>
      )}

      {/* Add Item Modal */}
      {addItem && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:1000, display:'flex', alignItems:'flex-end', justifyContent:'center' }} onClick={()=>setAddItem(false)}>
          <div style={{ background:'#fff', borderRadius:'20px 20px 0 0', padding:'20px 16px 32px', width:'100%', maxWidth:480 }} onClick={e=>e.stopPropagation()}>
            <div style={{ fontSize:16, fontWeight:800, marginBottom:16 }}>Add Inventory Item</div>
            <input placeholder="Item Name" value={iF.name} onChange={e=>setIF({...iF,name:e.target.value})} style={inp} />
            <select value={iF.category} onChange={e=>setIF({...iF,category:e.target.value})} style={inp}>{CATS.map(c=><option key={c}>{c}</option>)}</select>
            <input placeholder="Unit (Bags/Kg/Nos)" value={iF.unit} onChange={e=>setIF({...iF,unit:e.target.value})} style={inp} />
            <input type="number" placeholder="Opening Stock" value={iF.qty} onChange={e=>setIF({...iF,qty:e.target.value})} style={inp} />
            <input type="number" placeholder="Minimum Stock Alert Level" value={iF.min_qty} onChange={e=>setIF({...iF,min_qty:e.target.value})} style={inp} />
            <div style={{ display:'flex', gap:8 }}>
              <button onClick={addInventoryItem} style={{ flex:1, padding:'10px', background:'#16a34a', color:'#fff', border:'none', borderRadius:9, fontSize:13, fontWeight:700, cursor:'pointer' }}>Add Item</button>
              <button onClick={()=>setAddItem(false)} style={{ padding:'10px 16px', background:'#f3f4f6', color:'#374151', border:'none', borderRadius:9, fontSize:13, fontWeight:600, cursor:'pointer' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Create PO Modal */}
      {createPO && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:1000, display:'flex', alignItems:'flex-end', justifyContent:'center' }} onClick={()=>setCreatePO(false)}>
          <div style={{ background:'#fff', borderRadius:'20px 20px 0 0', padding:'20px 16px 32px', width:'100%', maxWidth:480, maxHeight:'90vh', overflowY:'auto' }} onClick={e=>e.stopPropagation()}>
            <div style={{ fontSize:16, fontWeight:800, marginBottom:16 }}>Create Purchase Order</div>
            <input placeholder="Vendor Name" value={poF.vendor} onChange={e=>setPOF({...poF,vendor:e.target.value})} style={inp} />
            <select value={poF.raised_by} onChange={e=>setPOF({...poF,raised_by:e.target.value})} style={inp}><option>Jasween</option><option>Site Supervisor</option></select>
            <input type="date" value={poF.date} onChange={e=>setPOF({...poF,date:e.target.value})} style={inp} />
            <div style={{ fontSize:11, fontWeight:700, color:'#374151', margin:'4px 0 8px' }}>LINE ITEMS</div>
            {poF.items.map((it,i)=>(
              <div key={i} style={{ background:'#f8fafc', borderRadius:8, padding:10, marginBottom:8 }}>
                <input placeholder="Item" value={it.item} onChange={e=>{const items=[...poF.items];items[i]={...it,item:e.target.value};setPOF({...poF,items});}} style={{...inp,marginBottom:6}} />
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:6 }}>
                  {[['qty','Qty'],['rate','Rate ₹']].map(([k,p])=>(
                    <input key={k} type="number" placeholder={p} value={it[k]} onChange={e=>{const items=[...poF.items];const q=k==='qty'?parseFloat(e.target.value)||0:parseFloat(it.qty)||0;const r=k==='rate'?parseFloat(e.target.value)||0:parseFloat(it.rate)||0;items[i]={...it,[k]:e.target.value,amount:q*r};setPOF({...poF,items});}} style={{...inp,marginBottom:0}} />
                  ))}
                  <input placeholder="Amount" value={it.amount||''} readOnly style={{...inp,marginBottom:0,background:'#f3f4f6'}} />
                </div>
              </div>
            ))}
            <button onClick={()=>setPOF({...poF,items:[...poF.items,{item:'',qty:'',rate:'',amount:''}]})} style={{ border:'none', background:'#f3f4f6', borderRadius:8, padding:'6px 12px', fontSize:11, fontWeight:600, cursor:'pointer', marginBottom:10 }}>+ Add Line</button>
            <div style={{ fontSize:13, fontWeight:700, marginBottom:10 }}>Total: ₹{poF.items.reduce((s,i)=>s+parseFloat(i.amount||0),0).toLocaleString('en-IN')}</div>
            <div style={{ display:'flex', gap:8 }}>
              <button onClick={submitPO} style={{ flex:1, padding:'10px', background:'#16a34a', color:'#fff', border:'none', borderRadius:9, fontSize:13, fontWeight:700, cursor:'pointer' }}>Issue PO</button>
              <button onClick={()=>setCreatePO(false)} style={{ padding:'10px 16px', background:'#f3f4f6', color:'#374151', border:'none', borderRadius:9, fontSize:13, fontWeight:600, cursor:'pointer' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Receive GR Modal */}
      {receiveGR && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:1000, display:'flex', alignItems:'flex-end', justifyContent:'center' }} onClick={()=>setReceiveGR(null)}>
          <div style={{ background:'#fff', borderRadius:'20px 20px 0 0', padding:'20px 16px 32px', width:'100%', maxWidth:480 }} onClick={e=>e.stopPropagation()}>
            <div style={{ fontSize:16, fontWeight:800, marginBottom:16 }}>Receive Goods — {receiveGR.po_no}</div>
            <input type="date" value={grF.received_date} onChange={e=>setGRF({...grF,received_date:e.target.value})} style={inp} />
            <input placeholder="Received By" value={grF.received_by} onChange={e=>setGRF({...grF,received_by:e.target.value})} style={inp} />
            <input placeholder="Notes / Shortages / Damage" value={grF.notes} onChange={e=>setGRF({...grF,notes:e.target.value})} style={inp} />
            <div style={{ display:'flex', gap:8 }}>
              <button onClick={()=>submitGR(receiveGR)} style={{ flex:1, padding:'10px', background:'#16a34a', color:'#fff', border:'none', borderRadius:9, fontSize:13, fontWeight:700, cursor:'pointer' }}>Confirm Receipt</button>
              <button onClick={()=>setReceiveGR(null)} style={{ padding:'10px 16px', background:'#f3f4f6', color:'#374151', border:'none', borderRadius:9, fontSize:13, fontWeight:600, cursor:'pointer' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
