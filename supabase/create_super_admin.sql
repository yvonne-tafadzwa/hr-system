-- =====================================================
-- CREATE/FIX SUPER ADMIN USER PROFILE
-- Run this in Supabase SQL Editor
-- =====================================================
-- 
-- COMMON ISSUE: Dashboard shows "..." for Companies/Employees
-- ROOT CAUSE: The super_admin user either:
--   1. Has no record in user_profiles table, OR
--   2. Has company_id set (should be NULL for super_admin), OR
--   3. The role is not set to 'super_admin'
--
-- This script fixes all these issues.
-- =====================================================

-- =====================================================
-- ★★★ QUICK FIX (RUN THIS FIRST!) ★★★
-- This fixes the most common issue in 2 queries
-- =====================================================

-- Step 1: Find your current user's ID (run this query first and note the ID)
SELECT id, email, raw_user_meta_data FROM auth.users ORDER BY created_at DESC LIMIT 10;

-- Step 2: Create/update the user_profiles record for YOUR admin user
-- Replace 'YOUR_USER_ID_HERE' with the UUID from Step 1
-- Replace 'admin@yourdomain.com' with your admin email
/*
INSERT INTO user_profiles (id, email, first_name, last_name, role, company_id, is_active)
VALUES (
  'YOUR_USER_ID_HERE',  -- Paste UUID from Step 1
  'admin@yourdomain.com',
  'Admin',
  'User',
  'super_admin',
  NULL,  -- MUST be NULL for super_admin!
  true
)
ON CONFLICT (id) DO UPDATE SET
  role = 'super_admin',
  company_id = NULL,
  is_active = true;
*/

-- =====================================================
-- ALTERNATIVE: Fix ALL existing super_admin profiles
-- =====================================================
UPDATE user_profiles 
SET company_id = NULL 
WHERE role = 'super_admin' AND company_id IS NOT NULL;

-- Also update any profile that was meant to be super_admin but isn't
-- (based on user metadata)
UPDATE user_profiles up
SET role = 'super_admin', company_id = NULL
FROM auth.users au
WHERE up.id = au.id 
  AND au.raw_user_meta_data->>'role' = 'super_admin'
  AND up.role != 'super_admin';

-- =====================================================
-- DIAGNOSTIC: Check current state
-- =====================================================
SELECT 
  au.id,
  au.email,
  au.raw_user_meta_data->>'role' as metadata_role,
  up.role as profile_role,
  up.company_id,
  CASE 
    WHEN up.id IS NULL THEN '❌ No profile record!'
    WHEN up.role = 'super_admin' AND up.company_id IS NULL THEN '✅ Correct'
    WHEN up.role = 'super_admin' AND up.company_id IS NOT NULL THEN '❌ super_admin has company_id!'
    ELSE '→ Company admin'
  END as status
FROM auth.users au
LEFT JOIN user_profiles up ON au.id = up.id
ORDER BY au.created_at DESC
LIMIT 20;

-- =====================================================
-- FULL SETUP BELOW (for creating new super_admin from scratch)
-- ====================================================

-- =====================================================
-- OPTION 1: Create super_admin profile for an EXISTING auth user
-- Use this if your admin user already exists in auth.users
-- Replace 'YOUR_USER_ID' with the actual user UUID from auth.users
-- =====================================================

-- First, find your user's ID by email:
-- SELECT id, email FROM auth.users WHERE email = 'your-admin-email@example.com';

-- Then insert/update the profile:
INSERT INTO user_profiles (id, email, first_name, last_name, role, company_id, is_active)
VALUES (
  'YOUR_USER_ID_HERE',  -- Replace with actual UUID from auth.users
  'your-admin-email@example.com',  -- Replace with actual email
  'Admin',
  'User',
  'super_admin',
  NULL,  -- !! IMPORTANT: super_admin should have NULL company_id !!
  true
)
ON CONFLICT (id) DO UPDATE SET
  role = 'super_admin',
  company_id = NULL,
  is_active = true;

-- =====================================================
-- OPTION 2: Fix existing super_admin profile 
-- Use this if your admin user exists but has incorrect company_id
-- =====================================================

-- Find and fix all super_admin profiles that incorrectly have a company_id:
UPDATE user_profiles 
SET company_id = NULL 
WHERE role = 'super_admin' AND company_id IS NOT NULL;

-- =====================================================
-- OPTION 3: Create new admin from scratch
-- This creates a completely new super admin user
-- =====================================================

