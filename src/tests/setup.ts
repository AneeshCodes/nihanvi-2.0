// Seed env vars that lib functions guard against missing
process.env.NOTIFICATION_EMAIL    = 'test-teacher@example.com'
process.env.TWILIO_PHONE_NUMBER   = '+15551234567'
process.env.NEXT_PUBLIC_SITE_URL  = 'http://localhost:3000'
process.env.RESEND_API_KEY        = 'test_resend_key'
process.env.NEXTAUTH_SECRET       = 'test_secret_32_chars_minimum_xx'
