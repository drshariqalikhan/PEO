// supabase/functions/peo-analyzer/core/evaluator.ts

export function calculateReadiness(peo: any): { score: number, missing: any[] } {
  let score = 0;
  const missing = [];

  // Required checks
  if (peo.patient?.required?.condition) score += 30;
  else missing.push({ field: "patient.condition", reason: "Condition not defined" });

  if (peo.exposure?.required?.drug) score += 30;
  else missing.push({ field: "exposure.drug", reason: "Exposure not defined" });

  if (peo.outcome?.required?.primary) score += 30;
  else missing.push({ field: "outcome.primary", reason: "Primary outcome not defined" });

  // Optional/Recommended checks
  if (Object.keys(peo.patient.recommended).length > 0) score += 10;

  return { score, missing };
}