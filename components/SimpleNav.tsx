import Link from "next/link";

const navItems = [
  { href: "/", label: "Inicio" },
  { href: "/today", label: "Pronósticos" },
  { href: "/ranking", label: "Ranking" },
  { href: "/standings", label: "Grupos" },
  { href: "/rules", label: "Cómo funciona" },
];

type SimpleNavProps = {
  compact?: boolean;
};

export default function SimpleNav({ compact = false }: SimpleNavProps) {
  return (
    <nav
      aria-label="Navegación principal"
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
