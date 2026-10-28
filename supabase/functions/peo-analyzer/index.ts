import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { processClinicalQuestion } from "./core/engine.ts";

serve(async (req) => {
  try {
    const { query } = await req.json();
    const result = await processClinicalQuestion(query);
    return new Response(JSON.stringify(result), { headers: { "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
});