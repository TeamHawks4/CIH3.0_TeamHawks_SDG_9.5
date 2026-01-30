import { ArrowUpRight, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectorCardProps {
  name: string;
  icon: React.ReactNode;
  growthRate: number;
  projectCount: number;
  totalFunding: string;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export function SectorCard({
  name,
  icon,
  growthRate,
  projectCount,
  totalFunding,
  onClick,
  className,
  style,
}: SectorCardProps) {
  const isPositiveGrowth = growthRate > 0;
  return (
    <div
      onClick={onClick}
      className={cn("sector-card group", className)}
      style={style}
    >
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-accent flex items-center justify-center text-accent-foreground">
            {icon}
          </div>
          <div
            className={cn(
              "growth-badge",
              !isPositiveGrowth && "bg-destructive/10 text-destructive"
            )}
          >
            <TrendingUp className={cn("w-3 h-3", !isPositiveGrowth && "rotate-180")} />
            {isPositiveGrowth ? "+" : ""}{growthRate}%
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-display font-semibold mb-1 group-hover:text-accent transition-colors">
          {name}
        </h3>

        {/* Stats */}
        <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
          <span>{projectCount} projects</span>
          <span>•</span>
          <span>{totalFunding} funded</span>
        </div>

        {/* Hover Arrow */}
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <ArrowUpRight className="w-5 h-5 text-accent" />
        </div>
      </div>
    </div>
  );
}
