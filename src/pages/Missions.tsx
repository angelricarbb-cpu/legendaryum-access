import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MissionCard, { Mission, MissionFilterStatus, PlanType } from "@/components/missions/MissionCard";
import MissionInfoModal from "@/components/missions/MissionInfoModal";
import TermsModal from "@/components/onboarding/TermsModal";
import ProfileCompletionModal from "@/components/onboarding/ProfileCompletionModal";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Target, Sparkles, Trophy, Zap } from "lucide-react";
import { toast } from "sonner";

// Mock data for missions
const mockMissions: Mission[] = [
  // Available missions
  {
    id: "m1",
    title: "Rolling Route Challenge",
    description: "Complete the route collecting all the balls in the shortest time possible.",
    logo: "",
    brandName: "Legendaryum",
    completedCount: 1,
    maxParticipants: 2,
    timeToComplete: 0,
    startDate: new Date("2025-05-26"),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    status: "available",
    hasCode: true,
    requiredPlan: "all",
    hasCompleted: false,
    reward: "Exclusive Discount Code",
    rewardType: "code",
  },
  {
    id: "m2",
    title: "Speed Runner Mission",
    description: "Beat the clock and achieve the fastest completion time to unlock rewards.",
    logo: "",
    brandName: "REDVOLT LIMIT",
    completedCount: 45,
    maxParticipants: 100,
    timeToComplete: 120, // 2 minutes
    startDate: new Date(),
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    status: "available",
    hasCode: true,
    requiredPlan: "all",
    hasCompleted: false,
    reward: "15% Off Coupon",
    rewardType: "code",
  },
  {
    id: "m3",
    title: "Premium Quest",
    description: "Exclusive premium mission with enhanced rewards and unique challenges.",
    logo: "",
    brandName: "PREMIUM GAMES",
    completedCount: 12,
    maxParticipants: 50,
    timeToComplete: 300, // 5 minutes
    startDate: new Date(),
    endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    status: "available",
    hasCode: true,
    requiredPlan: "premium",
    hasCompleted: false,
    reward: "$50 Amazon Gift Card",
    rewardType: "item",
  },
  {
    id: "m4",
    title: "Community Challenge",
    description: "Free mission open to all players. Complete objectives to earn community points.",
    logo: "",
    brandName: "COMMUNITY GAMING",
    completedCount: 180,
    maxParticipants: 500,
    timeToComplete: 60, // 1 minute
    startDate: new Date(),
    endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    status: "available",
    hasCode: false,
    requiredPlan: "all",
    hasCompleted: false,
    reward: "Community Badge",
    rewardType: "item",
  },
  // Finished missions
  {
    id: "m5",
    title: "Winter Quest 2024",
    description: "A seasonal mission that challenged players to complete winter-themed objectives.",
    logo: "",
    brandName: "FROST GAMING",
    completedCount: 200,
    maxParticipants: 200,
    timeToComplete: 180,
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    status: "finished",
    hasCode: true,
    requiredPlan: "all",
    hasCompleted: false,
    reward: "Winter 20% Off",
    rewardType: "code",
  },
  // Completed missions (by user)
  {
    id: "m6",
    title: "Intro Mission",
    description: "Your first mission to learn the basics of the platform.",
    logo: "",
    brandName: "TUTORIAL",
    completedCount: 1500,
    maxParticipants: 10000,
    timeToComplete: 30,
    startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    status: "completed",
    hasCode: false,
    requiredPlan: "all",
    hasCompleted: true,
    reward: "Welcome Badge",
    rewardType: "item",
  },
  // Coming soon missions
  {
    id: "m7",
    title: "Summer Sprint",
    description: "Get ready for the ultimate summer challenge with exclusive rewards!",
    logo: "",
    brandName: "BEACH BLITZ",
    completedCount: 0,
    maxParticipants: 1000,
    timeToComplete: 240,
    startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    status: "coming_soon",
    hasCode: true,
    requiredPlan: "all",
    hasCompleted: false,
    reward: "Summer Pass",
    rewardType: "item",
  },
  {
    id: "m8",
    title: "VIP Mission",
    description: "Premium-only mission with the highest tier rewards available.",
    logo: "",
    brandName: "VIP LEAGUE",
    completedCount: 0,
    maxParticipants: 100,
    timeToComplete: 600,
    startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
    status: "coming_soon",
    hasCode: true,
    requiredPlan: "premium",
    hasCompleted: false,
    reward: "$200 Gift Card",
    rewardType: "item",
  },
];

const filterTabs: { key: MissionFilterStatus; label: string }[] = [
  { key: "available", label: "Available" },
  { key: "finished", label: "Finished" },
  { key: "completed", label: "Completed" },
  { key: "coming_soon", label: "Coming soon" },
];

