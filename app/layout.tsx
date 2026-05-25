import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Oráculo Futbolero",
  description: "Modo Mundial para pronósticos sociales, ranking y comunidad en WhatsApp.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
