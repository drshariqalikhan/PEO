import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

// Define the PEO state object
const PeoDataSchema = z.object({
  patient: z.object({
    condition: z.string().optional(),
    age: z.number().optional(),
  }),
  exposure: z.object({
    drug: z.string().optional(),
    dose: z.string().optional(),
  }),
  outcome: z.object({
    primary: z.string().optional(),
  }),
});

// Define the overall validated state
export const AnalysisResponseSchema = z.object({
  question_type: z.enum(["therapy", "harm", "prognosis", "diagnosis", "prevention", "screening", "etiology"]),
  peo_data: PeoDataSchema,
  clarification_questions: z.array(z.object({
    id: z.string(),
    question: z.string(),
    options: z.array(z.string()),
    field: z.string(),
  })),
  is_ready: z.boolean(),
});