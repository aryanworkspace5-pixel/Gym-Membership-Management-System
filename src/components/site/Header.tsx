import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X, Dumbbell, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { telLink } from "@/lib/site-config";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/about", label: "About" },
  { to: "/pricing", label: "Membership" },
  { to: "/testimonials", label: "Reviews" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "bg-background/85 backdrop-blur-lg border-b border-border shadow-sm"
          : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between container-px">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-primary text-primary-foreground shadow-[var(--shadow-elegant)] group-hover:scale-105 transition-transform">
            <Dumbbell className="h-5 w-5" strokeWidth={2.5} />
          </span>
          <span className="font-display text-xl font-bold uppercase tracking-tight">
            V11<span className="text-primary">.</span>Gym
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-7">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.to === "/" }}
              className="text-sm font-medium text-foreground/75 hover:text-primary transition-colors relative data-[status=active]:text-foreground data-[status=active]:after:scale-x-100 after:absolute after:-bottom-1.5 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:scale-x-0 after:transition-transform after:origin-left"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <a href={telLink} className="text-sm font-semibold flex items-center gap-2 text-foreground hover:text-primary transition-colors">
            <Phone className="h-4 w-4" /> Call Now
          </a>
          <Button asChild variant="hero" size="default">
            <Link to="/contact">Book Free Trial</Link>
          </Button>
        </div>

        <button
          className="md:hidden grid place-items-center h-10 w-10 rounded-md hover:bg-accent"
          aria-label="Toggle menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-background">
          <nav className="flex flex-col container-px py-4 gap-1">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                activeOptions={{ exact: n.to === "/" }}
                className="px-3 py-3 rounded-md text-base font-medium hover:bg-accent data-[status=active]:bg-accent data-[status=active]:text-primary"
              >
                {n.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-2 pt-2 border-t border-border">
              <Button asChild variant="hero" size="lg">
                <Link to="/contact">Book Free Trial</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href={telLink}><Phone className="h-4 w-4" /> Call Now</a>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
