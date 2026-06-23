import Head from 'next/head';
import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function Home() {
  const [openFaq, setOpenFaq] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', company: '', phone: '', ref: '' });
  const [activePlan, setActivePlan] = useState('growth');
  const [annual, setAnnual] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const ref = params.get('ref');
      if (ref) { setForm(prev => ({ ...prev, ref })); localStorage.setItem('zeno_ref', ref); }
      else { const r = localStorage.getItem('zeno_ref'); if (r) setForm(prev => ({ ...prev, ref: r })); }
    }
  }, []);

  const handleSubmit = async () => {
    if (!form.name || !form.company || !form.phone) { alert('Please fill name, company and phone.'); return; }
    try {
      await addDoc(collection(db, 'website_leads'), {
        name: form.name, company: form.company, phone: form.phone,
        ref_code: form.ref || '', status: 'new', created_at: serverTimestamp(),
      });
    } catch (err) { console.error(err); }
    setSubmitted(true);
    const msg = encodeURIComponent(`Hi, I want to book a demo for Zeno ERP.\n\nName: ${form.name}\nCompany: ${form.company}\nPhone: ${form.phone}${form.ref ? `\nRef: ${form.ref}` : ''}`);
    setTimeout(() => window.open(`https://wa.me/919654597330?text=${msg}`, '_blank'), 800);
  };

  const plans = [
    {
      id: 'starter', name: 'Starter', price: 4999, users: '5 users',
      tag: null, color: '#1d9e75',
      features: ['Service Job Management', 'Technician Assignment', 'AMC Contracts', 'Basic Billing & Invoicing', 'Site Machines Register', 'Mobile App (PWA)', 'Basic Reports', 'Email Support'],
      cta: 'Start Free Trial',
    },
    {
      id: 'growth', name: 'Growth', price: 9999, users: '15 users',
      tag: 'Most Popular', color: '#06b6d4',
      features: ['Everything in Starter +', 'Inventory & MRF Engine', 'Procurement & GRN', 'Asset & Tool Tracking', 'Live Tool Custody Chain', 'Defective Stock Tracking', 'Project Management + BOQ', 'CRM & Enquiry Pipeline', 'Tally Export', 'Priority Support'],
      cta: 'Start Free Trial',
    },
    {
      id: 'scale', name: 'Scale', price: 18999, users: 'Unlimited users',
      tag: 'Best Value', color: '#8b5cf6',
      features: ['Everything in Growth +', 'Multi-branch Operations', 'Advanced Analytics', 'Custom Reports', 'Geofence Job Tracking', 'API Access', 'Dedicated Account Manager', 'SLA Guarantee', 'Custom Onboarding', 'WhatsApp Alerts'],
      cta: 'Get Custom Quote',
    },
  ];

  const faqs = [
    { q: 'Can my technicians use it on mobile?', a: 'Yes — Zeno is a PWA (Progressive Web App). Technicians install it from their browser like an app. No Play Store download needed. Works on any Android or iPhone.' },
    { q: 'How does tool tracking work?', a: 'Every tool is registered in the Asset Registry. When a tool is transferred to a technician, a transfer record is created. You can see exactly who has which tool at any point — with a full custody chain and history.' },
    { q: 'Can I track machines at client sites?', a: 'Yes. Site Machines module lets you register every installed unit — with GPS coordinates, serial number, capacity (TR), brand, model, installation date, and warranty expiry. All linked to service jobs and AMC.' },
    { q: 'How does defective item tracking work?', a: 'When a technician marks an item as defective on site, it enters the Defective Stock Dashboard. SM can raise a vendor return or scrap it — with full inventory ledger entries. Nothing gets lost.' },
    { q: 'How long does onboarding take?', a: 'Most companies are live in 3–5 working days. We handle account setup, import your client and machine data, add your team, and run a training session. Zero consultant fees.' },
    { q: 'Does it work for multi-branch operations?', a: 'Yes — Zeno is built multi-tenant. You can manage multiple branches, teams, and sites from one account. Each branch has its own data isolation.' },
    { q: 'Is there a contract or lock-in?', a: 'No lock-in. Monthly billing. Cancel anytime. Annual plan gives you 2 months free.' },
    { q: 'Does it integrate with Tally?', a: 'Yes. One-click Tally XML export for all financial transactions, invoices, and payments. No double data entry.' },
    { q: 'Is my data safe?', a: 'Yes. Every record is isolated by company ID. Firestore security rules make it architecturally impossible for one company to see another company\'s data. All transactions are immutable — nothing can be silently edited or deleted.' },
    { q: 'What is the pricing?', a: 'Starter at ₹4,999/month (5 users), Growth at ₹9,999/month (15 users — most popular), Scale at ₹18,999/month (unlimited users). 14-day free trial. No credit card needed. Annual plan = 2 months free.' },
  ];

  const css = `
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #1e293b; background: #fff; line-height: 1.6; }
    :root { --teal: #0f6e56; --teal-light: #1d9e75; --teal-bg: #e1f5ee; --dark: #0f172a; --muted: #64748b; --border: #e2e8f0; --surface: #f8fafc; }
    a { text-decoration: none; }

    /* NAV */
    nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; background: rgba(15,23,42,0.97); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(255,255,255,0.08); padding: 0 2rem; height: 64px; display: flex; align-items: center; justify-content: space-between; }
    .nav-logo { display: flex; align-items: center; gap: 10px; }
    .nav-logo-icon { width: 36px; height: 36px; background: linear-gradient(135deg, #06b6d4, #1d9e75); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 18px; color: white; }
    .nav-logo-text { font-size: 20px; font-weight: 700; color: white; }
    .nav-links { display: flex; align-items: center; gap: 1.5rem; list-style: none; }
    .nav-links a { color: rgba(255,255,255,0.7); font-size: 14px; font-weight: 500; transition: color 0.2s; }
    .nav-links a:hover { color: white; }
    .nav-cta { background: linear-gradient(135deg, #06b6d4, #1d9e75) !important; color: white !important; padding: 8px 20px; border-radius: 8px; font-weight: 600 !important; }
    @media(max-width:768px) { .nav-links { display: none; } }

    /* HERO */
    .hero { min-height: 100vh; background: linear-gradient(160deg, #0f172a 0%, #0b2a2f 50%, #042f2e 100%); display: flex; align-items: center; justify-content: center; text-align: center; padding: 120px 2rem 80px; position: relative; overflow: hidden; }
    .hero::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse 80% 50% at 50% 0%, rgba(6,182,212,0.12) 0%, transparent 70%); pointer-events: none; }
    .hero-inner { position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center; max-width: 900px; }
    .hero-badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(6,182,212,0.1); border: 1px solid rgba(6,182,212,0.3); color: #67e8f9; font-size: 13px; font-weight: 500; padding: 6px 14px; border-radius: 100px; margin-bottom: 2rem; }
    .badge-dot { width: 6px; height: 6px; background: #06b6d4; border-radius: 50%; animation: pulse 2s infinite; }
    @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
    .hero h1 { font-size: clamp(2.5rem, 6vw, 4.5rem); font-weight: 800; color: white; line-height: 1.1; letter-spacing: -0.02em; margin-bottom: 1.5rem; }
    .hero h1 span { background: linear-gradient(135deg, #06b6d4, #1d9e75); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
    .hero-sub { font-size: clamp(1rem, 2vw, 1.2rem); color: rgba(255,255,255,0.6); max-width: 620px; margin: 0 auto 2.5rem; }
    .hero-cta-group { display: flex; align-items: center; justify-content: center; gap: 1rem; flex-wrap: wrap; margin-bottom: 1rem; }
    .btn-primary { background: linear-gradient(135deg, #06b6d4, #1d9e75); color: white; padding: 14px 32px; border-radius: 10px; font-size: 16px; font-weight: 600; border: none; cursor: pointer; transition: transform 0.2s, opacity 0.2s; display: inline-flex; align-items: center; gap: 8px; }
    .btn-primary:hover { transform: translateY(-2px); opacity: 0.95; }
    .btn-secondary { background: rgba(255,255,255,0.08); color: white; padding: 14px 32px; border-radius: 10px; font-size: 16px; font-weight: 500; border: 1px solid rgba(255,255,255,0.15); transition: background 0.2s; }
    .btn-secondary:hover { background: rgba(255,255,255,0.12); }
    .hero-trial-note { font-size: 13px; color: rgba(255,255,255,0.4); margin-bottom: 3rem; }
    .hero-stats { display: flex; align-items: center; justify-content: center; gap: 3rem; flex-wrap: wrap; padding-top: 3rem; border-top: 1px solid rgba(255,255,255,0.08); width: 100%; }
    .hero-stat-num { font-size: 2rem; font-weight: 800; background: linear-gradient(135deg, #06b6d4, #1d9e75); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
    .hero-stat-label { font-size: 13px; color: rgba(255,255,255,0.5); margin-top: 4px; text-align: center; }

    /* SECTIONS */
    section { padding: 100px 2rem; }
    .container { max-width: 1200px; margin: 0 auto; }
    .section-label { font-size: 13px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #1d9e75; margin-bottom: 1rem; }
    .section-title { font-size: clamp(2rem, 4vw, 3rem); font-weight: 800; color: #0f172a; line-height: 1.15; letter-spacing: -0.02em; margin-bottom: 1.25rem; }
    .section-sub { font-size: 1.1rem; color: #64748b; max-width: 600px; line-height: 1.7; }

    /* SOCIAL PROOF BANNER */
    .proof-banner { background: linear-gradient(135deg, #042f2e, #0b2a2f); padding: 20px 2rem; text-align: center; }
    .proof-banner-inner { max-width: 900px; margin: 0 auto; display: flex; align-items: center; justify-content: center; gap: 2rem; flex-wrap: wrap; }
    .proof-item { display: flex; align-items: center; gap: 8px; color: rgba(255,255,255,0.8); font-size: 14px; font-weight: 500; }
    .proof-dot { width: 6px; height: 6px; background: #06b6d4; border-radius: 50%; }

    /* CASE STUDY */
    .case-study { background: #f8fafc; }
    .case-card { background: white; border-radius: 24px; border: 1px solid #e2e8f0; overflow: hidden; display: grid; grid-template-columns: 1fr 1fr; gap: 0; margin-top: 3rem; }
    @media(max-width:768px) { .case-card { grid-template-columns: 1fr; } }
    .case-left { padding: 3rem; background: linear-gradient(160deg, #0f172a, #042f2e); }
    .case-right { padding: 3rem; }
    .case-company { font-size: 13px; font-weight: 700; color: #67e8f9; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 1rem; }
    .case-quote { font-size: 1.3rem; font-weight: 600; color: white; line-height: 1.5; margin-bottom: 2rem; font-style: italic; }
    .case-author { font-size: 14px; color: rgba(255,255,255,0.6); }
    .case-author strong { color: white; display: block; font-size: 15px; }
    .case-metrics { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
    .case-metric { text-align: center; padding: 1.25rem; background: #f8fafc; border-radius: 14px; border: 1px solid #e2e8f0; }
    .case-metric-num { font-size: 2rem; font-weight: 800; background: linear-gradient(135deg, #06b6d4, #1d9e75); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
    .case-metric-label { font-size: 12px; color: #64748b; margin-top: 4px; font-weight: 500; }

    /* PROBLEM */
    .problem-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin-top: 3rem; }
    .problem-card { background: white; border: 1px solid #e2e8f0; border-radius: 16px; padding: 1.75rem; }
    .problem-icon { width: 48px; height: 48px; background: #fef2f2; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 22px; margin-bottom: 1rem; }
    .problem-card h3 { font-size: 1.05rem; font-weight: 600; color: #0f172a; margin-bottom: 0.5rem; }
    .problem-card p { font-size: 0.9rem; color: #64748b; }

    /* FEATURES */
    .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 2rem; margin-top: 4rem; }
    .feature-card { background: white; border: 1px solid #e2e8f0; border-radius: 20px; padding: 2rem; transition: border-color 0.2s, transform 0.2s; }
    .feature-card:hover { border-color: #1d9e75; transform: translateY(-4px); }
    .feature-icon { width: 56px; height: 56px; background: #e1f5ee; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 26px; margin-bottom: 1.25rem; }
    .feature-card h3 { font-size: 1.2rem; font-weight: 700; color: #0f172a; margin-bottom: 0.75rem; }
    .feature-card p { font-size: 0.95rem; color: #64748b; margin-bottom: 1rem; }
    .feature-list { list-style: none; }
    .feature-list li { font-size: 0.88rem; color: #64748b; padding: 4px 0; display: flex; align-items: flex-start; gap: 8px; }
    .feature-list li::before { content: '✓'; color: #1d9e75; font-weight: 700; flex-shrink: 0; margin-top: 1px; }
    .feature-badge { display: inline-block; font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 999px; margin-bottom: 0.75rem; }

    /* LIVE TRACKING SECTION */
    .tracking { background: linear-gradient(160deg, #0f172a, #0b2a2f, #042f2e); }
    .tracking .section-label { color: #67e8f9; }
    .tracking .section-title { color: white; }
    .tracking .section-sub { color: rgba(255,255,255,0.6); }
    .tracking-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.5rem; margin-top: 3rem; }
    .tracking-card { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 1.75rem; transition: border-color 0.2s; }
    .tracking-card:hover { border-color: #06b6d4; }
    .tracking-card-icon { font-size: 2rem; margin-bottom: 1rem; }
    .tracking-card h3 { font-size: 1rem; font-weight: 700; color: white; margin-bottom: 0.5rem; }
    .tracking-card p { font-size: 0.88rem; color: rgba(255,255,255,0.6); line-height: 1.6; }
    .tracking-card-tag { display: inline-block; font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 999px; background: rgba(6,182,212,0.15); color: #67e8f9; margin-bottom: 0.75rem; }

    /* HOW */
    .how { background: #f8fafc; }
    .steps { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem; margin-top: 4rem; }
    .step { text-align: center; }
    .step-num { width: 52px; height: 52px; background: linear-gradient(135deg, #06b6d4, #1d9e75); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; font-weight: 800; color: white; margin: 0 auto 1.25rem; }
    .step h3 { font-size: 1rem; font-weight: 700; color: #0f172a; margin-bottom: 0.5rem; }
    .step p { font-size: 0.9rem; color: #64748b; }

    /* MACHINES */
    .machines-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 1rem; margin-top: 3rem; }
    .machine-card { background: white; border: 1px solid #e2e8f0; border-radius: 14px; padding: 1.5rem 1rem; text-align: center; transition: border-color 0.2s; }
    .machine-card:hover { border-color: #1d9e75; }
    .machine-icon { font-size: 2rem; margin-bottom: 0.75rem; }
    .machine-card h4 { font-size: 0.9rem; font-weight: 600; color: #0f172a; }
    .machine-card p { font-size: 0.8rem; color: #64748b; margin-top: 4px; }

    /* PRICING */
    .pricing { background: #f8fafc; }
    .pricing-toggle { display: flex; align-items: center; justify-content: center; gap: 12px; margin-bottom: 3rem; }
    .toggle-label { font-size: 14px; font-weight: 600; color: #64748b; }
    .toggle-label.active { color: #0f172a; }
    .toggle-switch { width: 48px; height: 26px; background: #e2e8f0; border-radius: 999px; cursor: pointer; position: relative; transition: background 0.2s; border: none; }
    .toggle-switch.on { background: linear-gradient(135deg, #06b6d4, #1d9e75); }
    .toggle-knob { width: 20px; height: 20px; background: white; border-radius: 50%; position: absolute; top: 3px; left: 3px; transition: left 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.2); }
    .toggle-knob.on { left: 25px; }
    .annual-badge { background: #e1f5ee; color: #0f6e56; font-size: 12px; font-weight: 700; padding: 2px 8px; border-radius: 999px; }
    .plans-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; }
    .plan-card { background: white; border: 2px solid #e2e8f0; border-radius: 20px; padding: 2rem; position: relative; transition: border-color 0.2s, transform 0.2s; }
    .plan-card.popular { border-color: #06b6d4; transform: scale(1.02); }
    .plan-card:hover { border-color: #1d9e75; }
    .plan-tag { position: absolute; top: -12px; left: 50%; transform: translateX(-50%); background: linear-gradient(135deg, #06b6d4, #1d9e75); color: white; font-size: 12px; font-weight: 700; padding: 4px 16px; border-radius: 999px; white-space: nowrap; }
    .plan-name { font-size: 1rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 0.5rem; }
    .plan-price { font-size: 2.5rem; font-weight: 800; color: #0f172a; line-height: 1; }
    .plan-price span { font-size: 1rem; font-weight: 500; color: #64748b; }
    .plan-users { font-size: 13px; color: #64748b; margin: 0.5rem 0 1.5rem; padding-bottom: 1.5rem; border-bottom: 1px solid #f1f5f9; }
    .plan-features { list-style: none; margin-bottom: 2rem; }
    .plan-features li { font-size: 14px; color: #374151; padding: 5px 0; display: flex; align-items: flex-start; gap: 8px; }
    .plan-features li::before { content: '✓'; color: #1d9e75; font-weight: 700; flex-shrink: 0; margin-top: 1px; }
    .plan-features li.highlight { font-weight: 600; color: #0f172a; }
    .plan-cta { width: 100%; padding: 12px; border-radius: 10px; font-size: 15px; font-weight: 700; cursor: pointer; border: none; font-family: inherit; transition: opacity 0.2s, transform 0.2s; }
    .plan-cta:hover { opacity: 0.9; transform: translateY(-1px); }
    .plan-cta.primary { background: linear-gradient(135deg, #06b6d4, #1d9e75); color: white; }
    .plan-cta.secondary { background: #f1f5f9; color: #0f172a; }
    .pricing-note { text-align: center; margin-top: 2rem; font-size: 13px; color: #64748b; }

    /* TRUST */
    .trust { background: linear-gradient(160deg, #0f172a, #0b2a2f, #042f2e); }
    .trust .section-title { color: white; }
    .trust .section-sub { color: rgba(255,255,255,0.6); }
    .trust .section-label { color: #67e8f9; }
    .trust-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin-top: 3rem; }
    .trust-card { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 1.75rem; }
    .trust-card h3 { font-size: 2rem; font-weight: 800; color: #06b6d4; margin-bottom: 0.5rem; }
    .trust-card p { font-size: 0.9rem; color: rgba(255,255,255,0.6); }

    /* FAQ */
    .faq-list { margin-top: 3rem; max-width: 800px; }
    .faq-item { border-bottom: 1px solid #e2e8f0; }
    .faq-q { width: 100%; background: none; border: none; text-align: left; cursor: pointer; padding: 1.25rem 0; font-size: 1rem; font-weight: 600; color: #0f172a; display: flex; align-items: center; justify-content: space-between; gap: 1rem; font-family: inherit; }
    .faq-q:hover { color: #1d9e75; }
    .faq-icon { font-size: 1.25rem; flex-shrink: 0; color: #64748b; transition: transform 0.2s; }
    .faq-icon.open { transform: rotate(45deg); color: #1d9e75; }
    .faq-a { font-size: 0.95rem; color: #64748b; line-height: 1.7; overflow: hidden; max-height: 0; transition: max-height 0.3s ease, padding 0.3s; }
    .faq-a.open { max-height: 500px; padding-bottom: 1.25rem; }

    /* AFFILIATE */
    .affiliate { background: linear-gradient(160deg, #0f172a, #0b2a2f, #042f2e); }
    .affiliate .section-title { color: white; }
    .affiliate .section-sub { color: rgba(255,255,255,0.6); }
    .affiliate .section-label { color: #67e8f9; }
    .affiliate-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.5rem; margin-bottom: 3rem; margin-top: 3rem; }
    .affiliate-card { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 1.75rem; text-align: center; }
    .affiliate-card-icon { font-size: 2rem; margin-bottom: 1rem; }
    .affiliate-card h3 { color: white; font-size: 1rem; font-weight: 700; margin-bottom: 0.5rem; }
    .affiliate-card p { color: rgba(255,255,255,0.6); font-size: 0.9rem; }

    /* DEMO */
    .demo { background: white; }
    .demo-wrap { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 24px; padding: 3rem; max-width: 540px; margin: 3rem auto 0; }
    .demo-wrap h3 { font-size: 1.5rem; font-weight: 800; color: #0f172a; margin-bottom: 0.5rem; text-align: center; }
    .demo-wrap p { font-size: 14px; color: #64748b; text-align: center; margin-bottom: 2rem; }
    .form-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 1rem; }
    label { font-size: 13px; font-weight: 600; color: #0f172a; }
    input { border: 1.5px solid #e2e8f0; border-radius: 10px; padding: 13px 14px; font-size: 15px; font-family: inherit; color: #0f172a; background: white; outline: none; transition: border-color 0.2s; width: 100%; }
    input:focus { border-color: #1d9e75; box-shadow: 0 0 0 3px rgba(29,158,117,0.08); }
    .submit-btn { width: 100%; background: linear-gradient(135deg, #06b6d4, #1d9e75); color: white; border: none; cursor: pointer; padding: 15px; border-radius: 10px; font-size: 16px; font-weight: 700; font-family: inherit; margin-top: 0.5rem; transition: opacity 0.2s, transform 0.2s; }
    .submit-btn:hover { opacity: 0.92; transform: translateY(-1px); }
    .form-note { text-align: center; font-size: 12px; color: #94a3b8; margin-top: 1rem; }
    .ref-badge { background: #e1f5ee; border-radius: 8px; padding: 8px 14px; font-size: 13px; color: #0f6e56; font-weight: 600; margin-bottom: 1rem; text-align: center; }
    .success-box { text-align: center; padding: 2rem; }
    .success-box h3 { font-size: 1.5rem; font-weight: 700; color: #0f6e56; margin-bottom: 0.5rem; }
    .success-box p { color: #64748b; margin-bottom: 1.5rem; }
    .wa-btn { display: inline-block; background: linear-gradient(135deg, #06b6d4, #1d9e75); color: white; padding: 12px 28px; border-radius: 10px; font-weight: 700; }
    .demo-trust { display: flex; align-items: center; justify-content: center; gap: 1.5rem; margin-top: 1.5rem; flex-wrap: wrap; }
    .demo-trust-item { font-size: 12px; color: #94a3b8; display: flex; align-items: center; gap: 4px; }

    /* FOOTER */
    footer { background: #0f172a; padding: 3rem 2rem; text-align: center; }
    .footer-links { display: flex; align-items: center; justify-content: center; gap: 1.5rem; margin-bottom: 1rem; flex-wrap: wrap; }
    .footer-links a { color: rgba(255,255,255,0.5); font-size: 13px; }
    .footer-links a:hover { color: white; }
    footer p { color: rgba(255,255,255,0.4); font-size: 13px; margin-top: 0.5rem; }

    @media(max-width:768px) { section { padding: 70px 1.25rem; } .demo-wrap { padding: 1.75rem; } .case-metrics { grid-template-columns: 1fr 1fr; } .plans-grid { grid-template-columns: 1fr; } .plan-card.popular { transform: scale(1); } }
  `;

  const features = [
    {
      icon: '🔧', title: 'Service & Job Management', badge: null, badgeColor: null,
      desc: 'Full job lifecycle — from complaint to closure. Real-time tracking for every technician on the field.',
      points: ['Geofence check-in — 300m radius job start', 'Live job timer with 30-sec auto-refresh', 'Assigned → Working → Completed → Approved', 'Digital service report with site photos', 'Chargeable vs non-chargeable job types', 'Pause/resume job with auto time log'],
    },
    {
      icon: '📍', title: 'Live Tool & Asset Tracking', badge: 'Real-time', badgeColor: '#eff6ff',
      desc: 'Know exactly where every tool is — right now. Full custody chain from store to technician to site.',
      points: ['Asset registry with serial number + category', 'Transfer workflow — store to tech to site', 'Live custody chain — who has what, right now', 'RETURNABLE vs PERSONAL asset classification', 'Carried By tracking on every site transfer', 'Scrap and lost asset workflow'],
    },
    {
      icon: '🗺️', title: 'Site Machine Mapping', badge: 'GPS Tracked', badgeColor: '#f0fdf4',
      desc: 'Every installed unit registered with exact GPS location. Complete equipment history per machine.',
      points: ['GPS coordinates per machine unit', 'Machine type, brand, model, serial number', 'Capacity (TR) and refrigerant type', 'Installation date and warranty expiry', 'Full service job history per machine', 'Linked to AMC contracts automatically'],
    },
    {
      icon: '⚠️', title: 'Defective Item Tracking', badge: 'Zero Loss', badgeColor: '#fef3c7',
      desc: 'Nothing goes missing. Every defective item tracked from site to store to vendor return.',
      points: ['Tech reports defective item from job site', 'Defective Stock Dashboard for SM', 'Vendor return with inventory deduction', 'Scrap approval workflow', 'Full defective ledger history', 'Separate defective + scrap stock counts'],
    },
    {
      icon: '📦', title: 'Inventory & MRF Engine', badge: null, badgeColor: null,
      desc: 'Ledger-first inventory. Every movement tracked, negative stock prevented, full replay history.',
      points: ['Material Request Flow (MRF) with approval', 'Stock check at MRF approve time', 'GRN, direct issue, return unused/defective', 'Per-project material budget tracking', 'High-side / low-side material classification', 'Inventory ledger with running balance'],
    },
    {
      icon: '📅', title: 'AMC Contract Management', badge: null, badgeColor: null,
      desc: 'Never miss a renewal or visit. Full AMC lifecycle with auto-invoice generation.',
      points: ['Contract creation with frequency settings', 'Auto next invoice date calculation', 'AMC-linked service job creation', 'OEM warranty return tracking', 'Contract status: Active / Expired / Inactive', 'Renewal alerts on dashboard'],
    },
    {
      icon: '🏗️', title: 'Project Management', badge: null, badgeColor: null,
      desc: 'Full project lifecycle for installation contracts. Checklist-driven material stage unlock.',
      points: ['8 HVAC checklist templates (VRF, Chiller, Split...)', 'Material stage budgeting per project type', 'Document version control (drawings, BOQ)', 'Quotation and BOQ creation', 'Project P&L with material + financial costs', 'Enquiry → Quotation → Project in one click'],
    },
    {
      icon: '💰', title: 'Billing & Accounts', badge: null, badgeColor: null,
      desc: 'From invoice to payment — complete financial operations. Tally-compatible export included.',
      points: ['Invoice creation with partial payment support', 'Expense approval workflow', 'Vendor payment tracking', 'Cash/Bank book, P&L reports', 'Tally XML export — no double entry', 'Financial transactions immutable ledger'],
    },
    {
      icon: '🛒', title: 'Procurement & Vendors', badge: null, badgeColor: null,
      desc: 'End-to-end purchase management. Procurement queue to GRN to vendor payment — fully tracked.',
      points: ['Auto procurement queue from MRF approvals', 'Purchase order with amendment log', 'GRN with rate capture at delivery', 'Vendor return with inventory deduction', 'Preferred vendor auto-fill on PO', 'Vendor payment reconciliation'],
    },
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

  return (
    <>
      <Head>
        <title>Zeno — HVAC Operating System | Field Service + Inventory + AMC</title>
        <meta name="description" content="The only ERP built for HVAC companies. Manage service jobs, live tool tracking, site machine mapping, inventory, AMC contracts, and billing from one platform." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="Zeno ERP — Built for HVAC Companies" />
        <meta property="og:description" content="Live tool tracking, site machine mapping, defective item control, AMC management and billing — purpose-built for HVAC." />
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
          <li><a href="#tracking">Live Tracking</a></li>
          <li><a href="#machines">Equipment</a></li>
          <li><a href="#pricing">Pricing</a></li>
          <li><a href="#faq">FAQ</a></li>
          <li><a href="#affiliate">Affiliate</a></li>
          <li><a href="#demo" className="nav-cta">Book Free Demo</a></li>
        </ul>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-badge"><div className="badge-dot"></div>Purpose-built for HVAC Companies</div>
          <h1>The HVAC<br /><span>Operating System</span></h1>
          <p className="hero-sub">Live tool tracking. Site machine mapping. AMC automation. Inventory control. Billing. Everything your HVAC company needs — in one platform built from the ground up for field service.</p>
          <div className="hero-cta-group">
            <a href="#demo" className="btn-primary">Start Free 14-Day Trial →</a>
            <a href="#features" className="btn-secondary">See All Features</a>
          </div>
          <p className="hero-trial-note">No credit card required • Setup in 48 hours • Cancel anytime</p>
          <div className="hero-stats">
            {[['14-day','Free Trial'],['48hrs','Go Live'],['100%','HVAC-Built'],['₹0','Setup Fee']].map(([num, label]) => (
              <div key={label}>
                <div className="hero-stat-num">{num}</div>
                <div className="hero-stat-label">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROOF BANNER */}
      <div className="proof-banner">
        <div className="proof-banner-inner">
          {['Om Aircon, Dehradun — Live on Zeno', '11 Technicians Onboarded in 2 Weeks', '75+ Tools & Assets Tracked Live', 'AMC Contracts Automated'].map((item, i) => (
            <div className="proof-item" key={i}>
              <div className="proof-dot"></div>
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* CASE STUDY */}
      <section className="case-study">
        <div className="container">
          <div className="section-label">Real Customer Story</div>
          <h2 className="section-title">Om Aircon went from WhatsApp chaos<br />to full operational control</h2>
          <p className="section-sub">Dehradun-based HVAC service company with 11 technicians, multiple sites, and AMC clients — now running entirely on Zeno.</p>
          <div className="case-card">
            <div className="case-left">
              <div className="case-company">Om Aircon • Dehradun</div>
              <p className="case-quote">"Pehle sab WhatsApp pe hota tha — kaunsa tech kahan hai, kaunsa tool kiske paas hai, kab invoice bhejna hai. Ab sab ek jagah dikh ta hai."</p>
              <p className="case-author">
                <strong>Amit Rathore</strong>
                Owner, Om Aircon
              </p>
            </div>
            <div className="case-right">
              <div className="case-metrics">
                {[['11','Technicians on Zeno'],['75+','Tools & assets live'],['2 weeks','Full onboarding'],['100%','Jobs tracked']].map(([num, label]) => (
                  <div className="case-metric" key={label}>
                    <div className="case-metric-num">{num}</div>
                    <div className="case-metric-label">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section style={{background:'white'}}>
        <div className="container">
          <div className="section-label">The Problem</div>
          <h2 className="section-title">Running your HVAC business<br />on spreadsheets and WhatsApp?</h2>
          <p className="section-sub">Most HVAC companies are losing money silently — because of operational chaos.</p>
          <div className="problem-grid">
            {[
              ['📋','No visibility on field jobs',"You don't know which technician is where, what happened on site, or whether the job is billable."],
              ['🔧','Tools going missing','No record of which technician has what tool. Expensive equipment disappears with no accountability.'],
              ['🗺️','No machine register','Installed units scattered across sites with no central record. Serial numbers in paper registers.'],
              ['⚠️','Defective items lost','Tech returns a defective part — it disappears. No tracking from site to vendor return.'],
              ['📅','AMC renewals missed','Clients not invoiced on time. Visit dates missed. Revenue leaking silently every month.'],
              ['💰','Billing always delayed','Jobs completed but invoices raised weeks later. Cash flow suffers because of manual processes.'],
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

      {/* LIVE TRACKING */}
      <section id="tracking" className="tracking">
        <div className="container">
          <div className="section-label">Live Operations</div>
          <h2 className="section-title">Real-time visibility.<br />Always know what is happening.</h2>
          <p className="section-sub">From technician location to tool custody to machine status — everything live, everything tracked.</p>
          <div className="tracking-grid">
            {[
              { icon: '📍', tag: 'GPS Tracked', title: 'Technician Job Tracking', desc: 'Geofence check-in enforces 300m radius before job starts. Live job timer auto-refreshes every 30 seconds. You always know who started what and when.' },
              { icon: '🔧', tag: 'Real-time', title: 'Live Tool Custody Chain', desc: 'Every tool has a live holder — store, technician, or site. Transfer creates an immutable record. You know exactly who has which tool right now.' },
              { icon: '🗺️', tag: 'GPS Mapped', title: 'Site Machine Location', desc: 'Every installed unit has GPS coordinates. Find any machine at any client site instantly. Full serial number, capacity, and warranty details per unit.' },
              { icon: '⚠️', tag: 'Zero Loss', title: 'Defective Item Control', desc: 'Tech marks an item defective on site. SM gets notified. Defective Stock Dashboard shows everything pending — ready for vendor return or scrap.' },
              { icon: '📦', tag: 'Live Stock', title: 'Real-time Inventory', desc: 'Stock levels update instantly on every MRF issue, GRN receipt, or return. No end-of-day reconciliation. Running balance always accurate.' },
              { icon: '🔔', tag: 'Instant', title: 'Action Alerts', desc: 'Manager gets notified on job completion, MRF approval, asset transfer, and AMC renewals. Right people get right information at the right time.' },
            ].map((item) => (
              <div className="tracking-card" key={item.title}>
                <div className="tracking-card-tag">{item.tag}</div>
                <div className="tracking-card-icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
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
          <p className="section-sub">Every feature built specifically for how HVAC companies operate. Not a generic ERP renamed.</p>
          <div className="features-grid">
            {features.map(f => (
              <div className="feature-card" key={f.title}>
                <div className="feature-icon">{f.icon}</div>
                {f.badge && (
                  <span className="feature-badge" style={{background: f.badgeColor, color: '#0f172a'}}>
                    {f.badge}
                  </span>
                )}
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
            {[['Track per unit','Serial no. + brand + model'],['GPS location','Exact lat/lng + site address'],['Warranty alert','Installation + expiry dates'],['Service history','Every job per machine']].map(([label,val]) => (
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
          <h2 className="section-title">Live in 48 hours,<br />not 48 days</h2>
          <p className="section-sub">No complex implementation. No consultant fees. We handle everything — you just start using it.</p>
          <div className="steps">
            {[
              ['1','Book a Demo',"See the full system live in 15 minutes. We'll map your exact workflows."],
              ['2','Onboarding Call','We set up your company, add your team, and import your client and machine data.'],
              ['3','Go Live in 48hrs','Your team gets trained. Technicians install the app. You start from day one.'],
              ['4','Scale with You','Add modules as you grow. Multi-branch support. No per-user price jumps.'],
            ].map(([n,t,d]) => (
              <div className="step" key={n}>
                <div className="step-num">{n}</div>
                <h3>{t}</h3>
                <p>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="pricing">
        <div className="container">
          <div style={{textAlign:'center'}}>
            <div className="section-label" style={{textAlign:'center'}}>Pricing</div>
            <h2 className="section-title">Simple pricing.<br />No hidden charges.</h2>
            <p className="section-sub" style={{margin:'0 auto 2rem'}}>One flat price per company — not per user. Scale your team without scaling your bill.</p>
          </div>
          <div className="pricing-toggle">
            <span className={`toggle-label${!annual?' active':''}`}>Monthly</span>
            <button className={`toggle-switch${annual?' on':''}`} onClick={() => setAnnual(!annual)}>
              <div className={`toggle-knob${annual?' on':''}`}></div>
            </button>
            <span className={`toggle-label${annual?' active':''}`}>Annual</span>
            <span className="annual-badge">1 month free</span>
          </div>
          <div className="plans-grid">
            {plans.map(plan => {
              const price = annual ? plan.price : Math.round(plan.price * 1.2);
              return (
                <div key={plan.id} className={`plan-card${plan.id === 'growth' ? ' popular' : ''}`}>
                  {plan.tag && <div className="plan-tag">{plan.tag}</div>}
                  <div className="plan-name">{plan.name}</div>
                  <div className="plan-price">₹{price.toLocaleString('en-IN')}<span>/month</span></div>
                  <div className="plan-users">{plan.users} {annual ? '• billed annually (1 month free)' : '• billed monthly'}</div>
                  <ul className="plan-features">
                    {plan.features.map(f => (
                      <li key={f} className={f.startsWith('Everything') ? 'highlight' : ''}>{f}</li>
                    ))}
                  </ul>
                  <a href="#demo">
                    <button className={`plan-cta${plan.id === 'growth' ? ' primary' : ' secondary'}`}>
                      {plan.cta}
                    </button>
                  </a>
                </div>
              );
            })}
          </div>
          <p className="pricing-note">All plans include free onboarding, free setup, and 14-day free trial. No credit card required to start.</p>
        </div>
      </section>

      {/* TRUST */}
      <section className="trust">
        <div className="container">
          <div className="section-label">Why Zeno</div>
          <h2 className="section-title">Built different.<br />Not a generic ERP renamed.</h2>
          <p className="section-sub" style={{color:'rgba(255,255,255,0.6)'}}>Every module built from scratch for how HVAC companies actually operate — not adapted from a generic platform.</p>
          <div className="trust-grid">
            {[
              ['100%','HVAC-specific — geofence job start, TR capacity tracking, refrigerant type, VRF checklists'],
              ['Live','Real-time tool custody, job tracking, stock updates — no end-of-day sync needed'],
              ['Zero','Setup fee. ₹0 onboarding cost. We set everything up for you in 48 hours'],
              ['Immutable','Every transaction permanently recorded. Full audit trail. No silent edits or deletes ever'],
              ['Multi-site','Run multiple branches, sites, and teams from one account — with complete data isolation'],
              ['Tally-ready','One-click Tally XML export. No double data entry between operations and accounts team'],
            ].map(([h,p]) => (
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
          <h2 className="section-title">Questions we get asked</h2>
          <p className="section-sub">Everything you want to know before starting your trial.</p>
          <div className="faq-list">
            {faqs.map((f, i) => (
              <div className="faq-item" key={i}>
                <button className="faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  {f.q}
                  <span className={`faq-icon${openFaq === i ? ' open' : ''}`}>+</span>
                </button>
                <div className={`faq-a${openFaq === i ? ' open' : ''}`}>{f.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AFFILIATE */}
      <section id="affiliate" className="affiliate">
        <div className="container" style={{textAlign:'center'}}>
          <div className="section-label">Partner Program</div>
          <h2 className="section-title">Earn ₹5,000 for every<br />HVAC company you refer</h2>
          <p className="section-sub" style={{margin:'0 auto'}}>Know HVAC contractors? Refer them to Zeno and earn ₹5,000 for every company that subscribes.</p>
          <div className="affiliate-grid">
            {[
              ['🔗','Get Your Link','Sign up free — get a unique referral link instantly'],
              ['📤','Share It','Share with HVAC companies via WhatsApp, email, or in person'],
              ['💰','Earn ₹5,000','Paid for every company that subscribes. One-time per conversion.'],
            ].map(([icon,title,desc]) => (
              <div className="affiliate-card" key={title}>
                <div className="affiliate-card-icon">{icon}</div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
          <a href="/affiliate" className="btn-primary" style={{display:'inline-flex'}}>Become an Affiliate →</a>
        </div>
      </section>

      {/* DEMO */}
      <section id="demo" className="demo">
        <div className="container" style={{textAlign:'center'}}>
          <div className="section-label">Get Started</div>
          <h2 className="section-title">Start your free trial today</h2>
          <p className="section-sub" style={{margin:'0 auto'}}>14 days free. No credit card. We set everything up for you.</p>
          <div className="demo-wrap">
            {submitted ? (
              <div className="success-box">
                <div style={{fontSize:'3rem',marginBottom:'1rem'}}>✅</div>
                <h3>You are in!</h3>
                <p>Our team will call you within 24 hours to set up your account and schedule your personalized walkthrough.</p>
                <a href={`https://wa.me/919654597330?text=${encodeURIComponent('Hi, I just signed up for a Zeno ERP trial and would like to get started.')}`} target="_blank" rel="noreferrer" className="wa-btn">Chat on WhatsApp →</a>
              </div>
            ) : (
              <>
                <h3>Book a Free Demo</h3>
                <p>We will call you within 24 hours to show you the full system.</p>
                {form.ref && <div className="ref-badge">Referred by: {form.ref}</div>}
                <div className="form-group">
                  <label>Your Name *</label>
                  <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Amit Verma" />
                </div>
                <div className="form-group">
                  <label>Company Name *</label>
                  <input value={form.company} onChange={e=>setForm({...form,company:e.target.value})} placeholder="ABC HVAC Services" />
                </div>
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="+91 98765 43210" />
                </div>
                <button className="submit-btn" onClick={handleSubmit}>Book My Free Demo →</button>
                <p className="form-note">No spam. We will only call to schedule your demo.</p>
                <div className="demo-trust">
                  {['✓ 14-day free trial','✓ No credit card','✓ Setup in 48hrs','✓ Cancel anytime'].map(t => (
                    <span className="demo-trust-item" key={t}>{t}</span>
                  ))}
                </div>
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
          {[['#features','Features'],['#tracking','Live Tracking'],['#machines','Equipment'],['#pricing','Pricing'],['#faq','FAQ'],['#affiliate','Affiliate'],['#demo','Book Demo'],['/terms','Terms']].map(([href,label]) => (
            <a href={href} key={label}>{label}</a>
          ))}
        </div>
        <p>HVAC Operating System — Built for Field Service Companies</p>
        <p>© 2026 Zeno Technologies. All rights reserved.</p>
      </footer>
    </>
  );
}