import nodemailer from 'nodemailer';

interface SendEmailOptions {
  email: string;
  subject: string;
  message: string;
  html?: string;
}

export const sendEmail = async (options: SendEmailOptions): Promise<void> => {
  const { email, subject, message, html } = options;

  const isEmailConfigured = process.env.SMTP_USER && process.env.SMTP_PASS;

  if (isEmailConfigured) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    try {
      await transporter.sendMail({
        from: `"People's Priorities" <${process.env.SMTP_USER}>`,
        to: email,
        subject: subject,
        text: message,
        html: html || undefined,
      });
      console.log(`✅ Email successfully sent to ${email}`);
    } catch (error) {
      console.error(`❌ Failed to send email to ${email}:`, error);
      throw error;
    }
  } else {
    // Fallback for development/testing if no env vars are set
    console.log("---------------------------------------------------------");
    console.log(`[EMAIL MOCK] To: ${email}`);
    console.log(`[EMAIL MOCK] Subject: ${subject}`);
    console.log(`[EMAIL MOCK] Message:\n${message}`);
    console.log("---------------------------------------------------------");
  }
};
