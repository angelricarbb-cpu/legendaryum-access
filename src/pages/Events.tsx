import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import EventCampaignCard, { EventCampaign, EventFilterStatus, PlanType } from "@/components/events/EventCampaignCard";
import TopPositionsModal from "@/components/rankings/TopPositionsModal";
import CampaignInfoModal from "@/components/rankings/CampaignInfoModal";
import TermsModal from "@/components/onboarding/TermsModal";
import ProfileCompletionModal from "@/components/onboarding/ProfileCompletionModal";
import TicketPaymentModal from "@/components/events/TicketPaymentModal";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowUpDown, Calendar, Gamepad2, Gift, Sparkles, Ticket } from "lucide-react";
import { toast } from "sonner";

// Mock data for events
const mockEvents: EventCampaign[] = [
  // Available events
  {
    id: "e1",
    title: "Gaming Festival 2024",
    logo: "",
    brandName: "MEGA EVENTS",
    topPlayers: [
      { position: 1, username: "@FestivalKing", points: 350000 },
      { position: 2, username: "@PartyGamer", points: 280000 },
      { position: 3, username: "@EventMaster", points: 220000 },
    ],
    myPosition: null,
    myPoints: 0,
    totalPlayers: 1500,
    maxPlayers: 5000,
    hasPlayed: false,
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    status: "available",
    hasCode: true,
    requiredPlan: "all",
    bonusLevel: {
      gamesRequired: 5,
      reward: "15% Event Discount Code",
      rewardType: "code",
    },
    specialReward: {
      gamesRequired: 15,
      reward: "$100 Amazon Gift Card",
      rewardType: "item",
    },
    ticketPrice: 9.99,
    hasTicket: true,
  },
  {
    id: "e2",
    title: "VIP Exclusive Night",
    logo: "",
    brandName: "PREMIUM EVENTS",
    topPlayers: [
      { position: 1, username: "@VIPPlayer", points: 500000 },
      { position: 2, username: "@EliteGamer", points: 450000 },
    ],
    myPosition: 3,
    myPoints: 380000,
    totalPlayers: 200,
    maxPlayers: 500,
    hasPlayed: true,
    startDate: new Date(),
    endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    status: "available",
    hasCode: false,
    requiredPlan: "premium",
    bonusLevel: {
      gamesRequired: 3,
      reward: "25% VIP Discount",
      rewardType: "code",
    },
    specialReward: {
      gamesRequired: 10,
      reward: "$150 Visa Gift Card",
      rewardType: "item",
    },
    ticketPrice: 29.99,
    hasTicket: true,
  },
  // Ongoing events
  {
    id: "e3",
    title: "Championship Finals",
    logo: "",
    brandName: "ESPORTS LEAGUE",
    topPlayers: [
      { position: 1, username: "@Champion", points: 750000 },
      { position: 2, username: "@RunnerUp", points: 680000 },
    ],
    myPosition: 8,
    myPoints: 450000,
    totalPlayers: 800,
    maxPlayers: 1000,
    hasPlayed: true,
    startDate: new Date(),
    endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    status: "ongoing",
    hasCode: true,
    requiredPlan: "all",
    bonusLevel: {
      gamesRequired: 8,
      reward: "30% Championship Code",
      rewardType: "code",
    },
    specialReward: {
      gamesRequired: 20,
      reward: "$200 Steam Gift Card",
      rewardType: "item",
    },
    ticketPrice: 19.99,
    hasTicket: true,
  },
  // Finished events
  {
    id: "e4",
    title: "Winter Gala 2024",
    logo: "",
    brandName: "FROST EVENTS",
    topPlayers: [
      { position: 1, username: "@WinterChamp", points: 600000 },
      { position: 2, username: "@SnowQueen", points: 550000 },
      { position: 3, username: "@IceKing", points: 500000 },
    ],
    myPosition: 12,
    myPoints: 350000,
    totalPlayers: 2000,
    maxPlayers: 2000,
    hasPlayed: true,
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    status: "finished",
    hasCode: true,
    requiredPlan: "all",
    bonusLevel: {
      gamesRequired: 6,
      reward: "Winter 20% Off Code",
      rewardType: "code",
    },
    specialReward: {
      gamesRequired: 15,
      reward: "$75 PlayStation Gift Card",
      rewardType: "item",
    },
    ticketPrice: 14.99,
    hasTicket: true,
  },
  // Coming soon events - Ticket purchase phase
  {
    id: "e5",
    title: "Summer Music Festival",
    logo: "",
    brandName: "BEACH EVENTS",
    topPlayers: [],
    myPosition: null,
    myPoints: 0,
    totalPlayers: 0,
    maxPlayers: 10000,
    hasPlayed: false,
    startDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
    status: "coming_soon",
    hasCode: false,
    requiredPlan: "all",
    bonusLevel: {
      gamesRequired: 5,
      reward: "Summer 25% Off Code",
      rewardType: "code",
    },
    specialReward: {
      gamesRequired: 12,
      reward: "$50 Spotify Gift Card",
      rewardType: "item",
    },
    ticketPrice: 12.99,
    hasTicket: false,
  },
  {
    id: "e6",
    title: "VIP Premiere Event",
    logo: "",
    brandName: "EXCLUSIVE CLUB",
    topPlayers: [],
    myPosition: null,
    myPoints: 0,
    totalPlayers: 0,
    maxPlayers: 500,
    hasPlayed: false,
    startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    status: "coming_soon",
    hasCode: true,
    requiredPlan: "premium",
    bonusLevel: {
      gamesRequired: 4,
      reward: "VIP 40% Discount",
      rewardType: "code",
    },
    specialReward: {
      gamesRequired: 10,
      reward: "$300 MasterCard Gift Card",
      rewardType: "item",
    },
    ticketPrice: 49.99,
    hasTicket: false,
  },
  {
    id: "e7",
    title: "Retro Gaming Night",
    logo: "",
    brandName: "NOSTALGIA GAMING",
    topPlayers: [],
    myPosition: null,
    myPoints: 0,
    totalPlayers: 0,
    maxPlayers: 2000,
    hasPlayed: false,
    startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    status: "coming_soon",
    hasCode: false,
    requiredPlan: "all",
    bonusLevel: {
      gamesRequired: 6,
      reward: "Retro 15% Discount",
      rewardType: "code",
    },
    specialReward: {
      gamesRequired: 14,
      reward: "$40 Nintendo eShop Gift Card",
      rewardType: "item",
    },
    ticketPrice: 7.99,
    hasTicket: true, // Already purchased
  },
];

