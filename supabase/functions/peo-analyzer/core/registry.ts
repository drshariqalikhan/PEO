export const QUESTION_REGISTRY: Record<string, any> = {
  // --- CARDIOVASCULAR ---
  "cardio_indication": { question: "What is the primary indication?", options: ["AFib", "Stable CAD", "ACS", "Heart Failure", "VTE/PE", "Other"], field: "exposure.indication" },
  "renal_function": { question: "Estimated CrCl / GFR?", options: ["<15", "15-29", "30-50", "50-80", ">80", "Unknown"], field: "patient.renal_function" },
  "chads_vasc": { question: "What is the patient's CHA2DS2-VASc score?", options: ["0", "1", "2", "3+", "Unknown"], field: "patient.risk_score" },

  // --- ONCOLOGY ---
  "onc_stage": { question: "What is the TNM stage or disease extent?", options: ["Stage I", "Stage II", "Stage III", "Stage IV", "Metastatic", "Unknown"], field: "patient.disease_stage" },
  "onc_histology": { question: "What is the tumor histology/markers?", options: ["ER/PR/HER2+", "EGFR mutated", "KRAS mutated", "Other", "Unknown"], field: "patient.biomarkers" },
  "onc_performance": { question: "What is the ECOG performance status?", options: ["0", "1", "2", "3", "4"], field: "patient.performance_status" },

  // --- PHARMACOLOGY / HARM ---
  "concomitant_meds": { question: "Any high-risk concomitant medications?", options: ["NSAIDs", "Antiplatelets", "Steroids", "CYP Inhibitors", "None"], field: "exposure.interactions" },
  "exposure_duration": { question: "Duration of therapy?", options: ["Acute (<2 weeks)", "Short-term (2-12 weeks)", "Chronic (>3 months)"], field: "exposure.duration" },
  "dose_intensity": { question: "What is the dosing regimen?", options: ["Standard", "Low-dose", "High-dose/Loading", "Renally adjusted"], field: "exposure.dose_intensity" },

  // --- PATIENT DEMOGRAPHICS & STATUS ---
  "age_category": { question: "What is the patient's age category?", options: ["Pediatric", "Adult", "Geriatric (>75)"], field: "patient.age_group" },
  "frailty": { question: "Is the patient considered frail?", options: ["Not frail", "Mildly frail", "Severely frail"], field: "patient.frailty_status" },
  "comorbidities": { question: "Key comorbidities?", options: ["Diabetes", "Hypertension", "COPD", "Autoimmune", "None"], field: "patient.comorbidities" },

  // --- OUTCOME / DIAGNOSTIC ---
  "primary_outcome": { question: "What is the priority outcome for this patient?", options: ["Mortality", "Quality of Life", "Symptom Reduction", "Prevention of Recurrence"], field: "outcome.priority" },
  "diagnostic_standard": { question: "What is the reference standard being compared against?", options: ["Biopsy", "Gold Standard Imaging", "Clinical Diagnosis", "Other"], field: "diagnosis.reference" },
  "time_horizon": { question: "What is the relevant time horizon?", options: ["Immediate (24h)", "Short-term (30d)", "Long-term (1y+)", "Lifetime"], field: "outcome.horizon" }
};