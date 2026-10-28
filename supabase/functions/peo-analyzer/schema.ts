import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

export const PeoSchema = z.object({
  question_type: z.enum(["therapy", "harm", "prognosis", "diagnosis", "prevention", "screening", "etiology"]),
  search_readiness_score: z.number().min(0).max(100),
  draft_peo: z.any(),
  missing_fields: z.array(z.object({
    field: z.string(),
    importance: z.string(),
    reason: z.string(),
  })),
  clarification_questions: z.array(z.object({
    id: z.string(),
    field: z.string(),
    importance: z.string(),
    question: z.string(),
    reason: z.string(),
    options: z.array(z.string()),
  })),
  final_peo: z.any().nullable(),
  pubmed_queries: z.object({
    high_precision: z.string(),
    expanded: z.string(),
    broad: z.string(),
    mesh: z.string(),
  }).nullable(),
});