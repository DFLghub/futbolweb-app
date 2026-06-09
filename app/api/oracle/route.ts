import { NextResponse } from "next/server";
import { isLocale, normalizeLocale } from "@/lib/i18n";
import { answerOracleQuestion } from "@/lib/oracle";

type OracleRequest = {
  locale?: string;
  question?: string;
};

export async function POST(request: Request) {
  let body: OracleRequest;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ answer: answerOracleQuestion("", "es") }, { status: 400 });
  }

  const locale = isLocale(body.locale) ? body.locale : normalizeLocale(undefined);
  const question = typeof body.question === "string" ? body.question : "";

  return NextResponse.json({
    answer: answerOracleQuestion(question, locale),
  });
}
