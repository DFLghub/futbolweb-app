import Link from "next/link";
import BrandHeader from "@/components/BrandHeader";
import SimpleNav from "@/components/SimpleNav";
import { getCurrentDictionary } from "@/lib/i18n-server";

export default async function RulesPage() {
  const dict = await getCurrentDictionary();

  return (
    <main className="min-h-screen bg-[#07111f] px-5 py-8 text-white md:px-10">
      <div className="mx-auto max-w-5xl">
        <BrandHeader className="mb-4" />
        <SimpleNav />

        <header className="border-b border-white/10 pb-8">
          <p className="mb-3 inline-flex rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-sm font-semibold text-cyan-100">
            {dict.rules.eyebrow}
          </p>
          <h1 className="text-4xl font-black tracking-tight md:text-5xl">
            {dict.rules.title}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300 md:text-lg">
            {dict.rules.intro}
          </p>
        </header>

        <section className="mt-8 grid gap-4 md:grid-cols-2">
          {dict.rules.sections.map(([title, items]) => (
            <article
              key={title}
              className="rounded-lg border border-white/10 bg-white/[0.06] p-5 shadow-xl shadow-black/10"
            >
              <h2 className="text-xl font-black">{title}</h2>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
                {items.map((item) => (
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
            {dict.rules.tricksTitle}
          </h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {dict.rules.trickSections.map(([title, items]) => (
              <article
                key={title}
                className="rounded-lg border border-white/10 bg-slate-950/25 p-4"
              >
                <h3 className="text-base font-black text-emerald-50">
                  {title}
                </h3>
                <ul className="mt-3 space-y-3 text-sm leading-6 text-emerald-50/85">
                  {items.map((item) => (
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
            {dict.rules.tricksFooter}
          </p>
        </section>

        <section className="mt-4 rounded-lg border border-amber-200/20 bg-amber-300/10 p-5">
          <h2 className="text-xl font-black text-amber-50">{dict.rules.goldenTitle}</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-amber-100/90">
            {dict.rules.goldenText}
          </p>
        </section>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            className="min-h-11 rounded-md bg-cyan-300 px-5 py-3 text-center text-sm font-black text-slate-950 transition hover:bg-cyan-200"
            href="/today"
          >
            {dict.rules.ctaPredictions}
          </Link>
          <Link
            className="min-h-11 rounded-md border border-white/15 bg-white/10 px-5 py-3 text-center text-sm font-bold text-white transition hover:bg-white/15"
            href="/ranking"
          >
            {dict.rules.ctaRanking}
          </Link>
          <Link
            className="min-h-11 rounded-md border border-white/15 bg-white/5 px-5 py-3 text-center text-sm font-bold text-slate-200 transition hover:bg-white/10"
            href="/"
          >
            {dict.rules.ctaHome}
          </Link>
        </div>
      </div>
    </main>
  );
}
