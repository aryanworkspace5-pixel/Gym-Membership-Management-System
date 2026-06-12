import { createFileRoute, Link } from "@tanstack/react-router";
import { Star, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/site/SectionHeading";

export const Route = createFileRoute("/testimonials")({
  head: () => ({
    meta: [
      { title: "Member Reviews & Success Stories — V11 Gym, Roorkee" },
      { name: "description", content: "Real reviews and transformations from V11 Gym members in Roorkee. See why our community keeps coming back." },
      { property: "og:title", content: "Reviews — V11 Gym" },
      { property: "og:description", content: "Authentic success stories from the V11 Gym Roorkee community." },
      { property: "og:url", content: "/testimonials" },
    ],
    links: [{ rel: "canonical", href: "/testimonials" }],
  }),
  component: TestimonialsPage,
});

const stats = [
  { value: "1,200+", label: "Active Members" },
  { value: "500+", label: "Success Stories" },
  { value: "98%", label: "Member Satisfaction" },
  { value: "75k+", label: "Training Hours" },
];

const reviews = [
  { name: "Rohit Sharma", role: "Member · 2 years", text: "Excellent gym environment with quality equipment and a motivating atmosphere. Coaches actually push you to hit your goals.", stars: 5 },
  { name: "Priya Mehra", role: "Lost 14 kg", text: "Great trainers and supportive members. The fat-loss program changed my routine — and my confidence.", stars: 5 },
  { name: "Aman Thapa", role: "College Athlete", text: "The conditioning translated straight to the field. Speed, recovery, endurance — all better in one season.", stars: 5 },
  { name: "Sneha K.", role: "Member · 1 year", text: "I joined as a complete beginner. Today I can deadlift my bodyweight and I look forward to every session.", stars: 5 },
  { name: "Vikram J.", role: "Gained 8 kg lean mass", text: "Structured program, honest feedback, no nonsense. V11 is the real deal in Roorkee.", stars: 5 },
  { name: "Neha B.", role: "Working Professional", text: "Clean facility, flexible timings, and trainers who remember your name. Best fitness decision I've made.", stars: 5 },
];

function TestimonialsPage() {
  return (
    <>
      <section className="bg-ink text-ink-foreground pt-20 pb-16 md:pt-28 md:pb-20">
        <div className="mx-auto max-w-7xl container-px text-center">
          <p className="eyebrow justify-center">Member Stories</p>
          <h1 className="mt-3 h-display text-white">Real People. <span className="text-primary">Real Results.</span></h1>
          <p className="mt-5 max-w-2xl mx-auto text-lg text-white/70">
            500+ transformations and counting. These are the people who showed up, did the work, and reshaped their lives.
          </p>
        </div>
      </section>

      <section className="bg-background py-12 border-b border-border">
        <div className="mx-auto max-w-7xl container-px">
          <dl className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <dt className="stat-num">{s.value}</dt>
                <dd className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="section bg-background">
        <div className="mx-auto max-w-7xl container-px">
          <SectionHeading eyebrow="Reviews" title="What Our Members Say" align="center" />
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((r) => (
              <article key={r.name} className="card-premium p-6 relative">
                <Quote className="h-8 w-8 text-primary/20 absolute top-4 right-4" />
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: r.stars }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-foreground leading-relaxed">"{r.text}"</p>
                <div className="mt-5 pt-5 border-t border-border">
                  <p className="font-bold">{r.name}</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">{r.role}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-surface">
        <div className="mx-auto max-w-3xl container-px text-center">
          <SectionHeading
            eyebrow="Your Turn"
            title="Write Your Own Success Story"
            description="Every transformation starts with a single session. Yours is one form away."
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
