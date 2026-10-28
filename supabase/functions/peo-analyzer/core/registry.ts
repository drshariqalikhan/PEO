export const QUESTION_REGISTRY: Record<string, any> = {
  "indication": {
    question: "What is the primary indication for Apixaban?",
    options: ["Atrial Fibrillation", "VTE/PE Treatment", "VTE Prophylaxis", "Other"],
    field: "exposure.indication"
  },
  "renal_function": {
    question: "What is the patient's estimated CrCl?",
    options: ["<15 mL/min", "15-29 mL/min", "30-50 mL/min", ">50 mL/min", "Unknown"],
    field: "patient.renal_function"
  },
  "history_gi": {
    question: "Does the patient have a history of GI issues?",
    options: ["None", "Mallory-Weiss", "Ulcer Disease", "Recent GI Bleed", "Other"],
    field: "patient.history"
  }
};