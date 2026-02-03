'use server';

import { createClient } from '@supabase/supabase-js';
import { sendEmail } from '@/lib/email';

// Create a server-side Supabase client with SERVICE ROLE KEY (bypasses RLS)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const createServerSupabase = () => {
  if (!supabaseServiceKey) {
    console.error('SUPABASE_SERVICE_ROLE_KEY is not set! Public sick note submission will fail.');
    throw new Error('Server configuration error. Please contact support.');
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};

/**
 * Calculate the number of days between two dates (inclusive)
 */
const calculateDays = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return diffDays;
};

/**
 * Format date for display
 */
const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Send sick note confirmation email to employee
 */
const sendSickNoteEmail = async ({ employeeEmail, employeeName, startDate, endDate, reason, status, days }) => {
  const isApproved = status === 'approved';
  const statusText = isApproved ? 'Approved' : 'Pending Review';
  const statusColor = isApproved ? '#28a745' : '#ffc107';

  const subject = `Sick Note ${statusText} - ${formatDate(startDate)} to ${formatDate(endDate)}`;

  const text = `
Hello ${employeeName},

Your sick note has been submitted and ${isApproved ? 'automatically approved' : 'is pending review'}.

Details:
- Start Date: ${formatDate(startDate)}
- End Date: ${formatDate(endDate)}
- Duration: ${days} day${days > 1 ? 's' : ''}
- Reason: ${reason}
- Status: ${statusText}

${isApproved
      ? 'Since this is a short-term sick note (3 days or less), it has been automatically approved.'
      : 'Your sick note is currently pending review. You will receive another notification once it has been reviewed.'}

If you have any questions, please contact your HR department.

Best regards,
The HRSY Team
`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sick Note ${statusText}</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 24px;">Sick Note ${statusText}</h1>
  </div>
  
  <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #eee; border-top: none;">
    <h2 style="color: #333; margin-top: 0;">Hello ${employeeName}! 👋</h2>
    
    <p>Your sick note has been submitted ${isApproved ? 'and <strong style="color: #28a745;">automatically approved</strong>' : 'and is <strong style="color: #ffc107;">pending review</strong>'}.</p>
    
    <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid ${statusColor};">
      <h3 style="margin-top: 0; color: #667eea;">Sick Note Details</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; color: #666;">Start Date:</td>
          <td style="padding: 8px 0; font-weight: bold; color: #333;">${formatDate(startDate)}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666;">End Date:</td>
          <td style="padding: 8px 0; font-weight: bold; color: #333;">${formatDate(endDate)}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666;">Duration:</td>
          <td style="padding: 8px 0; font-weight: bold; color: #333;">${days} day${days > 1 ? 's' : ''}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666;">Reason:</td>
          <td style="padding: 8px 0; color: #333;">${reason}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666;">Status:</td>
          <td style="padding: 8px 0; font-weight: bold; color: ${statusColor};">${statusText}</td>
        </tr>
      </table>
    </div>
    
    ${isApproved
      ? '<div style="background: #d4edda; border-radius: 8px; padding: 15px; margin: 15px 0; border-left: 4px solid #28a745;"><p style="margin: 0; color: #155724;"><strong>✓ Auto-Approved:</strong> Since this is a short-term sick note (3 days or less), it has been automatically approved.</p></div>'
      : '<div style="background: #fff3cd; border-radius: 8px; padding: 15px; margin: 15px 0; border-left: 4px solid #ffc107;"><p style="margin: 0; color: #856404;"><strong>⏳ Pending:</strong> Your sick note is currently pending review. You will receive another notification once it has been reviewed.</p></div>'}
    
    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
    
    <p style="color: #888; font-size: 14px; text-align: center;">
      If you have any questions, please contact your HR department.
    </p>
    
    <p style="color: #888; font-size: 14px; text-align: center;">
      Best regards,<br>
      <strong>The HRSY Team</strong>
    </p>
  </div>
  
  <div style="text-align: center; padding: 20px; color: #888; font-size: 12px;">
    <p>© ${new Date().getFullYear()} HRSY. All rights reserved.</p>
  </div>
</body>
</html>
`;

  return sendEmail({ to: employeeEmail, subject, text, html });
};

/**
 * Server action to submit a sick note from public form (no login required)
 * Uses service role key to bypass RLS
 */
export async function submitSickNoteAction(formData) {
  const { employeeId, startDate, endDate, reason } = formData;

  // Validate required fields
  if (!employeeId || !startDate || !endDate || !reason) {
    return { success: false, error: 'All fields are required' };
  }

  // Validate dates
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (end < start) {
    return { success: false, error: 'End date must be after or equal to start date' };
  }

  try {
    const supabase = createServerSupabase();

    console.log('[submitSickNote] Submitting sick note for employee:', employeeId);

    // Step 1: Find the employee by employee_id (case-insensitive)
    const searchEmployeeId = employeeId.trim().toUpperCase();
    console.log('[submitSickNote] Looking up employee with ID:', searchEmployeeId);

    const { data: employees, error: employeeError } = await supabase
      .from('employees')
      .select('id, employee_id, name, email, company_id')
      .ilike('employee_id', searchEmployeeId);

    if (employeeError) {
      console.error('[submitSickNote] Employee lookup error:', employeeError);
      return { success: false, error: 'Error looking up employee. Please try again.' };
    }

    if (!employees || employees.length === 0) {
      console.log('[submitSickNote] No employee found with ID:', searchEmployeeId);
      return { success: false, error: 'Employee ID not found. Please check your Employee ID and try again.' };
    }

    const employee = employees[0];
    console.log('[submitSickNote] Found employee:', employee.name, employee.employee_id);

    // Calculate number of days
    const days = calculateDays(startDate, endDate);

    // Auto-approve if 3 days or less
    const status = days <= 3 ? 'approved' : 'pending';

    console.log(`[submitSickNote] Duration: ${days} days, Status: ${status}`);

    // Step 2: Create the sick note (service role bypasses RLS)
    const { data: sickNote, error: insertError } = await supabase
      .from('sick_notes')
      .insert({
        employee_id: employee.id,
        company_id: employee.company_id,
        start_date: startDate,
        end_date: endDate,
        reason: reason.trim(),
        status: status,
      })
      .select()
      .single();

    if (insertError) {
      console.error('[submitSickNote] Insert error:', insertError);
      return { success: false, error: 'Failed to submit sick note. Please try again.' };
    }

    console.log('[submitSickNote] Sick note created:', sickNote.id);

    // Step 3: Send confirmation email to employee (if they have email)
    let emailSent = false;
    if (employee.email) {
      console.log('[submitSickNote] Sending confirmation email to:', employee.email);
      try {
        const emailResult = await sendSickNoteEmail({
          employeeEmail: employee.email,
          employeeName: employee.name || employee.employee_id,
          startDate,
          endDate,
          reason: reason.trim(),
          status,
          days,
        });

        if (emailResult.success) {
          console.log('[submitSickNote] Email sent successfully');
          emailSent = true;
        } else {
          console.warn('[submitSickNote] Email failed:', emailResult.error);
        }
      } catch (emailErr) {
        console.warn('[submitSickNote] Email error:', emailErr);
      }
    }

    // Step 4: Create notification for company admins (optional, don't fail if it errors)
    try {
      const notificationTitle = status === 'approved'
        ? 'Sick Note Auto-Approved'
        : 'New Sick Note Submitted';

      const notificationMessage = `${employee.name || employee.employee_id} submitted a sick note for ${days} day${days > 1 ? 's' : ''} (${formatDate(startDate)} - ${formatDate(endDate)})`;

      await supabase
        .from('notifications')
        .insert({
          company_id: employee.company_id,
          type: 'sick_note',
          title: notificationTitle,
          message: notificationMessage,
          link: `/sick-notes/all-sick-notes/`,
          is_read: false,
        });

      console.log('[submitSickNote] Notification created');
    } catch (notifError) {
      console.warn('[submitSickNote] Notification error (non-fatal):', notifError);
    }

    return {
      success: true,
      data: {
        employeeName: employee.name || employee.employee_id,
        startDate,
        endDate,
        days,
        status,
        isAutoApproved: status === 'approved',
        emailSent,
      },
    };

  } catch (error) {
    console.error('[submitSickNote] Exception:', error);
    return { success: false, error: 'An unexpected error occurred. Please try again.' };
  }
}