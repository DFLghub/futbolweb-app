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
    <main className="min-h-screen bg-[#050816] px-5 py-6 text-white md:px-10 md:py-8">
      <div className="mx-auto max-w-6xl">
        <BrandHeader className="mb-3" />
        <div className="mb-5 border-b border-white/10 pb-4">
          <SimpleNav compact />
        </div>

        <section className="overflow-hidden rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_top_left,#16a34a55,transparent_34%),radial-gradient(circle_at_top_right,#facc1550,transparent_30%),linear-gradient(135deg,#07111f,#020617_62%,#111827)] shadow-2xl">
          <div className="grid gap-6 p-6 md:grid-cols-[1.25fr_0.75fr] md:p-8">
            <div>
              <p className="inline-flex rounded-full border border-emerald-200/30 bg-emerald-300/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.22em] text-emerald-100">
                Modo Mundial activo
              </p>

              <h1 className="mt-5 max-w-3xl text-4xl font-black leading-[0.95] tracking-tight md:text-6xl">
                La tribuna ya empezó.
                <span className="block text-amber-200">Ponga su raya.</span>
              </h1>

              <p className="mt-5 max-w-2xl text-base font-bold leading-7 text-cyan-50 md:text-lg">
                Pronostica, compite con tu gente y vive cada partido como si estuvieras en la gradería.
                Aquí no hay apuestas: hay orgullo, pulso y Mundial.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="#partidos"
                  className="rounded-full bg-amber-300 px-5 py-3 text-sm font-black text-slate-950 shadow-lg shadow-amber-950/30 transition hover:scale-[1.02]"
                >
                  Ver próximos partidos
                </a>
                <a
                  href="#tribuna"
                  className="rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-black text-white transition hover:bg-white/15"
                >
                  Entrar a la tribuna
                </a>
              </div>
            </div>

            <div className="grid gap-3">
              <div className="rounded-2xl border border-amber-200/25 bg-slate-950/60 p-5">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-100">
                  Cuenta regresiva
                </p>
                <p className="mt-3 text-6xl font-black leading-none text-white">{daysLeft}</p>
                <p className="mt-2 text-sm font-bold text-slate-300">
                  días para que ruede la pelota
                </p>
              </div>

              <div className="rounded-2xl border border-cyan-200/20 bg-cyan-300/10 p-5">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-100">
                  Próximo pitazo
                </p>
                <p className="mt-3 text-xl font-black leading-tight text-white">
                  {nextFeaturedMatch
                    ? `${nextFeaturedMatch.homeTeam.flagEmoji} ${nextFeaturedMatch.homeTeam.name} vs ${nextFeaturedMatch.awayTeam.flagEmoji} ${nextFeaturedMatch.awayTeam.name}`
                    : dict.today.emptyTitle}
                </p>
                <p className="mt-2 text-sm font-bold text-slate-300">
                  {nextFeaturedMatch ? nextFeaturedMatch.kickoffLabel : dict.today.emptyText}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="tribuna" className="mt-5 grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
            <p className="text-2xl">🔥</p>
            <p className="mt-2 text-sm font-black text-white">Tribuna Viva</p>
            <p className="mt-1 text-xs leading-5 text-slate-300">
              Cada pronóstico cuenta. Cada acierto sube la temperatura.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
            <p className="text-2xl">⚽</p>
            <p className="mt-2 text-sm font-black text-white">Modo Mundial</p>
            <p className="mt-1 text-xs leading-5 text-slate-300">
              Partidos, banderas, tensión y orgullo de grupo.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
            <p className="text-2xl">🏆</p>
            <p className="mt-2 text-sm font-black text-white">Sin apuestas</p>
            <p className="mt-1 text-xs leading-5 text-slate-300">
              Competencia social. Cero gambling. Puro pulso futbolero.
            </p>
          </div>
        </section>

        <section className="mt-5 overflow-hidden rounded-3xl border border-amber-200/20 bg-[radial-gradient(circle_at_top_left,#f9731650,transparent_32%),linear-gradient(135deg,#111827,#020617)] p-5 shadow-xl shadow-black/25">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-amber-100">
                🔥 La tribuna se calienta
              </p>
              <h2 className="mt-2 text-2xl font-black text-white md:text-3xl">
                Primeros gritos antes del pitazo inicial
              </h2>
              <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-slate-300">
                Esto arranca como conversación social: pronósticos, orgullo de grupo y boconeo sano.
              </p>
            </div>
            <div className="rounded-2xl border border-emerald-200/25 bg-emerald-300/10 px-4 py-3 text-center">
              <p className="text-3xl font-black text-white">143</p>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-100">
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
              <article key={name} className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-cyan-100">{name}</p>
                <p className="mt-3 text-lg font-black text-white">{pick}</p>
                <p className="mt-2 text-xs leading-5 text-slate-300">“{comment}”</p>
              </article>
            ))}
          </div>

          <p className="mt-4 text-xs font-semibold text-slate-400">
            Actividad demostrativa para mostrar la experiencia social. La tribuna real se alimentará con pronósticos enviados por los participantes.
          </p>
        </section>

        <section className="mt-5 rounded-3xl border border-fuchsia-200/20 bg-[radial-gradient(circle_at_top_left,#d946ef40,transparent_32%),linear-gradient(135deg,#111827,#020617)] p-5 shadow-xl shadow-black/25">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-fuchsia-100">
                🤖 El Mundial de la IA
              </p>
              <h2 className="mt-2 text-2xl font-black text-white md:text-3xl">
                Ahora sí veremos quién sabe más que la IA.
              </h2>
              <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-slate-300">
                Periodistas, analistas e hinchas ya llegan al Mundial con IA entre los dientes.
                Pongámosla a jugar también: pregúntele, discútale y rétela.
              </p>
            </div>
            <a
              href="https://chatgpt.com/g/g-6a221c5d5b588191a9607f91961e45e2-el-oraculo-mundialista"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-fuchsia-300 px-5 py-3 text-sm font-black text-slate-950 shadow-lg shadow-fuchsia-950/30 transition hover:scale-[1.02] hover:bg-fuchsia-200"
            >
              Retar a la IA →
            </a>
          </div>
        </section>

        <section className="mt-5 grid gap-3 md:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-2xl border border-emerald-200/20 bg-emerald-300/10 p-4">
            <p className="text-xs font-black uppercase text-emerald-100">
              {hasTodayMatches ? dict.today.livePanelLabel : "Partidos en cartelera"}
            </p>
            <p className="mt-2 text-2xl font-black leading-none text-white">
              {hasTodayMatches
                ? dict.today.todayCount.replace("{count}", String(todayMatches.length))
                : dict.today.featuredCount.replace("{count}", String(visibleMatches.length))}
            </p>
            <p className="mt-2 text-xs leading-5 text-slate-300">
              {hasTodayMatches ? dict.today.livePanelText : "La jornada se está armando. Empieza a mirar, escoger y calentar la tribuna."}
            </p>
          </div>

          <div className="rounded-2xl border border-amber-200/20 bg-amber-300/10 p-4">
            <p className="text-xs font-black uppercase text-amber-100">Grito de guerra</p>
            <p className="mt-2 text-lg font-black leading-tight text-white">
              El Mundial no se mira en silencio.
            </p>
            <p className="mt-2 text-xs font-semibold text-slate-300">
              Se pronostica, se discute, se celebra y se sufre con la tribu.
            </p>
          </div>
        </section>

        {visibleMatches.length > 0 ? (
          <section id="partidos" className="mt-6">
            <div className="mb-3 flex items-end justify-between gap-3">
              <div>
                <h2 className="text-xl font-black text-white">
                  {hasTodayMatches ? dict.today.liveSectionTitle : "Próximos partidos"}
                </h2>
                <p className="mt-1 text-sm font-semibold text-slate-300">
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
          <section className="mt-5 rounded-2xl border border-white/10 bg-slate-950/75 p-5 text-sm text-slate-300">
            <p className="font-black text-white">{dict.today.emptyTitle}</p>
            <p className="mt-2">{dict.today.emptyText}</p>
          </section>
        )}
      </div>
    </main>
  );
}
