import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const PAGE_TYPES = [
  { name: "About", desc: "About page with company story, team section, mission/values" },
  { name: "Features", desc: "Features page with feature grid, comparisons, detailed descriptions" },
  { name: "Pricing", desc: "Pricing page with tier cards, feature comparison table, FAQ" },
  { name: "Dashboard", desc: "Dashboard/app preview page showing the main product interface with charts, data tables, sidebar navigation" },
  { name: "Contact", desc: "Contact page with form, office info, map placeholder, social links" },
];

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { name, tagline, description, designStyle, keyFeatures } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const styleMap: Record<string, string> = {
      "Minimal & Clean": "minimalist white/light gray, clean sans-serif typography, generous whitespace, subtle shadows, professional",
      "Bold & Vibrant": "bold vibrant colors, large headings, gradient accents, energetic, modern",
      "Dark & Premium": "dark background (#0a0a0a), cyan/violet accent glows, glass-morphism cards, luxury tech aesthetic",
      "Playful & Colorful": "colorful illustrations, rounded shapes, fun gradients, friendly, approachable",
    };
    const styleDesc = styleMap[designStyle] || styleMap["Dark & Premium"];
    const featuresText = keyFeatures?.slice(0, 4).join(", ") || "";

    const pages: { pageName: string; imageUrl: string }[] = [];

    for (const page of PAGE_TYPES) {
      const prompt = `Generate a modern, high-fidelity "${page.name}" page mockup screenshot for a tech product called "${name}".

Tagline: "${tagline}"
Description: "${description}"
Key Features: ${featuresText}

This is the ${page.name} page: ${page.desc}

Design style: ${styleDesc}

The mockup should look like a real website screenshot with:
- Consistent branding with "${name}"
- Navigation bar matching the landing page
- ${page.desc}
- Modern, polished UI design
- Professional layout with proper spacing

Make it look like a real production website page, not a wireframe. High quality, detailed, pixel-perfect.`;

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
          return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment.", pages }), {
            status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        const t = await response.text();
        console.error(`Page ${page.name} generation error:`, response.status, t);
        pages.push({ pageName: page.name, imageUrl: "" });
        continue;
      }

      const data = await response.json();
      const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url || "";
      pages.push({ pageName: page.name, imageUrl });
    }

    return new Response(JSON.stringify({ pages }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-pages error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
