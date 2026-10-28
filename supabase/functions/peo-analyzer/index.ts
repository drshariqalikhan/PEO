import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { analyzeClinicalQuestion } from "./core/analyzer.ts";
import { cleanJsonResponse } from "./core/utils.ts";
import { PeoSchema } from "./schema.ts";

serve(async (req) => {
  // 1. Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type" } });
  }

  try {
    const { query, clarification_answers } = await req.json();

    if (!query) {
      return new Response(JSON.stringify({ error: "Query is required" }), { status: 400 });
    }

    // 2. Get LLM response
    const rawOutput = await analyzeClinicalQuestion(query, clarification_answers || {});
    const cleanedOutput = cleanJsonResponse(rawOutput);

    // 3. Parse and Validate
    let parsed;
    try {
      parsed = JSON.parse(cleanedOutput);
    } catch (e) {
      return new Response(JSON.stringify({ error: "Invalid JSON from LLM", raw: cleanedOutput }), { status: 500 });
    }

    const validation = PeoSchema.safeParse(parsed);
    if (!validation.success) {
      return new Response(JSON.stringify({ error: "Validation failed", details: validation.error }), { status: 422 });
    }

    // 4. Return success
    return new Response(JSON.stringify({ success: true, ...validation.data }), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
});