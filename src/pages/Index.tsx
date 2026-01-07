import { Link } from "react-router-dom";
import { ArrowRight, Users, GraduationCap, Sparkles, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-32">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                Experiencias Educativas{" "}
                <span className="text-primary">Inmersivas</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Transforma el aprendizaje con experiencias interactivas diseñadas para familias y colegios. Descubre un nuevo mundo de posibilidades educativas.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link to="/pricing">
                    Ver Planes
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/auth">Iniciar Sesión</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">¿Por qué Legendaryum?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Ofrecemos soluciones adaptadas a las necesidades de familias y centros educativos.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-card rounded-xl p-6 border">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Para Familias</h3>
                <p className="text-sm text-muted-foreground">
                  Planes accesibles para disfrutar en casa con toda la familia.
                </p>
              </div>

              <div className="bg-card rounded-xl p-6 border">
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <GraduationCap className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-semibold mb-2">Para Colegios</h3>
                <p className="text-sm text-muted-foreground">
                  Soluciones escalables para instituciones educativas de todos los tamaños.
                </p>
              </div>

              <div className="bg-card rounded-xl p-6 border">
                <div className="w-12 h-12 rounded-lg bg-plan-scale/10 flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-plan-scale" />
                </div>
                <h3 className="font-semibold mb-2">Experiencias Únicas</h3>
                <p className="text-sm text-muted-foreground">
                  Contenido inmersivo y educativo diseñado por expertos.
                </p>
              </div>

              <div className="bg-card rounded-xl p-6 border">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Seguro y Confiable</h3>
                <p className="text-sm text-muted-foreground">
                  Contenido 100% seguro y apropiado para todas las edades.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container">
            <div className="bg-primary rounded-2xl p-8 md:p-12 text-center text-primary-foreground">
              <h2 className="text-3xl font-bold mb-4">¿Listo para empezar?</h2>
              <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
                Comienza gratis hoy y descubre todo lo que Legendaryum puede ofrecer.
              </p>
              <Button size="lg" variant="secondary" asChild>
                <Link to="/pricing">
                  Ver Todos los Planes
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
