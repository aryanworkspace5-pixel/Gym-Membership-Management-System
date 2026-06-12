import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Loader2, Check } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { fetchPlans, type Plan } from "@/lib/admin/queries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/_authenticated/admin/plans")({
  component: PlansPage,
});

function PlansPage() {
  const qc = useQueryClient();
  const { data: plans, isLoading } = useQuery({ queryKey: ["plans"], queryFn: fetchPlans });
  const [editing, setEditing] = useState<Plan | null>(null);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const save = useMutation({
    mutationFn: async (e: React.FormEvent<HTMLFormElement>) => {
      const fd = new FormData(e.target as HTMLFormElement);
      const features = String(fd.get("features") || "").split("\n").map((s) => s.trim()).filter(Boolean);
      const payload = {
        name: String(fd.get("name") || "").trim(),
        description: String(fd.get("description") || "").trim() || null,
        duration_months: Number(fd.get("duration_months") || 1),
        price: Number(fd.get("price") || 0),
        features,
        is_active: fd.get("is_active") === "on",
        display_order: Number(fd.get("display_order") || 0),
      };
      if (!payload.name) throw new Error("Name required");
      if (editing) {
        const { error } = await supabase.from("membership_plans").update(payload).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("membership_plans").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["plans"] });
      toast.success("Plan saved");
      setOpen(false); setEditing(null);
    },
    onError: (e: any) => toast.error(e?.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("membership_plans").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["plans"] }); toast.success("Plan deleted"); setDeleteId(null); },
    onError: (e: any) => toast.error(e?.message),
  });

  return (
    <div className="space-y-5 max-w-6xl">
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <p className="eyebrow">Membership</p>
          <h1 className="font-display text-3xl font-bold uppercase">Plans & Pricing</h1>
        </div>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setEditing(null); }}>
          <DialogTrigger asChild>
            <Button variant="hero"><Plus className="h-4 w-4" /> Add Plan</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editing ? "Edit Plan" : "Add Plan"}</DialogTitle></DialogHeader>
            <form key={editing?.id || "new"} onSubmit={(e) => { e.preventDefault(); save.mutate(e); }} className="space-y-3">
              <div><Label>Name</Label><Input name="name" required defaultValue={editing?.name} /></div>
              <div className="grid grid-cols-3 gap-3">
                <div><Label>Months</Label><Input name="duration_months" type="number" min={1} required defaultValue={editing?.duration_months || 1} /></div>
                <div><Label>Price (₹)</Label><Input name="price" type="number" min={0} step="0.01" required defaultValue={editing?.price || 0} /></div>
                <div><Label>Order</Label><Input name="display_order" type="number" defaultValue={editing?.display_order || 0} /></div>
              </div>
              <div><Label>Description</Label><Textarea name="description" rows={2} defaultValue={editing?.description || ""} /></div>
              <div><Label>Features (one per line)</Label><Textarea name="features" rows={5} defaultValue={(editing?.features || []).join("\n")} /></div>
              <div className="flex items-center gap-2"><Switch name="is_active" defaultChecked={editing ? editing.is_active : true} id="is_active" /><Label htmlFor="is_active">Active (visible on website)</Label></div>
              <DialogFooter>
                <Button type="submit" variant="hero" disabled={save.isPending}>{save.isPending && <Loader2 className="h-4 w-4 animate-spin" />}Save</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading && <Loader2 className="h-5 w-5 animate-spin" />}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {plans?.map((p) => (
          <Card key={p.id} className="p-5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-display text-xl font-bold uppercase">{p.name}</h3>
                <p className="text-3xl font-bold mt-2">₹{p.price.toLocaleString("en-IN")}<span className="text-sm font-normal text-muted-foreground"> / {p.duration_months} mo</span></p>
              </div>
              <div className="flex flex-col items-end gap-1">
                {!p.is_active && <span className="text-[10px] uppercase font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">Hidden</span>}
                <div>
                  <Button size="sm" variant="ghost" onClick={() => { setEditing(p); setOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                  <Button size="sm" variant="ghost" onClick={() => setDeleteId(p.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              </div>
            </div>
            {p.description && <p className="text-sm text-muted-foreground mt-2">{p.description}</p>}
            <ul className="mt-3 space-y-1.5">
              {p.features.map((f, i) => (
                <li key={i} className="flex gap-2 text-sm"><Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />{f}</li>
              ))}
            </ul>
          </Card>
        ))}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Delete this plan?</AlertDialogTitle></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => deleteId && remove.mutate(deleteId)}>Delete</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
