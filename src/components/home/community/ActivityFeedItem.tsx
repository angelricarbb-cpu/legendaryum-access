import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Target, Gamepad2, Award, Coins } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";

export interface ActivityItem {
  id: string;
  userId: string;
  username: string;
  avatar?: string;
  type: "points" | "ranking" | "mission" | "game" | "achievement";
  description: string;
  target?: string;
  points?: number;
  timestamp: Date;
}

interface ActivityFeedItemProps {
  activity: ActivityItem;
  index: number;
}

const activityIcons = {
  points: { icon: Coins, colorClass: "text-yellow-500" },
  ranking: { icon: Trophy, colorClass: "text-orange-500" },
  mission: { icon: Target, colorClass: "text-blue-500" },
  game: { icon: Gamepad2, colorClass: "text-green-500" },
  achievement: { icon: Award, colorClass: "text-purple-500" },
};

const ActivityFeedItem = ({ activity, index }: ActivityFeedItemProps) => {
  const { icon: Icon, colorClass } = activityIcons[activity.type];

  const timeAgo = formatDistanceToNow(activity.timestamp, {
    addSuffix: false,
    locale: es,
  });

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-3 rounded-lg bg-card/50 border border-border/50 hover:bg-card hover:border-border transition-all",
        "animate-fade-in"
      )}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Avatar */}
      <Avatar className="h-9 w-9 flex-shrink-0">
        <AvatarImage src={activity.avatar} alt={activity.username} />
        <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 text-xs">
          {activity.username.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm">
          <span className="font-semibold text-foreground">@{activity.username}</span>
          <span className="text-muted-foreground"> {activity.description}</span>
          {activity.target && (
            <span className="font-medium text-primary"> {activity.target}</span>
          )}
          {activity.points && (
            <span className="font-semibold text-yellow-500"> +{activity.points} pts</span>
          )}
        </p>
      </div>

      {/* Icon and time */}
      <div className="flex flex-col items-end gap-1 flex-shrink-0">
        <Icon className={cn("h-4 w-4", colorClass)} />
        <span className="text-[10px] text-muted-foreground whitespace-nowrap">
          {timeAgo}
        </span>
      </div>
    </div>
  );
};

export default ActivityFeedItem;
