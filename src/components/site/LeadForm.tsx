import { useState } from "react";
import { toast } from "sonner";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { submitLead, leadSchema, type LeadSource } from "@/lib/leads";

interface Props {
  source: LeadSource;
  showGoal?: boolean;
  showMessage?: boolean;
  showEmail?: boolean;
  ctaLabel?: string;
  variant?: "light" | "dark";
}

export function LeadForm({
  source,
  showGoal = true,
  showMessage = true,
  showEmail = true,
  ctaLabel = "Start Your Fitness Journey",
  variant = "light",
}: Props) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    const fd = new FormData(e.currentTarget);
    const raw = {
      name: String(fd.get("name") || ""),
      phone: String(fd.get("phone") || ""),
      email: String(fd.get("email") || ""),
      fitness_goal: String(fd.get("fitness_goal") || ""),
      message: String(fd.get("message") || ""),
    };
    const parsed = leadSchema.safeParse(raw);
    if (!parsed.success) {
      const map: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (map[i.path[0] as string] = i.message));
      setErrors(map);
      return;
    }
    setLoading(true);
    try {
      await submitLead(parsed.data, source);
      setDone(true);
      toast.success("We got it! Our team will reach out shortly.");
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again or call us.");
    } finally {
      setLoading(false);
    }
  }

  const dark = variant === "dark";
  const inputCls = dark
    ? "bg-white/5 border-white/15 text-white placeholder:text-white/40 focus-visible:border-primary"
    : "";
  const labelCls = dark ? "text-white/85" : "";

  if (done) {
    return (
      <div className={`rounded-xl p-8 text-center ${dark ? "bg-white/5 border border-white/10" : "bg-surface border border-border"}`}>
        <CheckCircle2 className="h-12 w-12 text-primary mx-auto mb-3" />
        <h3 className={`text-2xl font-display font-bold uppercase ${dark ? "text-white" : ""}`}>You're In.</h3>
        <p className={`mt-2 ${dark ? "text-white/70" : "text-muted-foreground"}`}>
          A V11 coach will contact you within a few hours to book your free trial.
        </p>
        <Button variant="outline" className="mt-5" onClick={() => setDone(false)}>Submit another</Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name" className={labelCls}>Full Name *</Label>
          <Input id="name" name="name" required maxLength={100} className={inputCls} />
          {errors.name && <p className="text-xs text-primary mt-1">{errors.name}</p>}
        </div>
        <div>
          <Label htmlFor="phone" className={labelCls}>Phone Number *</Label>
          <Input id="phone" name="phone" type="tel" required maxLength={20} className={inputCls} />
          {errors.phone && <p className="text-xs text-primary mt-1">{errors.phone}</p>}
        </div>
      </div>

      {showEmail && (
        <div>
          <Label htmlFor="email" className={labelCls}>Email (optional)</Label>
          <Input id="email" name="email" type="email" maxLength={255} className={inputCls} />
          {errors.email && <p className="text-xs text-primary mt-1">{errors.email}</p>}
        </div>
      )}

      {showGoal && (
        <div>
          <Label htmlFor="fitness_goal" className={labelCls}>Fitness Goal</Label>
          <Input
            id="fitness_goal"
            name="fitness_goal"
            placeholder="e.g. Lose 10 kg, build muscle, train for sport"
            maxLength={200}
            className={inputCls}
          />
        </div>
      )}

      {showMessage && (
        <div>
          <Label htmlFor="message" className={labelCls}>Message (optional)</Label>
          <Textarea id="message" name="message" rows={4} maxLength={1000} className={inputCls} />
        </div>
      )}

      <Button type="submit" variant="hero" size="lg" disabled={loading} className="w-full sm:w-auto">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        {loading ? "Sending..." : ctaLabel}
      </Button>
      <p className={`text-xs ${dark ? "text-white/50" : "text-muted-foreground"}`}>
        By submitting you agree to be contacted by V11 Gym. We never share your details.
      </p>
    </form>
  );
}
