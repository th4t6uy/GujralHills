import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import config from './config';
import Login from './Login';
import Dashboard from './Dashboard';
import PublicMap from './PublicMap';

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const isPublic = window.location.pathname === '/' || window.location.pathname === '/map';

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1a2744' }}>
      <div style={{ color: '#fff', fontSize: 16, fontWeight: 600 }}>Loading {config.productName}…</div>
    </div>
  );

  if (isPublic) return <PublicMap />;
  if (!session) return <Login />;
  return <Dashboard session={session} />;
}
