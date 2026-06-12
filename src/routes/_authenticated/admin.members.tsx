import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Pencil, Trash2, Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { fetchMembers, fetchPlans, exportToCSV, type Member } from "@/lib/admin/queries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const Route = createFileRoute("/_authenticated/admin/members")({
  component: MembersPage,
});

const memberSchema = z.object({
  full_name: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(7).max(20),
  email: z.string().trim().email().max(255).optional().or(z.literal("")),
  gender: z.string().optional().or(z.literal("")),
  date_of_birth: z.string().optional().or(z.literal("")),
  address: z.string().max(500).optional().or(z.literal("")),
  emergency_contact_name: z.string().max(100).optional().or(z.literal("")),
  emergency_contact_phone: z.string().max(20).optional().or(z.literal("")),
  status: z.enum(["active", "inactive", "expired", "frozen"]),
  plan_id: z.string().optional().or(z.literal("")),
  plan_start_date: z.string().optional().or(z.literal("")),
  plan_end_date: z.string().optional().or(z.literal("")),
  notes: z.string().max(1000).optional().or(z.literal("")),
});

function MembersPage() {
  const qc = useQueryClient();
  const { data: members, isLoading } = useQuery({ queryKey: ["members"], queryFn: fetchMembers });
  const { data: plans } = useQuery({ queryKey: ["plans"], queryFn: fetchPlans });

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [editing, setEditing] = useState<Member | null>(null);
  const [openForm, setOpenForm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return (members || []).filter((m) => {
      if (statusFilter !== "all" && m.status !== statusFilter) return false;
      if (!search) return true;
      const q = search.toLowerCase();
      return m.full_name.toLowerCase().includes(q) || m.phone.includes(q) || (m.email || "").toLowerCase().includes(q);
    });
  }, [members, search, statusFilter]);

  const save = useMutation({
    mutationFn: async (input: any) => {
      const parsed = memberSchema.parse(input);
      const payload: any = {
        full_name: parsed.full_name,
        phone: parsed.phone,
        email: parsed.email || null,
        gender: parsed.gender || null,
        date_of_birth: parsed.date_of_birth || null,
        address: parsed.address || null,
        emergency_contact_name: parsed.emergency_contact_name || null,
        emergency_contact_phone: parsed.emergency_contact_phone || null,
        status: parsed.status,
        plan_id: parsed.plan_id || null,
        plan_start_date: parsed.plan_start_date || null,
        plan_end_date: parsed.plan_end_date || null,
        notes: parsed.notes || null,
      };
      if (editing) {
        const { error } = await supabase.from("members").update(payload).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("members").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["members"] });
      toast.success(editing ? "Member updated" : "Member added");
      setOpenForm(false);
      setEditing(null);
    },
    onError: (e: any) => toast.error(e?.message || "Failed to save"),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("members").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["members"] });
      toast.success("Member deleted");
      setDeleteId(null);
    },
    onError: (e: any) => toast.error(e?.message || "Delete failed"),
  });

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    save.mutate(Object.fromEntries(fd.entries()));
  }

  function handleExport() {
    if (!filtered.length) return toast.error("Nothing to export");
    exportToCSV("v11-members.csv", filtered.map((m) => ({
      name: m.full_name, phone: m.phone, email: m.email,
      status: m.status, join_date: m.join_date,
      plan_start: m.plan_start_date, plan_end: m.plan_end_date,
    })));
  }

  return (
    <div className="space-y-5 max-w-7xl">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow">Members</p>
          <h1 className="font-display text-3xl font-bold uppercase">All Members</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}><Download className="h-4 w-4" /> Export</Button>
          <Dialog open={openForm} onOpenChange={(o) => { setOpenForm(o); if (!o) setEditing(null); }}>
            <DialogTrigger asChild>
              <Button variant="hero"><Plus className="h-4 w-4" /> Add Member</Button>
            </DialogTrigger>
            <MemberFormDialog
              key={editing?.id || "new"}
              editing={editing}
              plans={plans || []}
              onSubmit={onSubmit}
              loading={save.isPending}
            />
          </Dialog>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-60">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search name, phone, email..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
            <SelectItem value="frozen">Frozen</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Plan Ends</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow><TableCell colSpan={5} className="text-center py-10"><Loader2 className="h-5 w-5 animate-spin inline" /></TableCell></TableRow>
              )}
              {!isLoading && !filtered.length && (
                <TableRow><TableCell colSpan={5} className="text-center py-10 text-muted-foreground">No members found.</TableCell></TableRow>
              )}
              {filtered.map((m) => (
                <TableRow key={m.id}>
                  <TableCell>
                    <div className="font-semibold">{m.full_name}</div>
                    {m.email && <div className="text-xs text-muted-foreground">{m.email}</div>}
                  </TableCell>
                  <TableCell>{m.phone}</TableCell>
                  <TableCell><StatusBadge status={m.status} /></TableCell>
                  <TableCell>{m.plan_end_date || "—"}</TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="ghost" onClick={() => { setEditing(m); setOpenForm(true); }}><Pencil className="h-4 w-4" /></Button>
                    <Button size="sm" variant="ghost" onClick={() => setDeleteId(m.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this member?</AlertDialogTitle>
            <AlertDialogDescription>This also removes their attendance and payment history.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteId && remove.mutate(deleteId)}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function StatusBadge({ status }: { status: Member["status"] }) {
  const map: Record<Member["status"], string> = {
    active: "bg-emerald-100 text-emerald-800",
    expired: "bg-red-100 text-red-800",
    frozen: "bg-blue-100 text-blue-800",
    inactive: "bg-zinc-200 text-zinc-700",
  };
  return <Badge className={`${map[status]} border-0 capitalize`}>{status}</Badge>;
}

function MemberFormDialog({
  editing, plans, onSubmit, loading,
}: { editing: Member | null; plans: { id: string; name: string }[]; onSubmit: (e: React.FormEvent<HTMLFormElement>) => void; loading: boolean }) {
  return (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader><DialogTitle>{editing ? "Edit Member" : "Add Member"}</DialogTitle></DialogHeader>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field name="full_name" label="Full Name *" required defaultValue={editing?.full_name} />
          <Field name="phone" label="Phone *" required defaultValue={editing?.phone} />
          <Field name="email" label="Email" type="email" defaultValue={editing?.email || ""} />
          <div>
            <Label>Gender</Label>
            <Select name="gender" defaultValue={editing?.gender || ""}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
                <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Field name="date_of_birth" label="Date of Birth" type="date" defaultValue={editing?.date_of_birth || ""} />
          <div>
            <Label>Status *</Label>
            <Select name="status" defaultValue={editing?.status || "active"}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="frozen">Frozen</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Plan</Label>
            <Select name="plan_id" defaultValue={editing?.plan_id || ""}>
              <SelectTrigger><SelectValue placeholder="None" /></SelectTrigger>
              <SelectContent>
                {plans.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <Field name="plan_start_date" label="Plan Start" type="date" defaultValue={editing?.plan_start_date || ""} />
          <Field name="plan_end_date" label="Plan End" type="date" defaultValue={editing?.plan_end_date || ""} />
          <Field name="emergency_contact_name" label="Emergency Contact" defaultValue={editing?.emergency_contact_name || ""} />
          <Field name="emergency_contact_phone" label="Emergency Phone" defaultValue={editing?.emergency_contact_phone || ""} />
        </div>
        <Field name="address" label="Address" defaultValue={editing?.address || ""} />
        <div>
          <Label>Notes</Label>
          <Textarea name="notes" rows={3} defaultValue={editing?.notes || ""} />
        </div>
        <DialogFooter>
          <Button type="submit" variant="hero" disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {editing ? "Save Changes" : "Add Member"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}

function Field({ label, name, type = "text", defaultValue, required }: { label: string; name: string; type?: string; defaultValue?: string; required?: boolean }) {
  return (
    <div>
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} type={type} defaultValue={defaultValue} required={required} />
    </div>
  );
}
