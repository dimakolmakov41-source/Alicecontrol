import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const ALLOWED_ORIGIN = "https://dimakolmakov41-source.github.io";
const API_BASE = "https://api.iot.yandex.net";

const corsHeaders = {
  "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
  "Access-Control-Allow-Headers": "authorization, content-type, x-yandex-token",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Vary": "Origin",
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json; charset=utf-8" },
  });
}

Deno.serve(async (req: Request) => {
  const origin = req.headers.get("origin");
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (origin && origin !== ALLOWED_ORIGIN) return json({ error: "Origin not allowed" }, 403);
  if (req.method !== "GET" && req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  const token = req.headers.get("x-yandex-token");
  if (!token || token.length < 20 || token.length > 4096) {
    return json({ error: "Missing or invalid Yandex OAuth token" }, 401);
  }

  const url = new URL(req.url);
  const resource = url.searchParams.get("resource") ?? "user/info";
  const allowed =
    resource === "user/info" ||
    /^devices\/[A-Za-z0-9_-]+$/.test(resource) ||
    /^groups\/[A-Za-z0-9_-]+$/.test(resource) ||
    /^devices\/actions$/.test(resource) ||
    /^groups\/[A-Za-z0-9_-]+\/actions$/.test(resource) ||
    /^scenarios\/[A-Za-z0-9_-]+\/actions$/.test(resource);

  if (!allowed) return json({ error: "Unsupported resource" }, 400);

  const isAction = resource.endsWith("/actions");
  if (isAction && req.method !== "POST") return json({ error: "Actions require POST" }, 405);
  if (!isAction && req.method !== "GET") return json({ error: "This resource requires GET" }, 405);

  let body: string | undefined;
  if (req.method === "POST") {
    const raw = await req.text();
    if (raw.length > 64_000) return json({ error: "Request body too large" }, 413);
    try { JSON.parse(raw); } catch { return json({ error: "Body must be valid JSON" }, 400); }
    body = raw;
  }

  try {
    const upstream = await fetch(`${API_BASE}/v1.0/${resource}`, {
      method: req.method,
      headers: {
        "Authorization": `Bearer ${token}`,
        ...(body ? { "Content-Type": "application/json" } : {}),
      },
      body,
    });
    const text = await upstream.text();
    return new Response(text, {
      status: upstream.status,
      headers: {
        ...corsHeaders,
        "Content-Type": upstream.headers.get("content-type") ?? "application/json",
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return json({ error: "Could not reach Yandex Smart Home API" }, 502);
  }
});
