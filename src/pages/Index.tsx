import { Link } from "react-router-dom";
import { ArrowRight, Trophy, Target, Gamepad2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/10" />
          
          <div className="container relative">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                Position your brand{" "}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  with gamified marketing
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Turn every click into a fun challenge that engages and converts up to 10× more than traditional ads.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link to="/pricing">
                    Ver Planes
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/dashboard">Ir al Dashboard</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20">
          <div className="container">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Link 
                to="#" 
                className="group relative bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-2xl p-6 border border-border overflow-hidden hover:border-primary/50 transition-colors"
              >
                <div className="relative z-10">
                  <Trophy className="h-8 w-8 text-yellow-500 mb-4" />
                  <h3 className="font-bold text-lg mb-2">Ranking to Earn</h3>
                  <p className="text-sm text-muted-foreground">
                    Compete in challenges, climb the ranking, and earn real rewards.
                  </p>
                </div>
              </Link>

              <Link 
                to="#" 
                className="group relative bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl p-6 border border-border overflow-hidden hover:border-primary/50 transition-colors"
              >
                <div className="relative z-10">
                  <Target className="h-8 w-8 text-blue-500 mb-4" />
                  <h3 className="font-bold text-lg mb-2">Mission to Earn</h3>
                  <p className="text-sm text-muted-foreground">
                    Complete interactive missions and earn rewards.
                  </p>
                </div>
              </Link>

              <Link 
                to="#" 
                className="group relative bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl p-6 border border-border overflow-hidden hover:border-primary/50 transition-colors"
              >
                <div className="relative z-10">
                  <Gamepad2 className="h-8 w-8 text-green-500 mb-4" />
                  <h3 className="font-bold text-lg mb-2">Games to Enjoy</h3>
                  <p className="text-sm text-muted-foreground">
                    Explore games designed to entertain millions of players.
                  </p>
                </div>
              </Link>

              <Link 
                to="#" 
                className="group relative bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl p-6 border border-border overflow-hidden hover:border-primary/50 transition-colors"
              >
                <div className="relative z-10">
                  <Zap className="h-8 w-8 text-purple-500 mb-4" />
                  <h3 className="font-bold text-lg mb-2">Premium Tournaments</h3>
                  <p className="text-sm text-muted-foreground">
                    Join global tournaments with big prizes.
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container">
            <div className="bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-2xl p-8 md:p-12 text-center border border-primary/30">
              <h2 className="text-3xl font-bold mb-4">¿Listo para empezar?</h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Únete a miles de usuarios y marcas que ya están transformando su engagement con gamificación.
              </p>
              <Button size="lg" asChild>
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
