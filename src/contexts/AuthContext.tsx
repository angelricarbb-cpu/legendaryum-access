import React, { createContext, useContext, useState, ReactNode } from "react";

export interface UserProfile {
  firstName: string;
  lastName: string;
  gender: string;
  birthDate: string;
  phone: string;
  country: string;
  city: string;
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
  loginWithGoogle: () => void;
  logout: () => void;
  acceptTerms: () => void;
  completeProfile: (profile: UserProfile) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const loginWithGoogle = () => {
    // Simulated Google SSO login
    setUser({
      id: "user-1",
      name: "Angelo RS",
      username: "@LegendAR11",
      email: "angelo@example.com",
      avatar: "",
      hasAcceptedTerms: false,
      hasCompletedProfile: false,
      subscription: { plan: "free" }, // Default to free plan
    });
    setIsLoggedIn(true);
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
  };

  const acceptTerms = () => {
    if (user) {
      setUser({ ...user, hasAcceptedTerms: true });
    }
  };

  const completeProfile = (profile: UserProfile) => {
    if (user) {
      setUser({
        ...user,
        hasCompletedProfile: true,
        profile,
        name: `${profile.firstName} ${profile.lastName}`,
      });
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isLoggedIn, 
      user, 
      loginWithGoogle, 
      logout,
      acceptTerms,
      completeProfile
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
