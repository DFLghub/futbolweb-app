import BrandHeader from "@/components/BrandHeader";
import PredictDemoForm from "@/components/PredictDemoForm";
import SimpleNav from "@/components/SimpleNav";
import { worldCup2026Matches } from "@/lib/world-cup-2026-matches";

type PredictPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function titleCase(value: string) {
  return value
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatMatchLabel(slug: string) {
  const knownMatch = worldCup2026Matches.find((match) => match.slug === slug);

  if (knownMatch) {
    return `${knownMatch.homeTeam.name} vs ${knownMatch.awayTeam.name} (${knownMatch.kickoffET})`;
  }

  const normalized = slug
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

  if (!normalized) {
    return "Partido Mundial";
  }

  const dateMatch = normalized.match(/\b(20\d{2})\s+(\d{2})\s+(\d{2})\b/);
  const dateLabel = dateMatch
    ? `${dateMatch[1]}-${dateMatch[2]}-${dateMatch[3]}`
    : "";
  const teamsText = dateMatch
    ? normalized.slice(0, dateMatch.index).trim()
    : normalized;
  const teams = teamsText.split(" ").filter(Boolean);

  if (teams.length >= 2) {
    const midpoint = Math.ceil(teams.length / 2);
    const firstTeam = titleCase(teams.slice(0, midpoint).join(" "));
    const secondTeam = titleCase(teams.slice(midpoint).join(" "));
    return dateLabel
      ? `${firstTeam} vs ${secondTeam} (${dateLabel})`
      : `${firstTeam} vs ${secondTeam}`;
  }

  return titleCase(normalized);
}

export default async function PredictPage({ params }: PredictPageProps) {
  const { slug } = await params;
  const matchLabel = formatMatchLabel(slug);

  return (
    <main className="min-h-screen bg-[#07111f] px-5 py-6 text-white md:px-10 md:py-8">
      <div className="mx-auto max-w-3xl">
        <BrandHeader className="mb-3" />
        <div className="mb-5 border-b border-white/10 pb-4">
          <SimpleNav compact />
        </div>

        <header className="mb-5">
          <div className="mb-3 inline-flex rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-cyan-100">
            Modo Mundial v0.1
          </div>

          <h1 className="text-3xl font-black leading-tight tracking-tight md:text-5xl">
            Haz tu pronóstico
          </h1>

          <div className="mt-4 rounded-md border border-white/10 bg-black/20 px-4 py-3 text-sm text-slate-300">
            <span className="font-semibold text-slate-100">Partido:</span>{" "}
            <span>{matchLabel}</span>
          </div>
        </header>

        <PredictDemoForm matchLabel={matchLabel} matchSlug={slug} />
      </div>
    </main>
  );
}
