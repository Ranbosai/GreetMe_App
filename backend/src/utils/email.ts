import dotenv from 'dotenv';

dotenv.config();

export const sendVerificationEmail = (to: string, token: string) => {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const verificationLink = `${frontendUrl}/verify?token=${token}&email=${encodeURIComponent(to)}`;
  
  // For development - log the verification email
  console.log('\n=== EMAIL VERIFICATION ===');
  console.log(`To: ${to}`);
  console.log(`Subject: Verify your GreetMe account`);
  console.log(`Verification Link: ${verificationLink}`);
  console.log('===========================\n');
  
  // In production, this would integrate with an email service like:
  // - Resend
  // - SendGrid
  // - Mailgun
  // - AWS SES
  
  // Example implementation with Resend (commented out for development):
  /*
  import { Resend } from 'resend';
  
  const resend = new Resend(process.env.RESEND_API_KEY);
  
  const sendEmail = async () => {
    try {
      const data = await resend.emails.send({
        from: 'GreetMe <noreply@greetme.com>',
        to: [to],
        subject: 'Verify your GreetMe account',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #2563eb;">Welcome to GreetMe!</h1>
            <p>Thank you for registering with GreetMe. Please click the link below to verify your email address:</p>
            <a href="${verificationLink}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 16px 0;">
              Verify Email Address
            </a>
            <p>If you didn't create an account with GreetMe, you can safely ignore this email.</p>
            <p>Best regards,<br>The GreetMe Team</p>
          </div>
        `,
      });
      console.log('Email sent successfully:', data);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };
  
  sendEmail();
  */
  
  return true;
};

export const sendWelcomeEmail = (to: string, name: string) => {
  console.log('\n=== WELCOME EMAIL ===');
  console.log(`To: ${to}`);
  console.log(`Subject: Welcome to GreetMe, ${name}!`);
  console.log(`Message: Welcome to GreetMe! Your account has been verified successfully.`);
  console.log('=====================\n');
  
  return true;
};
