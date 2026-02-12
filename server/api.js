// server/api.js - Express API server for server-side operations
// Handles actions that require server-side secrets (service role key, SMTP)

const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(express.json());

// Load env vars - in production, use dotenv or set them in your environment
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const createServerSupabase = () => {
    if (!supabaseServiceKey) {
        throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set');
    }
    return createClient(supabaseUrl, supabaseServiceKey, {
        auth: { autoRefreshToken: false, persistSession: false },
    });
};

// ─── Email helpers ───────────────────────────────────────────────────
const createTransporter = () => {
    const host = process.env.SMTP_HOST || 'smtp.gmail.com';
    const port = parseInt(process.env.SMTP_PORT || '587', 10);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASSWORD;

    return nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
    });
};

const getFromAddress = () => {
    const fromName = process.env.SMTP_FROM_NAME || 'HRSY System';
    const fromEmail = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER || 'noreply@hrsy.com';
    return `"${fromName}" <${fromEmail}>`;
};

const sendEmail = async ({ to, subject, text, html }) => {
    try {
        const transporter = createTransporter();
        const info = await transporter.sendMail({
            from: getFromAddress(),
            to,
            subject,
            text,
            html: html || text,
        });
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, error: error.message };
    }
};

const sendWelcomeEmail = async ({ email, firstName, lastName, companyName, companyCode, departments = [] }) => {
    const subject = `Welcome to HRSY - ${companyName} Registration Successful!`;
    const text = `Hello ${firstName} ${lastName}, Your company "${companyName}" has been registered. Company Code: ${companyCode}`;
    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Welcome to HRSY</title></head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to HRSY!</h1>
    <p style="color: rgba(255,255,255,0.9); margin-top: 10px;">Human Resource System</p>
  </div>
  <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #eee; border-top: none;">
    <h2 style="color: #333; margin-top: 0;">Hello ${firstName} ${lastName}! 👋</h2>
    <p>Your company <strong>"${companyName}"</strong> has been successfully registered.</p>
    <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #667eea;">
      <h3 style="margin-top: 0; color: #667eea;">Your Login Details</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 8px 0; color: #666;">Company Code:</td><td style="padding: 8px 0; font-weight: bold; color: #333; font-size: 18px;">${companyCode}</td></tr>
        <tr><td style="padding: 8px 0; color: #666;">Email:</td><td style="padding: 8px 0; font-weight: bold; color: #333;">${email}</td></tr>
      </table>
    </div>
    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
    <p style="color: #888; font-size: 14px; text-align: center;">Best regards,<br><strong>The HRSY Team</strong></p>
  </div>
</body>
</html>`;
    return sendEmail({ to: email, subject, text, html });
};

// ─── Helper functions ────────────────────────────────────────────────
const generateCompanyCode = (name) => {
    const prefix = name.split(' ').map(w => w.charAt(0).toUpperCase()).join('').substring(0, 4) || 'COMP';
    const random = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}-${random}`;
};

const calculateDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24)) + 1;
};

const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
};

// ─── API: Register Company ───────────────────────────────────────────
app.post('/api/register-company', async (req, res) => {
    const { companyName, firstName, lastName, position, email, password } = req.body;

    if (!companyName || !firstName || !lastName || !position || !email || !password) {
        return res.json({ success: false, error: 'All fields are required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.json({ success: false, error: 'Please enter a valid email address' });
    }

    if (password.length < 6) {
        return res.json({ success: false, error: 'Password must be at least 6 characters long' });
    }

    try {
        const supabase = createServerSupabase();
        const companyCode = generateCompanyCode(companyName);

        // Check if email already exists
        const { data: existingCompany } = await supabase
            .from('companies').select('id').eq('login_email', email).single();

        if (existingCompany) {
            return res.json({ success: false, error: 'An account with this email already exists' });
        }

        // Create company
        const { data: company, error: companyError } = await supabase
            .from('companies')
            .insert({ company_code: companyCode, name: companyName, email, login_email: email, is_active: true })
            .select().single();

        if (companyError) {
            return res.json({ success: false, error: `Failed to create company: ${companyError.message}` });
        }

        // Create auth user
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email, password, email_confirm: true,
            user_metadata: { first_name: firstName, last_name: lastName, position, role: 'company_admin', company_id: company.id },
        });

        if (authError) {
            // Fallback to regular signUp
            const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
                email, password,
                options: { data: { first_name: firstName, last_name: lastName, position, role: 'company_admin', company_id: company.id } },
            });

            if (signUpError) {
                await supabase.from('companies').delete().eq('id', company.id);
                return res.json({ success: false, error: `Registration failed: ${signUpError.message}` });
            }

            if (!signUpData.user) {
                await supabase.from('companies').delete().eq('id', company.id);
                return res.json({ success: false, error: 'Failed to create user account' });
            }

            await supabase.from('user_profiles').upsert({
                id: signUpData.user.id, email, company_id: company.id,
                first_name: firstName, last_name: lastName, role: 'company_admin', is_active: true,
            }, { onConflict: 'id' });
        } else {
            if (!authData.user) {
                await supabase.from('companies').delete().eq('id', company.id);
                return res.json({ success: false, error: 'Failed to create user account' });
            }

            await supabase.from('user_profiles').upsert({
                id: authData.user.id, email, company_id: company.id,
                first_name: firstName, last_name: lastName, role: 'company_admin', is_active: true,
            }, { onConflict: 'id' });
        }

        // Send welcome email
        const emailResult = await sendWelcomeEmail({ email, firstName, lastName, companyName, companyCode });

        res.json({
            success: true,
            data: { companyCode, companyName, email, emailSent: emailResult.success },
        });
    } catch (error) {
        console.error('Registration exception:', error);
        res.json({ success: false, error: error.message || 'An unexpected error occurred' });
    }
});

