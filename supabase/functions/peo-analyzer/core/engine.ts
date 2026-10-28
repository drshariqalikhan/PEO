import { callGeminiWithTools } from "../llm/client.ts";
import { PEO_TOOL } from "../llm/client.ts";
import { QUESTION_REGISTRY } from "./registry.ts";

export async function processClinicalQuestion(query: string) {
  const toolCall = await callGeminiWithTools(query, PEO_TOOL);

  const missingKeys = toolCall.missing_info_keys || [];
  const clarificationQuestions = missingKeys
    .filter((key: string) => QUESTION_REGISTRY[key])
    .map((key: string) => ({ id: key, ...QUESTION_REGISTRY[key] }));

  return {
    peo: toolCall.peo_data,
    question_type: toolCall.question_type,
    clarification_questions: clarificationQuestions,
    is_ready: missingKeys.length === 0
  };
}