import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import RankingCampaignCard, { RankingCampaign, CampaignFilterStatus } from "@/components/rankings/RankingCampaignCard";
import TopPositionsModal from "@/components/rankings/TopPositionsModal";
import CampaignInfoModal from "@/components/rankings/CampaignInfoModal";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowUpDown, Trophy, Gamepad2, Gift, Sparkles } from "lucide-react";
import { toast } from "sonner";

// Mock data for campaigns
const mockCampaigns: RankingCampaign[] = [
  {
    id: "1",
    title: "Turbo Jet Challenge",
    logo: "",
    brandName: "REDVOLT LIMIT",
    topPlayers: [
      { position: 1, username: "@red-yoda-thai", points: 249081 },
      { position: 2, username: "@MiguelLegend", points: 442 },
    ],
    myPosition: null,
    myPoints: 0,
    totalPlayers: 2,
    maxPlayers: 10000,
    hasPlayed: false,
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    status: "available",
    hasCode: true,
  },
  {
    id: "2",
    title: "Moto Speed Challenge",
    logo: "",
    brandName: "REDVOLT LIMIT",
    topPlayers: [
      { position: 1, username: "@red-yoda-thai", points: 55088 },
      { position: 2, username: "@LegendAR11", points: 20622 },
      { position: 3, username: "@MiguelLegend", points: 5525 },
    ],
    myPosition: 2,
    myPoints: 20622,
    totalPlayers: 3,
    maxPlayers: 10000,
    hasPlayed: true,
    startDate: new Date(),
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    status: "available",
    hasCode: true,
  },
  {
    id: "3",
    title: "Space Raiders Tournament",
    logo: "",
    brandName: "COSMIC GAMES",
    topPlayers: [
      { position: 1, username: "@StarPlayer", points: 150000 },
      { position: 2, username: "@GalaxyKing", points: 120000 },
    ],
    myPosition: 5,
    myPoints: 85000,
    totalPlayers: 50,
    maxPlayers: 5000,
    hasPlayed: true,
    startDate: new Date(),
    endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    status: "ongoing",
    hasCode: false,
  },
  {
    id: "4",
    title: "Winter Challenge 2024",
    logo: "",
    brandName: "FROST GAMING",
    topPlayers: [
      { position: 1, username: "@IceQueen", points: 500000 },
      { position: 2, username: "@SnowRider", points: 450000 },
      { position: 3, username: "@FrostByte", points: 400000 },
    ],
    myPosition: 15,
    myPoints: 125000,
    totalPlayers: 1200,
    maxPlayers: 2000,
    hasPlayed: true,
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    status: "finished",
    hasCode: true,
  },
  {
    id: "5",
    title: "Summer Splash Showdown",
    logo: "",
    brandName: "BEACH BLITZ",
    topPlayers: [],
    myPosition: null,
    myPoints: 0,
    totalPlayers: 0,
    maxPlayers: 15000,
    hasPlayed: false,
    startDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
    status: "coming_soon",
    hasCode: false,
  },
];

const filterTabs: { key: CampaignFilterStatus; label: string }[] = [
  { key: "available", label: "Available" },
  { key: "ongoing", label: "Ongoing" },
  { key: "finished", label: "Finished" },
  { key: "coming_soon", label: "Coming soon" },
];

const Rankings = () => {
  const { isLoggedIn, user } = useAuth();
  const [activeFilter, setActiveFilter] = useState<CampaignFilterStatus>("available");
  
  // Modal states
  const [topPositionsModalOpen, setTopPositionsModalOpen] = useState(false);
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<RankingCampaign | null>(null);

  const filteredCampaigns = mockCampaigns.filter((c) => c.status === activeFilter);

  const handleJoin = (campaignId: string) => {
    if (!isLoggedIn) {
      toast.error("Please login to join a campaign");
      return;
    }
    toast.success("Joining campaign...");
  };

  const handleContinue = (campaignId: string) => {
    toast.info("Continuing campaign...");
  };

  const handleViewTopPositions = (campaignId: string) => {
    const campaign = mockCampaigns.find(c => c.id === campaignId);
    if (campaign) {
      setSelectedCampaign(campaign);
      setTopPositionsModalOpen(true);
    }
  };

  const handleViewInfo = (campaignId: string) => {
    const campaign = mockCampaigns.find(c => c.id === campaignId);
    if (campaign) {
      setSelectedCampaign(campaign);
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
                <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-amber-500/20 via-yellow-500/20 to-orange-500/20 p-1">
                  <div className="w-full h-full rounded-xl bg-gradient-to-br from-amber-900/50 to-orange-900/50 flex items-center justify-center relative overflow-hidden">
                    {/* Decorative elements */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="grid grid-cols-3 gap-4 p-8">
                        <div className="w-12 h-12 bg-yellow-500/30 rounded-lg animate-pulse" />
                        <Trophy className="w-12 h-12 text-yellow-500" />
                        <div className="w-12 h-12 bg-amber-500/30 rounded-lg animate-pulse delay-100" />
                        <Gamepad2 className="w-12 h-12 text-purple-500" />
                        <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-xl flex items-center justify-center">
                          <Gift className="w-8 h-8 text-white" />
                        </div>
                        <Sparkles className="w-12 h-12 text-blue-400" />
                        <div className="w-12 h-12 bg-purple-500/30 rounded-lg animate-pulse delay-200" />
                        <div className="w-12 h-12 bg-blue-500/30 rounded-lg animate-pulse delay-300" />
                        <div className="w-12 h-12 bg-green-500/30 rounded-lg animate-pulse" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hero Content */}
              <div className="flex-1 text-center lg:text-left">
                <h1 className="text-3xl lg:text-5xl font-bold text-foreground leading-tight mb-4">
                  Participate in interactive ranking experience, track your progress, compare performance
                </h1>
                <p className="text-lg text-muted-foreground max-w-xl">
                  Rankings are based on gameplay activity and participation. Join an active ranking and see how you perform in real time.
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

        {/* Campaigns List */}
        <section className="pb-12">
          <div className="container">
            <div className="space-y-4">
              {filteredCampaigns.length > 0 ? (
                filteredCampaigns.map((campaign) => (
                  <RankingCampaignCard
                    key={campaign.id}
                    campaign={campaign}
                    onJoin={handleJoin}
                    onContinue={handleContinue}
                    onViewTopPositions={handleViewTopPositions}
                    onViewInfo={handleViewInfo}
                  />
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No campaigns found in this category.</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Modals */}
      <TopPositionsModal
        isOpen={topPositionsModalOpen}
        onClose={() => setTopPositionsModalOpen(false)}
        campaign={selectedCampaign}
        onOpenInfo={handleOpenInfoFromTopPositions}
        onJoin={handleJoin}
        onContinue={handleContinue}
      />

      <CampaignInfoModal
        isOpen={infoModalOpen}
        onClose={() => setInfoModalOpen(false)}
        campaign={selectedCampaign}
      />
    </div>
  );
};

export default Rankings;
