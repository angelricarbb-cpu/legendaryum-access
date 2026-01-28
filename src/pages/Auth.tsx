import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const plan = searchParams.get("plan");
  const [isLoading, setIsLoading] = useState(false);
  
  const { loginWithGoogle, returnUrl, setReturnUrl } = useAuth();
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    
    try {
      await loginWithGoogle();
      toast.success("¡Inicio de sesión exitoso!");
      
      // Redirigir después del login
      const redirectTo = returnUrl || "/dashboard";
      setReturnUrl(null);
      
      // Pequeño delay para asegurar que el estado se actualizó
      setTimeout(() => {
        navigate(redirectTo);
      }, 100);
    } catch (error) {
      toast.error("Error al iniciar sesión");
    } finally {
      setIsLoading(false);
    }
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
        <CardHeader className="text-center">
          <CardTitle>Bienvenido a Legendaryum</CardTitle>
          <CardDescription>
            {plan ? (
              <>Registrándote para el plan <span className="font-semibold uppercase text-foreground">{plan}</span></>
            ) : (
              "Inicia sesión con tu cuenta de Google para continuar"
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Google SSO Button */}
          <Button
            type="button"
            size="lg"
            className="w-full gap-3 h-14 text-base"
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            )}
            {isLoading ? "Conectando..." : "Continuar con Google"}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Al continuar, aceptas nuestros términos de servicio y política de privacidad.
          </p>
        </CardContent>
      </Card>

      <p className="mt-8 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground">← Volver al inicio</Link>
      </p>
    </div>
  );
};

export default Auth;
