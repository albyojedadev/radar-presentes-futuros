"use client";

import React from "react";
import { Globe, Calendar, FileText, Compass, Radio } from "lucide-react";

interface HeaderProps {
  vistaActiva: "presentes" | "hemeroteca" | "anuarios" | "futuros";
  setVistaActiva: (vista: "presentes" | "hemeroteca" | "anuarios" | "futuros") => void;
  totalSemanas: number;
}

export function Header({ vistaActiva, setVistaActiva, totalSemanas }: HeaderProps) {
  const tabs = [
    { id: "presentes", label: "Radar de Presentes", icon: Globe, badge: "EN VIVO" },
    { id: "hemeroteca", label: "Hemeroteca Semanal", icon: Calendar, badge: `${totalSemanas} sem` },
    { id: "anuarios", label: "Anuarios Estratégicos", icon: FileText, badge: "7 años" },
    { id: "futuros", label: "Radar de Futuros", icon: Compass, badge: "22 tesis" },
  ] as const;

  return (
    <header className="sticky top-0 z-50 border-b border-cardBorder bg-ink/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6">
        {/* Brand Alby Ojeda Style */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-alby-terr/40 bg-alby-terr/10 text-alby-terr shadow-sm">
            <Radio className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold tracking-tight text-alby-light sm:text-lg">
                RADAR GLOBAL
              </h1>
              <span className="rounded bg-alby-terr/20 px-1.5 py-0.5 text-[10px] font-mono font-semibold text-alby-terr border border-alby-terr/30">
                PRESENTES & FUTUROS
              </span>
            </div>
            <p className="text-xs text-alby-pale">
              Vigilancia de portadas de 9 bloques & contraste de hipótesis prospectivas
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1.5 overflow-x-auto rounded-xl border border-cardBorder bg-dark/80 p-1.5 shadow-inner">
          {tabs.map((t) => {
            const Icon = t.icon;
            const activo = vistaActiva === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setVistaActiva(t.id)}
                className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  activo
                    ? "bg-alby-green text-ink shadow-md font-bold"
                    : "text-alby-cream hover:bg-cardHover hover:text-alby-light"
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${activo ? "text-ink" : "text-alby-green"}`} />
                <span className="hidden md:inline font-sans">{t.label}</span>
                <span className="md:hidden font-sans">{t.label.split(" ")[0]}</span>
                <span
                  className={`rounded px-1.5 py-0.5 text-[10px] font-mono font-semibold ${
                    activo
                      ? "bg-ink/25 text-ink"
                      : "bg-card text-alby-muted"
                  }`}
                >
                  {t.badge}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
