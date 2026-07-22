import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Helper: Verify if user's email exists in allowed_users table
  const checkUserAuthorization = async (sessionUser) => {
    if (!sessionUser?.email) return null;

    const formattedEmail = sessionUser.email.trim();

    const { data, error } = await supabase
      .from("allowed_users")
      .select("email, role")
      .ilike("email", formattedEmail)
      .maybeSingle();

    // Log query result for debugging in DevTools Console
    if (error) {
      console.error("Supabase allowed_users query error:", error);
    }

    // If email is NOT authorized, terminate the session immediately
    if (error || !data) {
      await supabase.auth.signOut();
      throw new Error(
        `Access Denied: Your account (${formattedEmail}) is not authorized to access this portal.`,
      );
    }

    return { ...sessionUser, role: data.role };
  };

  useEffect(() => {
    let isMounted = true;

    // Listen for Auth changes (Sign In, Sign Out, Token Refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        try {
          if (isMounted) setLoading(true);

          const verifiedUser = await checkUserAuthorization(session.user);

          if (isMounted) {
            setUser(verifiedUser);
            setAuthError(null);
          }
        } catch (err) {
          if (isMounted) {
            setUser(null);
            setAuthError(err.message);
          }
        } finally {
          if (isMounted) setLoading(false);
        }
      } else {
        if (isMounted) {
          setUser(null);
          setLoading(false);
        }
      }
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  // Trigger Google SSO Login
  const signInWithGoogle = async () => {
    setAuthError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) throw error;
  };

  // Trigger Sign Out
  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setAuthError(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, authError, signInWithGoogle, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
