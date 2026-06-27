# Apps Factory Master Instructions

## 1. Identidad del repo

FutbolWeb / Oraculo Futbolero es un producto operativo.

FutbolWeb tambien es la semilla y caso de estudio 001 de Apps Factory. El trabajo futuro debe proteger ambas funciones: mantener el producto estable y extraer aprendizaje reutilizable para la fabrica.

## 2. Regla de oro

Mas vale una fabrica que una app.

No crear features sin contrato de ejecucion.

## 3. Metodo obligatorio

Usar Contract-Driven Agentic Execution para cambios no triviales.

Antes de ejecutar cambios no triviales, consultar:

```text
.claude/skills/contract-driven-agentic-execution/SKILL.md
```

## 4. Fronteras

No tocar Supabase, scoring, ranking, prediction API, deployment config o environment variables sin autorizacion explicita.

Mantener separacion entre el runtime de FutbolWeb y los artefactos de fabrica. No mezclar cambios runtime con documentacion o factory artifacts salvo autorizacion explicita.

## 5. PRP minimo

Todo cambio debe definir:

- Objetivo
- NO TOCAR
- Si tocar
- Alcance obligatorio
- Validaciones
- Resultado esperado
- Protocolo de error
- Stop condition

## 6. Validaciones estandar

Antes y despues de trabajar, validar el estado del repo y ejecutar solo lo que corresponda al alcance:

- `git status` antes
- `git diff --check`
- `npm run lint` si se toca codigo
- `npm run build` si se toca runtime
- `git status` final limpio

## 7. Politica de commits

Usar commits pequenos, con nombres claros.

Evitar commit spam.

No mezclar runtime con documentacion o factory artifacts salvo autorizacion explicita.

## 8. Politica de extraccion de patrones

Despues de cada ciclo exitoso, evaluar:

- Nacio un patron reutilizable?
- Debe documentarse?
- Debe convertirse en skill?
- Debe ir a `.claude/memory/project/` en el futuro?

## 9. Relacion con SaaS Factory

Este repo puede aprender de SaaS Factory.

No copiar patrones ciegamente.

Extraer, auditar, aumentar e integrar.

## 10. Stop behavior

Si el usuario pide detenerse, detenerse.

Si el agente propone algo fuera de alcance, pedir autorizacion.

Si hay ambiguedad critica, preguntar antes de modificar.

## 11. Bootstrap DFL — obligatorio en toda sesion

Este repo opera bajo el ecosistema DFL/amOS. Al iniciar cualquier sesion:

1. El hook SessionStart inyecta el contexto `@$go` automaticamente desde `context.deepfeelingslabs.com/go`.
2. Si el hook no aparece: `curl -s https://context.deepfeelingslabs.com/go` y procesar el payload completo.
3. `mem_search("contexto DFL")` via Engram MCP para observaciones adicionales.
4. `PROXIMO_AGENTE_DEBE` en cada observacion de `recent_decisions` = instruccion de accion inmediata.

**Despues de recibir el payload de /go: operar directamente.**
Prohibido solicitar MASTER_INDEX, MASTER_BITACORA o archivos adicionales de /opt/dfl-knowledge/ antes de haber procesado el payload. El payload contiene suficiente contexto para arrancar.

Distincion critica: `@$go` es el comando del agente. `/go` es la ruta HTTP. No son lo mismo.

Protocolo de Precedencia activo: **A > B > C > D > E** (Engram = capa D — nunca invalida A ni B).

No inventar contexto DFL — consultarlo. No modificar sin PRP: puntajeTigreKnockout, Supabase, Vercel config, scoring.

@/opt/dfl-knowledge/DFL_Agent_Onboarding_Config.md
