import { describe, expect, it } from "vitest";
import { getPredictionAdvancingTeam, isKnockoutPredictionMatch } from "@/lib/knockout-predictions";

describe("isKnockoutPredictionMatch", () => {
  it("marks loaded FIFA knockout stages as knockout even without the legacy flag", () => {
    expect(isKnockoutPredictionMatch({ stage: "Dieciseisavos de final", stageEn: "Round of 32" })).toBe(true);
  });

  it("keeps group stage matches out of the knockout flow", () => {
    expect(isKnockoutPredictionMatch({ stage: "Fase de grupos", stageEn: "First Stage" })).toBe(false);
  });
});

describe("getPredictionAdvancingTeam", () => {
  it("requires an advancing team for knockout draw predictions", () => {
    expect(() => {
      getPredictionAdvancingTeam({
        advancingTeam: null,
        isKnockout: true,
        scoreA: 1,
        scoreB: 1,
      });
    }).toThrow("advancing_team");
  });

  it("persists the advancing team for knockout draw predictions", () => {
    expect(
      getPredictionAdvancingTeam({
        advancingTeam: "Canadá",
        isKnockout: true,
        scoreA: 2,
        scoreB: 2,
      }),
    ).toBe("Canadá");
  });

  it("does not carry advancing-team data into non-draw predictions", () => {
    expect(
      getPredictionAdvancingTeam({
        advancingTeam: "Canadá",
        isKnockout: true,
        scoreA: 2,
        scoreB: 1,
      }),
    ).toBeNull();
  });
});
