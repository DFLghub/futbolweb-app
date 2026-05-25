export type RankingStatus = "gold" | "green" | "yellow" | "purple" | "red";

export type RankingParticipant = {
  position: number;
  name: string;
  points: number;
  exactScores: number;
  correctResults: number;
  groupCode?: string;
  status: RankingStatus;
  isBocon?: boolean;
};
