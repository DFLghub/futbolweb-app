"use client";

import { FormEvent, useState } from "react";
import { useI18n } from "@/components/I18nProvider";

type OracleMessage = {
  id: string;
  role: "oracle" | "user";
  text: string;
};

export default function OracleAskBox() {
  const { dict, locale } = useI18n();
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<OracleMessage[]>([
    {
      id: "welcome",
      role: "oracle",
      text: dict.today.oracleAskWelcome,
    },
  ]);

  async function askOracle(nextQuestion: string) {
    const trimmedQuestion = nextQuestion.trim();

    if (!trimmedQuestion || isLoading) {
      return;
    }

    const userMessage: OracleMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: trimmedQuestion,
    };

    setMessages((currentMessages) => [...currentMessages, userMessage]);
    setQuestion("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/oracle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          locale,
          question: trimmedQuestion,
        }),
      });

      if (!response.ok) {
        throw new Error("Oracle request failed.");
      }

      const payload = await response.json() as { answer?: string };
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: `oracle-${Date.now()}`,
          role: "oracle",
          text: payload.answer ?? dict.today.oracleAskError,
        },
      ]);
    } catch {
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: `oracle-error-${Date.now()}`,
          role: "oracle",
          text: dict.today.oracleAskError,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void askOracle(question);
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
          <div className="grid max-h-72 gap-3 overflow-y-auto rounded-lg border border-slate-200 bg-slate-50 p-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={message.role === "user" ? "ml-7 rounded-lg bg-slate-950 p-3 text-white" : "mr-7 rounded-lg border border-sky-200 bg-white p-3 text-slate-800"}
              >
                <p className={message.role === "user" ? "text-[0.68rem] font-black uppercase tracking-[0.12em] text-sky-100" : "text-[0.68rem] font-black uppercase tracking-[0.12em] text-sky-700"}>
                  {message.role === "user" ? dict.today.oracleAskUserLabel : dict.today.oracleAskOracleLabel}
                </p>
                <p className="mt-1 whitespace-pre-line text-sm font-semibold leading-6">
                  {message.text}
                </p>
              </div>
            ))}
            {isLoading ? (
              <div className="mr-7 rounded-lg border border-sky-200 bg-white p-3 text-slate-800">
                <p className="text-[0.68rem] font-black uppercase tracking-[0.12em] text-sky-700">
                  {dict.today.oracleAskOracleLabel}
                </p>
                <p className="mt-1 text-sm font-semibold leading-6">
                  {dict.today.oracleAskThinking}
                </p>
              </div>
            ) : null}
          </div>

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
              disabled={isLoading}
              type="search"
              value={question}
            />
            <button
              className="min-h-11 rounded-md bg-slate-950 px-4 py-2 text-sm font-black text-white shadow-sm transition hover:bg-slate-800"
              disabled={isLoading}
              type="submit"
            >
              {dict.today.oracleAskButton}
            </button>
          </form>

          <div className="grid gap-2 sm:grid-cols-2">
            {dict.today.oracleAskSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-left text-xs font-bold leading-5 text-slate-700 transition hover:border-sky-300 hover:bg-sky-50 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isLoading}
                onClick={() => void askOracle(suggestion)}
                type="button"
              >
                {suggestion}
              </button>
            ))}
          </div>

          <p className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold leading-5 text-slate-600">
            {dict.today.oracleAskContactText}{" "}
            <a className="font-black text-sky-700 hover:text-sky-900" href="mailto:jorge@deepfeelingslabs.com">
              {dict.today.oracleAskContactCta}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
