import { supabase } from "@/integrations/supabase/client";

export type Member = {
  id: string;
  full_name: string;
  phone: string;
  email: string | null;
  gender: "male" | "female" | "other" | "prefer_not_to_say" | null;
  date_of_birth: string | null;
  address: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  photo_url: string | null;
  join_date: string;
  status: "active" | "inactive" | "expired" | "frozen";
  plan_id: string | null;
  plan_start_date: string | null;
  plan_end_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type Plan = {
  id: string;
  name: string;
  description: string | null;
  duration_months: number;
  price: number;
  features: string[];
  is_active: boolean;
  display_order: number;
};

export type Payment = {
  id: string;
  member_id: string;
  plan_id: string | null;
  amount: number;
  payment_date: string;
  method: "cash" | "card" | "upi" | "bank_transfer" | "other";
  period_from: string | null;
  period_to: string | null;
  notes: string | null;
  created_at: string;
  members?: { full_name: string; phone: string } | null;
};

export type Attendance = {
  id: string;
  member_id: string;
  check_in: string;
  check_out: string | null;
  source: "manual" | "qr" | "self";
  members?: { full_name: string; phone: string } | null;
};

export type Lead = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  fitness_goal: string | null;
  message: string | null;
  source: string;
  status: string;
  notes: string | null;
  created_at: string;
};

export async function fetchMembers(): Promise<Member[]> {
  const { data, error } = await supabase
    .from("members")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []) as Member[];
}

export async function fetchPlans(): Promise<Plan[]> {
  const { data, error } = await supabase
    .from("membership_plans")
    .select("*")
    .order("display_order");
  if (error) throw error;
  return (data || []).map((p: any) => ({
    ...p,
    price: Number(p.price),
    features: Array.isArray(p.features) ? p.features : [],
  }));
}

export async function fetchPayments(): Promise<Payment[]> {
  const { data, error } = await supabase
    .from("payments")
    .select("*, members(full_name, phone)")
    .order("payment_date", { ascending: false })
    .limit(500);
  if (error) throw error;
  return (data || []).map((p: any) => ({ ...p, amount: Number(p.amount) })) as Payment[];
}

export async function fetchAttendance(): Promise<Attendance[]> {
  const { data, error } = await supabase
    .from("attendance")
    .select("*, members(full_name, phone)")
    .order("check_in", { ascending: false })
    .limit(500);
  if (error) throw error;
  return (data || []) as Attendance[];
}

export async function fetchLeads(): Promise<Lead[]> {
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []) as Lead[];
}

export function exportToCSV(filename: string, rows: Record<string, any>[]) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const escape = (v: any) => {
    if (v === null || v === undefined) return "";
    const s = typeof v === "object" ? JSON.stringify(v) : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = [headers.join(","), ...rows.map((r) => headers.map((h) => escape(r[h])).join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
