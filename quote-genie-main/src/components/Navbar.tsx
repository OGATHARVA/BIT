import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { isAuthenticated, getUser, logout } from "@/lib/auth";
import {
  FileText,
  Menu,
  X,
  Home,
  FolderOpen,
  Sparkles,
  Zap,
  User,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const authLinks = [
  { to: "/", label: "Home", icon: Home },
  { to: "/generator", label: "Generator", icon: Zap },
  { to: "/quotation", label: "Quotation", icon: FileText },
  { to: "/proposal", label: "Proposal", icon: Sparkles },
  { to: "/my-files", label: "My Files", icon: FolderOpen },
  { to: "/dashboard", label: "Profile", icon: User },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const loggedIn = isAuthenticated();
  const user = getUser();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="gradient-primary rounded-lg p-1.5">
            <FileText className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-foreground hidden sm:inline">Codify</span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-1">
          {loggedIn ? (
            <>
              {authLinks.map((link) => (
                <Link key={link.to} to={link.to}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "gap-1.5",
                      location.pathname === link.to && "bg-secondary text-secondary-foreground"
                    )}
                  >
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </Button>
                </Link>
              ))}
              <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-1.5 text-destructive">
                <LogOut className="h-4 w-4" /> Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link to="/signup">
                <Button size="sm" className="gradient-primary text-primary-foreground shadow-primary hover:opacity-90">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t bg-background px-4 pb-4 pt-2 space-y-1">
          {loggedIn ? (
            <>
              {authLinks.map((link) => (
                <Link key={link.to} to={link.to} onClick={() => setOpen(false)}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start gap-2",
                      location.pathname === link.to && "bg-secondary text-secondary-foreground"
                    )}
                  >
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </Button>
                </Link>
              ))}
              <Button variant="ghost" className="w-full justify-start gap-2 text-destructive" onClick={() => { handleLogout(); setOpen(false); }}>
                <LogOut className="h-4 w-4" /> Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">Login</Button>
              </Link>
              <Link to="/signup" onClick={() => setOpen(false)}>
                <Button className="w-full gradient-primary text-primary-foreground shadow-primary hover:opacity-90">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
