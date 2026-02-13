// Vercel Serverless Function: Submit Sick Note
// POST /api/submit-sick-note

const { createClient } = require('@supabase/supabase-js');
const nodemailer = require('nodemailer');

const createServerSupabase = () => {
    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl) throw new Error('SUPABASE_URL is not set. Set SUPABASE_URL in your environment variables.');
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

const sendEmail = async ({ to, subject, text, html }) => {
    try {
        const transporter = createTransporter();
        const info = await transporter.sendMail({
            from: getFromAddress(), to, subject, text, html: html || text,
        });
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Email error:', error);
        return { success: false, error: error.message };
    }
};

const calculateDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24)) + 1;
};

const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });
};

module.exports = async function handler(req, res) {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

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

        // Try exact match first, then try with/without dash
        // e.g., user enters EMP2314 -> also try EMP-2314, or vice versa
        let employees = null;
        let employeeError = null;

        // First try: exact ilike match
        const result1 = await supabase
            .from('employees').select('id, employee_id, name, email, company_id')
            .ilike('employee_id', searchEmployeeId);

        employees = result1.data;
        employeeError = result1.error;

        // If no results and the ID doesn't contain a dash, try inserting a dash
        // e.g., EMP2314 -> EMP-2314
        if (!employeeError && (!employees || employees.length === 0)) {
            const withDash = searchEmployeeId.replace(/^([A-Z]+)(\d+)$/, '$1-$2');
            if (withDash !== searchEmployeeId) {
                const result2 = await supabase
                    .from('employees').select('id, employee_id, name, email, company_id')
                    .ilike('employee_id', withDash);
                employees = result2.data;
                employeeError = result2.error;
            }
        }

        // If no results and the ID contains a dash, try removing it
        // e.g., EMP-2314 -> EMP2314
        if (!employeeError && (!employees || employees.length === 0) && searchEmployeeId.includes('-')) {
            const withoutDash = searchEmployeeId.replace(/-/g, '');
            const result3 = await supabase
                .from('employees').select('id, employee_id, name, email, company_id')
                .ilike('employee_id', withoutDash);
            employees = result3.data;
            employeeError = result3.error;
        }

        if (employeeError) {
            console.error('Employee lookup error:', employeeError);
            return res.json({ success: false, error: `Error looking up employee: ${employeeError.message}` });
        }

        if (!employees || employees.length === 0) {
            return res.json({ success: false, error: `Employee ID "${searchEmployeeId}" not found. Please check the ID and try again.` });
        }

        const employee = employees[0];
        const days = calculateDays(startDate, endDate);
        const status = days <= 3 ? 'approved' : 'pending';

        const { data: sickNote, error: insertError } = await supabase
            .from('sick_notes')
            .insert({
                employee_id: employee.id,
                company_id: employee.company_id,
                start_date: startDate,
                end_date: endDate,
                reason: reason.trim(),
                status,
            })
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
            data: {
                employeeName: employee.name || employee.employee_id,
                startDate, endDate, days, status,
                isAutoApproved: status === 'approved',
                emailSent,
            },
        });
    } catch (error) {
        console.error('Submit sick note exception:', error);
        res.json({ success: false, error: 'An unexpected error occurred.' });
    }
};
