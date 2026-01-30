import { Clock, Users, DollarSign, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface GrantCardProps {
  title: string;
  description: string;
  funder: string;
  funderLogo?: string;
  totalAmount: string;
  applicants: number;
  daysLeft: number;
  sdgTags: string[];
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export function GrantCard({
  title,
  description,
  funder,
  funderLogo,
  totalAmount,
  applicants,
  daysLeft,
  sdgTags,
  onClick,
  className,
  style,
}: GrantCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-card rounded-xl border border-border/50 p-5 card-hover cursor-pointer group",
        className
      )}
      style={style}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-display font-semibold text-foreground mb-1 group-hover:text-accent transition-colors">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        </div>
        <ArrowRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Funder Logo */}
      <div className="h-20 rounded-lg bg-secondary/50 flex items-center justify-center mb-4 overflow-hidden">
        {funderLogo ? (
          <img src={funderLogo} alt={funder} className="max-h-12 object-contain" />
        ) : (
          <span className="text-sm text-muted-foreground font-medium">{funder}</span>
        )}
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between text-sm mb-4">
        <div className="flex items-center gap-1 text-success font-semibold">
          <DollarSign className="w-4 h-4" />
          {totalAmount}
        </div>
        <div className="flex items-center gap-4 text-muted-foreground">
          <span className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {applicants} applied
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {daysLeft} days left
          </span>
        </div>
      </div>

      {/* SDG Tags */}
      <div className="flex flex-wrap gap-1.5">
        {sdgTags.map((tag, i) => (
          <Badge
            key={i}
            variant="outline"
            className="text-xs bg-accent/5 border-accent/20 text-accent"
          >
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  );
}
