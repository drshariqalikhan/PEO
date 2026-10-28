import { LLMProvider } from "../index.ts";

export class PollinationsProvider implements LLMProvider {
  async generate(prompt: string): Promise<string> {
    const response = await fetch("https://text.pollinations.ai/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        // Pollinations now requires the 'messages' format
        messages: [
          { role: "system", content: "You are a clinical research assistant. Always output valid JSON." },
          { role: "user", content: prompt }
        ],
        model: "openai",
        seed: 42,
        json: true // Many API versions use this to force JSON output
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Pollinations API returned ${response.status}: ${errorText}`);
    }
    
    return await response.text();
  }
}