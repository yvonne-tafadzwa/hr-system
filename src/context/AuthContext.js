"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({
  user: null,
  profile: null,
  isLoading: true,
  isSuperAdmin: false,
  companyId: null,
  refreshProfile: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Helper: find company by email
  const findCompanyByEmail = async (email) => {
    if (!email) return null;
    const emailLower = email.trim().toLowerCase();

    // Try ilike match on login_email
    const { data: ilikeMatch } = await supabase
      .from('companies')
      .select('*')
      .ilike('login_email', emailLower)
      .single();

    if (ilikeMatch) return ilikeMatch;

    // Fallback: fetch all and search multiple email fields
    const { data: allCompanies } = await supabase.from('companies').select('*');
    if (!allCompanies) return null;

    return allCompanies.find(c =>
      (c.login_email && c.login_email.trim().toLowerCase() === emailLower) ||
      (c.email && c.email.trim().toLowerCase() === emailLower) ||
      (c.contact_email && c.contact_email.trim().toLowerCase() === emailLower)
    ) || null;
  };

  const fetchProfile = async (authUser) => {
    try {
      const userId = authUser.id;
      const userEmail = authUser.email;
      const metadataCompanyId = authUser.user_metadata?.company_id || null;
      const metadataRole = authUser.user_metadata?.role || null;

      console.log('[AuthContext] Fetching profile for:', userId, userEmail);
      console.log('[AuthContext] user_metadata:', { company_id: metadataCompanyId, role: metadataRole });

      // Step 1: Try user_profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (!profileError && profileData) {
        console.log('[AuthContext] Found user_profiles record:', {
          role: profileData.role,
          company_id: profileData.company_id,
          email: profileData.email,
        });

        // If profile has company_id, use it
        if (profileData.company_id) {
          console.log('[AuthContext] ✓ Using company_id from user_profiles:', profileData.company_id);
          return profileData;
        }

        // If super_admin, no company_id needed
        if (profileData.role === 'super_admin') {
          console.log('[AuthContext] ✓ Super admin — no company_id needed');
          return profileData;
        }

        // Profile exists but company_id is null — try to resolve it
        console.log('[AuthContext] Profile has no company_id, attempting resolution...');

        // Fallback A: Check user_metadata (set during login by services.js)
        if (metadataCompanyId) {
          console.log('[AuthContext] ✓ Resolved company_id from user_metadata:', metadataCompanyId);
          profileData.company_id = metadataCompanyId;

          // Persist to DB for next time
          await supabase
            .from('user_profiles')
            .update({ company_id: metadataCompanyId })
            .eq('id', userId);

          return profileData;
        }

        // Fallback B: Search companies table by email
        const companyFromEmail = await findCompanyByEmail(userEmail);
        if (companyFromEmail && companyFromEmail.company_code !== 'ADMIN') {
          console.log('[AuthContext] ✓ Resolved company_id from email match:', companyFromEmail.id);
          profileData.company_id = companyFromEmail.id;

          // Persist to DB
          await supabase
            .from('user_profiles')
            .update({ company_id: companyFromEmail.id })
            .eq('id', userId);

          return profileData;
        }

        console.warn('[AuthContext] Could not resolve company_id for profile');
        return profileData;
      }

      // Step 2: No user_profiles record — construct profile from available data
      console.log('[AuthContext] No user_profiles record, constructing profile...');

      // Check if super_admin from metadata
      if (metadataRole === 'super_admin') {
        console.log('[AuthContext] ✓ Constructed super_admin profile from metadata');
        return {
          id: userId,
          email: userEmail,
          role: 'super_admin',
          company_id: null,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
      }

      // Use metadata company_id if available
      if (metadataCompanyId) {
        console.log('[AuthContext] ✓ Constructed company_admin profile from metadata');
        return {
          id: userId,
          email: userEmail,
          role: metadataRole || 'company_admin',
          company_id: metadataCompanyId,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
      }

      // Last resort: search companies by email
      const companyFromEmail = await findCompanyByEmail(userEmail);
      if (companyFromEmail) {
        if (companyFromEmail.company_code === 'ADMIN') {
          console.log('[AuthContext] ✓ Resolved as super_admin via email match');
          return {
            id: userId,
            email: userEmail,
            role: 'super_admin',
            company_id: null,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
        }

        console.log('[AuthContext] ✓ Resolved as company_admin via email match:', companyFromEmail.id);
        return {
          id: userId,
          email: userEmail,
          role: 'company_admin',
          company_id: companyFromEmail.id,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
      }

      console.warn('[AuthContext] Could not construct profile for user');
      return null;
    } catch (error) {
      console.error('[AuthContext] Error:', error);
      return null;
    }
  };

  const refreshProfile = async () => {
    if (user) {
      const profileData = await fetchProfile(user);
      setProfile(profileData);
    }
  };

  useEffect(() => {
    let isMounted = true;
    let isInitialized = false;

    const initAuth = async () => {
      try {
        // Use getUser() which validates with the server (important for production)
        const { data: { user: authUser }, error } = await supabase.auth.getUser();

        if (error) {
          console.warn('[AuthContext] getUser error (may be logged out):', error.message);
          if (isMounted) {
            setUser(null);
            setProfile(null);
          }
          return;
        }

        if (authUser && isMounted) {
          setUser(authUser);
          const profileData = await fetchProfile(authUser);
          console.log('[AuthContext] Init complete:', {
            role: profileData?.role,
            company_id: profileData?.company_id,
            isSuperAdmin: profileData?.role === 'super_admin',
          });
          if (isMounted) {
            setProfile(profileData);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
          isInitialized = true;
        }
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // Skip INITIAL_SESSION events since initAuth handles that
        if (event === 'INITIAL_SESSION') return;

        // Skip TOKEN_REFRESHED events - the user/session data doesn't change,
        // and processing this event causes unnecessary re-renders and data re-fetches
        // across the entire app every ~10 seconds.
        if (event === 'TOKEN_REFRESHED') return;

        // Only process auth changes after initialization to avoid race conditions
        if (!isInitialized && event !== 'SIGNED_IN' && event !== 'SIGNED_OUT') return;

        console.log('[AuthContext] Auth state changed:', event);

        if (session?.user && isMounted) {
          setUser(session.user);
          const profileData = await fetchProfile(session.user);
          console.log('[AuthContext] Profile updated:', {
            role: profileData?.role,
            company_id: profileData?.company_id,
          });
          if (isMounted) {
            setProfile(profileData);
          }
        } else if (isMounted) {
          setUser(null);
          setProfile(null);
        }
        if (isMounted) {
          setIsLoading(false);
        }
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Derive isSuperAdmin and companyId from multiple sources for reliability
  const isSuperAdmin =
    profile?.role === 'super_admin' ||
    user?.user_metadata?.role === 'super_admin';

  const companyId =
    profile?.company_id ||
    user?.user_metadata?.company_id ||
    null;

  const value = {
    user,
    profile,
    isLoading,
    isSuperAdmin,
    companyId,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}