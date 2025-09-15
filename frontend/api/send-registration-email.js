// Vercel Serverless Function for ZeptoMail
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    console.log('📧 Vercel Function - Received email request:', req.body);

    const { eventName, customerName, customerEmail } = req.body;

    // Validate required fields
    if (!eventName || !customerName || !customerEmail) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: eventName, customerName, customerEmail'
      });
    }

    // ZeptoMail configuration
    const ZEPTO_API_URL = 'https://api.zeptomail.in/v1.1/email/template';
    const ZEPTO_API_KEY = 'Zoho-enczapikey PHtE6r1fR+Hs2mUv80AIs6C4FsChYIIrqL9uegROstpBCfIGTU1dq9orlmXj+Rt5VPRKQqbIzd9stemZ5+KGdz3pMm9PCWqyqK3sx/VYSPOZsbq6x00ftFgSd0LdVYDqetJv0CDTvtbdNA==';
    const TEMPLATE_ID = '2518b.623682b2828bdc79.k1.54307f80-9085-11f0-a4b7-d2cf08f4ca8c.19942703f78';

    // Prepare ZeptoMail payload
    const emailPayload = {
      from: {
        address: "noreply@trippechalo.in",
        name: "Trippe Chalo"
      },
      to: [{
        email_address: {
          address: customerEmail,
          name: customerName
        }
      }],
      template_key: TEMPLATE_ID,
      merge_info: {
        event_name: eventName,
        customer_name: customerName,
        customer_email: customerEmail
      }
    };

    console.log('🚀 Vercel Function - Sending to ZeptoMail:', {
      to: customerEmail,
      eventName,
      templateId: TEMPLATE_ID
    });

    // Call ZeptoMail API
    const response = await fetch(ZEPTO_API_URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': ZEPTO_API_KEY
      },
      body: JSON.stringify(emailPayload)
    });

    const result = await response.json();

    if (response.ok) {
      const messageId = result.data?.[0]?.additional_info?.[0]?.message_id;
      console.log('✅ Vercel Function - Email sent successfully:', { messageId, to: customerEmail });

      return res.json({
        success: true,
        messageId,
        data: result
      });
    } else {
      console.error('❌ Vercel Function - ZeptoMail error:', result);
      return res.status(400).json({
        success: false,
        error: result.message || result.error || 'Failed to send email'
      });
    }

  } catch (error) {
    console.error('❌ Vercel Function - Server error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
}