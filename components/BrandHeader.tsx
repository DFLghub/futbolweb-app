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
      className={`rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-sm shadow-slate-200/70 sm:px-4 sm:py-3 ${className}`}
    >
      <div className="flex items-start justify-between gap-2 sm:flex-wrap sm:items-center sm:gap-x-3 sm:gap-y-2">
        <div className="flex min-w-0 flex-1 items-start gap-2 sm:items-center sm:gap-2.5">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-emerald-200 bg-emerald-50 text-base shadow-inner shadow-white sm:h-9 sm:w-9 sm:text-xl">
            🐯
          </div>
          <div className="min-w-0">
            <div className="sm:flex sm:flex-wrap sm:items-baseline sm:gap-x-2 sm:gap-y-0.5">
              <p className="text-base font-black leading-tight tracking-tight text-slate-950 sm:text-lg">
                {dict.brand.appName}
              </p>
              <p className="mt-0.5 text-[0.65rem] font-semibold uppercase leading-tight tracking-[0.14em] text-emerald-700 sm:mt-0 sm:text-xs">
                {dict.brand.subtitle}
              </p>
            </div>
            <span className="mt-1 inline-flex w-fit rounded border border-red-200 bg-red-50 px-1.5 py-0.5 text-[0.56rem] font-black uppercase leading-4 tracking-[0.1em] text-red-700 sm:hidden">
              {dict.brand.badge}
            </span>
            <p className="mt-0.5 hidden text-xs font-medium leading-snug text-slate-600 sm:block sm:text-sm">
              {dict.brand.tagline}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-start gap-2 sm:flex-wrap sm:items-center">
          <span className="hidden w-fit rounded border border-red-200 bg-red-50 px-2 py-0.5 text-[0.68rem] font-black uppercase leading-5 tracking-[0.12em] text-red-700 sm:inline-flex">
            {dict.brand.badge}
          </span>
          <LanguageSelector />
        </div>
      </div>
    </div>
  );
}
