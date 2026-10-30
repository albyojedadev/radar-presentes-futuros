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
    { id: "futuros", label: "Radar de Futuros", icon: Compass, badge: "Hipótesis" },
  ] as const;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-[#090d16]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand / Title */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-sky-500/30 bg-sky-500/10 text-sky-400">
            <Radio className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-wider text-slate-100 sm:text-base">
              RADAR GLOBAL <span className="text-sky-400 font-mono text-xs">// PRESENTES & FUTUROS</span>
            </h1>
            <p className="text-[11px] text-slate-400">
              Vigilancia de portadas de 9 bloques & contraste de hipótesis prospectivas
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1.5 overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60 p-1">
          {tabs.map((t) => {
            const Icon = t.icon;
            const activo = vistaActiva === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setVistaActiva(t.id)}
                className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  activo
                    ? "bg-sky-500 text-slate-950 shadow-md font-semibold"
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${activo ? "text-slate-950" : "text-slate-400"}`} />
                <span className="hidden md:inline">{t.label}</span>
                <span className="md:hidden">{t.label.split(" ")[0]}</span>
                <span
                  className={`rounded px-1.5 py-0.5 text-[10px] font-mono ${
                    activo
                      ? "bg-slate-950/20 text-slate-950"
                      : "bg-slate-800 text-slate-400"
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
