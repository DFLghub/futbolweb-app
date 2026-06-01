"use client";

import { useMemo, useState } from "react";

import { useI18n } from "@/components/I18nProvider";
import GroupStandingsTable from "@/components/GroupStandingsTable";
import type { GroupStanding } from "@/lib/mock-group-standings";

type GroupStandingsSelectorProps = {
  groups: GroupStanding[];
  initialGroupId?: string;
};

export default function GroupStandingsSelector({ groups, initialGroupId }: GroupStandingsSelectorProps) {
  const { dict } = useI18n();
  const initialSelectedGroupId = groups.some((group) => group.groupId === initialGroupId)
    ? initialGroupId
    : "grupo-a";
  const [selectedGroupId, setSelectedGroupId] = useState(initialSelectedGroupId);
  const selectedGroup = useMemo(
    () => groups.find((group) => group.groupId === selectedGroupId) ?? groups[0],
    [groups, selectedGroupId],
  );

  return (
    <section className="mt-6">
      <label className="block text-sm font-black text-slate-200" htmlFor="group-selector">
        {dict.standings.selectorLabel}
      </label>
      <select
        className="mt-2 w-full rounded-md border border-white/15 bg-slate-950 px-3 py-3 text-base font-bold text-white outline-none transition focus:border-cyan-200/70 md:max-w-xs"
        id="group-selector"
        onChange={(event) => setSelectedGroupId(event.target.value)}
        value={selectedGroup.groupId}
      >
        {groups.map((group) => (
          <option key={group.groupId} value={group.groupId}>
            {group.groupName}
          </option>
        ))}
      </select>

      <div className="mt-4">
        <GroupStandingsTable group={selectedGroup} />
      </div>
    </section>
  );
}
