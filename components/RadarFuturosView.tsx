"use client";

import React, { useState, useMemo } from "react";
import { Compass, CheckCircle2, XCircle, TrendingUp, ExternalLink, Lightbulb, Clapperboard, Bot, TrendingDown, Scale, Cpu, Layers } from "lucide-react";

interface Hipotesis {
  id: string;
  titulo: string;
  horizonte: string;
  categoria: string;
  traccionScore: number;
  tesis: string;
  senalesPro: Array<{ titular: string; fuente: string; url: string; impacto: string }>;
  senalesContra: Array<{ titular: string; fuente: string; url: string; impacto: string }>;
}

interface RadarFuturosViewProps {
  hipotesisList: Hipotesis[];
}

type MacroCategoriaKey = "ALL" | "AUDIOVISUAL" | "IA_AGENTES" | "MACRO_BURBUJA" | "PI_SOCIEDAD" | "DEEPTECH_GEO";

interface MacroCategoriaDef {
  key: MacroCategoriaKey;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  hipotesisIds: string[];
}

const MACRO_CATEGORIAS: MacroCategoriaDef[] = [
  {
    key: "ALL",
    label: "Todas las Hipótesis",
    icon: Layers,
    hipotesisIds: [],
  },
  {
    key: "AUDIOVISUAL",
    label: "Audiovisual & Creación",
    icon: Clapperboard,
    hipotesisIds: ["HIP-02", "HIP-04", "HIP-08", "HIP-10", "HIP-22"],
  },
  {
    key: "IA_AGENTES",
    label: "IA, Agentes & Trabajo",
    icon: Bot,
    hipotesisIds: ["HIP-11", "HIP-16", "HIP-17", "HIP-19"],
  },
  {
    key: "MACRO_BURBUJA",
    label: "Macroeconomía & Burbuja",
    icon: TrendingDown,
    hipotesisIds: ["HIP-15", "HIP-20", "HIP-21"],
  },
  {
    key: "PI_SOCIEDAD",
    label: "Propiedad Intelectual & Sociedad",
    icon: Scale,
    hipotesisIds: ["HIP-01", "HIP-03", "HIP-07", "HIP-09", "HIP-13"],
  },
  {
    key: "DEEPTECH_GEO",
    label: "DeepTech & Geopolítica",
    icon: Cpu,
    hipotesisIds: ["HIP-05", "HIP-06", "HIP-12", "HIP-14", "HIP-18"],
  },
];

