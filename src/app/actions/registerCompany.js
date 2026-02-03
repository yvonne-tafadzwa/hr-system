'use server';

import { createClient } from '@supabase/supabase-js';
import { sendWelcomeEmail } from '@/lib/email';

// Create a server-side Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const createServerSupabase = () => {
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};

/**
 * Generate a unique company code from company name
 * @param {string} name - Company name
 * @returns {string} - Generated company code
 */
const generateCompanyCode = (name) => {
  const prefix = name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .substring(0, 4) || 'COMP';
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${random}`;
};

/**
 * Server action to register a new company with admin account
 * Creates company, user profile, and sends welcome email
 * 
 * @param {Object} formData - Registration form data
 * @param {string} formData.companyName - Name of the company
 * @param {string} formData.firstName - Admin's first name
 * @param {string} formData.lastName - Admin's last name
 * @param {string} formData.position - Admin's position/role in company
 * @param {string} formData.email - Admin's email address
 * @param {string} formData.password - Password for the account
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
 */
export async function registerCompanyAction(formData) {
  const { companyName, firstName, lastName, position, email, password } = formData;

  // Validate required fields
  if (!companyName || !firstName || !lastName || !position || !email || !password) {
    return { success: false, error: 'All fields are required' };
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { success: false, error: 'Please enter a valid email address' };
  }

  // Validate password length
  if (password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters long' };
  }

  const supabase = createServerSupabase();
  const companyCode = generateCompanyCode(companyName);
  const fullName = `${firstName} ${lastName}`.trim();

  console.log('Starting company registration:', { companyName, email, companyCode });

  try {
    // Step 1: Check if email already exists
    const { data: existingCompany } = await supabase
      .from('companies')
      .select('id')
      .eq('login_email', email)
      .single();

    if (existingCompany) {
      return { success: false, error: 'An account with this email already exists' };
    }

    // Step 2: Create the company record
    console.log('Creating company record...');
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .insert({
        company_code: companyCode,
        name: companyName,
        email: email,
        login_email: email,
        is_active: true,
      })
      .select()
      .single();

    if (companyError) {
      console.error('Company creation error:', companyError);
      return { success: false, error: `Failed to create company: ${companyError.message}` };
    }

    console.log('Company created:', company.id);

    // Step 3: Create the auth user
    console.log('Creating auth user...');
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true, // Auto-confirm email for immediate login
      user_metadata: {
        first_name: firstName,
        last_name: lastName,
        position: position,
        role: 'company_admin',
        company_id: company.id,
      },
    });

    // If admin.createUser fails (might not have service role key), try regular signUp
    if (authError) {
      console.log('Admin createUser failed, trying regular signUp...');
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            position: position,
            role: 'company_admin',
            company_id: company.id,
          },
        },
      });

      if (signUpError) {
        console.error('Auth error:', signUpError);
        // Cleanup: Delete the company record since auth failed
        await supabase.from('companies').delete().eq('id', company.id);
        return { success: false, error: `Registration failed: ${signUpError.message}` };
      }

      if (!signUpData.user) {
        // Cleanup: Delete the company record
        await supabase.from('companies').delete().eq('id', company.id);
        return { success: false, error: 'Failed to create user account' };
      }

      // Create/update user profile
      const { error: profileError } = await supabase
        .from('user_profiles')
        .upsert({
          id: signUpData.user.id,
          email: email,
          company_id: company.id,
          first_name: firstName,
          last_name: lastName,
          role: 'company_admin',
          is_active: true,
        }, { onConflict: 'id' });

      if (profileError) {
        console.error('Profile creation error:', profileError);
        // Don't fail - the user might still be able to log in
      }
    } else {
      // Admin createUser succeeded
      if (!authData.user) {
        // Cleanup: Delete the company record
        await supabase.from('companies').delete().eq('id', company.id);
        return { success: false, error: 'Failed to create user account' };
      }

      // Create/update user profile for admin-created user
      const { error: profileError } = await supabase
        .from('user_profiles')
        .upsert({
          id: authData.user.id,
          email: email,
          company_id: company.id,
          first_name: firstName,
          last_name: lastName,
          role: 'company_admin',
          is_active: true,
        }, { onConflict: 'id' });

      if (profileError) {
        console.error('Profile creation error:', profileError);
      }
    }

    console.log('User account created successfully');

    // Step 4: Send welcome email
    console.log('Sending welcome email...');
    const emailResult = await sendWelcomeEmail({
      email: email,
      firstName: firstName,
      lastName: lastName,
      companyName: companyName,
      companyCode: companyCode,
    });

    if (!emailResult.success) {
      console.warn('Welcome email failed to send:', emailResult.error);
      // Don't fail registration if email fails - log it but continue
    } else {
      console.log('Welcome email sent successfully');
    }

    console.log('Registration completed successfully!');

    return {
      success: true,
      data: {
        companyCode: companyCode,
        companyName: companyName,
        email: email,
        emailSent: emailResult.success,
      },
    };

  } catch (error) {
    console.error('Registration exception:', error);
    return { success: false, error: error.message || 'An unexpected error occurred during registration' };
  }
}
