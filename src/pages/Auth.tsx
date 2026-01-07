import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const plan = searchParams.get("plan");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simular carga
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30 p-4">
      <Link to="/" className="flex items-center gap-2 mb-8">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
          <span className="text-xl font-bold text-primary-foreground">L</span>
        </div>
        <span className="text-2xl font-semibold">Legendaryum</span>
      </Link>

      <Card className="w-full max-w-md">
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
            <TabsTrigger value="register">Registrarse</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Bienvenido de nuevo</CardTitle>
                <CardDescription>
                  Ingresa tus credenciales para acceder a tu cuenta.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="tu@email.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <Input id="password" type="password" placeholder="••••••••" required />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Cargando..." : "Iniciar Sesión"}
                </Button>
                <Link to="#" className="text-sm text-muted-foreground hover:text-foreground">
                  ¿Olvidaste tu contraseña?
                </Link>
              </CardFooter>
            </form>
          </TabsContent>

          <TabsContent value="register">
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Crear cuenta</CardTitle>
                <CardDescription>
                  {plan ? (
                    <>Registrándote para el plan <span className="font-semibold uppercase text-foreground">{plan}</span></>
                  ) : (
                    "Completa el formulario para crear tu cuenta."
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reg-name">Nombre completo</Label>
                  <Input id="reg-name" type="text" placeholder="Tu nombre" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-email">Email</Label>
                  <Input id="reg-email" type="email" placeholder="tu@email.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-password">Contraseña</Label>
                  <Input id="reg-password" type="password" placeholder="••••••••" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-password-confirm">Confirmar contraseña</Label>
                  <Input id="reg-password-confirm" type="password" placeholder="••••••••" required />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Cargando..." : "Crear Cuenta"}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
        </Tabs>
      </Card>

      <p className="mt-8 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground">← Volver al inicio</Link>
      </p>
    </div>
  );
};

export default Auth;
