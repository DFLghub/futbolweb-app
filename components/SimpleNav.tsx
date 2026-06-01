"use client";

import Link from "next/link";
import { useI18n } from "@/components/I18nProvider";

type SimpleNavProps = {
  compact?: boolean;
};

export default function SimpleNav({ compact = false }: SimpleNavProps) {
  const { dict } = useI18n();
  const navItems = [
    { href: "/", label: dict.nav.home },
    { href: "/today", label: dict.nav.predictions },
    { href: "/ranking", label: dict.nav.ranking },
    { href: "/standings", label: dict.nav.groups },
    { href: "/rules", label: dict.nav.rules },
  ];

  return (
    <nav
      aria-label={dict.nav.ariaLabel}
      className={
        compact
          ? "flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-semibold text-slate-300"
          : "mb-8 flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-white/10 pb-4 text-sm font-semibold text-slate-300"
      }
    >
      {navItems.map((item) => (
        <Link
          key={item.href}
          className="transition hover:text-white"
          href={item.href}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
