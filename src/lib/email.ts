import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.RESEND_FROM_EMAIL ?? "Love & Skin <onboarding@resend.dev>";

const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function sendWelcomeEmail(to: string, firstName: string | null) {
  if (!resend) {
    console.warn("RESEND_API_KEY is not set — skipping welcome email.");
    return;
  }

  const greeting = firstName ? `Hi ${firstName},` : "Hi there,";

  await resend.emails.send({
    from: fromEmail,
    to,
    subject: "Welcome to Love & Skin",
    text: `${greeting}\n\nWelcome to Love & Skin! We're so glad you're here.\n\nYou can now save your skin quiz results, build out your AM/PM routine, and keep track of your favourite products from your account.\n\nSee you inside,\nThe Love & Skin team`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; color: #333;">
        <h1 style="font-size: 20px;">Welcome to Love &amp; Skin${firstName ? `, ${firstName}` : ""}!</h1>
        <p>We're so glad you're here.</p>
        <p>You can now save your skin quiz results, build out your AM/PM routine, and keep track of your favourite products from your account.</p>
        <p>See you inside,<br />The Love &amp; Skin team</p>
      </div>
    `,
  });
}
