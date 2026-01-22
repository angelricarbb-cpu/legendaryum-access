import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Plus } from "lucide-react";

interface CommunityUser {
  id: string;
  username: string;
  avatar?: string;
  isFollowing: boolean;
}

const mockUsers: CommunityUser[] = [
  { id: "1", username: "gamer_fan...", avatar: "", isFollowing: false },
  { id: "2", username: "playbay...", avatar: "", isFollowing: false },
  { id: "3", username: "galaxia mon...", avatar: "", isFollowing: true },
  { id: "4", username: "gift-tk ama...", avatar: "", isFollowing: false },
  { id: "5", username: "giftury_tod...", avatar: "", isFollowing: false },
  { id: "6", username: "gift-tk pod...", avatar: "", isFollowing: true },
  { id: "7", username: "giftards den...", avatar: "", isFollowing: false },
];

const CommunitySection = () => {
  const [users, setUsers] = useState<CommunityUser[]>(mockUsers);

  const toggleFollow = (userId: string) => {
    setUsers(prev => 
      prev.map(user => 
        user.id === userId 
          ? { ...user, isFollowing: !user.isFollowing }
          : user
      )
    );
  };

  return (
    <section className="py-8 px-4">
      <div className="container">
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <h2 className="text-lg font-semibold text-foreground">Legendaryum Community</h2>
          <Users className="h-5 w-5 text-muted-foreground" />
        </div>

        {/* Users horizontal scroll */}
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex-shrink-0 flex flex-col items-center gap-2 min-w-[80px]"
            >
              <Avatar className="h-14 w-14 border-2 border-border">
                <AvatarImage src={user.avatar} alt={user.username} />
                <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 text-sm font-medium">
                  {user.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground text-center truncate w-full max-w-[80px]">
                {user.username}
              </span>
              <Button
                size="sm"
                variant={user.isFollowing ? "secondary" : "default"}
                className="h-7 text-xs px-3 rounded-full"
                onClick={() => toggleFollow(user.id)}
              >
                {user.isFollowing ? "Following" : "Follow"}
              </Button>
            </div>
          ))}

          {/* View more button */}
          <div className="flex-shrink-0 flex flex-col items-center justify-center min-w-[80px]">
            <Button
              variant="outline"
              size="icon"
              className="h-14 w-14 rounded-full border-dashed"
            >
              <Plus className="h-6 w-6" />
            </Button>
            <span className="text-xs text-muted-foreground mt-2">View all</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;
