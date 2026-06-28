import { isKnockoutPredictionMatch } from "@/lib/knockout-predictions";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { worldCup2026Matches, type WorldCupMatch } from "@/lib/world-cup-2026-matches";

const PREDICTION_CUTOFF_MS = 5 * 60 * 1000;

export type OpenKoMatchMeta = {
  slug: string;
  homeTeam: string;
  awayTeam: string;
  kickoffUtc: string;
  hoursUntilClose: number;
};

export type CaseBRecipient = {
  phoneMasked: string;
  alias: string;
  groupCode: string | null;
  matchSlug: string;
  matchLabel: string;
  scoreA: number;
  scoreB: number;
  case: "B";
  reason: string;
  messagePreview: string;
};

export type CaseASummaryRow = {
  matchSlug: string;
  matchLabel: string;
  groupCode: string;
  activePhonesInGroup: number;
  phonesThatPredicted: number;
  missingCount: number;
};

export type ReminderCandidatesReport = {
  dryRun: true;
  generatedAt: string;
  openKoMatches: OpenKoMatchMeta[];
  summary: {
    caseBKoDrawIncomplete: number;
    caseAMissingPredictionTotal: number;
  };
  caseBRecipients: CaseBRecipient[];
  caseASummary: CaseASummaryRow[];
};

export function getOpenKoMatches(): WorldCupMatch[] {
  const now = Date.now();
  return worldCup2026Matches.filter((match) => {
    if (!isKnockoutPredictionMatch(match)) return false;
    if (match.status === "final") return false;
    const kickoffMs = new Date(match.kickoffUtc).getTime();
    return kickoffMs - PREDICTION_CUTOFF_MS > now;
  });
}

// Mask middle digits: +573001234567 → +57300****567
export function maskPhone(phone: string): string {
  if (phone.length <= 6) return "****";
  const prefix = phone.slice(0, 6);
  const suffix = phone.slice(-3);
  return `${prefix}****${suffix}`;
}

export function buildCaseBMessage({
  alias,
  scoreA,
  scoreB,
  homeTeam,
  awayTeam,
  matchSlug,
  groupCode,
}: {
  alias: string;
  scoreA: number;
  scoreB: number;
  homeTeam: string;
  awayTeam: string;
  matchSlug: string;
  groupCode: string | null;
}): string {
  const groupParam = groupCode ? `?group=${encodeURIComponent(groupCode)}` : "";
  const link = `futbolweb.app/match/${matchSlug}/predict${groupParam}`;
  return [
    `Hola ${alias} 🟡`,
    `Tu pronóstico ${scoreA}-${scoreB} para ${homeTeam} vs ${awayTeam} está incompleto: falta elegir quién clasifica.`,
    `Corrígelo antes del cierre: ${link}`,
  ].join("\n");
}

