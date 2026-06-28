import { describe, expect, it } from "vitest";

import {
  applyKnockoutBracketAssignments,
  buildFifaFixtureReality,
  buildKnockoutBracketAssignments,
  knockoutSlugForMatchNumber,
} from "@/lib/knockout-reality";
import { localizeWorldCupMatch, worldCup2026Matches } from "@/lib/world-cup-2026-matches";
import type { MatchResultRow } from "@/lib/tournament-reality";

describe("knockout reality backbone", () => {
  it("maps fixed knockout match numbers to existing slugs", () => {
    expect(knockoutSlugForMatchNumber(73)).toBe("mundial-2026-partido-073");
    expect(knockoutSlugForMatchNumber(104)).toBe("mundial-2026-partido-104");
    expect(knockoutSlugForMatchNumber(72)).toBeNull();
    expect(knockoutSlugForMatchNumber(105)).toBeNull();
  });

  it("builds canonical FIFA fixture realities for all fixed KO slugs", () => {
    const realities = buildFifaFixtureReality(new Date("2026-06-28T12:00:00Z"));

    expect(realities).toHaveLength(32);
    expect(realities[0]).toMatchObject({
      matchNumber: 73,
      slug: "mundial-2026-partido-073",
      sourceName: "FIFA official match schedule",
      status: "upcoming",
    });
    expect(realities.at(-1)).toMatchObject({
      matchNumber: 104,
      slug: "mundial-2026-partido-104",
    });
  });

  it("propagates winners into fixed future placeholders without creating slugs", () => {
    const results: MatchResultRow[] = [
      {
        match_slug: "mundial-2026-partido-074",
        score_a: 1,
        score_b: 1,
        is_knockout: true,
        score_a_120: 2,
        score_b_120: 1,
        advancing_team: "Argentina",
      },
      {
        match_slug: "mundial-2026-partido-077",
        score_a: 0,
        score_b: 2,
        is_knockout: true,
        score_a_120: null,
        score_b_120: null,
        advancing_team: "Francia",
      },
    ];
    const match89 = worldCup2026Matches.find((match) => match.matchNumber === 89);

    expect(match89?.homePlaceholder).toBe("W74");
    expect(match89?.awayPlaceholder).toBe("W77");

    const localizedMatch89 = localizeWorldCupMatch(match89!, "es");
    const [resolvedMatch89] = applyKnockoutBracketAssignments([localizedMatch89], results, "es");

    expect(resolvedMatch89.slug).toBe("mundial-2026-partido-089");
    expect(resolvedMatch89.homeTeam.name).toBe("Argentina");
    expect(resolvedMatch89.awayTeam.name).toBe("Francia");
  });

  it("emits winner placeholders for completed knockout matches", () => {
    const assignments = buildKnockoutBracketAssignments([
      {
        match_slug: "mundial-2026-partido-104",
        score_a: 2,
        score_b: 1,
        is_knockout: true,
        score_a_120: null,
        score_b_120: null,
        advancing_team: "Argentina",
      },
    ]);

    expect(assignments).toContainEqual({
      matchNumber: 104,
      placeholder: "W104",
      teamName: "Argentina",
    });
  });
});
