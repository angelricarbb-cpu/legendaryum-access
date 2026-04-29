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

      </div>
    </section>
  );
};

export default B2BSection;
