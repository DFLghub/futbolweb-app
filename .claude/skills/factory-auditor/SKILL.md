---
name: factory-auditor
description: Use this skill to audit post-execution work cycles for Apps Factory after a task, PRP phase, commit, or contract-driven change. It verifies contract compliance, architecture discipline, metabolic health, and reusable pattern yield before commit or against HEAD~1.
---

# Factory Auditor

## 1. Identity

Factory Auditor v0 is a post-execution auditor for Apps Factory.

Core: Contract Auditor.

Extension: architecture, metabolism, and pattern yield.

Use it to determine whether a completed work cycle respected its contract, preserved the repo architecture, avoided unnecessary operational cost, and produced a reusable pattern worth extracting.

## 2. When To Use

Use this skill:

- After executing a task or PRP phase.
- Before commit.
- After commit, when auditing against `HEAD~1`.
- When the user asks whether the agent respected the contract.

## 3. Required Inputs

Collect the smallest sufficient evidence set:

- `CONTRACT.md` or a contract pasted in the prompt.
- `git diff --name-only`.
- `git diff`.
- `git status --short`.
- Validations executed and their results.
- Commit list, if applicable.

When auditing after commit, compare against the relevant base, commonly `HEAD~1`:

```sh
git diff --name-only HEAD~1..HEAD
git diff HEAD~1..HEAD
git status --short
git log --oneline HEAD~1..HEAD
```

## 4. Contract Audit

Verify the cycle against the contract:

- `NO TOCAR`: no prohibited files, systems, commands, or domains were touched.
- `Si tocar`: every changed file is allowed by the contract.
- Allowed files: file paths match the stated scope.
- Allowed commands: executed commands match the stated scope and risk level.
- Required validations: mandatory checks were run, skipped only with explicit reason.
- Commit policy: commits are small, clearly named, and do not mix unrelated concerns.
- Stop condition: work stopped when the contract was satisfied or when a blocker required human decision.

Mark `CONTRACT` as:

- `PASS`: contract was followed.
- `WARN`: minor deviation or missing evidence without clear damage.
- `FAIL`: prohibited scope was touched, required validation was skipped without acceptable reason, or stop behavior was violated.

## 5. Architecture Audit

Verify architectural discipline:

- No overarchitecture.
- No unnecessary duplication.
- No new fronts opened outside the stated objective.
- No improper coupling between unrelated modules, runtimes, or ownership boundaries.
- No mixing of FutbolWeb runtime and factory artifacts without explicit authorization.

Mark `ARCHITECTURE` as:

- `PASS`: change fits existing boundaries.
- `WARN`: acceptable but carries design debt or unclear boundary pressure.
- `FAIL`: architecture boundary was broken or unrelated systems were coupled.

## 6. Metabolism Audit

Assess whether the cycle was operationally healthy:

- Number of files modified.
- Number of lines changed.
- Number of commits.
- Commands executed.
- Whether `build` or `lint` ran when required.
- Whether unnecessary expense, runtime work, broad scans, or repeated attempts were avoided.

Mark `METABOLISM` as:

- `PASS`: effort and validation were proportional.
- `WARN`: more churn or cost than needed, but outcome remains controlled.
- `FAIL`: excessive churn, avoidable expensive work, missing required checks, or commit spam.

## 7. Pattern Yield

Evaluate whether the cycle produced reusable learning:

- Did a reusable pattern emerge?
- Is it local to this repo or transversal across Apps Factory?
- Should it be documented as `PATTERN.md`?
- Should it become a skill?
- Should it feed future memory under `.claude/memory/project/`?

Mark `PATTERN_YIELD` as:

- `NONE`: no reusable pattern.
- `LOW`: small local lesson, no extraction needed.
- `MEDIUM`: reusable repo-level pattern worth documenting.
- `HIGH`: transversal Apps Factory pattern worth turning into a skill or durable memory.

## 8. Verdicts

Every audit must emit:

```text
CONTRACT: PASS|WARN|FAIL
ARCHITECTURE: PASS|WARN|FAIL
METABOLISM: PASS|WARN|FAIL
PATTERN_YIELD: NONE|LOW|MEDIUM|HIGH
FINAL_VERDICT: PASS|PASS_WITH_WARNINGS|FAIL|PASS_WITH_PATTERN_EXTRACTION
```

Use `FINAL_VERDICT` as follows:

- `PASS`: all audit categories pass and no extraction is needed.
- `PASS_WITH_WARNINGS`: one or more categories are `WARN`, none are `FAIL`.
- `FAIL`: any category is `FAIL`.
- `PASS_WITH_PATTERN_EXTRACTION`: all required categories pass or warn, and `PATTERN_YIELD` is `MEDIUM` or `HIGH`.

## 9. Critical Rule For FAIL

If the audit result is `FAIL`:

- Do not commit.
- Do not run `git reset --hard` automatically.
- Preserve changes.
- Generate a report.
- Ask for human decision.

## 10. Audit Report Template

When a written report is requested, produce `AUDIT_REPORT.md` with this structure:

```markdown
# Audit Report

## Summary

## Contract Compliance

## Architecture

## Metabolism

## Pattern Yield

## Violations

## Recommended Action

## Human Decision Required?
```

Keep findings specific, file-backed, and tied to contract clauses. Do not invent evidence that was not collected.

## 11. FutbolWeb 11D Example

Contract:

- Differentiate `/today` and `/upcoming`.
- Do not touch Supabase, scoring, ranking, API, or deployment.

Result:

```text
CONTRACT: PASS
ARCHITECTURE: PASS
METABOLISM: PASS
PATTERN_YIELD: MEDIUM/HIGH
FINAL_VERDICT: PASS_WITH_PATTERN_EXTRACTION
```

Reason: the cycle revealed a reusable distinction between a live front page and a calendar surface. That pattern may generalize to other Apps Factory products where an operational view and a planning view must stay separate.
