import BrandHeader from "@/components/BrandHeader";
import MatchCard from "@/components/MatchCard";
import SimpleNav from "@/components/SimpleNav";
import { getCurrentDictionary } from "@/lib/i18n-server";
import { worldCup2026Matches } from "@/lib/world-cup-2026-matches";

function dateKeyInEasternTime(date: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    day: "2-digit",
    month: "2-digit",
    timeZone: "America/New_York",
    year: "numeric",
  }).format(date);
}

function daysUntilWorldCup(now: Date) {
  const opener = new Date("2026-06-11T19:00:00Z");
  const diff = opener.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export default async function TodayPage() {
  const dict = await getCurrentDictionary();
  const matches = [...worldCup2026Matches].sort((left, right) => {
    return new Date(left.kickoffUtc).getTime() - new Date(right.kickoffUtc).getTime();
  });

  const now = new Date();
  const daysLeft = daysUntilWorldCup(now);
  const todayKey = dateKeyInEasternTime(now);

  const todayMatches = matches.filter((match) => {
    return dateKeyInEasternTime(new Date(match.kickoffUtc)) === todayKey;
  });

  const upcomingMatches = matches.filter((match) => new Date(match.kickoffUtc).getTime() > now.getTime());
  const hasTodayMatches = todayMatches.length > 0;
  const visibleMatches = hasTodayMatches ? todayMatches : upcomingMatches.slice(0, 7);
  const nextFeaturedMatch = upcomingMatches[0];

  return (
    <main className="min-h-screen bg-[#f3f6fb] px-5 py-6 text-slate-950 md:px-10 md:py-8">
      <div className="mx-auto max-w-6xl">
        <BrandHeader className="mb-3" />
        <div className="mb-5 border-b border-slate-200 pb-4">
          <SimpleNav compact />
        </div>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-200/70">
          <div className="h-2 bg-gradient-to-r from-emerald-600 via-sky-500 to-red-600" />
          <div className="grid gap-6 p-6 md:grid-cols-[1.25fr_0.75fr] md:p-8">
            <div>
              <p className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-emerald-700">
                Modo Mundial activo
              </p>

              <h1 className="mt-5 max-w-3xl text-4xl font-black leading-[0.95] tracking-tight text-slate-950 md:text-6xl">
                La tribuna ya empezó.
                <span className="block text-emerald-700">Ponga su raya.</span>
              </h1>

              <p className="mt-5 max-w-2xl text-base font-bold leading-7 text-slate-700 md:text-lg">
                Pronostica, compite con tu gente y vive cada partido como si estuvieras en la gradería.
                Aquí no hay apuestas: hay orgullo, pulso y Mundial.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="#partidos"
                  className="rounded-md bg-emerald-600 px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-emerald-700"
                >
                  Ver próximos partidos
                </a>
                <a
                  href="#tribuna"
                  className="rounded-md border border-slate-300 bg-white px-5 py-3 text-sm font-black text-slate-800 shadow-sm transition hover:bg-slate-50"
                >
                  Entrar a la tribuna
                </a>
              </div>
            </div>

            <div className="grid gap-3">
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-5">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-amber-700">
                  Cuenta regresiva
                </p>
                <p className="mt-3 text-6xl font-black leading-none text-slate-950">{daysLeft}</p>
                <p className="mt-2 text-sm font-bold text-slate-600">
                  días para que ruede la pelota
                </p>
              </div>

              <div className="rounded-lg border border-sky-200 bg-sky-50 p-5">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-sky-700">
                  Próximo pitazo
                </p>
                <p className="mt-3 text-xl font-black leading-tight text-slate-950">
                  {nextFeaturedMatch
                    ? `${nextFeaturedMatch.homeTeam.flagEmoji} ${nextFeaturedMatch.homeTeam.name} vs ${nextFeaturedMatch.awayTeam.flagEmoji} ${nextFeaturedMatch.awayTeam.name}`
                    : dict.today.emptyTitle}
                </p>
                <p className="mt-2 text-sm font-bold text-slate-600">
                  {nextFeaturedMatch ? nextFeaturedMatch.kickoffLabel : dict.today.emptyText}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-5 overflow-hidden rounded-2xl border border-sky-300/30 bg-slate-950 p-5 text-white shadow-lg shadow-slate-300/40 md:p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-stretch md:justify-between">
            <div className="flex-1">
              <p className="inline-flex rounded-full border border-sky-300/20 bg-sky-300/10 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-sky-100">
                Oráculo Mundialista
              </p>
              <h2 className="mt-4 max-w-3xl text-3xl font-black leading-none text-white md:text-4xl">
                EL ORÁCULO YA PUSO SU RAYA
              </h2>
              <p className="mt-3 max-w-3xl text-base font-semibold leading-7 text-slate-200 md:text-lg">
                No es solo una polla. Aquí también juega el Oráculo: pronostica, se equivoca,
                acierta y queda expuesto en la tribuna.
              </p>
            </div>
            <a
              href="https://chatgpt.com/g/g-6a259750fefc8191af804deb256e9616-paulgpt"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-16 w-full items-center justify-center rounded-lg border border-white/20 bg-white px-6 py-4 text-base font-black text-slate-950 shadow-sm transition hover:bg-sky-50 md:min-h-full md:w-auto md:min-w-56 md:text-lg"
            >
              RETAR AL ORÁCULO →
            </a>
          </div>
        </section>

        <section id="tribuna" className="mt-5 grid gap-3 md:grid-cols-3">
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-2xl">🔥</p>
            <p className="mt-2 text-sm font-black text-slate-950">Tribuna Viva</p>
            <p className="mt-1 text-xs leading-5 text-slate-600">
              Cada pronóstico cuenta. Cada acierto sube la temperatura.
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-2xl">⚽</p>
            <p className="mt-2 text-sm font-black text-slate-950">Modo Mundial</p>
            <p className="mt-1 text-xs leading-5 text-slate-600">
              Partidos, banderas, tensión y orgullo de grupo.
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-2xl">🏆</p>
            <p className="mt-2 text-sm font-black text-slate-950">Sin apuestas</p>
            <p className="mt-1 text-xs leading-5 text-slate-600">
              Competencia social. Cero gambling. Puro pulso futbolero.
            </p>
          </div>
        </section>

        <section className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-red-700">
                🔥 La tribuna se calienta
              </p>
              <h2 className="mt-2 text-2xl font-black text-slate-950 md:text-3xl">
                Primeros gritos antes del pitazo inicial
              </h2>
              <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-slate-600">
                Esto arranca como conversación social: pronósticos, orgullo de grupo y boconeo sano.
              </p>
            </div>
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-center">
              <p className="text-3xl font-black text-slate-950">143</p>
              <p className="text-xs font-black uppercase tracking-[0.14em] text-emerald-700">
                pronósticos de prueba
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {[
              ["Alejo · Tuluá", "Brasil 2-1 Marruecos", "Brasil sigue siendo Brasil."],
              ["Nacho · New York", "México 1-0 Sudáfrica", "No me bajo del Tri."],
              ["John Jairo · Palmira", "España 3-0 Cabo Verde", "Empieza la reconquista."],
            ].map(([name, pick, comment]) => (
              <article key={name} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-sky-700">{name}</p>
                <p className="mt-3 text-lg font-black text-slate-950">{pick}</p>
                <p className="mt-2 text-xs leading-5 text-slate-600">“{comment}”</p>
              </article>
            ))}
          </div>

          <p className="mt-4 text-xs font-semibold text-slate-500">
            Actividad demostrativa para mostrar la experiencia social. La tribuna real se alimentará con pronósticos enviados por los participantes.
          </p>
        </section>

        <section className="mt-5 grid gap-3 md:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-xs font-black uppercase text-emerald-700">
              {hasTodayMatches ? dict.today.livePanelLabel : "Partidos en cartelera"}
            </p>
            <p className="mt-2 text-2xl font-black leading-none text-slate-950">
              {hasTodayMatches
                ? dict.today.todayCount.replace("{count}", String(todayMatches.length))
                : dict.today.featuredCount.replace("{count}", String(visibleMatches.length))}
            </p>
            <p className="mt-2 text-xs leading-5 text-slate-600">
              {hasTodayMatches ? dict.today.livePanelText : "La jornada se está armando. Empieza a mirar, escoger y calentar la tribuna."}
            </p>
          </div>

          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
            <p className="text-xs font-black uppercase text-amber-700">Grito de guerra</p>
            <p className="mt-2 text-lg font-black leading-tight text-slate-950">
              El Mundial no se mira en silencio.
            </p>
            <p className="mt-2 text-xs font-semibold text-slate-600">
              Se pronostica, se discute, se celebra y se sufre con la tribu.
            </p>
          </div>
        </section>

        {visibleMatches.length > 0 ? (
          <section id="partidos" className="mt-6">
            <div className="mb-3 flex items-end justify-between gap-3">
              <div>
                <h2 className="text-xl font-black text-slate-950">
                  {hasTodayMatches ? dict.today.liveSectionTitle : "Próximos partidos"}
                </h2>
                <p className="mt-1 text-sm font-semibold text-slate-600">
                  {hasTodayMatches ? dict.today.liveSectionText : "Estos son los próximos partidos destacados. Para ver más partidos cargados, entra a Próximos."}
                </p>
              </div>
            </div>
            <div className="grid gap-3 lg:grid-cols-2">
              {visibleMatches.map((match) => (
                <MatchCard key={match.id} match={match} variant="compact" />
              ))}
            </div>
          </section>
        ) : (
          <section className="mt-5 rounded-lg border border-slate-200 bg-white p-5 text-sm text-slate-600">
            <p className="font-black text-slate-950">{dict.today.emptyTitle}</p>
            <p className="mt-2">{dict.today.emptyText}</p>
          </section>
        )}
      </div>
    </main>
  );
}
