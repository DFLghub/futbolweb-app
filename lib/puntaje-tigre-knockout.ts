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
  const regulationScore = puntajeTigreGroupStage(input.predA, input.predB, input.real90A, input.real90B);

  if (input.predA !== input.predB) {
    return regulationScore;
  }

  const advancingBonus = input.predAdvancingTeam === input.realAdvancingTeam ? 2.0 : 0.0;
  return regulationScore + advancingBonus;
}