const Missions = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user, acceptTerms, completeProfile } = useAuth();
  const [activeFilter, setActiveFilter] = useState<MissionFilterStatus>("available");
  
  // Modal states
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  
  // Onboarding modal states
  const [termsModalOpen, setTermsModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [pendingMissionId, setPendingMissionId] = useState<string | null>(null);

  const filteredMissions = mockMissions.filter((m) => m.status === activeFilter);

  const handleStart = (missionId: string) => {
    if (!isLoggedIn) {
      toast.error("Por favor, inicia sesión para comenzar una misión");
      return;
    }

    // Check if user has accepted terms
    if (!user?.hasAcceptedTerms) {
      setPendingMissionId(missionId);
      setTermsModalOpen(true);
      return;
    }

    // Check if user has completed profile
    if (!user?.hasCompletedProfile) {
      setPendingMissionId(missionId);
      setProfileModalOpen(true);
      return;
    }

    // All checks passed, navigate to game
    navigate(`/game/${missionId}`);
  };

  const handleTermsAccepted = () => {
    acceptTerms();
    setTermsModalOpen(false);
    
    // Now check if profile is complete
    if (!user?.hasCompletedProfile) {
      setProfileModalOpen(true);
    } else if (pendingMissionId) {
      navigate(`/game/${pendingMissionId}`);
      setPendingMissionId(null);
    }
  };

  const handleProfileCompleted = (profile: typeof user extends null ? never : NonNullable<typeof user>['profile']) => {
    if (profile) {
      completeProfile(profile);
    }
    setProfileModalOpen(false);
    
    // Navigate to the pending mission
    if (pendingMissionId) {
      navigate(`/game/${pendingMissionId}`);
      setPendingMissionId(null);
    }
  };

  const handleViewInfo = (missionId: string) => {
    const mission = mockMissions.find(m => m.id === missionId);
    if (mission) {
      setSelectedMission(mission);
      setInfoModalOpen(true);
    }
  };

  const handleUpgrade = () => {
    navigate("/pricing");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header 
        isLoggedIn={isLoggedIn} 
        user={user ? { name: user.name, username: user.username, avatar: user.avatar } : undefined} 
      />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-12 lg:py-20">
          <div className="container">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
              <button onClick={() => navigate("/")} className="hover:text-foreground transition-colors">
                Home
              </button>
              <span>&gt;</span>
              <span className="text-foreground">Missions</span>
            </nav>

            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
              {/* Hero Image */}
              <div className="relative w-full lg:w-1/2 max-w-lg">
                <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-primary/20 via-purple-500/20 to-pink-500/20 p-1">
                  <div className="w-full h-full rounded-xl bg-gradient-to-br from-primary/30 to-purple-900/50 flex items-center justify-center relative overflow-hidden">
                    {/* Decorative elements */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(var(--primary),0.3),transparent_50%)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.3),transparent_50%)]" />
                    
                    {/* Central icon */}
                    <div className="relative z-10 flex flex-col items-center gap-4">
                      <div className="bg-gradient-to-br from-primary to-purple-600 p-6 rounded-2xl shadow-2xl">
                        <Target className="h-16 w-16 text-white" />
                      </div>
                      <div className="flex gap-3">
                        <div className="bg-amber-500/20 p-2 rounded-full">
                          <Trophy className="h-6 w-6 text-amber-500" />
                        </div>
                        <div className="bg-green-500/20 p-2 rounded-full">
                          <Sparkles className="h-6 w-6 text-green-500" />
                        </div>
                        <div className="bg-blue-500/20 p-2 rounded-full">
                          <Zap className="h-6 w-6 text-blue-500" />
                        </div>
                      </div>
                    </div>

                    {/* Floating coins/elements animation */}
                    <div className="absolute top-4 left-4 w-8 h-8 bg-amber-400 rounded-full animate-pulse opacity-60" />
                    <div className="absolute top-8 right-8 w-6 h-6 bg-purple-400 rounded-full animate-pulse opacity-60 delay-300" />
                    <div className="absolute bottom-6 left-8 w-4 h-4 bg-green-400 rounded-full animate-pulse opacity-60 delay-500" />
                  </div>
                </div>
              </div>

              {/* Hero Text */}
              <div className="flex-1 text-center lg:text-left">
                <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground mb-4 leading-tight">
                  Complete interactive{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">
                    missions
                  </span>{" "}
                  and digital challenges designed to boost participation and engagement.
                </h1>
                <p className="text-lg text-muted-foreground max-w-xl">
                  Missions guide users through structured objectives and activities within digital experiences. 
                  Complete them once to unlock exclusive rewards!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Filter & Grid Section */}
        <section className="py-8 lg:py-12">
          <div className="container">
            {/* Filter Tabs */}
            <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
              {filterTabs.map((tab) => (
                <Button
                  key={tab.key}
                  variant={activeFilter === tab.key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveFilter(tab.key)}
                  className={`rounded-full px-4 whitespace-nowrap ${
                    activeFilter === tab.key 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-transparent border-border hover:bg-secondary"
                  }`}
                >
                  {tab.label}
                </Button>
              ))}
            </div>

            {/* Mission Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
              {filteredMissions.map((mission) => (
                <MissionCard
                  key={mission.id}
                  mission={mission}
                  userPlan={user?.subscription?.plan as PlanType || "free"}
                  onStart={handleStart}
                  onViewInfo={handleViewInfo}
                  onUpgrade={handleUpgrade}
                />
              ))}
            </div>

            {/* Empty state */}
            {filteredMissions.length === 0 && (
              <div className="text-center py-16">
                <Target className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No missions found</h3>
                <p className="text-muted-foreground">
                  There are no {activeFilter.replace("_", " ")} missions at the moment.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />

      {/* Modals */}
      <MissionInfoModal
        mission={selectedMission}
        open={infoModalOpen}
        onOpenChange={setInfoModalOpen}
        onStart={handleStart}
        userPlan={user?.subscription?.plan as PlanType || "free"}
      />

      <TermsModal 
        isOpen={termsModalOpen} 
        onClose={() => setTermsModalOpen(false)}
        onAccept={handleTermsAccepted}
      />
      
      <ProfileCompletionModal 
        isOpen={profileModalOpen} 
        onClose={() => setProfileModalOpen(false)}
        onComplete={handleProfileCompleted}
      />
    </div>
  );
};

export default Missions;