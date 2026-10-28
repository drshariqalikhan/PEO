import { LLMProvider } from "../index.ts";

export class PollinationsProvider implements LLMProvider {
  async generate(prompt: string): Promise<string> {
    try {
      const response = await fetch("https://text.pollinations.ai/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          prompt: prompt, 
          model: "openai",
          seed: 42 
        }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Pollinations API returned ${response.status}: ${errorText}`);
      }
      
      return await response.text();
    } catch (err) {
      console.error("Fetch Error:", err);
      throw err; // This will show in your Supabase Logs
    }
  }
}