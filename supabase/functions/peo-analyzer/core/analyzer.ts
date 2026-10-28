import { getProvider } from "../llm/index.ts";
import { calculateReadiness } from "./evaluator.ts";
import { PeoSchema } from "../schema.ts";

export async function analyzeClinicalQuestion(query: string, clarificationAnswers: Record<string, any> = {}) {
  const provider = getProvider();

  // 1. SYSTEM PROMPT: Focused on Extraction
  const extractionPrompt = `You are a clinical evidence-based medicine assistant.
  Extract the Patient, Exposure, and Outcome (PEO) from the clinical question: "${query}".
  Consider these provided context/answers: ${JSON.stringify(clarificationAnswers)}.
  
  Output ONLY a JSON object with this structure:
  {
    "question_type": "therapy | harm | prognosis | diagnosis | prevention | screening | etiology",
    "draft_peo": {
      "patient": { "required": {"condition": ""}, "recommended": {}, "optional": {} },
      "exposure": { "required": {"drug": ""}, "recommended": {}, "optional": {} },
      "outcome": { "required": {"primary": ""}, "recommended": {}, "optional": {} }
    }
  }`;

  // 2. Perform Extraction
  const rawExtraction = await provider.generate(extractionPrompt);
  const parsedExtraction = JSON.parse(rawExtraction);

  // 3. Evaluate Readiness (The "Quality Gate")
  const { score, missing } = calculateReadiness(parsedExtraction.draft_peo);

  // 4. Determine Output
  let final_peo = null;
  let pubmed_queries = null;

  if (score >= 85) {
    final_peo = parsedExtraction.draft_peo;
    pubmed_queries = await generatePubMedQueries(final_peo, parsedExtraction.question_type);
  }

  // 5. Build Final Response Object
  return {
    question_type: parsedExtraction.question_type,
    search_readiness_score: score,
    draft_peo: parsedExtraction.draft_peo,
    missing_fields: missing,
    clarification_questions: score < 85 ? generateClarificationQuestions(missing) : [],
    final_peo,
    pubmed_queries
  };
}

// HELPER: Generate Search Strategies
async function generatePubMedQueries(peo: any, type: string) {
  // In the future, this can be moved to a separate strategy file
  return {
    high_precision: `("${peo.exposure.required.drug}") AND ("${peo.patient.required.condition}") AND ("${peo.outcome.required.primary}")`,
    expanded: `("${peo.exposure.required.drug}") AND ("${peo.outcome.required.primary}")`,
    broad: `("${peo.exposure.required.drug}")`,
    mesh: `("${peo.exposure.required.drug}"[MeSH Terms]) AND ("${peo.outcome.required.primary}"[MeSH Terms])`
  };
}

// HELPER: Generate Clarification Questions
function generateClarificationQuestions(missing: any[]) {
  return missing.map(m => ({
    id: m.field.replace('.', '_'),
    field: m.field,
    importance: "high",
    question: `Could you clarify the ${m.field}?`,
    reason: m.reason,
    options: ["Unknown", "Other"]
  }));
}