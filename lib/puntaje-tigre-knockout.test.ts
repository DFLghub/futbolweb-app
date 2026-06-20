import { describe, expect, it } from "vitest";
import { puntajeTigreKnockout } from "@/lib/puntaje-tigre-knockout";

// ── CASE 1: non-draw prediction ────────────────────────────────────────────

describe("Case 1 — non-draw prediction", () => {
  it("exact non-draw prediction at 90 min → full puntaje_tigre score (3.0)", () => {
    expect(
      puntajeTigreKnockout({
        predA: 2, predB: 1,
        predAdvancingTeam: null,
        real90A: 2, real90B: 1,
        real120A: null, real120B: null,
        realAdvancingTeam: "usa",
      }),
    ).toBe(3.0);
  });

  it("non-draw prediction, match ended in draw at 90 min, one number matches → 0.5", () => {
    // User predicted 2-1. Real 90-min score: 1-1 (draw → ET/pens). pred_b (1) == real_90_b (1)
    expect(
      puntajeTigreKnockout({
        predA: 2, predB: 1,
        predAdvancingTeam: null,
        real90A: 1, real90B: 1,
        real120A: 1, real120B: 1,
        realAdvancingTeam: "brazil",
      }),
    ).toBe(0.5);
  });

  it("non-draw prediction, match ended in draw at 90 min, neither number matches → 0.0", () => {
    // User predicted 3-0. Real 90-min score: 1-1 (draw → ET/pens). No number matches.
    expect(
      puntajeTigreKnockout({
        predA: 3, predB: 0,
        predAdvancingTeam: null,
        real90A: 1, real90B: 1,
        real120A: 1, real120B: 1,
        realAdvancingTeam: "brazil",
      }),
    ).toBe(0.0);
  });

  it("non-draw prediction, wrong non-draw result, no partial match → 0.0", () => {
    // User predicted 2-1 (team A wins). Real 90-min: 0-3 (team B wins). No numbers match.
    expect(
      puntajeTigreKnockout({
        predA: 2, predB: 1,
        predAdvancingTeam: null,
        real90A: 0, real90B: 3,
        real120A: null, real120B: null,
        realAdvancingTeam: "france",
      }),
    ).toBe(0.0);
  });
});

// ── CASE 2: draw prediction + advancing team ───────────────────────────────

describe("Case 2 — draw prediction", () => {
  it("draw prediction, 120-min score exact, advancing team correct → 3.0", () => {
    expect(
      puntajeTigreKnockout({
        predA: 1, predB: 1,
        predAdvancingTeam: "argentina",
        real90A: 1, real90B: 1,
        real120A: 1, real120B: 1,
        realAdvancingTeam: "argentina",
      }),
    ).toBe(3.0);
  });

  it("draw prediction, 120-min score exact, advancing team wrong → 2.5", () => {
    expect(
      puntajeTigreKnockout({
        predA: 1, predB: 1,
        predAdvancingTeam: "argentina",
        real90A: 1, real90B: 1,
        real120A: 1, real120B: 1,
        realAdvancingTeam: "netherlands",
      }),
    ).toBe(2.5);
  });

  it("draw prediction, 120-min score wrong → 0.0", () => {
    // User predicted 1-1, but after ET the score became 2-2
    expect(
      puntajeTigreKnockout({
        predA: 1, predB: 1,
        predAdvancingTeam: "argentina",
        real90A: 1, real90B: 1,
        real120A: 2, real120B: 2,
        realAdvancingTeam: "argentina",
      }),
    ).toBe(0.0);
  });

  it("draw prediction when match was NOT drawn at 90 min (real120 is null) → 0.0", () => {
    // User predicted 2-2 but real was 3-1 at 90 min (no ET)
    expect(
      puntajeTigreKnockout({
        predA: 2, predB: 2,
        predAdvancingTeam: "mexico",
        real90A: 3, real90B: 1,
        real120A: null, real120B: null,
        realAdvancingTeam: "mexico",
      }),
    ).toBe(0.0);
  });
});
