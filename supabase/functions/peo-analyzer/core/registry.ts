export const QUESTION_REGISTRY: Record<string, any> = {
  "indication": {
    question: "What is the primary indication for Apixaban?",
    options: ["Atrial Fibrillation", "DVT/PE Treatment", "VTE Prophylaxis", "Other"],
    field: "exposure.indication"
  },
  "renal_function": {
    question: "What is the patient's estimated CrCl?",
    options: ["<15", "15-29", "30-50", ">50", "Unknown"],
    field: "patient.renal_function"
  }
};