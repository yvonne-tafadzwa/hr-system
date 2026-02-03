import { supabase } from './supabase';

// =====================================================
// AUTH SERVICES
// =====================================================

export const authService = {
  // Sign up with email and password
  signUp: async (email, password, metadata) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });
    return { data, error };
  },

  // Sign in with email and password (basic - without company check)
  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  // Sign in with company ID validation
  signInWithCompany: async (email, password, companyCode) => {
    // First, sign in with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      return { data: null, error: authError };
    }

    if (!authData.user) {
      return { data: null, error: new Error('Authentication failed') };
    }

    // Check if user belongs to the specified company
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*, companies(id, name, company_code)')
      .eq('id', authData.user.id)
      .single();

    if (profileError) {
      // Sign out if we can't verify company membership
      await supabase.auth.signOut();
      return { data: null, error: new Error('Could not verify company membership') };
    }

    // Super admins can login with any company code or without one
    if (profile.role === 'super_admin') {
      // Store role in user metadata for reliable access
      await supabase.auth.updateUser({
        data: { role: 'super_admin' }
      });
      return { data: authData, error: null };
    }

    // Check if company code matches
    if (!profile.companies) {
      await supabase.auth.signOut();
      return { data: null, error: new Error('User is not assigned to any company') };
    }

    // Verify company code matches (check against company_code field or company ID)
    const userCompanyCode = profile.companies.company_code || profile.company_id;
    if (userCompanyCode?.toUpperCase() !== companyCode.toUpperCase() &&
      profile.company_id !== companyCode) {
      await supabase.auth.signOut();
      return { data: null, error: new Error('Invalid company ID for this account') };
    }

    // Store company_id in user metadata for reliable access
    await supabase.auth.updateUser({
      data: { company_id: profile.company_id, role: profile.role || 'company_admin' }
    });

    return { data: authData, error: null };
  },

  // Sign in with Company ID and Password only (no email required)
  signInWithCompanyOnly: async (companyCode, password) => {
    try {
      console.log('Attempting login with company code:', companyCode);

      // Handle ADMIN company code specially - authenticate directly with admin email
      if (companyCode.toUpperCase() === 'ADMIN') {
        console.log('ADMIN company code detected, attempting direct authentication...');

        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: 'admin@hrsy.system',
          password: password,
        });

        console.log('Admin auth result:', {
          success: !!authData,
          error: authError,
          userEmail: authData?.user?.email
        });

        if (authError) {
          console.error('Admin auth error:', authError);
          return { data: null, error: new Error(`Login failed: ${authError.message}`) };
        }

        if (!authData || !authData.user) {
          return { data: null, error: new Error('Authentication failed. Please check your credentials.') };
        }

        // Store super_admin role in user metadata (non-blocking)
        supabase.auth.updateUser({
          data: { role: 'super_admin' }
        }).catch(err => console.warn('Could not update user metadata:', err));

        return { data: authData, error: null };
      }

      // For regular companies, find the company first
      const { data: company, error: companyError } = await supabase
        .from('companies')
        .select('id, company_code, name, login_email')
        .eq('company_code', companyCode.toUpperCase())
        .limit(1)
        .single();

      console.log('Company lookup result:', { company, companyError });

      if (companyError) {
        if (companyError.code === 'PGRST116') {
          return { data: null, error: new Error('Invalid Company ID - company not found') };
        }
        console.error('Company lookup error:', companyError);
        return { data: null, error: new Error(`Database error: ${companyError.message}`) };
      }

      if (!company) {
        return { data: null, error: new Error('Invalid Company ID - company not found') };
      }

      // Find users with matching company_id
      console.log('Looking up user profiles for company_id:', company.id);

      const { data: companyProfiles, error: companyProfileError } = await supabase
        .from('user_profiles')
        .select('id, email, role, company_id, is_active')
        .eq('company_id', company.id)
        .eq('is_active', true)
        .in('role', ['company_admin', 'employee'])
        .limit(1);

      console.log('User profiles lookup result:', { companyProfiles, companyProfileError });

      let loginEmail = null;

      // Try to get email from user profiles first
      if (!companyProfileError && companyProfiles && companyProfiles.length > 0) {
        const selectedProfile = companyProfiles.find(p => p.role === 'company_admin') || companyProfiles[0];
        if (selectedProfile && selectedProfile.email) {
          loginEmail = selectedProfile.email;
          console.log('Using email from user_profiles:', loginEmail);
        }
      }

      // Fallback: Use the company's login_email if no user profiles found
      if (!loginEmail && company.login_email) {
        loginEmail = company.login_email;
        console.log('Using fallback login_email from company:', loginEmail);
      }

      if (!loginEmail) {
        return { data: null, error: new Error('No login email found for this company. Please contact support.') };
      }

      console.log('Attempting auth with email:', loginEmail);

      // Sign in with the email and provided password
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: password,
      });

      console.log('Auth result:', { authData: authData?.user?.email, authError });

      if (authError) {
        console.error('Auth error:', authError);
        return { data: null, error: new Error(`Login failed: ${authError.message}`) };
      }

      // After successful login, ensure user profile has company_id linked (non-blocking)
      if (authData && authData.user) {
        // Update profile in background
        supabase
          .from('user_profiles')
          .select('id, company_id')
          .eq('id', authData.user.id)
          .single()
          .then(({ data: existingProfile }) => {
            if (existingProfile && !existingProfile.company_id) {
              console.log('Updating user profile with company_id:', company.id);
              supabase
                .from('user_profiles')
                .update({ company_id: company.id })
                .eq('id', authData.user.id);
            }
          })
          .catch(err => console.warn('Could not update user profile:', err));

        // Store company_id in user metadata (non-blocking)
        supabase.auth.updateUser({
          data: { company_id: company.id, role: 'company_admin' }
        }).catch(err => console.warn('Could not update user metadata:', err));
      }

      return { data: authData, error: null };
    } catch (err) {
      console.error('SignIn exception:', err);
      if (err.name === 'AbortError') {
        return { data: null, error: new Error('Request timed out. Please try again.') };
      }
      return { data: null, error: new Error(err.message || 'An error occurred during sign in') };
    }
  },

  // Register a new company with admin account
  registerCompany: async (companyData, password) => {
    console.log('Starting company registration:', companyData.company_name);

    const generateCompanyCode = (name) => {
      const prefix = name
        .split(' ')
        .map(word => word.charAt(0).toUpperCase())
        .join('')
        .substring(0, 4) || 'COMP';
      const random = Math.floor(1000 + Math.random() * 9000);
      return `${prefix}-${random}`;
    };

    const companyCode = generateCompanyCode(companyData.company_name);
    console.log('Generated company code:', companyCode);

    try {
      // Step 1: Create the company record FIRST (before auth user)
      console.log('Creating company record...');
      const { data: company, error: companyError } = await supabase
        .from('companies')
        .insert({
          company_code: companyCode,
          name: companyData.company_name,
          email: companyData.email,
          login_email: companyData.email,
          is_active: true,
        })
        .select()
        .single();

      console.log('Company creation result:', { company, companyError });

      if (companyError) {
        console.error('Company creation error:', companyError);
        return { data: null, error: new Error(`Failed to create company: ${companyError.message}`) };
      }

      // Step 2: Create the auth user (trigger will create user_profiles)
      console.log('Creating auth user...');
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: companyData.email,
        password: password,
        options: {
          data: {
            first_name: companyData.first_name,
            last_name: companyData.last_name,
            position: companyData.position,
            role: 'company_admin',
            company_id: company.id,
          },
          emailRedirectTo: typeof window !== 'undefined' ? window.location.origin + '/signin' : undefined,
        },
      });

      console.log('Auth signup result:', { user: authData?.user?.id, session: !!authData?.session, error: authError });

      if (authError) {
        console.error('Auth error:', authError);
        await supabase.from('companies').delete().eq('id', company.id);
        return { data: null, error: new Error(`Registration failed: ${authError.message}`) };
      }

      if (!authData.user) {
        await supabase.from('companies').delete().eq('id', company.id);
        return { data: null, error: new Error('Failed to create user account') };
      }

      // Step 3: Update/create the user profile with company assignment
      console.log('Updating user profile with company ID...');
      const { error: profileError } = await supabase
        .from('user_profiles')
        .upsert({
          id: authData.user.id,
          email: companyData.email,
          company_id: company.id,
          first_name: companyData.first_name,
          last_name: companyData.last_name,
          position: companyData.position,
          role: 'company_admin',
          is_active: true,
        }, { onConflict: 'id' });

      if (profileError) {
        console.error('Profile update error:', profileError);
      }

      console.log('Registration successful!');
      return {
        data: {
          user: authData.user,
          company_code: companyCode,
          company_name: companyData.company_name,
        },
        error: null
      };
    } catch (err) {
      console.error('Registration exception:', err);
      return { data: null, error: new Error(err.message || 'An unexpected error occurred during registration') };
    }
  },

  // Sign up with company code validation (for employees joining existing company)
  signUpWithCompany: async (email, password, metadata) => {
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .select('id, company_code, name')
      .eq('company_code', metadata.company_code.toUpperCase())
      .eq('is_active', true)
      .single();

    if (companyError || !company) {
      return { data: null, error: new Error('Invalid Company ID. Please check with your administrator.') };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: metadata.first_name,
          last_name: metadata.last_name,
          company_id: company.id,
          role: 'employee',
        },
      },
    });

    if (error) {
      return { data: null, error };
    }

    if (data.user) {
      await supabase
        .from('user_profiles')
        .update({
          company_id: company.id,
          first_name: metadata.first_name,
          last_name: metadata.last_name,
          role: 'employee',
        })
        .eq('id', data.user.id);
    }

    return { data, error: null };
  },

  // Sign out
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // Get current user
  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  },

  // Get current session
  getSession: async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    return { session, error };
  },

  // Reset password
  resetPassword: async (email) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email);
    return { data, error };
  },

  // Update password
  updatePassword: async (newPassword) => {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    return { data, error };
  },

  // Listen to auth changes
  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange(callback);
  },
};

