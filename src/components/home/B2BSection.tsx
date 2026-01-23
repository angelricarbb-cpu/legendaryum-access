import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Rocket, Calendar, Puzzle, Palette, ChevronRight, Sparkles } from "lucide-react";

interface ServiceCard {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  features: string[];
}

const services: ServiceCard[] = [
  {
    id: "campaigns",
    title: "Launch Gamified Campaigns",
    shortTitle: "Gamified Campaigns",
    description: "Turn your ad budget into gamified experiences that attract, retain, and convert users into real customers. Each campaign is an interactive funnel that multiplies both your reach and your conversion.",
    icon: <Rocket className="h-6 w-6" />,
    gradient: "from-amber-500 to-orange-600",
    features: ["Interactive funnels", "Higher conversion", "Viral reach"],
  },
  {
    id: "events",
    title: "Big Digital Events",
    shortTitle: "Digital Events",
    description: "High-engagement gamified events designed to boost participation, visibility, and community interaction. These experiences transform audiences into active participants and strengthen brand relationships.",
    icon: <Calendar className="h-6 w-6" />,
    gradient: "from-blue-500 to-indigo-600",
    features: ["Live engagement", "Community building", "Brand visibility"],
  },
  {
    id: "protocol",
    title: "Integrate the Game Tech Protocol",
    shortTitle: "Game Tech Protocol",
    description: "Seed your games and apps with our protocol: badging, missions, and rewards ready to scale to millions of users. No complex infrastructure, ready to integrate.",
    icon: <Puzzle className="h-6 w-6" />,
    gradient: "from-cyan-500 to-teal-600",
    features: ["Badging system", "Missions & rewards", "Scalable SDK"],
  },
  {
    id: "branded",
    title: "Create Your Own Branded Gaming",
    shortTitle: "Branded Gaming",
    description: "Turn your brand into an interactive experience: personalized games and spaces that connect with your audience like never before. Go from dreaming your game to making it come alive.",
    icon: <Palette className="h-6 w-6" />,
    gradient: "from-rose-500 to-pink-600",
    features: ["Custom games", "Brand experience", "Deep engagement"],
  },
];

const B2BSection = () => {
  const [activeService, setActiveService] = useState<string>("campaigns");
  
  const scrollToContact = () => {
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const activeServiceData = services.find(s => s.id === activeService) || services[0];

  return (
    <section className="py-16 bg-card">
      <div className="container px-4">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            For Businesses
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-foreground">
            The gamified marketing engine that turns clicks into{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              engagement and real results
            </span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Legendaryum helps brands grow through gamified campaigns and interactive events, 
            delivering measurable engagement and clean, reliable performance data.
          </p>
        </div>

        {/* Interactive Service Selector */}
        <div className="max-w-5xl mx-auto">
          {/* Tab Navigation */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {services.map((service) => (
              <button
                key={service.id}
                onClick={() => setActiveService(service.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeService === service.id
                    ? `bg-gradient-to-r ${service.gradient} text-white shadow-lg`
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {service.icon}
                <span className="hidden sm:inline">{service.shortTitle}</span>
              </button>
            ))}
          </div>

          {/* Active Service Display */}
          <div className="relative">
            <div className={`absolute inset-0 bg-gradient-to-r ${activeServiceData.gradient} opacity-5 rounded-3xl blur-xl`} />
            <div className="relative bg-background border border-border rounded-3xl overflow-hidden">
              <div className="grid md:grid-cols-2 gap-0">
                {/* Left: Visual */}
                <div className={`bg-gradient-to-br ${activeServiceData.gradient} p-8 md:p-12 flex items-center justify-center min-h-[300px] md:min-h-[400px]`}>
                  <div className="relative">
                    {/* Decorative rings */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-40 h-40 border-2 border-white/20 rounded-full animate-pulse" />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-56 h-56 border border-white/10 rounded-full" />
                    </div>
                    {/* Center icon */}
                    <div className="relative w-24 h-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-2xl">
                      <div className="text-white scale-150">
                        {activeServiceData.icon}
                      </div>
                    </div>
                    {/* Floating badges */}
                    <div className="absolute -top-4 -right-8 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-white text-xs font-medium">
                      {activeServiceData.features[0]}
                    </div>
                    <div className="absolute -bottom-4 -left-8 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-white text-xs font-medium">
                      {activeServiceData.features[1]}
                    </div>
                  </div>
                </div>

                {/* Right: Content */}
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                    {activeServiceData.title}
                  </h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {activeServiceData.description}
                  </p>
                  
                  {/* Features list */}
                  <ul className="space-y-3 mb-8">
                    {activeServiceData.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-foreground">
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${activeServiceData.gradient}`} />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Button 
                    size="lg"
                    onClick={scrollToContact}
                    className={`rounded-full w-fit bg-gradient-to-r ${activeServiceData.gradient} hover:opacity-90 transition-opacity`}
                  >
                    Get Started
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">
              Ready to transform your marketing with gamification?
            </p>
            <Button 
              variant="outline" 
              size="lg"
              onClick={scrollToContact}
              className="rounded-full px-8"
            >
              Contact Us
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default B2BSection;
