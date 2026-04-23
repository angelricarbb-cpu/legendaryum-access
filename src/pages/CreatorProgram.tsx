import { useState, useMemo } from "react";
import Header from "@/components/layout/Header";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Sparkles, Copy, Check, Share2, Users, TrendingUp, DollarSign, Crown,
  Link2, Gift, Rocket, Star, ArrowUpRight, Wallet, Calendar, Trophy,
  Facebook, Twitter, Send, MessageCircle, Building2, Ticket, UserPlus,
  CheckCircle2, Target, Zap, Info
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

type Status = "not_applied" | "approved";

// Bonos por volumen segun PDF
const PREMIUM_BONUSES = [
  { users: 500, bonus: 50 },
  { users: 1000, bonus: 100 },
  { users: 5000, bonus: 500 },
  { users: 10000, bonus: 1000 },
  { users: 50000, bonus: 4500 },
  { users: 100000, bonus: 8850 },
];

const B2B_BONUSES = [
  { brands: 10, bonus: 100 },
  { brands: 50, bonus: 400 },
  { brands: 150, bonus: 1000 },
  { brands: 300, bonus: 2000 },
  { brands: 500, bonus: 6500 },
];

const EVENTS_BONUSES = [
  { tickets: 500, bonus: 50 },
  { tickets: 1000, bonus: 100 },
  { tickets: 5000, bonus: 500 },
  { tickets: 10000, bonus: 1000 },
  { tickets: 50000, bonus: 4500 },
  { tickets: 100000, bonus: 8850 },
];

