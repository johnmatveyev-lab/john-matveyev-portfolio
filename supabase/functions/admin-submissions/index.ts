import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-admin-password, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS")
    return new Response(null, { headers: corsHeaders });

  const ADMIN_PASSWORD = Deno.env.get("ADMIN_PASSWORD");
  const password = req.headers.get("x-admin-password");

  if (!ADMIN_PASSWORD || password !== ADMIN_PASSWORD) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const url = new URL(req.url);
  const resource = url.searchParams.get("resource") || "submissions";

  try {
    // ── SUBMISSIONS ──────────────────────────────────────────────
    if (resource === "submissions") {
      if (req.method === "GET") {
        const status = url.searchParams.get("status");
        let query = supabase
          .from("project_submissions")
          .select("*")
          .order("created_at", { ascending: false });
        if (status) query = query.eq("status", status);
        const { data, error } = await query;
        if (error) throw error;
        return json(data);
      }
      if (req.method === "PATCH") {
        const { id, status } = await req.json();
        const { error } = await supabase
          .from("project_submissions")
          .update({ status })
          .eq("id", id);
        if (error) throw error;
        return json({ success: true });
      }
      if (req.method === "DELETE") {
        const { id } = await req.json();
        const { error } = await supabase
          .from("project_submissions")
          .delete()
          .eq("id", id);
        if (error) throw error;
        return json({ success: true });
      }
    }

    // ── MESSAGES ─────────────────────────────────────────────────
    if (resource === "messages") {
      if (req.method === "GET") {
        const archived = url.searchParams.get("archived") === "true";
        const { data, error } = await supabase
          .from("contact_messages")
          .select("*")
          .eq("is_archived", archived)
          .order("created_at", { ascending: false });
        if (error) throw error;
        return json(data);
      }
      if (req.method === "PATCH") {
        const { id, ...updates } = await req.json();
        const { error } = await supabase
          .from("contact_messages")
          .update(updates)
          .eq("id", id);
        if (error) throw error;
        return json({ success: true });
      }
      if (req.method === "DELETE") {
        const { id } = await req.json();
        const { error } = await supabase
          .from("contact_messages")
          .delete()
          .eq("id", id);
        if (error) throw error;
        return json({ success: true });
      }
    }

    // ── TESTIMONIALS ─────────────────────────────────────────────
    if (resource === "testimonials") {
      if (req.method === "GET") {
        const { data, error } = await supabase
          .from("testimonials")
          .select("*")
          .order("sort_order", { ascending: true });
        if (error) throw error;
        return json(data);
      }
      if (req.method === "POST") {
        const body = await req.json();
        const { data, error } = await supabase
          .from("testimonials")
          .insert(body)
          .select()
          .single();
        if (error) throw error;
        return json(data);
      }
      if (req.method === "PATCH") {
        const { id, ...updates } = await req.json();
        const { error } = await supabase
          .from("testimonials")
          .update(updates)
          .eq("id", id);
        if (error) throw error;
        return json({ success: true });
      }
      if (req.method === "DELETE") {
        const { id } = await req.json();
        const { error } = await supabase
          .from("testimonials")
          .delete()
          .eq("id", id);
        if (error) throw error;
        return json({ success: true });
      }
    }

    // ── PROJECTS ──────────────────────────────────────────────────
    if (resource === "projects") {
      if (req.method === "GET") {
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .order("created_at", { ascending: false });
        if (error) throw error;
        return json(data);
      }
      if (req.method === "POST") {
        const body = await req.json();
        const { data, error } = await supabase
          .from("projects")
          .insert(body)
          .select()
          .single();
        if (error) throw error;
        return json(data);
      }
      if (req.method === "PATCH") {
        const { id, ...updates } = await req.json();
        const { data, error } = await supabase
          .from("projects")
          .update(updates)
          .eq("id", id)
          .select()
          .single();
        if (error) throw error;
        return json(data);
      }
      if (req.method === "DELETE") {
        const { id } = await req.json();
        const { error } = await supabase
          .from("projects")
          .delete()
          .eq("id", id);
        if (error) throw error;
        return json({ success: true });
      }
    }

    // ── SETTINGS ─────────────────────────────────────────────────
    if (resource === "settings") {
      if (req.method === "GET") {
        const { data, error } = await supabase
          .from("site_settings")
          .select("*");
        if (error) throw error;
        return json(data);
      }
      if (req.method === "PATCH") {
        const { key, value } = await req.json();
        const { error } = await supabase
          .from("site_settings")
          .upsert({ key, value, updated_at: new Date().toISOString() });
        if (error) throw error;
        return json({ success: true });
      }
    }

    return new Response(
      JSON.stringify({ error: "Not found" }),
      { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("admin-submissions error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  function json(data: unknown) {
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
