import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Radar de Presentes & Futuros — Geopolítica y Prospectiva",
  description: "Plataforma de inteligencia geopolítica, monitorización de portadas globales (Radar de Presentes) y validación de hipótesis prospectivas (Radar de Futuros).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body className="min-h-screen bg-[#090d16] text-slate-100 antialiased selection:bg-sky-500/30 selection:text-sky-200">
        {children}
      </body>
    </html>
  );
}
