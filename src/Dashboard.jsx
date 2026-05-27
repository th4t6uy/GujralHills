import React, { useState } from 'react';
import { supabase } from './supabaseClient';
import config from './config';
import PlotMap from './PlotMap';
import CRM from './CRM';
import Inventory from './Inventory';
import Finance from './Finance';

const TABS = [
  { id: 'dash', label: '🏠', full: 'Dashboard' },
  { id: 'map',  label: '🗺️', full: 'Plots' },
  { id: 'crm',  label: '👥', full: 'CRM' },
  { id: 'inv',  label: '📦', full: 'Stock' },
  { id: 'fin',  label: '💰', full: 'Finance' },
];

function DashHome({ session }) {
  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, color: '#9ca3af', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Welcome back</div>
        <div style={{ fontSize: 24, fontWeight: 900, color: config.primaryColor, letterSpacing: '-0.03em' }}>{config.projectName}</div>
        <div style={{ fontSize: 12, color: '#6b7280' }}>RERA {config.reraNumber} · {config.projectAddress}</div>
      </div>

      {/* Logged-in user card */}
      <div style={{ background: config.primaryColor, borderRadius: 14, padding: '20px 18px', color: '#fff', marginBottom: 14 }}>
        <div style={{ fontSize: 11, opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Logged in as</div>
        <div style={{ fontSize: 16, fontWeight: 700 }}>{session?.user?.email}</div>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
        {[
          { l: 'Total Plots',  v: String(config.totalPlots), c: config.primaryColor },
          { l: 'Your Plots',   v: '24',         c: '#7c3aed' },
          { l: 'Public Map',   v: 'Live',        c: '#16a34a' },
          { l: 'Data Sync',    v: 'Supabase',    c: '#0891b2' },
        ].map(s => (
          <div key={s.l} style={{ background: s.c, borderRadius: 12, padding: '14px 12px', color: '#fff' }}>
            <div style={{ fontSize: 10, opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{s.l}</div>
            <div style={{ fontSize: 20, fontWeight: 800 }}>{s.v}</div>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 12, padding: '14px 16px' }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: '#92400e', marginBottom: 6 }}>Quick Links</div>
        <a href="/" target="_blank" rel="noreferrer"
          style={{ display: 'block', color: config.primaryColor, fontSize: 13, fontWeight: 600, marginBottom: 4, textDecoration: 'none' }}>
          🌐 View Customer Map →
        </a>
        <div style={{ color: '#6b7280', fontSize: 12 }}>Share {config.website} with customers</div>
      </div>
    </div>
  );
}

export default function Dashboard({ session }) {
  const [tab, setTab] = useState('dash');

  async function signOut() {
    await supabase.auth.signOut();
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9', fontFamily: "'DM Sans', sans-serif", paddingBottom: 80 }}>

      {/* Top bar */}
      <div style={{ background: config.primaryColor, padding: '14px 16px 12px', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ color: '#fff', fontWeight: 900, fontSize: 17, letterSpacing: '-0.02em' }}>
              {config.projectName}
            </div>
            <div style={{ color: '#93c5fd', fontSize: 10, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              {config.productName} · {TABS.find(t => t.id === tab)?.full}
            </div>
          </div>
          <button onClick={signOut} style={{
            background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff',
            padding: '5px 12px', borderRadius: 8, fontSize: 11, fontWeight: 600, cursor: 'pointer',
          }}>Sign Out</button>
        </div>
      </div>

      {/* Tab content */}
      <div style={{ padding: '16px 14px', maxWidth: 520, margin: '0 auto' }}>
        {tab === 'dash' && <DashHome session={session} />}
        {tab === 'map'  && <PlotMap />}
        {tab === 'crm'  && <CRM />}
        {tab === 'inv'  && <Inventory />}
        {tab === 'fin'  && <Finance />}
      </div>

      {/* Bottom nav */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#fff', borderTop: '1px solid #e5e7eb', display: 'flex', zIndex: 100 }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex: 1, border: 'none', background: 'none', padding: '10px 0 12px', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
            borderTop: tab === t.id ? `2.5px solid ${config.primaryColor}` : '2.5px solid transparent',
          }}>
            <span style={{ fontSize: 18 }}>{t.label}</span>
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase',
              color: tab === t.id ? config.primaryColor : '#9ca3af' }}>{t.full}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
