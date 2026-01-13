import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { 
  Users, TrendingUp, Clock, Trophy, Target, BarChart3, 
  Download, FileText, FileSpreadsheet, UserCheck, Eye, 
  Gamepad2, Award, Calendar, ArrowUp, Lock, Timer, Activity,
  Smartphone, Monitor, Tablet, MapPin, UserCircle, Users2, Gift
} from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { cn } from "@/lib/utils";
import { AnimatedNumber } from "@/hooks/useAnimatedCounter";

interface CampaignMetricsDashboardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userPlan: "GROWTH" | "SCALE";
  onUpgrade?: () => void;
  campaign: {
    id: string;
    title: string;
    status: "active" | "completed";
    startDate: Date;
    endDate: Date;
    participants: number;
  };
}

// Mock data for charts
const participationData = [
  { day: "Lun", participants: 120, plays: 450 },
  { day: "Mar", participants: 180, plays: 620 },
  { day: "Mié", participants: 250, plays: 890 },
  { day: "Jue", participants: 310, plays: 1100 },
  { day: "Vie", participants: 420, plays: 1450 },
  { day: "Sáb", participants: 380, plays: 1320 },
  { day: "Dom", participants: 290, plays: 980 },
];

// Engagement distribution data for horizontal bar chart
const engagementDistribution = [
  { label: "1 partida", percentage: 15, count: 188, color: "#6366f1" },
  { label: "2-5 partidas", percentage: 35, count: 438, color: "#8b5cf6" },
  { label: "6-10 partidas", percentage: 28, count: 350, color: "#a855f7" },
  { label: "11-20 partidas", percentage: 15, count: 188, color: "#c084fc" },
  { label: "20+ partidas", percentage: 7, count: 86, color: "#d8b4fe" },
];

// Device distribution data
const deviceDistribution = [
  { device: "Mobile", percentage: 58, count: 725, color: "#8b5cf6" },
  { device: "Desktop", percentage: 32, count: 400, color: "#a855f7" },
  { device: "Tablet", percentage: 10, count: 125, color: "#c084fc" },
];

// Top locations data
const topLocations = [
  { city: "Madrid", users: 3420, percentage: 28 },
  { city: "Barcelona", users: 2180, percentage: 18 },
  { city: "Valencia", users: 1520, percentage: 12 },
  { city: "Sevilla", users: 980, percentage: 8 },
  { city: "Bilbao", users: 720, percentage: 6 },
];

// Audience Profile data
const audienceProfile = [
  { label: "Masculino", percentage: 52, count: 650, color: "#6366f1" },
  { label: "Femenino", percentage: 45, count: 563, color: "#c084fc" },
  { label: "Otro", percentage: 3, count: 37, color: "#a855f7" },
];

// Age Distribution data
const ageDistribution = [
  { range: "18-24", percentage: 22, count: 275, color: "#8b5cf6" },
  { range: "25-34", percentage: 38, count: 475, color: "#a855f7" },
  { range: "35-44", percentage: 24, count: 300, color: "#c084fc" },
  { range: "45-54", percentage: 11, count: 138, color: "#d8b4fe" },
  { range: "55+", percentage: 5, count: 62, color: "#ede9fe" },
];

const rewardsData = [
  { type: "Bonus Level", claimed: 245, total: 300 },
  { type: "Special Reward", claimed: 89, total: 150 },
  { type: "Top Ranking", claimed: 10, total: 10 },
];

// Micro data - only for SCALE plan
const microUserData = [
  { id: 1, name: "María G.", email: "maria.g@email.com", plays: 45, score: 12500, lastPlay: "Hace 2h", consented: true },
  { id: 2, name: "Carlos R.", email: "carlos.r@email.com", plays: 38, score: 11200, lastPlay: "Hace 4h", consented: true },
  { id: 3, name: "Ana P.", email: "ana.p@email.com", plays: 52, score: 14800, lastPlay: "Hace 1h", consented: true },
  { id: 4, name: "Luis M.", email: "luis.m@email.com", plays: 29, score: 8900, lastPlay: "Hace 6h", consented: true },
  { id: 5, name: "Sofia L.", email: "sofia.l@email.com", plays: 61, score: 16200, lastPlay: "Hace 30min", consented: true },
];

