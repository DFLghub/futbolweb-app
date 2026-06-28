import { afterEach, describe, expect, it, vi } from "vitest";

import { fetchEspnWorldCupFinalResults, fetchEspnWorldCupReality } from "@/lib/espn-world-cup";

function response(body: unknown, ok = true, status = 200) {
  return {
    json: async () => body,
    ok,
    status,
  } as Response;
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("ESPN World Cup scoreboard sync", () => {
  it("maps the completed Canada vs Bosnia-Herzegovina ESPN event to FutbolWeb fixture", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(response({
      events: [
        {
          id: "760416",
          name: "Bosnia-Herzegovina at Canada",
          date: "2026-06-12T19:00Z",
          competitions: [
            {
              status: {
                type: {
                  completed: true,
                  state: "post",
                },
              },
              competitors: [
                {
                  homeAway: "home",
                  score: "1",
                  team: {
                    abbreviation: "CAN",
                  },
                },
                {
                  homeAway: "away",
                  score: "1",
                  team: {
                    abbreviation: "BIH",
                  },
                },
              ],
            },
          ],
        },
      ],
    }));

    await expect(fetchEspnWorldCupFinalResults()).resolves.toEqual([
      {
        match_slug: "canada-bosnia-and-herzegovina-2026-06-12",
        score_a: 1,
        score_b: 1,
        is_knockout: false,
        score_a_120: null,
        score_b_120: null,
        advancing_team: null,
      },
    ]);
  });

  it("captures knockout 90-minute score, 120-minute score, and advancing team from ESPN", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(response({
      events: [
        {
          id: "400021543",
          name: "Argentina vs France",
          date: "2026-07-19T19:00Z",
          competitions: [
            {
              status: {
                type: {
                  completed: true,
                  state: "post",
                },
              },
              details: [
                {
                  clock: { value: 600 },
                  scoringPlay: true,
                  scoreValue: 1,
                  team: { id: "arg" },
                },
                {
                  clock: { value: 1800 },
                  scoringPlay: true,
                  scoreValue: 1,
                  team: { id: "fra" },
                },
                {
                  clock: { value: 6500 },
                  scoringPlay: true,
                  scoreValue: 1,
                  team: { id: "arg" },
                },
              ],
              competitors: [
                {
                  homeAway: "home",
                  score: "2",
                  winner: true,
                  team: {
                    abbreviation: "ARG",
                    displayName: "Argentina",
                    id: "arg",
                  },
                },
                {
                  homeAway: "away",
                  score: "1",
                  winner: false,
                  team: {
                    abbreviation: "FRA",
                    displayName: "France",
                    id: "fra",
                  },
                },
              ],
            },
          ],
        },
      ],
    }));

    await expect(fetchEspnWorldCupFinalResults()).resolves.toEqual([
      {
        match_slug: "mundial-2026-partido-104",
        score_a: 1,
        score_b: 1,
        is_knockout: true,
        score_a_120: 2,
        score_b_120: 1,
        advancing_team: "Argentina",
      },
    ]);
  });

  it("normalizes knockout ESPN events into canonical reality records", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(response({
      events: [
        {
          id: "400021518",
          name: "Round of 32",
          date: "2026-06-28T19:00Z",
          competitions: [
            {
              status: {
                type: {
                  completed: false,
                  state: "in",
                },
              },
              competitors: [
                {
                  homeAway: "home",
                  score: "1",
                  team: {
                    abbreviation: "KOR",
                    displayName: "South Korea",
                    id: "kor",
                  },
                },
                {
                  homeAway: "away",
                  score: "0",
                  team: {
                    abbreviation: "CZE",
                    displayName: "Czechia",
                    id: "cze",
                  },
                },
              ],
            },
          ],
        },
      ],
    }));

    const realities = await fetchEspnWorldCupReality();

    expect(realities).toHaveLength(1);
    expect(realities[0]).toMatchObject({
      matchNumber: 73,
      slug: "mundial-2026-partido-073",
      status: "live",
      score90A: null,
      score90B: null,
      score120A: null,
      score120B: null,
      penaltiesA: null,
      penaltiesB: null,
      sourceName: "ESPN FIFA World Cup scoreboard",
    });
  });

  it("does not persist a completed knockout result when ESPN has no winner flag", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(response({
      events: [
        {
          id: "400021543",
          date: "2026-07-19T19:00Z",
          competitions: [
            {
              status: {
                type: {
                  completed: true,
                  state: "post",
                },
              },
              competitors: [
                {
                  homeAway: "home",
                  score: "1",
                  team: { abbreviation: "ARG", id: "arg" },
                },
                {
                  homeAway: "away",
                  score: "1",
                  team: { abbreviation: "FRA", id: "fra" },
                },
              ],
            },
          ],
        },
      ],
    }));

    await expect(fetchEspnWorldCupFinalResults()).resolves.toEqual([]);
  });

  it("ignores scheduled ESPN events", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(response({
      events: [
        {
          date: "2026-06-13T01:00Z",
          competitions: [
            {
              status: {
                type: {
                  completed: false,
                  state: "pre",
                },
              },
              competitors: [
                {
                  homeAway: "home",
                  score: "0",
                  team: {
                    abbreviation: "USA",
                  },
                },
                {
                  homeAway: "away",
                  score: "0",
                  team: {
                    abbreviation: "PAR",
                  },
                },
              ],
            },
          ],
        },
      ],
    }));

    await expect(fetchEspnWorldCupFinalResults()).resolves.toEqual([]);
  });
});
