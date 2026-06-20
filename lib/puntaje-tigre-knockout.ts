export type KnockoutScoringInput = {
  predA: number;
  predB: number;
  predAdvancingTeam: string | null;
  real90A: number;
  real90B: number;
  real120A: number | null;
  real120B: number | null;
  realAdvancingTeam: string;
};

function sign(n: number): -1 | 0 | 1 {
  return n > 0 ? 1 : n < 0 ? -1 : 0;
}

function puntajeTigreGroupStage(predA: number, predB: number, realA: number, realB: number): number {
  const predDir = sign(predA - predB);
  const realDir = sign(realA - realB);
  const exactA = predA === realA;
  const exactB = predB === realB;

  if (predDir === realDir) {
    if (exactA && exactB) return 3.0;
    if (exactA || exactB) return 2.5;
    return 2.0;
  }

  if (exactA || exactB) return 0.5;
  return 0.0;
}

export function puntajeTigreKnockout(input: KnockoutScoringInput): number {
  const predictedDraw = input.predA === input.predB;

  if (!predictedDraw) {
    // Case 1: non-draw prediction — evaluate against 90-min result
    return puntajeTigreGroupStage(input.predA, input.predB, input.real90A, input.real90B);
  }

  // Case 2: draw prediction — evaluate against 120-min result
  if (input.real120A === null || input.real120B === null) {
    // No extra time (match wasn't drawn at 90 min) — draw prediction earns nothing
    return 0.0;
  }

  const exact120 = input.predA === input.real120A && input.predB === input.real120B;

  if (!exact120) return 0.0;

  return input.predAdvancingTeam === input.realAdvancingTeam ? 3.0 : 2.5;
}
