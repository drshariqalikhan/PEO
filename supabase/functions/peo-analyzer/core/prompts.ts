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