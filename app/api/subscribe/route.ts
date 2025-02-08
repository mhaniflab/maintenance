import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    const data = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Maintenance Notification Subscription',
      html: `
        <h1>Thank you for subscribing!</h1>
        <p>We'll notify you when our website is back online.</p>
      `
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: 'Failed to subscribe' }, { status: 500 });
  }
}