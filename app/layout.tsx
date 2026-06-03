import type { Metadata, Viewport } from "next";
import { I18nProvider } from "@/components/I18nProvider";
import InstallFutbolWebPrompt from "@/components/InstallFutbolWebPrompt";
import { getCurrentDictionary, getCurrentLocale } from "@/lib/i18n-server";
import "./globals.css";

const appName = "FutbolWeb";
const themeColor = "#07111f";

export const viewport: Viewport = {
  themeColor,
};

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getCurrentDictionary();

  return {
    title: dict.metadata.title,
    description: dict.metadata.description,
    applicationName: appName,
    manifest: "/manifest.webmanifest",
    appleWebApp: {
      capable: true,
      title: appName,
      statusBarStyle: "black-translucent",
    },
    icons: {
      icon: [
        {
          url: "/icon-192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          url: "/icon-512.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
      apple: {
        url: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    },
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
          <InstallFutbolWebPrompt />
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
