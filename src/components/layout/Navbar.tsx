import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, Zap, Lock, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/home', label: 'Home', icon: Home },
  { path: '/explore', label: 'Explore', icon: Compass },
  { path: '/projects', label: 'Projects', icon: Zap },
  { path: '/escrow', label: 'Escrow', icon: Lock },
  { path: '/profile', label: 'Profile', icon: User },
];

export function Navbar() {
  const location = useLocation();
  const { user, signOut, role } = useAuth();

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-center">
          <div className="flex items-center gap-1 bg-secondary rounded-full p-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'nav-pill flex items-center gap-2',
                    isActive ? 'bg-navy text-white' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="absolute right-4">
            {user ? (
              <Button
                variant="ghost"
                onClick={() => signOut()}
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            ) : (
              <Link to="/login">
                <Button className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
