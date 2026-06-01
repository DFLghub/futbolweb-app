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
