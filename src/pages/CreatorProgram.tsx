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
  Facebook, Twitter, Send, MessageCircle
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

type PartnerTier = "starter" | "pro" | "elite";
type Status = "not_applied" | "approved";

const TIERS: Record<PartnerTier, { name: string; commission: number; min: number; color: string }> = {
  starter: { name: "Starter", commission: 20, min: 0, color: "from-blue-500 to-cyan-500" },
  pro: { name: "Pro", commission: 30, min: 25, color: "from-purple-500 to-pink-500" },
  elite: { name: "Elite", commission: 40, min: 100, color: "from-amber-500 to-orange-500" },
};

const CreatorProgram = () => {
  const { user, isLoggedIn } = useAuth();
  const [status, setStatus] = useState<Status>("approved");
  const [copied, setCopied] = useState(false);

  const metrics = useMemo(() => ({
    clicks: 1284,
    signups: 312,
    premiumConversions: 47,
    conversionRate: 15.1,
    earningsThisMonth: 234.53,
    earningsTotal: 1842.10,
    pendingPayout: 234.53,
  }), []);

  const tier: PartnerTier = metrics.premiumConversions >= 100 ? "elite" : metrics.premiumConversions >= 25 ? "pro" : "starter";
  const tierInfo = TIERS[tier];
  const nextTier = tier === "starter" ? TIERS.pro : tier === "pro" ? TIERS.elite : null;
  const progressToNext = nextTier ? Math.min(100, (metrics.premiumConversions / nextTier.min) * 100) : 100;

  const referralCode = (user?.username || "creator").toLowerCase().replace(/[^a-z0-9]/g, "") || "creator";
  const referralLink = `https://legendaryum.com/r/${referralCode}`;

  const recentReferrals = [
    { id: 1, name: "Maria G.", date: "Hace 2h", plan: "Premium", commission: 2.99 },
    { id: 2, name: "Carlos R.", date: "Hace 5h", plan: "Premium", commission: 2.99 },
    { id: 3, name: "Lucia P.", date: "Ayer", plan: "Premium", commission: 2.99 },
    { id: 4, name: "Andres M.", date: "Hace 2 dias", plan: "Premium", commission: 2.99 },
    { id: 5, name: "Sofia L.", date: "Hace 3 dias", plan: "Premium", commission: 2.99 },
  ];

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast({ title: "Link copiado", description: "Ya puedes compartirlo en tus redes." });
    setTimeout(() => setCopied(false), 2000);
  };

  const shareTo = (platform: string) => {
    const text = encodeURIComponent("Unete a Legendaryum y vive experiencias gamificadas unicas!");
    const url = encodeURIComponent(referralLink);
    const urls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      telegram: `https://t.me/share/url?url=${url}&text=${text}`,
      whatsapp: `https://wa.me/?text=${text}%20${url}`,
    };
    if (urls[platform]) window.open(urls[platform], "_blank");
  };

  if (status === "not_applied") {
    return (
      <div className="min-h-screen bg-background">
        <Header isLoggedIn={isLoggedIn} user={user ? { name: user.name, username: `@${user.username}`, avatar: user.avatar } : undefined} />
        <main className="container py-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
                <Sparkles className="h-3 w-3 mr-1" /> Creator Program
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Conviertete en Partner de Legendaryum
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Comparte Legendaryum con tu comunidad y gana comisiones recurrentes por cada usuario que se suscriba a Premium.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {[
                { icon: Link2, title: "Tu link unico", desc: "Genera un enlace personalizado para compartir." },
                { icon: TrendingUp, title: "Dashboard en tiempo real", desc: "Sigue clicks, registros y conversiones." },
                { icon: DollarSign, title: "Hasta 40% de comision", desc: "Gana por cada Premium que conviertas." },
              ].map((b, i) => (
                <Card key={i}>
                  <CardContent className="pt-6">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <b.icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{b.title}</h3>
                    <p className="text-sm text-muted-foreground">{b.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-12">
              {Object.entries(TIERS).map(([key, t]) => (
                <Card key={key} className="relative overflow-hidden">
                  <div className={`h-1 bg-gradient-to-r ${t.color}`} />
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-lg">{t.name}</h3>
                      <Crown className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="text-3xl font-bold mb-1">{t.commission}%</div>
                    <p className="text-sm text-muted-foreground">
                      {t.min === 0 ? "Al unirte" : `Desde ${t.min} conversiones Premium`}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Button size="lg" className="gap-2" onClick={() => { setStatus("approved"); toast({ title: "Bienvenido al programa!", description: "Tu link de partner esta listo." }); }}>
                <Rocket className="h-4 w-4" /> Aplicar al Creator Program
              </Button>
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
              <Badge className={`bg-gradient-to-r ${tierInfo.color} text-white border-0`}>
                <Crown className="h-3 w-3 mr-1" /> Partner {tierInfo.name}
              </Badge>
              <Badge variant="outline">{tierInfo.commission}% comision</Badge>
            </div>
            <h1 className="text-3xl font-bold">Creator Program</h1>
            <p className="text-muted-foreground">Tu panel de partner de Legendaryum</p>
          </div>
          <Button variant="outline" className="gap-2">
            <Wallet className="h-4 w-4" /> Solicitar pago
          </Button>
        </div>

        {nextTier && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Progreso hacia <span className="font-bold">{nextTier.name}</span> ({nextTier.commission}% comision)</span>
                </div>
                <span className="text-sm text-muted-foreground">{metrics.premiumConversions} / {nextTier.min}</span>
              </div>
              <Progress value={progressToNext} className="h-2" />
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { icon: Link2, label: "Clicks en link", value: metrics.clicks.toLocaleString(), color: "text-blue-500" },
            { icon: Users, label: "Registros", value: metrics.signups.toLocaleString(), color: "text-purple-500" },
            { icon: Crown, label: "Conversiones Premium", value: metrics.premiumConversions, color: "text-amber-500" },
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

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5" /> Tu link de partner
            </CardTitle>
            <CardDescription>
              Comparte este link en redes sociales. Ganas el {tierInfo.commission}% por cada usuario que se suscriba a Premium.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input value={referralLink} readOnly className="font-mono text-sm" />
              <Button onClick={copyLink} className="gap-2 shrink-0">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copiado" : "Copiar"}
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" className="gap-2" onClick={() => shareTo("twitter")}>
                <Twitter className="h-4 w-4" /> Twitter
              </Button>
              <Button variant="outline" size="sm" className="gap-2" onClick={() => shareTo("facebook")}>
                <Facebook className="h-4 w-4" /> Facebook
              </Button>
              <Button variant="outline" size="sm" className="gap-2" onClick={() => shareTo("telegram")}>
                <Send className="h-4 w-4" /> Telegram
              </Button>
              <Button variant="outline" size="sm" className="gap-2" onClick={() => shareTo("whatsapp")}>
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </Button>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="referrals" className="space-y-4">
          <TabsList>
            <TabsTrigger value="referrals">Conversiones</TabsTrigger>
            <TabsTrigger value="earnings">Ganancias</TabsTrigger>
            <TabsTrigger value="resources">Recursos</TabsTrigger>
          </TabsList>

          <TabsContent value="referrals">
            <Card>
              <CardHeader>
                <CardTitle>Conversiones recientes a Premium</CardTitle>
                <CardDescription>Tasa de conversion actual: {metrics.conversionRate}%</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentReferrals.map((r) => (
                    <div key={r.id} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Users className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{r.name}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" /> {r.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary">{r.plan}</Badge>
                        <span className="text-sm font-bold text-green-500">+${r.commission.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="earnings">
            <div className="grid md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Disponible para retirar</CardDescription>
                  <CardTitle className="text-3xl text-green-500">${metrics.pendingPayout.toFixed(2)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Solicitar pago</Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Ganancias del mes</CardDescription>
                  <CardTitle className="text-3xl">${metrics.earningsThisMonth.toFixed(2)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">Pago automatico el dia 1 del proximo mes</p>
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
          </TabsContent>

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
