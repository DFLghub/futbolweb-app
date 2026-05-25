export type RankingStatus = "gold" | "green" | "yellow" | "purple" | "red";

export type RankingParticipant = {
  position: number;
  name: string;
  points: number;
  exactScores: number;
  correctResults: number;
  status: RankingStatus;
  isBocon?: boolean;
};

export const mockRankingParticipants: RankingParticipant[] = [
  {
    position: 1,
    name: "Marta",
    points: 12,
    exactScores: 3,
    correctResults: 5,
    status: "gold",
  },
  {
    position: 2,
    name: "Jorge",
    points: 10,
    exactScores: 2,
    correctResults: 4,
    status: "green",
    isBocon: true,
  },
  {
    position: 3,
    name: "Ana",
    points: 8,
    exactScores: 1,
    correctResults: 5,
    status: "green",
  },
  {
    position: 4,
    name: "Luis",
    points: 7,
    exactScores: 1,
    correctResults: 4,
    status: "green",
  },
  {
    position: 5,
    name: "Sofía",
    points: 5,
    exactScores: 0,
    correctResults: 5,
    status: "yellow",
  },
  {
    position: 6,
    name: "Carlos",
    points: 3,
    exactScores: 0,
    correctResults: 3,
    status: "purple",
  },
  {
    position: 7,
    name: "Pedro",
    points: 2,
    exactScores: 0,
    correctResults: 2,
    status: "red",
  },
  {
    position: 8,
    name: "Alex",
    points: 1,
    exactScores: 0,
    correctResults: 1,
    status: "red",
  },
];
