import Link from "next/link";
import BrandHeader from "@/components/BrandHeader";
import SimpleNav from "@/components/SimpleNav";
import { getCurrentDictionary } from "@/lib/i18n-server";

export default async function Home() {
  const dict = await getCurrentDictionary();
  const matches = [
    ["JUE 11 JUN", "México", "Sudáfrica", "3:00 PM ET", "Grupo A"],
    ["VIE 12 JUN", "Canadá", "Bosnia y Herzegovina", "3:00 PM ET", "Grupo B"],
    ["VIE 12 JUN", "Estados Unidos", "Paraguay", "9:00 PM ET", "Grupo D"],
  ];

  const ranking = [
    ["1", "Marta", "42 pts", "+8"],
    ["2", "Carlos", "39 pts", "+5"],
    ["3", "Alex", "35 pts", "+3"],
    ["4", "Sofía", "31 pts", "—"],
  ];

  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      <section className="px-5 py-8 md:px-10">
        <div className="mx-auto max-w-6xl">
          <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <BrandHeader className="sm:flex-1" />
            <SimpleNav compact />
          </header>

          <div className="grid items-center gap-10 py-14 md:grid-cols-2 md:py-20">
            <div>
              <div className="mb-5 inline-flex rounded-full border border-emerald-300/25 bg-emerald-300/10 px-3 py-1 text-sm font-bold text-emerald-100 shadow-[0_0_24px_rgba(45,212,191,0.12)]">
                {dict.home.eyebrow}
              </div>

              <h1 className="text-5xl font-black leading-tight tracking-tight md:text-6xl">
                {dict.home.title}
              </h1>

              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
                {dict.home.intro}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link className="rounded-md bg-cyan-300 px-6 py-4 text-center font-black text-slate-950 shadow-lg shadow-cyan-300/20 ring-1 ring-cyan-100/40 transition hover:bg-cyan-200 active:bg-cyan-100" href="/today">
                  {dict.home.ctaPrimary}
                </Link>
                <Link className="rounded-md border border-white/20 bg-slate-950/70 px-6 py-4 text-center font-bold text-white shadow-lg shadow-black/15 transition hover:border-emerald-200/35 hover:bg-slate-900" href="/today">
                  {dict.home.ctaMatches}
                </Link>
                <Link className="rounded-md border border-white/20 bg-slate-950/70 px-6 py-4 text-center font-bold text-white shadow-lg shadow-black/15 transition hover:border-cyan-200/35 hover:bg-slate-900" href="/standings">
                  {dict.home.ctaGroups}
                </Link>
                <Link className="rounded-md border border-white/20 bg-slate-950/70 px-6 py-4 text-center font-bold text-white shadow-lg shadow-black/15 transition hover:border-amber-200/35 hover:bg-slate-900" href="/rules">
                  {dict.home.ctaRules}
                </Link>
              </div>

              <p className="mt-4 text-sm text-slate-300">
                {dict.home.quietLine}
                <Link className="ml-2 font-semibold text-cyan-100 hover:text-white" href="/ranking">
                  {dict.home.rankingLink}
                </Link>
                <Link className="ml-2 font-semibold text-cyan-100 hover:text-white" href="/standings">
                  {dict.home.ctaGroups}
                </Link>
                <Link className="ml-2 font-semibold text-cyan-100 hover:text-white" href="/rules">
                  {dict.home.ctaRules}
                </Link>
              </p>
            </div>

            <div id="partidos" className="rounded-lg border border-emerald-200/20 bg-slate-950/70 p-5 shadow-2xl shadow-black/25">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-300">{dict.home.groupLabel}</p>
                  <h2 className="text-2xl font-black">{dict.home.poolTitle}</h2>
                </div>
                <div className="rounded-2xl border border-emerald-200/25 bg-emerald-400/15 px-3 py-2 text-sm font-black text-emerald-100">
                  {dict.home.live}
                </div>
              </div>

              <div className="rounded-lg border border-white/10 bg-[#07111f] p-4 shadow-inner shadow-black/25">
                <p className="mb-3 text-sm font-semibold text-slate-200">{dict.home.todayWithFriends}</p>
                <div className="space-y-3">
                  {matches.map((m, i) => (
                    <div key={i} className="rounded-lg border border-white/10 bg-slate-900/80 px-4 py-3 text-sm">
                      <div className="mb-2 flex justify-between text-xs text-slate-300">
                        <span>{m[0]}</span>
                        <span>{m[3]}</span>
                      </div>
                      <div className="grid grid-cols-[1fr_auto_1fr] gap-3">
                        <span className="font-semibold">{m[1]}</span>
                        <span className="rounded-full bg-cyan-300/10 px-2 text-xs font-black text-cyan-100">VS</span>
                        <span className="text-right font-semibold">{m[2]}</span>
                      </div>
                      <p className="mt-2 text-center text-xs text-slate-400">{m[4]}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-xs text-slate-400">{dict.home.quickTime}</p>
              </div>

              <div className="mt-4 rounded-lg border border-amber-200/15 bg-[#07111f] p-4">
                <p className="mb-3 text-sm font-semibold text-amber-100">{dict.home.rankingPreview}</p>
                <div className="space-y-2">
                  {ranking.map((row) => (
                    <div key={row[0]} className="grid grid-cols-4 rounded-lg border border-white/10 bg-slate-900/80 px-3 py-2 text-sm">
                      <span className={row[0] === "1" ? "font-black text-amber-100" : "font-bold text-slate-300"}>#{row[0]}</span>
                      <span>{row[1]}</span>
                      <span className="text-right text-slate-300">{row[2]}</span>
                      <span className="text-right font-bold text-cyan-200">{row[3]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <section className="grid gap-4 md:grid-cols-4">
            {dict.home.featureCards.map((item) => (
              <div key={item[0]} className="rounded-lg border border-white/10 bg-slate-950/65 p-5 shadow-lg shadow-black/10 transition hover:border-cyan-200/25 hover:bg-slate-900/90">
                <h3 className="font-black">{item[0]}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">{item[1]}</p>
              </div>
            ))}
          </section>

          <section id="join" className="my-14 rounded-lg border border-emerald-200/20 bg-gradient-to-br from-emerald-950/70 via-slate-950 to-amber-950/50 p-8 shadow-2xl shadow-black/20">
            <h2 className="text-3xl font-black">{dict.home.closingTitle}</h2>
            <p className="mt-3 max-w-2xl text-slate-300">
              {dict.home.closingText}
            </p>
          </section>

          <footer className="border-t border-white/10 py-8 text-center text-sm text-slate-400">
            {dict.home.footer}
          </footer>
        </div>
      </section>
    </main>
  );
}
