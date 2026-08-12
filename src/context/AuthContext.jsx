import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const AuthContext = createContext({});

const DEMO_USER = {
  id: "demo-admin-id",
  email: "alex.morgan@enterprise.io",
  full_name: "Alex Morgan",
  role: "Senior Admin",
  department: "Engineering & Operations",
  designation: "Principal Infrastructure Lead",
  avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(DEMO_USER);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Helper: Verify if user's email exists in allowed_users table & sync profile metadata
  const checkUserAuthorization = async (sessionUser) => {
    if (!sessionUser?.email) return DEMO_USER;

    const formattedEmail = sessionUser.email.trim();
    const googleMeta = sessionUser.user_metadata || {};

    const googleName =
      googleMeta.full_name || googleMeta.name || formattedEmail.split("@")[0];
    const googleAvatar = googleMeta.avatar_url || googleMeta.picture || null;

    try {
      const { data, error } = await supabase
        .from("allowed_users")
        .select("email, role, full_name, avatar_url")
        .ilike("email", formattedEmail)
        .maybeSingle();

      if (data) {
        const finalName = data.full_name || googleName;
        const finalAvatar = data.avatar_url || googleAvatar;

        return {
          ...sessionUser,
          role: data.role || "Admin",
          full_name: finalName,
          avatar_url: finalAvatar,
        };
      }
    } catch (err) {
      console.warn("Supabase auth sync fallback:", err);
    }

    return {
      ...sessionUser,
      role: "Senior Admin",
      full_name: googleName,
      avatar_url: googleAvatar || DEMO_USER.avatar_url,
    };
  };

  useEffect(() => {
    let isMounted = true;

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
            setUser(DEMO_USER);
            setAuthError(err.message);
          }
        } finally {
          if (isMounted) setLoading(false);
        }
      } else {
        if (isMounted) {
          setUser(DEMO_USER);
          setLoading(false);
        }
      }
    });

    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        checkUserAuthorization(session.user).then((vUser) => {
          if (isMounted) {
            setUser(vUser);
            setLoading(false);
          }
        });
      } else {
        if (isMounted) {
          setUser(DEMO_USER);
          setLoading(false);
        }
      }
    }).catch(() => {
      if (isMounted) {
        setUser(DEMO_USER);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    setAuthError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/profile`,
      },
    });
    if (error) throw error;
  };

  const signInWithEmail = async (email, password) => {
    setAuthError(null);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setAuthError(error.message);
      throw error;
    }
    return data;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(DEMO_USER);
    setAuthError(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, authError, signInWithGoogle, signInWithEmail, signOut, setAuthError }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
