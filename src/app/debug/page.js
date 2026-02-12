import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

export default function DebugPage() {
    const auth = useAuth();
    const [results, setResults] = React.useState({});

    React.useEffect(() => {
        const run = async () => {
            const r = {};

            // Test 1: getUser (bypasses lock, hits network directly)
            try {
                const t1 = Date.now();
                const { data, error } = await supabase.auth.getUser();
                r.getUser = {
                    ms: Date.now() - t1,
                    userId: data?.user?.id,
                    email: data?.user?.email,
                    role: data?.user?.user_metadata?.role,
                    companyId: data?.user?.user_metadata?.company_id,
                    error: error?.message,
                };
            } catch (e) {
                r.getUser = { error: e.message };
            }
            setResults({ ...r });

            // Test 2: getSession (uses navigator.locks)
            try {
                const t2 = Date.now();
                const { data, error } = await supabase.auth.getSession();
                r.getSession = {
                    ms: Date.now() - t2,
                    hasSession: !!data?.session,
                    userId: data?.session?.user?.id?.substring(0, 8),
                    error: error?.message,
                };
            } catch (e) {
                r.getSession = { error: e.message };
            }
            setResults({ ...r });

            // Test 3: Query user_profiles
            if (r.getUser?.userId) {
                try {
                    const { data, error } = await supabase
                        .from('user_profiles')
                        .select('*')
                        .eq('id', r.getUser.userId)
                        .single();
                    r.userProfile = {
                        role: data?.role,
                        companyId: data?.company_id,
                        displayName: data?.display_name,
                        error: error?.message,
                    };
                } catch (e) {
                    r.userProfile = { error: e.message };
                }
                setResults({ ...r });
            }

            // Test 4: Query companies (count all)
            try {
                const { data, error, count } = await supabase
                    .from('companies')
                    .select('id, name, company_code', { count: 'exact' })
                    .limit(5);
                r.companies = {
                    totalCount: count,
                    returned: data?.length,
                    rows: data?.map(c => ({ id: c.id, name: c.name, code: c.company_code })),
                    error: error?.message,
                };
            } catch (e) {
                r.companies = { error: e.message };
            }
            setResults({ ...r });

            // Test 5: Query employees (count)
            try {
                const { count, error } = await supabase
                    .from('employees')
                    .select('id', { count: 'exact', head: true });
                r.employees = { count, error: error?.message };
            } catch (e) {
                r.employees = { error: e.message };
            }
            setResults({ ...r });

            // Test 6: Query sick_notes (count)
            try {
                const { count, error } = await supabase
                    .from('sick_notes')
                    .select('id', { count: 'exact', head: true });
                r.sickNotes = { count, error: error?.message };
            } catch (e) {
                r.sickNotes = { error: e.message };
            }
            setResults({ ...r });
        };

        run();
    }, []);

    return (
        <div style={{ padding: 40, fontFamily: 'monospace', fontSize: 13 }}>
            <h2>Debug Page</h2>

            <h3>Auth Context (from useAuth):</h3>
            <pre style={{ background: '#f0f0f0', padding: 16, whiteSpace: 'pre-wrap' }}>
                {JSON.stringify({
                    isLoading: auth.isLoading,
                    hasUser: !!auth.user,
                    userEmail: auth.user?.email,
                    hasProfile: !!auth.profile,
                    profileRole: auth.profile?.role,
                    profileCompanyId: auth.profile?.company_id,
                    isSuperAdmin: auth.isSuperAdmin,
                    companyId: auth.companyId,
                }, null, 2)}
            </pre>

            <h3>1. supabase.auth.getUser():</h3>
            <pre style={{ background: '#f0f0f0', padding: 16, whiteSpace: 'pre-wrap' }}>
                {results.getUser ? JSON.stringify(results.getUser, null, 2) : 'Running...'}
            </pre>

            <h3>2. supabase.auth.getSession():</h3>
            <pre style={{ background: '#f0f0f0', padding: 16, whiteSpace: 'pre-wrap' }}>
                {results.getSession ? JSON.stringify(results.getSession, null, 2) : 'Waiting...'}
            </pre>

            <h3>3. user_profiles row:</h3>
            <pre style={{ background: '#f0f0f0', padding: 16, whiteSpace: 'pre-wrap' }}>
                {results.userProfile ? JSON.stringify(results.userProfile, null, 2) : 'Waiting...'}
            </pre>

            <h3>4. Companies query:</h3>
            <pre style={{ background: '#f0f0f0', padding: 16, whiteSpace: 'pre-wrap' }}>
                {results.companies ? JSON.stringify(results.companies, null, 2) : 'Waiting...'}
            </pre>

            <h3>5. Employees count:</h3>
            <pre style={{ background: '#f0f0f0', padding: 16, whiteSpace: 'pre-wrap' }}>
                {results.employees ? JSON.stringify(results.employees, null, 2) : 'Waiting...'}
            </pre>

            <h3>6. Sick Notes count:</h3>
            <pre style={{ background: '#f0f0f0', padding: 16, whiteSpace: 'pre-wrap' }}>
                {results.sickNotes ? JSON.stringify(results.sickNotes, null, 2) : 'Waiting...'}
            </pre>

            <h3>Environment:</h3>
            <pre style={{ background: '#f0f0f0', padding: 16, whiteSpace: 'pre-wrap' }}>
                {JSON.stringify({
                    VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL?.substring(0, 35) + '...',
                    VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY?.substring(0, 20) + '...',
                    MODE: import.meta.env.MODE,
                }, null, 2)}
            </pre>
        </div>
    );
}