export async function detectReminderCandidates(options: {
  matchSlug?: string;
} = {}): Promise<ReminderCandidatesReport> {
  const now = Date.now();
  const openMatches = getOpenKoMatches();
  const targetMatches = options.matchSlug
    ? openMatches.filter((m) => m.slug === options.matchSlug)
    : openMatches;

  const openKoMatches: OpenKoMatchMeta[] = targetMatches.map((m) => ({
    slug: m.slug,
    homeTeam: m.homeTeam.name,
    awayTeam: m.awayTeam.name,
    kickoffUtc: m.kickoffUtc,
    hoursUntilClose: Math.round(
      (new Date(m.kickoffUtc).getTime() - PREDICTION_CUTOFF_MS - now) / 3_600_000,
    ),
  }));

  if (targetMatches.length === 0) {
    return {
      dryRun: true,
      generatedAt: new Date().toISOString(),
      openKoMatches: [],
      summary: { caseBKoDrawIncomplete: 0, caseAMissingPredictionTotal: 0 },
      caseBRecipients: [],
      caseASummary: [],
    };
  }

  const supabase = createSupabaseServerClient();
  const targetSlugs = targetMatches.map((m) => m.slug);

  const { data: allRows } = await supabase
    .from("prediction_intake")
    .select("whatsapp_phone, alias, group_code, match_slug, score_a, score_b, advancing_team")
    .in("match_slug", targetSlugs)
    .in("status", ["accepted", "pending_review"]);

  const rows = allRows ?? [];

  // ── Case B: KO draw (score_a === score_b) with advancing_team NULL ─────────
  const caseBRecipients: CaseBRecipient[] = [];

  for (const match of targetMatches) {
    const matchLabel = `${match.homeTeam.name} vs ${match.awayTeam.name}`;
    const matchRows = rows.filter((r) => r.match_slug === match.slug);
    const drawsMissingTeam = matchRows.filter(
      (r) => r.score_a === r.score_b && (r.advancing_team === null || r.advancing_team === ""),
    );

    for (const r of drawsMissingTeam) {
      caseBRecipients.push({
        phoneMasked: maskPhone(r.whatsapp_phone as string),
        alias: r.alias as string,
        groupCode: (r.group_code as string | null) ?? null,
        matchSlug: match.slug,
        matchLabel,
        scoreA: r.score_a as number,
        scoreB: r.score_b as number,
        case: "B",
        reason: "KO draw prediction — advancing_team is NULL",
        messagePreview: buildCaseBMessage({
          alias: r.alias as string,
          scoreA: r.score_a as number,
          scoreB: r.score_b as number,
          homeTeam: match.homeTeam.name,
          awayTeam: match.awayTeam.name,
          matchSlug: match.slug,
          groupCode: (r.group_code as string | null) ?? null,
        }),
      });
    }
  }

  // ── Case A: active group phones without prediction for open KO ─────────────
  // Count only — no recipient detail, no message previews
  const caseASummary: CaseASummaryRow[] = [];

  // Collect all group_codes seen in predictions for these matches
  const groupCodesInTarget = [
    ...new Set(rows.map((r) => r.group_code as string | null).filter(Boolean) as string[]),
  ];

  if (groupCodesInTarget.length > 0) {
    // For each group_code, get ALL phones that have ever predicted (any match)
    const { data: groupAllRows } = await supabase
      .from("prediction_intake")
      .select("whatsapp_phone, group_code, match_slug")
      .in("group_code", groupCodesInTarget)
      .in("status", ["accepted", "pending_review"]);

    const groupAll = groupAllRows ?? [];

    for (const match of targetMatches) {
      const matchLabel = `${match.homeTeam.name} vs ${match.awayTeam.name}`;
      const phonesForThisMatch = new Set(
        rows.filter((r) => r.match_slug === match.slug).map((r) => r.whatsapp_phone as string),
      );

      for (const groupCode of groupCodesInTarget) {
        const activePhonesInGroup = new Set(
          groupAll
            .filter((r) => (r.group_code as string) === groupCode)
            .map((r) => r.whatsapp_phone as string),
        );

        const phonesThatPredicted = new Set(
          rows
            .filter((r) => r.match_slug === match.slug && (r.group_code as string) === groupCode)
            .map((r) => r.whatsapp_phone as string),
        );

        const missingCount = [...activePhonesInGroup].filter(
          (ph) => !phonesThatPredicted.has(ph),
        ).length;

        // Only include groups that had at least one prediction for any match
        if (activePhonesInGroup.size > 0) {
          caseASummary.push({
            matchSlug: match.slug,
            matchLabel,
            groupCode,
            activePhonesInGroup: activePhonesInGroup.size,
            phonesThatPredicted: phonesThatPredicted.size,
            missingCount,
          });
        }
      }

      void phonesForThisMatch; // used above implicitly via phonesThatPredicted filter
    }
  }

  const caseAMissingPredictionTotal = caseASummary.reduce((acc, r) => acc + r.missingCount, 0);

  return {
    dryRun: true,
    generatedAt: new Date().toISOString(),
    openKoMatches,
    summary: {
      caseBKoDrawIncomplete: caseBRecipients.length,
      caseAMissingPredictionTotal,
    },
    caseBRecipients,
    caseASummary,
  };
}