export function RadarFuturosView({ hipotesisList }: RadarFuturosViewProps) {
  const [macroFiltro, setMacroFiltro] = useState<MacroCategoriaKey>("ALL");
  const [hipotesisActiva, setHipotesisActiva] = useState<string>(
    hipotesisList.length > 0 ? hipotesisList[0].id : ""
  );

  const filtradas = useMemo(() => {
    if (macroFiltro === "ALL") return hipotesisList;
    const def = MACRO_CATEGORIAS.find((m) => m.key === macroFiltro);
    if (!def) return hipotesisList;
    return hipotesisList.filter((h) => def.hipotesisIds.includes(h.id));
  }, [macroFiltro, hipotesisList]);

  const seleccionada = useMemo(() => {
    const encontrada = filtradas.find((h) => h.id === hipotesisActiva);
    if (encontrada) return encontrada;
    return filtradas.length > 0 ? filtradas[0] : hipotesisList[0];
  }, [filtradas, hipotesisActiva, hipotesisList]);

  const getMacroCatName = (hipId: string) => {
    const cat = MACRO_CATEGORIAS.find((m) => m.key !== "ALL" && m.hipotesisIds.includes(hipId));
    return cat ? cat.label : "Prospectiva General";
  };

  return (
    <div className="space-y-6">
      {/* Cabecera del Módulo de Futuros — Paleta Diurna Oficial */}
      <div className="rounded-2xl border border-borderSubtle bg-panel p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-alby-green uppercase font-bold">
              // PROSPECTIVA ESTRATÉGICA //
            </span>
            <h2 className="text-base font-bold text-title flex items-center gap-2">
              <Compass className="h-5 w-5 text-alby-green" />
              Radar de Diseño de Futuros — Hipótesis & Señales
            </h2>
            <p className="text-xs text-muted mt-0.5">
              22 tesis falsables a 3, 5 y 10 años conectadas con señales empíricas de la hemeroteca para contrastar tracción real vs. fricción.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-md bg-alby-greenBg text-alby-green border border-alby-greenBorder px-2.5 py-1 text-xs font-mono font-bold">
              {hipotesisList.length} HIPÓTESIS ACTIVAS
            </span>
          </div>
        </div>

        {/* Macro-Categorías Agrupadas */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-2 border-t border-borderSubtle">
          {MACRO_CATEGORIAS.map((cat) => {
            const Icon = cat.icon;
            const isActive = macroFiltro === cat.key;
            const count = cat.key === "ALL" ? hipotesisList.length : cat.hipotesisIds.length;

            return (
              <button
                key={cat.key}
                onClick={() => {
                  setMacroFiltro(cat.key);
                  const primeraDeCategoria = hipotesisList.find((h) =>
                    cat.key === "ALL" ? true : cat.hipotesisIds.includes(h.id)
                  );
                  if (primeraDeCategoria) setHipotesisActiva(primeraDeCategoria.id);
                }}
                className={`flex flex-col items-start gap-1 rounded-xl p-2.5 text-left transition-all border ${
                  isActive
                    ? "bg-alby-green text-[#fbfaf7] border-alby-green shadow-sm"
                    : "bg-subtle border-borderSubtle text-body hover:text-title hover:border-alby-green"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <Icon className={`h-3.5 w-3.5 ${isActive ? "text-[#fbfaf7]" : "text-alby-green"}`} />
                  <span
                    className={`font-mono text-[10px] font-bold rounded px-1.5 py-0.2 ${
                      isActive ? "bg-black/20 text-[#fbfaf7]" : "bg-panel text-muted border border-borderSubtle"
                    }`}
                  >
                    {count}
                  </span>
                </div>
                <span className="text-[11px] font-semibold leading-tight line-clamp-1">
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid: Lista de Hipótesis (Izquierda) + Ficha Detallada de Señales (Derecha) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Selector de Hipótesis (5 columnas) */}
        <div className="space-y-3 lg:col-span-5">
          <div className="flex items-center justify-between px-1">
            <h4 className="text-xs font-mono font-semibold text-muted uppercase tracking-wider">
              Tesis en Observación ({filtradas.length})
            </h4>
            <span className="text-[10px] font-mono text-alby-green font-bold">
              {MACRO_CATEGORIAS.find((m) => m.key === macroFiltro)?.label}
            </span>
          </div>

          <div className="space-y-2.5 max-h-[750px] overflow-y-auto pr-1">
            {filtradas.map((h) => {
              const isSelected = seleccionada?.id === h.id;

              return (
                <div
                  key={h.id}
                  onClick={() => setHipotesisActiva(h.id)}
                  className={`cursor-pointer rounded-xl border p-4 transition-all ${
                    isSelected
                      ? "border-alby-green bg-alby-greenBg shadow-sm"
                      : "border-borderSubtle bg-panel hover:border-alby-green hover:bg-subtle"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded border ${
                        isSelected
                          ? "bg-alby-green text-[#fbfaf7] border-alby-green"
                          : "bg-subtle text-muted border-borderSubtle"
                      }`}
                    >
                      {h.id} • {h.horizonte}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs font-mono">
                      <TrendingUp className="h-3.5 w-3.5 text-alby-green" />
                      <span className="font-bold text-alby-green">
                        {h.traccionScore}%
                      </span>
                    </div>
                  </div>

                  <h3 className="text-xs font-bold text-title line-clamp-2 leading-snug">
                    {h.titulo}
                  </h3>
                  <p className="mt-1.5 text-[10px] text-alby-terr font-mono font-semibold">
                    {getMacroCatName(h.id)} // {h.categoria}
                  </p>

                  {/* Barra de progreso de tracción */}
                  <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-subtle border border-borderSubtle">
                    <div
                      className="h-full rounded-full bg-alby-green"
                      style={{ width: `${h.traccionScore}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Ficha Detallada: Señales A Favor (🟢) vs En Contra (🔴) (7 columnas) */}
        {seleccionada && (
          <div className="rounded-2xl border border-borderSubtle bg-panel p-6 shadow-sm lg:col-span-7 space-y-6">
            {/* Cabecera de la Hipótesis */}
            <div className="border-b border-borderSubtle pb-4">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span className="rounded-md bg-alby-greenBg text-alby-green border border-alby-greenBorder px-2.5 py-1 text-xs font-mono font-bold">
                  {seleccionada.id} // {seleccionada.horizonte}
                </span>
                <span className="text-xs font-mono text-muted">
                  Dominio: <strong className="text-title">{getMacroCatName(seleccionada.id)}</strong>
                </span>
              </div>
              <h2 className="text-lg font-bold text-title leading-snug">
                {seleccionada.titulo}
              </h2>
            </div>

            {/* Declaración de la Tesis Falsable */}
            <div className="rounded-xl border border-borderSubtle bg-subtle p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-alby-terr" />
                <h4 className="text-xs font-mono font-bold text-alby-terr uppercase tracking-wider">
                  Declaración de la Hipótesis (Tesis Falsable)
                </h4>
              </div>
              <p className="text-xs text-body leading-relaxed font-medium">
                {seleccionada.tesis}
              </p>
            </div>

            {/* Gráfica de Tracción y Balance de Señales */}
            <div className="rounded-xl border border-borderSubtle bg-subtle p-4 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-muted">Puntaje de Tracción / Probabilidad:</span>
                <span className="font-bold text-alby-green text-sm">
                  {seleccionada.traccionScore}% — VALIDÁNDOSE
                </span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-panel border border-borderSubtle overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-alby-terr via-amber-400 to-alby-green"
                  style={{ width: `${seleccionada.traccionScore}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-muted">
                <span>0% Falsada</span>
                <span>50% Ambigua</span>
                <span>100% Consolidada</span>
              </div>
            </div>

            {/* Doble Columna de Señales: Tracción (Verde) vs Fricción (Terracota) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Columna Verde: Señales A Favor (🟢 Pro) */}
              <div className="rounded-xl border border-alby-greenBorder bg-alby-greenBg/40 p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-borderSubtle pb-2">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-alby-green" />
                    <h4 className="text-xs font-bold text-alby-green font-mono uppercase">
                      Señales de Tracción (A Favor)
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono text-alby-green font-bold">
                    {seleccionada.senalesPro.length}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {seleccionada.senalesPro.map((s, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg border border-borderSubtle bg-panel p-3 text-xs space-y-2 shadow-2xs"
                    >
                      <p className="text-title font-semibold leading-snug">
                        {s.titular}
                      </p>
                      <div className="flex items-center justify-between text-[11px] pt-1 border-t border-borderSubtle">
                        <span className="font-mono text-alby-green font-semibold">{s.fuente}</span>
                        <a
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-muted hover:text-alby-green font-mono text-[10px]"
                        >
                          <span>Ver</span>
                          <ExternalLink className="h-2.5 w-2.5" />
                        </a>
                      </div>
                      <p className="text-[11px] text-muted leading-relaxed">
                        <strong className="text-body font-semibold">Impacto:</strong> {s.impacto}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Columna Terracota: Señales En Contra (🔴 Fricción) */}
              <div className="rounded-xl border border-alby-terrBorder bg-alby-terrBg/40 p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-borderSubtle pb-2">
                  <div className="flex items-center gap-1.5">
                    <XCircle className="h-4 w-4 text-alby-terr" />
                    <h4 className="text-xs font-bold text-alby-terr font-mono uppercase">
                      Señales de Fricción (En Contra)
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono text-alby-terr font-bold">
                    {seleccionada.senalesContra.length}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {seleccionada.senalesContra.map((s, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg border border-borderSubtle bg-panel p-3 text-xs space-y-2 shadow-2xs"
                    >
                      <p className="text-title font-semibold leading-snug">
                        {s.titular}
                      </p>
                      <div className="flex items-center justify-between text-[11px] pt-1 border-t border-borderSubtle">
                        <span className="font-mono text-alby-terr font-semibold">{s.fuente}</span>
                        <a
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-muted hover:text-alby-terr font-mono text-[10px]"
                        >
                          <span>Ver</span>
                          <ExternalLink className="h-2.5 w-2.5" />
                        </a>
                      </div>
                      <p className="text-[11px] text-muted leading-relaxed">
                        <strong className="text-body font-semibold">Fricción:</strong> {s.impacto}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
