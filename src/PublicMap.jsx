import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import config from './config';

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
  founder:   { color: 'rgba(124,58,237,0.8)', border: '#7c3aed', label: 'Founder Plot' },
  booked:    { color: 'rgba(245,158,11,0.85)', border: '#d97706', label: 'Booked' },
  sold:      { color: 'rgba(37,99,235,0.85)', border: '#1d4ed8', label: 'Sold' },
  held:      { color: 'rgba(220,38,38,0.85)', border: '#dc2626', label: 'On Hold' },
};

const WHATSAPP = config.whatsapp;

export default function PublicMap() {
  const [plots, setPlots] = useState({});
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPlots() {
      const { data } = await supabase.from('plots').select('id, status');
      if (data) {
        const map = {};
        data.forEach(p => { map[p.id] = p.status; });
        setPlots(map);
      }
      setLoading(false);
    }
    fetchPlots();
  }, []);

  async function submitInterest() {
    if (!form.name || !form.phone) return;
    await supabase.from('leads').insert([{
      id: Date.now().toString(),
      name: form.name,
      phone: form.phone,
      notes: `Interested in Plot ${selected?.no}. Message: ${form.message}`,
      source: 'Website',
      stage: 'Cold',
      interest: `Plot ${selected?.no}`,
    }]);
    setSubmitted(true);
    setTimeout(() => { setShowForm(false); setSubmitted(false); setForm({ name: '', phone: '', message: '' }); }, 3000);
  }

  const sel = selected ? PLOT_POSITIONS.find(p => p.id === selected) : null;
  const selStatus = sel ? (plots[sel.id] || 'available') : 'available';
  const isAvailable = sel && ['available', 'founder'].includes(selStatus);

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header */}
      <div style={{ background: '#1a2744', padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ color: '#fff', fontWeight: 900, fontSize: 18 }}>{config.projectName}</div>
          <div style={{ color: '#93c5fd', fontSize: 11 }}>RERA {config.reraNumber} · {config.projectAddress}</div>
        </div>
        <a href="/dashboard" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', padding: '6px 12px', borderRadius: 8, fontSize: 11, fontWeight: 600, textDecoration: 'none' }}>Staff Login</a>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 10, padding: '8px 14px', flexWrap: 'wrap', borderBottom: '1px solid #e5e7eb', background: '#fff' }}>
        {Object.entries(STATUS_CFG).map(([k, v]) => (
          <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, background: v.color, border: `1.5px solid ${v.border}` }} />
            <span style={{ fontSize: 11, color: '#374151', fontWeight: 500 }}>{v.label}: {Object.values(plots).filter(s => s === k).length || (k === 'available' ? PLOT_POSITIONS.length - Object.keys(plots).length : 0)}</span>
          </div>
        ))}
      </div>

      {/* Map */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#6b7280' }}>Loading plot map...</div>
      ) : (
        <div style={{ overflowX: 'auto', padding: 16 }}>
          <div style={{ position: 'relative', width: 800, height: 450, background: 'linear-gradient(135deg, #e8f4e8 0%, #d4e8d4 100%)', borderRadius: 12, margin: '0 auto' }}>
            {/* Road labels */}
            <div style={{ position: 'absolute', top: 8, left: 8, background: 'rgba(255,255,255,0.8)', borderRadius: 4, padding: '2px 8px', fontSize: 9, fontWeight: 700, color: '#374151' }}>9M WIDE ROAD →</div>
            <div style={{ position: 'absolute', top: 8, right: 80, background: 'rgba(255,255,255,0.8)', borderRadius: 4, padding: '2px 8px', fontSize: 9, fontWeight: 700, color: '#374151' }}>7.5M ROAD</div>
            <div style={{ position: 'absolute', top: 80, left: 8, background: 'rgba(34,197,94,0.3)', borderRadius: 4, padding: '2px 8px', fontSize: 9, fontWeight: 700, color: '#166534' }}>PARK & PLAY</div>
            {PLOT_POSITIONS.map(p => {
              const status = plots[p.id] || 'available';
              const cfg = STATUS_CFG[status] || STATUS_CFG.available;
              const isSelected = selected === p.id;
              return (
                <button key={p.id} onClick={() => setSelected(isSelected ? null : p.id)}
                  title={`Plot ${p.no} — ${p.area} sqft`}
                  style={{
                    position: 'absolute', left: p.x, top: p.y, width: p.w, height: p.h,
                    background: cfg.color, border: `2px solid ${isSelected ? '#fff' : cfg.border}`,
                    borderRadius: 4, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 7, fontWeight: 800, color: '#fff', textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                    boxShadow: isSelected ? '0 0 0 3px #1a2744, 0 0 0 5px #fff' : '0 1px 3px rgba(0,0,0,0.2)',
                    transform: isSelected ? 'scale(1.2)' : 'scale(1)', zIndex: isSelected ? 10 : 1,
                    transition: 'all 0.15s',
                  }}>
                  {p.no.length <= 3 ? p.no : p.no.slice(0, 4)}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Selected plot panel */}
      {sel && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#fff', borderRadius: '20px 20px 0 0', padding: '20px 20px 32px', boxShadow: '0 -4px 24px rgba(0,0,0,0.12)', zIndex: 100, maxWidth: 480, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 20, fontWeight: 900, color: '#1a2744' }}>Plot {sel.no}</div>
              <div style={{ fontSize: 13, color: '#6b7280' }}>Block {sel.block} · {sel.area.toLocaleString('en-IN')} sqft · {sel.facing} facing</div>
              {sel.type === 'corner' && <div style={{ fontSize: 11, color: '#7c3aed', fontWeight: 700, marginTop: 2 }}>★ Corner Plot</div>}
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ background: STATUS_CFG[selStatus]?.color, color: '#fff', padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>{STATUS_CFG[selStatus]?.label}</span>
              <button onClick={() => setSelected(null)} style={{ border: 'none', background: '#f3f4f6', borderRadius: 8, padding: '4px 10px', cursor: 'pointer', fontSize: 16, color: '#374151' }}>✕</button>
            </div>
          </div>
          {isAvailable && (
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setShowForm(true)}
                style={{ flex: 1, padding: '12px', background: '#1a2744', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                Express Interest
              </button>
              <a href={`https://wa.me/${WHATSAPP}?text=Hi, I am interested in Plot ${sel.no} (${sel.area} sqft) at ${config.projectName}. Please share details.`}
                target="_blank" rel="noreferrer"
                style={{ flex: 1, padding: '12px', background: '#25D366', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', textDecoration: 'none', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                WhatsApp Us
              </a>
            </div>
          )}
          {!isAvailable && (
            <div style={{ background: '#f3f4f6', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#6b7280', textAlign: 'center' }}>
              This plot is not currently available. <a href={`https://wa.me/${WHATSAPP}?text=Hi, I am interested in a plot at ${config.projectName}. Please suggest available options.`} target="_blank" rel="noreferrer" style={{ color: '#1a2744', fontWeight: 700 }}>WhatsApp us</a> for alternatives.
            </div>
          )}
        </div>
      )}

      {/* Interest Form */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: '20px 20px 0 0', padding: '24px 20px 40px', width: '100%', maxWidth: 480 }}>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#1a2744' }}>Interest Submitted!</div>
                <div style={{ fontSize: 13, color: '#6b7280', marginTop: 6 }}>Our team will contact you within 24 hours.</div>
              </div>
            ) : (
              <>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#1a2744', marginBottom: 4 }}>Express Interest — Plot {sel?.no}</div>
                <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 20 }}>We will contact you within 24 hours</div>
                {[['name', 'Your Full Name', 'text'], ['phone', 'Phone Number', 'tel']].map(([key, placeholder, type]) => (
                  <input key={key} type={type} placeholder={placeholder} value={form[key]}
                    onChange={e => setForm({ ...form, [key]: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #e5e7eb', fontSize: 14, marginBottom: 10, boxSizing: 'border-box', outline: 'none' }} />
                ))}
                <input placeholder="Any message or questions? (optional)" value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #e5e7eb', fontSize: 14, marginBottom: 16, boxSizing: 'border-box', outline: 'none' }} />
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={submitInterest}
                    style={{ flex: 1, padding: '12px', background: '#1a2744', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                    Submit
                  </button>
                  <button onClick={() => setShowForm(false)}
                    style={{ padding: '12px 20px', background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
