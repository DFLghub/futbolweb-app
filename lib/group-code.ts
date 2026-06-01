export const SOLISTA_GROUP_CODE = "SOLISTA";

export function normalizeGroupCode(value: string | null | undefined) {
  const cleaned = value?.replace(/\s+/g, " ").trim();

  if (!cleaned) {
    return SOLISTA_GROUP_CODE;
  }

  const normalized = cleaned.toLocaleUpperCase("es");

  if (normalized === SOLISTA_GROUP_CODE) {
    return SOLISTA_GROUP_CODE;
  }

  return normalized;
}

export function groupCodeToStandingGroupId(value: string | null | undefined) {
  const normalized = value?.trim().toLocaleLowerCase("es");

  if (!normalized) {
    return "";
  }

  const groupLetter = normalized.match(/grupo\s+([a-z])/i)?.[1] ?? normalized.match(/^([a-z])$/i)?.[1];

  return groupLetter ? `grupo-${groupLetter.toLocaleLowerCase("es")}` : "";
}
