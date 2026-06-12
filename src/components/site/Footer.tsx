import { Link } from "@tanstack/react-router";
import { Dumbbell, Instagram, Facebook, Youtube, MapPin, Phone, Mail, Clock } from "lucide-react";
import { site, telLink, mapsLink, whatsappLink } from "@/lib/site-config";

export function Footer() {
  return (
    <footer className="bg-ink text-ink-foreground">
      <div className="mx-auto max-w-7xl container-px py-16 grid gap-12 md:grid-cols-4">
        <div className="md:col-span-1">
          <Link to="/" className="flex items-center gap-2 mb-4">
            <span className="grid h-9 w-9 place-items-center rounded-md bg-primary text-primary-foreground">
              <Dumbbell className="h-5 w-5" strokeWidth={2.5} />
            </span>
            <span className="font-display text-xl font-bold uppercase">V11<span className="text-primary">.</span>Gym</span>
          </Link>
          <p className="text-sm text-white/65 leading-relaxed">
            Roorkee's premier strength, cardio, and athletic-conditioning destination. Build strength. Burn fat. Outwork yesterday.
          </p>
          <div className="flex gap-3 mt-5">
            {[
              { href: site.social.instagram, Icon: Instagram, label: "Instagram" },
              { href: site.social.facebook, Icon: Facebook, label: "Facebook" },
              { href: site.social.youtube, Icon: Youtube, label: "YouTube" },
            ].map(({ href, Icon, label }) => (
              <a key={label} href={href} aria-label={label} target="_blank" rel="noreferrer"
                className="grid h-9 w-9 place-items-center rounded-md border border-white/15 hover:bg-primary hover:border-primary transition-colors">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider mb-4 text-white">Explore</h4>
          <ul className="space-y-2 text-sm text-white/65">
            <li><Link to="/" className="hover:text-primary">Home</Link></li>
            <li><Link to="/services" className="hover:text-primary">Services</Link></li>
            <li><Link to="/about" className="hover:text-primary">About</Link></li>
            <li><Link to="/pricing" className="hover:text-primary">Membership</Link></li>
            <li><Link to="/testimonials" className="hover:text-primary">Reviews</Link></li>
            <li><Link to="/faq" className="hover:text-primary">FAQ</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider mb-4 text-white">Visit Us</h4>
          <ul className="space-y-3 text-sm text-white/70">
            <li className="flex gap-3"><MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" /><a href={mapsLink} target="_blank" rel="noreferrer" className="hover:text-primary">{site.address}</a></li>
            <li className="flex gap-3"><Phone className="h-4 w-4 text-primary shrink-0 mt-0.5" /><a href={telLink} className="hover:text-primary">{site.phone}</a></li>
            <li className="flex gap-3"><Mail className="h-4 w-4 text-primary shrink-0 mt-0.5" /><a href={`mailto:${site.email}`} className="hover:text-primary break-all">{site.email}</a></li>
            <li className="flex gap-3"><Clock className="h-4 w-4 text-primary shrink-0 mt-0.5" /><span>{site.hours}</span></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider mb-4 text-white">Ready To Start?</h4>
          <p className="text-sm text-white/65 mb-4">Book a free trial session today.</p>
          <Link to="/contact" className="inline-flex items-center justify-center w-full px-5 py-3 rounded-md bg-primary text-primary-foreground font-bold uppercase tracking-wider text-sm hover:bg-primary/90 transition shadow-[var(--shadow-elegant)]">
            Book Free Trial
          </Link>
          <a href={whatsappLink()} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center justify-center w-full px-5 py-3 rounded-md border border-white/20 text-white font-bold uppercase tracking-wider text-sm hover:bg-white/10 transition">
            WhatsApp Us
          </a>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl container-px py-6 flex flex-col md:flex-row gap-3 items-center justify-between text-xs text-white/50">
          <p>© {new Date().getFullYear()} V11 Gym. All rights reserved.</p>
          <p>Roorkee's results-driven fitness destination.</p>
        </div>
      </div>
    </footer>
  );
}
