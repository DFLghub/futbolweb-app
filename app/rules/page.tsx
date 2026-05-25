import Link from "next/link";
import BrandHeader from "@/components/BrandHeader";
import SimpleNav from "@/components/SimpleNav";

const sections = [
  {
    title: "La idea",
    items: [
      "Entras al Modo Mundial.",
      "Ves los partidos disponibles.",
      "Pronosticas el marcador.",
      "Compites con tu grupo.",
      "El ranking se actualiza con puntos.",
    ],
  },
  {
    title: "Puntos",
    items: [
      "Marcador exacto = 3 pts.",
      "Resultado correcto = 1 pt. Ejemplo: dijiste Colombia gana, y Colombia gana, aunque el marcador no sea exacto.",
      "Si fallas = 0 pts.",
    ],
  },
  {
    title: "Ranking",
    items: [
      "El ranking muestra quién va arriba, quién está peleando y quién está en zona roja.",
      "La gracia es la conversación, la presión social sana y la revancha.",
    ],
  },
  {
    title: "Zona Roja",
    items: [
      "Los últimos lugares entran en Zona Roja.",
      "No es castigo serio; es folklore, joda y motivación para remontar.",
    ],
  },
  {
    title: "Resucitado",
    items: [
      "Un jugador eliminado o muy caído puede volver con una resurrección manual.",
      "Puede requerir una penitencia ligera o reto social.",
      "No se automatiza todavía.",
    ],
  },
  {
    title: "Bocón Mode",
    items: [
      "Estado narrativo para quien habla mucho, reta al grupo o calienta el ambiente.",
      "Es humor, no sanción.",
    ],
  },
  {
    title: "WhatsApp primero",
    items: [
      "La conversación vive en WhatsApp.",
      "FutbolWeb.app organiza partidos, ranking y cómo funciona.",
      "No estamos creando chat propio.",
    ],
  },
];

const trickSections = [
  {
    title: "Trucos para subir en el ranking",
    items: [
      "Pronostica antes de que cierre el partido.",
      "No siempre busques marcador loco; a veces acertar el ganador suma.",
      "Si estás abajo, puedes arriesgar un marcador diferente para recortar distancia.",
      "Si vas arriba, no regales puntos con inventos innecesarios.",
    ],
  },
  {
    title: "Atajos sociales",
    items: [
      "Calienta el grupo con humor antes del partido.",
      "Reta al líder del ranking.",
      "Usa Bocón Mode para meter presión, pero sin pasarte.",
      "Comparte el ranking para despertar a los dormidos.",
    ],
  },
  {
    title: "Cómo resucitar",
    items: [
      "Si caes muy bajo, puedes pedir resurrección.",
      "La resurrección no es automática.",
      "Puede requerir penitencia ligera: meme, audio cantando gol, predicción pública arriesgada o declaración futbolera dramática.",
      "El grupo o el administrador decide si se acepta.",
    ],
  },
  {
    title: "Trampita chiquita permitida",
    items: [
      "Hacer psicología barata en WhatsApp.",
      "Decir “tengo una corazonada” para asustar al rival.",
      "Celebrar antes de tiempo bajo tu propio riesgo.",
      "Tirar humo futbolero.",
      "Presionar al líder con memes.",
      "Cambiar de equipo favorito si el tuyo queda eliminado, si las reglas del grupo lo permiten.",
    ],
  },
];

export default function RulesPage() {
  return (
    <main className="min-h-screen bg-[#07111f] px-5 py-8 text-white md:px-10">
      <div className="mx-auto max-w-5xl">
        <BrandHeader className="mb-4" />
        <SimpleNav />

        <header className="border-b border-white/10 pb-8">
          <p className="mb-3 inline-flex rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-sm font-semibold text-cyan-100">
            Oráculo Futbolero
          </p>
          <h1 className="text-4xl font-black tracking-tight md:text-5xl">
            Cómo funciona
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300 md:text-lg">
            FutbolWeb.app es un juego social de pronósticos entre amigos. No es una app de apuestas.
          </p>
        </header>

        <section className="mt-8 grid gap-4 md:grid-cols-2">
          {sections.map((section) => (
            <article
              key={section.title}
              className="rounded-lg border border-white/10 bg-white/[0.06] p-5 shadow-xl shadow-black/10"
            >
              <h2 className="text-xl font-black">{section.title}</h2>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
                {section.items.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-200" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <section className="mt-4 rounded-lg border border-emerald-200/20 bg-emerald-300/10 p-5">
          <h2 className="text-2xl font-black text-emerald-50">
            Trucos, atajos y trampita chiquita permitida
          </h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {trickSections.map((section) => (
              <article
                key={section.title}
                className="rounded-lg border border-white/10 bg-slate-950/25 p-4"
              >
                <h3 className="text-base font-black text-emerald-50">
                  {section.title}
                </h3>
                <ul className="mt-3 space-y-3 text-sm leading-6 text-emerald-50/85">
                  {section.items.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-200" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <p className="mt-5 max-w-4xl text-sm font-semibold leading-6 text-emerald-50">
            Puedes ser astuto, bocón y dramático. Pero no puedes hacer trampa
            real. Esto es Mundial, amistad y folklore; no casino, no pelea y
            no negocio raro.
          </p>
        </section>

        <section className="mt-4 rounded-lg border border-amber-200/20 bg-amber-300/10 p-5">
          <h2 className="text-xl font-black text-amber-50">Regla de oro</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-amber-100/90">
            Esto se juega por diversión, comunidad y Mundial. No se juega con dinero.
          </p>
        </section>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            className="min-h-11 rounded-md bg-cyan-300 px-5 py-3 text-center text-sm font-black text-slate-950 transition hover:bg-cyan-200"
            href="/today"
          >
            Ver pronósticos
          </Link>
          <Link
            className="min-h-11 rounded-md border border-white/15 bg-white/10 px-5 py-3 text-center text-sm font-bold text-white transition hover:bg-white/15"
            href="/ranking"
          >
            Ver ranking
          </Link>
          <Link
            className="min-h-11 rounded-md border border-white/15 bg-white/5 px-5 py-3 text-center text-sm font-bold text-slate-200 transition hover:bg-white/10"
            href="/"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </main>
  );
}
