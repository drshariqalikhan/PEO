// Ensure this path is correct relative to the file location
import { getProvider } from "../llm/index.ts"; 
import { PeoSchema } from "../schema.ts";



export async function analyzeClinicalQuestion(query: string, clarificationAnswers: Record<string, any> = {}) {
    const provider = getProvider();
  
//   const systemPrompt = `You are a clinical research assistant.
//   Analyze the question: "${query}".
  
//   OUTPUT INSTRUCTIONS:
//   - Respond with a plain JSON object.
//   - DO NOT include schema definitions, Zod types, or internal explanations.
//   - The JSON must follow this exact structure:
//   {
//     "question_type": "harm",
//     "search_readiness_score": 90,
//     "draft_peo": { "patient": {}, "exposure": {}, "outcome": {} },
//     "missing_fields": [],
//     "clarification_questions": [],
//     "final_peo": null,
//     "pubmed_queries": { "high_precision": "", "expanded": "", "broad": "", "mesh": "" }
//   }
//   - If search_readiness_score >= 85, fill out final_peo and pubmed_queries.`;

// Replace the systemPrompt inside core/analyzer.ts with this enhanced version
const systemPrompt = `You are an expert EBM Librarian. Analyze the clinical question and produce a structured PEO analysis.

1. CLASSIFICATION: Classify into one: therapy, harm, prognosis, diagnosis, prevention, screening, etiology.
2. EXTRACTION: Extract PEO (Patient, Exposure, Outcome).
3. CATEGORIZATION:
   - Required: Condition, Exposure, Outcome.
   - Recommended: Age, Sex, Severity, Comorbidities, Indication.
   - Optional: Country, Ethnicity, Institution.
4. GAP ANALYSIS: Identify missing info that alters risk/prognosis/treatment effect.
5. READINESS SCORE (0-100):
   - 30 pts: Patient identified, 30 pts: Exposure identified, 30 pts: Outcome identified, 10 pts: Modifiers.
   - Threshold 85: If < 85, you MUST generate clarification_questions.

OUTPUT SCHEMA:
{
  "question_type": "string",
  "search_readiness_score": number,
  "draft_peo": { 
     "patient": { "required": {}, "recommended": {}, "optional": {} },
     "exposure": { "required": {}, "recommended": {}, "optional": {} },
     "outcome": { "required": {}, "recommended": {}, "optional": {} }
  },
  "missing_fields": [ { "field": "string", "importance": "high|medium", "reason": "string" } ],
  "clarification_questions": [ { "id": "string", "field": "string", "question": "string", "reason": "string", "options": [] } ],
  "final_peo": null or { ...same structure as draft_peo... },
  "pubmed_queries": null or { "high_precision": "", "expanded": "", "broad": "", "mesh": "" }
}

If readiness >= 85, fill final_peo. If < 85, final_peo and pubmed_queries MUST be null.`;

  const rawOutput = await provider.generate(systemPrompt);
  return rawOutput;
}