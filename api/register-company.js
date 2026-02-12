// Vercel Serverless Function: Register Company
// POST /api/register-company

const { createClient } = require('@supabase/supabase-js');
const nodemailer = require('nodemailer');

const createServerSupabase = () => {
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseServiceKey) throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set');
    return createClient(supabaseUrl, supabaseServiceKey, {
        auth: { autoRefreshToken: false, persistSession: false },
    });
};

const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        secure: parseInt(process.env.SMTP_PORT || '587', 10) === 465,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
    });
};

const getFromAddress = () => {
    const fromName = process.env.SMTP_FROM_NAME || 'Verity App';
    const fromEmail = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER || 'noreply@verityapp.com';
    return `"${fromName}" <${fromEmail}>`;
};

const sendWelcomeEmail = async ({ email, firstName, lastName, companyName, companyCode }) => {
    try {
        const transporter = createTransporter();
        const subject = `Welcome to Verity App - ${companyName} Registration Successful!`;
        const text = `Hello ${firstName} ${lastName}, Your company "${companyName}" has been registered. Company Code: ${companyCode}`;
        const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Welcome to Verity App</title></head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Verity App!</h1>
    <p style="color: rgba(255,255,255,0.9); margin-top: 10px;">Employee Management System</p>
  </div>
  <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #eee; border-top: none;">
    <h2 style="color: #333; margin-top: 0;">Hello ${firstName} ${lastName}! 👋</h2>
    <p>Your company <strong>"${companyName}"</strong> has been successfully registered.</p>
    <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #667eea;">
      <h3 style="margin-top: 0; color: #667eea;">Your Login Details</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 8px 0; color: #666;">Company Code:</td><td style="padding: 8px 0; font-weight: bold; font-size: 18px;">${companyCode}</td></tr>
        <tr><td style="padding: 8px 0; color: #666;">Email:</td><td style="padding: 8px 0; font-weight: bold;">${email}</td></tr>
      </table>
    </div>
    <p style="color: #888; font-size: 14px; text-align: center;">Best regards,<br><strong>The Verity App Team</strong></p>
  </div>
</body></html>`;
        const info = await transporter.sendMail({ from: getFromAddress(), to: email, subject, text, html });
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Email error:', error);
        return { success: false, error: error.message };
    }
};

const generateCompanyCode = (name) => {
    const prefix = name.split(' ').map(w => w.charAt(0).toUpperCase()).join('').substring(0, 4) || 'COMP';
    const random = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}-${random}`;
};

module.exports = async function handler(req, res) {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    const { companyName, firstName, lastName, position, email, password, departments, maxSickDays } = req.body;

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
        const companyInsert = {
            company_code: companyCode,
            name: companyName,
            email,
            login_email: email,
            is_active: true,
        };
        if (maxSickDays) companyInsert.max_sick_days = parseInt(maxSickDays, 10);

        const { data: company, error: companyError } = await supabase
            .from('companies').insert(companyInsert).select().single();

        if (companyError) {
            return res.json({ success: false, error: `Failed to create company: ${companyError.message}` });
        }

        // Create departments if provided
        if (departments && departments.length > 0) {
            const deptInserts = departments.filter(d => d.trim()).map(d => ({
                company_id: company.id,
                name: d.trim(),
            }));
            if (deptInserts.length > 0) {
                await supabase.from('departments').insert(deptInserts);
            }
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
};
