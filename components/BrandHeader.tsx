"use client";

import { useI18n } from "@/components/I18nProvider";
import LanguageSelector from "@/components/LanguageSelector";

type BrandHeaderProps = {
  className?: string;
};

export default function BrandHeader({ className = "" }: BrandHeaderProps) {
  const { dict } = useI18n();

  return (
    <div
      className={`rounded-lg border border-cyan-200/15 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.14),transparent_30%),linear-gradient(135deg,rgba(15,23,42,0.92),rgba(8,18,34,0.96))] px-3 py-2.5 shadow-lg shadow-black/15 sm:px-4 sm:py-3 ${className}`}
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <div className="flex min-w-0 flex-1 items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-amber-200/25 bg-amber-300/10 text-lg shadow-inner shadow-amber-200/5 sm:h-9 sm:w-9 sm:text-xl">
            🐯
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <p className="text-base font-black leading-tight tracking-tight text-white sm:text-lg">
                {dict.brand.appName}
              </p>
              <p className="text-[0.65rem] font-semibold uppercase leading-tight tracking-[0.14em] text-cyan-100/85 sm:text-xs">
                {dict.brand.subtitle}
              </p>
            </div>
            <p className="mt-0.5 text-xs font-medium leading-snug text-slate-300 sm:text-sm">
              {dict.brand.tagline}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <span className="w-fit rounded border border-emerald-200/25 bg-emerald-300/10 px-2 py-0.5 text-[0.62rem] font-black uppercase leading-5 tracking-[0.12em] text-emerald-100 sm:text-[0.68rem]">
            {dict.brand.badge}
          </span>
          <LanguageSelector />
        </div>
      </div>
    </div>
  );
}
