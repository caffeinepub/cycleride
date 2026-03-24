import { Button } from "@/components/ui/button";
import { Bike, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

interface NavbarProps {
  onLogin: () => void;
  onSignup: () => void;
  isAuthenticated: boolean;
  userName?: string;
  onLogout: () => void;
}

export default function Navbar({
  onLogin,
  onSignup,
  isAuthenticated,
  userName,
  onLogout,
}: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { label: "How It Works", href: "#how-it-works" },
    { label: "Services", href: "#services" },
    { label: "Safety", href: "#safety" },
    { label: "Pricing", href: "#pricing" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <a
            href="/"
            className="flex items-center gap-2 group"
            data-ocid="nav.link"
          >
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
              <Bike className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-heading font-bold text-xl text-foreground tracking-tight">
              Cycle<span className="text-primary">RIDE</span>
            </span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                data-ocid="nav.link"
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Auth Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-muted-foreground font-medium">
                  Hi, {userName || "Rider"}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onLogout}
                  data-ocid="nav.logout_button"
                  className="border-primary text-primary hover:bg-secondary"
                >
                  Log Out
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onLogin}
                  data-ocid="nav.login_button"
                  className="text-foreground hover:text-primary"
                >
                  Log In
                </Button>
                <Button
                  size="sm"
                  onClick={onSignup}
                  data-ocid="nav.signup_button"
                  className="bg-primary text-primary-foreground hover:bg-green-deep/90 rounded-full px-5"
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden border-t border-border bg-white"
          >
            <div className="px-4 py-4 flex flex-col gap-3">
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-medium text-muted-foreground hover:text-primary py-1"
                >
                  {link.label}
                </a>
              ))}
              <div className="flex gap-2 pt-2 border-t border-border">
                {isAuthenticated ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onLogout}
                    className="flex-1"
                  >
                    Log Out
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onLogin}
                      className="flex-1"
                    >
                      Log In
                    </Button>
                    <Button
                      size="sm"
                      onClick={onSignup}
                      className="flex-1 bg-primary text-primary-foreground"
                    >
                      Sign Up
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
