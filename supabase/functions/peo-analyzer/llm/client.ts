export const PEO_TOOL = {
  name: "extract_peo",
  description: "Extract PEO data and identify missing clinical parameters from the registry keys.",
  parameters: {
    type: "OBJECT",
    properties: {
      question_type: { type: "STRING", enum: ["therapy", "harm", "prognosis", "diagnosis", "prevention", "screening", "etiology"] },
      peo_data: { 
        type: "OBJECT", 
        properties: {
          patient: { type: "OBJECT", properties: { condition: {type: "STRING"}, age: {type: "NUMBER"} } },
          exposure: { type: "OBJECT", properties: { drug: {type: "STRING"}, dose: {type: "STRING"} } },
          outcome: { type: "OBJECT", properties: { primary: {type: "STRING"} } }
        }
      },
      missing_info_keys: { 
        type: "ARRAY", 
        items: { type: "STRING" },
        description: "List of keys from the QUESTION_REGISTRY that are essential but missing."
      }
    },
    required: ["question_type", "peo_data", "missing_info_keys"]
  }
};

export async function callGeminiWithTools(query: string, tool: any) {
  const apiKey = Deno.env.get("GEMINI_API_KEY");
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`;

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