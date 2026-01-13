import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { 
  Users, TrendingUp, Clock, Trophy, Target, BarChart3, 
  Download, FileText, FileSpreadsheet, UserCheck, Eye, 
  Gamepad2, Award, Calendar, ArrowUp, Lock, Timer, Activity
} from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

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
  { label: "1 partida", percentage: 15, color: "#6366f1" },
  { label: "2-5 partidas", percentage: 35, color: "#8b5cf6" },
  { label: "6-10 partidas", percentage: 28, color: "#a855f7" },
  { label: "11-20 partidas", percentage: 15, color: "#c084fc" },
  { label: "20+ partidas", percentage: 7, color: "#d8b4fe" },
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
  const isScale = userPlan === "SCALE";
  const isCompleted = campaign.status === "completed";

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
  };

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
          <TabsList className="grid w-full grid-cols-3 bg-secondary/50 p-1">
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
            <TabsTrigger 
              value="reports" 
              disabled={!isCompleted}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground disabled:opacity-50"
            >
              <FileText className="h-4 w-4 mr-2" />
              REPORTING
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto py-4">
            {/* MACRO METRICS */}
            <TabsContent value="macro" className="space-y-6 mt-0">
              {/* KPI Cards - Purple themed with circular icons */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-card border-border hover:border-primary/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-foreground">{kpiData.participants.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Participantes</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-card border-border hover:border-primary/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                        <Gamepad2 className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-foreground">{kpiData.totalPlays.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Partidas totales</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-card border-border hover:border-primary/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                        <Timer className="h-5 w-5 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-foreground">{kpiData.totalMinutes.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Total minutos</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-card border-border hover:border-primary/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center">
                        <Activity className="h-5 w-5 text-violet-400" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-foreground">{kpiData.avgMinutesPerUser} min</p>
                        <p className="text-xs text-muted-foreground">Avg min/user</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Participation Chart - Purple gradient */}
              <Card className="bg-card border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base text-foreground">Participación diaria</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[250px] w-full">
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

              {/* Engagement Distribution & Rewards */}
              <div className="grid md:grid-cols-2 gap-4">
                {/* Engagement Distribution - Horizontal bars */}
                <Card className="bg-card border-border">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base text-foreground">Engagement Distribution</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {engagementDistribution.map((item, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{item.label}</span>
                          <span className="font-medium text-foreground">{item.percentage}%</span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all duration-500"
                            style={{ 
                              width: `${item.percentage}%`,
                              backgroundColor: item.color 
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Rewards Effectiveness */}
                <Card className="bg-card border-border">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base text-foreground">Efectividad de Rewards</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {rewardsData.map((reward) => {
                      const percentage = Math.round((reward.claimed / reward.total) * 100);
                      return (
                        <div key={reward.type} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                                <Award className="h-4 w-4 text-primary" />
                              </div>
                              <span className="text-sm text-foreground">{reward.type}</span>
                            </div>
                            <div className="text-sm">
                              <span className="font-bold text-foreground">{reward.claimed}</span>
                              <span className="text-muted-foreground">/{reward.total}</span>
                            </div>
                          </div>
                          <div className="h-2 bg-secondary rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              </div>

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

                  <Card className="bg-card border-border">
                    <CardContent className="py-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-foreground">Exportar para CRM</p>
                          <p className="text-sm text-muted-foreground">
                            Descarga los datos de usuarios para tus acciones comerciales
                          </p>
                        </div>
                        <Button className="bg-primary hover:bg-primary/90">
                          <Download className="mr-2 h-4 w-4" />
                          Exportar CSV
                        </Button>
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

            {/* REPORTS - Only when campaign is completed */}
            <TabsContent value="reports" className="space-y-6 mt-0">
              {isCompleted ? (
                <>
                  {/* Executive Summary */}
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="text-base text-foreground">Resumen Ejecutivo</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-primary/10 rounded-lg border border-primary/20">
                          <p className="text-2xl font-bold text-primary">{campaign.participants.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">Total participantes</p>
                        </div>
                        <div className="text-center p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                          <p className="text-2xl font-bold text-green-400">68%</p>
                          <p className="text-xs text-muted-foreground">Tasa de conversión</p>
                        </div>
                        <div className="text-center p-4 bg-accent/10 rounded-lg border border-accent/20">
                          <p className="text-2xl font-bold text-accent">6,810</p>
                          <p className="text-xs text-muted-foreground">Interacciones totales</p>
                        </div>
                        <div className="text-center p-4 bg-violet-500/10 rounded-lg border border-violet-500/20">
                          <p className="text-2xl font-bold text-violet-400">344</p>
                          <p className="text-xs text-muted-foreground">Rewards entregados</p>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-4 border border-border rounded-lg bg-secondary/30">
                          <h4 className="font-medium mb-2 text-foreground">Comparativa Inicio vs Fin</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Engagement inicial</span>
                              <span className="font-medium text-foreground">23%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Engagement final</span>
                              <span className="font-medium text-green-400">68%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Incremento</span>
                              <span className="font-bold text-primary">+196%</span>
                            </div>
                          </div>
                        </div>
                        <div className="p-4 border border-border rounded-lg bg-secondary/30">
                          <h4 className="font-medium mb-2 text-foreground">Métricas de Tiempo</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Total minutos</span>
                              <span className="font-medium text-foreground">{kpiData.totalMinutes.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Avg min/user</span>
                              <span className="font-medium text-foreground">{kpiData.avgMinutesPerUser} min</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Sesión más larga</span>
                              <span className="font-bold text-primary">45 min</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Download Reports */}
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="text-base text-foreground">Descargar Reportes</CardTitle>
                      <CardDescription>
                        Obtén un análisis completo de tu campaña
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between p-3 border border-border rounded-lg hover:border-primary/50 transition-colors bg-secondary/30">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                            <FileText className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">Reporte MACRO</p>
                            <p className="text-xs text-muted-foreground">Métricas agregadas y tendencias</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="border-primary/50 text-primary hover:bg-primary/10">
                          <Download className="h-4 w-4 mr-2" />
                          PDF
                        </Button>
                      </div>
                      
                      {isScale && (
                        <div className="flex items-center justify-between p-3 border border-border rounded-lg hover:border-accent/50 transition-colors bg-secondary/30">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                              <FileSpreadsheet className="h-5 w-5 text-accent" />
                            </div>
                            <div>
                              <p className="font-medium text-foreground">Reporte MICRO</p>
                              <p className="text-xs text-muted-foreground">Datos individuales de usuarios</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="border-accent/50 text-accent hover:bg-accent/10">
                              <Download className="h-4 w-4 mr-2" />
                              PDF
                            </Button>
                            <Button variant="outline" size="sm" className="border-accent/50 text-accent hover:bg-accent/10">
                              <Download className="h-4 w-4 mr-2" />
                              CSV
                            </Button>
                          </div>
                        </div>
                      )}
                      
                      {!isScale && (
                        <div className="flex items-center justify-between p-3 border border-border rounded-lg bg-secondary/20 opacity-60">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                              <Lock className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="font-medium text-muted-foreground">Reporte MICRO</p>
                              <p className="text-xs text-muted-foreground">Disponible en plan SCALE</p>
                            </div>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={onUpgrade}
                            className="border-primary/50 text-primary hover:bg-primary/10"
                          >
                            <ArrowUp className="h-4 w-4 mr-2" />
                            Upgrade
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card className="text-center py-12 bg-card border-border">
                  <CardContent>
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                      <Calendar className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-foreground">Reportes no disponibles</h3>
                    <p className="text-muted-foreground mb-2">
                      Los reportes estarán disponibles cuando la campaña finalice
                    </p>
                    <p className="text-sm text-primary">
                      {getDaysRemaining()} días restantes
                    </p>
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
