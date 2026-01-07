import { Link } from "react-router-dom";
import { CreditCard, User, LogOut, Settings, BarChart3, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Dashboard = () => {
  // Mock data - esto vendrá de la base de datos
  const user = {
    name: "Usuario Demo",
    email: "demo@legendaryum.com",
    plan: "ELITE",
    status: "active",
    nextBilling: "15 Feb 2024",
    profiles: 3,
    maxProfiles: "Ilimitados",
    experiencesUsed: 1,
    maxExperiences: 1,
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case "FREE": return "bg-plan-free";
      case "ELITE": return "bg-plan-elite";
      case "GROWTH": return "bg-plan-growth";
      case "SCALE": return "bg-plan-scale";
      case "ENTERPRISE": return "bg-plan-enterprise";
      default: return "bg-primary";
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-lg font-bold text-primary-foreground">L</span>
            </div>
            <span className="text-xl font-semibold">Legendaryum</span>
          </Link>

          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:block">{user.email}</span>
            <Button variant="ghost" size="icon" asChild>
              <Link to="/">
                <LogOut className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Hola, {user.name.split(" ")[0]} 👋</h1>
          <p className="text-muted-foreground">Gestiona tu suscripción y perfil desde aquí.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Plan actual */}
          <Card className="md:col-span-2 lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Tu Plan</CardTitle>
              <Badge className={getPlanColor(user.plan)}>{user.plan}</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1">
                {user.plan === "FREE" ? "Gratis" : user.plan === "ELITE" ? "20€/mes" : "80€/mes"}
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                {user.status === "active" ? (
                  <>Próxima facturación: {user.nextBilling}</>
                ) : (
                  "Plan gratuito"
                )}
              </p>
              <Button variant="outline" className="w-full">
                <CreditCard className="mr-2 h-4 w-4" />
                Gestionar Suscripción
              </Button>
            </CardContent>
          </Card>

          {/* Perfiles */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Perfiles</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user.profiles}</div>
              <p className="text-xs text-muted-foreground">
                de {user.maxProfiles} disponibles
              </p>
            </CardContent>
          </Card>

          {/* Experiencias */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Experiencias</CardTitle>
              <Sparkles className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user.experiencesUsed}</div>
              <p className="text-xs text-muted-foreground">
                de {user.maxExperiences} incluidas
              </p>
            </CardContent>
          </Card>

          {/* Acciones rápidas */}
          <Card className="md:col-span-2 lg:col-span-3">
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
              <CardDescription>Gestiona tu cuenta y explora nuevas experiencias.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                  <User className="h-5 w-5" />
                  <span>Editar Perfil</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                  <Sparkles className="h-5 w-5" />
                  <span>Ver Experiencias</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Ver Progreso</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                  <Settings className="h-5 w-5" />
                  <span>Configuración</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Upgrade CTA */}
          {user.plan !== "ENTERPRISE" && (
            <Card className="md:col-span-2 lg:col-span-3 bg-primary text-primary-foreground">
              <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6">
                <div>
                  <h3 className="text-lg font-semibold">¿Necesitas más?</h3>
                  <p className="text-primary-foreground/80">
                    Mejora tu plan para acceder a más experiencias y perfiles.
                  </p>
                </div>
                <Button variant="secondary" asChild>
                  <Link to="/pricing">Ver Planes</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
