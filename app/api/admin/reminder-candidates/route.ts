import { detectReminderCandidates } from "@/lib/reminder-candidates";

function getAdminToken(): string | null {
  return process.env.REMINDER_ADMIN_TOKEN ?? null;
}

function extractBearerToken(request: Request): string | null {
  const auth = request.headers.get("authorization") ?? "";
  if (!auth.startsWith("Bearer ")) return null;
  return auth.slice(7).trim() || null;
}

function unauthorized(message: string, status: number) {
  return Response.json({ ok: false, message }, { status });
}

export async function GET(request: Request) {
  const adminToken = getAdminToken();

  if (!adminToken) {
    return unauthorized("REMINDER_ADMIN_TOKEN not configured on this server.", 503);
  }

  const bearer = extractBearerToken(request);

  if (!bearer || bearer !== adminToken) {
    return unauthorized("Invalid or missing Authorization token.", 401);
  }

  const url = new URL(request.url);
  const matchSlug = url.searchParams.get("match_slug") ?? undefined;

  try {
    const report = await detectReminderCandidates({ matchSlug });
    return Response.json({ ok: true, ...report });
  } catch (error) {
    console.error("[reminder-candidates] error", {
      message: error instanceof Error ? error.message : String(error),
    });
    return Response.json({ ok: false, message: "Internal error generating report." }, { status: 500 });
  }
}
