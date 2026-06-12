import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Users, Receipt, ClipboardCheck, Inbox, TrendingUp, AlertTriangle } from "lucide-react";
import { fetchMembers, fetchPayments, fetchAttendance, fetchLeads } from "@/lib/admin/queries";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminHome,
});

function AdminHome() {
  const members = useQuery({ queryKey: ["members"], queryFn: fetchMembers });
  const payments = useQuery({ queryKey: ["payments"], queryFn: fetchPayments });
  const attendance = useQuery({ queryKey: ["attendance"], queryFn: fetchAttendance });
  const leads = useQuery({ queryKey: ["leads"], queryFn: fetchLeads });

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const in7Days = new Date(); in7Days.setDate(in7Days.getDate() + 7);

  const activeMembers = members.data?.filter((m) => m.status === "active").length ?? 0;
  const expiringSoon = members.data?.filter(
    (m) => m.plan_end_date && new Date(m.plan_end_date) <= in7Days && new Date(m.plan_end_date) >= today,
  ).length ?? 0;
  const monthRevenue = payments.data?.filter((p) => new Date(p.payment_date) >= monthStart)
    .reduce((s, p) => s + p.amount, 0) ?? 0;
  const checkInsToday = attendance.data?.filter((a) => new Date(a.check_in) >= today).length ?? 0;
  const newLeads = leads.data?.filter((l) => l.status === "new").length ?? 0;

  const stats = [
    { label: "Active Members", value: activeMembers, icon: Users, to: "/admin/members", tone: "default" as const },
    { label: "Revenue (This Month)", value: `₹${monthRevenue.toLocaleString("en-IN")}`, icon: TrendingUp, to: "/admin/payments", tone: "default" as const },
    { label: "Check-ins Today", value: checkInsToday, icon: ClipboardCheck, to: "/admin/attendance", tone: "default" as const },
    { label: "New Leads", value: newLeads, icon: Inbox, to: "/admin/leads", tone: "default" as const },
    { label: "Expiring in 7 Days", value: expiringSoon, icon: AlertTriangle, to: "/admin/members", tone: "warn" as const },
    { label: "Total Payments", value: payments.data?.length ?? 0, icon: Receipt, to: "/admin/payments", tone: "default" as const },
  ];

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <p className="eyebrow">Dashboard</p>
        <h1 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-tight">Overview</h1>
        <p className="text-muted-foreground mt-1">A live pulse of your gym at a glance.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Link key={s.label} to={s.to}>
              <Card className="p-5 hover:shadow-md transition-shadow cursor-pointer h-full">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">{s.label}</p>
                    <p className="mt-2 text-3xl font-display font-bold">{s.value}</p>
                  </div>
                  <span className={`grid h-10 w-10 place-items-center rounded-md ${s.tone === "warn" ? "bg-amber-100 text-amber-700" : "bg-primary/10 text-primary"}`}>
                    <Icon className="h-5 w-5" />
                  </span>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-5">
          <h3 className="font-display font-bold text-lg uppercase mb-3">Recent Payments</h3>
          {payments.data?.slice(0, 5).map((p) => (
            <div key={p.id} className="flex justify-between py-2 border-b last:border-0 text-sm">
              <span>{p.members?.full_name ?? "—"}</span>
              <span className="font-semibold">₹{p.amount.toLocaleString("en-IN")}</span>
            </div>
          )) || <p className="text-sm text-muted-foreground">No payments yet.</p>}
          {payments.data && !payments.data.length && <p className="text-sm text-muted-foreground">No payments yet.</p>}
        </Card>
        <Card className="p-5">
          <h3 className="font-display font-bold text-lg uppercase mb-3">Latest Leads</h3>
          {leads.data?.slice(0, 5).map((l) => (
            <div key={l.id} className="flex justify-between py-2 border-b last:border-0 text-sm">
              <span>{l.name}</span>
              <span className="text-muted-foreground">{l.phone}</span>
            </div>
          )) || <p className="text-sm text-muted-foreground">No leads yet.</p>}
          {leads.data && !leads.data.length && <p className="text-sm text-muted-foreground">No leads yet.</p>}
        </Card>
      </div>
    </div>
  );
}
