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
      className={`rounded-lg border border-slate-200 bg-white px-3 py-2.5 shadow-sm shadow-slate-200/70 sm:px-4 sm:py-3 ${className}`}
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <div className="flex min-w-0 flex-1 items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-emerald-200 bg-emerald-50 text-lg shadow-inner shadow-white sm:h-9 sm:w-9 sm:text-xl">
            🐯
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <p className="text-base font-black leading-tight tracking-tight text-slate-950 sm:text-lg">
                {dict.brand.appName}
              </p>
              <p className="text-[0.65rem] font-semibold uppercase leading-tight tracking-[0.14em] text-emerald-700 sm:text-xs">
                {dict.brand.subtitle}
              </p>
            </div>
            <p className="mt-0.5 text-xs font-medium leading-snug text-slate-600 sm:text-sm">
              {dict.brand.tagline}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <span className="w-fit rounded border border-red-200 bg-red-50 px-2 py-0.5 text-[0.62rem] font-black uppercase leading-5 tracking-[0.12em] text-red-700 sm:text-[0.68rem]">
            {dict.brand.badge}
          </span>
          <LanguageSelector />
        </div>
      </div>
    </div>
  );
}
