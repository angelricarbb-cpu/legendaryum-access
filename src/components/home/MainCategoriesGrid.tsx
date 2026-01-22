import { Link } from "react-router-dom";
import { Trophy, Target, Gamepad2, Calendar } from "lucide-react";

interface CategoryCard {
  id: string;
  title: string;
  icon: React.ReactNode;
  link: string;
  gradient: string;
  bgImage?: string;
}

const categories: CategoryCard[] = [
  {
    id: "rankings",
    title: "Rankings",
    icon: <Trophy className="h-10 w-10 text-yellow-400" />,
    link: "/rankings",
    gradient: "from-amber-500/80 via-orange-500/70 to-yellow-600/80",
  },
  {
    id: "missions",
    title: "Missions",
    icon: <Target className="h-10 w-10 text-blue-400" />,
    link: "/missions",
    gradient: "from-blue-500/80 via-cyan-500/70 to-teal-500/80",
  },
  {
    id: "games",
    title: "Games",
    icon: <Gamepad2 className="h-10 w-10 text-green-400" />,
    link: "/games",
    gradient: "from-emerald-500/80 via-green-500/70 to-teal-500/80",
  },
  {
    id: "events",
    title: "Events",
    icon: <Calendar className="h-10 w-10 text-purple-400" />,
    link: "/events",
    gradient: "from-purple-500/80 via-pink-500/70 to-rose-500/80",
  },
];

const MainCategoriesGrid = () => {
  return (
    <section className="py-6 px-4">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={category.link}
              className="group relative aspect-[4/3] rounded-2xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
            >
              {/* Background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient}`} />
              
              {/* Decorative particles */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-2 right-2 w-4 h-4 bg-white/20 rounded-full blur-sm animate-pulse" />
                <div className="absolute bottom-4 left-4 w-6 h-6 bg-white/10 rounded-full blur-md" />
                <div className="absolute top-1/2 right-1/4 w-3 h-3 bg-white/15 rounded-full" />
              </div>

              {/* Content */}
              <div className="relative h-full flex flex-col items-center justify-center p-4">
                <div className="mb-2 p-3 rounded-xl bg-white/10 backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                  {category.icon}
                </div>
                <h3 className="text-lg md:text-xl font-bold text-white drop-shadow-lg text-center">
                  {category.title}
                </h3>
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MainCategoriesGrid;
