export interface LLMProvider {
  generate(prompt: string): Promise<string>;
}

// // Import the provider you choose to use
// import { PollinationsProvider } from "./providers/pollinations.ts";

// export const getProvider = (): LLMProvider => {
//   // You can easily swap this out later via an environment variable
//   return new PollinationsProvider();
// };

import { GeminiProvider } from "./providers/gemini.ts";

export const getProvider = () => {
  return new GeminiProvider();
};