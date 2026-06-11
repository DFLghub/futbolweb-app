"use client";

import { useI18n } from "@/components/I18nProvider";

type SupportContactBlockProps = {
  className?: string;
};

function getSupportHref(email: string) {
  const whatsappNumber = process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP?.replace(/[^\d+]/g, "");

  if (whatsappNumber) {
    return {
      href: `https://wa.me/${whatsappNumber.replace(/^\+/, "")}`,
      labelType: "whatsapp" as const,
    };
  }

  return {
    href: `mailto:${email}`,
    labelType: "email" as const,
  };
}

export default function SupportContactBlock({ className = "" }: SupportContactBlockProps) {
  const { dict } = useI18n();
  const labels = dict.support;
  const support = getSupportHref(labels.email);
  const cta = support.labelType === "whatsapp" ? labels.whatsappCta : labels.emailCta;

  return (
    <section className={`rounded-lg border border-sky-200 bg-sky-50 p-4 ${className}`}>
      <p className="text-xs font-black uppercase tracking-[0.14em] text-sky-700">
        {labels.eyebrow}
      </p>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-black leading-tight text-slate-950">{labels.title}</h2>
          <p className="mt-1 text-sm font-semibold leading-6 text-slate-700">{labels.text}</p>
        </div>
        <a
          className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-md bg-slate-950 px-4 py-3 text-sm font-black text-white shadow-sm transition hover:bg-slate-800"
          href={support.href}
        >
          {cta}
        </a>
      </div>
    </section>
  );
}
