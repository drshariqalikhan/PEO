//test

export function cleanJsonResponse(raw: string): string {
  // Removes markdown code block formatting if present
  return raw.replace(/```json/g, "").replace(/```/g, "").trim();
}

// Simple JSON repair attempt
export async function repairJson(invalidJson: string, error: string): Promise<string> {
  // In a real production scenario, you would send this to the LLM to fix.
  // For now, we return a fallback object.
  console.error("JSON Parsing Error:", error);
  throw new Error("Failed to generate valid JSON");
}