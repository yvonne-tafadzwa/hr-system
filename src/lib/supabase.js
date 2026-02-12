import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

// Validate environment variables in development
if (import.meta.env.DEV) {
  if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
    console.warn('⚠️ Missing Supabase environment variables!');
    console.warn('Please create a .env.local file with:');
    console.warn('  VITE_SUPABASE_URL=your_supabase_url');
    console.warn('  VITE_SUPABASE_ANON_KEY=your_supabase_anon_key');
  }
}

// Custom fetch that strips abort signals to prevent React 18 StrictMode
// double-mount from aborting in-flight Supabase requests.
// Without this, you get "signal is aborted without reason" errors.

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'implicit',
    // Unique storage key to avoid conflicts
    storageKey: 'verity-workforce-auth',
    // Bypass navigator.locks which causes "signal is aborted without reason"
    // errors in React. Provide a no-op lock that just runs the callback.
    lock: async (name, acquireTimeout, fn) => {
      return await fn();
    },
  },
  global: {
    fetch: (url, options = {}) => {
      const { signal, ...restOptions } = options;
      return fetch(url, restOptions);
    },
  },
});

// =====================================================
// DATABASE TYPES
// =====================================================

/**
 * @typedef {'super_admin' | 'company_admin' | 'employee'} UserRole
 * @typedef {'pending' | 'approved' | 'rejected'} SickNoteStatus
 */

/**
 * @typedef {Object} Company
 * @property {string} id
 * @property {string} company_code
 * @property {string} name
 * @property {string|null} email
 * @property {string|null} login_email
 * @property {string|null} phone
 * @property {string|null} address
 * @property {string|null} logo_url
 * @property {boolean} is_active
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} UserProfile
 * @property {string} id
 * @property {string} email
 * @property {string} first_name
 * @property {string} last_name
 * @property {string|null} phone
 * @property {string|null} avatar_url
 * @property {string|null} bio
 * @property {UserRole} role
 * @property {string|null} company_id
 * @property {boolean} is_active
 * @property {string} created_at
 * @property {string} updated_at
 * @property {Company} [companies]
 */

/**
 * @typedef {Object} Employee
 * @property {string} id
 * @property {string|null} user_id
 * @property {string} employee_id
 * @property {string} company_id
 * @property {string|null} name
 * @property {string|null} department
 * @property {string|null} position
 * @property {string|null} hire_date
 * @property {boolean} is_active
 * @property {string} created_at
 * @property {string} updated_at
 * @property {UserProfile} [user_profiles]
 * @property {Company} [companies]
 */

/**
 * @typedef {Object} SickNote
 * @property {string} id
 * @property {string} employee_id
 * @property {string} company_id
 * @property {string} start_date
 * @property {string} end_date
 * @property {string} reason
 * @property {string|null} medical_certificate_url
 * @property {SickNoteStatus} status
 * @property {string|null} reviewed_by
 * @property {string|null} reviewed_at
 * @property {string|null} review_notes
 * @property {string} created_at
 * @property {string} updated_at
 * @property {Employee} [employees]
 * @property {UserProfile} [reviewer]
 */

/**
 * @typedef {Object} SickNoteDetailed
 * @property {string} id
 * @property {string} start_date
 * @property {string} end_date
 * @property {string} reason
 * @property {string|null} medical_certificate_url
 * @property {SickNoteStatus} status
 * @property {string|null} review_notes
 * @property {string|null} reviewed_at
 * @property {string} created_at
 * @property {string} updated_at
 * @property {string} employee_id
 * @property {string} employee_code
 * @property {string|null} department
 * @property {string|null} position
 * @property {string} employee_first_name
 * @property {string} employee_last_name
 * @property {string} employee_email
 * @property {string} company_id
 * @property {string} company_name
 * @property {string|null} reviewer_first_name
 * @property {string|null} reviewer_last_name
 */

/**
 * @typedef {Object} EmployeeDetailed
 * @property {string} id
 * @property {string} employee_code
 * @property {string|null} name
 * @property {string|null} department
 * @property {string|null} position
 * @property {string|null} hire_date
 * @property {boolean} is_active
 * @property {string} created_at
 * @property {string|null} user_id
 * @property {string|null} first_name
 * @property {string|null} last_name
 * @property {string|null} email
 * @property {string|null} phone
 * @property {string|null} avatar_url
 * @property {string} company_id
 * @property {string} company_name
 */

/**
 * @typedef {Object} AuditLog
 * @property {string} id
 * @property {string|null} user_id
 * @property {string|null} company_id
 * @property {string} action
 * @property {string} table_name
 * @property {string|null} record_id
 * @property {any} old_data
 * @property {any} new_data
 * @property {string|null} ip_address
 * @property {string} created_at
 * @property {UserProfile} [user_profiles]
 */

/**
 * @typedef {Object} CompanyStatistics
 * @property {string} company_id
 * @property {string} company_name
 * @property {number} total_employees
 * @property {number} total_sick_notes
 * @property {number} pending_sick_notes
 * @property {number} approved_sick_notes
 * @property {number} rejected_sick_notes
 * @property {number} sick_notes_this_month
 */

/**
 * @typedef {Object} DashboardStats
 * @property {number} [totalCompanies]
 * @property {number} totalEmployees
 * @property {number} total
 * @property {number} pending
 * @property {number} approved
 * @property {number} rejected
 */

/**
 * @typedef {'sick_note' | 'employee' | 'company' | 'system'} NotificationType
 */

/**
 * @typedef {Object} Notification
 * @property {string} id
 * @property {string|null} user_id
 * @property {string|null} company_id
 * @property {NotificationType} type
 * @property {string} title
 * @property {string} message
 * @property {string|null} link
 * @property {boolean} is_read
 * @property {string} created_at
 */