import { type GroupMatchPrediction } from "@/lib/group-match-predictions";

type Dict = {
  aliasHeader: string;
  predictionHeader: string;
  pointsHeader: string;
  noPredictions: string;
  pendingResult: string;
};

function PointsBadge({ points, scoreDetail }: { points: number; scoreDetail: string | null }) {
  return (
    <span className="inline-flex items-baseline gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-black text-emerald-700">
      {points % 1 === 0 ? String(points) : String(points)}
      {scoreDetail ? (
        <span className="font-semibold text-emerald-600">· {scoreDetail}</span>
      ) : null}
    </span>
  );
}

export default function GroupMatchPredictionsTable({
  dict,
  predictions,
  isScored,
}: {
  dict: Dict;
  predictions: GroupMatchPrediction[];
  isScored: boolean;
}) {
  if (predictions.length === 0) {
    return (
      <p className="mt-6 text-sm font-semibold text-slate-500">{dict.noPredictions}</p>
    );
  }

  return (
    <div className="mt-4">
      {/* Mobile: stacked cards */}
      <div className="grid gap-3 sm:hidden">
        {predictions.map((p) => (
          <div
            key={p.id}
            className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm shadow-slate-200/70"
          >
            <p className="text-[11px] font-black uppercase tracking-[0.12em] text-slate-500">
              {p.alias}
            </p>
            <p className="mt-1 text-3xl font-black text-slate-950">
              {p.scoreA} – {p.scoreB}
            </p>
            {p.points !== null ? (
              <div className="mt-2">
                <PointsBadge points={p.points} scoreDetail={p.scoreDetail} />
              </div>
            ) : isScored ? (
              <p className="mt-1 text-xs font-semibold text-amber-600">{dict.pendingResult}</p>
            ) : null}
            {p.comment ? (
              <p className="mt-2 border-t border-slate-100 pt-2 text-xs font-semibold italic text-slate-500">
                "{p.comment}"
              </p>
            ) : null}
          </div>
        ))}
      </div>

      {/* Desktop: table */}
      <div className="hidden overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm sm:block">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                {dict.aliasHeader}
              </th>
              <th className="px-4 py-3 text-center text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                {dict.predictionHeader}
              </th>
              {isScored ? (
                <th className="px-4 py-3 text-right text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                  {dict.pointsHeader}
                </th>
              ) : null}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {predictions.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50/60">
                <td className="px-4 py-3 font-black text-slate-950">{p.alias}</td>
                <td className="px-4 py-3 text-center font-black text-slate-950">
                  {p.scoreA} – {p.scoreB}
                </td>
                {isScored ? (
                  <td className="px-4 py-3 text-right">
                    {p.points !== null ? (
                      <PointsBadge points={p.points} scoreDetail={p.scoreDetail} />
                    ) : (
                      <span className="text-xs font-semibold text-amber-600">
                        {dict.pendingResult}
                      </span>
                    )}
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
