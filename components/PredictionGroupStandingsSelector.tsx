"use client";

import { useMemo, useState } from "react";

import { useI18n } from "@/components/I18nProvider";
import PredictionGroupStandingsTable from "@/components/PredictionGroupStandingsTable";
import type { PredictionGroupStanding } from "@/lib/prediction-group-standings";

type PredictionGroupStandingsSelectorProps = {
  groups: string[];
  initialGroupCode: string;
  standingsByGroup: Record<string, PredictionGroupStanding[]>;
};

export default function PredictionGroupStandingsSelector({
  groups,
  initialGroupCode,
  standingsByGroup,
}: PredictionGroupStandingsSelectorProps) {
  const { dict } = useI18n();
  const initialSelectedGroupCode = groups.includes(initialGroupCode)
    ? initialGroupCode
    : groups[0];
  const [selectedGroupCode, setSelectedGroupCode] = useState(initialSelectedGroupCode);
  const selectedStandings = useMemo(
    () => standingsByGroup[selectedGroupCode] ?? [],
    [standingsByGroup, selectedGroupCode],
  );

  return (
    <section className="mt-6">
      <label className="block text-sm font-black text-slate-700" htmlFor="prediction-group-selector">
        {dict.groupStandings.selectorLabel}
      </label>
      <select
        className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-3 text-base font-bold text-slate-950 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 md:max-w-sm"
        id="prediction-group-selector"
        onChange={(event) => setSelectedGroupCode(event.target.value)}
        value={selectedGroupCode}
      >
        {groups.map((groupCode) => (
          <option key={groupCode} value={groupCode}>
            {groupCode}
          </option>
        ))}
      </select>

      <div className="mt-4">
        <PredictionGroupStandingsTable standings={selectedStandings} />
      </div>
    </section>
  );
}
