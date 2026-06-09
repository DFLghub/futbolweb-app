export type GroupStandingStatus = "pending";

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

const groupLetters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"] as const;
type GroupLetter = (typeof groupLetters)[number];

const canonicalWorldCup2026Groups = [
  {
    groupLetter: "A",
    teams: ["México", "Sudáfrica", "Corea del Sur", "Chequia"],
  },
  {
    groupLetter: "B",
    teams: ["Canadá", "Bosnia y Herzegovina", "Qatar", "Suiza"],
  },
  {
    groupLetter: "C",
    teams: ["Brasil", "Marruecos", "Haití", "Escocia"],
  },
  {
    groupLetter: "D",
    teams: ["Estados Unidos", "Paraguay", "Australia", "Turquía"],
  },
  {
    groupLetter: "E",
    teams: ["Alemania", "Curazao", "Costa de Marfil", "Ecuador"],
  },
  {
    groupLetter: "F",
    teams: ["Países Bajos", "Japón", "Suecia", "Túnez"],
  },
  {
    groupLetter: "G",
    teams: ["Bélgica", "Egipto", "Irán", "Nueva Zelanda"],
  },
  {
    groupLetter: "H",
    teams: ["España", "Cabo Verde", "Arabia Saudita", "Uruguay"],
  },
  {
    groupLetter: "I",
    teams: ["Francia", "Senegal", "Irak", "Noruega"],
  },
  {
    groupLetter: "J",
    teams: ["Argentina", "Argelia", "Austria", "Jordania"],
  },
  {
    groupLetter: "K",
    teams: ["Portugal", "RD Congo", "Uzbekistán", "Colombia"],
  },
  {
    groupLetter: "L",
    teams: ["Inglaterra", "Croacia", "Ghana", "Panamá"],
  },
] satisfies ReadonlyArray<{
  groupLetter: GroupLetter;
  teams: readonly [string, string, string, string];
}>;

const placeholderTeamNames = ["Por definir", "TBD", "TBA"];

function isPlaceholderTeamName(teamName: string) {
  const normalizedTeamName = teamName.trim();

  return (
    normalizedTeamName.length === 0 ||
    placeholderTeamNames.some((placeholder) => placeholder.toLowerCase() === normalizedTeamName.toLowerCase()) ||
    /^Equipo\b/i.test(normalizedTeamName)
  );
}

function validateGroupCatalog(
  catalog: ReadonlyArray<{ groupLetter: GroupLetter; teams: readonly string[] }>,
) {
  const seenGroups = new Set<GroupLetter>();
  const problems = [];

  if (catalog.length !== 12) {
    problems.push(`Catalogo: ${catalog.length}/12 grupos`);
  }

  catalog.forEach((group) => {
    seenGroups.add(group.groupLetter);

    const teams = group.teams.map((teamName) => teamName.trim());
    const invalidTeams = teams.filter(isPlaceholderTeamName);

    if (teams.length !== 4) {
      problems.push(`Grupo ${group.groupLetter}: ${teams.length}/4 equipos`);
    }

    if (invalidTeams.length > 0) {
      problems.push(`Grupo ${group.groupLetter}: nombres invalidos (${invalidTeams.join(", ")})`);
    }
  });

  groupLetters.forEach((groupLetter) => {
    if (!seenGroups.has(groupLetter)) {
      problems.push(`Grupo ${groupLetter}: faltante`);
    }
  });

  if (problems.length > 0) {
    throw new Error(
      [
        "Catalogo canonico de grupos 2026 invalido en lib/mock-group-standings.ts.",
        ...problems,
      ].join("\n"),
    );
  }
}

function createTeamId(groupLetter: string, teamName: string) {
  const teamSlug = teamName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return `grupo-${groupLetter.toLowerCase()}-${teamSlug}`;
}

function createInitialTeam(groupLetter: string, rank: number, teamName: string): GroupStandingTeam {
  return {
    teamId: createTeamId(groupLetter, teamName),
    teamName,
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDifference: 0,
    points: 0,
    rank,
    status: "pending",
  };
}

validateGroupCatalog(canonicalWorldCup2026Groups);

export const mockWorldCupGroupStandings: GroupStanding[] = canonicalWorldCup2026Groups.map((group) => ({
  groupId: `grupo-${group.groupLetter.toLowerCase()}`,
  groupName: `Grupo ${group.groupLetter}`,
  teams: group.teams.map((teamName, index) => createInitialTeam(
    group.groupLetter,
    index + 1,
    teamName,
  )),
}));
