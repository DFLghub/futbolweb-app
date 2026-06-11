# FutbolWeb Live Data Registry

FutbolWeb treats live World Cup data as an operational dependency. This registry records who owns each type of reality, how FutbolWeb can access it, and which product surfaces consume it.

## Source: FIFA Scores & Fixtures

- URL: https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/scores-fixtures
- Type: fixture, result
- Reliability: High
- Update frequency: Official tournament updates; public page is dynamic.
- Limitations: The public HTML does not expose a stable machine-readable contract in this repo's current tooling. Use as the human-verification authority and for schedule reconciliation.
- Consumers: Fixture audits, manual verification, live-data registry, incident review.

## Source: FIFA Match Centre

- URL: https://www.fifa.com/en/match-centre/match/17/285023/289273/400021443
- Type: fixture, live, result, stats, event
- Reliability: High
- Update frequency: Match-centre live cadence during games; official final status after full time.
- Limitations: Public page is client-rendered and not currently a stable ingestion API. Use as official human-readable source and fallback verification.
- Consumers: Official result confirmation, registry, manual incident review.

## Source: ESPN FIFA World Cup Scoreboard JSON

- URL: https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard
- Type: fixture, live, result, stats, event
- Reliability: Medium-high
- Update frequency: Near live during active matchdays; includes status, clock, completed flag, scores, details, headlines, and team statistics.
- Limitations: Public JSON is not an explicit FutbolWeb contract and can change. It is not the official FIFA authority. FutbolWeb should ingest only when events map safely to known FIFA fixtures.
- Consumers: Tournament Reality Layer live snapshot, protected result sync job, GPT context feed.

## Source: AP / Reuters / ESPN Editorial Recaps

- URL: AP, Reuters, ESPN article pages per match
- Type: result, event narrative
- Reliability: Medium-high
- Update frequency: Post-match and breaking-news cadence.
- Limitations: Article URLs are match-specific and not ideal for automated ingestion. Use for backup verification when FIFA is unavailable.
- Consumers: Manual verification notes, incident review.

## Source: Sportradar Soccer API

- URL: https://developer.sportradar.com/soccer/reference/soccer-overview
- Type: fixture, live, result, stats, event
- Reliability: High, commercial
- Update frequency: Provider SLA; designed for live sports products.
- Limitations: Requires commercial access and integration work. Not enabled in this repo.
- Consumers: Future official-grade provider adapter.

## Source: API-Football

- URL: https://www.api-football.com/documentation-v3
- Type: fixture, live, result, stats, event
- Reliability: Medium, commercial
- Update frequency: Provider-plan dependent.
- Limitations: Requires API key and coverage validation for FIFA World Cup 2026 before use as an operational source.
- Consumers: Future fallback provider adapter.

## Source: football-data.org

- URL: https://www.football-data.org/documentation/quickstart
- Type: fixture, result
- Reliability: Medium
- Update frequency: Provider-plan dependent.
- Limitations: Live minute/events/stats coverage is not the primary product fit. Requires API key.
- Consumers: Future low-complexity fixture/result fallback if coverage is confirmed.

## Operational Rule

FutbolWeb must never invent results. Automated ingestion can write only safely mapped final scores into `match_results`. Live status can be shown as an external feed snapshot with source and timestamp. Ranking/scoring remain driven by existing confirmed result and scoring flows.
