import { cookies } from "next/headers";
import { defaultLocale, getDictionary, localeCookieName, normalizeLocale } from "@/lib/i18n";

export async function getCurrentLocale() {
  const cookieStore = await cookies();
  return normalizeLocale(cookieStore.get(localeCookieName)?.value ?? defaultLocale);
}

export async function getCurrentDictionary() {
  return getDictionary(await getCurrentLocale());
}
