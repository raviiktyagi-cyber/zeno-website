import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { captureUTM, getStoredUTM } from '../lib/tracking';

export default function BookDemo() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', phone: '', company: '', city: '',
    industry: '', teamSize: '', currentSystem: '', problem: '', message: '', ref: '',
  });

  useEffect(() => {
    captureUTM();
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const ref = params.get('ref');
      if (ref) { setForm(prev => ({ ...prev, ref })); localStorage.setItem('zeno_ref', ref); }
      else { const r = localStorage.getItem('zeno_ref'); if (r) setForm(prev => ({ ...prev, ref: r })); }
    }
  }, []);

  const update = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.company) {
      alert('Please fill your name, phone and company.');
      return;
    }
    setSubmitting(true);
    const utm = getStoredUTM();
    try {
      await addDoc(collection(db, 'website_leads'), {
        name: form.name,
        email: form.email,
        phone: form.phone,
        company: form.company,
        city: form.city,
        industry: form.industry,
        team_size: form.teamSize,
        current_system: form.currentSystem,
        primary_problem: form.problem,
        message: form.message,
        ref_code: form.ref || '',
        status: 'new',
        source: 'book-demo-page',
        created_at: serverTimestamp(),
        ...utm,
        page_url: typeof window !== 'undefined' ? window.location.href : '',
      });
    } catch (err) { console.error(err); }

    const adminMsg = encodeURIComponent(
      `NEW DEMO REQUEST (Book Demo page)\n\nName: ${form.name}\nCompany: ${form.company}\nPhone: ${form.phone}\nEmail: ${form.email || '-'}\nCity: ${form.city || '-'}\nIndustry: ${form.industry || '-'}\nTeam Size: ${form.teamSize || '-'}\nCurrent System: ${form.currentSystem || '-'}\nProblem: ${form.problem || '-'}${form.ref ? `\nRef: ${form.ref}` : ''}\n\nSource: zenotech.app/book-demo`
    );
    window.open(`https://wa.me/919654597330?text=${adminMsg}`, '_blank');
    setSubmitting(false);
    router.push('/thank-you');
  };

  const css = `
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #1e293b; background: #f8fafc; }
    nav { position: sticky; top: 0; z-index: 50; background: #0f172a; padding: 0 2rem; height: 64px; display: flex; align-items: center; justify-content: space-between; }
    .nav-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; }
    .nav-logo-icon { width: 36px; height: 36px; background: linear-gradient(135deg, #06b6d4, #1d9e75); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 18px; color: white; }
    .nav-logo-text { font-size: 20px; font-weight: 700; color: white; }
    .back-link { color: rgba(255,255,255,0.7); font-size: 14px; text-decoration: none; }
    .back-link:hover { color: white; }
    .demo-page { padding: 3rem 2rem 5rem; max-width: 1100px; margin: 0 auto; }
    .demo-page-inner { display: grid; grid-template-columns: 1fr 1.1fr; gap: 3rem; align-items: start; }
    @media(max-width:900px) { .demo-page-inner { grid-template-columns: 1fr; } }
    .section-label { font-size: 13px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #1d9e75; margin-bottom: 1rem; }
    .demo-page-left h1 { font-size: clamp(2rem, 4vw, 2.75rem); font-weight: 800; color: #0f172a; line-height: 1.15; margin-bottom: 1rem; }
    .demo-page-left p { color: #64748b; font-size: 1.05rem; line-height: 1.7; margin-bottom: 1.5rem; }
    .demo-page-points { list-style: none; }
    .demo-page-points li { font-size: 14px; color: #374151; padding: 6px 0; font-weight: 500; }
    .demo-form-card { background: white; border: 1px solid #e2e8f0; border-radius: 20px; padding: 2rem; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    @media(max-width:520px) { .form-row { grid-template-columns: 1fr; } }
    .form-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 1rem; }
    label { font-size: 13px; font-weight: 600; color: #0f172a; }
    input, select, textarea { border: 1.5px solid #e2e8f0; border-radius: 10px; padding: 12px 14px; font-size: 14px; font-family: inherit; color: #0f172a; background: white; outline: none; width: 100%; }
    input:focus, select:focus, textarea:focus { border-color: #1d9e75; box-shadow: 0 0 0 3px rgba(29,158,117,0.08); }
    textarea { resize: vertical; }
    .submit-btn { width: 100%; background: linear-gradient(135deg, #06b6d4, #1d9e75); color: white; border: none; cursor: pointer; padding: 15px; border-radius: 10px; font-size: 16px; font-weight: 700; font-family: inherit; margin-top: 0.5rem; }
    .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
    .form-note { text-align: center; font-size: 12px; color: #94a3b8; margin-top: 1rem; }
    .ref-badge { background: #e1f5ee; border-radius: 8px; padding: 8px 14px; font-size: 13px; color: #0f6e56; font-weight: 600; margin-bottom: 1rem; text-align: center; }
  `;

  return (
    <>
      <Head>
        <title>Book a Free Demo — Zeno HVAC Operating System</title>
        <meta name="description" content="See Zeno live in 15 minutes. Tell us about your HVAC business and we'll show you exactly how it fits your workflow." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </Head>
      <style>{css}</style>

      <nav>
        <a href="/" className="nav-logo">
          <div className="nav-logo-icon">Z</div>
          <span className="nav-logo-text">ZENO</span>
        </a>
        <a href="/" className="back-link">← Back to home</a>
      </nav>

      <section className="demo-page">
        <div className="demo-page-inner">
          <div className="demo-page-left">
            <div className="section-label">Book a Free Demo</div>
            <h1>See Zeno live<br />in 15 minutes</h1>
            <p>Tell us a bit about your business. We'll map your exact workflow on the call — no generic sales pitch.</p>
            <ul className="demo-page-points">
              <li>✓ 14-day free trial, no credit card</li>
              <li>✓ Setup in 48 hours</li>
              <li>✓ We call you within 24 hours</li>
            </ul>
          </div>
          <div className="demo-page-right">
            <form onSubmit={handleSubmit} className="demo-form-card">
              {form.ref && <div className="ref-badge">Referred by: {form.ref}</div>}
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input value={form.name} onChange={update('name')} placeholder="Amit Verma" required />
                </div>
                <div className="form-group">
                  <label>Work Email</label>
                  <input type="email" value={form.email} onChange={update('email')} placeholder="amit@company.com" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Phone / WhatsApp *</label>
                  <input value={form.phone} onChange={update('phone')} placeholder="+91 98765 43210" required />
                </div>
                <div className="form-group">
                  <label>Company Name *</label>
                  <input value={form.company} onChange={update('company')} placeholder="ABC HVAC Services" required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>City</label>
                  <input value={form.city} onChange={update('city')} placeholder="Dehradun" />
                </div>
                <div className="form-group">
                  <label>Industry</label>
                  <select value={form.industry} onChange={update('industry')}>
                    <option value="">Select...</option>
                    <option>HVAC Contractor</option>
                    <option>MEP Contractor</option>
                    <option>Facility / Technical Service</option>
                    <option>Electrical Service Contractor</option>
                    <option>Fire & Safety</option>
                    <option>CCTV / Security Installer</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Approx. Team Size</label>
                  <select value={form.teamSize} onChange={update('teamSize')}>
                    <option value="">Select...</option>
                    <option>1-5</option>
                    <option>6-15</option>
                    <option>16-30</option>
                    <option>30+</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Current System</label>
                  <select value={form.currentSystem} onChange={update('currentSystem')}>
                    <option value="">Select...</option>
                    <option>Excel</option>
                    <option>WhatsApp</option>
                    <option>Another software</option>
                    <option>Nothing formal</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Biggest Problem You Want to Solve</label>
                <input value={form.problem} onChange={update('problem')} placeholder="e.g. Tools going missing, billing delays..." />
              </div>
              <div className="form-group">
                <label>Anything else? (optional)</label>
                <textarea value={form.message} onChange={update('message')} rows={3} placeholder="Optional message" />
              </div>
              <button type="submit" className="submit-btn" disabled={submitting}>
                {submitting ? 'Sending...' : 'Book My Free Demo →'}
              </button>
              <p className="form-note">No spam. We will only call to schedule your demo.</p>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}