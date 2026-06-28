type KnockoutPredictionMatch = {
  isKnockout?: boolean;
  stage?: string;
  stageEn?: string;
};

export function isKnockoutPredictionMatch(match: KnockoutPredictionMatch | null | undefined) {
  if (!match) {
    return false;
  }

  if (match.isKnockout) {
    return true;
  }

  if (match.stageEn) {
    return match.stageEn !== "First Stage";
  }

  return Boolean(match.stage && match.stage !== "Fase de grupos");
}

export function getPredictionAdvancingTeam({
  advancingTeam,
  isKnockout,
  scoreA,
  scoreB,
}: {
  advancingTeam: string | null;
  isKnockout: boolean;
  scoreA: number;
  scoreB: number;
}) {
  if (!isKnockout || scoreA !== scoreB) {
    return null;
  }

  if (!advancingTeam) {
    throw new Error("advancing_team");
  }

  return advancingTeam;
}
