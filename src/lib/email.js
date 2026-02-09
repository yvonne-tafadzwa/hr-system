import nodemailer from 'nodemailer';

// Email configuration - uses environment variables for SMTP settings
// Configure these in your .env.local file:
// SMTP_HOST=smtp.gmail.com (or your SMTP server)
// SMTP_PORT=587
// SMTP_USER=your-email@gmail.com
// SMTP_PASSWORD=your-app-password
// SMTP_FROM_NAME=HRSY System
// SMTP_FROM_EMAIL=noreply@hrsy.com

const createTransporter = () => {
  // Use environment variables for SMTP configuration
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;

  if (!user || !pass) {
    console.warn('⚠️ SMTP credentials not configured. Email sending will fail.');
    console.warn('Please set SMTP_USER and SMTP_PASSWORD in your .env.local file');
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for other ports
    auth: {
      user,
      pass,
    },
  });
};

// Get sender info from environment
const getFromAddress = () => {
  const fromName = process.env.SMTP_FROM_NAME || 'HRSY System';
  const fromEmail = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER || 'noreply@hrsy.com';
  return `"${fromName}" <${fromEmail}>`;
};

/**
 * Send an email using nodemailer
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Plain text body
 * @param {string} options.html - HTML body (optional)
 * @returns {Promise<{success: boolean, messageId?: string, error?: string}>}
 */
export const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: getFromAddress(),
      to,
      subject,
      text,
      html: html || text,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log('Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send a welcome email to a newly registered company
 * @param {Object} data - Registration data
 * @param {string} data.email - User's email address
 * @param {string} data.firstName - User's first name
 * @param {string} data.lastName - User's last name
 * @param {string} data.companyName - Company name
 * @param {string} data.companyCode - Generated company code
 * @param {string[]} data.departments - List of departments created (optional)
 * @returns {Promise<{success: boolean, messageId?: string, error?: string}>}
 */
export const sendWelcomeEmail = async ({ email, firstName, lastName, companyName, companyCode, departments = [] }) => {
  const subject = `Welcome to HRSY - ${companyName} Registration Successful!`;

  const departmentsList = departments && departments.length > 0
    ? `\n\nDepartments created:\n${departments.map(d => `- ${d}`).join('\n')}`
    : '';

  const text = `
Hello ${firstName} ${lastName},

Welcome to HRSY! Your company "${companyName}" has been successfully registered.

Here are your login details:
- Company Code: ${companyCode}
- Email: ${email}
- Password: (the password you chose during registration)
${departmentsList}

You can now log in to the HRSY system using your company code and password.

What you can do next:
1. Log in to your dashboard
2. Add your company departments
3. Add employees to your company
4. Start managing sick notes and employee records

If you have any questions or need assistance, please don't hesitate to contact our support team.

Best regards,
The HRSY Team
`;

  const departmentsHtml = departments && departments.length > 0
    ? `
      <div style="background: #e8f5e9; border-radius: 8px; padding: 15px; margin: 15px 0;">
        <h4 style="margin-top: 0; color: #2e7d32;">Departments Created</h4>
        <ul style="margin: 0; padding-left: 20px; color: #555;">
          ${departments.map(d => `<li style="margin-bottom: 5px;">${d}</li>`).join('')}
        </ul>
      </div>
    `
    : '';

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to HRSY</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to HRSY!</h1>
    <p style="color: rgba(255,255,255,0.9); margin-top: 10px;">Human Resource System</p>
  </div>
  
  <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #eee; border-top: none;">
    <h2 style="color: #333; margin-top: 0;">Hello ${firstName} ${lastName}! 👋</h2>
    
    <p>Your company <strong>"${companyName}"</strong> has been successfully registered in our system.</p>
    
    <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #667eea;">
      <h3 style="margin-top: 0; color: #667eea;">Your Login Details</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; color: #666;">Company Code:</td>
          <td style="padding: 8px 0; font-weight: bold; color: #333; font-size: 18px; letter-spacing: 1px;">${companyCode}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666;">Email:</td>
          <td style="padding: 8px 0; font-weight: bold; color: #333;">${email}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666;">Password:</td>
          <td style="padding: 8px 0; color: #666; font-style: italic;">(the password you chose during registration)</td>
        </tr>
      </table>
    </div>

    ${departmentsHtml}
    
    <h3 style="color: #333;">What you can do next:</h3>
    <ul style="color: #555; padding-left: 20px;">
      <li style="margin-bottom: 8px;">Log in to your dashboard</li>
      <li style="margin-bottom: 8px;">Add your company departments</li>
      <li style="margin-bottom: 8px;">Add employees to your company</li>
      <li style="margin-bottom: 8px;">Start managing sick notes and employee records</li>
    </ul>
    
    <div style="text-align: center; margin-top: 30px;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/sign-in/" 
         style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 12px 30px; border-radius: 25px; font-weight: bold;">
        Log In to Your Dashboard
      </a>
    </div>
    
    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
    
    <p style="color: #888; font-size: 14px; text-align: center;">
      If you have any questions or need assistance, please don't hesitate to contact our support team.
    </p>
    
    <p style="color: #888; font-size: 14px; text-align: center;">
      Best regards,<br>
      <strong>The HRSY Team</strong>
    </p>
  </div>
  
  <div style="text-align: center; padding: 20px; color: #888; font-size: 12px;">
    <p>© ${new Date().getFullYear()} HRSY. All rights reserved.</p>
    <p>This email was sent to ${email} because you registered an account with HRSY.</p>
  </div>
</body>
</html>
`;

  return sendEmail({ to: email, subject, text, html });
};

export default {
  sendEmail,
  sendWelcomeEmail,
};