import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { UserPlus, UserCheck, Search, Trophy, Target, Gift, Medal } from "lucide-react";
import { cn } from "@/lib/utils";
import StoryAchievementsModal from "@/components/home/community/StoryAchievementsModal";
import { StoryUser } from "@/components/home/community/StoryAvatar";

const allUsers: StoryUser[] = [
  { id: "1", username: "gamer_pro", avatar: "", hasUnseenStory: false, plan: "scale", isFollowed: true },
  { id: "2", username: "playbay", avatar: "", hasUnseenStory: false, plan: "growth", isFollowed: true },
  { id: "3", username: "galaxia_x", avatar: "", hasUnseenStory: false, plan: "premium", isFollowed: false },
  { id: "4", username: "gift_master", avatar: "", hasUnseenStory: false, plan: "free", isFollowed: true },
  { id: "5", username: "crypto_win", avatar: "", hasUnseenStory: false, plan: "growth", isFollowed: false },
  { id: "6", username: "lucky_star", avatar: "", hasUnseenStory: false, plan: "free", isFollowed: false },
  { id: "7", username: "top_gamer", avatar: "", hasUnseenStory: false, plan: "scale", isFollowed: true },
  { id: "8", username: "ninja_play", avatar: "", hasUnseenStory: false, plan: "premium", isFollowed: false },
  { id: "9", username: "dragon_king", avatar: "", hasUnseenStory: false, plan: "growth", isFollowed: false },
  { id: "10", username: "pixel_queen", avatar: "", hasUnseenStory: false, plan: "scale", isFollowed: false },
  { id: "11", username: "star_hunter", avatar: "", hasUnseenStory: false, plan: "free", isFollowed: false },
  { id: "12", username: "cyber_wolf", avatar: "", hasUnseenStory: false, plan: "premium", isFollowed: false },
];

const Community = () => {
  const { isLoggedIn, user } = useAuth();
  const [followedIds, setFollowedIds] = useState<Set<string>>(
    new Set(allUsers.filter(u => u.isFollowed).map(u => u.id))
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<StoryUser | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleToggleFollow = (userId: string) => {
    setFollowedIds(prev => {
      const next = new Set(prev);
      if (next.has(userId)) next.delete(userId);
      else next.add(userId);
      return next;
    });
  };

  const filteredUsers = allUsers.filter(u =>
    u.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const following = filteredUsers.filter(u => followedIds.has(u.id));
  const suggestions = filteredUsers.filter(u => !followedIds.has(u.id));

  const planColors: Record<string, string> = {
    premium: "bg-plan-elite text-white",
    growth: "bg-plan-growth text-white",
    scale: "bg-plan-scale text-white",
  };

  const UserRow = ({ u }: { u: StoryUser }) => (
    <div className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card hover:border-primary/30 transition-all">
      <button onClick={() => { setSelectedUser(u); setShowModal(true); }} className="flex-shrink-0">
        <Avatar className="h-11 w-11 hover:ring-2 ring-primary/50 transition-all">
          <AvatarImage src={u.avatar} alt={u.username} />
          <AvatarFallback className="bg-gradient-to-br from-primary/30 to-accent/30 text-sm font-medium">
            {u.username.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </button>
      <button onClick={() => { setSelectedUser(u); setShowModal(true); }} className="flex-1 min-w-0 text-left">
        <p className="text-sm font-semibold text-foreground truncate">@{u.username}</p>
        {u.plan !== "free" && (
          <Badge className={cn("text-[9px] mt-0.5", planColors[u.plan])}>
            {u.plan.toUpperCase()}
          </Badge>
        )}
      </button>
      <Button
        size="sm"
        variant={followedIds.has(u.id) ? "outline" : "default"}
        onClick={(e) => { e.stopPropagation(); handleToggleFollow(u.id); }}
        className="rounded-full px-4 flex-shrink-0"
      >
        {followedIds.has(u.id) ? (
          <><UserCheck className="h-3.5 w-3.5 mr-1" /> Following</>
        ) : (
          <><UserPlus className="h-3.5 w-3.5 mr-1" /> Follow</>
        )}
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header
        isLoggedIn={isLoggedIn}
        user={user ? { name: user.name, username: user.username, avatar: user.avatar } : undefined}
      />
      <main className="flex-1 py-8 px-4">
        <div className="container max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-foreground mb-1">Comunidad</h1>
          <p className="text-sm text-muted-foreground mb-6">Descubre y sigue a otros jugadores</p>

          {/* Search */}
          <div className="relative mb-8">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar usuario..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Following */}
          {following.length > 0 && (
            <div className="mb-8">
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
                Siguiendo ({following.length})
              </h2>
              <div className="space-y-2">
                {following.map(u => <UserRow key={u.id} u={u} />)}
              </div>
            </div>
          )}

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div>
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
                Sugerencias
              </h2>
              <div className="space-y-2">
                {suggestions.map(u => <UserRow key={u.id} u={u} />)}
              </div>
            </div>
          )}

          {filteredUsers.length === 0 && (
            <p className="text-center text-muted-foreground py-12">No se encontraron usuarios</p>
          )}
        </div>
      </main>
      <Footer />

      <StoryAchievementsModal
        open={showModal}
        onOpenChange={setShowModal}
        user={selectedUser}
        isFollowing={selectedUser ? followedIds.has(selectedUser.id) : false}
        onToggleFollow={handleToggleFollow}
      />
    </div>
  );
};

export default Community;
