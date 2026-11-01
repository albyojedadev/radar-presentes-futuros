"use client";

import React, { useState, useEffect } from "react";
import { Globe, Calendar, FileText, Compass, Radio, Sun, Moon } from "lucide-react";

interface HeaderProps {
  vistaActiva: "presentes" | "hemeroteca" | "anuarios" | "futuros";
  setVistaActiva: (vista: "presentes" | "hemeroteca" | "anuarios" | "futuros") => void;
  totalSemanas: number;
}

export function Header({ vistaActiva, setVistaActiva, totalSemanas }: HeaderProps) {
  // Por requerimiento del usuario, la versión diurna es la ESTÁNDAR por defecto
  const [isDark, setIsDark] = useState<boolean>(false);

  useEffect(() => {
    // Mantener la versión diurna como estándar por defecto
    const savedTheme = localStorage.getItem("radar_theme");
    if (savedTheme === "dark") {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("radar_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("radar_theme", "light");
    }
  };

  const tabs = [
    { id: "presentes", label: "Radar de Presentes", shortLabel: "Presentes", icon: Globe, badge: "EN VIVO" },
    { id: "hemeroteca", label: "Hemeroteca Semanal", shortLabel: "Hemeroteca", icon: Calendar, badge: `${totalSemanas} sem` },
    { id: "anuarios", label: "Anuarios Estratégicos", shortLabel: "Anuarios", icon: FileText, badge: "7 años" },
    { id: "futuros", label: "Radar de Futuros", shortLabel: "Futuros", icon: Compass, badge: "22 tesis" },
  ] as const;

  return (
    <header className="sticky top-0 z-50 border-b border-borderSubtle bg-page/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-col lg:flex-row lg:items-center justify-between gap-3 px-3.5 py-2.5 sm:px-6 sm:py-3.5">
        {/* Brand Alby Ojeda Style + Toggle Móvil */}
        <div className="flex items-center justify-between gap-3 w-full lg:w-auto">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl border border-alby-terr/30 bg-alby-terrBg text-alby-terr shadow-sm">
              <Radio className="h-4 w-4 sm:h-5 sm:w-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h1 className="text-sm font-bold tracking-tight text-title sm:text-lg">
                  RADAR GLOBAL
                </h1>
                <span className="rounded bg-alby-terrBg px-1.5 py-0.2 sm:px-2 sm:py-0.5 text-[9px] sm:text-[10px] font-mono font-semibold text-alby-terr border border-alby-terrBorder">
                  PRESENTES & FUTUROS
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-muted line-clamp-1">
                Vigilancia de portadas de 9 bloques & contraste prospectivo
              </p>
            </div>
          </div>

          {/* Toggle Diurno/Nocturno visible en cabecera móvil */}
          <button
            onClick={toggleTheme}
            className="flex lg:hidden h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl border border-borderSubtle bg-panel text-muted hover:text-title hover:bg-subtle transition-all"
            title={isDark ? "Cambiar a Versión Diurna (Estándar)" : "Cambiar a Versión Nocturna"}
          >
            {isDark ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-[#4a443b]" />
            )}
          </button>
        </div>

        {/* Navigation Tabs + Toggle Escritorio */}
        <div className="flex items-center gap-2 w-full lg:w-auto">
          <nav className="flex items-center gap-1 overflow-x-auto scrollbar-none rounded-xl border border-borderSubtle bg-subtle p-1 shadow-sm w-full lg:w-auto">
            {tabs.map((t) => {
              const Icon = t.icon;
              const activo = vistaActiva === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setVistaActiva(t.id)}
                  className={`flex-1 lg:flex-none flex items-center justify-center lg:justify-start gap-1.5 sm:gap-2 rounded-lg px-2 sm:px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-all ${
                    activo
                      ? "bg-alby-green text-[#fbfaf7] shadow-sm font-bold"
                      : "text-body hover:bg-subtleHover hover:text-title"
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 shrink-0 ${activo ? "text-[#fbfaf7]" : "text-alby-green"}`} />
                  <span className="hidden xl:inline font-sans">{t.label}</span>
                  <span className="xl:hidden font-sans">{t.shortLabel}</span>
                  <span
                    className={`rounded px-1.5 py-0.2 text-[9px] sm:text-[10px] font-mono font-semibold shrink-0 ${
                      activo
                        ? "bg-black/20 text-[#fbfaf7]"
                        : "bg-panel text-muted border border-borderSubtle"
                    }`}
                  >
                    {t.badge}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Toggle de Modo Diurno / Nocturno (Solo Escritorio) */}
          <button
            onClick={toggleTheme}
            className="hidden lg:flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-borderSubtle bg-panel text-muted hover:text-title hover:bg-subtle transition-all"
            title={isDark ? "Cambiar a Versión Diurna (Estándar)" : "Cambiar a Versión Nocturna"}
          >
            {isDark ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-[#4a443b]" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
