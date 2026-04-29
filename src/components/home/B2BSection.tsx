import { Sparkles } from "lucide-react";

const B2BSection = () => {

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
