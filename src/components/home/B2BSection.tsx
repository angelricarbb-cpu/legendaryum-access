import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

interface B2BSectionProps {
  showCta?: boolean;
}

const B2BSection = ({ showCta = true }: B2BSectionProps) => {
  return (
    <section className="py-16 bg-card">
      <div className="container px-4">
        <div className="max-w-3xl mx-auto text-center">
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
          {showCta && (
            <Button
              asChild
              size="lg"
              className="rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500 text-white hover:opacity-90 shadow-lg shadow-orange-500/30 font-semibold"
            >
              <Link to="/for-brands">
                <Sparkles className="h-4 w-4" />
                Para Marcas
              </Link>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};

export default B2BSection;
