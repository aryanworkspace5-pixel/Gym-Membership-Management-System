import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Download, Loader2, Phone, Mail, MessageCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { fetchLeads, exportToCSV, type Lead } from "@/lib/admin/queries";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { whatsappLink } from "@/lib/site-config";

export const Route = createFileRoute("/_authenticated/admin/leads")({
  component: LeadsPage,
});

const STATUSES = ["new", "contacted", "trial_booked", "converted", "lost"] as const;

function LeadsPage() {
  const qc = useQueryClient();
  const { data: leads, isLoading } = useQuery({ queryKey: ["leads"], queryFn: fetchLeads });
  const [filter, setFilter] = useState<string>("all");
  const [editing, setEditing] = useState<Lead | null>(null);

  const filtered = useMemo(() => (leads || []).filter((l) => filter === "all" || l.status === filter), [leads, filter]);

  const update = useMutation({
    mutationFn: async ({ id, status, notes }: { id: string; status: string; notes: string }) => {
      const { error } = await supabase.from("leads").update({ status: status as any, notes: notes || null }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["leads"] }); toast.success("Lead updated"); setEditing(null); },
  });

  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("leads").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["leads"] }); toast.success("Deleted"); },
  });

  return (
    <div className="space-y-5 max-w-7xl">
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <p className="eyebrow">Leads</p>
          <h1 className="font-display text-3xl font-bold uppercase">Inquiries & Trials</h1>
        </div>
        <div className="flex gap-2">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s.replace("_", " ")}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => exportToCSV("v11-leads.csv", filtered.map((l) => ({
            name: l.name, phone: l.phone, email: l.email, goal: l.fitness_goal, source: l.source, status: l.status, created: l.created_at,
          })))}><Download className="h-4 w-4" /> Export</Button>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader><TableRow>
              <TableHead>Name</TableHead><TableHead>Contact</TableHead><TableHead>Goal</TableHead><TableHead>Source</TableHead><TableHead>Status</TableHead><TableHead>Received</TableHead><TableHead className="text-right">Actions</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {isLoading && <TableRow><TableCell colSpan={7} className="text-center py-10"><Loader2 className="h-5 w-5 animate-spin inline" /></TableCell></TableRow>}
              {!isLoading && !filtered.length && <TableRow><TableCell colSpan={7} className="text-center py-10 text-muted-foreground">No leads.</TableCell></TableRow>}
              {filtered.map((l) => (
                <TableRow key={l.id}>
                  <TableCell className="font-semibold">{l.name}</TableCell>
                  <TableCell>
                    <div className="text-sm">{l.phone}</div>
                    {l.email && <div className="text-xs text-muted-foreground">{l.email}</div>}
                  </TableCell>
                  <TableCell className="text-sm max-w-xs truncate">{l.fitness_goal || "—"}</TableCell>
                  <TableCell><Badge variant="outline" className="capitalize text-xs">{l.source.replace("_", " ")}</Badge></TableCell>
                  <TableCell><StatusBadge status={l.status} /></TableCell>
                  <TableCell className="text-xs text-muted-foreground">{new Date(l.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <a href={`tel:${l.phone}`} className="inline-flex"><Button size="sm" variant="ghost"><Phone className="h-4 w-4" /></Button></a>
                    <a href={whatsappLink(`Hi ${l.name}, this is V11 Gym.`)} target="_blank" rel="noreferrer" className="inline-flex"><Button size="sm" variant="ghost"><MessageCircle className="h-4 w-4 text-emerald-600" /></Button></a>
                    {l.email && <a href={`mailto:${l.email}`} className="inline-flex"><Button size="sm" variant="ghost"><Mail className="h-4 w-4" /></Button></a>}
                    <Button size="sm" variant="ghost" onClick={() => setEditing(l)}>Edit</Button>
                    <Button size="sm" variant="ghost" onClick={() => del.mutate(l.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing?.name}</DialogTitle></DialogHeader>
          {editing && (
            <form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); update.mutate({ id: editing.id, status: String(fd.get("status")), notes: String(fd.get("notes") || "") }); }} className="space-y-3">
              {editing.message && <p className="text-sm bg-muted p-3 rounded">{editing.message}</p>}
              <div>
                <Label>Status</Label>
                <Select name="status" defaultValue={editing.status}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s.replace("_", " ")}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Internal Notes</Label><Textarea name="notes" rows={4} defaultValue={editing.notes || ""} /></div>
              <DialogFooter><Button type="submit" variant="hero" disabled={update.isPending}>{update.isPending && <Loader2 className="h-4 w-4 animate-spin" />}Save</Button></DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    new: "bg-blue-100 text-blue-800",
    contacted: "bg-amber-100 text-amber-800",
    trial_booked: "bg-purple-100 text-purple-800",
    converted: "bg-emerald-100 text-emerald-800",
    lost: "bg-zinc-200 text-zinc-700",
  };
  return <Badge className={`${map[status] || ""} border-0 capitalize`}>{status.replace("_", " ")}</Badge>;
}
