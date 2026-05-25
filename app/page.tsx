import Link from "next/link";
import BrandHeader from "@/components/BrandHeader";
import SimpleNav from "@/components/SimpleNav";

export default function Home() {
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
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(52,211,153,0.16),transparent_34%),radial-gradient(circle_at_82%_18%,rgba(251,191,36,0.12),transparent_30%),#07111f] text-white">
      <section className="px-5 py-8 md:px-10">
        <div className="mx-auto max-w-6xl">
          <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <BrandHeader className="sm:flex-1" />
            <SimpleNav compact />
          </header>

          <div className="grid items-center gap-10 py-14 md:grid-cols-2 md:py-20">
            <div>
              <div className="mb-5 inline-flex rounded-full border border-emerald-300/25 bg-emerald-300/10 px-3 py-1 text-sm font-bold text-emerald-100 shadow-[0_0_24px_rgba(45,212,191,0.12)]">
                Mundial social vivo
              </div>

              <h1 className="text-5xl font-black leading-tight tracking-tight md:text-6xl">
                El Mundial lo jugamos todos.
              </h1>

              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
                Predice. Compite. Presume. Reta a tus amigos desde WhatsApp y convierte cada partido en conversación.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link className="rounded-2xl bg-cyan-300 px-6 py-4 text-center font-black text-slate-950 shadow-lg shadow-cyan-950/30 transition hover:bg-cyan-200" href="/today">
                  Participar →
                </Link>
                <Link className="rounded-2xl border border-white/15 bg-white/5 px-6 py-4 text-center font-bold text-white transition hover:border-emerald-200/30 hover:bg-white/10" href="/today">
                  Ver demo
                </Link>
                <Link className="rounded-2xl border border-white/15 bg-white/5 px-6 py-4 text-center font-bold text-white transition hover:border-amber-200/30 hover:bg-white/10" href="/rules">
                  Cómo funciona
                </Link>
              </div>

              <p className="mt-4 text-sm text-slate-400">
                Sin ruido. Solo fútbol, amigos y gloria deportiva.
                <Link className="ml-2 font-semibold text-cyan-100 hover:text-white" href="/ranking">
                  Ver ranking
                </Link>
                <Link className="ml-2 font-semibold text-cyan-100 hover:text-white" href="/rules">
                  Cómo funciona
                </Link>
              </p>
            </div>

            <div id="demo" className="rounded-[2rem] border border-emerald-200/15 bg-white/10 p-5 shadow-2xl shadow-emerald-950/20">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Grupo</p>
                  <h2 className="text-2xl font-black">Quiniela Mundial</h2>
                </div>
                <div className="rounded-2xl border border-emerald-200/25 bg-emerald-400/15 px-3 py-2 text-sm font-black text-emerald-100">
                  EN VIVO
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-[#07111f]/80 p-4 shadow-inner shadow-cyan-950/20">
                <p className="mb-3 text-sm font-semibold text-slate-200">Hoy se juega con amigos</p>
                <div className="space-y-3">
                  {matches.map((m, i) => (
                    <div key={i} className="rounded-2xl border border-white/10 bg-white/[0.065] px-4 py-3 text-sm">
                      <div className="mb-2 flex justify-between text-xs text-slate-400">
                        <span>{m[0]}</span>
                        <span>{m[3]}</span>
                      </div>
                      <div className="grid grid-cols-[1fr_auto_1fr] gap-3">
                        <span className="font-semibold">{m[1]}</span>
                        <span className="rounded-full bg-cyan-300/10 px-2 text-xs font-black text-cyan-100">VS</span>
                        <span className="text-right font-semibold">{m[2]}</span>
                      </div>
                      <p className="mt-2 text-center text-xs text-slate-500">{m[4]}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-xs text-slate-500">Hora Miami / ET para esta vista previa.</p>
              </div>

              <div className="mt-4 rounded-3xl border border-amber-200/10 bg-[#07111f]/80 p-4">
                <p className="mb-3 text-sm font-semibold text-amber-100">Vista previa del ranking</p>
                <div className="space-y-2">
                  {ranking.map((row) => (
                    <div key={row[0]} className="grid grid-cols-4 rounded-2xl border border-white/5 bg-white/5 px-3 py-2 text-sm">
                      <span className={row[0] === "1" ? "font-black text-amber-100" : "font-bold text-slate-400"}>#{row[0]}</span>
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
            {[
              ["Quinielas del Mundial", "Pronostica resultados, suma puntos y mide tu olfato futbolero."],
              ["Participa e invita", "Compite con tus amigos e invita a otros a entrar en la emoción."],
              ["Rankings", "Compite y avanza. Todos ven quién sube y quién se queda atrás."],
              ["Listo para WhatsApp", "Pensado para compartirse y vivir la conversación desde tus grupos."],
            ].map((item) => (
              <div key={item[0]} className="rounded-3xl border border-white/10 bg-white/[0.055] p-5 transition hover:border-cyan-200/20 hover:bg-white/[0.075]">
                <h3 className="font-black">{item[0]}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{item[1]}</p>
              </div>
            ))}
          </section>

          <section id="join" className="my-14 rounded-3xl border border-emerald-200/15 bg-gradient-to-br from-emerald-950/50 via-slate-900 to-amber-950/35 p-8">
            <h2 className="text-3xl font-black">Elige marcador. Reta al grupo. Comparte por WhatsApp.</h2>
            <p className="mt-3 max-w-2xl text-slate-300">
              La primera versión mantiene la energía del fútbol sin encerrarse en un solo país.
              Participa, compite e invita a tus amigos.
            </p>
          </section>

          <footer className="border-t border-white/10 py-8 text-center text-sm text-slate-500">
            futbolweb.app — MVP social del Mundial · Powered by amOS
          </footer>
        </div>
      </section>
    </main>
  );
}
