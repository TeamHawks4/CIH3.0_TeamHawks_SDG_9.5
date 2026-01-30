import { CheckCircle2, MapPin, DollarSign, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface FunderCardProps {
  name: string;
  type: string;
  avatar?: string;
  verified?: boolean;
  countries: string[];
  checkRange: string;
  stages: string[];
  industries: string[];
  openRate: number;
  onSubmit?: () => void;
  onViewProfile?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export function FunderCard({
  name,
  type,
  avatar,
  verified = false,
  countries,
  checkRange,
  stages,
  industries,
  openRate,
  onSubmit,
  onViewProfile,
  className,
  style,
}: FunderCardProps) {
  const getOpenRateColor = (rate: number) => {
    if (rate >= 90) return "text-success";
    if (rate >= 60) return "text-accent";
    return "text-warning";
  };

  return (
    <div
      className={cn(
        "bg-card rounded-xl border border-border/50 p-4 card-hover",
        className
      )}
      style={style}
    >
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center overflow-hidden flex-shrink-0">
          {avatar ? (
            <img src={avatar} alt={name} className="w-full h-full object-cover" />
          ) : (
            <Building2 className="w-6 h-6 text-muted-foreground" />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="font-semibold text-foreground truncate">{name}</h3>
            {verified && (
              <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
            )}
          </div>
          <p className="text-sm text-muted-foreground">{type}</p>
        </div>

        {/* Countries */}
        <div className="hidden md:flex flex-col items-start gap-1 min-w-[100px]">
          {countries.slice(0, 2).map((country, i) => (
            <div key={i} className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="w-3 h-3" />
              {country}
            </div>
          ))}
          {countries.length > 2 && (
            <span className="text-xs text-muted-foreground">+{countries.length - 2}</span>
          )}
        </div>

        {/* Check Range */}
        <div className="hidden lg:flex items-center gap-1.5 text-sm text-foreground min-w-[100px]">
          <DollarSign className="w-4 h-4 text-success" />
          {checkRange}
        </div>

        {/* Stages */}
        <div className="hidden xl:flex flex-wrap gap-1 min-w-[120px]">
          {stages.slice(0, 2).map((stage, i) => (
            <Badge key={i} variant="secondary" className="text-xs">
              {stage}
            </Badge>
          ))}
          {stages.length > 2 && (
            <Badge variant="secondary" className="text-xs">+{stages.length - 2}</Badge>
          )}
        </div>

        {/* Industries */}
        <div className="hidden xl:flex flex-wrap gap-1 min-w-[100px]">
          {industries.slice(0, 2).map((industry, i) => (
            <Badge key={i} variant="outline" className="text-xs">
              {industry}
            </Badge>
          ))}
          {industries.length > 2 && (
            <Badge variant="outline" className="text-xs">+{industries.length - 2}</Badge>
          )}
        </div>

        {/* Open Rate */}
        <div className="hidden md:flex items-center gap-2 min-w-[60px]">
          <span className={cn("font-semibold", getOpenRateColor(openRate))}>
            ●
          </span>
          <span className="font-medium">{openRate}%</span>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <button
            onClick={onSubmit}
            className="pill-button-primary py-2 px-4 text-sm"
          >
            Submit deck
          </button>
          <button
            onClick={onViewProfile}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            View profile
          </button>
        </div>
      </div>
    </div>
  );
}
