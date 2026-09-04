export function captureUTM() {
  if (typeof window === 'undefined') return;
  const params = new URLSearchParams(window.location.search);
  const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
  const utm = {};
  let found = false;
  utmKeys.forEach((key) => {
    const val = params.get(key);
    if (val) { utm[key] = val; found = true; }
  });
  if (found) {
    utm.captured_at = new Date().toISOString();
    localStorage.setItem('zeno_utm', JSON.stringify(utm));
  }
  if (!localStorage.getItem('zeno_landing_page')) {
    localStorage.setItem('zeno_landing_page', window.location.pathname);
  }
  if (!localStorage.getItem('zeno_referrer') && document.referrer) {
    localStorage.setItem('zeno_referrer', document.referrer);
  }
}

export function getStoredUTM() {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem('zeno_utm');
    const utm = raw ? JSON.parse(raw) : {};
    return {
      utm_source: utm.utm_source || '',
      utm_medium: utm.utm_medium || '',
      utm_campaign: utm.utm_campaign || '',
      utm_term: utm.utm_term || '',
      utm_content: utm.utm_content || '',
      landing_page: localStorage.getItem('zeno_landing_page') || '',
      referrer: localStorage.getItem('zeno_referrer') || '',
    };
  } catch (e) {
    return {};
  }
}