import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { name, tagline, description, designStyle, keyFeatures, techStack, mockupImageUrl, pageMockups } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const styleMap: Record<string, string> = {
      "Minimal & Clean": "minimalist white background, clean sans-serif typography (Inter/Outfit), generous whitespace, subtle borders, soft shadows, professional blues and grays",
      "Bold & Vibrant": "bold vibrant gradient colors, large headings, gradient accent backgrounds, energetic, modern layout with strong visual hierarchy",
      "Dark & Premium": "dark background (#0a0a0a/#0D1016), cyan/teal accent glows, glassmorphism cards with backdrop-blur, luxury tech aesthetic, subtle grid patterns",
      "Playful & Colorful": "colorful pastel illustrations, rounded corners, fun gradients, friendly font choices, approachable and warm",
    };
    const styleDesc = styleMap[designStyle] || styleMap["Dark & Premium"];
    const featuresText = keyFeatures?.slice(0, 6).join("\n- ") || "";
    const techText = techStack?.join(", ") || "HTML, CSS, JavaScript";

    const pageNames = pageMockups?.map((p: any) => p.pageName).filter(Boolean) || [];
    const pagesInstruction = pageNames.length > 0
      ? `Also generate these additional pages as separate HTML files: ${pageNames.join(", ")}. Each page should share the same CSS stylesheet and have consistent navigation.`
      : "";

    const prompt = `You are a senior frontend developer. Generate a complete, production-ready static website for a product called "${name}".

Product Details:
- Tagline: "${tagline}"
- Description: "${description}"
- Key Features:
  - ${featuresText}
- Suggested Tech Stack: ${techText}

Design Requirements:
- Style: ${styleDesc}
- The landing page should have: hero section with name "${name}" and tagline, navigation bar, feature highlights grid, "How It Works" section, pricing/CTA section, and footer
- Use modern CSS (flexbox, grid, custom properties, smooth transitions)
- Add subtle hover animations and scroll-triggered effects using IntersectionObserver
- Make it fully responsive (mobile-first)
- Use Google Fonts (Inter or Outfit for body, a display font for headings)
- Include proper meta tags, favicon placeholder, and semantic HTML
${pagesInstruction}

Generate the following files:
1. index.html - Main landing page
2. styles.css - Complete stylesheet with CSS custom properties for theming
3. script.js - Interactive functionality (mobile menu, scroll animations, smooth scrolling)
${pageNames.map((p: string, i: number) => `${i + 4}. ${p.toLowerCase()}.html - ${p} page`).join("\n")}

IMPORTANT: 
- All HTML files should link to the same styles.css and script.js
- Use relative paths for all resources
- The code should work by simply opening index.html in a browser
- Include placeholder images using CSS gradients or SVG shapes (not external URLs)
- Write clean, well-commented, production-quality code`;

    const fileProperties: Record<string, any> = {
      "index_html": { type: "string", description: "Complete HTML content for index.html (landing page)" },
      "styles_css": { type: "string", description: "Complete CSS stylesheet content" },
      "script_js": { type: "string", description: "Complete JavaScript file content" },
    };

    for (const pageName of pageNames) {
      const key = `${pageName.toLowerCase()}_html`;
      fileProperties[key] = { type: "string", description: `Complete HTML content for ${pageName.toLowerCase()}.html` };
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-pro-preview",
        messages: [
          { role: "system", content: "You are a senior frontend developer. Generate complete, working website code via function calling. Every file should be production-quality, well-structured, and fully functional." },
          { role: "user", content: prompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "generate_website_code",
              description: "Generate complete website files",
              parameters: {
                type: "object",
                properties: fileProperties,
                required: ["index_html", "styles_css", "script_js"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "generate_website_code" } },
        max_tokens: 16384,
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
      console.error("Code generation error:", response.status, t);
      return new Response(JSON.stringify({ error: "Code generation failed" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      return new Response(JSON.stringify({ error: "No code generated" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const generated = JSON.parse(toolCall.function.arguments);

    // Transform the flat key-value map into an array of { filename, content }
    const files: { filename: string; content: string }[] = [];

    for (const [key, content] of Object.entries(generated)) {
      if (typeof content !== "string" || !content.trim()) continue;
      // Convert key format: "index_html" -> "index.html", "styles_css" -> "styles.css"
      const filename = key.replace(/_([^_]+)$/, ".$1");
      files.push({ filename, content: content as string });
    }

    if (files.length === 0) {
      return new Response(JSON.stringify({ error: "No valid files generated" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ files }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-code error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
