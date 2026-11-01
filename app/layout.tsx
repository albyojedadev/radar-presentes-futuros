import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Radar de Presentes & Futuros — Geopolítica y Prospectiva",
  description: "Plataforma de inteligencia geopolítica, monitorización de portadas globales (Radar de Presentes) y validación de hipótesis prospectivas (Radar de Futuros).",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-page text-body antialiased selection:bg-alby-green/30 selection:text-title">
        {children}
      </body>
    </html>
  );
}