const filterTabs: { key: EventFilterStatus; label: string }[] = [
  { key: "available", label: "Available" },
  { key: "ongoing", label: "Ongoing" },
  { key: "finished", label: "Finished" },
  { key: "coming_soon", label: "Coming soon" },
];

const Events = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user, acceptTerms, completeProfile } = useAuth();
  const [activeFilter, setActiveFilter] = useState<EventFilterStatus>("available");
  const [events, setEvents] = useState<EventCampaign[]>(mockEvents);
  
  // Modal states
  const [topPositionsModalOpen, setTopPositionsModalOpen] = useState(false);
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<EventCampaign | null>(null);
  
  // Onboarding modal states
  const [termsModalOpen, setTermsModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [pendingCampaignId, setPendingCampaignId] = useState<string | null>(null);
  
  // Ticket payment modal states
  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const [selectedTicketEvent, setSelectedTicketEvent] = useState<EventCampaign | null>(null);

  const filteredEvents = events.filter((e) => e.status === activeFilter);

  const handleJoin = (campaignId: string) => {
    if (!isLoggedIn) {
      toast.error("Por favor, inicia sesión para unirte a un evento");
      return;
    }

    const event = events.find(e => e.id === campaignId);
    if (!event?.hasTicket) {
      toast.error("Necesitas un ticket para unirte a este evento");
      return;
    }

    // Check if user has accepted terms
    if (!user?.hasAcceptedTerms) {
      setPendingCampaignId(campaignId);
      setTermsModalOpen(true);
      return;
    }

    // Check if user has completed profile
    if (!user?.hasCompletedProfile) {
      setPendingCampaignId(campaignId);
      setProfileModalOpen(true);
      return;
    }

    // All checks passed, navigate to game
    navigate(`/game/${campaignId}`);
  };

  const handleBuyTicket = (campaignId: string) => {
    if (!isLoggedIn) {
      toast.error("Por favor, inicia sesión para comprar un ticket");
      navigate("/auth");
      return;
    }

    const event = events.find(e => e.id === campaignId);
    if (event) {
      setSelectedTicketEvent(event);
      setTicketModalOpen(true);
    }
  };

  const handleTicketPaymentSuccess = () => {
    if (selectedTicketEvent) {
      // Update the event to mark ticket as purchased
      setEvents(prevEvents => 
        prevEvents.map(event => 
          event.id === selectedTicketEvent.id 
            ? { ...event, hasTicket: true }
            : event
        )
      );
      toast.success("¡Ticket comprado exitosamente! Estarás listo cuando el evento comience.");
    }
    setSelectedTicketEvent(null);
  };

  const handleTermsAccepted = () => {
    acceptTerms();
    setTermsModalOpen(false);
    
    // Now check if profile is complete
    if (!user?.hasCompletedProfile) {
      setProfileModalOpen(true);
    } else if (pendingCampaignId) {
      navigate(`/game/${pendingCampaignId}`);
      setPendingCampaignId(null);
    }
  };

  const handleProfileCompleted = (profile: typeof user extends null ? never : NonNullable<typeof user>['profile']) => {
    if (profile) {
      completeProfile(profile);
    }
    setProfileModalOpen(false);
    
    // Navigate to the pending campaign
    if (pendingCampaignId) {
      navigate(`/game/${pendingCampaignId}`);
      setPendingCampaignId(null);
    }
  };

  const handleContinue = (campaignId: string) => {
    navigate(`/game/${campaignId}`);
  };

  const handleViewTopPositions = (campaignId: string) => {
    const event = events.find(e => e.id === campaignId);
    if (event) {
      setSelectedCampaign(event);
      setTopPositionsModalOpen(true);
    }
  };

  const handleViewInfo = (campaignId: string) => {
    const event = events.find(e => e.id === campaignId);
    if (event) {
      setSelectedCampaign(event);
      setInfoModalOpen(true);
    }
  };

  const handleOpenInfoFromTopPositions = () => {
    setTopPositionsModalOpen(false);
    setInfoModalOpen(true);
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
            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
              {/* Hero Image */}
              <div className="relative w-full lg:w-1/2 max-w-lg">
                <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-rose-500/20 p-1">
                  <div className="w-full h-full rounded-xl bg-gradient-to-br from-purple-900/50 to-pink-900/50 flex items-center justify-center relative overflow-hidden">
                    {/* Decorative elements */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="grid grid-cols-3 gap-4 p-8">
                        <div className="w-12 h-12 bg-purple-500/30 rounded-lg animate-pulse" />
                        <Calendar className="w-12 h-12 text-purple-500" />
                        <div className="w-12 h-12 bg-pink-500/30 rounded-lg animate-pulse delay-100" />
                        <Gamepad2 className="w-12 h-12 text-pink-500" />
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                          <Ticket className="w-8 h-8 text-white" />
                        </div>
                        <Sparkles className="w-12 h-12 text-rose-400" />
                        <div className="w-12 h-12 bg-rose-500/30 rounded-lg animate-pulse delay-200" />
                        <Gift className="w-12 h-12 text-amber-400" />
                        <div className="w-12 h-12 bg-amber-500/30 rounded-lg animate-pulse" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hero Content */}
              <div className="flex-1 text-center lg:text-left">
                <h1 className="text-3xl lg:text-5xl font-bold text-foreground leading-tight mb-4">
                  Join exclusive gaming events with ticket-based access
                </h1>
                <p className="text-lg text-muted-foreground max-w-xl">
                  Purchase your ticket during the coming soon phase and be ready to compete when the event goes live. Limited spots, exclusive rewards!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="container">
          <div className="border-t border-border" />
        </div>

        {/* Filters Section */}
        <section className="py-6">
          <div className="container">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              {/* Filter Tabs */}
              <div className="flex flex-wrap gap-2">
                {filterTabs.map((tab) => (
                  <Button
                    key={tab.key}
                    variant={activeFilter === tab.key ? "default" : "secondary"}
                    size="sm"
                    onClick={() => setActiveFilter(tab.key)}
                    className={`rounded-full px-5 ${
                      activeFilter === tab.key 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {tab.label}
                  </Button>
                ))}
              </div>

              {/* Sort Button */}
              <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
                Sort by
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* Events Grid */}
        <section className="py-6 pb-12">
          <div className="container">
            {filteredEvents.length === 0 ? (
              <div className="text-center py-12">
                <Ticket className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No events found</h3>
                <p className="text-muted-foreground">
                  {activeFilter === "coming_soon" 
                    ? "Check back soon for upcoming events!"
                    : `No ${activeFilter.replace("_", " ")} events at the moment.`
                  }
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredEvents.map((event) => (
              <EventCampaignCard
                key={event.id}
                campaign={event}
                userPlan={user?.subscription?.plan || "free"}
                onJoin={handleJoin}
                onContinue={handleContinue}
                onViewTopPositions={handleViewTopPositions}
                onViewInfo={handleViewInfo}
                onUpgrade={() => navigate("/pricing")}
                onBuyTicket={handleBuyTicket}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  </main>

  <Footer />

  {/* Modals */}
  {selectedCampaign && (
    <>
      <TopPositionsModal
        isOpen={topPositionsModalOpen}
        onClose={() => setTopPositionsModalOpen(false)}
        campaign={selectedCampaign as any}
        onOpenInfo={handleOpenInfoFromTopPositions}
        onJoin={handleJoin}
        onContinue={handleContinue}
      />
      <CampaignInfoModal
        isOpen={infoModalOpen}
        onClose={() => setInfoModalOpen(false)}
        campaign={selectedCampaign as any}
      />
    </>
  )}

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

  {selectedTicketEvent && (
    <TicketPaymentModal
      isOpen={ticketModalOpen}
      onClose={() => {
        setTicketModalOpen(false);
        setSelectedTicketEvent(null);
      }}
      eventTitle={selectedTicketEvent.title}
      ticketPrice={selectedTicketEvent.ticketPrice}
      onPaymentSuccess={handleTicketPaymentSuccess}
    />
  )}
</div>
);
};

export default Events;
