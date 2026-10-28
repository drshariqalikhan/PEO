import { getProvider } from "../llm/index.ts";
import { calculateReadiness } from "./evaluator.ts";

export async function analyzeClinicalQuestion(query: string, clarificationAnswers: Record<string, any> = {}) {
  const provider = getProvider();

  // 1. Define the prompt
  const extractionPrompt = `You are a clinical evidence-based medicine assistant.
  Extract the Patient, Exposure, and Outcome (PEO) from the clinical question: "${query}".
  Consider these provided context/answers: ${JSON.stringify(clarificationAnswers)}.
  
  Output ONLY a plain JSON object with this exact structure:
  {
    "question_type": "therapy",
    "draft_peo": {
      "patient": { "required": {"condition": ""}, "recommended": {}, "optional": {} },
      "exposure": { "required": {"drug": ""}, "recommended": {}, "optional": {} },
      "outcome": { "required": {"primary": ""}, "recommended": {}, "optional": {} }
    }
  }`;

  // 2. Get LLM response
  const rawOutput = await provider.generate(extractionPrompt);

  // 3. Robust String Cleaning
  // Ensure we are working with a string before calling .replace()
  const stringOutput = typeof rawOutput === 'string' ? rawOutput : JSON.stringify(rawOutput);
  const cleanedOutput = stringOutput.replace(/```json/g, "").replace(/```/g, "").trim();

  // 4. Parse
  const parsedExtraction = JSON.parse(cleanedOutput);

  // 5. Evaluate Readiness (The "Quality Gate")
  const { score, missing } = calculateReadiness(parsedExtraction.draft_peo);

  // 6. Logic Gate
  let final_peo = null;
  let pubmed_queries = null;

  if (score >= 85) {
    final_peo = parsedExtraction.draft_peo;
    pubmed_queries = await generatePubMedQueries(final_peo, parsedExtraction.question_type);
  }

  // 7. Build Response
  return {
    question_type: parsedExtraction.question_type || "unknown",
    search_readiness_score: score,
    draft_peo: parsedExtraction.draft_peo,
    missing_fields: missing,
    clarification_questions: score < 85 ? generateClarificationQuestions(missing) : [],
    final_peo,
    pubmed_queries
  };
}

// --- HELPERS ---

async function generatePubMedQueries(peo: any, type: string) {
  const drug = peo.exposure?.required?.drug || "drug";
  const cond = peo.patient?.required?.condition || "condition";
  const out = peo.outcome?.required?.primary || "outcome";
  
  return {
    high_precision: `("${drug}") AND ("${cond}") AND ("${out}")`,
    expanded: `("${drug}") AND ("${out}")`,
    broad: `("${drug}")`,
    mesh: `("${drug}"[MeSH Terms]) AND ("${out}"[MeSH Terms])`
  };
}

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