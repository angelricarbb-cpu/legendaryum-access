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
  Gamepad2, Award, Calendar, ArrowUp, Lock
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

const engagementData = [
  { name: "Completaron", value: 68, color: "hsl(var(--primary))" },
  { name: "Abandonaron", value: 22, color: "hsl(var(--muted))" },
  { name: "En progreso", value: 10, color: "hsl(var(--accent))" },
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
  participants: { label: "Participantes", color: "hsl(var(--primary))" },
  plays: { label: "Partidas", color: "hsl(var(--accent))" },
};

export const CampaignMetricsDashboard = ({ 
  open, 
  onOpenChange, 
  userPlan, 
  onUpgrade,
  campaign 
}: CampaignMetricsDashboardProps) => {
  const [activeTab, setActiveTab] = useState("realtime");
  const isScale = userPlan === "SCALE";
  const isCompleted = campaign.status === "completed";

  const getDaysRemaining = () => {
    const diffTime = campaign.endDate.getTime() - new Date().getTime();
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl">{campaign.title}</DialogTitle>
              <DialogDescription className="flex items-center gap-2 mt-1">
                <Badge variant={isCompleted ? "secondary" : "default"} className={isCompleted ? "" : "bg-green-500"}>
                  {isCompleted ? "Finalizada" : "En curso"}
                </Badge>
                {!isCompleted && <span className="text-sm">{getDaysRemaining()} días restantes</span>}
              </DialogDescription>
            </div>
            <Badge className={userPlan === "SCALE" ? "bg-plan-scale" : "bg-plan-growth"}>
              Plan {userPlan}
            </Badge>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="realtime">
              <BarChart3 className="h-4 w-4 mr-2" />
              Tiempo Real
            </TabsTrigger>
            <TabsTrigger value="micro">
              {!isScale && <Lock className="h-3 w-3 mr-1" />}
              <Users className="h-4 w-4 mr-2" />
              Datos Micro
            </TabsTrigger>
            <TabsTrigger value="reports" disabled={!isCompleted}>
              <FileText className="h-4 w-4 mr-2" />
              Reportes
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto py-4">
            {/* MACRO METRICS - Available for both GROWTH and SCALE */}
            <TabsContent value="realtime" className="space-y-6 mt-0">
              {/* KPI Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-2xl font-bold">{campaign.participants.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Participantes</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Gamepad2 className="h-5 w-5 text-accent" />
                      <div>
                        <p className="text-2xl font-bold">6,810</p>
                        <p className="text-xs text-muted-foreground">Partidas totales</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-yellow-500" />
                      <div>
                        <p className="text-2xl font-bold">4.2 min</p>
                        <p className="text-xs text-muted-foreground">Tiempo promedio</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="text-2xl font-bold">68%</p>
                        <p className="text-xs text-muted-foreground">Tasa de retención</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Participation Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Participación diaria</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[250px] w-full">
                    <AreaChart data={participationData}>
                      <XAxis dataKey="day" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area 
                        type="monotone" 
                        dataKey="participants" 
                        stroke="hsl(var(--primary))" 
                        fill="hsl(var(--primary))" 
                        fillOpacity={0.3}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="plays" 
                        stroke="hsl(var(--accent))" 
                        fill="hsl(var(--accent))" 
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Engagement & Rewards */}
              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Engagement</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={chartConfig} className="h-[180px] w-full">
                      <PieChart>
                        <Pie
                          data={engagementData}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={70}
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}%`}
                        >
                          {engagementData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ChartContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Efectividad de Rewards</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {rewardsData.map((reward) => (
                      <div key={reward.type} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Award className="h-4 w-4 text-primary" />
                          <span className="text-sm">{reward.type}</span>
                        </div>
                        <div className="text-sm">
                          <span className="font-bold">{reward.claimed}</span>
                          <span className="text-muted-foreground">/{reward.total}</span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Upgrade prompt for GROWTH users */}
              {!isScale && (
                <Card className="border-plan-scale/50 bg-plan-scale/5">
                  <CardContent className="flex items-center justify-between py-4">
                    <div className="flex items-center gap-3">
                      <Lock className="h-5 w-5 text-plan-scale" />
                      <div>
                        <p className="font-medium">Desbloquea datos micro</p>
                        <p className="text-sm text-muted-foreground">
                          Accede a datos individuales de usuarios con su consentimiento
                        </p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      className="border-plan-scale text-plan-scale hover:bg-plan-scale/10"
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
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-base">Datos de Usuarios</CardTitle>
                          <CardDescription>
                            Solo usuarios que aceptaron compartir sus datos
                          </CardDescription>
                        </div>
                        <Badge variant="outline" className="text-green-500 border-green-500/50">
                          <UserCheck className="h-3 w-3 mr-1" />
                          {microUserData.length} con consentimiento
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Usuario</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead className="text-center">Partidas</TableHead>
                            <TableHead className="text-center">Puntuación</TableHead>
                            <TableHead>Última actividad</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {microUserData.map((user) => (
                            <TableRow key={user.id}>
                              <TableCell className="font-medium">{user.name}</TableCell>
                              <TableCell className="text-muted-foreground">{user.email}</TableCell>
                              <TableCell className="text-center">{user.plays}</TableCell>
                              <TableCell className="text-center font-bold">{user.score.toLocaleString()}</TableCell>
                              <TableCell className="text-muted-foreground">{user.lastPlay}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="py-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Exportar para CRM</p>
                          <p className="text-sm text-muted-foreground">
                            Descarga los datos de usuarios para tus acciones comerciales
                          </p>
                        </div>
                        <Button>
                          <Download className="mr-2 h-4 w-4" />
                          Exportar CSV
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card className="text-center py-12">
                  <CardContent>
                    <Lock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">Datos Micro no disponibles</h3>
                    <p className="text-muted-foreground mb-4">
                      Esta funcionalidad está disponible solo para el plan SCALE
                    </p>
                    <Button onClick={onUpgrade}>
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
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Resumen Ejecutivo</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-muted/50 rounded-lg">
                          <p className="text-2xl font-bold text-primary">{campaign.participants.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">Total participantes</p>
                        </div>
                        <div className="text-center p-4 bg-muted/50 rounded-lg">
                          <p className="text-2xl font-bold text-green-500">68%</p>
                          <p className="text-xs text-muted-foreground">Tasa de conversión</p>
                        </div>
                        <div className="text-center p-4 bg-muted/50 rounded-lg">
                          <p className="text-2xl font-bold text-accent">6,810</p>
                          <p className="text-xs text-muted-foreground">Interacciones totales</p>
                        </div>
                        <div className="text-center p-4 bg-muted/50 rounded-lg">
                          <p className="text-2xl font-bold text-yellow-500">344</p>
                          <p className="text-xs text-muted-foreground">Rewards entregados</p>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-4 border border-border rounded-lg">
                          <h4 className="font-medium mb-2">Comparativa Inicio vs Fin</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Objetivo participantes:</span>
                              <span>10,000</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Alcanzado:</span>
                              <span className="text-green-500">{campaign.participants.toLocaleString()} (12.5%)</span>
                            </div>
                          </div>
                        </div>
                        <div className="p-4 border border-border rounded-lg">
                          <h4 className="font-medium mb-2">Engagement Total</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Tiempo total jugado:</span>
                              <span>486 horas</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Promedio por usuario:</span>
                              <span>23 minutos</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Download Reports */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Descargar Reportes</CardTitle>
                      <CardDescription>
                        Exporta los datos de tu campaña en diferentes formatos
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid sm:grid-cols-3 gap-4">
                        <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                          <FileText className="h-6 w-6 text-red-500" />
                          <span>Reporte PDF</span>
                          <span className="text-xs text-muted-foreground">Visual, ejecutivo</span>
                        </Button>
                        <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                          <FileSpreadsheet className="h-6 w-6 text-green-500" />
                          <span>CSV / Excel</span>
                          <span className="text-xs text-muted-foreground">Datos crudos</span>
                        </Button>
                        {isScale && (
                          <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                            <UserCheck className="h-6 w-6 text-blue-500" />
                            <span>Exportar Leads</span>
                            <span className="text-xs text-muted-foreground">Usuarios con consentimiento</span>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card className="text-center py-12">
                  <CardContent>
                    <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">Campaña en curso</h3>
                    <p className="text-muted-foreground">
                      Los reportes finales estarán disponibles cuando la campaña termine
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
