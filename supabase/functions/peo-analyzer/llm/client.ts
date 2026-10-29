import { QUESTION_REGISTRY } from "../core/registry.ts";

export const getPEOTool = () => ({
  name: "extract_peo",
  description: `Extract PEO data. Compare the question against these potential missing info categories: ${Object.keys(QUESTION_REGISTRY).join(", ")}. If the question is too broad to provide a specific clinical answer, list the appropriate registry keys in missing_info_keys.`,
  parameters: {
    type: "OBJECT",
    properties: {
      question_type: { type: "STRING" },
      peo_data: { 
        type: "OBJECT", 
        properties: {
          patient: { type: "OBJECT", properties: { condition: {type: "STRING"} } },
          exposure: { type: "OBJECT", properties: { drug: {type: "STRING"} } },
          outcome: { type: "OBJECT", properties: { primary: {type: "STRING"} } }
        }
      },
      missing_info_keys: { 
        type: "ARRAY", 
        items: { type: "STRING" },
        description: "Registry keys that would make the evidence search more clinically relevant."
      }
    },
    required: ["question_type", "peo_data", "missing_info_keys"]
  }
});

export async function callGeminiWithTools(query: string, tool: any) {
  const apiKey = Deno.env.get("GEMINI_API_KEY");
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: query }] }],
      tools: [{ functionDeclarations: [tool] }],
      toolConfig: { functionCallingConfig: { mode: "ANY", allowedFunctionNames: [tool.name] } }
    }),
  });

  const data = await response.json();
  return data.candidates[0].content.parts[0].functionCall.args;
}