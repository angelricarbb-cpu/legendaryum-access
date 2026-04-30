import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import B2BSection from "@/components/home/B2BSection";
import BrandsServices from "@/components/brands/BrandsServices";
import ContactForm from "@/components/ContactForm";
import { useAuth } from "@/contexts/AuthContext";

const ForBrands = () => {
  const { isLoggedIn, user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header
        isLoggedIn={isLoggedIn}
        user={user ? { name: user.name, username: user.username, avatar: user.avatar } : undefined}
      />

      <main className="flex-1">
        <B2BSection showCta={false} />
        <BrandsServices />

        <section id="contact" className="py-16 bg-background">
          <div className="container px-4">
            <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-2xl p-8 md:p-12 border border-primary/20">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4 text-foreground">¿Listo para empezar?</h2>
                <p className="text-muted-foreground max-w-xl mx-auto">
                  Cuéntanos sobre tu marca y diseñaremos una experiencia gamificada a medida.
                </p>
              </div>
              <div className="max-w-3xl mx-auto">
                <ContactForm />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ForBrands;
