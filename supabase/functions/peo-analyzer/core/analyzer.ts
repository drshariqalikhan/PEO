export async function analyzeClinicalQuestion(query: string, clarificationAnswers: Record<string, any> = {}) {
  const provider = getProvider();
  
  const systemPrompt = `You are a clinical research assistant.
  Analyze the question: "${query}".
  
  OUTPUT INSTRUCTIONS:
  - Respond with a plain JSON object.
  - DO NOT include schema definitions, Zod types, or internal explanations.
  - The JSON must follow this exact structure:
  {
    "question_type": "harm",
    "search_readiness_score": 90,
    "draft_peo": { "patient": {}, "exposure": {}, "outcome": {} },
    "missing_fields": [],
    "clarification_questions": [],
    "final_peo": null,
    "pubmed_queries": { "high_precision": "", "expanded": "", "broad": "", "mesh": "" }
  }
  - If search_readiness_score >= 85, fill out final_peo and pubmed_queries.`;

  const rawOutput = await provider.generate(systemPrompt);
  return rawOutput;
}