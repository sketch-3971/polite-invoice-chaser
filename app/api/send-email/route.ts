import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function POST(request: Request) {
  try {
    const { clientEmail, subject, message } = await request.json();

    if (!clientEmail || !message) {
      return NextResponse.json({ error: "Missing email details" }, { status: 400 });
    }

    const info = await transporter.sendMail({
      from: `"Polite Invoice Chaser" <${process.env.GMAIL_USER}>`,
      to: clientEmail,
      subject: subject,
      text: message,
      // Converts line breaks to HTML tags so it formats cleanly in their inbox
      html: `<p>${message.replace(/\n/g, '<br/>')}</p>`, 
    });

    return NextResponse.json({ success: true, messageId: info.messageId });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send email." },
      { status: 500 }
    );
  }
}