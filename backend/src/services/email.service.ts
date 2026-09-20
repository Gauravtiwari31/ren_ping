import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
  port: parseInt(process.env.SMTP_PORT || '2525'),
  auth: {
    user: process.env.SMTP_USER || 'user',
    pass: process.env.SMTP_PASS || 'password',
  },
});

export const sendAlertEmail = async (to: string, serviceName: string, serviceUrl: string, message: string) => {
  try {
    const mailOptions = {
      from: '"Keep Alive Monitor" <alerts@keepalive.local>',
      to,
      subject: `🚨 Alert: ${serviceName} is DOWN`,
      html: `
        <h3>Service Downtime Alert</h3>
        <p><strong>Service:</strong> ${serviceName}</p>
        <p><strong>URL:</strong> <a href="${serviceUrl}">${serviceUrl}</a></p>
        <p><strong>Message:</strong> ${message}</p>
        <br/>
        <p>Please check your deployment immediately.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Alert email sent for ${serviceName}`);
  } catch (error) {
    console.error(`Failed to send alert email:`, error);
  }
};
