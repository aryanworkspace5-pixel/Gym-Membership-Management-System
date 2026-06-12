import { createFileRoute } from "@tanstack/react-router";
import { Phone, Mail, MapPin, MessageCircle, Clock, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/site/SectionHeading";
import { LeadForm } from "@/components/site/LeadForm";
import { site, telLink, mapsLink, whatsappLink } from "@/lib/site-config";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact V11 Gym Roorkee — Book A Free Trial" },
      { name: "description", content: "Visit, call, or message V11 Gym in Roorkee. Book your free trial session today and start your fitness journey." },
      { property: "og:title", content: "Contact V11 Gym" },
      { property: "og:description", content: "Reach V11 Gym Roorkee — phone, WhatsApp, email, and directions. Free trial available." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <>
      <section className="bg-ink text-ink-foreground pt-20 pb-16 md:pt-28 md:pb-20">
        <div className="mx-auto max-w-7xl container-px">
          <p className="eyebrow">Get In Touch</p>
          <h1 className="mt-3 h-display text-white">Let's Get You <span className="text-primary">Started.</span></h1>
          <p className="mt-5 max-w-2xl text-lg text-white/70">
            One form. One call. One free session. That's all that stands between you and your strongest year.
          </p>
        </div>
      </section>

      <section className="section bg-background">
        <div className="mx-auto max-w-7xl container-px grid lg:grid-cols-5 gap-10">
          <div className="lg:col-span-3">
            <SectionHeading eyebrow="Contact Form" title="Tell Us About Your Goals" description="A coach will reach out within a few hours to schedule your free trial." />
            <div className="mt-8">
              <LeadForm source="contact" />
            </div>
          </div>

          <aside className="lg:col-span-2 space-y-4">
            <div className="card-ink rounded-2xl p-6">
              <h3 className="font-display text-xl uppercase font-bold text-white">Visit / Call</h3>
              <ul className="mt-5 space-y-4 text-sm">
                <li className="flex gap-3 text-white/85">
                  <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="font-semibold text-white">Address</p>
                    <p className="text-white/65">{site.address}</p>
                  </div>
                </li>
                <li className="flex gap-3 text-white/85">
                  <Phone className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="font-semibold text-white">Phone</p>
                    <a href={telLink} className="text-white/65 hover:text-primary">{site.phone}</a>
                  </div>
                </li>
                <li className="flex gap-3 text-white/85">
                  <Mail className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="font-semibold text-white">Email</p>
                    <a href={`mailto:${site.email}`} className="text-white/65 hover:text-primary break-all">{site.email}</a>
                  </div>
                </li>
                <li className="flex gap-3 text-white/85">
                  <Clock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="font-semibold text-white">Hours</p>
                    <p className="text-white/65">{site.hours}</p>
                  </div>
                </li>
              </ul>
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-2">
                <Button asChild variant="hero" size="default">
                  <a href={telLink}><Phone className="h-4 w-4" /> Call</a>
                </Button>
                <Button asChild variant="whatsapp" size="default">
                  <a href={whatsappLink()} target="_blank" rel="noreferrer"><MessageCircle className="h-4 w-4" /> WhatsApp</a>
                </Button>
                <Button asChild variant="outlineLight" size="default">
                  <a href={mapsLink} target="_blank" rel="noreferrer"><Navigation className="h-4 w-4" /> Directions</a>
                </Button>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden border border-border shadow-[var(--shadow-card)]">
              <iframe
                title="V11 Gym location"
                src={`https://maps.google.com/maps?q=${site.mapsQuery}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                className="w-full h-64 md:h-72"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
