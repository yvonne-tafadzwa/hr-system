import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
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

  // Track whether initAuth has completed to avoid races with onAuthStateChange
  const initDone = useRef(false);
  // Abort controller to cancel stale profile fetches
  const profileAbort = useRef(null);

  // ─── Helper: find company by email ───────────────────────────────────
  // Optimized: single query with OR filter instead of fetching ALL companies
  const findCompanyByEmail = useCallback(async (email) => {
    if (!email) return null;
    const emailLower = email.trim().toLowerCase();

    try {
      // Single query using Supabase OR filter — avoids full table scan
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .or(
          `login_email.ilike.${emailLower},email.ilike.${emailLower},contact_email.ilike.${emailLower}`
        )
        .limit(1)
        .maybeSingle();

      if (error) {
        console.warn('[AuthContext] Company lookup error:', error.message);
        return null;
      }
      return data || null;
    } catch (err) {
      console.warn('[AuthContext] Company lookup failed:', err.message);
      return null;
    }
  }, []);

  // ─── Fetch profile with timeout protection ───────────────────────────
  const fetchProfile = useCallback(async (authUser) => {
    // Cancel any in-flight profile fetch
    if (profileAbort.current) {
      profileAbort.current.abort();
    }
    const controller = new AbortController();
    profileAbort.current = controller;

    try {
      const userId = authUser.id;
      const userEmail = authUser.email;
      const metadataCompanyId = authUser.user_metadata?.company_id || null;
      const metadataRole = authUser.user_metadata?.role || null;

      console.log('[AuthContext] Fetching profile for:', userId, userEmail);

      // ── Step 1: Try user_profiles table ──
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      // Bail if this fetch was cancelled (user logged out mid-flight, etc.)
      if (controller.signal.aborted) return null;

      if (!profileError && profileData) {
        // Profile found — resolve company_id if missing
        if (profileData.company_id || profileData.role === 'super_admin') {
          return profileData;
        }

        // Resolve missing company_id
        const resolvedCompanyId = metadataCompanyId
          || (await findCompanyByEmail(userEmail))?.id
          || null;

        if (controller.signal.aborted) return null;

        if (resolvedCompanyId) {
          profileData.company_id = resolvedCompanyId;
          // Fire-and-forget: persist to DB (don't await — don't block login)
          supabase
            .from('user_profiles')
            .update({ company_id: resolvedCompanyId })
            .eq('id', userId)
            .then(({ error }) => {
              if (error) console.warn('[AuthContext] Failed to persist company_id:', error.message);
            });
        }

        return profileData;
      }

      // ── Step 2: No user_profiles record — construct from metadata ──
      console.log('[AuthContext] No user_profiles record, constructing profile...');

      if (metadataRole === 'super_admin') {
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

      if (metadataCompanyId) {
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

      // ── Step 3: Last resort — email-based company lookup ──
      const company = await findCompanyByEmail(userEmail);
      if (controller.signal.aborted) return null;

      if (company) {
        const isSuperAdmin = company.company_code === 'ADMIN';
        return {
          id: userId,
          email: userEmail,
          role: isSuperAdmin ? 'super_admin' : 'company_admin',
          company_id: isSuperAdmin ? null : company.id,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
      }

      console.warn('[AuthContext] Could not construct profile for user');
      return null;
    } catch (error) {
      if (controller.signal.aborted) return null;
      console.error('[AuthContext] fetchProfile error:', error);
      return null;
    }
  }, [findCompanyByEmail]);

  const refreshProfile = useCallback(async () => {
    if (user) {
      const profileData = await fetchProfile(user);
      setProfile(profileData);
    }
  }, [user, fetchProfile]);

  // ─── Auth initialization ─────────────────────────────────────────────
  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      try {
        // Step 1: Quick localStorage check — no lock, no network
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
          // No session — user is not logged in. Return fast so
          // signInWithPassword() can acquire the auth lock immediately.
          if (isMounted) {
            setUser(null);
            setProfile(null);
          }
          return;
        }

        // Step 2: Check token expiry
        const expiresAt = session.expires_at;
        const now = Math.floor(Date.now() / 1000);
        const isExpired = !expiresAt || now >= expiresAt - 60;

        let authUser = session.user;

        if (isExpired) {
          console.log('[AuthContext] Token expired, refreshing...');
          const { data: refreshData, error: refreshError } =
            await supabase.auth.refreshSession();

          if (refreshError || !refreshData.session) {
            console.warn('[AuthContext] Session refresh failed:', refreshError?.message);
            if (isMounted) {
              setUser(null);
              setProfile(null);
            }
            return;
          }
          authUser = refreshData.session.user;
        }

        // Step 3: Set user immediately (unblocks UI) then fetch profile
        if (authUser && isMounted) {
          setUser(authUser);
          const profileData = await fetchProfile(authUser);
          if (isMounted) {
            setProfile(profileData);
          }
        }
      } catch (error) {
        console.error('[AuthContext] initAuth error:', error);
      } finally {
        if (isMounted) {
          initDone.current = true;
          setIsLoading(false);
        }
      }
    };

    initAuth();

    // ─── Auth state listener ─────────────────────────────────────────
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('[AuthContext] Auth event:', event);

        // Skip events that initAuth handles
        if (event === 'INITIAL_SESSION') return;
        if (event === 'TOKEN_REFRESHED') return;

        if (event === 'SIGNED_IN' && session?.user && isMounted) {
          // Cancel any pending profile fetch from a previous session
          if (profileAbort.current) {
            profileAbort.current.abort();
          }

          setUser(session.user);
          setIsLoading(true); // show loading while we fetch profile

          const profileData = await fetchProfile(session.user);
          if (isMounted) {
            setProfile(profileData);
            setIsLoading(false);
          }
          return;
        }

        if (event === 'SIGNED_OUT' && isMounted) {
          // Cancel any in-flight profile fetch
          if (profileAbort.current) {
            profileAbort.current.abort();
          }

          setUser(null);
          setProfile(null);
          setIsLoading(false);
          return;
        }
      }
    );

    return () => {
      isMounted = false;
      if (profileAbort.current) {
        profileAbort.current.abort();
      }
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  // ─── Derived values ──────────────────────────────────────────────────
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