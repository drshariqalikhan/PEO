import { getProvider } from "../llm/index.ts";
import { calculateReadiness } from "./evaluator.ts";
import { EXTRACTION_PROMPT } from "./prompts.ts";

export async function analyzeClinicalQuestion(query: string, clarificationAnswers: Record<string, any> = {}) {
  const provider = getProvider();

  // 1. Inject data into the prompt
  const finalPrompt = EXTRACTION_PROMPT
    .replace("{{query}}", query)
    .replace("{{context}}", JSON.stringify(clarificationAnswers));

  // 2. Get LLM response
  const rawOutput = await provider.generate(finalPrompt);

  // 3. Defensive Cleaning
  const stringOutput = typeof rawOutput === 'string' ? rawOutput : JSON.stringify(rawOutput);
  const cleanedOutput = stringOutput.replace(/```json/g, "").replace(/```/g, "").trim();

  // 4. Parse JSON safely
  let parsed;
  try {
    parsed = JSON.parse(cleanedOutput);
  } catch (e) {
    throw new Error("LLM failed to return valid JSON. Output received: " + cleanedOutput);
  }

  // 5. Strict Structure Check (The "No Undefined" Safety Gate)
  if (!parsed.draft_peo || !parsed.draft_peo.patient) {
    throw new Error("LLM output missing 'draft_peo' structure. Check prompts.ts schema consistency.");
  }

  // 6. Calculate Readiness
  const { score, missing } = calculateReadiness(parsed.draft_peo);

  // 7. Logic Gate
  let final_peo = null;
  let pubmed_queries = null;

  if (score >= 85) {
    final_peo = parsed.draft_peo;
    pubmed_queries = await generatePubMedQueries(final_peo, parsed.question_type);
  }

  return {
    question_type: parsed.question_type || "unknown",
    search_readiness_score: score,
    draft_peo: parsed.draft_peo,
    missing_fields: missing,
    clarification_questions: score < 85 ? generateClarificationQuestions(missing) : [],
    final_peo,
    pubmed_queries
  };
}

// --- HELPER FUNCTIONS ---

async function generatePubMedQueries(peo: any, type: string) {
  // Use optional chaining for safety
  const drug = peo.exposure?.required?.drug || "";
  const cond = peo.patient?.required?.condition || "";
  const out = peo.outcome?.required?.primary || "";
  
  return {
    high_precision: `("${drug}") AND ("${cond}") AND ("${out}")`,
    expanded: `("${drug}") AND ("${out}")`,
    broad: `("${drug}")`,
    mesh: `("${drug}"[MeSH Terms]) AND ("${out}"[MeSH Terms])`
  };
}

function generateClarificationQuestions(missing: any[]) {
  if (!missing || missing.length === 0) return [];
  
  return missing.map(m => ({
    id: m.field.replace('.', '_'),
    field: m.field,
    importance: "high",
    question: `Could you clarify the ${m.field}?`,
    reason: m.reason,
    options: ["Unknown", "Other"]
  }));
}