import Head from 'next/head';
import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function Home() {
  const [openFaq, setOpenFaq] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', company: '', phone: '', city: '', email: '', team: '', message: '', ref: '' });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const ref = params.get('ref');
      if (ref) {
        setForm(prev => ({ ...prev, ref }));
        localStorage.setItem('zeno_ref', ref);
      } else {
        const savedRef = localStorage.getItem('zeno_ref');
        if (savedRef) setForm(prev => ({ ...prev, ref: savedRef }));
      }
    }
  }, []);

  const toggleFaq = (i) => setOpenFaq(openFaq === i ? null : i);

  const handleSubmit = async () => {
    if (!form.name || !form.company || !form.phone) {
      alert('Please fill in your name, company, and phone number.');
      return;
    }
    try {
      await addDoc(collection(db, 'website_leads'), {
        name:       form.name,
        company:    form.company,
        phone:      form.phone,
        city:       form.city       || '',
        email:      form.email      || '',
        team_size:  form.team       || '',
        message:    form.message    || '',
        ref_code:   form.ref        || '',
        status:     'new',
        created_at: serverTimestamp(),
      });
    } catch (err) {
      console.error('Lead save error:', err);
    }
    setSubmitted(true);
    const msg = encodeURIComponent(`Hi, I just submitted a demo request on zenotech.app.\n\nName: ${form.name}\nCompany: ${form.company}\nPhone: ${form.phone}${form.ref ? `\nReferred by: ${form.ref}` : ''}`);
    setTimeout(() => window.open(`https://wa.me/919654597330?text=${msg}`, '_blank'), 1000);
  };

  const faqs = [
    { q: 'Is Zeno only for large HVAC companies?', a: 'No. Zeno works for HVAC companies of all sizes — from 5-person service teams to 100+ technician operations. The module system lets you start with what you need and add more as you grow.' },
    { q: 'Can my technicians use it on mobile?', a: 'Yes. Zeno is a responsive web app that works on any smartphone browser. Technicians can view assigned jobs, update status, submit expenses, request materials, and capture site photos directly from the field. No app download required.' },
    { q: 'How does the AMC module work?', a: 'You create an AMC contract with frequency, contract value, and linked machines. Zeno automatically calculates the next invoice date, tracks visits, and generates invoices on time. Contract status auto-moves to Expired when end date passes.' },
    { q: 'Does it track exact machine locations?', a: 'Yes. The Site Machines register stores GPS coordinates for every installed unit — along with machine type, brand, model, serial number, capacity (TR), installation date, and warranty expiry.' },
    { q: 'How does inventory management work?', a: 'Zeno uses a ledger-first inventory system. Every material movement creates an immutable transaction. Stock is always reconstructable from history. Negative stock is blocked. For projects, you can set material budgets per stage and track consumption in real time.' },
    { q: 'Can I track tools given to technicians?', a: 'Yes. The Assets module maintains a full custody chain for every tool or asset. When you transfer an asset to a technician, a transfer record is created. Every movement is logged. You always know which technician has which asset at any point in time.' },
    { q: 'Does Zeno integrate with Tally?', a: 'Yes. Zeno has a built-in Tally Export module. You can export financial transactions, invoices, and payments as Tally-compatible XML files — eliminating double data entry.' },
    { q: "Is my data safe? Can one company see another company's data?", a: 'Zeno is built as a multi-tenant SaaS platform with strict data isolation. Every record is tagged with a company ID and all queries are filtered. It is architecturally impossible for one company to access another company\'s data.' },
    { q: 'What is the pricing?', a: "Pricing is based on team size and modules required. We offer flexible plans for small service companies, growing contractors, and large multi-branch operations. Book a demo and we'll give you a custom quote." },
    { q: 'How long does it take to get started?', a: 'Most companies are fully operational within 3–5 working days. After your demo, we handle account setup, help import your client and machine data, add your team, and run a training session.' },
  ];

  const features = [
    { icon: '🔧', title: 'Service & Job Management', desc: 'Full lifecycle from complaint to closure. Assign technicians, track job status in real-time, capture site photos, and auto-generate service reports.', points: ['Technician assignment with geofence check-in', 'Job status: Assigned → Working → Completed → Approved', 'Site photos and digital service report', 'Pause/resume job time tracking', 'Chargeable vs non-chargeable jobs'] },
    { icon: '📦', title: 'Inventory & Material Control', desc: 'Ledger-first inventory engine. Every movement tracked, negative stock prevented, full replay history maintained.', points: ['Material Request Flow (MRF) with approval', 'GRN, direct issue, return unused/defective', 'Per-project material budget tracking', 'High-side / low-side material classification', 'Inventory ledger with running balance'] },
    { icon: '🛠️', title: 'Tools & Asset Tracking', desc: 'Know exactly where every tool and asset is at all times. Full custody chain from store to technician to site.', points: ['Asset registry with transfer workflow', 'Technician-to-technician transfer with approval', 'Asset ledger and custody history', 'Scrap approval workflow', 'Defective and scrap stock tracking'] },
    { icon: '📅', title: 'AMC Contract Management', desc: 'Never miss a renewal or scheduled visit. Full AMC lifecycle management with auto-invoice generation.', points: ['Contract creation with frequency settings', 'Automatic next invoice date calculation', 'AMC-linked service job creation', 'OEM warranty return tracking', 'Contract status: Active / Expired / Inactive'] },
    { icon: '🏗️', title: 'Project Management', desc: 'Full project lifecycle for installation contracts. Checklist-driven material stage unlock system.', points: ['Project checklist with milestone tracking', 'Material stage budgeting per project type', 'Document version control (drawings, BOQ)', 'Quotation and BOQ creation', 'Project P&L with material + financial costs'] },
    { icon: '💰', title: 'Billing & Accounts', desc: 'From invoice to payment — complete financial operations. Tally-compatible export included.', points: ['Invoice creation with partial payment support', 'Expense approval workflow', 'Vendor payment tracking', 'Cash/Bank book, P&L reports', 'Tally XML export'] },
    { icon: '🛒', title: 'Procurement & Vendor Management', desc: 'End-to-end purchase management. From procurement queue to GRN to vendor payment — fully tracked.', points: ['Procurement queue from MRF approvals', 'Purchase order with amendment log', 'GRN with over/short receive handling', 'Vendor return with inventory deduction', 'Vendor payment reconciliation'] },
    { icon: '📊', title: 'CRM & Enquiry Management', desc: 'Never lose a lead. Track every enquiry from first contact to conversion — service, project, or AMC.', points: ['Enquiry pipeline: New → Quoted → Won / Lost', 'Auto follow-up alerts on dashboard', 'One-click convert to Service / Project / AMC', 'Quotation linked to enquiry', 'Client auto-create on conversion'] },
    { icon: '📍', title: 'Site Machines Register', desc: 'Complete register of all installed equipment at every client site — with exact GPS location.', points: ['Machine type, brand, model, serial number', 'Installation date and warranty expiry', 'GPS coordinates per machine', 'Capacity (TR), refrigerant type', 'Linked to service jobs and AMC'] },
  ];

  const machines = [
    { icon: '❄️', name: 'Split AC', desc: 'Indoor/outdoor units with capacity tracking' },
    { icon: '🔲', name: 'Cassette AC', desc: 'Ceiling cassette with zone mapping' },
    { icon: '🏭', name: 'VRF / VRV', desc: 'Multi-indoor systems with full unit register' },
    { icon: '🧊', name: 'Chiller', desc: 'Water-cooled and air-cooled chillers' },
    { icon: '💨', name: 'AHU / FCU', desc: 'Air handling and fan coil units' },
    { icon: '🌀', name: 'Ducted AC', desc: 'Central ducted systems with zone register' },
    { icon: '🔵', name: 'Precision AC', desc: 'Server room and precision cooling units' },
    { icon: '🌬️', name: 'Ventilation', desc: 'ERV, HRV, exhaust and fresh air systems' },
  ];

  const css = `
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #1e293b; background: #fff; line-height: 1.6; }
    :root { --teal: #0f6e56; --teal-light: #1d9e75; --teal-bg: #e1f5ee; --dark: #0f172a; --muted: #64748b; --border: #e2e8f0; --surface: #f8fafc; }
    a { text-decoration: none; }
    nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; background: rgba(15,23,42,0.97); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(255,255,255,0.08); padding: 0 2rem; height: 64px; display: flex; align-items: center; justify-content: space-between; }
    .nav-logo { display: flex; align-items: center; gap: 10px; }
    .nav-logo-icon { width: 36px; height: 36px; background: linear-gradient(135deg, #06b6d4, #1d9e75); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 18px; color: white; }
    .nav-logo-text { font-size: 20px; font-weight: 700; color: white; }
    .nav-links { display: flex; align-items: center; gap: 1.5rem; list-style: none; }
    .nav-links a { color: rgba(255,255,255,0.7); font-size: 14px; font-weight: 500; transition: color 0.2s; }
    .nav-links a:hover { color: white; }
    .nav-cta { background: linear-gradient(135deg, #06b6d4, #1d9e75) !important; color: white !important; padding: 8px 20px; border-radius: 8px; font-weight: 600 !important; }
    @media(max-width:768px) { .nav-links { display: none; } }
    .hero { min-height: 100vh; background: linear-gradient(160deg, #0f172a 0%, #0b2a2f 50%, #042f2e 100%); display: flex; align-items: center; justify-content: center; text-align: center; padding: 120px 2rem 80px; position: relative; overflow: hidden; }
    .hero::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse 80% 50% at 50% 0%, rgba(6,182,212,0.12) 0%, transparent 70%); pointer-events: none; }
    .hero-inner { position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center; }
    .hero-badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(6,182,212,0.1); border: 1px solid rgba(6,182,212,0.3); color: #67e8f9; font-size: 13px; font-weight: 500; padding: 6px 14px; border-radius: 100px; margin-bottom: 2rem; }
    .badge-dot { width: 6px; height: 6px; background: #06b6d4; border-radius: 50%; animation: pulse 2s infinite; }
    @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
    .hero h1 { font-size: clamp(2.5rem, 6vw, 4.5rem); font-weight: 800; color: white; line-height: 1.1; letter-spacing: -0.02em; margin-bottom: 1.5rem; max-width: 900px; }
    .hero h1 span { background: linear-gradient(135deg, #06b6d4, #1d9e75); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
    .hero-sub { font-size: clamp(1rem, 2vw, 1.2rem); color: rgba(255,255,255,0.6); max-width: 600px; margin: 0 auto 2.5rem; }
    .hero-cta-group { display: flex; align-items: center; justify-content: center; gap: 1rem; flex-wrap: wrap; }
    .btn-primary { background: linear-gradient(135deg, #06b6d4, #1d9e75); color: white; padding: 14px 32px; border-radius: 10px; font-size: 16px; font-weight: 600; border: none; cursor: pointer; transition: transform 0.2s, opacity 0.2s; display: inline-flex; align-items: center; gap: 8px; }
    .btn-primary:hover { transform: translateY(-2px); opacity: 0.95; }
    .btn-secondary { background: rgba(255,255,255,0.08); color: white; padding: 14px 32px; border-radius: 10px; font-size: 16px; font-weight: 500; border: 1px solid rgba(255,255,255,0.15); transition: background 0.2s; }
    .btn-secondary:hover { background: rgba(255,255,255,0.12); }
    .hero-stats { display: flex; align-items: center; justify-content: center; gap: 3rem; margin-top: 4rem; flex-wrap: wrap; }
    .hero-stat-num { font-size: 2rem; font-weight: 800; background: linear-gradient(135deg, #06b6d4, #1d9e75); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
    .hero-stat-label { font-size: 13px; color: rgba(255,255,255,0.5); margin-top: 4px; text-align: center; }
    section { padding: 100px 2rem; }
    .container { max-width: 1200px; margin: 0 auto; }
    .section-label { font-size: 13px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #1d9e75; margin-bottom: 1rem; }
    .section-title { font-size: clamp(2rem, 4vw, 3rem); font-weight: 800; color: #0f172a; line-height: 1.15; letter-spacing: -0.02em; margin-bottom: 1.25rem; }
    .section-sub { font-size: 1.1rem; color: #64748b; max-width: 600px; line-height: 1.7; }
    .problem { background: #f8fafc; }
    .problem-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin-top: 3rem; }
    .problem-card { background: white; border: 1px solid #e2e8f0; border-radius: 16px; padding: 1.75rem; }
    .problem-icon { width: 48px; height: 48px; background: #fef2f2; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 22px; margin-bottom: 1rem; }
    .problem-card h3 { font-size: 1.05rem; font-weight: 600; color: #0f172a; margin-bottom: 0.5rem; }
    .problem-card p { font-size: 0.9rem; color: #64748b; }
    .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 2rem; margin-top: 4rem; }
    .feature-card { background: white; border: 1px solid #e2e8f0; border-radius: 20px; padding: 2rem; transition: border-color 0.2s, transform 0.2s; }
    .feature-card:hover { border-color: #1d9e75; transform: translateY(-4px); }
    .feature-icon { width: 56px; height: 56px; background: #e1f5ee; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 26px; margin-bottom: 1.25rem; }
    .feature-card h3 { font-size: 1.2rem; font-weight: 700; color: #0f172a; margin-bottom: 0.75rem; }
    .feature-card p { font-size: 0.95rem; color: #64748b; margin-bottom: 1rem; }
    .feature-list { list-style: none; }
    .feature-list li { font-size: 0.88rem; color: #64748b; padding: 4px 0; display: flex; align-items: flex-start; gap: 8px; }
    .feature-list li::before { content: '✓'; color: #1d9e75; font-weight: 700; flex-shrink: 0; margin-top: 1px; }
    .how { background: #f8fafc; }
    .steps { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem; margin-top: 4rem; }
    .step { text-align: center; }
    .step-num { width: 52px; height: 52px; background: linear-gradient(135deg, #06b6d4, #1d9e75); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; font-weight: 800; color: white; margin: 0 auto 1.25rem; }
    .step h3 { font-size: 1rem; font-weight: 700; color: #0f172a; margin-bottom: 0.5rem; }
    .step p { font-size: 0.9rem; color: #64748b; }
    .machines-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 1rem; margin-top: 3rem; }
    .machine-card { background: white; border: 1px solid #e2e8f0; border-radius: 14px; padding: 1.5rem 1rem; text-align: center; transition: border-color 0.2s; }
    .machine-card:hover { border-color: #1d9e75; }
    .machine-icon { font-size: 2rem; margin-bottom: 0.75rem; }
    .machine-card h4 { font-size: 0.9rem; font-weight: 600; color: #0f172a; }
    .machine-card p { font-size: 0.8rem; color: #64748b; margin-top: 4px; }
    .trust { background: linear-gradient(160deg, #0f172a, #0b2a2f, #042f2e); }
    .trust .section-title { color: white; }
    .trust .section-sub { color: rgba(255,255,255,0.6); }
    .trust .section-label { color: #67e8f9; }
    .trust-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin-top: 3rem; }
    .trust-card { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 1.75rem; }
    .trust-card h3 { font-size: 2rem; font-weight: 800; color: #06b6d4; margin-bottom: 0.5rem; }
    .trust-card p { font-size: 0.9rem; color: rgba(255,255,255,0.6); }
    .faq-list { margin-top: 3rem; max-width: 800px; }
    .faq-item { border-bottom: 1px solid #e2e8f0; }
    .faq-q { width: 100%; background: none; border: none; text-align: left; cursor: pointer; padding: 1.25rem 0; font-size: 1rem; font-weight: 600; color: #0f172a; display: flex; align-items: center; justify-content: space-between; gap: 1rem; font-family: inherit; }
    .faq-q:hover { color: #1d9e75; }
    .faq-icon { font-size: 1.25rem; flex-shrink: 0; color: #64748b; transition: transform 0.2s; }
    .faq-icon.open { transform: rotate(45deg); color: #1d9e75; }
    .faq-a { font-size: 0.95rem; color: #64748b; line-height: 1.7; overflow: hidden; max-height: 0; transition: max-height 0.3s ease, padding 0.3s; }
    .faq-a.open { max-height: 500px; padding-bottom: 1.25rem; }
    .affiliate { background: linear-gradient(160deg, #0f172a, #0b2a2f, #042f2e); }
    .affiliate .section-title { color: white; }
    .affiliate .section-sub { color: rgba(255,255,255,0.6); }
    .affiliate .section-label { color: #67e8f9; }
    .affiliate-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.5rem; margin-bottom: 3rem; margin-top: 3rem; }
    .affiliate-card { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 1.75rem; text-align: center; }
    .affiliate-card-icon { font-size: 2rem; margin-bottom: 1rem; }
    .affiliate-card h3 { color: white; font-size: 1rem; font-weight: 700; margin-bottom: 0.5rem; }
    .affiliate-card p { color: rgba(255,255,255,0.6); font-size: 0.9rem; }
    .demo { background: #f8fafc; }
    .demo-wrap { background: white; border: 1px solid #e2e8f0; border-radius: 24px; padding: 3rem; max-width: 680px; margin: 3rem auto 0; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .form-group { display: flex; flex-direction: column; gap: 6px; }
    .form-group.full { grid-column: 1 / -1; }
    label { font-size: 13px; font-weight: 600; color: #0f172a; }
    input, select, textarea { border: 1px solid #e2e8f0; border-radius: 10px; padding: 11px 14px; font-size: 15px; font-family: inherit; color: #0f172a; background: white; outline: none; transition: border-color 0.2s; width: 100%; }
    input:focus, select:focus, textarea:focus { border-color: #1d9e75; box-shadow: 0 0 0 3px rgba(29,158,117,0.08); }
    textarea { resize: vertical; min-height: 100px; }
    .submit-btn { width: 100%; background: linear-gradient(135deg, #06b6d4, #1d9e75); color: white; border: none; cursor: pointer; padding: 14px; border-radius: 10px; font-size: 16px; font-weight: 700; font-family: inherit; margin-top: 0.5rem; transition: opacity 0.2s, transform 0.2s; }
    .submit-btn:hover { opacity: 0.92; transform: translateY(-1px); }
    .form-note { text-align: center; font-size: 12px; color: #64748b; margin-top: 1rem; }
    .ref-badge { background: #e1f5ee; border-radius: 8px; padding: 8px 14px; font-size: 13px; color: #0f6e56; font-weight: 600; grid-column: 1 / -1; }
    .success-box { text-align: center; padding: 2rem; }
    .success-box h3 { font-size: 1.5rem; font-weight: 700; color: #0f6e56; margin-bottom: 0.5rem; }
    .success-box p { color: #64748b; }
    .wa-btn { display: inline-block; margin-top: 1rem; background: linear-gradient(135deg, #06b6d4, #1d9e75); color: white; padding: 12px 28px; border-radius: 10px; font-weight: 700; }
    footer { background: #0f172a; padding: 3rem 2rem; text-align: center; }
    .footer-links { display: flex; align-items: center; justify-content: center; gap: 1.5rem; margin-bottom: 1rem; flex-wrap: wrap; }
    .footer-links a { color: rgba(255,255,255,0.5); font-size: 13px; }
    .footer-links a:hover { color: white; }
    footer p { color: rgba(255,255,255,0.4); font-size: 13px; margin-top: 0.5rem; }
    @media(max-width:768px) { section { padding: 70px 1.25rem; } .form-grid { grid-template-columns: 1fr; } .demo-wrap { padding: 1.75rem; } }
  `;

  return (
    <>
      <Head>
        <title>Zeno — The Only ERP Built for HVAC Companies</title>
        <meta name="description" content="Manage service jobs, inventory, AMC contracts, technicians, assets and billing from one platform. Purpose-built for HVAC companies." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="Zeno ERP — Built for HVAC Companies" />
        <meta property="og:description" content="From the first service call to final invoice — manage everything in one platform." />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </Head>

      <style>{css}</style>

      {/* NAV */}
      <nav>
        <a href="#" className="nav-logo">
          <div className="nav-logo-icon">Z</div>
          <span className="nav-logo-text">ZENO</span>
        </a>
        <ul className="nav-links">
          <li><a href="#features">Features</a></li>
          <li><a href="#machines">Equipment</a></li>
          <li><a href="#how">How It Works</a></li>
          <li><a href="#faq">FAQ</a></li>
          <li><a href="#affiliate">Affiliate</a></li>
          <li><a href="#demo" className="nav-cta">Book Free Demo</a></li>
        </ul>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-badge"><div className="badge-dot"></div>Purpose-built for HVAC Companies</div>
          <h1>The Only ERP<br /><span>Built for HVAC Companies</span></h1>
          <p className="hero-sub">From the first service call to final invoice — manage your technicians, inventory, AMC contracts, assets, and accounts in one powerful platform.</p>
          <div className="hero-cta-group">
            <a href="#demo" className="btn-primary">Book a Free Demo →</a>
            <a href="#features" className="btn-secondary">See All Features</a>
          </div>
          <div className="hero-stats">
            {[['15+','Modules'],['100%','HVAC Focused'],['Real-time','Field Tracking'],['Multi-site','Ready']].map(([num, label]) => (
              <div key={label}>
                <div className="hero-stat-num">{num}</div>
                <div className="hero-stat-label">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="problem">
        <div className="container">
          <div className="section-label">The Problem</div>
          <h2 className="section-title">Running an HVAC business<br />on spreadsheets and WhatsApp?</h2>
          <p className="section-sub">Most HVAC companies lose money because of operational chaos. Zeno fixes all of it.</p>
          <div className="problem-grid">
            {[
              ['📋','No visibility on service jobs',"You don't know which technician is where, what was done on site, or whether the job is billable."],
              ['📦','Inventory always out of sync','Materials go missing, stock records are wrong, and you find out only when a job gets delayed.'],
              ['📅','AMC contracts slipping','Renewal dates missed, visits not tracked, clients not invoiced on time — revenue leaking silently.'],
              ['🔧','Tools and assets unaccounted','Expensive tools lost, no record of which technician has what, no accountability.'],
              ['💰','Billing always delayed','Jobs completed but invoices raised weeks later. Cash flow suffers because of manual processes.'],
              ['📊','No financial visibility',"You don't know project profitability, technician costs, or which clients are most valuable."],
            ].map(([icon, title, desc]) => (
              <div className="problem-card" key={title}>
                <div className="problem-icon">{icon}</div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features">
        <div className="container">
          <div className="section-label">Features</div>
          <h2 className="section-title">Everything your HVAC<br />business needs, in one place</h2>
          <p className="section-sub">Built from the ground up for field service companies. Every feature is HVAC-specific.</p>
          <div className="features-grid">
            {features.map(f => (
              <div className="feature-card" key={f.title}>
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
                <ul className="feature-list">
                  {f.points.map(p => <li key={p}>{p}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MACHINES */}
      <section id="machines" style={{background:'#f8fafc'}}>
        <div className="container">
          <div className="section-label">Equipment Support</div>
          <h2 className="section-title">Built for every HVAC system<br />you install and service</h2>
          <p className="section-sub">Zeno understands HVAC equipment — track capacity, location, warranty, and service history per unit.</p>
          <div className="machines-grid">
            {machines.map(m => (
              <div className="machine-card" key={m.name}>
                <div className="machine-icon">{m.icon}</div>
                <h4>{m.name}</h4>
                <p>{m.desc}</p>
              </div>
            ))}
          </div>
          <div style={{background:'white',border:'1px solid #e2e8f0',borderRadius:'16px',padding:'2rem',marginTop:'2rem',display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:'1.5rem'}}>
            {[['Track per unit','Serial number, model, brand'],['Exact location','GPS lat/lng + site address'],['Warranty alert','Installation + expiry dates'],['Service history','Full job history per machine']].map(([label,val]) => (
              <div key={label}>
                <div style={{fontSize:'13px',fontWeight:'600',color:'#64748b',marginBottom:'4px'}}>{label}</div>
                <div style={{fontSize:'15px',fontWeight:'600',color:'#0f172a'}}>{val}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="how">
        <div className="container">
          <div className="section-label">How It Works</div>
          <h2 className="section-title">Up and running in days,<br />not months</h2>
          <p className="section-sub">No complex implementation. No consultant fees. We set up your account, migrate your data, and train your team.</p>
          <div className="steps">
            {[['1','Book a Demo',"See the full system live. We'll map your exact workflows to Zeno features."],['2','Onboarding Call','We set up your company, add your team, import clients and machines.'],['3','Go Live','Your team starts using Zeno from day one. No long training required.'],['4','Grow','Add more modules as your business grows. Scale to multiple branches.']].map(([n,t,d]) => (
              <div className="step" key={n}>
                <div className="step-num">{n}</div>
                <h3>{t}</h3>
                <p>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="trust">
        <div className="container">
          <div className="section-label">Why Zeno</div>
          <h2 className="section-title">Built different.<br />Not a generic ERP renamed.</h2>
          <p className="section-sub" style={{color:'rgba(255,255,255,0.6)'}}>We did not take a generic ERP and add HVAC to the name. We built every module from scratch for how HVAC companies actually operate.</p>
          <div className="trust-grid">
            {[['100%','HVAC-specific workflows — from VRF installation checklists to refrigerant tracking'],['15+','Integrated modules — service, inventory, procurement, billing, AMC, projects, assets and more'],['Real-time','Live job tracking, inventory updates, and financial entries — no end-of-day reconciliation'],['Multi-tenant','Perfect for multi-branch operations. Complete data isolation between business units'],['Audit-safe','Every transaction immutable. Full replay history. No data can be silently edited or deleted'],['Tally-ready','One-click Tally XML export. No double entry between operations and accounts team']].map(([h,p]) => (
              <div className="trust-card" key={h}>
                <h3>{h}</h3>
                <p>{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq">
        <div className="container">
          <div className="section-label">FAQ</div>
          <h2 className="section-title">Frequently asked questions</h2>
          <p className="section-sub">Everything you want to know before booking a demo.</p>
          <div className="faq-list">
            {faqs.map((f, i) => (
              <div className="faq-item" key={i}>
                <button className="faq-q" onClick={() => toggleFaq(i)}>
                  {f.q}
                  <span className={`faq-icon${openFaq === i ? ' open' : ''}`}>+</span>
                </button>
                <div className={`faq-a${openFaq === i ? ' open' : ''}`}>{f.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AFFILIATE — 🔧 FIXED: WhatsApp link → /affiliate page */}
      <section id="affiliate" className="affiliate">
        <div className="container" style={{textAlign:'center'}}>
          <div className="section-label">Partner Program</div>
          <h2 className="section-title">Earn by referring<br />HVAC companies to Zeno</h2>
          <p className="section-sub" style={{margin:'0 auto'}}>Know HVAC contractors? Refer them to Zeno and earn ₹5,000 for every company that subscribes.</p>
          <div className="affiliate-grid">
            {[
              ['🔗','Get Your Link','Sign up free and get a unique referral link instantly — no login required'],
              ['📤','Share It','Share with HVAC companies you know — WhatsApp, email, or in person'],
              ['💰','Earn ₹5,000','Get paid for every company that subscribes to Zeno. One-time per conversion.'],
            ].map(([icon,title,desc]) => (
              <div className="affiliate-card" key={title}>
                <div className="affiliate-card-icon">{icon}</div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
          {/* ✅ FIXED: was WhatsApp redirect, now /affiliate signup page */}
          <a href="/affiliate" className="btn-primary" style={{display:'inline-flex'}}>
            Become an Affiliate →
          </a>
        </div>
      </section>

      {/* DEMO */}
      <section id="demo" className="demo">
        <div className="container" style={{textAlign:'center'}}>
          <div className="section-label">Get Started</div>
          <h2 className="section-title">Book your free demo</h2>
          <p className="section-sub" style={{margin:'0 auto'}}>See Zeno live with your own use case. No commitment. No credit card. Just a 45-minute walkthrough.</p>
          <div className="demo-wrap">
            {submitted ? (
              <div className="success-box">
                <div style={{fontSize:'3rem',marginBottom:'1rem'}}>✅</div>
                <h3>Demo request received!</h3>
                <p>Our team will call you within 24 hours to schedule your personalised demo.</p>
                <a href={`https://wa.me/919654597330?text=${encodeURIComponent('Hi, I just submitted a demo request on zenotech.app and would like to learn more about Zeno ERP.')}`} target="_blank" rel="noreferrer" className="wa-btn">Chat on WhatsApp</a>
              </div>
            ) : (
              <>
                <div className="form-grid">
                  <div className="form-group"><label>Your Name *</label><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Amit Verma" /></div>
                  <div className="form-group"><label>Company Name *</label><input value={form.company} onChange={e=>setForm({...form,company:e.target.value})} placeholder="ABC HVAC Services Pvt Ltd" /></div>
                  <div className="form-group"><label>Phone Number *</label><input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="+91 98765 43210" /></div>
                  <div className="form-group"><label>City</label><input value={form.city} onChange={e=>setForm({...form,city:e.target.value})} placeholder="Delhi" /></div>
                  <div className="form-group"><label>Email Address</label><input value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="amit@abchvac.com" /></div>
                  <div className="form-group"><label>Team Size</label>
                    <select value={form.team} onChange={e=>setForm({...form,team:e.target.value})}>
                      <option value="">Select team size</option>
                      <option>1–5 people</option>
                      <option>6–15 people</option>
                      <option>16–50 people</option>
                      <option>50+ people</option>
                    </select>
                  </div>
                  <div className="form-group full"><label>What are you looking to solve?</label><textarea value={form.message} onChange={e=>setForm({...form,message:e.target.value})} placeholder="e.g. We want to track technician jobs and AMC contracts better..." /></div>
                  {form.ref && <div className="ref-badge">Referred by: {form.ref}</div>}
                </div>
                <button className="submit-btn" onClick={handleSubmit}>Book My Free Demo →</button>
                <p className="form-note">We&apos;ll call you within 24 hours. No spam, ever.</p>
              </>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="nav-logo" style={{justifyContent:'center',marginBottom:'1.5rem'}}>
          <div className="nav-logo-icon">Z</div>
          <span className="nav-logo-text">ZENO</span>
        </div>
        <div className="footer-links">
          {[['#features','Features'],['#machines','Equipment'],['#how','How It Works'],['#faq','FAQ'],['#affiliate','Affiliate'],['#demo','Book Demo'],['/terms','Terms']].map(([href,label]) => (
            <a href={href} key={label}>{label}</a>
          ))}
        </div>
        <p>The Only ERP Built for HVAC Companies</p>
        <p>© 2026 Zeno Technologies. All rights reserved.</p>
      </footer>
    </>
  );
}
