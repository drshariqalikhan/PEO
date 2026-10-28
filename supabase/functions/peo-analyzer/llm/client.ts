// Define the PEO schema as a "Tool" for Gemini
export const PEO_TOOL = {
  name: "extract_peo",
  description: "Extract PEO data and identify missing clinical parameters.",
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
        description: "List of keys from the QUESTION_REGISTRY that are missing."
      }
    },
    required: ["question_type", "peo_data", "missing_info_keys"]
  }
};