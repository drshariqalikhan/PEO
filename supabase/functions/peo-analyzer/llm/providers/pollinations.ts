import { LLMProvider } from "../index.ts";

export class PollinationsProvider implements LLMProvider {
  async generate(prompt: string): Promise<string> {
    const response = await fetch("https://text.pollinations.ai/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        prompt: prompt, 
        model: "openai",
        seed: 42 // Optional: ensures consistency
      }),
    });
    
    if (!response.ok) throw new Error("Pollinations API failed");
    return await response.text();
  }
}