import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

const PLOT_POSITIONS = [
  {id:"1",no:"1",x:135,y:258,w:22,h:26,area:1200,block:"A",facing:"North",type:"regular"},
  {id:"2",no:"2",x:158,y:258,w:22,h:26,area:1200,block:"A",facing:"North",type:"regular"},
  {id:"3",no:"3",x:181,y:258,w:22,h:26,area:1200,block:"A",facing:"North",type:"regular"},
  {id:"4",no:"4",x:204,y:258,w:22,h:26,area:1200,block:"A",facing:"North",type:"regular"},
  {id:"5",no:"5",x:227,y:258,w:22,h:26,area:1200,block:"A",facing:"North",type:"regular"},
  {id:"6",no:"6",x:250,y:258,w:22,h:26,area:1200,block:"A",facing:"East",type:"regular"},
  {id:"7",no:"7",x:273,y:258,w:22,h:26,area:1200,block:"A",facing:"East",type:"regular"},
  {id:"8",no:"8",x:296,y:258,w:22,h:26,area:1200,block:"A",facing:"East",type:"regular"},
  {id:"9",no:"9",x:319,y:244,w:26,h:28,area:1350,block:"A",facing:"East",type:"corner"},
  {id:"10",no:"10",x:319,y:273,w:26,h:28,area:1350,block:"A",facing:"East",type:"regular"},
  {id:"11",no:"11",x:319,y:302,w:26,h:28,area:1350,block:"A",facing:"East",type:"regular"},
  {id:"12",no:"12",x:319,y:331,w:26,h:28,area:1350,block:"A",facing:"East",type:"regular"},
  {id:"13",no:"13",x:348,y:331,w:24,h:28,area:1500,block:"B",facing:"South",type:"regular"},
  {id:"14",no:"14",x:348,y:302,w:24,h:28,area:1500,block:"B",facing:"South",type:"regular"},
  {id:"15",no:"15",x:348,y:273,w:24,h:28,area:1500,block:"B",facing:"North",type:"regular"},
  {id:"16",no:"16",x:348,y:244,w:24,h:28,area:1500,block:"B",facing:"North",type:"regular"},
  {id:"17",no:"17",x:373,y:244,w:24,h:28,area:1500,block:"B",facing:"North",type:"regular"},
  {id:"18",no:"18",x:373,y:273,w:24,h:28,area:1500,block:"B",facing:"South",type:"regular"},
  {id:"19",no:"19",x:373,y:302,w:24,h:28,area:1500,block:"B",facing:"South",type:"regular"},
  {id:"20",no:"20",x:373,y:331,w:24,h:28,area:1500,block:"B",facing:"South",type:"regular"},
  {id:"21",no:"21",x:398,y:331,w:24,h:28,area:1500,block:"B",facing:"South",type:"regular"},
  {id:"22",no:"22",x:398,y:302,w:24,h:28,area:1500,block:"B",facing:"South",type:"regular"},
  {id:"23",no:"23",x:398,y:273,w:24,h:28,area:1500,block:"B",facing:"North",type:"regular"},
  {id:"24",no:"24",x:398,y:244,w:24,h:28,area:1500,block:"B",facing:"North",type:"regular"},
  {id:"25",no:"25",x:423,y:244,w:24,h:28,area:1500,block:"B",facing:"North",type:"regular"},
  {id:"26",no:"26",x:423,y:273,w:24,h:28,area:1500,block:"B",facing:"South",type:"regular"},
  {id:"27",no:"27",x:423,y:302,w:24,h:28,area:1500,block:"B",facing:"South",type:"regular"},
  {id:"28",no:"28",x:423,y:331,w:24,h:28,area:1500,block:"B",facing:"South",type:"corner"},
  {id:"29",no:"29",x:448,y:331,w:24,h:28,area:1500,block:"B",facing:"South",type:"regular"},
  {id:"30",no:"30",x:480,y:331,w:24,h:28,area:1800,block:"C",facing:"South",type:"regular"},
  {id:"31",no:"31",x:480,y:302,w:24,h:28,area:1800,block:"C",facing:"South",type:"regular"},
  {id:"32",no:"32",x:480,y:273,w:24,h:28,area:1800,block:"C",facing:"North",type:"regular"},
  {id:"33",no:"33",x:480,y:244,w:24,h:28,area:1800,block:"C",facing:"North",type:"regular"},
  {id:"34",no:"34",x:480,y:216,w:24,h:28,area:1800,block:"C",facing:"North",type:"regular"},
  {id:"35",no:"35",x:505,y:216,w:24,h:28,area:1800,block:"C",facing:"North",type:"regular"},
  {id:"36",no:"36",x:530,y:216,w:24,h:28,area:1800,block:"C",facing:"North",type:"regular"},
  {id:"37",no:"37",x:555,y:216,w:24,h:28,area:1800,block:"C",facing:"North",type:"corner"},
  {id:"38",no:"38",x:555,y:244,w:24,h:28,area:1800,block:"C",facing:"East",type:"regular"},
  {id:"39",no:"39",x:555,y:273,w:24,h:28,area:1800,block:"C",facing:"East",type:"regular"},
  {id:"40",no:"40",x:555,y:302,w:24,h:28,area:1800,block:"C",facing:"East",type:"regular"},
  {id:"41",no:"41",x:530,y:273,w:24,h:28,area:1800,block:"C",facing:"South",type:"regular"},
  {id:"42",no:"42",x:530,y:302,w:24,h:28,area:1800,block:"C",facing:"South",type:"regular"},
  {id:"43",no:"43",x:530,y:331,w:24,h:28,area:1800,block:"C",facing:"South",type:"regular"},
  {id:"44",no:"44",x:585,y:356,w:22,h:26,area:1200,block:"D",facing:"South",type:"regular"},
  {id:"45",no:"45",x:585,y:329,w:22,h:26,area:1200,block:"D",facing:"South",type:"regular"},
  {id:"46",no:"46",x:585,y:302,w:22,h:26,area:1200,block:"D",facing:"West",type:"regular"},
  {id:"47",no:"47",x:585,y:273,w:22,h:26,area:1200,block:"D",facing:"West",type:"regular"},
  {id:"48",no:"48",x:585,y:244,w:22,h:26,area:1200,block:"D",facing:"West",type:"regular"},
  {id:"49",no:"49",x:585,y:216,w:22,h:26,area:1200,block:"D",facing:"North",type:"regular"},
  {id:"50",no:"50",x:608,y:216,w:22,h:26,area:1200,block:"D",facing:"North",type:"regular"},
  {id:"51",no:"51",x:608,y:244,w:22,h:26,area:1200,block:"D",facing:"East",type:"regular"},
  {id:"52",no:"52",x:608,y:273,w:22,h:26,area:1200,block:"D",facing:"East",type:"regular"},
  {id:"53",no:"53",x:608,y:302,w:22,h:26,area:1200,block:"D",facing:"East",type:"corner"},
  {id:"54",no:"54",x:700,y:356,w:22,h:26,area:1350,block:"E",facing:"South",type:"regular"},
  {id:"55",no:"55",x:700,y:329,w:22,h:26,area:1350,block:"E",facing:"South",type:"regular"},
  {id:"56",no:"56",x:700,y:302,w:22,h:26,area:1350,block:"E",facing:"West",type:"regular"},
  {id:"57",no:"57",x:700,y:273,w:22,h:26,area:1350,block:"E",facing:"West",type:"regular"},
  {id:"58",no:"58",x:700,y:244,w:22,h:26,area:1350,block:"E",facing:"North",type:"corner"},
  {id:"59",no:"59",x:676,y:188,w:22,h:26,area:1350,block:"E",facing:"North",type:"regular"},
  {id:"60",no:"60",x:676,y:216,w:22,h:26,area:1350,block:"E",facing:"North",type:"regular"},
  {id:"61",no:"61",x:676,y:244,w:22,h:26,area:1350,block:"E",facing:"East",type:"regular"},
  {id:"62",no:"62",x:676,y:273,w:22,h:26,area:1350,block:"E",facing:"East",type:"regular"},
  {id:"63",no:"63",x:676,y:302,w:22,h:26,area:1350,block:"E",facing:"East",type:"regular"},
  {id:"64",no:"64",x:676,y:329,w:22,h:26,area:1350,block:"E",facing:"South",type:"regular"},
  {id:"65",no:"65",x:651,y:329,w:22,h:26,area:1350,block:"E",facing:"South",type:"regular"},
  {id:"66",no:"66",x:651,y:302,w:22,h:26,area:1350,block:"E",facing:"West",type:"regular"},
  {id:"67",no:"67",x:651,y:273,w:22,h:26,area:1350,block:"E",facing:"West",type:"corner"},
  {id:"68",no:"68",x:651,y:244,w:22,h:26,area:1350,block:"E",facing:"North",type:"regular"},
  {id:"69",no:"69",x:651,y:216,w:22,h:26,area:1350,block:"E",facing:"North",type:"regular"},
  {id:"70",no:"70",x:651,y:188,w:22,h:26,area:1350,block:"E",facing:"North",type:"regular"},
  {id:"71",no:"71",x:610,y:115,w:22,h:26,area:1500,block:"F",facing:"North",type:"corner"},
  {id:"72",no:"72",x:632,y:115,w:22,h:26,area:1500,block:"F",facing:"North",type:"regular"},
  {id:"73",no:"73",x:610,y:142,w:22,h:26,area:1500,block:"F",facing:"North",type:"regular"},
  {id:"74",no:"74",x:632,y:142,w:22,h:26,area:1500,block:"F",facing:"East",type:"regular"},
  {id:"75",no:"75",x:632,y:168,w:22,h:26,area:1500,block:"F",facing:"East",type:"regular"},
  {id:"76",no:"76",x:610,y:168,w:22,h:26,area:1500,block:"F",facing:"West",type:"regular"},
  {id:"77",no:"77",x:590,y:168,w:22,h:26,area:1500,block:"F",facing:"West",type:"regular"},
  {id:"78",no:"78",x:590,y:142,w:22,h:26,area:1500,block:"F",facing:"North",type:"regular"},
  {id:"79",no:"79",x:590,y:115,w:22,h:26,area:1500,block:"F",facing:"North",type:"regular"},
  {id:"80",no:"80",x:568,y:115,w:22,h:26,area:1500,block:"F",facing:"North",type:"regular"},
  {id:"81",no:"81",x:568,y:142,w:22,h:26,area:1500,block:"F",facing:"West",type:"regular"},
  {id:"82",no:"82",x:546,y:142,w:22,h:26,area:1500,block:"F",facing:"West",type:"regular"},
  {id:"83",no:"83",x:546,y:168,w:22,h:26,area:1500,block:"F",facing:"South",type:"regular"},
  {id:"84",no:"84",x:568,y:168,w:22,h:26,area:1500,block:"F",facing:"South",type:"regular"},
  {id:"85",no:"85",x:568,y:195,w:22,h:26,area:1500,block:"F",facing:"South",type:"regular"},
  {id:"86",no:"86",x:546,y:195,w:22,h:26,area:1500,block:"F",facing:"South",type:"regular"},
  {id:"87",no:"87",x:524,y:142,w:22,h:26,area:1500,block:"F",facing:"West",type:"corner"},
  {id:"ews1",no:"EWS-1",x:724,y:216,w:24,h:22,area:600,block:"EWS",facing:"East",type:"ews"},
  {id:"ews2",no:"EWS-2",x:724,y:239,w:24,h:22,area:600,block:"EWS",facing:"East",type:"ews"},
  {id:"ews3",no:"EWS-3",x:724,y:262,w:24,h:22,area:600,block:"EWS",facing:"East",type:"ews"},
  {id:"ews4",no:"EWS-4",x:724,y:285,w:24,h:22,area:600,block:"EWS",facing:"East",type:"ews"},
  {id:"ews5",no:"EWS-5",x:724,y:308,w:24,h:22,area:600,block:"EWS",facing:"East",type:"ews"},
  {id:"ews6",no:"EWS-6",x:724,y:331,w:24,h:22,area:600,block:"EWS",facing:"East",type:"ews"},
  {id:"ews7",no:"EWS-7",x:724,y:354,w:24,h:22,area:600,block:"EWS",facing:"East",type:"ews"},
  {id:"ews8",no:"EWS-8",x:724,y:377,w:24,h:22,area:600,block:"EWS",facing:"East",type:"ews"},
  {id:"ews9",no:"EWS-9",x:724,y:400,w:24,h:22,area:600,block:"EWS",facing:"East",type:"ews"},
  {id:"lig1",no:"LIG-1",x:750,y:216,w:26,h:24,area:900,block:"LIG",facing:"East",type:"lig"},
  {id:"lig2",no:"LIG-2",x:750,y:240,w:26,h:24,area:900,block:"LIG",facing:"East",type:"lig"},
  {id:"lig3",no:"LIG-3",x:750,y:264,w:26,h:24,area:900,block:"LIG",facing:"East",type:"lig"},
  {id:"lig4",no:"LIG-4",x:750,y:288,w:26,h:24,area:900,block:"LIG",facing:"East",type:"lig"},
  {id:"lig5",no:"LIG-5",x:750,y:312,w:26,h:24,area:900,block:"LIG",facing:"East",type:"lig"},
  {id:"lig6",no:"LIG-6",x:750,y:336,w:26,h:24,area:900,block:"LIG",facing:"East",type:"lig"},
];

