import { adminDb } from '../../lib/firebaseAdmin';

export default async function handler(req, res) {
  const { password } = req.query;

  if (password !== process.env.ADMIN_LEADS_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const snapshot = await adminDb
      .collection('website_leads')
      .orderBy('created_at', 'desc')
      .limit(200)
      .get();

    const leads = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name || '',
        company: data.company || '',
        phone: data.phone || '',
        email: data.email || '',
        city: data.city || '',
        industry: data.industry || '',
        team_size: data.team_size || '',
        current_system: data.current_system || '',
        primary_problem: data.primary_problem || '',
        message: data.message || '',
        source: data.source || '',
        utm_source: data.utm_source || '',
        utm_campaign: data.utm_campaign || '',
        ref_code: data.ref_code || '',
        status: data.status || 'new',
        created_at: data.created_at ? data.created_at.toDate().toISOString() : '',
      };
    });

    return res.status(200).json({ leads });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch leads' });
  }
}