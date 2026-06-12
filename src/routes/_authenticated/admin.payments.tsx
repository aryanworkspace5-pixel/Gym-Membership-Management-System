import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Download, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { fetchPayments, fetchMembers, fetchPlans, exportToCSV } from "@/lib/admin/queries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/_authenticated/admin/payments")({
  component: PaymentsPage,
});

function PaymentsPage() {
  const qc = useQueryClient();
  const { data: payments, isLoading } = useQuery({ queryKey: ["payments"], queryFn: fetchPayments });
  const { data: members } = useQuery({ queryKey: ["members"], queryFn: fetchMembers });
  const { data: plans } = useQuery({ queryKey: ["plans"], queryFn: fetchPlans });
  const [open, setOpen] = useState(false);
  const [delId, setDelId] = useState<string | null>(null);

  const total = useMemo(() => payments?.reduce((s, p) => s + p.amount, 0) ?? 0, [payments]);
  const monthStart = new Date(); monthStart.setDate(1); monthStart.setHours(0, 0, 0, 0);
  const monthTotal = useMemo(() => payments?.filter((p) => new Date(p.payment_date) >= monthStart).reduce((s, p) => s + p.amount, 0) ?? 0, [payments]);

  const add = useMutation({
    mutationFn: async (e: React.FormEvent<HTMLFormElement>) => {
      const fd = new FormData(e.target as HTMLFormElement);
      const member_id = String(fd.get("member_id") || "");
      if (!member_id) throw new Error("Select a member");
      const payload = {
        member_id,
        plan_id: String(fd.get("plan_id") || "") || null,
        amount: Number(fd.get("amount") || 0),
        payment_date: String(fd.get("payment_date") || new Date().toISOString().slice(0, 10)),
        method: String(fd.get("method") || "cash") as any,
        period_from: String(fd.get("period_from") || "") || null,
        period_to: String(fd.get("period_to") || "") || null,
        notes: String(fd.get("notes") || "") || null,
      };
      const { error } = await supabase.from("payments").insert(payload);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["payments"] }); toast.success("Payment recorded"); setOpen(false); },
    onError: (e: any) => toast.error(e?.message),
  });

  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("payments").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["payments"] }); toast.success("Deleted"); setDelId(null); },
  });

  return (
    <div className="space-y-5 max-w-7xl">
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <p className="eyebrow">Payments</p>
          <h1 className="font-display text-3xl font-bold uppercase">Revenue & Payments</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => exportToCSV("v11-payments.csv", (payments || []).map((p) => ({
            member: p.members?.full_name, phone: p.members?.phone, amount: p.amount, method: p.method, date: p.payment_date, period_from: p.period_from, period_to: p.period_to,
          })))}><Download className="h-4 w-4" /> Export</Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button variant="hero"><Plus className="h-4 w-4" /> Record Payment</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Record Payment</DialogTitle></DialogHeader>
              <form onSubmit={(e) => { e.preventDefault(); add.mutate(e); }} className="space-y-3">
                <div>
                  <Label>Member</Label>
                  <Select name="member_id" required>
                    <SelectTrigger><SelectValue placeholder="Select member" /></SelectTrigger>
                    <SelectContent>
                      {members?.map((m) => <SelectItem key={m.id} value={m.id}>{m.full_name} — {m.phone}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Amount (₹)</Label><Input name="amount" type="number" min={0} step="0.01" required /></div>
                  <div><Label>Date</Label><Input name="payment_date" type="date" defaultValue={new Date().toISOString().slice(0, 10)} required /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Method</Label>
                    <Select name="method" defaultValue="cash">
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="upi">UPI</SelectItem>
                        <SelectItem value="card">Card</SelectItem>
                        <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Plan (optional)</Label>
                    <Select name="plan_id">
                      <SelectTrigger><SelectValue placeholder="None" /></SelectTrigger>
                      <SelectContent>{plans?.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Period From</Label><Input name="period_from" type="date" /></div>
                  <div><Label>Period To</Label><Input name="period_to" type="date" /></div>
                </div>
                <div><Label>Notes</Label><Textarea name="notes" rows={2} /></div>
                <DialogFooter><Button type="submit" variant="hero" disabled={add.isPending}>{add.isPending && <Loader2 className="h-4 w-4 animate-spin" />}Save</Button></DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Card className="p-5"><p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">This Month</p><p className="mt-2 text-3xl font-display font-bold">₹{monthTotal.toLocaleString("en-IN")}</p></Card>
        <Card className="p-5"><p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">All Time</p><p className="mt-2 text-3xl font-display font-bold">₹{total.toLocaleString("en-IN")}</p></Card>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader><TableRow>
              <TableHead>Date</TableHead><TableHead>Member</TableHead><TableHead>Method</TableHead><TableHead>Period</TableHead><TableHead className="text-right">Amount</TableHead><TableHead></TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {isLoading && <TableRow><TableCell colSpan={6} className="text-center py-10"><Loader2 className="h-5 w-5 animate-spin inline" /></TableCell></TableRow>}
              {!isLoading && !payments?.length && <TableRow><TableCell colSpan={6} className="text-center py-10 text-muted-foreground">No payments yet.</TableCell></TableRow>}
              {payments?.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{p.payment_date}</TableCell>
                  <TableCell>{p.members?.full_name || "—"}<div className="text-xs text-muted-foreground">{p.members?.phone}</div></TableCell>
                  <TableCell className="capitalize">{p.method.replace("_", " ")}</TableCell>
                  <TableCell className="text-xs">{p.period_from && p.period_to ? `${p.period_from} → ${p.period_to}` : "—"}</TableCell>
                  <TableCell className="text-right font-semibold">₹{p.amount.toLocaleString("en-IN")}</TableCell>
                  <TableCell><Button size="sm" variant="ghost" onClick={() => setDelId(p.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      <Dialog open={!!delId} onOpenChange={(o) => !o && setDelId(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Delete payment?</DialogTitle></DialogHeader>
          <DialogFooter><Button variant="outline" onClick={() => setDelId(null)}>Cancel</Button><Button variant="destructive" onClick={() => delId && del.mutate(delId)}>Delete</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
