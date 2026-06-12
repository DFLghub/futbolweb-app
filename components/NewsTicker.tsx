type NewsTickerProps = {
  items: string[];
};

export default function NewsTicker({ items }: NewsTickerProps) {
  const visibleItems = items.length > 0
    ? items
    : ["FutbolWeb.app", "Ranking en vivo", "Pregúntale al Oráculo"];
  const tickerItems = [...visibleItems, ...visibleItems];

  return (
    <div className="border-b border-emerald-900/20 bg-slate-950 text-white" aria-label="FutbolWeb ticker">
      <div className="flex min-h-9 items-center overflow-hidden">
        <div className="flex min-w-max animate-fw-ticker items-center">
          {tickerItems.map((item, index) => (
            <span
              className="flex items-center whitespace-nowrap px-4 text-xs font-black uppercase tracking-[0.12em] text-emerald-50 md:px-6 md:text-sm"
              key={`${item}-${index}`}
            >
              <span className="mr-3 text-emerald-300">ULTIMA HORA</span>
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
