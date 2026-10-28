//test

import { getProvider } from "../llm/index.ts";
import { PeoSchema } from "../schema.ts";

export async function analyzeClinicalQuestion(query: string, clarificationAnswers: Record<string, any> = {}) {
  const provider = getProvider();
  
  const systemPrompt = `You are an expert EBM research assistant. 
  Analyze the clinical question: "${query}".
  Consider these clarification answers: ${JSON.stringify(clarificationAnswers)}.
  
  Your task:
  1. Classify the question type.
  2. Perform PEO extraction.
  3. Perform Gap Analysis.
  4. Calculate a readiness score (0-100).
  5. If score >= 85, generate Final PEO and 4 PubMed search strategies.
  
  Output ONLY valid JSON matching this schema: ${JSON.stringify(PeoSchema.shape)}.`;

  const rawOutput = await provider.generate(systemPrompt);
  return rawOutput;
}