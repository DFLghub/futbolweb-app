"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/components/I18nProvider";

type SimpleNavProps = {
  compact?: boolean;
};

export default function SimpleNav({ compact = false }: SimpleNavProps) {
  const { dict } = useI18n();
  const pathname = usePathname();
  const navItems = [
    { href: "/", label: dict.nav.today },
    { href: "/upcoming", label: dict.nav.upcoming },
    { href: "/mis-pronosticos", label: dict.nav.myPredictions },
    { href: "/ranking", label: dict.nav.ranking },
    { href: "/group-standings", label: dict.nav.groupStandings },
    { href: "/standings", label: dict.nav.groups },
    { href: "/rules", label: dict.nav.rules },
  ];

  return (
    <nav
      aria-label={dict.nav.ariaLabel}
      className={
        compact
          ? "flex snap-x items-center gap-2 overflow-x-auto pb-1 text-sm font-semibold text-slate-600"
          : "mb-8 flex snap-x items-center gap-2 overflow-x-auto border-b border-slate-200 pb-4 text-sm font-semibold text-slate-600"
      }
    >
      {navItems.map((item) => {
        const isActive =
          item.href === "/"
            ? pathname === "/" || pathname === "/today"
            : pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            aria-current={isActive ? "page" : undefined}
            className={
              isActive
                ? "snap-start whitespace-nowrap rounded-md bg-slate-950 px-3 py-2 font-black text-white shadow-sm"
                : "snap-start whitespace-nowrap rounded-md px-3 py-2 transition hover:bg-white hover:text-slate-950 hover:shadow-sm"
            }
            href={item.href}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
