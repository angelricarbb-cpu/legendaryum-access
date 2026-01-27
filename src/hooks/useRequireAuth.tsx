import { useNavigate } from "react-router-dom";
import { useAuth, SubscriptionPlan } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface UseRequireAuthOptions {
  requiredPlan?: SubscriptionPlan | "all";
  redirectToAuth?: boolean;
  redirectToPricing?: boolean;
}

export const useRequireAuth = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user, setReturnUrl } = useAuth();

  const getUserPlan = (): SubscriptionPlan => {
    return user?.subscription?.plan || "free";
  };

  const isPremiumOrAbove = (): boolean => {
    const plan = getUserPlan();
    return ["premium", "growth", "scale", "enterprise"].includes(plan);
  };

  const isGrowthOrAbove = (): boolean => {
    const plan = getUserPlan();
    return ["growth", "scale", "enterprise"].includes(plan);
  };

  const canAccessPlan = (requiredPlan: SubscriptionPlan | "all"): boolean => {
    if (requiredPlan === "all" || requiredPlan === "free") return true;
    
    const userPlan = getUserPlan();
    const planHierarchy: SubscriptionPlan[] = ["free", "premium", "growth", "scale", "enterprise"];
    const userPlanIndex = planHierarchy.indexOf(userPlan);
    const requiredPlanIndex = planHierarchy.indexOf(requiredPlan);
    
    return userPlanIndex >= requiredPlanIndex;
  };

  const requireAuth = (
    returnPath: string,
    options: UseRequireAuthOptions = {}
  ): boolean => {
    const { requiredPlan = "all", redirectToAuth = true, redirectToPricing = false } = options;

    // Check if user is logged in
    if (!isLoggedIn) {
      if (redirectToAuth) {
        setReturnUrl(returnPath);
        toast.error("Por favor, inicia sesión para continuar");
        navigate("/auth");
      }
      return false;
    }

    // Check if user has the required plan
    if (requiredPlan !== "all" && !canAccessPlan(requiredPlan)) {
      if (redirectToPricing) {
        toast.info(`Esta función requiere el plan ${requiredPlan.toUpperCase()}. Actualiza tu plan para acceder.`);
        navigate("/pricing");
      }
      return false;
    }

    return true;
  };

  const checkAuthAndPlan = (
    requiredPlan: SubscriptionPlan | "all" = "all"
  ): { isAuthenticated: boolean; hasPlan: boolean; needsUpgrade: boolean } => {
    const isAuthenticated = isLoggedIn;
    const hasPlan = requiredPlan === "all" || canAccessPlan(requiredPlan);
    const needsUpgrade = isAuthenticated && !hasPlan;

    return { isAuthenticated, hasPlan, needsUpgrade };
  };

  const redirectToAuthWithReturn = (returnPath: string) => {
    setReturnUrl(returnPath);
    navigate("/auth");
  };

  const redirectToPricingWithMessage = (planName?: string) => {
    const message = planName 
      ? `Actualiza a ${planName.toUpperCase()} para acceder a esta función`
      : "Actualiza tu plan para acceder a esta función";
    toast.info(message);
    navigate("/pricing");
  };

  return {
    isLoggedIn,
    user,
    getUserPlan,
    isPremiumOrAbove,
    isGrowthOrAbove,
    canAccessPlan,
    requireAuth,
    checkAuthAndPlan,
    redirectToAuthWithReturn,
    redirectToPricingWithMessage,
  };
};

export default useRequireAuth;
