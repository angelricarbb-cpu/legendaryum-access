import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PricingCard from "@/components/pricing/PricingCard";

const plans = [
  {
    name: "FREE",
    description: "Para familias que quieren probar",
    price: "Gratis",
    period: "",
    features: [
      "1 perfil de usuario",
      "1 experiencia incluida",
      "Acceso básico",
      "Soporte por email",
    ],
    buttonText: "Comenzar Gratis",
    colorClass: "bg-plan-free",
  },
  {
    name: "ELITE",
    description: "Para familias activas",
    price: "20€",
    period: "/mes",
    features: [
      "Perfiles ilimitados",
      "1 experiencia premium",
      "Acceso completo",
      "Soporte prioritario",
      "Sin anuncios",
    ],
    buttonText: "Suscribirse",
    popular: true,
    colorClass: "bg-plan-elite",
  },
  {
    name: "GROWTH",
    description: "Para colegios pequeños",
    price: "80€",
    period: "/mes",
    features: [
      "Hasta 500 perfiles",
      "3 experiencias premium",
      "Panel de administración",
      "Reportes de progreso",
      "Soporte dedicado",
    ],
    buttonText: "Suscribirse",
    colorClass: "bg-plan-growth",
  },
  {
    name: "SCALE",
    description: "Para colegios medianos",
    price: "150€",
    period: "/mes",
    features: [
      "Hasta 1000 perfiles",
      "6 experiencias premium",
      "Panel avanzado",
      "Analíticas detalladas",
      "Soporte 24/7",
      "Personalización básica",
    ],
    buttonText: "Suscribirse",
    colorClass: "bg-plan-scale",
  },
  {
    name: "ENTERPRISE",
    description: "Para grandes instituciones",
    price: "Contacto",
    period: "",
    features: [
      "Perfiles ilimitados",
      "Todas las experiencias",
      "API personalizada",
      "Integración LMS",
      "Account manager",
      "Personalización completa",
    ],
    buttonText: "Contactar",
    colorClass: "bg-plan-enterprise",
  },
];

const Pricing = () => {
  const navigate = useNavigate();

  const handleSelectPlan = (planName: string) => {
    if (planName === "FREE") {
      navigate("/auth?plan=free");
    } else if (planName === "ENTERPRISE") {
      // For now, just navigate to auth
      navigate("/auth?plan=enterprise");
    } else {
      navigate(`/auth?plan=${planName.toLowerCase()}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Planes y Precios</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Elige el plan que mejor se adapte a tus necesidades. Todos los planes incluyen acceso a nuestra plataforma de experiencias educativas.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-7xl mx-auto">
            {plans.map((plan) => (
              <PricingCard
                key={plan.name}
                {...plan}
                onSelect={() => handleSelectPlan(plan.name)}
              />
            ))}
          </div>

          <div className="mt-16 text-center">
            <h3 className="text-xl font-semibold mb-4">¿Necesitas algo diferente?</h3>
            <p className="text-muted-foreground mb-6">
              Contáctanos para crear un plan personalizado para tu institución.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Pricing;
