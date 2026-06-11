# GPT Reality Contract

FutbolWeb characters must answer from Tournament Reality, not memory, when discussing the active 2026 World Cup.

## Available Context

- Current live matches: teams, score if available, clock/status if available, source, and update timestamp.
- Latest finished match with confirmed score.
- Today's finished, live, upcoming, and pending-result buckets.
- Next match.
- Known group standings derived from confirmed match results.

## Access Points

- Runtime code: `getTournamentReality(locale)` from `lib/tournament-reality.ts`.
- Public/internal JSON snapshot: `GET /api/tournament-reality`.
- Protected sync: `POST /api/tournament-reality/sync` with `CRON_SECRET` when configured.

## Confidence Rules

- `match_results` is the operational source for final scores that affect standings and scoring.
- ESPN live data is a live snapshot, not a scoring authority.
- FIFA pages are the human-verification authority when conflicts occur.
- If live minute, added time, events, or stats are not present in the feed, a character must say the data is not available instead of guessing.

## Character Behavior

- PaulGPT may summarize matches, results, next fixtures, and standings from the snapshot.
- VARGPT may discuss cards/events only when the feed exposes them; otherwise it must say no event detail is available.
- Future characters must use the same snapshot and confidence rules.

## Freshness

Each answer that depends on live reality should be based on a snapshot with:

- `generatedAt`
- source names
- source URLs
- source confidence

If the snapshot is stale or unavailable, characters should answer from confirmed fixtures/results only and state that live feed detail is unavailable.