const STATUS_CFG = {
  available: { color: 'rgba(34,197,94,0.8)', border: '#16a34a', label: 'Available' },
  founder:   { color: 'rgba(124,58,237,0.8)', border: '#7c3aed', label: 'Founder' },
  booked:    { color: 'rgba(245,158,11,0.85)', border: '#d97706', label: 'Booked' },
  sold:      { color: 'rgba(37,99,235,0.85)', border: '#1d4ed8', label: 'Sold' },
  held:      { color: 'rgba(220,38,38,0.85)', border: '#dc2626', label: 'Held' },
};

const inp = { width: '100%', padding: '8px 11px', borderRadius: 9, fontSize: 13, border: '1.5px solid #e5e7eb', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', background: '#fafafa', marginBottom: 10 };

export default function PlotMap() {
  const [plots, setPlots] = useState({});
  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    supabase.from('plots').select('*').then(({ data }) => {
      if (data) {
        const map = {};
        data.forEach(p => { map[p.id] = p; });
        setPlots(map);
      }
    });
  }, []);

  async function savePlot() {
    if (!editing) return;
    setSaving(true);
    const { id, ...rest } = editing;
    await supabase.from('plots').upsert({ id, ...rest, updated_at: new Date().toISOString() });
    setPlots(prev => ({ ...prev, [id]: editing }));
    setSelected(null);
    setEditing(null);
    setSaving(false);
  }

  const sel = selected ? PLOT_POSITIONS.find(p => p.id === selected) : null;
  const selData = sel ? (plots[sel.id] || { status: 'available' }) : null;

  return (
    <div>
      <div style={{ fontSize: 16, fontWeight: 800, color: '#1a2744', marginBottom: 10 }}>Plot Map</div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
        {['all', ...Object.keys(STATUS_CFG)].map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{ border: 'none', borderRadius: 20, padding: '4px 10px', fontSize: 11, cursor: 'pointer', fontWeight: 600, background: filter === s ? '#1a2744' : '#f3f4f6', color: filter === s ? '#fff' : '#374151' }}>
            {s === 'all' ? 'All' : STATUS_CFG[s]?.label}
          </button>
        ))}
      </div>
      <div style={{ overflowX: 'auto', marginBottom: 14 }}>
        <div style={{ position: 'relative', width: 800, height: 450, background: 'linear-gradient(135deg,#e8f4e8,#d4e8d4)', borderRadius: 12 }}>
          <div style={{ position: 'absolute', top: 8, left: 8, background: 'rgba(255,255,255,0.8)', borderRadius: 4, padding: '2px 8px', fontSize: 9, fontWeight: 700 }}>9M WIDE ROAD →</div>
          {PLOT_POSITIONS.filter(p => filter === 'all' || (plots[p.id]?.status || 'available') === filter).map(p => {
            const status = plots[p.id]?.status || 'available';
            const cfg = STATUS_CFG[status] || STATUS_CFG.available;
            const isSel = selected === p.id;
            return (
              <button key={p.id} onClick={() => { setSelected(isSel ? null : p.id); setEditing(isSel ? null : { id: p.id, ...(plots[p.id] || { status: 'available' }) }); }}
                style={{ position: 'absolute', left: p.x, top: p.y, width: p.w, height: p.h, background: cfg.color, border: `2px solid ${isSel ? '#fff' : cfg.border}`, borderRadius: 4, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 7, fontWeight: 800, color: '#fff', textShadow: '0 1px 2px rgba(0,0,0,0.5)', boxShadow: isSel ? '0 0 0 3px #1a2744' : 'none', transform: isSel ? 'scale(1.2)' : 'scale(1)', zIndex: isSel ? 10 : 1, transition: 'all 0.15s' }}>
                {p.no.length <= 3 ? p.no : p.no.slice(0, 4)}
              </button>
            );
          })}
        </div>
      </div>

      {sel && editing && (
        <div style={{ background: '#fff', borderRadius: 14, padding: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
          <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 4 }}>Plot {sel.no} — Block {sel.block}</div>
          <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 12 }}>{sel.area.toLocaleString('en-IN')} sqft · {sel.facing} · {sel.type}</div>
          <select value={editing.status || 'available'} onChange={e => setEditing({ ...editing, status: e.target.value })} style={inp}>
            {Object.entries(STATUS_CFG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
          <input placeholder="Sale Price (₹)" type="number" value={editing.sale_price || ''} onChange={e => setEditing({ ...editing, sale_price: e.target.value })} style={inp} />
          <input placeholder="Auth No (GH/___/20__)" value={editing.auth_no || ''} onChange={e => setEditing({ ...editing, auth_no: e.target.value })} style={inp} />
          <input placeholder="Buyer Name" value={editing.buyer_name || ''} onChange={e => setEditing({ ...editing, buyer_name: e.target.value })} style={inp} />
          <input placeholder="Buyer Phone" value={editing.buyer_phone || ''} onChange={e => setEditing({ ...editing, buyer_phone: e.target.value })} style={inp} />
          <input placeholder="Buyer PAN" value={editing.buyer_pan || ''} onChange={e => setEditing({ ...editing, buyer_pan: e.target.value })} style={inp} />
          <input placeholder="Sale Date" type="date" value={editing.sale_date || ''} onChange={e => setEditing({ ...editing, sale_date: e.target.value })} style={inp} />
          <input placeholder="Construction Status" value={editing.construction_status || ''} onChange={e => setEditing({ ...editing, construction_status: e.target.value })} style={inp} />
          <input placeholder="Notes" value={editing.notes || ''} onChange={e => setEditing({ ...editing, notes: e.target.value })} style={inp} />
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={savePlot} disabled={saving} style={{ flex: 1, padding: '10px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>{saving ? 'Saving...' : 'Save Plot'}</button>
            <button onClick={() => { setSelected(null); setEditing(null); }} style={{ padding: '10px 16px', background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
