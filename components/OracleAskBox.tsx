"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useI18n } from "@/components/I18nProvider";

type OracleMessage = {
  characterName?: string;
  id: string;
  role: "oracle" | "user";
  text: string;
};

type OracleCharacterId = "paulgpt" | "vargpt" | "insultistagpt";

export default function OracleAskBox() {
  const { dict, locale } = useI18n();
  const [activeCharacter, setActiveCharacter] = useState<OracleCharacterId>("paulgpt");
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const isRequestInFlightRef = useRef(false);
  const messageIdRef = useRef(0);
  const messagesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [messages, setMessages] = useState<OracleMessage[]>([
    {
      id: "welcome",
      characterName: "PaulGPT",
      role: "oracle",
      text: dict.today.oracleAskWelcome,
    },
  ]);

  const activeCharacterProfile = dict.today.oracleCastCharacters.find(([id]) => {
    return id === activeCharacter;
  }) ?? dict.today.oracleCastCharacters[0];
  const activeCharacterName = activeCharacterProfile?.[1] ?? "PaulGPT";

  function createMessageId(role: OracleMessage["role"]) {
    messageIdRef.current += 1;
    return `${role}-${messageIdRef.current}`;
  }

  useEffect(() => {
    const messageList = messagesRef.current;
    if (!messageList) return;

    messageList.scrollTop = messageList.scrollHeight;
  }, [isLoading, messages]);

  async function askOracle(nextQuestion: string) {
    const trimmedQuestion = nextQuestion.trim();

    if (!trimmedQuestion || isRequestInFlightRef.current) {
      return;
    }

    isRequestInFlightRef.current = true;

    const userMessage: OracleMessage = {
      id: createMessageId("user"),
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
          character: activeCharacter,
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
          characterName: activeCharacterName,
          id: createMessageId("oracle"),
          role: "oracle",
          text: payload.answer ?? dict.today.oracleAskError,
        },
      ]);
    } catch {
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          characterName: activeCharacterName,
          id: createMessageId("oracle"),
          role: "oracle",
          text: dict.today.oracleAskError,
        },
      ]);
    } finally {
      isRequestInFlightRef.current = false;
      setIsLoading(false);
      inputRef.current?.focus();
    }
  }

  function selectCharacter(characterId: string, characterName: string) {
    if (characterId !== "paulgpt" && characterId !== "vargpt" && characterId !== "insultistagpt") {
      return;
    }

    setActiveCharacter(characterId);
    setMessages([
      {
        characterName,
        id: `welcome-${characterId}`,
        role: "oracle",
        text: dict.today.oracleAskWelcome,
      },
    ]);
    inputRef.current?.focus();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const submittedQuestion = formData.get("question");

    void askOracle(typeof submittedQuestion === "string" ? submittedQuestion : question);
  }

  return (
    <section
      id="tribuna"
      className="mt-5 overflow-hidden rounded-2xl border border-sky-200 bg-white shadow-sm shadow-slate-200/70"
    >
      <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="bg-slate-950 p-5 text-white md:p-6">
          <p className="inline-flex rounded-full border border-sky-300/20 bg-sky-300/10 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-sky-100">
            {dict.today.oracleCastEyebrow}
          </p>
          <h3 className="mt-4 text-xl font-black leading-tight text-white md:text-3xl">
            {dict.today.oracleCastTitle}
          </h3>
          <p className="mt-3 break-words text-sm font-semibold leading-6 text-slate-200">
            {dict.today.oracleCastText}
          </p>

          <div className="mt-5 grid gap-2">
            {dict.today.oracleCastCharacters.map(([id, name, role, example]) => {
              const isActive = id === activeCharacter;

              return (
              <article
                key={name}
                className={isActive ? "rounded-lg border border-emerald-300/60 bg-white/[0.09] p-3 shadow-sm shadow-emerald-950/20" : "rounded-lg border border-white/10 bg-white/[0.06] p-3"}
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
                  <div className="min-w-0">
                    <p className="text-base font-black leading-tight text-white">{name}</p>
                    <p className="mt-1 text-[0.68rem] font-black uppercase tracking-[0.12em] text-sky-100">
                      {role}
                    </p>
                  </div>
                  <span className={isActive ? "w-fit rounded-full bg-emerald-300 px-2 py-0.5 text-[0.62rem] font-black uppercase text-emerald-950" : "w-fit rounded-full border border-white/15 px-2 py-0.5 text-[0.62rem] font-black uppercase text-slate-300"}>
                    {isActive ? dict.today.oracleCastActiveAction : dict.today.oracleCastPrimaryAction}
                  </span>
                </div>
                <p className="mt-3 text-xs font-semibold leading-5 text-slate-200">
                  {example}
                </p>
                <button
                  className={isActive ? "mt-3 inline-flex min-h-9 w-full items-center justify-center rounded-md bg-white px-3 py-2 text-xs font-black text-slate-950 transition hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-60" : "mt-3 inline-flex min-h-9 w-full items-center justify-center rounded-md border border-white/15 bg-transparent px-3 py-2 text-xs font-black text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"}
                  disabled={isLoading}
                  onClick={() => {
                    if (!isActive) {
                      selectCharacter(id, name);
                      return;
                    }

                    void askOracle(example);
                  }}
                  type="button"
                >
                  {isActive ? dict.today.oracleAskButton : dict.today.oracleCastPrimaryAction}
                </button>
              </article>
              );
            })}
          </div>
        </div>

        <div className="grid min-w-0 gap-4 p-4 md:p-5">
          <div>
            <p className="text-[0.68rem] font-black uppercase tracking-[0.14em] text-sky-700">
              {dict.today.oracleAskLabel}
            </p>
            <h4 className="mt-1 text-xl font-black leading-tight text-slate-950">
              {dict.today.oracleAskTitle}
            </h4>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
              {dict.today.oracleAskText}
            </p>
          </div>

          <div
            ref={messagesRef}
            className="grid max-h-72 gap-3 overflow-y-auto rounded-lg border border-slate-200 bg-slate-50 p-3"
            aria-live="polite"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={message.role === "user" ? "ml-7 rounded-lg bg-slate-950 p-3 text-white" : "mr-7 rounded-lg border border-sky-200 bg-white p-3 text-slate-800"}
              >
                <p className={message.role === "user" ? "text-[0.68rem] font-black uppercase tracking-[0.12em] text-sky-100" : "text-[0.68rem] font-black uppercase tracking-[0.12em] text-sky-700"}>
                  {message.role === "user" ? dict.today.oracleAskUserLabel : (message.characterName ?? activeCharacterName)}
                </p>
                <p className="mt-1 whitespace-pre-line text-sm font-semibold leading-6">
                  {message.text}
                </p>
              </div>
            ))}
            {isLoading ? (
              <div className="mr-7 rounded-lg border border-sky-200 bg-white p-3 text-slate-800">
                <p className="text-[0.68rem] font-black uppercase tracking-[0.12em] text-sky-700">
                  {activeCharacterName}
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
              ref={inputRef}
              className="min-h-11 rounded-md border border-sky-200 bg-white px-3 py-2 text-sm font-semibold text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              autoComplete="off"
              name="question"
              onChange={(event) => setQuestion(event.target.value)}
              placeholder={dict.today.oracleAskPlaceholder}
              type="text"
              value={question}
            />
            <button
              className="min-h-11 rounded-md bg-slate-950 px-4 py-2 text-sm font-black text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
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
