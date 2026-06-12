import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Download, Loader2, LogOut as CheckOutIcon } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { fetchAttendance, fetchMembers, exportToCSV } from "@/lib/admin/queries";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/_authenticated/admin/attendance")({
  component: AttendancePage,
});

function AttendancePage() {
  const qc = useQueryClient();
  const { data: rows, isLoading } = useQuery({ queryKey: ["attendance"], queryFn: fetchAttendance });
  const { data: members } = useQuery({ queryKey: ["members"], queryFn: fetchMembers });
  const [open, setOpen] = useState(false);

  const checkIn = useMutation({
    mutationFn: async (memberId: string) => {
      if (!memberId) throw new Error("Select a member");
      const { error } = await supabase.from("attendance").insert({ member_id: memberId, source: "manual" });
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["attendance"] }); toast.success("Checked in"); setOpen(false); },
    onError: (e: any) => toast.error(e?.message),
  });

  const checkOut = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("attendance").update({ check_out: new Date().toISOString() }).eq("id", id); if (error) throw error; },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["attendance"] }); toast.success("Checked out"); },
  });

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const todayCount = rows?.filter((r) => new Date(r.check_in) >= today).length ?? 0;

  return (
    <div className="space-y-5 max-w-7xl">
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <p className="eyebrow">Attendance</p>
          <h1 className="font-display text-3xl font-bold uppercase">Check-ins</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => exportToCSV("v11-attendance.csv", (rows || []).map((r) => ({
            member: r.members?.full_name, phone: r.members?.phone, check_in: r.check_in, check_out: r.check_out, source: r.source,
          })))}><Download className="h-4 w-4" /> Export</Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button variant="hero"><Plus className="h-4 w-4" /> Check In</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Member Check-In</DialogTitle></DialogHeader>
              <form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); checkIn.mutate(String(fd.get("member_id") || "")); }} className="space-y-3">
                <div>
                  <Label>Member</Label>
                  <Select name="member_id" required>
                    <SelectTrigger><SelectValue placeholder="Select member" /></SelectTrigger>
                    <SelectContent>{members?.filter((m) => m.status === "active").map((m) => <SelectItem key={m.id} value={m.id}>{m.full_name} — {m.phone}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <DialogFooter><Button type="submit" variant="hero" disabled={checkIn.isPending}>{checkIn.isPending && <Loader2 className="h-4 w-4 animate-spin" />}Check In</Button></DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="p-5"><p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Today</p><p className="mt-2 text-3xl font-display font-bold">{todayCount} check-ins</p></Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader><TableRow>
              <TableHead>Member</TableHead><TableHead>Check-In</TableHead><TableHead>Check-Out</TableHead><TableHead>Source</TableHead><TableHead></TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {isLoading && <TableRow><TableCell colSpan={5} className="text-center py-10"><Loader2 className="h-5 w-5 animate-spin inline" /></TableCell></TableRow>}
              {!isLoading && !rows?.length && <TableRow><TableCell colSpan={5} className="text-center py-10 text-muted-foreground">No check-ins yet.</TableCell></TableRow>}
              {rows?.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{r.members?.full_name || "—"}<div className="text-xs text-muted-foreground">{r.members?.phone}</div></TableCell>
                  <TableCell className="text-sm">{new Date(r.check_in).toLocaleString()}</TableCell>
                  <TableCell className="text-sm">{r.check_out ? new Date(r.check_out).toLocaleString() : <span className="text-emerald-600 font-semibold">In gym</span>}</TableCell>
                  <TableCell className="capitalize text-xs">{r.source}</TableCell>
                  <TableCell>{!r.check_out && <Button size="sm" variant="outline" onClick={() => checkOut.mutate(r.id)}><CheckOutIcon className="h-3.5 w-3.5" /> Check Out</Button>}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
