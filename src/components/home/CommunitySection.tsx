import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Users, Plus, ChevronRight } from "lucide-react";
import StoryAvatar, { StoryUser } from "./community/StoryAvatar";
import ActivityFeedItem, { ActivityItem } from "./community/ActivityFeedItem";

// Mock data for stories
const mockStoryUsers: StoryUser[] = [
  { id: "1", username: "gamer_pro", avatar: "", hasUnseenStory: true, plan: "scale" },
  { id: "2", username: "playbay", avatar: "", hasUnseenStory: true, plan: "growth" },
  { id: "3", username: "galaxia_x", avatar: "", hasUnseenStory: true, plan: "premium" },
  { id: "4", username: "gift_master", avatar: "", hasUnseenStory: false, plan: "free" },
  { id: "5", username: "crypto_win", avatar: "", hasUnseenStory: true, plan: "growth" },
  { id: "6", username: "lucky_star", avatar: "", hasUnseenStory: false, plan: "free" },
  { id: "7", username: "top_gamer", avatar: "", hasUnseenStory: true, plan: "scale" },
  { id: "8", username: "ninja_play", avatar: "", hasUnseenStory: true, plan: "premium" },
];

// Mock data for activity feed
const mockActivities: ActivityItem[] = [
  {
    id: "a1",
    userId: "1",
    username: "gamer_pro",
    avatar: "",
    type: "points",
    description: "ganó",
    target: "Campaña Navidad",
    points: 500,
    timestamp: new Date(Date.now() - 2 * 60 * 1000), // 2 min ago
  },
  {
    id: "a2",
    userId: "2",
    username: "playbay",
    avatar: "",
    type: "ranking",
    description: "alcanzó el Top 10 en",
    target: "Rankings Globales",
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 min ago
  },
  {
    id: "a3",
    userId: "3",
    username: "galaxia_x",
    avatar: "",
    type: "mission",
    description: "completó la misión",
    target: "Dragon Slayer",
    timestamp: new Date(Date.now() - 10 * 60 * 1000), // 10 min ago
  },
  {
    id: "a4",
    userId: "5",
    username: "crypto_win",
    avatar: "",
    type: "achievement",
    description: "desbloqueó el logro",
    target: "Primer Millón",
    timestamp: new Date(Date.now() - 18 * 60 * 1000), // 18 min ago
  },
  {
    id: "a5",
    userId: "7",
    username: "top_gamer",
    avatar: "",
    type: "game",
    description: "jugó 10 partidas en",
    target: "Trivia Champions",
    timestamp: new Date(Date.now() - 32 * 60 * 1000), // 32 min ago
  },
];

const CommunitySection = () => {
  const [storyUsers, setStoryUsers] = useState<StoryUser[]>(mockStoryUsers);

  const handleStoryView = (userId: string) => {
    setStoryUsers((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, hasUnseenStory: false } : user
      )
    );
    // In a real app, this would open a story modal/viewer
  };

  return (
    <section className="py-8 px-4">
      <div className="container">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-lg font-semibold text-foreground">
                Legendaryum Community
              </h2>
              <Users className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              La comunidad más activa del gaming
            </p>
          </div>
        </div>

        {/* Stories horizontal scroll */}
        <div className="mb-8">
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {storyUsers.map((user) => (
              <StoryAvatar
                key={user.id}
                user={user}
                onView={handleStoryView}
              />
            ))}

            {/* View more button */}
            <div className="flex flex-col items-center justify-start min-w-[72px]">
              <Button
                variant="outline"
                size="icon"
                className="h-14 w-14 rounded-full border-dashed border-muted-foreground/50 hover:border-primary hover:bg-primary/10"
              >
                <Plus className="h-6 w-6 text-muted-foreground" />
              </Button>
              <span className="text-xs text-muted-foreground mt-2">Ver más</span>
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-foreground">
              Actividad Reciente
            </h3>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground hover:text-primary"
            >
              Ver todo
              <ChevronRight className="h-3 w-3 ml-1" />
            </Button>
          </div>

          <div className="space-y-2">
            {mockActivities.slice(0, 4).map((activity, index) => (
              <ActivityFeedItem
                key={activity.id}
                activity={activity}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;
