import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Helper: Verify if user's email exists in allowed_users table & sync profile metadata
  const checkUserAuthorization = async (sessionUser) => {
    if (!sessionUser?.email) return null;

    const formattedEmail = sessionUser.email.trim();
    const googleMeta = sessionUser.user_metadata || {};

    // Extract Google metadata values
    const googleName =
      googleMeta.full_name ||
      googleMeta.name ||
      formattedEmail.split("@")[0];
    const googleAvatar = googleMeta.avatar_url || googleMeta.picture || null;

    // 1. Fetch record from allowed_users
    const { data, error } = await supabase
      .from("allowed_users")
      .select("email, role, full_name, avatar_url")
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
        `Access Denied: Your account (${formattedEmail}) is not authorized to access this portal.`
      );
    }

    // 2. Sync Google name/avatar to DB if currently missing or updated
    const finalName = data.full_name || googleName;
    const finalAvatar = data.avatar_url || googleAvatar;

    if (!data.full_name || !data.avatar_url) {
      await supabase
        .from("allowed_users")
        .update({
          full_name: finalName,
          avatar_url: finalAvatar,
        })
        .ilike("email", formattedEmail);
    }

    // Return combined session user with role, name, and profile pic
    return {
      ...sessionUser,
      role: data.role,
      full_name: finalName,
      avatar_url: finalAvatar,
    };
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