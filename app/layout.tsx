import type { Metadata } from "next";
import { I18nProvider } from "@/components/I18nProvider";
import { getCurrentDictionary, getCurrentLocale } from "@/lib/i18n-server";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getCurrentDictionary();

  return {
    title: dict.metadata.title,
    description: dict.metadata.description,
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <RootLayoutContent>{children}</RootLayoutContent>;
}

async function RootLayoutContent({ children }: { children: React.ReactNode }) {
  const locale = await getCurrentLocale();
  const dict = await getCurrentDictionary();

  return (
    <html lang={locale} className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <I18nProvider dict={dict} locale={locale}>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
