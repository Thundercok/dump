import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || 'your-email@gmail.com',
    pass: process.env.SMTP_PASS || 'your-email-password',
  },
});

export const emailService = {
  async sendActivationEmail(email: string, activationToken: string) {
    const activationUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/activate/${activationToken}`;
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'no-reply@notion-clone.com',
      to: email,
      subject: 'Activate your account',
      html: `<p>Click <a href="${activationUrl}">here</a> to activate your account.</p>`
    });
  },

  async sendPasswordResetEmail(email: string, resetToken: string) {
    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;
    console.log(`[EMAIL] Sending password reset email to: ${email} with link: ${resetUrl}`);
    try {
      await transporter.sendMail({
        from: process.env.SMTP_FROM || 'no-reply@notion-clone.com',
        to: email,
        subject: 'Reset your password',
        html: `<p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`
      });
      console.log(`[EMAIL] Password reset email sent to: ${email}`);
    } catch (err) {
      console.error(`[EMAIL] Failed to send password reset email to: ${email}`, err);
      throw err;
    }
  }
};
