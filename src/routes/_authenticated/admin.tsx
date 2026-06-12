import { createFileRoute, Link, Outlet, redirect, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Receipt,
  ClipboardCheck,
  Inbox,
  LogOut,
  Menu,
  X,
  Dumbbell,
  ExternalLink,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/admin")({
  ssr: false,
  beforeLoad: async ({ context, location }) => {
    const user = (context as any).user;
    if (!user) throw redirect({ to: "/auth", search: { redirect: location.href } });
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();
    if (error || !data) {
      throw redirect({ to: "/auth", search: { redirect: location.href } });
    }
  },
  head: () => ({
    meta: [
      { title: "Admin Dashboard — V11 Gym" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminLayout,
});

type NavItem = { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean };
const nav: NavItem[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/members", label: "Members", icon: Users },
  { to: "/admin/plans", label: "Plans", icon: CreditCard },
  { to: "/admin/payments", label: "Payments", icon: Receipt },
  { to: "/admin/attendance", label: "Attendance", icon: ClipboardCheck },
  { to: "/admin/leads", label: "Leads", icon: Inbox },
];

function AdminLayout() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });
  useEffect(() => setOpen(false), [path]);

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="min-h-screen bg-muted/30 -mt-0">
      {/* Topbar */}
      <header className="sticky top-0 z-40 bg-ink text-white border-b border-white/10">
        <div className="flex h-14 items-center gap-3 px-4">
          <button
            className="lg:hidden grid place-items-center h-9 w-9 rounded-md hover:bg-white/10"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <Link to="/admin" className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-md bg-primary">
              <Dumbbell className="h-4 w-4" strokeWidth={2.5} />
            </span>
            <span className="font-display text-lg font-bold uppercase tracking-tight">
              V11<span className="text-primary">.</span>Admin
            </span>
          </Link>
          <div className="ml-auto flex items-center gap-2">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs text-white/70 hover:text-white"
            >
              <ExternalLink className="h-3.5 w-3.5" /> View site
            </a>
            <Button variant="ghost" size="sm" onClick={signOut} className="text-white hover:bg-white/10 hover:text-white">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed inset-y-14 left-0 z-30 w-64 bg-ink text-white border-r border-white/10 transform transition-transform lg:static lg:translate-x-0 lg:inset-auto",
            open ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          )}
        >
          <nav className="p-3 space-y-1">
            {nav.map((n) => {
              const Icon = n.icon;
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  activeOptions={{ exact: n.exact }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-white/70 hover:bg-white/5 hover:text-white data-[status=active]:bg-primary data-[status=active]:text-primary-foreground"
                >
                  <Icon className="h-4 w-4" />
                  {n.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {open && (
          <div className="fixed inset-0 z-20 bg-black/40 lg:hidden" onClick={() => setOpen(false)} />
        )}

        <main className="flex-1 min-w-0 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
