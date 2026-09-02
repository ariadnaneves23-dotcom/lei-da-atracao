import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lei da Atração - Estado de Ser",
  description: "Agente especializado em Lei da Atração e Estado de Ser",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
