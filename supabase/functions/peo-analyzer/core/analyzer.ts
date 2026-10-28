import { getProvider } from "../llm/index.ts";
import { calculateReadiness } from "./evaluator.ts";

export async function analyzeClinicalQuestion(query: string, clarificationAnswers: Record<string, any> = {}) {
  const provider = getProvider();

  const extractionPrompt = `...`; // (Keep your existing prompt string)

  const rawOutput = await provider.generate(extractionPrompt);

  // DEFENSIVE CLEANING: Force convert to string and handle potential non-string returns
  let stringOutput = "";
  try {
    if (typeof rawOutput === 'string') {
      stringOutput = rawOutput;
    } else if (rawOutput && typeof rawOutput === 'object') {
      stringOutput = JSON.stringify(rawOutput);
    } else {
      stringOutput = String(rawOutput);
    }
  } catch (e) {
    stringOutput = "";
  }

  // Use a regex-safe replace
  const cleanedOutput = stringOutput
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  // If after cleaning we have an empty string, throw a descriptive error
  if (!cleanedOutput) {
    throw new Error("LLM returned empty or non-string response: " + typeof rawOutput);
  }


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