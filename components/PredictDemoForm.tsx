"use client";

import { FormEvent, useMemo, useState } from "react";

type SavedPrediction = {
  id: string;
  match_slug: string;
  alias: string;
  favorite_team: string | null;
  score_a: number;
  score_b: number;
  comment: string | null;
  group_code: string | null;
  created_at: string;
};

type PredictDemoFormProps = {
  matchSlug: string;
  matchLabel: string;
};

const initialForm = {
  alias: "",
  favoriteTeam: "",
  scoreA: "",
  scoreB: "",
  comment: "",
  groupCode: "",
};

function createClientSubmissionId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function PredictDemoForm({ matchSlug, matchLabel }: PredictDemoFormProps) {
  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [copyMessage, setCopyMessage] = useState("");
  const [savedPrediction, setSavedPrediction] = useState<SavedPrediction | null>(null);
  const clientSubmissionId = useMemo(() => createClientSubmissionId(), []);

  function updateField(field: keyof typeof initialForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrorMessage("");
    setCopyMessage("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");
    setCopyMessage("");

    const scoreA = Number(form.scoreA);
    const scoreB = Number(form.scoreB);

    try {
      const response = await fetch("/api/predictions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          match_slug: matchSlug,
          alias: form.alias,
          favorite_team: form.favoriteTeam,
          score_a: scoreA,
          score_b: scoreB,
          comment: form.comment,
          group_code: form.groupCode,
          client_submission_id: clientSubmissionId,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        setErrorMessage(
          typeof result.message === "string"
            ? result.message
            : "No pudimos guardar el pronóstico. Revisa los datos e intenta otra vez.",
        );
        return;
      }

      setSavedPrediction(result.prediction);
    } catch {
      setErrorMessage("No pudimos conectar con el servidor. Intenta otra vez.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function copyForWhatsApp() {
    const prediction = savedPrediction;

    if (!prediction) {
      return;
    }

    const text = [
      "🐯 Pronóstico FutbolWeb.app",
      `Partido: ${matchLabel}`,
      `Jugador: ${prediction.alias}`,
      `Equipo favorito: ${prediction.favorite_team || "Sin equipo declarado"}`,
      `Marcador: ${prediction.score_a} - ${prediction.score_b}`,
      `Boconeo: ${prediction.comment || "Sin boconeo"}`,
      `Grupo: ${prediction.group_code || "Sin grupo"}`,
      "Modo Mundial v0.1",
      "https://www.futbolweb.app",
    ].join("\n");

    try {
      await navigator.clipboard.writeText(text);
      setCopyMessage("Pronóstico copiado para WhatsApp.");
    } catch {
      setCopyMessage("No pudimos copiarlo automáticamente. Selecciona el texto e intenta copiarlo.");
    }
  }

  return (
    <section className="rounded-lg border border-white/10 bg-white/[0.06] p-4 shadow-xl shadow-black/10 sm:p-6">
      <form className="grid gap-4" onSubmit={handleSubmit}>
        <div>
          <label className="text-sm font-bold text-slate-100" htmlFor="alias">
            Alias o nombre
          </label>
          <input
            className="mt-2 min-h-11 w-full rounded-md border border-white/10 bg-slate-950/60 px-3 py-2 text-base text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-200/60"
            id="alias"
            maxLength={40}
            name="alias"
            onChange={(event) => updateField("alias", event.target.value)}
            required
            value={form.alias}
          />
        </div>

        <div>
          <label className="text-sm font-bold text-slate-100" htmlFor="favoriteTeam">
            Equipo favorito / selección que apoyas
          </label>
          <input
            className="mt-2 min-h-11 w-full rounded-md border border-white/10 bg-slate-950/60 px-3 py-2 text-base text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-200/60"
            id="favoriteTeam"
            maxLength={60}
            name="favoriteTeam"
            onChange={(event) => updateField("favoriteTeam", event.target.value)}
            value={form.favoriteTeam}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-bold text-slate-100" htmlFor="scoreA">
              Marcador equipo A
            </label>
            <input
              className="mt-2 min-h-11 w-full rounded-md border border-white/10 bg-slate-950/60 px-3 py-2 text-base text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-200/60"
              id="scoreA"
              inputMode="numeric"
              max={20}
              min={0}
              name="scoreA"
              onChange={(event) => updateField("scoreA", event.target.value)}
              required
              type="number"
              value={form.scoreA}
            />
          </div>

          <div>
            <label className="text-sm font-bold text-slate-100" htmlFor="scoreB">
              Marcador equipo B
            </label>
            <input
              className="mt-2 min-h-11 w-full rounded-md border border-white/10 bg-slate-950/60 px-3 py-2 text-base text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-200/60"
              id="scoreB"
              inputMode="numeric"
              max={20}
              min={0}
              name="scoreB"
              onChange={(event) => updateField("scoreB", event.target.value)}
              required
              type="number"
              value={form.scoreB}
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-bold text-slate-100" htmlFor="comment">
            Comentario opcional / boconeo
          </label>
          <textarea
            className="mt-2 min-h-24 w-full resize-y rounded-md border border-white/10 bg-slate-950/60 px-3 py-2 text-base text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-200/60"
            id="comment"
            maxLength={160}
            name="comment"
            onChange={(event) => updateField("comment", event.target.value)}
            value={form.comment}
          />
        </div>

        <div>
          <label className="text-sm font-bold text-slate-100" htmlFor="groupCode">
            Código de grupo opcional
          </label>
          <input
            className="mt-2 min-h-11 w-full rounded-md border border-white/10 bg-slate-950/60 px-3 py-2 text-base text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-200/60"
            id="groupCode"
            maxLength={40}
            name="groupCode"
            onChange={(event) => updateField("groupCode", event.target.value)}
            value={form.groupCode}
          />
        </div>

        {errorMessage ? (
          <p className="rounded-md border border-red-300/20 bg-red-500/10 px-3 py-2 text-sm font-semibold text-red-100">
            {errorMessage}
          </p>
        ) : null}

        <button
          className="min-h-11 rounded-md bg-cyan-300 px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? "Guardando pronóstico..." : "Enviar pronóstico"}
        </button>
      </form>

      {savedPrediction ? (
        <div className="mt-5 rounded-md border border-emerald-200/20 bg-emerald-300/10 p-4">
          <p className="text-sm font-bold text-emerald-100">
            Pronóstico recibido. Quedó guardado en modo beta y pendiente de revisión.
          </p>
          <button
            className="mt-4 min-h-11 w-full rounded-md border border-white/15 bg-white/10 px-4 py-3 text-sm font-black text-white transition hover:bg-white/15"
            onClick={copyForWhatsApp}
            type="button"
          >
            Copiar pronóstico para WhatsApp
          </button>
          {copyMessage ? (
            <p className="mt-3 text-sm font-semibold text-cyan-100">{copyMessage}</p>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
