import { NextRequest, NextResponse } from 'next/server';

// Ensure API key is available
if (!process.env.RESEND_API_KEY) {
  throw new Error('Missing RESEND_API_KEY environment variable');
}

const AUDIENCE_ID = '77f27d6f-691b-4ac5-8969-4ab50a39181e';

// Create email HTML template
const createEmailTemplate = (email: string) => `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <title>Maintenance Notification Subscription</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #2563eb; margin-bottom: 20px;">Thank You for Subscribing!</h1>
      <p style="margin-bottom: 15px;">We appreciate your interest in staying updated about our website maintenance.</p>
      <p style="margin-bottom: 15px;">We'll notify you as soon as our website is back online on March 8, 2025 at 18:00.</p>
      <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin-top: 20px;">
        <p style="margin: 0; color: #6b7280;">If you have any questions, feel free to reach out to us.</p>
      </div>
    </body>
  </html>
`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, firstName = '', lastName = '' } = body;

    if (!email) {
      return new Response(JSON.stringify({ error: 'Email is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // First, add the contact to the audience
    const contactResponse = await fetch(
      `https://api.resend.com/audiences/${AUDIENCE_ID}/contacts`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          email,
          first_name: firstName,
          last_name: lastName,
          unsubscribed: false,
        }),
      }
    );

    const contactData = await contactResponse.json();

    if (!contactResponse.ok) {
      throw new Error(contactData.message || 'Failed to add contact');
    }

    // Then, send the welcome email
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'notification@updates.codehanif.com',
        to: email,
        subject: 'Maintenance Notification Subscription',
        html: createEmailTemplate(email),
      }),
    });

    const emailData = await emailResponse.json();

    if (!emailResponse.ok) {
      throw new Error(emailData.message || 'Failed to send email');
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Contact added and email sent successfully',
        contactData,
        emailData,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Subscription error:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to process subscription',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
