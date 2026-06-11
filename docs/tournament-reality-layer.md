# Tournament Reality Layer

FutbolWeb's operational reality is centralized in `lib/tournament-reality.ts`.

## Goal

Represent what is happening in the World Cup once, then let UI, standings, rankings, and GPT characters derive from that reality.

## Current Inputs

1. Static FIFA fixture load: `lib/world-cup-2026-matches.ts`
2. Confirmed final scores: `public.match_results`
3. Live/result feed adapter: ESPN FIFA World Cup scoreboard JSON

## Current Outputs

- `getTournamentReality(locale, now?)`
- `deriveHomeMatchState(locale, now?)` compatibility wrapper
- `buildGptRealityContext(reality)`
- `GET /api/tournament-reality`
- `POST /api/tournament-reality/sync`

## State Model

Each match receives one operational status:

- `upcoming`: kickoff is in the future and no eligible final result exists.
- `live`: kickoff started and the expected live window has not expired.
- `finished_with_result`: result exists in `match_results` and kickoff has started.
- `finished_pending_result`: expected match window expired but no confirmed result exists.

Future result rows are ignored until kickoff time has passed. This protects the app from bad seeds or accidental future data.

## Update Loop

The sync endpoint is designed for cron/polling:

1. Fetch ESPN FIFA World Cup scoreboard JSON.
2. Map completed ESPN events to known FutbolWeb fixtures by UTC date and team codes.
3. Upsert only completed, safely mapped scores into `match_results`.
4. Do not run scoring automatically from this endpoint.
5. Existing scoring/ranking flows continue to read confirmed results through their current mechanisms.

Production should call:

```text
POST /api/tournament-reality/sync
Authorization: Bearer $CRON_SECRET
```

Recommended cadence:

- Matchdays: every 2-5 minutes.
- Non-matchdays: every 30-60 minutes.

## Consumers

- Home: renders latest result, live matches, next match, and today's counts from `getTournamentReality`.
- Standings: calculates group tables from `getCompletedMatchResults(await getOfficialMatchResults())`.
- Oracle/GPTs: answer today's slate and team questions from `getTournamentReality`; group answers use real standings when available.
- Ranking: still derives from existing scored prediction tables. It remains coherent once scoring is run for confirmed results.

## Non-Goals For This Increment

- No scoring automation.
- No RLS/policy changes.
- No new ranking rules.
- No invented live events or stats.
- No dependency on a paid provider before coverage and credentials are confirmed.

## Next Cycles

1. Add a persistent live snapshot table if live minute/events need to survive provider outages.
2. Add event/stat adapters once provider coverage is verified.
3. Add admin observability for stale feeds, sync failures, and source conflicts.
4. Decide whether scoring should be manually triggered or separately automated after result verification.
