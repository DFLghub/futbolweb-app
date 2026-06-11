import { NextResponse } from "next/server";

import { isLocale, normalizeLocale } from "@/lib/i18n";
import { buildGptRealityContext, getTournamentReality } from "@/lib/tournament-reality";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const localeParam = url.searchParams.get("locale") ?? undefined;
  const locale = isLocale(localeParam) ? localeParam : normalizeLocale(undefined);
  const reality = await getTournamentReality(locale);

  return NextResponse.json({
    ok: true,
    reality,
    gptContext: buildGptRealityContext(reality),
  });
}
