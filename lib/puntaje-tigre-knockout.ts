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
  if (input.predA !== input.predB) {
    return puntajeTigreGroupStage(input.predA, input.predB, input.real90A, input.real90B);
  }

  const referenceA = input.real120A ?? input.real90A;
  const referenceB = input.real120B ?? input.real90B;
  const baseDrawScore = input.real90A === input.real90B ? 3.0 : 0.0;
  const markerPenalty =
    (input.predA === referenceA ? 0.0 : 0.5) +
    (input.predB === referenceB ? 0.0 : 0.5);
  const markerScore = Math.max(0.0, baseDrawScore - markerPenalty);
  const advancingBonus = input.predAdvancingTeam === input.realAdvancingTeam ? 2.0 : 0.0;
  return markerScore + advancingBonus;
}
