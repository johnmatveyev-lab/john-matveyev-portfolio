import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { category, platforms, audience, features, designStyle } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const prompt = `You are a senior product strategist and full-stack architect. Based on the following user selections, generate a compelling, detailed project concept.

User Selections:
- Project Category: ${category}
- Tech Stack / Platforms: ${platforms.join(", ")}
- Target Audience: ${audience}
- Key Features: ${features.join(", ")}
- Design Style: ${designStyle}

Generate a creative, specific, and technically feasible project concept. The project should be ambitious but realistic, leveraging the selected technologies effectively.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: "You are a senior product strategist. Return structured project concepts via function calling." },
          { role: "user", content: prompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "generate_project_concept",
              description: "Generate a detailed project concept based on user selections",
              parameters: {
                type: "object",
                properties: {
                  name: { type: "string", description: "Creative project name (2-4 words)" },
                  tagline: { type: "string", description: "One-line tagline (under 80 chars)" },
                  description: { type: "string", description: "Detailed project description (2-3 sentences)" },
                  keyFeatures: {
                    type: "array",
                    items: { type: "string" },
                    description: "4-6 key features of the project",
                  },
                  techStack: {
                    type: "array",
                    items: { type: "string" },
                    description: "Specific technologies and frameworks to use",
                  },
                  uniqueValue: { type: "string", description: "What makes this project unique (1 sentence)" },
                },
                required: ["name", "tagline", "description", "keyFeatures", "techStack", "uniqueValue"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "generate_project_concept" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI generation failed" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      return new Response(JSON.stringify({ error: "No concept generated" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const concept = JSON.parse(toolCall.function.arguments);
    return new Response(JSON.stringify(concept), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-idea error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
