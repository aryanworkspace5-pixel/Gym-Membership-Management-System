import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Dumbbell, Activity, Flame, Trophy, HeartPulse, Users,
  ShieldCheck, Sparkles, ChevronRight, Star, ArrowRight, Quote,
} from "lucide-react";

import heroImg from "@/assets/hero-deadlift.jpg";
import gymInterior from "@/assets/gym-interior.jpg";
import transformImg from "@/assets/transformation.jpg";
import strengthImg from "@/assets/training-strength.jpg";
import cardioImg from "@/assets/training-cardio.jpg";

import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/site/SectionHeading";
import { LeadForm } from "@/components/site/LeadForm";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "V11 Gym — Best Gym in Roorkee | Strength, Cardio & Fitness" },
      { name: "description", content: "Transform your body at V11 Gym in Roorkee. Modern equipment, expert coaching, weight loss & athlete programs. Book a free trial today." },
      { property: "og:title", content: "V11 Gym — Best Gym in Roorkee" },
      { property: "og:description", content: "Strength, cardio, weight loss & athletic training in Roorkee. Book a free trial today." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

const services = [
  { Icon: Dumbbell, title: "Strength Training", desc: "Progressive programs to build raw strength and lean muscle.", img: strengthImg },
  { Icon: Activity, title: "Cardio Training", desc: "Burn fat, build endurance and a healthier heart.", img: cardioImg },
  { Icon: Flame, title: "Weight Loss Programs", desc: "Structured fat-loss coaching tailored to your body and lifestyle.", img: strengthImg },
  { Icon: Trophy, title: "Muscle Building", desc: "Hypertrophy-focused splits for serious size and aesthetics.", img: transformImg },
  { Icon: HeartPulse, title: "Athlete Conditioning", desc: "Speed, power, agility for college athletes and sports players.", img: cardioImg },
  { Icon: Users, title: "General Fitness", desc: "Mobility, conditioning and habits for healthier daily living.", img: gymInterior },
];

const trust = [
  { Icon: Dumbbell, label: "Modern Equipment" },
  { Icon: Users, label: "Athlete Friendly" },
  { Icon: ShieldCheck, label: "Expert Guidance" },
  { Icon: Sparkles, label: "Clean Facility" },
  { Icon: Trophy, label: "Results Driven" },
];

const whyUs = [
  { Icon: Dumbbell, title: "Modern Equipment", text: "Imported strength racks, full plate weight selection, and pristine cardio floor." },
  { Icon: Sparkles, title: "Clean & Hygienic", text: "Sanitised daily. Bright, ventilated and spacious — built for serious training." },
  { Icon: Users, title: "Beginner Friendly", text: "Zero judgement. Our coaches walk you through every movement, every set." },
  { Icon: Trophy, title: "Athlete Focused", text: "Sport-specific programming for cricketers, footballers, runners and lifters." },
  { Icon: HeartPulse, title: "Affordable Memberships", text: "Premium training without the premium price tag. Plans for every goal." },
  { Icon: ShieldCheck, title: "Supportive Community", text: "Train alongside the most motivated crew in Roorkee. Energy is contagious." },
];

const stats = [
  { value: "1,200+", label: "Active Members" },
  { value: "500+", label: "Transformations" },
  { value: "4.9★", label: "Member Rating" },
  { value: "15+", label: "Expert Coaches" },
];

const reviews = [
  { name: "Rohit S.", role: "Member · 2 years", text: "Excellent gym environment with quality equipment and a motivating atmosphere. The coaches push you to actually hit your goals.", stars: 5 },
  { name: "Priya M.", role: "Lost 14 kg", text: "Great trainers and supportive members. The fat-loss program completely changed my routine — and my confidence.", stars: 5 },
  { name: "Aman T.", role: "Athlete", text: "The conditioning sessions translated directly to the field. Speed, recovery, endurance — all noticeably better in one season.", stars: 5 },
];

function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative isolate overflow-hidden bg-ink text-ink-foreground">
        <div className="absolute inset-0 -z-10">
          <img src={heroImg} alt="V11 Gym athlete training" width={1920} height={1080}
            className="h-full w-full object-cover opacity-65" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
        </div>

        <div className="mx-auto max-w-7xl container-px pt-20 pb-24 md:pt-32 md:pb-36 grid lg:grid-cols-12 gap-10 items-center min-h-[88vh]">
          <div className="lg:col-span-7 rise">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/15 backdrop-blur text-xs font-semibold uppercase tracking-widest">
              <span className="h-2 w-2 rounded-full bg-primary pulse-dot" /> Roorkee · Uttarakhand
            </div>
            <h1 className="mt-5 h-display text-white">
              Transform Your Body.<br />
              <span className="text-primary">Unlock Your Potential.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg md:text-xl text-white/75 leading-relaxed">
              Professional gym & cardio training in Roorkee. Modern equipment. Expert coaching. A community built around results.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="hero" size="xl">
                <Link to="/contact">Start Your Fitness Journey <ArrowRight className="h-4 w-4" /></Link>
              </Button>
              <Button asChild variant="outlineLight" size="xl">
                <Link to="/contact">Book A Free Trial</Link>
              </Button>
            </div>

            <dl className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl">
              {stats.map((s) => (
                <div key={s.label}>
                  <dt className="stat-num">{s.value}</dt>
                  <dd className="mt-1 text-xs uppercase tracking-widest text-white/60">{s.label}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="hidden lg:block lg:col-span-5">
            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl bg-primary/20 blur-3xl" />
              <div className="relative rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur p-6">
                <p className="eyebrow">Free Trial</p>
                <h3 className="mt-2 font-display text-2xl uppercase text-white">Try V11 — On Us</h3>
                <p className="mt-1 text-sm text-white/65">One free session. No pressure. Just bring your shoes.</p>
                <div className="mt-5">
                  <LeadForm source="free_trial" showMessage={false} ctaLabel="Claim Free Trial" variant="dark" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST MARQUEE */}
      <section className="border-y border-border bg-surface py-6 overflow-hidden">
        <div className="flex gap-12 md:gap-20 marquee-track whitespace-nowrap">
          {[...trust, ...trust, ...trust].map((t, i) => (
            <div key={i} className="flex items-center gap-3 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
              <t.Icon className="h-5 w-5 text-primary" />
              {t.label}
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section className="section bg-background">
        <div className="mx-auto max-w-7xl container-px">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <SectionHeading
              eyebrow="What We Offer"
              title="Training Built Around Your Goals"
              description="From your first squat to your next personal record — programmed coaching for every level."
            />
            <Button asChild variant="outline" size="lg" className="self-start md:self-end">
              <Link to="/services">View All Services <ChevronRight className="h-4 w-4" /></Link>
            </Button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s) => (
              <article key={s.title} className="card-premium group">
                <div className="aspect-[16/10] overflow-hidden">
                  <img src={s.img} alt={s.title} loading="lazy" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="p-6">
                  <div className="grid h-10 w-10 place-items-center rounded-md bg-primary/10 text-primary mb-4">
                    <s.Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-xl font-bold uppercase">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                  <Link to="/services" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary group/link">
                    Learn more <ArrowRight className="h-4 w-4 transition-transform group-hover/link:translate-x-1" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* WHY V11 — split with image */}
      <section className="section bg-surface">
        <div className="mx-auto max-w-7xl container-px grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative order-2 lg:order-1">
            <img src={gymInterior} alt="Inside V11 Gym Roorkee" loading="lazy"
              className="rounded-2xl shadow-[var(--shadow-card)] aspect-[4/3] object-cover w-full" />
            <div className="absolute -bottom-6 -right-6 hidden md:block card-ink rounded-xl p-5 max-w-xs shadow-2xl">
              <p className="text-3xl font-display font-bold text-primary">4.9★</p>
              <p className="mt-1 text-xs uppercase tracking-widest text-white/60">Member Rating · 500+ Reviews</p>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <SectionHeading
              eyebrow="Why V11 Gym"
              title="Roorkee's Most Trusted Fitness Destination"
              description="Six reasons our members stay, refer friends, and keep crushing personal bests."
            />
            <div className="mt-8 grid sm:grid-cols-2 gap-5">
              {whyUs.map((w) => (
                <div key={w.title} className="flex gap-3">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
                    <w.Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold">{w.title}</h4>
                    <p className="mt-1 text-sm text-muted-foreground">{w.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TRANSFORMATION */}
      <section className="section relative bg-ink text-ink-foreground overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <img src={transformImg} alt="" className="w-full h-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-transparent" />
        </div>
        <div className="relative mx-auto max-w-7xl container-px">
          <SectionHeading
            eyebrow="Real Results"
            title="Transformations Built At V11"
            description="Discipline, programming and consistency. The V11 method, applied."
            light
          />
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {[
              { name: "Vikram", goal: "Muscle Gain", change: "+8 kg lean mass · 16 weeks" },
              { name: "Neha", goal: "Fat Loss", change: "-12 kg · 5 months" },
              { name: "Arjun", goal: "Athletic Performance", change: "+22% vertical · 12 weeks" },
            ].map((t) => (
              <div key={t.name} className="rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur p-6">
                <div className="aspect-square rounded-lg bg-gradient-to-br from-primary/30 to-white/5 grid place-items-center mb-4">
                  <Trophy className="h-12 w-12 text-primary" />
                </div>
                <p className="eyebrow">{t.goal}</p>
                <h3 className="mt-1 font-display text-2xl uppercase">{t.name}</h3>
                <p className="mt-1 text-sm text-white/65">{t.change}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section bg-background">
        <div className="mx-auto max-w-7xl container-px">
          <SectionHeading
            eyebrow="What Members Say"
            title="Loved By Roorkee's Fitness Community"
            align="center"
          />
          <div className="mt-12 grid md:grid-cols-3 gap-6">
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
          <div className="mt-10 text-center">
            <Button asChild variant="outline" size="lg">
              <Link to="/testimonials">Read More Reviews</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* MEMBERSHIP CTA */}
      <section className="section bg-ink text-ink-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-4xl container-px text-center">
          <p className="eyebrow justify-center">Your Next Chapter</p>
          <h2 className="mt-3 h-display text-white">
            Ready To Become The <span className="text-primary">Strongest Version</span> Of Yourself?
          </h2>
          <p className="mt-5 text-lg text-white/70 max-w-2xl mx-auto">
            One decision. One trial. One lifetime of stronger days. Join 1,200+ members already transforming at V11.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <Button asChild variant="hero" size="xl">
              <Link to="/pricing">Join V11 Gym Today</Link>
            </Button>
            <Button asChild variant="outlineLight" size="xl">
              <Link to="/contact">Get Membership Details</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
