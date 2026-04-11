import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { name, tagline, description, designStyle, keyFeatures, editInstructions } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const featuresText = keyFeatures?.slice(0, 4).join(", ") || "";
    
    const styleMap: Record<string, string> = {
      "Minimal & Clean": "minimalist white/light gray, clean sans-serif typography, generous whitespace, subtle shadows, professional",
      "Bold & Vibrant": "bold vibrant colors, large headings, gradient accents, energetic, modern",
      "Dark & Premium": "dark background (#0a0a0a), cyan/violet accent glows, glass-morphism cards, luxury tech aesthetic",
      "Playful & Colorful": "colorful illustrations, rounded shapes, fun gradients, friendly, approachable",
    };
    const styleDesc = styleMap[designStyle] || styleMap["Dark & Premium"];

    const prompt = `Generate a modern, high-fidelity landing page mockup screenshot for a tech product called "${name}".

Tagline: "${tagline}"
Description: "${description}"
Key Features: ${featuresText}

Design style: ${styleDesc}

The mockup should look like a real website screenshot with:
- A hero section with the product name "${name}" and tagline
- A clean navigation bar at the top
- Feature highlights section
- Modern, polished UI design
- Professional layout with proper spacing
- Call-to-action buttons

Make it look like a real production website, not a wireframe. High quality, detailed, pixel-perfect.${editInstructions ? `\n\nAdditional edit instructions from the user:\n${editInstructions}` : ""}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-pro-image-preview",
        messages: [{ role: "user", content: prompt }],
        modalities: ["image", "text"],
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
      console.error("Mockup generation error:", response.status, t);
      return new Response(JSON.stringify({ error: "Mockup generation failed" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!imageUrl) {
      return new Response(JSON.stringify({ error: "No image generated" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ imageUrl }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-mockup error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