-- Step 1: Create the auth user
-- NOTE: This requires running in Supabase SQL Editor with service role key
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role,
  aud,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change
)
VALUES (
  gen_random_uuid(),  -- Generate a new UUID
  '00000000-0000-0000-0000-000000000000',
  'superadmin@hrsy.system',
  crypt('SuperAdmin@123', gen_salt('bf')),  -- Password: SuperAdmin@123
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"first_name": "Super", "last_name": "Admin", "role": "super_admin"}',
  false,
  'authenticated',
  'authenticated',
  '',
  '',
  '',
  ''
)
ON CONFLICT (email) DO NOTHING
RETURNING id;

-- Step 2: After running Step 1, get the returned ID and use it below:
-- Or query the user: SELECT id FROM auth.users WHERE email = 'superadmin@hrsy.system';

-- Step 3: Create the profile (replace USER_ID with the ID from Step 1)
INSERT INTO user_profiles (id, email, first_name, last_name, role, company_id, is_active)
SELECT 
  id,
  'superadmin@hrsy.system',
  'Super',
  'Admin',
  'super_admin',
  NULL,  -- !! CRITICAL: super_admin MUST have NULL company_id !!
  true
FROM auth.users 
WHERE email = 'superadmin@hrsy.system'
ON CONFLICT (id) DO UPDATE SET
  role = 'super_admin',
  company_id = NULL,
  is_active = true;

-- Step 4: Create identity for login
INSERT INTO auth.identities (
  id,
  user_id,
  identity_data,
  provider,
  provider_id,
  last_sign_in_at,
  created_at,
  updated_at
)
SELECT 
  id,
  id,
  jsonb_build_object('sub', id::text, 'email', 'superadmin@hrsy.system'),
  'email',
  id::text,
  NOW(),
  NOW(),
  NOW()
FROM auth.users 
WHERE email = 'superadmin@hrsy.system'
ON CONFLICT (provider, provider_id) DO NOTHING;

-- =====================================================
-- VERIFICATION QUERIES
-- Run these to verify everything is correct
-- =====================================================

-- Check auth user exists:
SELECT id, email, raw_user_meta_data FROM auth.users 
WHERE email LIKE '%admin%' OR raw_user_meta_data->>'role' = 'super_admin';

-- Check profile is correct:
SELECT id, email, role, company_id, is_active FROM user_profiles 
WHERE role = 'super_admin';

-- Verify super_admin has NULL company_id (CRITICAL!):
SELECT 
  id, 
  email, 
  role, 
  company_id,
  CASE 
    WHEN company_id IS NULL THEN '✓ Correct (NULL)' 
    ELSE '✗ ERROR - super_admin should have NULL company_id!' 
  END as status
FROM user_profiles 
WHERE role = 'super_admin';

-- =====================================================
-- UPDATE USER METADATA (to fix auth state)
-- Run this if dashboard still shows "..." after fixing profile
-- =====================================================

-- Update user_metadata to include role (helps AuthContext detect super_admin)
UPDATE auth.users 
SET raw_user_meta_data = raw_user_meta_data || '{"role": "super_admin"}'::jsonb
WHERE id IN (SELECT id FROM user_profiles WHERE role = 'super_admin');

-- =====================================================
-- TROUBLESHOOTING
-- =====================================================

-- If you're still seeing "..." on the dashboard, run these checks:

-- 1. Check if RLS policies are working:
SELECT 
  (SELECT COUNT(*) FROM companies) as all_companies,
  (SELECT COUNT(*) FROM employees) as all_employees;

-- 2. Test the is_super_admin function:
-- Replace USER_ID with your admin's UUID
SELECT is_super_admin('YOUR_USER_ID_HERE'::uuid);

-- 3. Check that the profile exists and is correct:
SELECT * FROM user_profiles WHERE role = 'super_admin';

-- =====================================================
-- QUICK FIX: Update your current logged-in user to super_admin
-- =====================================================

-- If you know the email of your current admin account:
UPDATE user_profiles 
SET 
  role = 'super_admin',
  company_id = NULL
WHERE email = 'admin@trezohr.com';  -- Replace with your actual admin email

-- Also update the auth user metadata:
UPDATE auth.users 
SET raw_user_meta_data = raw_user_meta_data || '{"role": "super_admin"}'::jsonb
WHERE email = 'admin@trezohr.com';  -- Replace with your actual admin email
