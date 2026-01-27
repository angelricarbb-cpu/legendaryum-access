import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User as SupabaseUser, Session } from "@supabase/supabase-js";

export interface UserProfile {
  firstName: string;
  lastName: string;
  gender: string;
  birthDate: string;
  phone: string;
  country: string;
  city: string;
  username?: string;
  description?: string;
  avatarUrl?: string;
  topics?: string[];
  socialMedia?: {
    facebook?: string;
    linkedin?: string;
    instagram?: string;
    twitter?: string;
    tiktok?: string;
    website?: string;
  };
}

export type SubscriptionPlan = "free" | "premium" | "growth" | "scale" | "enterprise";

export interface UserSubscription {
  plan: SubscriptionPlan;
  expiresAt?: Date;
}

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar?: string;
  hasAcceptedTerms: boolean;
  hasCompletedProfile: boolean;
  profile?: UserProfile;
  subscription?: UserSubscription;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  isLoading: boolean;
  loginWithEmail: (email: string, password: string) => Promise<{ error: string | null }>;
  signUpWithEmail: (email: string, password: string, name: string) => Promise<{ error: string | null }>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  acceptTerms: () => Promise<void>;
  completeProfile: (profile: UserProfile) => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
  returnUrl: string | null;
  setReturnUrl: (url: string | null) => void;
  upgradePlan: (plan: SubscriptionPlan) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [returnUrl, setReturnUrl] = useState<string | null>(null);

  // Fetch profile from database
  const fetchProfile = async (supabaseUser: SupabaseUser): Promise<User | null> => {
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", supabaseUser.id)
      .maybeSingle();

    if (error) {
      console.error("Error fetching profile:", error);
      return null;
    }

    if (!profile) {
      // Profile might not exist yet, return basic user
      return {
        id: supabaseUser.id,
        name: supabaseUser.user_metadata?.full_name || supabaseUser.email?.split("@")[0] || "Usuario",
        username: supabaseUser.email?.split("@")[0] || "",
        email: supabaseUser.email || "",
        avatar: supabaseUser.user_metadata?.avatar_url,
        hasAcceptedTerms: false,
        hasCompletedProfile: false,
        subscription: { plan: "free" },
      };
    }

    const socialMedia = profile.social_media as Record<string, string> | null;

    return {
      id: supabaseUser.id,
      name: `${profile.first_name || ""} ${profile.last_name || ""}`.trim() || supabaseUser.email?.split("@")[0] || "Usuario",
      username: profile.username || supabaseUser.email?.split("@")[0] || "",
      email: supabaseUser.email || "",
      avatar: profile.avatar_url || supabaseUser.user_metadata?.avatar_url,
      hasAcceptedTerms: profile.terms_accepted || false,
      hasCompletedProfile: profile.profile_completed || false,
      profile: {
        firstName: profile.first_name || "",
        lastName: profile.last_name || "",
        gender: profile.gender || "",
        birthDate: profile.birth_date || "",
        phone: profile.phone || "",
        country: profile.country || "",
        city: profile.city || "",
        username: profile.username || "",
        description: profile.description || "",
        avatarUrl: profile.avatar_url || "",
        topics: profile.topics || [],
        socialMedia: socialMedia ? {
          facebook: socialMedia.facebook || "",
          linkedin: socialMedia.linkedin || "",
          instagram: socialMedia.instagram || "",
          twitter: socialMedia.twitter || "",
          tiktok: socialMedia.tiktok || "",
          website: socialMedia.website || "",
        } : undefined,
      },
      subscription: {
        plan: (profile.subscription_plan as SubscriptionPlan) || "free",
        expiresAt: profile.subscription_expires_at ? new Date(profile.subscription_expires_at) : undefined,
      },
    };
  };

  // Initialize auth state
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const userData = await fetchProfile(session.user);
        setUser(userData);
        setIsLoggedIn(true);
      } else {
        setUser(null);
        setIsLoggedIn(false);
      }
      setIsLoading(false);
    });

    // Then check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const userData = await fetchProfile(session.user);
        setUser(userData);
        setIsLoggedIn(true);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const loginWithEmail = async (email: string, password: string): Promise<{ error: string | null }> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      return { error: error.message };
    }
    return { error: null };
  };

  const signUpWithEmail = async (email: string, password: string, name: string): Promise<{ error: string | null }> => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { full_name: name },
      },
    });

    if (error) {
      return { error: error.message };
    }

    // Update profile with name after signup
    if (data.user) {
      const names = name.split(" ");
      await supabase.from("profiles").update({
        first_name: names[0] || "",
        last_name: names.slice(1).join(" ") || "",
      }).eq("user_id", data.user.id);
    }

    return { error: null };
  };

  const loginWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin + (returnUrl || "/"),
      },
    });
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsLoggedIn(false);
  };

  const acceptTerms = async () => {
    if (!user) return;
    
    await supabase.from("profiles").update({
      terms_accepted: true,
      terms_accepted_at: new Date().toISOString(),
    }).eq("user_id", user.id);

    setUser({ ...user, hasAcceptedTerms: true });
  };

  const completeProfile = async (profile: UserProfile) => {
    if (!user) return;

    await supabase.from("profiles").update({
      first_name: profile.firstName,
      last_name: profile.lastName,
      username: profile.username,
      gender: profile.gender,
      birth_date: profile.birthDate || null,
      phone: profile.phone,
      country: profile.country,
      city: profile.city,
      description: profile.description,
      avatar_url: profile.avatarUrl,
      topics: profile.topics || [],
      social_media: profile.socialMedia || {},
      profile_completed: true,
    }).eq("user_id", user.id);

    setUser({
      ...user,
      hasCompletedProfile: true,
      profile,
      name: `${profile.firstName} ${profile.lastName}`.trim(),
    });
  };

  const updateProfile = async (profile: Partial<UserProfile>) => {
    if (!user) return;

    const updates: Record<string, unknown> = {};
    if (profile.firstName !== undefined) updates.first_name = profile.firstName;
    if (profile.lastName !== undefined) updates.last_name = profile.lastName;
    if (profile.username !== undefined) updates.username = profile.username;
    if (profile.gender !== undefined) updates.gender = profile.gender;
    if (profile.birthDate !== undefined) updates.birth_date = profile.birthDate || null;
    if (profile.phone !== undefined) updates.phone = profile.phone;
    if (profile.country !== undefined) updates.country = profile.country;
    if (profile.city !== undefined) updates.city = profile.city;
    if (profile.description !== undefined) updates.description = profile.description;
    if (profile.avatarUrl !== undefined) updates.avatar_url = profile.avatarUrl;
    if (profile.topics !== undefined) updates.topics = profile.topics;
    if (profile.socialMedia !== undefined) updates.social_media = profile.socialMedia;

    await supabase.from("profiles").update(updates).eq("user_id", user.id);

    setUser({
      ...user,
      profile: { ...user.profile, ...profile } as UserProfile,
      name: profile.firstName && profile.lastName 
        ? `${profile.firstName} ${profile.lastName}`.trim() 
        : user.name,
    });
  };

  const upgradePlan = async (plan: SubscriptionPlan) => {
    if (!user) return;

    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    
    await supabase.from("profiles").update({
      subscription_plan: plan,
      subscription_expires_at: expiresAt.toISOString(),
    }).eq("user_id", user.id);

    setUser({
      ...user,
      subscription: { plan, expiresAt },
    });
  };

  const refreshProfile = async () => {
    const { data: { user: supabaseUser } } = await supabase.auth.getUser();
    if (supabaseUser) {
      const userData = await fetchProfile(supabaseUser);
      if (userData) {
        setUser(userData);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isLoggedIn, 
      user, 
      isLoading,
      loginWithEmail,
      signUpWithEmail,
      loginWithGoogle, 
      logout,
      acceptTerms,
      completeProfile,
      updateProfile,
      returnUrl,
      setReturnUrl,
      upgradePlan,
      refreshProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
