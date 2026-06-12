import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, Dumbbell, Lock } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const searchSchema = z.object({ redirect: z.string().optional() });

export const Route = createFileRoute("/auth")({
  validateSearch: searchSchema,
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin Login — V11 Gym" },
      { name: "description", content: "Secure admin access for V11 Gym staff." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  beforeLoad: async ({ search }) => {
    const { data } = await supabase.auth.getUser();
    if (data.user) throw redirect({ to: search.redirect || "/admin" });
  },
  component: AuthPage,
});

const credSchema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(6, "At least 6 characters").max(72),
});

function AuthPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        navigate({ to: search.redirect || "/admin" });
      }
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate, search.redirect]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    const fd = new FormData(e.currentTarget);
    const parsed = credSchema.safeParse({
      email: String(fd.get("email") || ""),
      password: String(fd.get("password") || ""),
    });
    if (!parsed.success) {
      const map: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (map[i.path[0] as string] = i.message));
      setErrors(map);
      return;
    }
    setLoading(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword(parsed.data);
        if (error) throw error;
        toast.success("Welcome back.");
      } else {
        const { error } = await supabase.auth.signUp({
          email: parsed.data.email,
          password: parsed.data.password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        toast.success("Account created. You can sign in now.");
        setMode("signin");
      }
    } catch (err: any) {
      const msg = err?.message || "Authentication failed";
      if (msg.toLowerCase().includes("invalid login")) {
        toast.error("Wrong email or password.");
      } else if (msg.toLowerCase().includes("already registered")) {
        toast.error("This email is already registered. Sign in instead.");
      } else {
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-ink px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-white">
            <span className="grid h-10 w-10 place-items-center rounded-md bg-primary">
              <Dumbbell className="h-5 w-5" strokeWidth={2.5} />
            </span>
            <span className="font-display text-2xl font-bold uppercase tracking-tight">
              V11<span className="text-primary">.</span>Gym
            </span>
          </div>
          <p className="mt-3 text-white/60 text-sm flex items-center justify-center gap-2">
            <Lock className="h-3.5 w-3.5" /> Admin & staff access only
          </p>
        </div>

        <div className="rounded-2xl bg-white/5 border border-white/10 p-6 backdrop-blur">
          <Tabs value={mode} onValueChange={(v) => setMode(v as any)} className="w-full">
            <TabsList className="grid grid-cols-2 w-full bg-white/5">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Create Account</TabsTrigger>
            </TabsList>
            <TabsContent value="signin" className="mt-0" />
            <TabsContent value="signup" className="mt-0" />
          </Tabs>

          <form onSubmit={onSubmit} className="space-y-4 mt-5" noValidate>
            <div>
              <Label htmlFor="email" className="text-white/85">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="bg-white/5 border-white/15 text-white placeholder:text-white/40"
              />
              {errors.email && <p className="text-xs text-primary mt-1">{errors.email}</p>}
            </div>
            <div>
              <Label htmlFor="password" className="text-white/85">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                required
                minLength={6}
                className="bg-white/5 border-white/15 text-white placeholder:text-white/40"
              />
              {errors.password && <p className="text-xs text-primary mt-1">{errors.password}</p>}
            </div>
            <Button type="submit" variant="hero" size="lg" disabled={loading} className="w-full">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {loading ? "Please wait..." : mode === "signin" ? "Sign In" : "Create Account"}
            </Button>
          </form>
        </div>

        <p className="text-center mt-6 text-xs text-white/40">
          Looking for the gym?{" "}
          <a href="/" className="text-white/70 hover:text-primary underline underline-offset-4">
            Back to website
          </a>
        </p>
      </div>
    </div>
  );
}
