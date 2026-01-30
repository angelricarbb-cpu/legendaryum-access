import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export interface StoryUser {
  id: string;
  username: string;
  avatar?: string;
  hasUnseenStory: boolean;
  plan: "free" | "premium" | "growth" | "scale";
}

interface StoryAvatarProps {
  user: StoryUser;
  onView?: (userId: string) => void;
}

const StoryAvatar = ({ user, onView }: StoryAvatarProps) => {
  const [hasViewed, setHasViewed] = useState(!user.hasUnseenStory);

  const handleClick = () => {
    setHasViewed(true);
    onView?.(user.id);
  };

  return (
    <button
      onClick={handleClick}
      className="flex flex-col items-center gap-2 min-w-[72px] group"
    >
      {/* Story ring container */}
      <div
        className={cn(
          "relative p-[3px] rounded-full transition-transform duration-200 group-hover:scale-110",
          hasViewed
            ? "bg-muted"
            : "story-ring-unseen"
        )}
      >
        {/* Inner white/dark border */}
        <div className="p-[2px] rounded-full bg-background">
          <Avatar className="h-14 w-14">
            <AvatarImage src={user.avatar} alt={user.username} />
            <AvatarFallback className="bg-gradient-to-br from-primary/30 to-accent/30 text-sm font-medium">
              {user.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
        
        {/* Plan badge */}
        {user.plan !== "free" && (
          <span
            className={cn(
              "absolute -bottom-0.5 left-1/2 -translate-x-1/2 text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase",
              user.plan === "premium" && "bg-plan-elite text-white",
              user.plan === "growth" && "bg-plan-growth text-white",
              user.plan === "scale" && "bg-plan-scale text-white"
            )}
          >
            {user.plan === "premium" ? "PRO" : user.plan.slice(0, 3)}
          </span>
        )}
      </div>

      {/* Username */}
      <span className="text-xs text-muted-foreground text-center truncate w-full max-w-[72px] group-hover:text-foreground transition-colors">
        {user.username}
      </span>
    </button>
  );
};

export default StoryAvatar;
