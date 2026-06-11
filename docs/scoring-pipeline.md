# Scoring Pipeline

## Root Cause

Tournament Reality can now import confirmed final scores into `match_results`, but the ranking surface does not read `match_results` directly. Ranking reads `ranking_summary`, and `ranking_summary` is a SQL view over `prediction_scores`.

The missing propagation step was:

```text
confirmed match_results row
-> run_scoring_for_match(match_slug)
-> prediction_scores rows
-> ranking_summary view reflects new totals
```

Without that scoring function call, the app can know a real match result while ranking and prediction group standings remain unchanged.

## Flow Map

```text
Tournament Reality Layer
  |
  | 1. sync imports verified final result
  v
public.match_results
  |
  | 2. propagation runs existing SQL function
  v
public.run_scoring_for_match(match_slug)
  |
  | 3. idempotently deletes/reinserts scores for that match
  v
public.prediction_scores
  |
  | 4. SQL view aggregates points by alias/group
  v
public.ranking_summary
  |
  +--> /ranking via lib/real-ranking.ts
  |
  +--> /group-standings via lib/prediction-group-standings.ts
  |
  +--> state_change_events: ScoringCompleted, RankingUpdated
  |
  +--> GPT feeds via Tournament Reality + real standings
```

## Existing Dependencies

- `match_results`: confirmed official score rows.
- `prediction_intake`: accepted predictions are eligible for scoring.
- `puntaje_tigre`: existing point function. Do not change without a scoring migration.
- `run_scoring_for_match`: existing idempotent scorer.
- `prediction_scores`: calculated points per accepted prediction.
- `ranking_summary`: view over `prediction_scores`; no materialized refresh required.
- `state_change_events`: records `ScoringCompleted` and `RankingUpdated`.

## Manual Step Detected

Before this cycle, after a final score was imported into `match_results`, an operator still had to manually execute:

```sql
SELECT * FROM run_scoring_for_match('match-slug');
```

That was the propagation gap.

## Automation Layer

The smallest safe automation is implemented in app code:

- `lib/scoring-propagation.ts`
  - detects completed results with no `ScoringCompleted` event.
  - calls existing `run_scoring_for_match`.
  - reads `ranking_summary` and `state_change_events` for observability.
- `POST /api/tournament-reality/sync`
  - imports final results.
  - then runs scoring for pending completed results.
- `GET /api/tournament-reality/propagation`
  - reports scored/pending matches and ranking freshness.
- `POST /api/tournament-reality/propagation`
  - manually/cron-triggered backfill for pending scoring.

No scoring rules, point values, ranking formulas, RLS, or policies changed.

## Observability

`GET /api/tournament-reality/propagation` returns:

- matches with confirmed results.
- `pendingScoring`.
- `scored`.
- `lastScoredAt` per match.
- `latestRankingUpdatedAt`.
- `totalRankingParticipants`.

Sync failures are returned as structured JSON from `/api/tournament-reality/sync`.

## Operational Cadence

Recommended:

```text
POST /api/tournament-reality/sync
Authorization: Bearer $CRON_SECRET
```

This handles:

1. final result import.
2. pending scoring execution.
3. ranking visibility through existing view.

Use `/api/tournament-reality/propagation` to verify the propagation health after each sync.
