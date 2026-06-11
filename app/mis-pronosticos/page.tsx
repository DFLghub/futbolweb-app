import BrandHeader from "@/components/BrandHeader";
import MyPredictionsClient from "@/components/MyPredictionsClient";
import SimpleNav from "@/components/SimpleNav";
import SupportContactBlock from "@/components/SupportContactBlock";
import { getCurrentDictionary } from "@/lib/i18n-server";

export default async function MyPredictionsPage() {
  const dict = await getCurrentDictionary();

  return (
    <main className="min-h-screen bg-[#f3f6fb] px-5 py-6 text-slate-950 md:px-10 md:py-8">
      <div className="mx-auto max-w-4xl">
        <BrandHeader className="mb-3" />
        <div className="mb-5 border-b border-slate-200 pb-4">
          <SimpleNav compact />
        </div>

        <header className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-emerald-700">
            {dict.myPredictions.eyebrow}
          </p>
          <h1 className="mt-2 text-3xl font-black leading-tight tracking-tight md:text-5xl">
            {dict.myPredictions.title}
          </h1>
          <p className="mt-3 max-w-2xl text-sm font-semibold leading-6 text-slate-700">
            {dict.myPredictions.intro}
          </p>
        </header>

        <MyPredictionsClient />

        <SupportContactBlock className="mt-5" />
      </div>
    </main>
  );
}
