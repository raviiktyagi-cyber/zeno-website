import Head from 'next/head';
import { useState, useEffect } from 'react';

export default function Leads() {
  const [password, setPassword] = useState('');
  const [authed, setAuthed] = useState(false);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchLeads = async (pwd) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'x-admin-password': pwd },
      });
      if (res.status === 401) { setError('Wrong password.'); setLoading(false); return; }
      if (!res.ok) { setError('Server error, check Vercel logs.'); setLoading(false); return; }
      const data = await res.json();
      setLeads(data.leads);
      setAuthed(true);
      sessionStorage.setItem('zeno_leads_pwd', pwd);
    } catch (e) {
      setError('Something went wrong.');
    }
    setLoading(false);
  };

  useEffect(() => {
    const saved = sessionStorage.getItem('zeno_leads_pwd');
    if (saved) { setPassword(saved); fetchLeads(saved); }
  }, []);

  const css = `
    * { box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0f172a; margin: 0; }
    .wrap { max-width: 1300px; margin: 0 auto; padding: 3rem 1.5rem; }
    .gate { max-width: 360px; margin: 8rem auto; background: white; border-radius: 16px; padding: 2rem; text-align: center; }
    .gate input { width: 100%; padding: 12px; border: 1.5px solid #e2e8f0; border-radius: 8px; margin: 1rem 0; font-size: 14px; }
    .gate button { width: 100%; padding: 12px; background: linear-gradient(135deg, #06b6d4, #1d9e75); color: white; border: none; border-radius: 8px; font-weight: 700; cursor: pointer; }
    .err { color: #ef4444; font-size: 13px; margin-top: 8px; }
    h1 { color: white; font-size: 1.5rem; margin-bottom: 1.5rem; }
    table { width: 100%; border-collapse: collapse; background: white; border-radius: 12px; overflow: hidden; }
    th, td { text-align: left; padding: 10px 12px; font-size: 13px; border-bottom: 1px solid #f1f5f9; white-space: nowrap; }
    th { background: #f8fafc; color: #64748b; font-weight: 700; text-transform: uppercase; font-size: 11px; }
    tr:hover { background: #f8fafc; }
    .table-scroll { overflow-x: auto; border-radius: 12px; }
    .count { color: rgba(255,255,255,0.6); font-size: 13px; margin-bottom: 1rem; }
  `;

  if (!authed) {
    return (
      <>
        <Head><title>Leads</title><meta name="robots" content="noindex" /></Head>
        <style dangerouslySetInnerHTML={{ __html: css }} />
        <div className="gate">
          <h2>🔒 Leads Dashboard</h2>
          <input type="password" placeholder="Enter password" value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && fetchLeads(password)} />
          <button onClick={() => fetchLeads(password)} disabled={loading}>
            {loading ? 'Checking...' : 'View Leads'}
          </button>
          {error && <p className="err">{error}</p>}
        </div>
      </>
    );
  }

  return (
    <>
      <Head><title>Leads Dashboard</title><meta name="robots" content="noindex" /></Head>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="wrap">
        <h1>ZENO Leads Dashboard</h1>
        <p className="count">{leads.length} leads</p>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Date</th><th>Name</th><th>Company</th><th>Phone</th><th>Email</th>
                <th>City</th><th>Industry</th><th>Team</th><th>System</th><th>Problem</th>
                <th>Source</th><th>UTM Source</th><th>Campaign</th><th>Ref</th>
              </tr>
            </thead>
            <tbody>
              {leads.map(l => (
                <tr key={l.id}>
                  <td>{l.created_at ? new Date(l.created_at).toLocaleDateString('en-IN') : '-'}</td>
                  <td>{l.name}</td>
                  <td>{l.company}</td>
                  <td>{l.phone}</td>
                  <td>{l.email}</td>
                  <td>{l.city}</td>
                  <td>{l.industry}</td>
                  <td>{l.team_size}</td>
                  <td>{l.current_system}</td>
                  <td>{l.primary_problem}</td>
                  <td>{l.source}</td>
                  <td>{l.utm_source}</td>
                  <td>{l.utm_campaign}</td>
                  <td>{l.ref_code}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}