import { createFileRoute, Link } from "@tanstack/react-router";
import { Target, Eye, HeartHandshake, Award, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/site/SectionHeading";
import gymInterior from "@/assets/gym-interior.jpg";
import strengthImg from "@/assets/training-strength.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About V11 Gym — Roorkee's Fitness Destination" },
      { name: "description", content: "Building stronger bodies and stronger lives in Roorkee. Discover the V11 Gym story, mission, and philosophy." },
      { property: "og:title", content: "About V11 Gym" },
      { property: "og:description", content: "Our mission, philosophy, and the community behind Roorkee's premier gym." },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

const pillars = [
  { Icon: Target, title: "Mission", text: "To make professional, results-driven fitness accessible to every person in Roorkee — regardless of starting point." },
  { Icon: Eye, title: "Vision", text: "To build Uttarakhand's most respected fitness community, known for transformations that last decades, not weeks." },
  { Icon: HeartHandshake, title: "Philosophy", text: "Discipline over motivation. Consistency over intensity. Coaching over guesswork. Community over isolation." },
  { Icon: Award, title: "Commitment", text: "Every member gets real coaching, real programming, and a clean, well-equipped facility — every single day." },
];

function AboutPage() {
  return (
    <>
      <section className="bg-ink text-ink-foreground pt-20 pb-16 md:pt-28 md:pb-24">
        <div className="mx-auto max-w-7xl container-px grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="eyebrow">About V11 Gym</p>
            <h1 className="mt-3 h-display text-white">
              Building Stronger Bodies <span className="text-primary">& Stronger Lives</span>
            </h1>
            <p className="mt-5 text-lg text-white/70 leading-relaxed">
              V11 Gym was founded with a single belief — that everyone in Roorkee deserves access to the kind of training, environment, and coaching that produces real, lasting transformations.
            </p>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-primary/20 blur-3xl" />
            <img src={gymInterior} alt="V11 Gym interior" className="relative rounded-2xl aspect-[4/3] w-full object-cover border border-white/10" />
          </div>
        </div>
      </section>

      <section className="section bg-background">
        <div className="mx-auto max-w-7xl container-px">
          <SectionHeading
            eyebrow="Our Story"
            title="More Than A Gym. A Movement."
            description="What started as a passion for training became Roorkee's most trusted fitness destination. Today, V11 Gym is where students, athletes, professionals and families come to outwork their yesterdays — together."
          />

          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((p) => (
              <div key={p.title} className="card-premium p-6">
                <div className="grid h-12 w-12 place-items-center rounded-lg bg-primary/10 text-primary mb-4">
                  <p.Icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-xl font-bold uppercase">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-surface">
        <div className="mx-auto max-w-7xl container-px grid lg:grid-cols-2 gap-12 items-center">
          <img src={strengthImg} alt="Training at V11" loading="lazy" className="rounded-2xl shadow-[var(--shadow-card)] aspect-[4/3] w-full object-cover" />
          <div>
            <SectionHeading
              eyebrow="Community Focus"
              title="Train Hard. Lift Each Other."
              description="The V11 difference isn't just the equipment — it's the people. Members spotting each other through PRs. Coaches checking on form. A culture where everyone, from first-time gym-goer to seasoned athlete, feels seen and supported."
            />
            <ul className="mt-6 space-y-3 text-sm">
              {[
                "A judgement-free environment for every body and every goal",
                "Coaches who actually coach — not just count reps",
                "Programming that progresses you, not just exhausts you",
                "Long-term transformations, not 30-day fads",
              ].map((t) => (
                <li key={t} className="flex gap-2"><span className="text-primary font-bold">→</span>{t}</li>
              ))}
            </ul>
            <Button asChild variant="hero" size="lg" className="mt-7">
              <Link to="/contact">Become A Member <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="section bg-background">
        <div className="mx-auto max-w-7xl container-px">
          <SectionHeading eyebrow="The Team" title="Coaches Who've Been There" align="center" />
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "Head Coach", role: "Strength & Conditioning" },
              { name: "Performance Coach", role: "Athletes & Sports" },
              { name: "Nutrition Coach", role: "Weight Loss & Body Recomp" },
            ].map((c) => (
              <div key={c.name} className="card-premium p-6 text-center">
                <div className="mx-auto h-24 w-24 rounded-full bg-gradient-to-br from-primary to-primary/40 grid place-items-center text-3xl font-display font-bold text-white">V</div>
                <h3 className="mt-4 font-display text-lg font-bold uppercase">{c.name}</h3>
                <p className="text-sm text-muted-foreground">{c.role}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-muted-foreground">Full team profiles coming soon.</p>
        </div>
      </section>
    </>
  );
}
