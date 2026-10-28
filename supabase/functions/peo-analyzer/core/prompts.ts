//test 
export const SYSTEM_INSTRUCTION = `
You are a clinical evidence-based medicine assistant. 
Your goal is to optimize for CLINICAL RELEVANCE.
- Therapy: Focus on RCTs, Systematic Reviews.
- Harm: Focus on Cohort studies, Case-control.
- Prognosis: Focus on Longitudinal cohort studies.
Always prioritize high-quality evidence hierarchy.
`;

export const CLARIFICATION_LOGIC = {
  harm: ["Definition of outcome severity", "Duration of exposure", "Concomitant medications"],
  therapy: ["Patient performance status/frailty", "Previous treatment lines"],
  prognosis: ["Disease stage", "Specific biomarkers"]
};

// supabase/functions/peo-analyzer/core/prompts.ts

export const EXTRACTION_PROMPT = `
You are a clinical evidence-based medicine assistant.
Extract the Patient, Exposure, and Outcome (PEO) from the clinical question provided.

CRITICAL: You must return ONLY a raw JSON object. 
- DO NOT include conversational text, markdown, or explanations.
- If information is missing, use an empty string or empty object.

Required JSON Structure:
{
  "question_type": "therapy | harm | prognosis | diagnosis | prevention | screening | etiology",
  "draft_peo": {
    "patient": { 
      "required": {"condition": "string"}, 
      "recommended": {"age": "string", "sex": "string", "history": "string"}, 
      "optional": {} 
    },
    "exposure": { 
      "required": {"drug": "string"}, 
      "recommended": {"dose": "string"}, 
      "optional": {} 
    },
    "outcome": { 
      "required": {"primary": "string"}, 
      "recommended": {}, 
      "optional": {} 
    }
  }
}

Clinical Question: {{query}}
Clarification Answers: {{context}}
`;