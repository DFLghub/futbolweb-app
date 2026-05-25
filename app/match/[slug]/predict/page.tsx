import Link from "next/link";

type PredictPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function formatDemoSlug(slug: string) {
  return slug
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

export default async function PredictPage({ params }: PredictPageProps) {
  const { slug } = await params;
  const demoMatch = formatDemoSlug(slug);

  return (
    <main className="min-h-screen bg-[#07111f] px-5 py-8 text-white md:px-10">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-4xl items-center">
        <section className="w-full rounded-lg border border-white/10 bg-white/[0.06] p-6 shadow-xl shadow-black/10 md:p-8">
          <div className="mb-6 inline-flex rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-sm font-semibold text-cyan-100">
            Modo Mundial demo
          </div>

          <h1 className="text-4xl font-black tracking-tight md:text-5xl">
            Pronóstico en preparación
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
            Este partido todavía está en modo demo. Por ahora puedes entrar al Modo Mundial,
            ver los partidos disponibles y revisar el ranking del grupo.
          </p>

          <div className="mt-6 rounded-md border border-white/10 bg-black/20 px-4 py-3 text-sm text-slate-300">
            <span className="font-semibold text-slate-100">Partido demo:</span>{" "}
            <span>{demoMatch || "partido demo"}</span>
          </div>

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
              href="/rules"
            >
              Cómo funciona
            </Link>
            <Link
              className="min-h-11 rounded-md border border-white/15 bg-white/5 px-5 py-3 text-center text-sm font-bold text-slate-200 transition hover:bg-white/10"
              href="/"
            >
              Volver al inicio
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
