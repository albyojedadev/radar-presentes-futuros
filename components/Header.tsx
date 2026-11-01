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
    { id: "presentes", label: "Radar de Presentes", icon: Globe, badge: "EN VIVO" },
    { id: "hemeroteca", label: "Hemeroteca Semanal", icon: Calendar, badge: `${totalSemanas} sem` },
    { id: "anuarios", label: "Anuarios Estratégicos", icon: FileText, badge: "7 años" },
    { id: "futuros", label: "Radar de Futuros", icon: Compass, badge: "22 tesis" },
  ] as const;

  return (
    <header className="sticky top-0 z-50 border-b border-borderSubtle bg-page/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6">
        {/* Brand Alby Ojeda Style */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-alby-terr/30 bg-alby-terrBg text-alby-terr shadow-sm">
            <Radio className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold tracking-tight text-title sm:text-lg">
                RADAR GLOBAL
              </h1>
              <span className="rounded bg-alby-terrBg px-2 py-0.5 text-[10px] font-mono font-semibold text-alby-terr border border-alby-terrBorder">
                PRESENTES & FUTUROS
              </span>
            </div>
            <p className="text-xs text-muted">
              Vigilancia de portadas de 9 bloques & contraste de hipótesis prospectivas
            </p>
          </div>
        </div>

        {/* Navigation Tabs + Theme Toggle */}
        <div className="flex items-center gap-2">
          <nav className="flex items-center gap-1 overflow-x-auto rounded-xl border border-borderSubtle bg-subtle p-1 shadow-sm">
            {tabs.map((t) => {
              const Icon = t.icon;
              const activo = vistaActiva === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setVistaActiva(t.id)}
                  className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                    activo
                      ? "bg-alby-green text-[#fbfaf7] shadow-sm font-bold"
                      : "text-body hover:bg-subtleHover hover:text-title"
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${activo ? "text-[#fbfaf7]" : "text-alby-green"}`} />
                  <span className="hidden md:inline font-sans">{t.label}</span>
                  <span className="md:hidden font-sans">{t.label.split(" ")[0]}</span>
                  <span
                    className={`rounded px-1.5 py-0.2 text-[10px] font-mono font-semibold ${
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

          {/* Toggle de Modo Diurno / Nocturno */}
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-borderSubtle bg-panel text-muted hover:text-title hover:bg-subtle transition-all"
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
