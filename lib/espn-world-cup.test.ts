import { afterEach, describe, expect, it, vi } from "vitest";

import { fetchEspnWorldCupFinalResults } from "@/lib/espn-world-cup";

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
      },
    ]);
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
