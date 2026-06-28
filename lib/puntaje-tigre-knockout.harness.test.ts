/**
 * Exhaustive synthetic harness for puntajeTigreKnockout().
 *
 * No real-world data, no DB, no network — pure in-memory coverage.
 * Generates ~1000 cases and validates each one against the rule it was
 * designed to exercise. Any failure prints the full input + expected/got.
 */

import { describe, expect, it } from "vitest";
import { puntajeTigreKnockout, type KnockoutScoringInput } from "@/lib/puntaje-tigre-knockout";

// ─── helpers ────────────────────────────────────────────────────────────────

function rng(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function randInt(r: () => number, min: number, max: number): number {
  return Math.floor(r() * (max - min + 1)) + min;
}

const TEAMS = ["arg","bra","fra","ger","esp","eng","ned","por","uru","mex","usa","jpn","kor","mar","sen","aus"];

function pickTeam(r: () => number, exclude?: string): string {
  const pool = exclude ? TEAMS.filter(t => t !== exclude) : TEAMS;
  return pool[Math.floor(r() * pool.length)];
}

// ─── expected score calculator (mirrors the spec, not the impl) ──────────────

function sign(n: number): -1 | 0 | 1 {
  return n > 0 ? 1 : n < 0 ? -1 : 0;
}

function expectedScore(input: KnockoutScoringInput): number {
  const predictedDraw = input.predA === input.predB;
  const predDir = sign(input.predA - input.predB);
  const realDir = sign(input.real90A - input.real90B);
  const exactA = input.predA === input.real90A;
  const exactB = input.predB === input.real90B;
  let regulationPoints = 0.0;

  if (predDir === realDir) {
    if (exactA && exactB) regulationPoints = 3.0;
    else if (exactA || exactB) regulationPoints = 2.5;
    else regulationPoints = 2.0;
  } else if (exactA || exactB) {
    regulationPoints = 0.5;
  }

  if (!predictedDraw) {
    return regulationPoints;
  }

  return regulationPoints + (input.predAdvancingTeam === input.realAdvancingTeam ? 2.0 : 0.0);
}

// ─── generators ─────────────────────────────────────────────────────────────

type Case = { input: KnockoutScoringInput; expected: number; label: string };

/** Case 1a: non-draw prediction, match decided at 90' (no ET) */
function genCase1a_nonDrawPred_nonDrawResult(r: () => number, n: number): Case[] {
  const cases: Case[] = [];
  for (let i = 0; i < n; i++) {
    const teamA = pickTeam(r);
    const teamB = pickTeam(r, teamA);
    // ensure result is NOT a draw
    let r90A: number, r90B: number;
    do { r90A = randInt(r, 0, 7); r90B = randInt(r, 0, 7); } while (r90A === r90B);

    const winner = r90A > r90B ? teamA : teamB;

    // sub-variants: exact / partial A / partial B / correct dir only / wrong dir
    const variant = i % 5;
    let pA: number, pB: number;
    if (variant === 0) { pA = r90A; pB = r90B; }                        // exact
    else if (variant === 1) { pA = r90A; pB = r90B + randInt(r,1,3); }  // exact A, wrong B
    else if (variant === 2) { pA = r90A + randInt(r,1,3); pB = r90B; }  // exact B, wrong A
    else if (variant === 3) {                                             // correct dir, no exact
      pA = r90A + randInt(r, 1, 2); pB = r90B + randInt(r, 1, 2);
      // keep direction
      if (sign(pA - pB) !== sign(r90A - r90B)) pB = Math.max(0, pB - 3);
      if (sign(pA - pB) !== sign(r90A - r90B)) { pA = r90A; pB = r90B; } // fallback
    } else {                                                              // wrong dir
      pA = r90B; pB = r90A + 1; // flip
      if (sign(pA - pB) === sign(r90A - r90B)) pA = 0; pB = r90A + 2;
    }
    // ensure prediction itself is not a draw (that's Case 2)
    if (pA === pB) pB++;

    const input: KnockoutScoringInput = {
      predA: pA, predB: pB, predAdvancingTeam: null,
      real90A: r90A, real90B: r90B,
      real120A: null, real120B: null,
      realAdvancingTeam: winner,
    };
    cases.push({ input, expected: expectedScore(input), label: `1a-v${variant}` });
  }
  return cases;
}

/** Case 1b: non-draw prediction, match went to ET at 90' */
function genCase1b_nonDrawPred_drawResult(r: () => number, n: number): Case[] {
  const cases: Case[] = [];
  for (let i = 0; i < n; i++) {
    const teamA = pickTeam(r);
    const teamB = pickTeam(r, teamA);
    const score = randInt(r, 0, 4);
    const r90A = score, r90B = score; // real 90' is a draw
    const r120A = score, r120B = score; // ET also draw → pens decide

    const realAdv = r() > 0.5 ? teamA : teamB;

    // prediction is non-draw (A wins or B wins)
    let pA: number, pB: number;
    if (r() > 0.5) { pA = randInt(r,1,5); pB = Math.max(0, pA - randInt(r,1,3)); }
    else           { pA = Math.max(0, randInt(r,1,4) - 1); pB = pA + randInt(r,1,3); }
    if (pA === pB) pA++;

    const input: KnockoutScoringInput = {
      predA: pA, predB: pB, predAdvancingTeam: null,
      real90A: r90A, real90B: r90B,
      real120A: r120A, real120B: r120B,
      realAdvancingTeam: realAdv,
    };
    cases.push({ input, expected: expectedScore(input), label: "1b" });
  }
  return cases;
}

/** Case 2a: draw prediction, match decided at 90' (no ET) → 90' score + advancing bonus */
function genCase2a_drawPred_noET(r: () => number, n: number): Case[] {
  const cases: Case[] = [];
  for (let i = 0; i < n; i++) {
    const teamA = pickTeam(r);
    const teamB = pickTeam(r, teamA);
    const pScore = randInt(r, 0, 5);
    let r90A: number, r90B: number;
    do { r90A = randInt(r, 0, 6); r90B = randInt(r, 0, 6); } while (r90A === r90B);
    const realAdv = r90A > r90B ? teamA : teamB;

    const input: KnockoutScoringInput = {
      predA: pScore, predB: pScore, predAdvancingTeam: r() > 0.5 ? teamA : teamB,
      real90A: r90A, real90B: r90B,
      real120A: null, real120B: null,
      realAdvancingTeam: realAdv,
    };
    cases.push({ input, expected: expectedScore(input), label: "2a" });
  }
  return cases;
}

/** Case 2b: draw prediction, match went to ET, exact 120' score */
function genCase2b_drawPred_exactET(r: () => number, n: number): Case[] {
  const cases: Case[] = [];
  for (let i = 0; i < n; i++) {
    const teamA = pickTeam(r);
    const teamB = pickTeam(r, teamA);
    const s90 = randInt(r, 0, 4);
    const s120 = s90; // ET: still draw → pens
    const realAdv = r() > 0.5 ? teamA : teamB;
    const predAdv = i % 2 === 0 ? realAdv : pickTeam(r, realAdv); // alternate correct/wrong

    const input: KnockoutScoringInput = {
      predA: s120, predB: s120, predAdvancingTeam: predAdv,
      real90A: s90, real90B: s90,
      real120A: s120, real120B: s120,
      realAdvancingTeam: realAdv,
    };
    const expected = expectedScore(input);
    cases.push({ input, expected, label: i % 2 === 0 ? "2b-adv-correct" : "2b-adv-wrong" });
  }
  return cases;
}

/** Case 2c: draw prediction, match went to ET, 120' score diverged (goals in ET) */
function genCase2c_drawPred_scoreDivergedInET(r: () => number, n: number): Case[] {
  const cases: Case[] = [];
  for (let i = 0; i < n; i++) {
    const teamA = pickTeam(r);
    const teamB = pickTeam(r, teamA);
    const s90 = randInt(r, 0, 3);
    // real120 differs from pred (goal scored in ET → someone won)
    const s120A = s90 + (r() > 0.5 ? 1 : 0);
    const s120B = s90 + (s120A === s90 ? 1 : 0);
    // ensure 120' differs from prediction (pred = s90-s90, real120 = s120A-s120B)
    const predScore = s90; // pred stays as 90' draw score

    const realAdv = s120A > s120B ? teamA : (s120A < s120B ? teamB : (r() > 0.5 ? teamA : teamB));

    const input: KnockoutScoringInput = {
      predA: predScore, predB: predScore, predAdvancingTeam: realAdv,
      real90A: s90, real90B: s90,
      real120A: s120A, real120B: s120B,
      realAdvancingTeam: realAdv,
    };
    // pred is predScore-predScore, real120 is s120A-s120B; if they happen to match → different expected
    cases.push({ input, expected: expectedScore(input), label: "2c" });
  }
  return cases;
}

/** Edge cases: 0-0 draws, high-scoring, identical scores across different teams */
function genEdgeCases(): Case[] {
  const edges: Case[] = [];

  // 0-0 at 90' → ET, predict 0-0, correct adv
  edges.push({
    input: { predA:0, predB:0, predAdvancingTeam:"arg", real90A:0, real90B:0, real120A:0, real120B:0, realAdvancingTeam:"arg" },
    expected: 5.0, label: "edge-0-0-correct"
  });
  // 0-0 at 90' → ET, predict 0-0, wrong adv
  edges.push({
    input: { predA:0, predB:0, predAdvancingTeam:"bra", real90A:0, real90B:0, real120A:0, real120B:0, realAdvancingTeam:"arg" },
    expected: 3.0, label: "edge-0-0-wrong-adv"
  });
  // predict 0-0, match was 0-0 at 90' but goals in ET → 1-0
  edges.push({
    input: { predA:0, predB:0, predAdvancingTeam:"arg", real90A:0, real90B:0, real120A:1, real120B:0, realAdvancingTeam:"arg" },
    expected: 5.0, label: "edge-0-0-goal-in-ET"
  });
  // very high score: predict 5-4, real 5-4
  edges.push({
    input: { predA:5, predB:4, predAdvancingTeam:null, real90A:5, real90B:4, real120A:null, real120B:null, realAdvancingTeam:"esp" },
    expected: 3.0, label: "edge-high-exact"
  });
  // goleada wrong direction: predict 4-0, real 0-4
  edges.push({
    input: { predA:4, predB:0, predAdvancingTeam:null, real90A:0, real90B:4, real120A:null, real120B:null, realAdvancingTeam:"ger" },
    expected: 0.0, label: "edge-goleada-flipped"
  });
  // partial match in goleada: predict 3-0, real 0-3 — predA(3)≠real90A(0), predB(0)=real90B(3)? No.
  edges.push({
    input: { predA:3, predB:0, predAdvancingTeam:null, real90A:0, real90B:3, real120A:null, real120B:null, realAdvancingTeam:"ger" },
    expected: 0.0, label: "edge-goleada-flipped-no-partial"
  });
  // predA matches real90B (cross-partial): predict 2-1, real 0-2 — predB(1)≠real90A(0), predB(1)≠real90B(2)
  edges.push({
    input: { predA:2, predB:1, predAdvancingTeam:null, real90A:0, real90B:2, real120A:null, real120B:null, realAdvancingTeam:"fra" },
    expected: 0.0, label: "edge-cross-partial-wrong-dir"
  });
  // predA=real90A but wrong direction: predict 2-0, real 2-3
  edges.push({
    input: { predA:2, predB:0, predAdvancingTeam:null, real90A:2, real90B:3, real120A:null, real120B:null, realAdvancingTeam:"ned" },
    expected: 0.5, label: "edge-exactA-wrong-dir"
  });
  // draw prediction, realAdvancingTeam same string case sensitivity
  edges.push({
    input: { predA:1, predB:1, predAdvancingTeam:"ARG", real90A:1, real90B:1, real120A:1, real120B:1, realAdvancingTeam:"arg" },
    expected: 3.0, label: "edge-case-sensitivity"
  });
  return edges;
}

// ─── bulk runner ─────────────────────────────────────────────────────────────

function runHarness(cases: Case[]): { passed: number; failed: number; failures: string[] } {
  let passed = 0, failed = 0;
  const failures: string[] = [];

  for (const c of cases) {
    const got = puntajeTigreKnockout(c.input);
    if (Math.abs(got - c.expected) < 1e-9) {
      passed++;
    } else {
      failed++;
      failures.push(
        `[${c.label}] input=${JSON.stringify(c.input)} expected=${c.expected} got=${got}`
      );
    }
  }
  return { passed, failed, failures };
}

// ─── tests ───────────────────────────────────────────────────────────────────

describe("Synthetic harness — puntajeTigreKnockout", () => {

  it("Case 1a: non-draw prediction vs non-draw 90' result (200 cases)", () => {
    const r = rng(42);
    const cases = genCase1a_nonDrawPred_nonDrawResult(r, 200);
    const { passed, failed, failures } = runHarness(cases);
    if (failures.length) console.error("FAILURES:\n" + failures.join("\n"));
    expect(failed, `${failed} failures out of ${passed + failed}`).toBe(0);
  });

  it("Case 1b: non-draw prediction vs draw 90' result (150 cases)", () => {
    const r = rng(99);
    const cases = genCase1b_nonDrawPred_drawResult(r, 150);
    const { passed, failed, failures } = runHarness(cases);
    if (failures.length) console.error("FAILURES:\n" + failures.join("\n"));
    expect(failed, `${failed} failures out of ${passed + failed}`).toBe(0);
  });

  it("Case 2a: draw prediction, no ET (150 cases, 90' score + advancing bonus)", () => {
    const r = rng(7);
    const cases = genCase2a_drawPred_noET(r, 150);
    const { passed, failed, failures } = runHarness(cases);
    if (failures.length) console.error("FAILURES:\n" + failures.join("\n"));
    expect(failed, `${failed} failures out of ${passed + failed}`).toBe(0);
    expect(cases.every(c => c.expected === expectedScore(c.input))).toBe(true);
  });

  it("Case 2b: draw prediction, exact 90' score plus independent advancing bonus", () => {
    const r = rng(13);
    const cases = genCase2b_drawPred_exactET(r, 200);
    const { passed, failed, failures } = runHarness(cases);
    if (failures.length) console.error("FAILURES:\n" + failures.join("\n"));
    expect(failed, `${failed} failures out of ${passed + failed}`).toBe(0);
    expect(cases.every(c => c.expected === 5.0 || c.expected === 3.0)).toBe(true);
  });

  it("Case 2c: draw prediction, score diverged in ET (150 cases)", () => {
    const r = rng(55);
    const cases = genCase2c_drawPred_scoreDivergedInET(r, 150);
    const { passed, failed, failures } = runHarness(cases);
    if (failures.length) console.error("FAILURES:\n" + failures.join("\n"));
    expect(failed, `${failed} failures out of ${passed + failed}`).toBe(0);
  });

  it("Edge cases (9 pinned scenarios)", () => {
    const cases = genEdgeCases();
    const { passed, failed, failures } = runHarness(cases);
    if (failures.length) console.error("FAILURES:\n" + failures.join("\n"));
    expect(failed, `${failed} failures out of ${passed + failed}`).toBe(0);
  });

  it("Full combined run: all 850+ cases pass and report coverage", () => {
    const r = rng(2024);
    const all: Case[] = [
      ...genCase1a_nonDrawPred_nonDrawResult(r, 200),
      ...genCase1b_nonDrawPred_drawResult(r, 150),
      ...genCase2a_drawPred_noET(r, 150),
      ...genCase2b_drawPred_exactET(r, 200),
      ...genCase2c_drawPred_scoreDivergedInET(r, 150),
      ...genEdgeCases(),
    ];

    const { passed, failed, failures } = runHarness(all);

    // coverage buckets
    const byLabel: Record<string, { p: number; f: number }> = {};
    for (const c of all) {
      const key = c.label.split("-").slice(0, 2).join("-");
      byLabel[key] = byLabel[key] ?? { p: 0, f: 0 };
    }
    for (const c of all) {
      const key = c.label.split("-").slice(0, 2).join("-");
      const got = puntajeTigreKnockout(c.input);
      if (Math.abs(got - c.expected) < 1e-9) byLabel[key].p++;
      else byLabel[key].f++;
    }

    console.log(`\nHarness summary: ${passed} passed / ${failed} failed / ${all.length} total`);
    console.log("By group:", JSON.stringify(byLabel, null, 2));

    if (failures.length) console.error("FAILURES:\n" + failures.slice(0, 20).join("\n"));
    expect(failed, `${failed} failures — first: ${failures[0] ?? "none"}`).toBe(0);
    expect(passed).toBeGreaterThan(850);
  });

});
