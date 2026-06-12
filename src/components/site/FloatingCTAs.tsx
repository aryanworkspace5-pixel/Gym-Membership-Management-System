import { Link, useRouterState } from "@tanstack/react-router";
import { MessageCircle, Phone } from "lucide-react";
import { whatsappLink, telLink } from "@/lib/site-config";

export function FloatingCTAs() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  // Don't show sticky CTA on contact (form is already there)
  const hideSticky = path === "/contact";

  return (
    <>
      {/* Floating WhatsApp */}
      <a
        href={whatsappLink()}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-40 grid place-items-center h-14 w-14 rounded-full bg-[#25D366] text-white shadow-2xl hover:scale-110 transition-transform pulse-dot"
      >
        <MessageCircle className="h-7 w-7" strokeWidth={2.25} />
      </a>

      {/* Sticky mobile CTA bar */}
      {!hideSticky && (
        <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-ink border-t border-white/10 px-3 py-2 grid grid-cols-2 gap-2 shadow-[0_-8px_24px_-12px_rgba(0,0,0,0.4)]">
          <a
            href={telLink}
            className="inline-flex items-center justify-center gap-2 h-11 rounded-md border border-white/20 text-white font-bold uppercase text-xs tracking-wider"
          >
            <Phone className="h-4 w-4" /> Call
          </a>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center gap-2 h-11 rounded-md bg-primary text-primary-foreground font-bold uppercase text-xs tracking-wider"
          >
            Book Free Trial
          </Link>
        </div>
      )}
    </>
  );
}
