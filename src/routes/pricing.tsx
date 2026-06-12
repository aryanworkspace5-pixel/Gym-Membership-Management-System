import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/site/SectionHeading";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Membership & Pricing — V11 Gym, Roorkee" },
      { name: "description", content: "Affordable gym memberships in Roorkee. Compare V11 Gym Basic, Standard, and Premium plans. Includes strength, cardio and personalised coaching options." },
      { property: "og:title", content: "Membership Plans — V11 Gym" },
      { property: "og:description", content: "Choose the V11 Gym membership that matches your goals — Basic, Standard, or Premium." },
      { property: "og:url", content: "/pricing" },
    ],
    links: [{ rel: "canonical", href: "/pricing" }],
  }),
  component: PricingPage,
});

const plans = [
  {
    name: "Basic",
    tagline: "Get started.",
    features: ["Full gym access", "Strength & weight floor", "Locker facility", "Standard hours"],
    highlight: false,
  },
  {
    name: "Standard",
    tagline: "Most popular.",
    features: ["Everything in Basic", "Full cardio zone access", "Group floor sessions", "Extended hours"],
    highlight: true,
  },
  {
    name: "Premium",
    tagline: "Maximum support.",
    features: ["Everything in Standard", "Personalised coaching", "Nutrition guidance", "Priority support", "Goal-tracking reviews"],
    highlight: false,
  },
];

function PricingPage() {
  return (
    <>
      <section className="bg-ink text-ink-foreground pt-20 pb-16 md:pt-28 md:pb-20">
        <div className="mx-auto max-w-7xl container-px text-center">
          <p className="eyebrow justify-center">Membership Plans</p>
          <h1 className="mt-3 h-display text-white">Choose Your <span className="text-primary">Transformation Path</span></h1>
          <p className="mt-5 max-w-2xl mx-auto text-lg text-white/70">
            Premium training. Honest pricing. Cancel anytime — we keep you because we deliver, not because of contracts.
          </p>
        </div>
      </section>

      <section className="section bg-background">
        <div className="mx-auto max-w-7xl container-px">
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {plans.map((p) => (
              <article
                key={p.name}
                className={cn(
                  "relative rounded-2xl p-8 transition-all",
                  p.highlight
                    ? "card-ink shadow-2xl md:scale-105 md:-translate-y-2 ring-2 ring-primary"
                    : "card-premium",
                )}
              >
                {p.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider shadow-lg">
                    <Star className="h-3 w-3 fill-current" /> Most Popular
                  </div>
                )}
                <h3 className={cn("font-display text-3xl uppercase font-bold", p.highlight && "text-white")}>{p.name}</h3>
                <p className={cn("mt-1 text-sm", p.highlight ? "text-white/60" : "text-muted-foreground")}>{p.tagline}</p>

                <div className="mt-6 flex items-baseline gap-2">
                  <span className={cn("text-5xl font-display font-bold", p.highlight ? "text-primary" : "text-foreground")}>₹—</span>
                  <span className={cn("text-sm", p.highlight ? "text-white/60" : "text-muted-foreground")}>/ month</span>
                </div>
                <p className={cn("mt-1 text-xs", p.highlight ? "text-white/50" : "text-muted-foreground")}>
                  Contact us for current pricing
                </p>

                <ul className="mt-8 space-y-3">
                  {p.features.map((f) => (
                    <li key={f} className={cn("flex gap-2 items-start text-sm", p.highlight ? "text-white/85" : "text-foreground")}>
                      <Check className={cn("h-5 w-5 shrink-0 mt-0.5", p.highlight ? "text-primary" : "text-primary")} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  asChild
                  variant={p.highlight ? "hero" : "outline"}
                  size="lg"
                  className="mt-8 w-full"
                >
                  <Link to="/contact">Get Membership Details</Link>
                </Button>
              </article>
            ))}
          </div>

          <p className="mt-10 text-center text-sm text-muted-foreground">
            Quarterly, half-yearly & annual plans available with bigger discounts. Talk to us for student & athlete rates.
          </p>
        </div>
      </section>

      <section className="section bg-surface">
        <div className="mx-auto max-w-3xl container-px text-center">
          <SectionHeading
            eyebrow="No Risk"
            title="Try Before You Commit"
            description="Walk in for a free trial session. Train with us. See the facility. Meet the coaches. Then decide."
            align="center"
          />
          <Button asChild variant="hero" size="xl" className="mt-7">
            <Link to="/contact">Book A Free Trial</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