// =====================================================
// USER PROFILE SERVICES
// =====================================================

export const userProfileService = {
  // Get current user's profile
  getCurrentProfile: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null, error: new Error('Not authenticated') };

    const { data, error } = await supabase
      .from('user_profiles')
      .select('*, companies(id, name)')
      .eq('id', user.id)
      .single();
    return { data, error };
  },

  // Get profile by ID
  getById: async (id) => {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*, companies(id, name)')
      .eq('id', id)
      .single();
    return { data, error };
  },

  // Update current user's profile
  updateProfile: async (updates) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null, error: new Error('Not authenticated') };

    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();
    return { data, error };
  },

  // Update user role (admin only)
  updateUserRole: async (userId, role, companyId) => {
    const { data, error } = await supabase
      .from('user_profiles')
      .update({ role, company_id: companyId })
      .eq('id', userId)
      .select()
      .single();
    return { data, error };
  },

  // Get all users (super admin) or company users (company admin)
  getAll: async () => {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*, companies(id, name)')
      .order('created_at', { ascending: false });
    return { data, error };
  },
};

// =====================================================
// COMPANIES SERVICES
// =====================================================

export const companiesService = {
  // Get all companies with employee and sick note counts from database
  getAll: async () => {
    const { data: companies, error: companiesError } = await supabase
      .from('companies')
      .select('*')
      .order('name', { ascending: true });

    if (companiesError || !companies) {
      return { data: null, error: companiesError };
    }

    const companiesWithCounts = await Promise.all(
      companies.map(async (company) => {
        const { count: employeeCount } = await supabase
          .from('employees')
          .select('*', { count: 'exact', head: true })
          .eq('company_id', company.id);

        const { count: sickNoteCount } = await supabase
          .from('sick_notes')
          .select('*', { count: 'exact', head: true })
          .eq('company_id', company.id);

        return {
          ...company,
          employee_count: employeeCount || 0,
          sick_note_count: sickNoteCount || 0,
        };
      })
    );

    return { data: companiesWithCounts, error: null };
  },

  // Get company by ID
  getById: async (id) => {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('id', id)
      .single();
    return { data, error };
  },

  // Create company (super admin only)
  create: async (company) => {
    const { data, error } = await supabase
      .from('companies')
      .insert(company)
      .select()
      .single();
    return { data, error };
  },

  // Update company
  update: async (id, updates) => {
    const { data, error } = await supabase
      .from('companies')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  // Delete company (super admin only)
  delete: async (id) => {
    const { error } = await supabase
      .from('companies')
      .delete()
      .eq('id', id);
    return { error };
  },

  // Get company statistics
  getStatistics: async (companyId) => {
    const { data, error } = await supabase
      .from('company_statistics')
      .select('*')
      .eq('company_id', companyId)
      .single();
    return { data, error };
  },
};

// =====================================================
// EMPLOYEES SERVICES
// =====================================================

export const employeesService = {
  // Get all employees (filtered by RLS based on user role)
  getAll: async () => {
    const { data, error } = await supabase
      .from('employees_detailed')
      .select('*')
      .order('created_at', { ascending: false });
    return { data, error };
  },

  // Get all employees with company and user details
  getAllWithDetails: async () => {
    const { data, error } = await supabase
      .from('employees')
      .select(`
        *,
        user_profiles(first_name, last_name, email),
        companies(name)
      `)
      .order('created_at', { ascending: false });

    const transformedData = data?.map(employee => ({
      ...employee,
      employee_name: employee.user_profiles
        ? `${employee.user_profiles.first_name} ${employee.user_profiles.last_name}`.trim()
        : employee.employee_id,
      company_name: employee.companies?.name || 'Unknown',
      email: employee.user_profiles?.email || null,
    }));

    return { data: transformedData, error };
  },

  // Get employees by company
  getByCompany: async (companyId) => {
    const { data, error } = await supabase
      .from('employees')
      .select('*, user_profiles(first_name, last_name, email, phone)')
      .eq('company_id', companyId)
      .eq('is_active', true)
      .order('employee_id', { ascending: true });
    return { data, error };
  },

  // Get employee by ID
  getById: async (id) => {
    const { data, error } = await supabase
      .from('employees')
      .select('*, user_profiles(first_name, last_name, email, phone), companies(name)')
      .eq('id', id)
      .single();
    return { data, error };
  },

  // Create employee
  create: async (employee) => {
    const { data, error } = await supabase
      .from('employees')
      .insert(employee)
      .select()
      .single();
    return { data, error };
  },

  // Update employee
  update: async (id, updates) => {
    const { data, error } = await supabase
      .from('employees')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  // Delete employee (soft delete by setting is_active = false)
  delete: async (id) => {
    const { error } = await supabase
      .from('employees')
      .update({ is_active: false })
      .eq('id', id);
    return { error };
  },

  // Hard delete employee
  hardDelete: async (id) => {
    const { error } = await supabase
      .from('employees')
      .delete()
      .eq('id', id);
    return { error };
  },

  // Get employee count by company
  getCount: async (companyId) => {
    let query = supabase
      .from('employees')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);

    if (companyId) {
      query = query.eq('company_id', companyId);
    }

    const { count, error } = await query;
    return { count, error };
  },
};

// =====================================================
// SICK NOTES SERVICES
// =====================================================

export const sickNotesService = {
  // Get all sick notes with employee and company details
  getAll: async () => {
    const { data, error } = await supabase
      .from('sick_notes')
      .select(`
        *,
        employees!inner(
          employee_id,
          user_id,
          user_profiles(first_name, last_name)
        ),
        companies!inner(name)
      `)
      .order('created_at', { ascending: false });

    const transformedData = data?.map(note => ({
      ...note,
      employee_name: note.employees?.user_profiles
        ? `${note.employees.user_profiles.first_name} ${note.employees.user_profiles.last_name}`.trim()
        : note.employees?.employee_id || 'Unknown',
      company_name: note.companies?.name || 'Unknown',
    }));

    return { data: transformedData, error };
  },

  // Get recent sick notes
  getRecent: async (limit = 10) => {
    const { data, error } = await supabase
      .from('sick_notes')
      .select(`
        *,
        employees(
          employee_id,
          user_profiles(first_name, last_name)
        ),
        companies(name)
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    const transformedData = data?.map(note => ({
      ...note,
      employee_name: note.employees?.user_profiles
        ? `${note.employees.user_profiles.first_name} ${note.employees.user_profiles.last_name}`.trim()
        : note.employees?.employee_id || 'Unknown',
      employee_id: note.employees?.employee_id,
      company_name: note.companies?.name || 'Unknown',
    }));

    return { data: transformedData, error };
  },

  // Get sick notes by company
  getByCompany: async (companyId) => {
    const { data, error } = await supabase
      .from('sick_notes')
      .select('*, employees(employee_id, user_profiles(first_name, last_name))')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  // Get sick notes by employee
  getByEmployee: async (employeeId) => {
    const { data, error } = await supabase
      .from('sick_notes')
      .select('*')
      .eq('employee_id', employeeId)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  // Get sick note by ID
  getById: async (id) => {
    const { data, error } = await supabase
      .from('sick_notes_detailed')
      .select('*')
      .eq('id', id)
      .single();
    return { data, error };
  },

  // Create sick note
  create: async (sickNote) => {
    const { data, error } = await supabase
      .from('sick_notes')
      .insert(sickNote)
      .select()
      .single();
    return { data, error };
  },

  // Update sick note
  update: async (id, updates) => {
    const { data, error } = await supabase
      .from('sick_notes')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  // Approve sick note
  approve: async (id, reviewNotes) => {
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from('sick_notes')
      .update({
        status: 'approved',
        reviewed_by: user?.id,
        reviewed_at: new Date().toISOString(),
        review_notes: reviewNotes,
      })
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  // Reject sick note
  reject: async (id, reviewNotes) => {
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from('sick_notes')
      .update({
        status: 'rejected',
        reviewed_by: user?.id,
        reviewed_at: new Date().toISOString(),
        review_notes: reviewNotes,
      })
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  // Delete sick note
  delete: async (id) => {
    const { error } = await supabase
      .from('sick_notes')
      .delete()
      .eq('id', id);
    return { error };
  },

  // Get sick note statistics
  getStatistics: async (companyId) => {
    let query = supabase.from('sick_notes').select('status');

    if (companyId) {
      query = query.eq('company_id', companyId);
    }

    const { data, error } = await query;

    if (error) return { data: null, error };

    const stats = {
      total: data?.length || 0,
      pending: data?.filter((note) => note.status === 'pending').length || 0,
      approved: data?.filter((note) => note.status === 'approved').length || 0,
      rejected: data?.filter((note) => note.status === 'rejected').length || 0,
    };

    return { data: stats, error: null };
  },

  // Get this month's sick notes
  getThisMonth: async (companyId) => {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    let query = supabase
      .from('sick_notes')
      .select('*')
      .gte('created_at', startOfMonth.toISOString());

    if (companyId) {
      query = query.eq('company_id', companyId);
    }

    const { data, error } = await query;
    return { data, error };
  },
};

// =====================================================
// AUDIT LOG SERVICES
// =====================================================

export const auditLogService = {
  // Get audit logs
  getAll: async (limit = 50) => {
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*, user_profiles(first_name, last_name, email)')
      .order('created_at', { ascending: false })
      .limit(limit);
    return { data, error };
  },

  // Get audit logs by company
  getByCompany: async (companyId, limit = 50) => {
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*, user_profiles(first_name, last_name, email)')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false })
      .limit(limit);
    return { data, error };
  },

  // Create audit log entry
  create: async (log) => {
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from('audit_logs')
      .insert({
        ...log,
        user_id: user?.id,
      })
      .select()
      .single();
    return { data, error };
  },
};

// =====================================================
// DASHBOARD SERVICES
// =====================================================

export const dashboardService = {
  // Get dashboard statistics for current user's company
  getStats: async () => {
    const profile = await userProfileService.getCurrentProfile();

    if (!profile.data) {
      return { data: null, error: new Error('Could not get user profile') };
    }

    const companyId = profile.data.company_id;

    // For super admin, get all stats
    if (profile.data.role === 'super_admin') {
      const [companies, employees, sickNotes] = await Promise.all([
        supabase.from('companies').select('*', { count: 'exact', head: true }),
        supabase.from('employees').select('*', { count: 'exact', head: true }).eq('is_active', true),
        sickNotesService.getStatistics(),
      ]);

      return {
        data: {
          totalCompanies: companies.count || 0,
          totalEmployees: employees.count || 0,
          ...sickNotes.data,
        },
        error: null,
      };
    }

    // For company users, get company-specific stats
    const [employees, sickNotes] = await Promise.all([
      employeesService.getCount(companyId),
      sickNotesService.getStatistics(companyId),
    ]);

    return {
      data: {
        totalEmployees: employees.count || 0,
        ...sickNotes.data,
      },
      error: null,
    };
  },
};