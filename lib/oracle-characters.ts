export const oracleCharacterIds = [
  "paulgpt",
  "vargpt",
  "insultistagpt",
  "optimistagpt",
  "tribunerogpt",
] as const;

export type OracleCharacter = (typeof oracleCharacterIds)[number];

export const defaultOracleCharacter: OracleCharacter = "paulgpt";

export function isOracleCharacter(value: unknown): value is OracleCharacter {
  return typeof value === "string" && oracleCharacterIds.includes(value as OracleCharacter);
}
