import { LLMProvider } from "../index.ts";

export class GeminiProvider implements LLMProvider {
  async generate(prompt: string): Promise<string> {
    const apiKey = Deno.env.get("GEMINI_API_KEY");
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" } // Forces JSON!
      }),
    });

    const data = await response.json();
    
    if (!response.ok) throw new Error(`Gemini Error: ${JSON.stringify(data)}`);
    
    // Extract the text from Gemini's response structure
    return data.candidates[0].content.parts[0].text;
  }
}