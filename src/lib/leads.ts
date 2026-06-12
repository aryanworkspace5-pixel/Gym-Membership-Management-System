import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

export const leadSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  phone: z
    .string()
    .trim()
    .min(7, "Enter a valid phone number")
    .max(20)
    .regex(/^[0-9+\-\s()]+$/, "Only numbers, +, -, spaces, parentheses"),
  email: z
    .string()
    .trim()
    .email("Invalid email")
    .max(255)
    .optional()
    .or(z.literal("")),
  fitness_goal: z.string().trim().max(200).optional().or(z.literal("")),
  message: z.string().trim().max(1000).optional().or(z.literal("")),
});

export type LeadInput = z.infer<typeof leadSchema>;
export type LeadSource = "contact" | "free_trial" | "newsletter" | "quick_inquiry";

export async function submitLead(input: LeadInput, source: LeadSource) {
  const parsed = leadSchema.parse(input);
  const { error } = await supabase.from("leads").insert({
    name: parsed.name,
    phone: parsed.phone,
    email: parsed.email || null,
    fitness_goal: parsed.fitness_goal || null,
    message: parsed.message || null,
    source,
  });
  if (error) throw error;
}
