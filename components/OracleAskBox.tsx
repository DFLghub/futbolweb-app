"use client";

import { FormEvent, useState } from "react";
import { useI18n } from "@/components/I18nProvider";

const oracleUrl = "https://chatgpt.com/g/g-6a259750fefc8191af804deb256e9616-paulgpt";

function buildOracleUrl(question: string) {
  const trimmedQuestion = question.trim();

  if (!trimmedQuestion) {
    return oracleUrl;
  }

  const url = new URL(oracleUrl);
  url.searchParams.set("q", trimmedQuestion);
  return url.toString();
}

export default function OracleAskBox() {
  const { dict } = useI18n();
  const [question, setQuestion] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    window.open(buildOracleUrl(question), "_blank", "noopener,noreferrer");
  }

  return (
    <section
      id="tribuna"
      className="mt-5 overflow-hidden rounded-2xl border border-sky-200 bg-white shadow-sm shadow-slate-200/70"
    >
      <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="bg-slate-950 p-5 text-white md:p-6">
          <p className="inline-flex rounded-full border border-sky-300/20 bg-sky-300/10 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-sky-100">
            {dict.today.oracleAskLabel}
          </p>
          <h3 className="mt-4 text-2xl font-black leading-tight text-white md:text-3xl">
            {dict.today.oracleAskTitle}
          </h3>
          <p className="mt-3 text-sm font-semibold leading-6 text-slate-200 md:text-base">
            {dict.today.oracleAskText}
          </p>
          <p className="mt-4 text-xs font-bold leading-5 text-sky-100 md:text-sm">
            {dict.today.oracleAskHint}
          </p>
        </div>

        <div className="grid gap-4 p-4 md:p-5">
          <form
            className="grid gap-2 rounded-lg border border-sky-200 bg-sky-50 p-3 md:grid-cols-[minmax(0,1fr)_auto] md:p-4"
            onSubmit={handleSubmit}
          >
            <label className="sr-only" htmlFor="oracle-question">
              {dict.today.oracleAskLabel}
            </label>
            <input
              id="oracle-question"
              className="min-h-11 rounded-md border border-sky-200 bg-white px-3 py-2 text-sm font-semibold text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              onChange={(event) => setQuestion(event.target.value)}
              placeholder={dict.today.oracleAskPlaceholder}
              type="search"
              value={question}
            />
            <button
              className="min-h-11 rounded-md bg-slate-950 px-4 py-2 text-sm font-black text-white shadow-sm transition hover:bg-slate-800"
              type="submit"
            >
              {dict.today.oracleAskButton}
            </button>
          </form>

          <div className="grid gap-2 sm:grid-cols-2">
            {dict.today.oracleAskSuggestions.map((suggestion) => (
              <a
                key={suggestion}
                className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-left text-xs font-bold leading-5 text-slate-700 transition hover:border-sky-300 hover:bg-sky-50 hover:text-slate-950"
                href={buildOracleUrl(suggestion)}
                rel="noopener noreferrer"
                target="_blank"
              >
                {suggestion}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
