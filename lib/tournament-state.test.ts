import { describe, expect, it } from "vitest";

import { deriveHomeMatchState } from "@/lib/tournament-state";

const MEXICO_SOUTH_AFRICA = "mexico-south-africa-2026-06-11";
const SOUTH_KOREA_CZECHIA = "south-korea-czechia-2026-06-11";
const CANADA_BOSNIA = "canada-bosnia-and-herzegovina-2026-06-12";
const USA_PARAGUAY = "usa-paraguay-2026-06-12";

function result(match_slug: string, score_a: number, score_b: number) {
  return {
    match_slug,
    score_a,
    score_b,
  };
}

describe("deriveHomeMatchState", () => {
  it("keeps the nearest future match upcoming and sets it as nextMatch", async () => {
    const state = await deriveHomeMatchState("es", new Date("2026-06-11T18:00:00Z"), []);

    expect(state.nextMatch?.slug).toBe(MEXICO_SOUTH_AFRICA);
    expect(state.nextMatch?.status).toBe("scheduled");
    expect(state.todayUpcomingMatches.map((match) => match.slug)).toContain(MEXICO_SOUTH_AFRICA);
    expect(state.latestFinishedMatch).toBeNull();
    expect(state.liveMatches).toHaveLength(0);
  });

  it("marks a started match with a result as final and chooses the most recent final result", async () => {
    const state = await deriveHomeMatchState("es", new Date("2026-06-12T21:30:00Z"), [
      result(MEXICO_SOUTH_AFRICA, 2, 0),
      result(CANADA_BOSNIA, 1, 0),
    ]);

    expect(state.latestFinishedMatch?.slug).toBe(CANADA_BOSNIA);
    expect(state.latestFinishedMatch?.status).toBe("final");
    expect(state.latestFinishedMatch?.homeScore).toBe(1);
    expect(state.latestFinishedMatch?.awayScore).toBe(0);
    expect(state.todayFinishedMatches.map((match) => match.slug)).toContain(CANADA_BOSNIA);
    expect(state.nextMatch?.slug).toBe(USA_PARAGUAY);
  });

  it("treats an expired started match without a result as pending result, not upcoming", async () => {
    const state = await deriveHomeMatchState("es", new Date("2026-06-11T21:30:00Z"), []);

    expect(state.todayFinishedPendingResultMatches.map((match) => match.slug)).toContain(
      MEXICO_SOUTH_AFRICA,
    );
    expect(state.todayUpcomingMatches.map((match) => match.slug)).not.toContain(
      MEXICO_SOUTH_AFRICA,
    );
    expect(state.latestFinishedMatch).toBeNull();
    expect(state.nextMatch?.slug).toBe(SOUTH_KOREA_CZECHIA);
  });

  it("places a started match inside the live window in liveMatches", async () => {
    const state = await deriveHomeMatchState("es", new Date("2026-06-11T20:00:00Z"), []);

    expect(state.liveMatches.map((match) => match.slug)).toContain(MEXICO_SOUTH_AFRICA);
    expect(state.todayUpcomingMatches.map((match) => match.slug)).toContain(SOUTH_KOREA_CZECHIA);
    expect(state.todayFinishedPendingResultMatches).toHaveLength(0);
  });

  it("does not promote a future match result from bad seed data into latestFinishedMatch", async () => {
    const state = await deriveHomeMatchState("es", new Date("2026-06-11T18:00:00Z"), [
      result(MEXICO_SOUTH_AFRICA, 2, 0),
    ]);

    expect(state.latestFinishedMatch).toBeNull();
    expect(state.todayFinishedMatches).toHaveLength(0);
    expect(state.nextMatch?.slug).toBe(MEXICO_SOUTH_AFRICA);
    expect(state.nextMatch?.status).toBe("scheduled");
  });

  it("separates today counts for finished, live, upcoming, and pending result states", async () => {
    const finishedState = await deriveHomeMatchState("es", new Date("2026-06-11T21:30:00Z"), [
      result(MEXICO_SOUTH_AFRICA, 2, 0),
    ]);
    const liveState = await deriveHomeMatchState("es", new Date("2026-06-11T20:00:00Z"), []);
    const pendingState = await deriveHomeMatchState("es", new Date("2026-06-11T21:30:00Z"), []);

    expect(finishedState.todayFinishedMatches).toHaveLength(1);
    expect(finishedState.liveMatches).toHaveLength(0);
    expect(finishedState.todayUpcomingMatches).toHaveLength(1);
    expect(finishedState.todayFinishedPendingResultMatches).toHaveLength(0);

    expect(liveState.todayFinishedMatches).toHaveLength(0);
    expect(liveState.liveMatches).toHaveLength(1);
    expect(liveState.todayUpcomingMatches).toHaveLength(1);
    expect(liveState.todayFinishedPendingResultMatches).toHaveLength(0);

    expect(pendingState.todayFinishedMatches).toHaveLength(0);
    expect(pendingState.liveMatches).toHaveLength(0);
    expect(pendingState.todayUpcomingMatches).toHaveLength(1);
    expect(pendingState.todayFinishedPendingResultMatches).toHaveLength(1);
  });

  it("keeps Mexico 2-0 South Africa final and leaves the next future match as nextMatch", async () => {
    const state = await deriveHomeMatchState("es", new Date("2026-06-11T21:30:00Z"), [
      result(MEXICO_SOUTH_AFRICA, 2, 0),
    ]);

    expect(state.latestFinishedMatch?.slug).toBe(MEXICO_SOUTH_AFRICA);
    expect(state.latestFinishedMatch?.status).toBe("final");
    expect(state.latestFinishedMatch?.homeScore).toBe(2);
    expect(state.latestFinishedMatch?.awayScore).toBe(0);
    expect(state.todayUpcomingMatches.map((match) => match.slug)).not.toContain(
      MEXICO_SOUTH_AFRICA,
    );
    expect(state.nextMatch?.slug).toBe(SOUTH_KOREA_CZECHIA);
  });
});
