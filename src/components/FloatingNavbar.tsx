import { Link, useLocation } from "react-router-dom";
import { Home, Compass, Zap, Lock, User, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { label: "Home", href: "/", icon: <Home className="w-4 h-4" /> },
  { label: "Explore", href: "/explore", icon: <Compass className="w-4 h-4" /> },
  { label: "Matcher", href: "/matcher", icon: <Zap className="w-4 h-4" /> },
  { label: "Escrow", href: "/escrow", icon: <Lock className="w-4 h-4" /> },
  { label: "Profile", href: "/profile", icon: <User className="w-4 h-4" /> },
];

interface FloatingNavbarProps {
  isAuthenticated?: boolean;
  onLogout?: () => void;
}

export function FloatingNavbar({ isAuthenticated = false, onLogout }: FloatingNavbarProps) {
  const location = useLocation();

  return (
    <nav className="floating-navbar">
      <div className="flex items-center gap-1">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 px-4 py-2 mr-2"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-cta flex items-center justify-center">
            <Zap className="w-5 h-5 text-cta-foreground" />
          </div>
          <span className="font-display font-bold text-lg hidden sm:block">NexusR&D</span>
        </Link>

        {/* Nav Links */}
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              {item.icon}
              <span className="hidden md:block">{item.label}</span>
            </Link>
          );
        })}

        {/* Auth Button */}
        {isAuthenticated ? (
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 ml-2 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden md:block">Logout</span>
          </button>
        ) : (
          <Link
            to="/login"
            className="pill-button-primary ml-2 py-2 text-sm"
          >
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
}
