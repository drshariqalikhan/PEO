import { callGeminiWithTools } from "../llm/client.ts";
import { PEO_TOOL } from "../llm/client.ts";
import { QUESTION_REGISTRY } from "./registry.ts";


export async function processClinicalQuestion(query: string) {
  // Pass the dynamic tool definition
  const toolCall = await callGeminiWithTools(query, getPEOTool());

  const missingKeys = toolCall.missing_info_keys || [];
  
  // Map ANY key returned by the LLM to the registry
  const clarificationQuestions = missingKeys
    .filter((key: string) => QUESTION_REGISTRY[key])
    .map((key: string) => ({ id: key, ...QUESTION_REGISTRY[key] }));

  return {
    peo: toolCall.peo_data,
    question_type: toolCall.question_type,
    clarification_questions: clarificationQuestions,
    // A query is ready IF the LLM didn't flag any missing keys
    is_ready: missingKeys.length === 0
  };
}