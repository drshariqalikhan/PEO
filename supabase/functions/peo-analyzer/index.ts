import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { analyzeClinicalQuestion } from "./core/analyzer.ts";
import { cleanJsonResponse, fixTruncatedJson } from "./core/utils.ts";
import { PeoSchema } from "./schema.ts";

serve(async (req) => {
  // 1. Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { 
      headers: { 
        "Access-Control-Allow-Origin": "*", 
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type" 
      } 
    });
  }

  try {
    const body = await req.json();
    const { query, clarification_answers } = body;

    if (!query) {
      return new Response(JSON.stringify({ error: "Query is required" }), { status: 400 });
    }

    // 2. Get LLM response
    const rawOutput = await analyzeClinicalQuestion(query, clarification_answers || {});
    
    // 3. Clean and attempt to fix truncated JSON
    let cleanedOutput = cleanJsonResponse(rawOutput);
    cleanedOutput = fixTruncatedJson(cleanedOutput);

    // 4. Parse
    let parsed;
    try {
      parsed = JSON.parse(cleanedOutput);
    } catch (e) {
      return new Response(JSON.stringify({ 
        error: "Invalid JSON from LLM", 
        raw: cleanedOutput,
        details: e.message 
      }), { status: 500 });
    }

    // 5. Schema Validation
    const validation = PeoSchema.safeParse(parsed);
    if (!validation.success) {
      return new Response(JSON.stringify({ 
        error: "Validation failed", 
        details: validation.error 
      }), { status: 422 });
    }

    // 6. Return success
    return new Response(JSON.stringify({ success: true, ...validation.data }), {
      headers: { 
        "Content-Type": "application/json", 
        "Access-Control-Allow-Origin": "*" 
      },
    });

  } catch (err) {
    console.error("Function Error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
});