const chartConfig = {
  participants: { label: "Participantes", color: "#8b5cf6" },
  plays: { label: "Partidas", color: "#c084fc" },
};

export const CampaignMetricsDashboard = ({ 
  open, 
  onOpenChange, 
  userPlan, 
  onUpgrade,
  campaign 
}: CampaignMetricsDashboardProps) => {
  const [activeTab, setActiveTab] = useState("macro");
  const [animateKPIs, setAnimateKPIs] = useState(false);
  const [animateBars, setAnimateBars] = useState(false);
  const isScale = userPlan === "SCALE";
  const isCompleted = campaign.status === "completed";

  // Trigger animations when modal opens
  useEffect(() => {
    if (open) {
      setAnimateKPIs(false);
      setAnimateBars(false);
      // Stagger the animations
      const kpiTimer = setTimeout(() => setAnimateKPIs(true), 100);
      const barsTimer = setTimeout(() => setAnimateBars(true), 400);
      return () => {
        clearTimeout(kpiTimer);
        clearTimeout(barsTimer);
      };
    }
  }, [open]);

  const getDaysRemaining = () => {
    const diffTime = campaign.endDate.getTime() - new Date().getTime();
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  };

  // KPI data
  const kpiData = {
    participants: campaign.participants,
    totalPlays: 6810,
    totalMinutes: 28620,
    avgMinutesPerUser: 4.2,
    avgPlaysPerUser: 3.8,
    rewardsDelivered: 344,
  };

  // Calculate total rewards delivered
  const totalRewardsDelivered = rewardsData.reduce((acc, r) => acc + r.claimed, 0);
  const totalRewardsAvailable = rewardsData.reduce((acc, r) => acc + r.total, 0);
  const rewardsPercentage = Math.round((totalRewardsDelivered / totalRewardsAvailable) * 100);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-hidden flex flex-col bg-background border-border">
        <DialogHeader className="pb-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-bold text-foreground">{campaign.title}</DialogTitle>
              <DialogDescription className="flex items-center gap-2 mt-1">
                <Badge 
                  variant={isCompleted ? "secondary" : "default"} 
                  className={isCompleted ? "bg-muted" : "bg-green-500/20 text-green-400 border-green-500/30"}
                >
                  {isCompleted ? "Finalizada" : "En curso"}
                </Badge>
                {!isCompleted && <span className="text-sm text-muted-foreground">{getDaysRemaining()} días restantes</span>}
              </DialogDescription>
            </div>
            <Badge className={`${userPlan === "SCALE" ? "bg-plan-scale/20 text-red-400 border-plan-scale/30" : "bg-plan-growth/20 text-orange-400 border-plan-growth/30"} border`}>
              Plan {userPlan}
            </Badge>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="grid w-full grid-cols-2 bg-secondary/50 p-1">
            <TabsTrigger 
              value="macro" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              MACRO
            </TabsTrigger>
            <TabsTrigger 
              value="micro"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              {!isScale && <Lock className="h-3 w-3 mr-1" />}
              <Users className="h-4 w-4 mr-2" />
              MICRO
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto py-4">
            <TabsContent value="macro" className="space-y-6 mt-0">
              {/* KPI Cards - Purple themed with circular icons and animations */}
              <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                {[
                  { icon: Users, value: kpiData.participants, label: "Participantes", iconBg: "bg-primary/20", iconColor: "text-primary", trend: "+12%", isDecimal: false },
                  { icon: Gamepad2, value: kpiData.totalPlays, label: "Partidas totales", iconBg: "bg-accent/20", iconColor: "text-accent", trend: "+8%", isDecimal: false },
                  { icon: Target, value: kpiData.avgPlaysPerUser, label: "Avg partidas/User", iconBg: "bg-emerald-500/20", iconColor: "text-emerald-400", trend: "+5%", isDecimal: true },
                  { icon: Timer, value: kpiData.totalMinutes, label: "Total minutos", iconBg: "bg-purple-500/20", iconColor: "text-purple-400", trend: "+15%", isDecimal: false },
                  { icon: Activity, value: kpiData.avgMinutesPerUser, label: "Avg min/user", iconBg: "bg-violet-500/20", iconColor: "text-violet-400", trend: "+3%", isDecimal: true, suffix: " min" },
                  { icon: Gift, value: totalRewardsDelivered, label: "Rewards entregados", iconBg: "bg-amber-500/20", iconColor: "text-amber-400", trend: `${rewardsPercentage}%`, isDecimal: false },
                ].map((kpi, index) => (
                  <Card 
                    key={index}
                    className={cn(
                      "bg-card border-border group cursor-pointer transition-all duration-500 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1",
                      animateKPIs 
                        ? "opacity-100 translate-y-0" 
                        : "opacity-0 translate-y-4"
                    )}
                    style={{ transitionDelay: `${index * 80}ms` }}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3",
                          kpi.iconBg
                        )}>
                          <kpi.icon className={cn("h-4 w-4 transition-transform duration-300 group-hover:scale-110", kpi.iconColor)} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="text-lg font-bold text-foreground truncate">
                              <AnimatedNumber 
                                value={kpi.isDecimal ? Math.round(kpi.value * 10) : kpi.value}
                                duration={1200}
                                delay={index * 100 + 300}
                                enabled={animateKPIs}
                                suffix={kpi.suffix || ''}
                                formatFn={kpi.isDecimal 
                                  ? (n) => (n / 10).toFixed(1)
                                  : (n) => n.toLocaleString()
                                }
                              />
                            </p>
                            <span className="text-[10px] font-medium text-emerald-400 bg-emerald-500/10 px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">{kpi.trend}</span>
                          </div>
                          <p className="text-[10px] text-muted-foreground truncate">{kpi.label}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Participation Chart - Purple gradient */}
              <Card className="bg-card border-border group transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base text-foreground">Participación diaria</CardTitle>
                    <div className="flex items-center gap-4 text-xs">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                        <span className="text-muted-foreground">Participantes</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" style={{ animationDelay: '0.5s' }} />
                        <span className="text-muted-foreground">Partidas</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[200px] w-full">
                    <AreaChart data={participationData}>
                      <defs>
                        <linearGradient id="participantsGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.05}/>
                        </linearGradient>
                        <linearGradient id="playsGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#c084fc" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#c084fc" stopOpacity={0.05}/>
                        </linearGradient>
                      </defs>
                      <XAxis 
                        dataKey="day" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                      />
                      <YAxis 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area 
                        type="monotone" 
                        dataKey="participants" 
                        stroke="#8b5cf6" 
                        strokeWidth={2}
                        fill="url(#participantsGradient)"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="plays" 
                        stroke="#c084fc" 
                        strokeWidth={2}
                        fill="url(#playsGradient)"
                      />
                    </AreaChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Engagement Distribution & Device Distribution */}
              <div className="grid md:grid-cols-2 gap-4">
                {/* Engagement Distribution - Horizontal bars with animations */}
                <Card className="bg-card border-border group transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base text-foreground flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                        <BarChart3 className="h-3 w-3 text-primary" />
                      </div>
                      Engagement Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {engagementDistribution.map((item, index) => (
                      <div 
                        key={index} 
                        className={cn(
                          "space-y-1 transition-all duration-500 group/bar cursor-pointer",
                          animateBars ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                        )}
                        style={{ transitionDelay: `${index * 80}ms` }}
                      >
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground group-hover/bar:text-foreground transition-colors">{item.label}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">({item.count})</span>
                            <span className="font-medium text-foreground group-hover/bar:text-primary transition-colors">{item.percentage}%</span>
                          </div>
                        </div>
                        <div className="h-2.5 bg-secondary rounded-full overflow-hidden group-hover/bar:h-3 transition-all duration-200">
                          <div 
                            className="h-full rounded-full transition-all duration-700 ease-out group-hover/bar:brightness-110"
                            style={{ 
                              width: animateBars ? `${item.percentage}%` : '0%',
                              backgroundColor: item.color,
                              transitionDelay: `${index * 80 + 200}ms`
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Device Distribution */}
                <Card className="bg-card border-border group transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base text-foreground flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center">
                        <Smartphone className="h-3 w-3 text-accent" />
                      </div>
                      Device Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {deviceDistribution.map((item, index) => {
                      const DeviceIcon = item.device === "Mobile" ? Smartphone : item.device === "Desktop" ? Monitor : Tablet;
                      return (
                        <div 
                          key={item.device} 
                          className={cn(
                            "space-y-2 transition-all duration-500 group/device cursor-pointer",
                            animateBars ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
                          )}
                          style={{ transitionDelay: `${index * 100}ms` }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center transition-all duration-300 group-hover/device:scale-110 group-hover/device:bg-primary/30 group-hover/device:rotate-6">
                                <DeviceIcon className="h-4 w-4 text-primary" />
                              </div>
                              <span className="text-sm text-foreground group-hover/device:text-primary transition-colors">{item.device}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">({item.count})</span>
                              <span className="font-bold text-foreground group-hover/device:text-primary transition-colors">{item.percentage}%</span>
                            </div>
                          </div>
                          <div className="h-2.5 bg-secondary rounded-full overflow-hidden group-hover/device:h-3 transition-all duration-200">
                            <div 
                              className="h-full rounded-full transition-all duration-700 ease-out group-hover/device:brightness-110"
                              style={{ 
                                width: animateBars ? `${item.percentage}%` : '0%',
                                backgroundColor: item.color,
                                transitionDelay: `${index * 100 + 200}ms`
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              </div>

              {/* Top Locations & Rewards Effectiveness */}
              <div className="grid md:grid-cols-2 gap-4">
                {/* Top Locations */}
                <Card className="bg-card border-border group transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base text-foreground flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <MapPin className="h-3 w-3 text-emerald-400" />
                      </div>
                      Top Locations
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {topLocations.map((location, index) => (
                      <div 
                        key={location.city} 
                        className={cn(
                          "flex items-center justify-between p-2.5 rounded-lg bg-secondary/30 transition-all duration-500 cursor-pointer hover:bg-secondary/50 hover:translate-x-1 group/loc",
                          animateBars ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                        )}
                        style={{ transitionDelay: `${index * 80}ms` }}
                      >
                        <div className="flex items-center gap-3">
                          <span className={cn(
                            "text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300",
                            index === 0 ? "bg-yellow-500/20 text-yellow-400" : 
                            index === 1 ? "bg-gray-400/20 text-gray-400" : 
                            index === 2 ? "bg-orange-500/20 text-orange-400" : 
                            "bg-muted text-muted-foreground"
                          )}>
                            {index + 1}
                          </span>
                          <span className="text-sm font-medium text-foreground group-hover/loc:text-primary transition-colors">{location.city}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-muted-foreground">{location.users.toLocaleString()} usuarios</span>
                          <span className="text-sm font-bold text-primary">{location.percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Rewards Delivered */}
                <Card className="bg-card border-border group transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base text-foreground flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-violet-500/20 flex items-center justify-center">
                        <Gift className="h-3 w-3 text-violet-400" />
                      </div>
                      Rewards Entregados
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {rewardsData.map((reward, index) => {
                      const percentage = Math.round((reward.claimed / reward.total) * 100);
                      const isComplete = percentage === 100;
                      return (
                        <div 
                          key={reward.type} 
                          className={cn(
                            "space-y-2 transition-all duration-500 group/reward cursor-pointer",
                            animateBars ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
                          )}
                          style={{ transitionDelay: `${index * 100}ms` }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 group-hover/reward:scale-110 group-hover/reward:rotate-6",
                                isComplete ? "bg-emerald-500/20" : "bg-primary/20"
                              )}>
                                <Gift className={cn("h-4 w-4", isComplete ? "text-emerald-400" : "text-primary")} />
                              </div>
                              <span className="text-sm text-foreground group-hover/reward:text-primary transition-colors">{reward.type}</span>
                            </div>
                            <div className="text-sm flex items-center gap-2">
                              <span className="font-bold text-foreground">{reward.claimed}</span>
                              <span className="text-muted-foreground">/{reward.total}</span>
                              <span className={cn(
                                "text-[10px] font-medium px-1.5 py-0.5 rounded",
                                isComplete 
                                  ? "text-emerald-400 bg-emerald-500/10 animate-pulse" 
                                  : "text-muted-foreground bg-muted"
                              )}>
                                {percentage}%
                              </span>
                            </div>
                          </div>
                          <div className="h-2.5 bg-secondary rounded-full overflow-hidden group-hover/reward:h-3 transition-all duration-200">
                            <div 
                              className={cn(
                                "h-full rounded-full transition-all duration-700 ease-out group-hover/reward:brightness-110",
                                isComplete ? "bg-gradient-to-r from-emerald-500 to-emerald-400" : "bg-gradient-to-r from-primary to-accent"
                              )}
                              style={{ 
                                width: animateBars ? `${percentage}%` : '0%',
                                transitionDelay: `${index * 100 + 200}ms`
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              </div>

              {/* Audience Profile & Age Distribution */}
              <div className="grid md:grid-cols-2 gap-4">
                {/* Audience Profile */}
                <Card className="bg-card border-border group transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base text-foreground flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center">
                        <Users2 className="h-3 w-3 text-indigo-400" />
                      </div>
                      Audience Profile
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {audienceProfile.map((item, index) => (
                      <div 
                        key={index} 
                        className={cn(
                          "space-y-1 transition-all duration-500 group/bar cursor-pointer",
                          animateBars ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                        )}
                        style={{ transitionDelay: `${index * 80 + 400}ms` }}
                      >
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground group-hover/bar:text-foreground transition-colors">{item.label}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">({item.count})</span>
                            <span className="font-medium text-foreground group-hover/bar:text-primary transition-colors">{item.percentage}%</span>
                          </div>
                        </div>
                        <div className="h-2.5 bg-secondary rounded-full overflow-hidden group-hover/bar:h-3 transition-all duration-200">
                          <div 
                            className="h-full rounded-full transition-all duration-700 ease-out group-hover/bar:brightness-110"
                            style={{ 
                              width: animateBars ? `${item.percentage}%` : '0%',
                              backgroundColor: item.color,
                              transitionDelay: `${index * 80 + 600}ms`
                            }}
                          />
                        </div>
                      </div>
                    ))}
                    {/* Visual pie representation */}
                    <div className="flex items-center justify-center pt-2">
                      <div className="flex items-center gap-4 text-xs">
                        {audienceProfile.map((item, index) => (
                          <div key={index} className="flex items-center gap-1.5">
                            <div 
                              className="w-2.5 h-2.5 rounded-full" 
                              style={{ backgroundColor: item.color }}
                            />
                            <span className="text-muted-foreground">{item.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Age Distribution */}
                <Card className="bg-card border-border group transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base text-foreground flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center">
                        <UserCircle className="h-3 w-3 text-purple-400" />
                      </div>
                      Age Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {ageDistribution.map((item, index) => {
                      const isTopGroup = index === 1; // 25-34 is the largest group
                      return (
                        <div 
                          key={index} 
                          className={cn(
                            "space-y-1 transition-all duration-500 group/bar cursor-pointer",
                            animateBars ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
                          )}
                          style={{ transitionDelay: `${index * 80 + 400}ms` }}
                        >
                          <div className="flex justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground group-hover/bar:text-foreground transition-colors">{item.range}</span>
                              {isTopGroup && (
                                <span className="text-[9px] font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                                  TOP
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">({item.count})</span>
                              <span className={cn(
                                "font-medium transition-colors",
                                isTopGroup ? "text-primary" : "text-foreground group-hover/bar:text-primary"
                              )}>{item.percentage}%</span>
                            </div>
                          </div>
                          <div className="h-2.5 bg-secondary rounded-full overflow-hidden group-hover/bar:h-3 transition-all duration-200">
                            <div 
                              className={cn(
                                "h-full rounded-full transition-all duration-700 ease-out group-hover/bar:brightness-110",
                                isTopGroup && "ring-1 ring-primary/50"
                              )}
                              style={{ 
                                width: animateBars ? `${item.percentage}%` : '0%',
                                backgroundColor: item.color,
                                transitionDelay: `${index * 80 + 600}ms`
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              </div>

              {/* Export button for MACRO */}
              <Card className="bg-card border-border">
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Exportar Métricas MACRO</p>
                        <p className="text-sm text-muted-foreground">
                          Descarga un reporte con todas las métricas agregadas
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary/10">
                      <Download className="mr-2 h-4 w-4" />
                      Exportar PDF
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Upgrade prompt for GROWTH users */}
              {!isScale && (
                <Card className="border-primary/30 bg-primary/5">
                  <CardContent className="flex items-center justify-between py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <Lock className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Desbloquea datos micro</p>
                        <p className="text-sm text-muted-foreground">
                          Accede a datos individuales de usuarios con su consentimiento
                        </p>
                      </div>
                    </div>
                    <Button 
                      className="bg-primary hover:bg-primary/90 text-primary-foreground"
                      onClick={onUpgrade}
                    >
                      <ArrowUp className="mr-2 h-4 w-4" />
                      Upgrade a SCALE
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* MICRO METRICS - Only for SCALE */}
            <TabsContent value="micro" className="space-y-6 mt-0">
              {isScale ? (
                <>
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-base text-foreground">Datos de Usuarios</CardTitle>
                          <CardDescription>
                            Solo usuarios que aceptaron compartir sus datos
                          </CardDescription>
                        </div>
                        <Badge variant="outline" className="text-green-400 border-green-500/30 bg-green-500/10">
                          <UserCheck className="h-3 w-3 mr-1" />
                          {microUserData.length} con consentimiento
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow className="border-border hover:bg-transparent">
                            <TableHead className="text-muted-foreground">Usuario</TableHead>
                            <TableHead className="text-muted-foreground">Email</TableHead>
                            <TableHead className="text-center text-muted-foreground">Partidas</TableHead>
                            <TableHead className="text-center text-muted-foreground">Puntuación</TableHead>
                            <TableHead className="text-muted-foreground">Última actividad</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {microUserData.map((user) => (
                            <TableRow key={user.id} className="border-border hover:bg-secondary/50">
                              <TableCell className="font-medium text-foreground">{user.name}</TableCell>
                              <TableCell className="text-muted-foreground">{user.email}</TableCell>
                              <TableCell className="text-center text-foreground">{user.plays}</TableCell>
                              <TableCell className="text-center font-bold text-primary">{user.score.toLocaleString()}</TableCell>
                              <TableCell className="text-muted-foreground">{user.lastPlay}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>

                  {/* Export button for MICRO */}
                  <Card className="bg-card border-border">
                    <CardContent className="py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                            <FileSpreadsheet className="h-5 w-5 text-accent" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">Exportar Métricas MICRO</p>
                            <p className="text-sm text-muted-foreground">
                              Descarga los datos individuales de usuarios
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" className="border-accent/50 text-accent hover:bg-accent/10">
                            <Download className="mr-2 h-4 w-4" />
                            PDF
                          </Button>
                          <Button variant="outline" className="border-accent/50 text-accent hover:bg-accent/10">
                            <Download className="mr-2 h-4 w-4" />
                            CSV
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card className="text-center py-12 bg-card border-border">
                  <CardContent>
                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                      <Lock className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-foreground">Datos Micro no disponibles</h3>
                    <p className="text-muted-foreground mb-4">
                      Esta funcionalidad está disponible solo para el plan SCALE
                    </p>
                    <Button className="bg-primary hover:bg-primary/90" onClick={onUpgrade}>
                      <ArrowUp className="mr-2 h-4 w-4" />
                      Upgrade a SCALE
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};