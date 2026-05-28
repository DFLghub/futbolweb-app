export type GroupStandingStatus = "qualified" | "at_risk" | "pending" | "eliminated";

export type GroupStandingTeam = {
  teamId: string;
  teamName: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  rank: number;
  status: GroupStandingStatus;
};

export type GroupStanding = {
  groupId: string;
  groupName: string;
  teams: GroupStandingTeam[];
};

export const mockWorldCupGroupStandings: GroupStanding[] = [
  {
    groupId: "grupo-a",
    groupName: "Grupo A",
    teams: [
      {
        teamId: "mexico",
        teamName: "Mexico",
        played: 2,
        won: 1,
        drawn: 1,
        lost: 0,
        goalsFor: 3,
        goalsAgainst: 1,
        goalDifference: 2,
        points: 4,
        rank: 1,
        status: "qualified",
      },
      {
        teamId: "south-africa",
        teamName: "Sudafrica",
        played: 2,
        won: 1,
        drawn: 0,
        lost: 1,
        goalsFor: 2,
        goalsAgainst: 2,
        goalDifference: 0,
        points: 3,
        rank: 2,
        status: "at_risk",
      },
      {
        teamId: "czechia",
        teamName: "Chequia",
        played: 2,
        won: 0,
        drawn: 2,
        lost: 0,
        goalsFor: 1,
        goalsAgainst: 1,
        goalDifference: 0,
        points: 2,
        rank: 3,
        status: "pending",
      },
      {
        teamId: "qatar",
        teamName: "Qatar",
        played: 2,
        won: 0,
        drawn: 1,
        lost: 1,
        goalsFor: 1,
        goalsAgainst: 3,
        goalDifference: -2,
        points: 1,
        rank: 4,
        status: "at_risk",
      },
    ],
  },
  {
    groupId: "grupo-c",
    groupName: "Grupo C",
    teams: [
      {
        teamId: "brazil",
        teamName: "Brasil",
        played: 2,
        won: 2,
        drawn: 0,
        lost: 0,
        goalsFor: 5,
        goalsAgainst: 1,
        goalDifference: 4,
        points: 6,
        rank: 1,
        status: "qualified",
      },
      {
        teamId: "morocco",
        teamName: "Marruecos",
        played: 2,
        won: 1,
        drawn: 0,
        lost: 1,
        goalsFor: 3,
        goalsAgainst: 3,
        goalDifference: 0,
        points: 3,
        rank: 2,
        status: "pending",
      },
      {
        teamId: "scotland",
        teamName: "Escocia",
        played: 2,
        won: 0,
        drawn: 1,
        lost: 1,
        goalsFor: 2,
        goalsAgainst: 4,
        goalDifference: -2,
        points: 1,
        rank: 3,
        status: "at_risk",
      },
      {
        teamId: "haiti",
        teamName: "Haiti",
        played: 2,
        won: 0,
        drawn: 1,
        lost: 1,
        goalsFor: 1,
        goalsAgainst: 3,
        goalDifference: -2,
        points: 1,
        rank: 4,
        status: "eliminated",
      },
    ],
  },
  {
    groupId: "grupo-k",
    groupName: "Grupo K",
    teams: [
      {
        teamId: "portugal",
        teamName: "Portugal",
        played: 1,
        won: 1,
        drawn: 0,
        lost: 0,
        goalsFor: 2,
        goalsAgainst: 0,
        goalDifference: 2,
        points: 3,
        rank: 1,
        status: "pending",
      },
      {
        teamId: "colombia",
        teamName: "Colombia",
        played: 1,
        won: 1,
        drawn: 0,
        lost: 0,
        goalsFor: 1,
        goalsAgainst: 0,
        goalDifference: 1,
        points: 3,
        rank: 2,
        status: "pending",
      },
      {
        teamId: "ghana",
        teamName: "Ghana",
        played: 1,
        won: 0,
        drawn: 0,
        lost: 1,
        goalsFor: 0,
        goalsAgainst: 1,
        goalDifference: -1,
        points: 0,
        rank: 3,
        status: "at_risk",
      },
      {
        teamId: "new-zealand",
        teamName: "Nueva Zelanda",
        played: 1,
        won: 0,
        drawn: 0,
        lost: 1,
        goalsFor: 0,
        goalsAgainst: 2,
        goalDifference: -2,
        points: 0,
        rank: 4,
        status: "at_risk",
      },
    ],
  },
];
