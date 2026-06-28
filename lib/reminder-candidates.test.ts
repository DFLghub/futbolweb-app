import { describe, expect, it } from "vitest";
import { buildCaseBMessage, maskPhone } from "@/lib/reminder-candidates";

describe("maskPhone", () => {
  it("masks middle digits of a standard international phone", () => {
    expect(maskPhone("+573001234567")).toBe("+57300****567");
  });

  it("masks a shorter phone number", () => {
    expect(maskPhone("+12345678")).toBe("+12345****678");
  });

  it("returns **** for very short input", () => {
    expect(maskPhone("+1234")).toBe("****");
  });

  it("always preserves last 3 digits", () => {
    const result = maskPhone("+573009876543");
    expect(result.endsWith("543")).toBe(true);
  });

  it("always preserves 6-char prefix", () => {
    const result = maskPhone("+573009876543");
    expect(result.startsWith("+57300")).toBe(true);
  });
});

describe("buildCaseBMessage", () => {
  it("includes alias, score, teams and link", () => {
    const msg = buildCaseBMessage({
      alias: "El Profe",
      scoreA: 1,
      scoreB: 1,
      homeTeam: "Brasil",
      awayTeam: "Argentina",
      matchSlug: "brasil-argentina-2026-07-04",
      groupCode: "EGRESADOS",
    });

    expect(msg).toContain("El Profe");
    expect(msg).toContain("1-1");
    expect(msg).toContain("Brasil vs Argentina");
    expect(msg).toContain("futbolweb.app/match/brasil-argentina-2026-07-04/predict");
    expect(msg).toContain("group=EGRESADOS");
    expect(msg).toContain("🟡");
  });

  it("omits group param when groupCode is null", () => {
    const msg = buildCaseBMessage({
      alias: "Tigre",
      scoreA: 0,
      scoreB: 0,
      homeTeam: "USA",
      awayTeam: "México",
      matchSlug: "usa-mexico-2026-07-06",
      groupCode: null,
    });

    expect(msg).not.toContain("group=");
    expect(msg).toContain("futbolweb.app/match/usa-mexico-2026-07-06/predict");
  });

  it("URL-encodes group code with special characters", () => {
    const msg = buildCaseBMessage({
      alias: "Fan",
      scoreA: 2,
      scoreB: 2,
      homeTeam: "Francia",
      awayTeam: "Alemania",
      matchSlug: "francia-alemania-2026-07-08",
      groupCode: "AMIGOS Y FAMILIA",
    });

    expect(msg).toContain("group=AMIGOS%20Y%20FAMILIA");
  });
});
