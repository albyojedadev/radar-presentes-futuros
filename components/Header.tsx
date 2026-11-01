"use client";

import React, { useState, useEffect } from "react";
import { Globe, Calendar, FileText, Compass, Radio, Sun, Moon, Menu, X } from "lucide-react";

interface HeaderProps {
  vistaActiva: "presentes" | "hemeroteca" | "anuarios" | "futuros";
  setVistaActiva: (vista: "presentes" | "hemeroteca" | "anuarios" | "futuros") => void;
  totalSemanas: number;
}

export function Header({ vistaActiva, setVistaActiva, totalSemanas }: HeaderProps) {
  // Por requerimiento del usuario, la versión diurna es la ESTÁNDAR por defecto
  const [isDark, setIsDark] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

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
    {
      id: "presentes",
      label: "Radar de Presentes",
      desc: "Snapshot en vivo e ingesta de portadas de 9 bloques",
      icon: Globe,
      badge: "EN VIVO",
    },
    {
      id: "hemeroteca",
      label: "Hemeroteca Semanal",
      desc: "Auditoría histórica semana a semana (2020 a 2026)",
      icon: Calendar,
      badge: `${totalSemanas} sem`,
    },
    {
      id: "anuarios",
      label: "Anuarios Estratégicos",
      desc: "Auditorías anuales retrospectivas y crónica en 4 estaciones",
      icon: FileText,
      badge: "7 años",
    },
    {
      id: "futuros",
      label: "Radar de Futuros",
      desc: "22 hipótesis prospectivas contrastadas con señales empíricas",
      icon: Compass,
      badge: "22 tesis",
    },
  ] as const;

  const seleccionarVista = (id: "presentes" | "hemeroteca" | "anuarios" | "futuros") => {
    setVistaActiva(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-borderSubtle bg-page/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-3.5 py-2.5 sm:px-6 sm:py-3.5">
        {/* Brand Alby Ojeda Style */}
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
            <p className="text-[11px] sm:text-xs text-muted hidden sm:block">
              Vigilancia de portadas de 9 bloques & contraste prospectivo
            </p>
          </div>
        </div>

        {/* ================================================================
            CONTROLES DE ESCRITORIO (>= lg)
            ================================================================ */}
        <div className="hidden lg:flex items-center gap-2">
          <nav className="flex items-center gap-1 rounded-xl border border-borderSubtle bg-subtle p-1 shadow-sm">
            {tabs.map((t) => {
              const Icon = t.icon;
              const activo = vistaActiva === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => seleccionarVista(t.id)}
                  className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-all ${
                    activo
                      ? "bg-alby-green text-[#fbfaf7] shadow-sm font-bold"
                      : "text-body hover:bg-subtleHover hover:text-title"
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 shrink-0 ${activo ? "text-[#fbfaf7]" : "text-alby-green"}`} />
                  <span className="font-sans">{t.label}</span>
                  <span
                    className={`rounded px-1.5 py-0.2 text-[10px] font-mono font-semibold shrink-0 ${
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
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-borderSubtle bg-panel text-muted hover:text-title hover:bg-subtle transition-all"
            title={isDark ? "Cambiar a Versión Diurna (Estándar)" : "Cambiar a Versión Nocturna"}
          >
            {isDark ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-[#4a443b]" />
            )}
          </button>
        </div>

        {/* ================================================================
            CONTROLES MÓVILES (< lg): Toggle Diurno + Botón Hamburguesa
            ================================================================ */}
        <div className="flex lg:hidden items-center gap-1.5">
          {/* Toggle Diurno / Nocturno Móvil */}
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-borderSubtle bg-panel text-muted hover:text-title hover:bg-subtle transition-all"
            title={isDark ? "Cambiar a Versión Diurna (Estándar)" : "Cambiar a Versión Nocturna"}
            aria-label="Cambiar tema"
          >
            {isDark ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-[#4a443b]" />
            )}
          </button>

          {/* Botón de Menú Hamburguesa */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-borderSubtle bg-subtle text-title hover:border-alby-green transition-all"
            aria-label={isMobileMenuOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación"}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5 text-alby-terr" />
            ) : (
              <Menu className="h-5 w-5 text-title" />
            )}
          </button>
        </div>
      </div>

      {/* ================================================================
          PANEL DESPLEGABLE MÓVIL (MENÚ DE HAMBURGUESA)
          ================================================================ */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-borderSubtle bg-panel px-4 py-4 shadow-lg animate-in slide-in-from-top-2 duration-150">
          <div className="space-y-2">
            <span className="text-[10px] font-mono tracking-widest text-muted uppercase font-bold px-1">
              // MÓDULOS DEL RADAR //
            </span>

            <div className="grid grid-cols-1 gap-1.5 pt-1">
              {tabs.map((t) => {
                const Icon = t.icon;
                const activo = vistaActiva === t.id;

                return (
                  <button
                    key={t.id}
                    onClick={() => seleccionarVista(t.id)}
                    className={`flex items-start justify-between gap-3 rounded-xl p-3 text-left transition-all border ${
                      activo
                        ? "border-alby-green bg-alby-greenBg shadow-xs"
                        : "border-borderSubtle bg-subtle/50 hover:bg-subtle hover:border-borderStrong"
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div
                        className={`rounded-lg p-1.5 shrink-0 mt-0.5 ${
                          activo
                            ? "bg-alby-green text-[#fbfaf7]"
                            : "bg-panel text-alby-green border border-borderSubtle"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <span
                          className={`text-xs font-bold block ${
                            activo ? "text-alby-green" : "text-title"
                          }`}
                        >
                          {t.label}
                        </span>
                        <p className="text-[11px] text-muted leading-tight mt-0.5">
                          {t.desc}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-mono font-bold shrink-0 self-center ${
                        activo
                          ? "bg-alby-green text-[#fbfaf7]"
                          : "bg-panel text-muted border border-borderSubtle"
                      }`}
                    >
                      {t.badge}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="pt-2 border-t border-borderSubtle flex items-center justify-between text-[11px] font-mono text-muted px-1">
              <span>9 Bloques • Actualización Diaria</span>
              <span className="text-alby-green font-bold">Lunes a Domingo</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