// ─── API: Submit Sick Note ───────────────────────────────────────────
app.post('/api/submit-sick-note', async (req, res) => {
    const { employeeId, startDate, endDate, reason } = req.body;

    if (!employeeId || !startDate || !endDate || !reason) {
        return res.json({ success: false, error: 'All fields are required' });
    }

    if (new Date(endDate) < new Date(startDate)) {
        return res.json({ success: false, error: 'End date must be after or equal to start date' });
    }

    try {
        const supabase = createServerSupabase();
        const searchEmployeeId = employeeId.trim().toUpperCase();

        const { data: employees, error: employeeError } = await supabase
            .from('employees').select('id, employee_id, name, email, company_id')
            .ilike('employee_id', searchEmployeeId);

        if (employeeError) {
            return res.json({ success: false, error: 'Error looking up employee.' });
        }

        if (!employees || employees.length === 0) {
            return res.json({ success: false, error: 'Employee ID not found.' });
        }

        const employee = employees[0];
        const days = calculateDays(startDate, endDate);
        const status = days <= 3 ? 'approved' : 'pending';

        const { data: sickNote, error: insertError } = await supabase
            .from('sick_notes')
            .insert({ employee_id: employee.id, company_id: employee.company_id, start_date: startDate, end_date: endDate, reason: reason.trim(), status })
            .select().single();

        if (insertError) {
            return res.json({ success: false, error: 'Failed to submit sick note.' });
        }

        // Send email if employee has email
        let emailSent = false;
        if (employee.email) {
            try {
                const isApproved = status === 'approved';
                const statusText = isApproved ? 'Approved' : 'Pending Review';
                const statusColor = isApproved ? '#28a745' : '#ffc107';
                const subject = `Sick Note ${statusText} - ${formatDate(startDate)} to ${formatDate(endDate)}`;
                const text = `Hello ${employee.name || employee.employee_id}, Your sick note has been submitted and ${isApproved ? 'automatically approved' : 'is pending review'}.`;
                const html = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0;">Sick Note ${statusText}</h1>
  </div>
  <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #eee; border-top: none;">
    <h2 style="color: #333; margin-top: 0;">Hello ${employee.name || employee.employee_id}! 👋</h2>
    <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid ${statusColor};">
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 8px 0; color: #666;">Start Date:</td><td style="padding: 8px 0; font-weight: bold;">${formatDate(startDate)}</td></tr>
        <tr><td style="padding: 8px 0; color: #666;">End Date:</td><td style="padding: 8px 0; font-weight: bold;">${formatDate(endDate)}</td></tr>
        <tr><td style="padding: 8px 0; color: #666;">Duration:</td><td style="padding: 8px 0; font-weight: bold;">${days} day${days > 1 ? 's' : ''}</td></tr>
        <tr><td style="padding: 8px 0; color: #666;">Status:</td><td style="padding: 8px 0; font-weight: bold; color: ${statusColor};">${statusText}</td></tr>
      </table>
    </div>
  </div>
</div>`;
                const emailResult = await sendEmail({ to: employee.email, subject, text, html });
                emailSent = emailResult.success;
            } catch (e) { /* non-fatal */ }
        }

        // Create notification
        try {
            await supabase.from('notifications').insert({
                company_id: employee.company_id,
                type: 'sick_note',
                title: status === 'approved' ? 'Sick Note Auto-Approved' : 'New Sick Note Submitted',
                message: `${employee.name || employee.employee_id} submitted a sick note for ${days} day${days > 1 ? 's' : ''}`,
                link: '/sick-notes/all-sick-notes/',
                is_read: false,
            });
        } catch (e) { /* non-fatal */ }

        res.json({
            success: true,
            data: { employeeName: employee.name || employee.employee_id, startDate, endDate, days, status, isAutoApproved: status === 'approved', emailSent },
        });
    } catch (error) {
        console.error('Submit sick note exception:', error);
        res.json({ success: false, error: 'An unexpected error occurred.' });
    }
});

// ─── Start server ────────────────────────────────────────────────────
const PORT = process.env.API_PORT || 3001;
app.listen(PORT, () => {
    console.log(`> API server running on http://localhost:${PORT}`);
});
