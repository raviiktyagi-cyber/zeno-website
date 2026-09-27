import Head from 'next/head';

export default function ThankYou() {
  const css = `
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
    .ty-page { min-height: 100vh; background: linear-gradient(160deg, #0f172a, #0b2a2f, #042f2e); display: flex; align-items: center; justify-content: center; padding: 2rem; }
    .ty-card { background: white; border-radius: 24px; padding: 3rem; max-width: 480px; text-align: center; }
    .ty-icon { font-size: 3rem; margin-bottom: 1rem; }
    .ty-card h1 { font-size: 1.75rem; font-weight: 800; color: #0f6e56; margin-bottom: 0.75rem; }
    .ty-card p { color: #64748b; margin-bottom: 1.5rem; line-height: 1.6; }
    .wa-btn { display: inline-block; background: linear-gradient(135deg, #06b6d4, #1d9e75); color: white; padding: 12px 28px; border-radius: 10px; font-weight: 700; text-decoration: none; margin-bottom: 1rem; }
    .home-link { display: block; color: #94a3b8; font-size: 13px; text-decoration: none; }
  `;
  return (
    <>
      <Head>
        <title>You're In! — Zeno Demo Booked</title>
        <meta name="robots" content="noindex" />
      </Head>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <section className="ty-page">
        <div className="ty-card">
          <div className="ty-icon">✅</div>
          <h1>You're in!</h1>
          <p>Our team will call you within 24 hours to schedule your personalized ZENO walkthrough.</p>
          <a href={`https://wa.me/919654597330?text=${encodeURIComponent('Hi, I just booked a Zeno demo and wanted to follow up.')}`} target="_blank" rel="noreferrer" className="wa-btn">Chat on WhatsApp →</a>
          <a href="/" className="home-link">← Back to home</a>
        </div>
      </section>
    </>
  );
}