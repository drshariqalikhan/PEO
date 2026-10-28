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

export function fixTruncatedJson(json: string): string {
  // If it ends abruptly inside a string or object, try to close it
  let fixed = json.trim();
  // Simple check: if it ends in a quote or character but not a brace, add a closing brace
  if (!fixed.endsWith("}")) {
    fixed += "}";
  }
  return fixed;
}