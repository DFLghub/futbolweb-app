import Link from "next/link";
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
    <main className="min-h-screen bg-[#07111f] text-white">
      <section className="px-5 py-8 md:px-10">
        <div className="mx-auto max-w-6xl">
          <header className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-blue-400/50 bg-blue-500/10 font-black">
                FW
              </div>
              <span className="font-semibold">futbolweb.app</span>
            </div>
            <SimpleNav compact />
          </header>

          <div className="grid items-center gap-10 py-16 md:grid-cols-2 md:py-24">
            <div>
              <div className="mb-5 inline-flex rounded-full border border-blue-300/20 bg-white/5 px-3 py-1 text-sm text-blue-100">
                Vista previa social del Mundial
              </div>

              <h1 className="text-5xl font-black leading-tight tracking-tight md:text-6xl">
                Entra en Modo Mundial.
              </h1>

              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
                Predice resultados, compite con amigos y vive el Mundial como nunca antes.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link className="rounded-2xl bg-blue-600 px-6 py-4 text-center font-bold text-white hover:bg-blue-500" href="/today">
                  Participar →
                </Link>
                <Link className="rounded-2xl border border-white/15 bg-white/5 px-6 py-4 text-center font-bold text-white hover:bg-white/10" href="/today">
                  Ver demo
                </Link>
                <Link className="rounded-2xl border border-white/15 bg-white/5 px-6 py-4 text-center font-bold text-white hover:bg-white/10" href="/rules">
                  Cómo funciona
                </Link>
              </div>

              <p className="mt-4 text-sm text-slate-400">
                Sin ruido. Solo fútbol, amigos y gloria deportiva.
                <Link className="ml-2 font-semibold text-blue-100 hover:text-white" href="/ranking">
                  Ver ranking
                </Link>
                <Link className="ml-2 font-semibold text-blue-100 hover:text-white" href="/rules">
                  Cómo funciona
                </Link>
              </p>
            </div>

            <div id="demo" className="rounded-[2rem] border border-white/10 bg-white/10 p-5 shadow-2xl">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Grupo</p>
                  <h2 className="text-2xl font-black">Quiniela Mundial</h2>
                </div>
                <div className="rounded-2xl bg-blue-500/20 px-3 py-2 text-sm font-bold text-blue-100">
                  EN VIVO
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-[#07111f]/80 p-4">
                <p className="mb-3 text-sm text-slate-300">Próximos partidos</p>
                <div className="space-y-3">
                  {matches.map((m, i) => (
                    <div key={i} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
                      <div className="mb-2 flex justify-between text-xs text-slate-400">
                        <span>{m[0]}</span>
                        <span>{m[3]}</span>
                      </div>
                      <div className="grid grid-cols-[1fr_auto_1fr] gap-3">
                        <span className="font-semibold">{m[1]}</span>
                        <span className="text-blue-200">VS</span>
                        <span className="text-right font-semibold">{m[2]}</span>
                      </div>
                      <p className="mt-2 text-center text-xs text-slate-500">{m[4]}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-xs text-slate-500">Hora Miami / ET para esta vista previa.</p>
              </div>

              <div className="mt-4 rounded-3xl border border-white/10 bg-[#07111f]/80 p-4">
                <p className="mb-3 text-sm text-slate-300">Vista previa del ranking</p>
                <div className="space-y-2">
                  {ranking.map((row) => (
                    <div key={row[0]} className="grid grid-cols-4 rounded-2xl bg-white/5 px-3 py-2 text-sm">
                      <span className="font-bold text-slate-400">#{row[0]}</span>
                      <span>{row[1]}</span>
                      <span className="text-right text-slate-300">{row[2]}</span>
                      <span className="text-right font-bold text-blue-200">{row[3]}</span>
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
              <div key={item[0]} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <h3 className="font-black">{item[0]}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{item[1]}</p>
              </div>
            ))}
          </section>

          <section id="join" className="my-14 rounded-3xl border border-white/10 bg-gradient-to-br from-slate-800 to-blue-950 p-8">
            <h2 className="text-3xl font-black">Limpio, social e internacional.</h2>
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
