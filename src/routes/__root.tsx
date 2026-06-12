import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { FloatingCTAs } from "@/components/site/FloatingCTAs";
import { Toaster } from "@/components/ui/sonner";
import { site } from "@/lib/site-config";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="eyebrow justify-center mb-3">404</p>
        <h1 className="h-section">Page Not Found</h1>
        <p className="mt-3 text-muted-foreground">
          The page you're looking for doesn't exist or has moved. Let's get you back on track.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary/90"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="h-section">Something Went Wrong</h1>
        <p className="mt-3 text-muted-foreground">Try refreshing or head back home.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary/90"
          >
            Try Again
          </button>
          <a href="/" className="inline-flex items-center justify-center rounded-md border border-input bg-background px-5 py-3 text-sm font-bold uppercase tracking-wider hover:bg-accent">
            Go Home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "V11 Gym — Best Gym in Roorkee | Strength, Cardio & Fitness Training" },
      { name: "description", content: "Transform your body at V11 Gym, Roorkee's premier fitness destination. Modern equipment, expert coaching, and proven programs for strength, weight loss, and athletic performance." },
      { name: "author", content: "V11 Gym" },
      { name: "theme-color", content: "#E63946" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "V11 Gym" },
      { property: "og:title", content: "V11 Gym — Best Gym in Roorkee" },
      { property: "og:description", content: "Premium strength, cardio, weight loss & athletic training in Roorkee. Book a free trial today." },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "V11 Gym — Best Gym in Roorkee" },
      { name: "twitter:description", content: "Premium strength, cardio, weight loss & athletic training in Roorkee." },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Oswald:wght@500;600;700&display=swap" },
      { rel: "icon", type: "image/svg+xml", href: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='6' fill='%23E63946'/%3E%3Ctext x='16' y='22' font-family='Arial Black,sans-serif' font-size='16' font-weight='900' fill='white' text-anchor='middle'%3EV%3C/text%3E%3C/svg%3E" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "HealthClub",
          name: site.name,
          description: "Premium gym and fitness center in Roorkee offering strength training, cardio, weight loss programs, and athletic conditioning.",
          address: {
            "@type": "PostalAddress",
            streetAddress: site.address,
            addressLocality: site.city,
            addressRegion: site.region,
            addressCountry: "IN",
          },
          telephone: site.phone,
          email: site.email,
          openingHours: "Mo-Sa 05:00-22:00, Su 06:00-12:00",
          priceRange: "₹₹",
          areaServed: { "@type": "City", name: "Roorkee" },
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouter().state.location.pathname;
  const isApp = pathname.startsWith("/admin") || pathname.startsWith("/auth");

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen flex-col">
        {!isApp && <Header />}
        <main className={isApp ? "flex-1" : "flex-1 pb-20 md:pb-0"}>
          <Outlet />
        </main>
        {!isApp && <Footer />}
      </div>
      {!isApp && <FloatingCTAs />}
      <Toaster position="top-center" richColors />
    </QueryClientProvider>
  );
}
