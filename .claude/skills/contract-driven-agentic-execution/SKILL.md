---
name: contract-driven-agentic-execution
description: Use when executing app-factory work from an explicit contract/PRP that defines objective, forbidden surfaces, allowed surfaces, validations, commits, expected outcome, error protocol, and stop condition. Applies to bounded agentic implementation loops that must map, decompose, execute, validate, correct, commit, and repeat until convergence without opening unrelated product or architecture fronts.
---

# Contract-Driven Agentic Execution

Use this skill to execute bounded app-factory work from a written contract. The agent must obey the contract as the source of truth, preserve critical surfaces outside scope, validate the work, and stop only at convergence or at the defined stop condition.

## When To Use

- The user provides a PRP, execution contract, or task brief with explicit scope.
- The work must happen inside an existing app or repository.
- The task requires multiple steps, validations, and possibly commits.
- The user names forbidden surfaces such as app logic, database, deployment, routes, or components.
- The desired outcome is operational convergence, not brainstorming.

## When Not To Use

- The user is only asking for analysis, review, explanation, or planning.
- The scope is exploratory and has no concrete expected result.
- The task asks to create a new product direction or features not already contracted.
- The required work cannot be validated locally or by the contract.
- The contract is internally contradictory and no conservative interpretation is possible.

## Required Contract Structure

Every executable contract must define these fields. If any field is missing, infer only when the repo context makes the answer obvious; otherwise ask for clarification before editing.

### Objetivo

State the concrete outcome. It must describe the capability or artifact to produce, not a vague intent.

### NO TOCAR

List files, systems, layers, or behaviors that must remain untouched. Treat this as a hard boundary.

### Si Tocar

List the only files, folders, systems, or artifact types that may be changed or created.

### Alcance Obligatorio

Define the minimum required content, behavior, or implementation surface. Work is incomplete until all required scope is satisfied.

### Validaciones

List required checks. Run only relevant checks; do not run expensive runtime checks when the contract says they are unnecessary.

### Commits

Define whether to commit, how many commits are expected, and the exact commit message when provided.

### Resultado Esperado

Define observable success: created file, passing validation, preserved forbidden surfaces, clean status except intended changes, committed state, or other specific outcome.

### Protocolo De Error

Define what to do when validation fails or a command is blocked. Use the default protocol below unless the contract overrides it.

### Stop Condition

Define when to stop. Usually: all required scope complete, validations done, commit created if requested, and no forbidden files touched.

## Execution Loop

Run this loop until convergence or stop condition:

1. **Mapear**
   Inspect repo state, existing instructions, target files, and forbidden surfaces. Start with `git status --short`.

2. **Descomponer**
   Break the contract into the smallest required edits and validations. Do not create new objectives.

3. **Ejecutar**
   Make only the allowed changes. Keep edits minimal and local to the contract.

4. **Validar**
   Run the contract validations. Include `git diff --check` when files changed unless the contract says otherwise.

5. **Corregir**
   If validation fails, apply the smallest correction that directly addresses the failure.

6. **Commitear**
   If requested, create the smallest commit that contains only the contracted changes.

7. **Repetir Hasta Convergencia**
   Re-check status and diff. Repeat only for contract failures, not for opportunistic improvements.

## Metabolic Restrictions

- Avoid overarchitecture.
- Do not open new fronts.
- Do not propose or implement features not requested.
- Do not touch critical logic outside the contract.
- Do not modify app runtime, database, deployment, package manifests, routes, or components unless explicitly allowed.
- Do not broaden validation beyond what the change justifies.
- Prefer small, auditable changes over generalized abstractions.

## Error Protocol

Use this default protocol unless the user provides a stricter one:

1. If lint, build, tests, or required validation fails, document the exact failing command and relevant error.
2. Attempt the minimum correction.
3. Re-run the failed validation.
4. Try correction at most 2 times for the same failure class.
5. If the failure persists after 2 correction attempts, stop and ask for intervention.
6. If a command is blocked by permissions or sandboxing, request approval only when the command is required by the contract.

## Reusable PRP Template

```text
PRP: <short name>

Objetivo:
<single concrete outcome>

NO TOCAR:
- <forbidden file/layer/system>
- <forbidden behavior>

Si tocar:
- <allowed file/folder/artifact>

Alcance obligatorio:
- <required content/behavior>
- <required preservation rule>

Validaciones:
- git status antes
- <domain-specific validation>
- git diff --check
- <tests/build/lint only if relevant>

Commits:
- <none | one small commit>
- Message: <exact commit message>

Resultado esperado:
- <observable final state>
- <what remains unchanged>

Protocolo de error:
- Document failing command and error
- Correct minimally up to 2 times
- Stop and request intervention if still failing

Stop condition:
- Required scope complete
- Validations complete
- Forbidden surfaces untouched
- Commit created if requested
```

## Example: FutbolWeb 11D

```text
Objetivo:
Make /today the living front page and keep /upcoming as the full calendar.

NO TOCAR:
- Supabase
- scoring
- ranking
- API
- deployment

Si tocar:
- app routing needed for the front page/calendar split
- UI text directly required by the contracted pages

Alcance obligatorio:
- /today becomes the live entry experience
- /upcoming remains the calendar
- no changes to persistence, ranking, scoring, prediction intake, or deployment

Validaciones:
- git status antes
- lint/build only if runtime code changed and the contract requires it
- git diff --check

Resultado esperado:
- Users land on the live match surface
- Calendar remains accessible
- Critical backend surfaces are untouched
```
