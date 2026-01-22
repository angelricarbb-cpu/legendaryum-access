import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Rocket, Calendar, Puzzle, Palette } from "lucide-react";

interface ServiceCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
}

const services: ServiceCard[] = [
  {
    id: "campaigns",
    title: "Launch Gamified Campaigns",
    description: "Turn your ad budget into gamified experiences that attract, retain, and convert users into real customers. Each campaign is an interactive funnel that multiplies both your reach and your conversion.",
    icon: <Rocket className="h-8 w-8" />,
    gradient: "from-amber-400 via-orange-400 to-yellow-500",
  },
  {
    id: "events",
    title: "Big Digital Events",
    description: "High-engagement gamified events designed to boost participation, visibility, and community interaction. These experiences transform audiences into active participants and strengthen brand relationships.",
    icon: <Calendar className="h-8 w-8" />,
    gradient: "from-blue-400 via-indigo-400 to-purple-500",
  },
  {
    id: "protocol",
    title: "Integrate the Game Tech Protocol",
    description: "Seed your games and apps with our protocol: badging, missions, and rewards ready to scale to millions of users. No complex infrastructure, ready to integrate.",
    icon: <Puzzle className="h-8 w-8" />,
    gradient: "from-cyan-400 via-teal-400 to-emerald-500",
  },
  {
    id: "branded",
    title: "Create Your Own Branded Gaming",
    description: "Turn your brand into an interactive experience: personalized games and spaces that connect with your audience like never before. Go from dreaming your game to making it come alive.",
    icon: <Palette className="h-8 w-8" />,
    gradient: "from-rose-400 via-pink-400 to-fuchsia-500",
  },
];

const B2BSection = () => {
  const scrollToContact = () => {
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="py-16 bg-card">
      <div className="container px-4">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-foreground">
            The gamified marketing engine that turns clicks into{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              engagement and real results
            </span>
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Legendaryum helps brands grow through gamified campaigns and interactive events, 
            delivering measurable engagement and clean, reliable performance data.
          </p>
          <Button 
            size="lg" 
            onClick={scrollToContact}
            className="rounded-full px-8"
          >
            Get Started
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 gap-6 mt-12">
          {services.map((service) => (
            <div
              key={service.id}
              className="group relative bg-background rounded-2xl border border-border overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
            >
              {/* Card header with gradient icon area */}
              <div className={`h-32 md:h-40 bg-gradient-to-br ${service.gradient} relative overflow-hidden`}>
                {/* Decorative elements */}
                <div className="absolute inset-0 bg-black/10" />
                <div className="absolute top-4 right-4 opacity-20">
                  {service.icon}
                </div>
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-xl" />
              </div>

              {/* Card content */}
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
                  {service.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {service.description}
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={scrollToContact}
                  className="rounded-full"
                >
                  + Info
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default B2BSection;
