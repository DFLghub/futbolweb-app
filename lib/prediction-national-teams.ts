// Source of truth: FIFA World Cup 2026 qualified teams / teams page.
// Update policy: manually sync from FIFA before each tournament phase.

import type { Locale } from "@/lib/i18n";

type PredictionNationalTeamOption = {
  value: string;
  labels: Record<Locale, string>;
};

export const predictionNationalTeamOptions = [
  { value: "Alemania", labels: { es: "Alemania", en: "Germany" } },
  { value: "Arabia Saudita", labels: { es: "Arabia Saudita", en: "Saudi Arabia" } },
  { value: "Argelia", labels: { es: "Argelia", en: "Algeria" } },
  { value: "Argentina", labels: { es: "Argentina", en: "Argentina" } },
  { value: "Australia", labels: { es: "Australia", en: "Australia" } },
  { value: "Austria", labels: { es: "Austria", en: "Austria" } },
  { value: "Bélgica", labels: { es: "Bélgica", en: "Belgium" } },
  { value: "Bosnia y Herzegovina", labels: { es: "Bosnia y Herzegovina", en: "Bosnia and Herzegovina" } },
  { value: "Brasil", labels: { es: "Brasil", en: "Brazil" } },
  { value: "Cabo Verde", labels: { es: "Cabo Verde", en: "Cape Verde" } },
  { value: "Canadá", labels: { es: "Canadá", en: "Canada" } },
  { value: "Chequia", labels: { es: "Chequia", en: "Czechia" } },
  { value: "Colombia", labels: { es: "Colombia", en: "Colombia" } },
  { value: "Corea del Sur", labels: { es: "Corea del Sur", en: "South Korea" } },
  { value: "Costa de Marfil", labels: { es: "Costa de Marfil", en: "Ivory Coast" } },
  { value: "Croacia", labels: { es: "Croacia", en: "Croatia" } },
  { value: "Curaçao", labels: { es: "Curaçao", en: "Curaçao" } },
  { value: "Ecuador", labels: { es: "Ecuador", en: "Ecuador" } },
  { value: "Egipto", labels: { es: "Egipto", en: "Egypt" } },
  { value: "Escocia", labels: { es: "Escocia", en: "Scotland" } },
  { value: "España", labels: { es: "España", en: "Spain" } },
  { value: "Estados Unidos", labels: { es: "Estados Unidos", en: "United States" } },
  { value: "Francia", labels: { es: "Francia", en: "France" } },
  { value: "Ghana", labels: { es: "Ghana", en: "Ghana" } },
  { value: "Haití", labels: { es: "Haití", en: "Haiti" } },
  { value: "Inglaterra", labels: { es: "Inglaterra", en: "England" } },
  { value: "Irak", labels: { es: "Irak", en: "Iraq" } },
  { value: "Irán", labels: { es: "Irán", en: "Iran" } },
  { value: "Japón", labels: { es: "Japón", en: "Japan" } },
  { value: "Jordania", labels: { es: "Jordania", en: "Jordan" } },
  { value: "Marruecos", labels: { es: "Marruecos", en: "Morocco" } },
  { value: "México", labels: { es: "México", en: "Mexico" } },
  { value: "Noruega", labels: { es: "Noruega", en: "Norway" } },
  { value: "Nueva Zelanda", labels: { es: "Nueva Zelanda", en: "New Zealand" } },
  { value: "Países Bajos", labels: { es: "Países Bajos", en: "Netherlands" } },
  { value: "Panamá", labels: { es: "Panamá", en: "Panama" } },
  { value: "Paraguay", labels: { es: "Paraguay", en: "Paraguay" } },
  { value: "Portugal", labels: { es: "Portugal", en: "Portugal" } },
  { value: "Qatar", labels: { es: "Qatar", en: "Qatar" } },
  { value: "RD Congo", labels: { es: "RD Congo", en: "DR Congo" } },
  { value: "Senegal", labels: { es: "Senegal", en: "Senegal" } },
  { value: "Sudáfrica", labels: { es: "Sudáfrica", en: "South Africa" } },
  { value: "Suecia", labels: { es: "Suecia", en: "Sweden" } },
  { value: "Suiza", labels: { es: "Suiza", en: "Switzerland" } },
  { value: "Túnez", labels: { es: "Túnez", en: "Tunisia" } },
  { value: "Turquía", labels: { es: "Turquía", en: "Türkiye" } },
  { value: "Uruguay", labels: { es: "Uruguay", en: "Uruguay" } },
  { value: "Uzbekistán", labels: { es: "Uzbekistán", en: "Uzbekistan" } },
] satisfies PredictionNationalTeamOption[];

export const predictionNationalTeams = predictionNationalTeamOptions.map((team) => team.value);
