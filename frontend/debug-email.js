import fetch from 'node-fetch';

// ZeptoMail configuration - same as server.js
const ZEPTO_API_URL = 'https://api.zeptomail.in/v1.1/email/template';
const ZEPTO_API_KEY = 'Zoho-enczapikey PHtE6r1fR+Hs2mUv80AIs6C4FsChYIIrqL9uegROstpBCfIGTU1dq9orlmXj+Rt5VPRKQqbIzd9stemZ5+KGdz3pMm9PCWqyqK3sx/VYSPOZsbq6x00ftFgSd0LdVYDqetJv0CDTvtbdNA==';
const TEMPLATE_ID = '2518b.623682b2828bdc79.k1.54307f80-9085-11f0-a4b7-d2cf08f4ca8c.19942703f78';

async function testEmailDebug() {
  console.log('🧪 Starting Email Debug Test...');

  // Test with different variable name combinations
  const testCases = [
    {
      name: 'Current Format',
      merge_info: {
        name: 'John Doe',
        event_name: 'Debug Test Event',
        date: 'Monday, December 16, 2024',
        address: 'Test Address, Delhi, India'
      }
    },
    {
      name: 'Alternative Format 1',
      merge_info: {
        customer_name: 'John Doe',
        event_name: 'Debug Test Event',
        event_date: 'Monday, December 16, 2024',
        event_address: 'Test Address, Delhi, India'
      }
    },
    {
      name: 'Alternative Format 2',
      merge_info: {
        Name: 'John Doe',
        EventName: 'Debug Test Event',
        Date: 'Monday, December 16, 2024',
        Address: 'Test Address, Delhi, India'
      }
    }
  ];

  for (const testCase of testCases) {
    console.log(`\n🔍 Testing: ${testCase.name}`);

    const emailPayload = {
      from: {
        address: "noreply@trippechalo.in",
        name: "TrippeChalo Debug"
      },
      to: [{
        email_address: {
          address: "rajvaidhyag@gmail.com",
          name: "Debug Test User"
        }
      }],
      template_key: TEMPLATE_ID,
      merge_info: testCase.merge_info
    };

    console.log('📤 Sending payload:', JSON.stringify(emailPayload, null, 2));

    try {
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
        console.log('✅ Success:', result);
      } else {
        console.log('❌ Failed:', result);
      }
    } catch (error) {
      console.error('💥 Error:', error);
    }

    // Wait 2 seconds between tests
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
}

testEmailDebug().catch(console.error);