const CreatorProgram = () => {
  const { user, isLoggedIn } = useAuth();
  const [status, setStatus] = useState<Status>("approved");
  const [copied, setCopied] = useState(false);

  const metrics = useMemo(() => ({
    clicks: 1284,
    signups: 312,
    // B2C Premium
    premiumConversions: 47,
    premiumEarnings: 234.53,
    // B2B
    brandConversions: 3,
    brandEarnings: 119.99,
    // Eventos
    ticketsSold: 28,
    eventsEarnings: 56.00,
    // Sub-creadores
    referredCreators: 2,
    creatorReferralEarnings: 18.40,
    // Totales
    earningsThisMonth: 428.92,
    earningsTotal: 1842.10,
    pendingPayout: 428.92,
    conversionRate: 15.1,
  }), []);

  const referralCode = (user?.username || "creator").toLowerCase().replace(/[^a-z0-9]/g, "") || "creator";
  const referralLink = `https://legendaryum.com/r/${referralCode}`;
  const creatorReferralLink = `https://legendaryum.com/creators/r/${referralCode}`;

  const recentConversions = [
    { id: 1, name: "Maria G.", date: "Hace 2h", type: "Premium", commission: 2.99, source: "premium" },
    { id: 2, name: "Brand: AcmeCo", date: "Hace 5h", type: "B2B Growth", commission: 19.99, source: "b2b" },
    { id: 3, name: "Carlos R.", date: "Ayer", type: "Ticket Champions", commission: 4.00, source: "event" },
    { id: 4, name: "Lucia P.", date: "Hace 2 dias", type: "Premium", commission: 2.99, source: "premium" },
    { id: 5, name: "Andres M.", date: "Hace 3 dias", type: "Premium", commission: 2.99, source: "premium" },
    { id: 6, name: "@creator_jane", date: "Hace 4 dias", type: "Sub-creador (5%)", commission: 1.20, source: "creator" },
  ];

  const copyLink = (link: string, label: string) => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    toast({ title: `${label} copiado`, description: "Ya puedes compartirlo en tus redes." });
    setTimeout(() => setCopied(false), 2000);
  };

  const shareTo = (platform: string, link: string) => {
    const text = encodeURIComponent("Unete a Legendaryum y vive experiencias gamificadas con premios reales!");
    const url = encodeURIComponent(link);
    const urls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      telegram: `https://t.me/share/url?url=${url}&text=${text}`,
      whatsapp: `https://wa.me/?text=${text}%20${url}`,
    };
    if (urls[platform]) window.open(urls[platform], "_blank");
  };

  const getNextBonus = <T extends { bonus: number }>(list: T[], current: number, key: keyof T) => {
    return list.find((b) => current < (b[key] as unknown as number)) || null;
  };

  const nextPremiumBonus = getNextBonus(PREMIUM_BONUSES, metrics.premiumConversions, "users");
  const nextB2BBonus = getNextBonus(B2B_BONUSES, metrics.brandConversions, "brands");
  const nextEventsBonus = getNextBonus(EVENTS_BONUSES, metrics.ticketsSold, "tickets");

  if (status === "not_applied") {
    return (
      <div className="min-h-screen bg-background">
        <Header isLoggedIn={isLoggedIn} user={user ? { name: user.name, username: `@${user.username}`, avatar: user.avatar } : undefined} />
        <main className="container py-12">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
                <Sparkles className="h-3 w-3 mr-1" /> Legendaryum Creators Program
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Gana dinero con tu comunidad
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                De forma directa, sin depender de sponsors ni algoritmos. 100% basado en resultados, sin inversion y sin riesgo.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <Card className="border-2 border-primary/20">
                <CardContent className="pt-6">
                  <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
                    <Crown className="h-5 w-5 text-blue-500" />
                  </div>
                  <h3 className="font-semibold mb-2">Premium B2C</h3>
                  <p className="text-2xl font-bold mb-1">20%</p>
                  <p className="text-sm text-muted-foreground">Comision recurrente 12 meses por suscripcion Premium. Tu audiencia obtiene 20% de descuento.</p>
                </CardContent>
              </Card>
              <Card className="border-2 border-primary/20">
                <CardContent className="pt-6">
                  <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4">
                    <Building2 className="h-5 w-5 text-purple-500" />
                  </div>
                  <h3 className="font-semibold mb-2">Marcas B2B</h3>
                  <p className="text-2xl font-bold mb-1">20%</p>
                  <p className="text-sm text-muted-foreground">Recurrente 12 meses por cada marca que se suscriba a Growth o Scale.</p>
                </CardContent>
              </Card>
              <Card className="border-2 border-primary/20">
                <CardContent className="pt-6">
                  <div className="h-10 w-10 rounded-lg bg-orange-500/10 flex items-center justify-center mb-4">
                    <Ticket className="h-5 w-5 text-orange-500" />
                  </div>
                  <h3 className="font-semibold mb-2">Eventos exclusivos</h3>
                  <p className="text-2xl font-bold mb-1">20%</p>
                  <p className="text-sm text-muted-foreground">Por cada ticket vendido para eventos pay-to-enter (viajes, finales, VIP).</p>
                </CardContent>
              </Card>
            </div>

            <Card className="mb-12 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/30">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center shrink-0">
                    <UserPlus className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Creator Referral Program</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Invita a otros creadores y gana <strong>5% adicional sobre todos sus ingresos durante 12 meses</strong>, sin afectar sus comisiones.
                    </p>
                    <p className="text-xs text-muted-foreground">Construye tu red de creadores y escala sin limites.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {[
                { icon: CheckCircle2, title: "Sin inversion", desc: "No pagas nada por unirte." },
                { icon: Target, title: "Sin azar ni sorteos", desc: "Tu audiencia compite y gana por desempeno." },
                { icon: Zap, title: "Sin limites de ingresos", desc: "Cuanto mas volumen, mas ganas." },
              ].map((b, i) => (
                <div key={i} className="flex gap-3">
                  <b.icon className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm">{b.title}</h4>
                    <p className="text-sm text-muted-foreground">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Button size="lg" className="gap-2" onClick={() => { setStatus("approved"); toast({ title: "Bienvenido al programa!", description: "Tu link de partner esta listo." }); }}>
                <Rocket className="h-4 w-4" /> Aplicar al Creators Program
              </Button>
              <p className="text-xs text-muted-foreground mt-3">Pagos por transferencia. Minimo de retiro: USD 100.</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header isLoggedIn={isLoggedIn} user={user ? { name: user.name, username: `@${user.username}`, avatar: user.avatar } : undefined} />

      <main className="container py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
                <Crown className="h-3 w-3 mr-1" /> Creator Partner
              </Badge>
              <Badge variant="outline">20% comision · 5% sub-creadores</Badge>
            </div>
            <h1 className="text-3xl font-bold">Creators Program</h1>
            <p className="text-muted-foreground">Tu panel de partner de Legendaryum</p>
          </div>
          <Button variant="outline" className="gap-2" disabled={metrics.pendingPayout < 100}>
            <Wallet className="h-4 w-4" /> Solicitar pago {metrics.pendingPayout < 100 && "(min. $100)"}
          </Button>
        </div>

        {/* KPIs principales */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { icon: Link2, label: "Clicks", value: metrics.clicks.toLocaleString(), color: "text-blue-500" },
            { icon: Users, label: "Registros", value: metrics.signups.toLocaleString(), color: "text-purple-500" },
            { icon: TrendingUp, label: "Tasa conversion", value: `${metrics.conversionRate}%`, color: "text-cyan-500" },
            { icon: DollarSign, label: "Ganancias del mes", value: `$${metrics.earningsThisMonth.toFixed(2)}`, color: "text-green-500" },
          ].map((k, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <k.icon className={`h-4 w-4 ${k.color}`} />
                  <ArrowUpRight className="h-3 w-3 text-muted-foreground" />
                </div>
                <div className="text-2xl font-bold">{k.value}</div>
                <p className="text-xs text-muted-foreground">{k.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Link de afiliado principal */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5" /> Tu link de afiliado
            </CardTitle>
            <CardDescription>
              Compartelo en redes. Tu audiencia obtiene <strong>20% de descuento</strong> y tu ganas <strong>20% recurrente durante 12 meses</strong>.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input value={referralLink} readOnly className="font-mono text-sm" />
              <Button onClick={() => copyLink(referralLink, "Link")} className="gap-2 shrink-0">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copiado" : "Copiar"}
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" className="gap-2" onClick={() => shareTo("twitter", referralLink)}>
                <Twitter className="h-4 w-4" /> Twitter
              </Button>
              <Button variant="outline" size="sm" className="gap-2" onClick={() => shareTo("facebook", referralLink)}>
                <Facebook className="h-4 w-4" /> Facebook
              </Button>
              <Button variant="outline" size="sm" className="gap-2" onClick={() => shareTo("telegram", referralLink)}>
                <Send className="h-4 w-4" /> Telegram
              </Button>
              <Button variant="outline" size="sm" className="gap-2" onClick={() => shareTo("whatsapp", referralLink)}>
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </Button>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="streams" className="space-y-4">
          <TabsList>
            <TabsTrigger value="streams">Vias de ingreso</TabsTrigger>
            <TabsTrigger value="bonuses">Bonos por volumen</TabsTrigger>
            <TabsTrigger value="conversions">Conversiones</TabsTrigger>
            <TabsTrigger value="creators">Sub-creadores</TabsTrigger>
            <TabsTrigger value="earnings">Ganancias</TabsTrigger>
            <TabsTrigger value="resources">Recursos</TabsTrigger>
          </TabsList>

          {/* 3 vias de ingreso */}
          <TabsContent value="streams">
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Crown className="h-4 w-4 text-blue-500" /> Premium B2C
                    </CardTitle>
                    <Badge variant="secondary">20% · 12m</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Conversiones</p>
                    <p className="text-2xl font-bold">{metrics.premiumConversions}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Generado</p>
                    <p className="text-lg font-semibold text-green-500">${metrics.premiumEarnings.toFixed(2)}</p>
                  </div>
                  <p className="text-xs text-muted-foreground border-t pt-2">
                    iPhone, PS5, viajes y giftcards. Audiencia: 20% off.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-purple-500">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-purple-500" /> Marcas B2B
                    </CardTitle>
                    <Badge variant="secondary">20% · 12m</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Marcas suscritas</p>
                    <p className="text-2xl font-bold">{metrics.brandConversions}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Generado</p>
                    <p className="text-lg font-semibold text-green-500">${metrics.brandEarnings.toFixed(2)}</p>
                  </div>
                  <p className="text-xs text-muted-foreground border-t pt-2">
                    Planes Growth o Scale. Marca: 20% off.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-orange-500">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Ticket className="h-4 w-4 text-orange-500" /> Eventos
                    </CardTitle>
                    <Badge variant="secondary">20% por ticket</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Tickets vendidos</p>
                    <p className="text-2xl font-bold">{metrics.ticketsSold}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Generado</p>
                    <p className="text-lg font-semibold text-green-500">${metrics.eventsEarnings.toFixed(2)}</p>
                  </div>
                  <p className="text-xs text-muted-foreground border-t pt-2">
                    Champions, NBA, F1, conciertos VIP. Audiencia: 20% off.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Bonos por volumen */}
          <TabsContent value="bonuses">
            <div className="space-y-6">
              {nextPremiumBonus && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Crown className="h-4 w-4 text-blue-500" /> Bonos Premium B2C
                      </CardTitle>
                      <Badge variant="outline">Hasta $15.000 extra</Badge>
                    </div>
                    <CardDescription>
                      Proximo bono: <strong>${nextPremiumBonus.bonus}</strong> al alcanzar {nextPremiumBonus.users.toLocaleString()} usuarios
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Progress value={(metrics.premiumConversions / nextPremiumBonus.users) * 100} className="h-2" />
                    <p className="text-xs text-muted-foreground">{metrics.premiumConversions} / {nextPremiumBonus.users.toLocaleString()}</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4">
                      {PREMIUM_BONUSES.map((b) => {
                        const reached = metrics.premiumConversions >= b.users;
                        return (
                          <div key={b.users} className={`p-3 rounded-lg border text-center ${reached ? "bg-green-500/10 border-green-500/30" : ""}`}>
                            <p className="text-xs text-muted-foreground">{b.users.toLocaleString()} usuarios</p>
                            <p className={`font-bold ${reached ? "text-green-500" : ""}`}>${b.bonus.toLocaleString()}</p>
                            {reached && <CheckCircle2 className="h-3 w-3 text-green-500 mx-auto mt-1" />}
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}

              {nextB2BBonus && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-purple-500" /> Bonos B2B
                      </CardTitle>
                      <Badge variant="outline">Hasta $10.000 extra</Badge>
                    </div>
                    <CardDescription>
                      Proximo bono: <strong>${nextB2BBonus.bonus}</strong> al alcanzar {nextB2BBonus.brands} marcas
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Progress value={(metrics.brandConversions / nextB2BBonus.brands) * 100} className="h-2" />
                    <p className="text-xs text-muted-foreground">{metrics.brandConversions} / {nextB2BBonus.brands}</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4">
                      {B2B_BONUSES.map((b) => {
                        const reached = metrics.brandConversions >= b.brands;
                        return (
                          <div key={b.brands} className={`p-3 rounded-lg border text-center ${reached ? "bg-green-500/10 border-green-500/30" : ""}`}>
                            <p className="text-xs text-muted-foreground">{b.brands} marcas</p>
                            <p className={`font-bold ${reached ? "text-green-500" : ""}`}>${b.bonus.toLocaleString()}</p>
                            {reached && <CheckCircle2 className="h-3 w-3 text-green-500 mx-auto mt-1" />}
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}

              {nextEventsBonus && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Ticket className="h-4 w-4 text-orange-500" /> Bonos Eventos
                      </CardTitle>
                      <Badge variant="outline">Hasta $15.000 extra</Badge>
                    </div>
                    <CardDescription>
                      Proximo bono: <strong>${nextEventsBonus.bonus}</strong> al alcanzar {nextEventsBonus.tickets.toLocaleString()} tickets
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Progress value={(metrics.ticketsSold / nextEventsBonus.tickets) * 100} className="h-2" />
                    <p className="text-xs text-muted-foreground">{metrics.ticketsSold} / {nextEventsBonus.tickets.toLocaleString()}</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4">
                      {EVENTS_BONUSES.map((b) => {
                        const reached = metrics.ticketsSold >= b.tickets;
                        return (
                          <div key={b.tickets} className={`p-3 rounded-lg border text-center ${reached ? "bg-green-500/10 border-green-500/30" : ""}`}>
                            <p className="text-xs text-muted-foreground">{b.tickets.toLocaleString()} tickets</p>
                            <p className={`font-bold ${reached ? "text-green-500" : ""}`}>${b.bonus.toLocaleString()}</p>
                            {reached && <CheckCircle2 className="h-3 w-3 text-green-500 mx-auto mt-1" />}
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Conversiones */}
          <TabsContent value="conversions">
            <Card>
              <CardHeader>
                <CardTitle>Conversiones recientes</CardTitle>
                <CardDescription>Premium, marcas, tickets y sub-creadores en un solo lugar</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentConversions.map((r) => (
                    <div key={r.id} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                          r.source === "premium" ? "bg-blue-500/10" :
                          r.source === "b2b" ? "bg-purple-500/10" :
                          r.source === "event" ? "bg-orange-500/10" :
                          "bg-amber-500/10"
                        }`}>
                          {r.source === "premium" && <Crown className="h-4 w-4 text-blue-500" />}
                          {r.source === "b2b" && <Building2 className="h-4 w-4 text-purple-500" />}
                          {r.source === "event" && <Ticket className="h-4 w-4 text-orange-500" />}
                          {r.source === "creator" && <UserPlus className="h-4 w-4 text-amber-500" />}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{r.name}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" /> {r.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary">{r.type}</Badge>
                        <span className="text-sm font-bold text-green-500">+${r.commission.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sub-creadores */}
          <TabsContent value="creators">
            <Card className="mb-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5 text-amber-500" /> Creator Referral Program
                </CardTitle>
                <CardDescription>
                  Invita a otros creadores y gana <strong>5% extra</strong> sobre todos sus ingresos durante 12 meses, sin afectar sus comisiones.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input value={creatorReferralLink} readOnly className="font-mono text-sm" />
                  <Button onClick={() => copyLink(creatorReferralLink, "Link de creadores")} className="gap-2 shrink-0">
                    <Copy className="h-4 w-4" /> Copiar
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg border bg-background">
                    <p className="text-xs text-muted-foreground">Creadores referidos</p>
                    <p className="text-2xl font-bold">{metrics.referredCreators}</p>
                  </div>
                  <div className="p-4 rounded-lg border bg-background">
                    <p className="text-xs text-muted-foreground">Ganancias 5% override</p>
                    <p className="text-2xl font-bold text-green-500">${metrics.creatorReferralEarnings.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Ganancias */}
          <TabsContent value="earnings">
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Disponible para retirar</CardDescription>
                  <CardTitle className="text-3xl text-green-500">${metrics.pendingPayout.toFixed(2)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" disabled={metrics.pendingPayout < 100}>
                    {metrics.pendingPayout < 100 ? `Min. $100 (faltan $${(100 - metrics.pendingPayout).toFixed(2)})` : "Solicitar pago"}
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Ganancias del mes</CardDescription>
                  <CardTitle className="text-3xl">${metrics.earningsThisMonth.toFixed(2)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">Pago por transferencia contra factura</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Total ganado historico</CardDescription>
                  <CardTitle className="text-3xl">${metrics.earningsTotal.toFixed(2)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">Desde que te uniste al programa</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Desglose por via</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <Crown className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Premium B2C ({metrics.premiumConversions} conversiones)</span>
                  </div>
                  <span className="font-semibold text-green-500">${metrics.premiumEarnings.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-4 w-4 text-purple-500" />
                    <span className="text-sm">Marcas B2B ({metrics.brandConversions} marcas)</span>
                  </div>
                  <span className="font-semibold text-green-500">${metrics.brandEarnings.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <Ticket className="h-4 w-4 text-orange-500" />
                    <span className="text-sm">Eventos ({metrics.ticketsSold} tickets)</span>
                  </div>
                  <span className="font-semibold text-green-500">${metrics.eventsEarnings.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <UserPlus className="h-4 w-4 text-amber-500" />
                    <span className="text-sm">Sub-creadores 5% ({metrics.referredCreators})</span>
                  </div>
                  <span className="font-semibold text-green-500">${metrics.creatorReferralEarnings.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-4 bg-muted/50">
              <CardContent className="pt-6">
                <div className="flex gap-3">
                  <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p><strong>Condiciones:</strong> Pagos por transferencia contra factura. Minimo de retiro: USD 100.</p>
                    <p>No se permiten auto-referidos. Solo se contabilizan conversiones reales y verificadas.</p>
                    <p>Comisiones recurrentes durante 12 meses desde cada conversion. Calculadas sobre el importe efectivamente cobrado por Legendaryum.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Recursos */}
          <TabsContent value="resources">
            <Card>
              <CardHeader>
                <CardTitle>Recursos para creadores</CardTitle>
                <CardDescription>Materiales listos para compartir con tu comunidad</CardDescription>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                {[
                  { icon: Gift, title: "Banners y assets", desc: "Imagenes y videos para tus redes." },
                  { icon: Star, title: "Guia de buenas practicas", desc: "Como presentar Legendaryum a tu audiencia." },
                  { icon: Sparkles, title: "Plantillas de copy", desc: "Textos optimizados para conversion." },
                  { icon: Trophy, title: "Casos de exito", desc: "Aprende de otros creadores top." },
                ].map((r, i) => (
                  <div key={i} className="flex gap-3 p-4 rounded-lg border hover:border-primary transition-colors cursor-pointer">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <r.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">{r.title}</h4>
                      <p className="text-sm text-muted-foreground">{r.desc}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default CreatorProgram;
