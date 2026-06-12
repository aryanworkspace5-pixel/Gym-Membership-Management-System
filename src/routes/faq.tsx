import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/site/SectionHeading";

const faqs = [
  { q: "Do you offer trial sessions?", a: "Yes — every new visitor gets one free trial session. Walk in, train with us, and decide." },
  { q: "Is the gym suitable for beginners?", a: "Absolutely. A large portion of our members start from zero. Our coaches walk you through every movement until you're confident." },
  { q: "Do you have cardio equipment?", a: "Yes — treadmills, ellipticals, stationary bikes, rowers, and dedicated conditioning space." },
  { q: "Are trainers available?", a: "Certified coaches are on the floor throughout opening hours. Personalised coaching is included in the Premium plan." },
  { q: "What membership plans are available?", a: "We offer Basic, Standard, and Premium memberships — monthly, quarterly, half-yearly, and annual. Custom plans for students and athletes available on request." },
  { q: "What are your timings?", a: "Mon–Sat: 5:00 AM – 10:00 PM. Sun: 6:00 AM – 12:00 PM. Check the contact page or call us for any updates." },
  { q: "Do you have separate timings for women?", a: "Our gym is open to everyone at all hours. We maintain a respectful, judgement-free environment for every member." },
  { q: "Can I freeze my membership?", a: "Yes — memberships can be paused for genuine reasons (medical, travel). Talk to us at the front desk." },
];

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — V11 Gym Roorkee" },
      { name: "description", content: "Answers to common questions about V11 Gym Roorkee — trials, beginner support, equipment, trainers, plans, and timings." },
      { property: "og:title", content: "FAQ — V11 Gym" },
      { property: "og:description", content: "Common questions about V11 Gym memberships, training, and facilities." },
      { property: "og:url", content: "/faq" },
    ],
    links: [{ rel: "canonical", href: "/faq" }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }),
    }],
  }),
  component: FAQPage,
});

function FAQPage() {
  return (
    <>
      <section className="bg-ink text-ink-foreground pt-20 pb-16 md:pt-28 md:pb-20">
        <div className="mx-auto max-w-7xl container-px text-center">
          <p className="eyebrow justify-center">Frequently Asked</p>
          <h1 className="mt-3 h-display text-white">Questions, <span className="text-primary">Answered.</span></h1>
        </div>
      </section>

      <section className="section bg-background">
        <div className="mx-auto max-w-3xl container-px">
          <Accordion type="single" collapsible className="w-full space-y-3">
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border border-border rounded-xl px-5 bg-card">
                <AccordionTrigger className="text-left font-semibold hover:no-underline py-5">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-12 text-center">
            <p className="text-muted-foreground">Still have questions?</p>
            <Button asChild variant="hero" size="lg" className="mt-4">
              <Link to="/contact">Contact Us Now</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
