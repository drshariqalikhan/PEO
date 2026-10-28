import { PEO_TOOL } from "../llm/client.ts";
import { QUESTION_REGISTRY } from "./registry.ts";

export async function processClinicalQuestion(query: string) {
  // 1. Call Gemini with Tools
  // (We'll implement the fetch in the next step)
  const toolCall = await callGeminiWithTools(query, PEO_TOOL);

  // 2. Logic: If missing keys exist, map them to our registry
  const missingKeys = toolCall.missing_info_keys || [];
  const clarificationQuestions = missingKeys.map((key: string) => ({
    key,
    ...QUESTION_REGISTRY[key]
  }));

  // 3. Return a clean State
  return {
    peo: toolCall.peo_data,
    clarification_questions: clarificationQuestions,
    is_ready: missingKeys.length === 0
  };
}