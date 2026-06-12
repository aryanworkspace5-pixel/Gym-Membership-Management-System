import { createFileRoute, Link } from "@tanstack/react-router";
import { Dumbbell, Activity, Flame, Trophy, HeartPulse, Users, Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/site/SectionHeading";
import strengthImg from "@/assets/training-strength.jpg";
import cardioImg from "@/assets/training-cardio.jpg";
import gymInterior from "@/assets/gym-interior.jpg";
import transformImg from "@/assets/transformation.jpg";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Training Services — V11 Gym, Roorkee" },
      { name: "description", content: "Strength training, cardio, weight loss, muscle building, and athlete conditioning programs at V11 Gym Roorkee — built around your goals." },
      { property: "og:title", content: "Training Services — V11 Gym" },
      { property: "og:description", content: "Programmed coaching for strength, fat loss, muscle building, and athletic performance in Roorkee." },
      { property: "og:url", content: "/services" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: ServicesPage,
});

const services = [
  {
    Icon: Dumbbell, title: "Strength Training", img: strengthImg,
    desc: "Get measurably stronger with periodised programs that focus on the big lifts — squat, bench, deadlift, and overhead press.",
    benefits: ["Build raw strength", "Increase lean muscle", "Progressive overload that actually works"],
    who: "Lifters at any level — from total beginners to competitive athletes.",
    results: "Expect noticeable strength gains in your first 6–8 weeks, with consistent progress month over month.",
  },
  {
    Icon: Activity, title: "Cardio Training", img: cardioImg,
    desc: "Treadmills, ellipticals, bikes and conditioning circuits — programmed to burn fat efficiently and build a stronger engine.",
    benefits: ["Improve endurance", "Burn calories effectively", "Build a healthier heart"],
    who: "Anyone wanting to lose weight, improve stamina, or supplement their lifting.",
    results: "Improved resting heart rate, better cardiovascular capacity, and visible body composition changes.",
  },
  {
    Icon: Flame, title: "Weight Loss Programs", img: strengthImg,
    desc: "A structured fat-loss plan combining strength training, conditioning and nutrition guidance — without crash diets.",
    benefits: ["Sustainable fat loss", "Habit-based coaching", "Personalised plan reviews"],
    who: "Members who want to lose 5–25+ kg in a healthy, repeatable way.",
    results: "Average member loses 0.5–1 kg per week while preserving (or building) muscle.",
  },
  {
    Icon: Trophy, title: "Muscle Building", img: transformImg,
    desc: "Hypertrophy-focused training splits, volume management and recovery protocols designed for serious size and aesthetics.",
    benefits: ["Visible muscle growth", "Better symmetry", "Long-term programming"],
    who: "Trainees focused on physique, bodybuilding, or pure muscle gain.",
    results: "1–2 kg of lean mass per 8 weeks when paired with proper nutrition.",
  },
  {
    Icon: HeartPulse, title: "Athlete Performance Training", img: cardioImg,
    desc: "Sport-specific conditioning for speed, power, agility and injury resilience — for cricketers, footballers, sprinters and lifters.",
    benefits: ["Explosive power", "First-step speed", "Reduced injury risk"],
    who: "School, college and amateur athletes preparing for competitive seasons.",
    results: "Measurable improvements in sprint times, vertical jump, and on-field endurance.",
  },
  {
    Icon: Users, title: "General Fitness", img: gymInterior,
    desc: "All-round training for people who simply want to feel better, move better, and stay healthy for life.",
    benefits: ["Mobility & posture", "Daily energy", "Sustainable routine"],
    who: "Beginners, professionals, and anyone returning to fitness after a break.",
    results: "Better sleep, more energy, reduced aches — usually within 4 weeks.",
  },
];

function ServicesPage() {
  return (
    <>
      <section className="bg-ink text-ink-foreground pt-20 pb-16 md:pt-28 md:pb-20">
        <div className="mx-auto max-w-7xl container-px">
          <p className="eyebrow">Our Services</p>
          <h1 className="mt-3 h-display text-white max-w-3xl">Programs Built To Deliver Real Results</h1>
          <p className="mt-5 max-w-2xl text-lg text-white/70">
            Whether you're chasing a first pull-up or a podium finish — we have a structured pathway to get you there.
          </p>
        </div>
      </section>

      <section className="section bg-background">
        <div className="mx-auto max-w-7xl container-px space-y-20">
          {services.map((s, i) => (
            <article key={s.title} className={`grid lg:grid-cols-2 gap-10 items-center ${i % 2 === 1 ? "lg:[&>div:first-child]:order-2" : ""}`}>
              <div>
                <img src={s.img} alt={s.title} loading="lazy" className="rounded-2xl shadow-[var(--shadow-card)] aspect-[4/3] w-full object-cover" />
              </div>
              <div>
                <div className="inline-flex items-center gap-2 text-primary mb-3">
                  <s.Icon className="h-5 w-5" />
                  <span className="eyebrow !mb-0">Service {String(i + 1).padStart(2, "0")}</span>
                </div>
                <h2 className="h-section">{s.title}</h2>
                <p className="mt-4 text-muted-foreground leading-relaxed">{s.desc}</p>

                <div className="mt-6 space-y-2">
                  {s.benefits.map((b) => (
                    <div key={b} className="flex gap-2 items-start">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">{b}</span>
                    </div>
                  ))}
                </div>

                <dl className="mt-6 grid sm:grid-cols-2 gap-4 text-sm">
                  <div className="rounded-lg bg-surface p-4 border border-border">
                    <dt className="text-xs font-bold uppercase tracking-wider text-primary">Who It's For</dt>
                    <dd className="mt-1 text-muted-foreground">{s.who}</dd>
                  </div>
                  <div className="rounded-lg bg-surface p-4 border border-border">
                    <dt className="text-xs font-bold uppercase tracking-wider text-primary">Expected Results</dt>
                    <dd className="mt-1 text-muted-foreground">{s.results}</dd>
                  </div>
                </dl>

                <Button asChild variant="hero" size="lg" className="mt-6">
                  <Link to="/contact">Start This Program <ArrowRight className="h-4 w-4" /></Link>
                </Button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section bg-surface">
        <div className="mx-auto max-w-4xl container-px text-center">
          <h2 className="h-section">Not Sure Which Program Fits?</h2>
          <p className="mt-4 text-lg text-muted-foreground">Book a free trial — we'll assess your goals and recommend the right path.</p>
          <Button asChild variant="hero" size="xl" className="mt-7">
            <Link to="/contact">Book A Free Trial</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
