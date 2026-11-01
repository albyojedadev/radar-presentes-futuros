"use client";

import React, { useState } from "react";
import { Globe, MapPin, Layers, Tag as TagIcon, Sparkles } from "lucide-react";

export interface TagSemana {
  tag: string;
  regiones: string[];
  numRegiones: number;
  conteo: number;
  alcance: "global" | "regional" | "individual" | string;
  tipoEtiqueta: string;
}

interface NubeTagsGeograficaProps {
  tags?: TagSemana[];
  titulo?: string;
  subtitulo?: string;
  contexto?: string;
}

const REGIONES_INFO: Record<string, { bandera: string; nombre: string }> = {
  ES: { bandera: "🇪🇸", nombre: "España" },
  FR: { bandera: "🇫🇷", nombre: "Francia" },
  DE: { bandera: "🇩🇪", nombre: "Alemania" },
  UK: { bandera: "🇬🇧", nombre: "Reino Unido" },
  EU: { bandera: "🇪🇺", nombre: "Unión Europea" },
  US: { bandera: "🇺🇸", nombre: "EEUU" },
  LATAM: { bandera: "🌎", nombre: "Latinoamérica" },
  AFRICA: { bandera: "🌍", nombre: "África" },
  CHINA: { bandera: "🇨🇳", nombre: "China" },
};

export function NubeTagsGeografica({
  tags = [],
  titulo = "Nube de Tags & Sincronización Geográfica",
  subtitulo = "Ordenados de temas comunes transnacionales (máxima coincidencia) a asuntos individuales domésticos.",
  contexto,
}: NubeTagsGeograficaProps) {
  const [filtroAlcance, setFiltroAlcance] = useState<"todos" | "global" | "regional" | "individual">("todos");

  if (!tags || tags.length === 0) {
    return null;
  }

  // Filtrar según el alcance seleccionado conservando el orden de común a individual
  const tagsFiltrados = tags.filter((t) => {
    if (filtroAlcance === "todos") return true;
    return t.alcance === filtroAlcance;
  });

  const conteoGlobal = tags.filter((t) => t.alcance === "global").length;
  const conteoRegional = tags.filter((t) => t.alcance === "regional").length;
  const conteoIndividual = tags.filter((t) => t.alcance === "individual").length;

  return (
    <div className="rounded-2xl border border-borderSubtle bg-panel p-4 sm:p-5 shadow-sm space-y-4">
      {/* Cabecera y Selector de Alcance */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-borderSubtle pb-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-alby-greenBg p-1 text-alby-green border border-alby-greenBorder shrink-0">
              <TagIcon className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-title flex flex-wrap items-center gap-2">
                <span>{titulo}</span>
                {contexto && (
                  <span className="text-[10px] font-mono text-muted bg-subtle px-2 py-0.5 rounded border border-borderSubtle">
                    {contexto}
                  </span>
                )}
              </h3>
              <p className="text-[11px] sm:text-xs text-muted mt-0.5">
                {subtitulo}
              </p>
            </div>
          </div>
        </div>

        {/* Botones de Filtro por Alcance */}
        <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto scrollbar-none pb-1 w-full sm:w-auto">
          <button
            onClick={() => setFiltroAlcance("todos")}
            className={`shrink-0 rounded-lg px-2 sm:px-2.5 py-1 text-[11px] sm:text-xs font-mono font-bold transition-all ${
              filtroAlcance === "todos"
                ? "bg-alby-green text-[#fbfaf7] shadow-xs"
                : "border border-borderSubtle bg-subtle text-muted hover:text-title"
            }`}
          >
            Todos ({tags.length})
          </button>

          <button
            onClick={() => setFiltroAlcance("global")}
            className={`shrink-0 inline-flex items-center gap-1 rounded-lg px-2 sm:px-2.5 py-1 text-[11px] sm:text-xs font-mono font-bold transition-all ${
              filtroAlcance === "global"
                ? "bg-blue-600 text-[#fbfaf7] shadow-xs"
                : "border border-borderSubtle bg-subtle text-muted hover:text-title hover:border-blue-400"
            }`}
          >
            <Globe className="h-3 w-3" />
            <span><span className="hidden sm:inline">Comunes / </span>Globales ({conteoGlobal})</span>
          </button>

          <button
            onClick={() => setFiltroAlcance("regional")}
            className={`shrink-0 inline-flex items-center gap-1 rounded-lg px-2 sm:px-2.5 py-1 text-[11px] sm:text-xs font-mono font-bold transition-all ${
              filtroAlcance === "regional"
                ? "bg-amber-600 text-[#fbfaf7] shadow-xs"
                : "border border-borderSubtle bg-subtle text-muted hover:text-title hover:border-amber-400"
            }`}
          >
            <Layers className="h-3 w-3" />
            <span>Regionales ({conteoRegional})</span>
          </button>

          <button
            onClick={() => setFiltroAlcance("individual")}
            className={`shrink-0 inline-flex items-center gap-1 rounded-lg px-2 sm:px-2.5 py-1 text-[11px] sm:text-xs font-mono font-bold transition-all ${
              filtroAlcance === "individual"
                ? "bg-stone-700 text-[#fbfaf7] shadow-xs"
                : "border border-borderSubtle bg-subtle text-muted hover:text-title hover:border-stone-400"
            }`}
          >
            <MapPin className="h-3 w-3" />
            <span><span className="hidden sm:inline">Domésticos / </span>Individuales ({conteoIndividual})</span>
          </button>
        </div>
      </div>

      {/* Nube de Píldoras / Fichas de Tags */}
      <div className="flex flex-wrap gap-2 sm:gap-2.5 pt-1">
        {tagsFiltrados.map((item, idx) => {
          const isGlobal = item.alcance === "global";
          const isRegional = item.alcance === "regional";
          const isIndividual = item.alcance === "individual";

          return (
            <div
              key={idx}
              className={`group flex flex-col justify-between rounded-xl border p-3 transition-all hover:shadow-sm w-full sm:w-auto flex-1 min-w-[260px] sm:min-w-[280px] max-w-full ${
                isGlobal
                  ? "border-blue-200 bg-blue-50/50 hover:border-blue-400"
                  : isRegional
                  ? "border-amber-200 bg-amber-50/50 hover:border-amber-400"
                  : "border-borderSubtle bg-subtle/80 hover:border-borderStrong"
              }`}
            >
              <div className="flex items-center justify-between gap-3 mb-2">
                <span className="text-xs font-bold text-title flex items-center gap-1.5">
                  {isGlobal && <Globe className="h-3.5 w-3.5 text-blue-600 shrink-0" />}
                  {isRegional && <Layers className="h-3.5 w-3.5 text-amber-600 shrink-0" />}
                  {isIndividual && <MapPin className="h-3.5 w-3.5 text-muted shrink-0" />}
                  <span>{item.tag}</span>
                </span>

                <span
                  className={`rounded px-1.5 py-0.5 text-[10px] font-mono font-bold shrink-0 ${
                    isGlobal
                      ? "bg-blue-100 text-blue-700 border border-blue-200"
                      : isRegional
                      ? "bg-amber-100 text-amber-800 border border-amber-200"
                      : "bg-panel text-muted border border-borderSubtle"
                  }`}
                >
                  {item.numRegiones === 1
                    ? "1 región"
                    : `${item.numRegiones} regiones coinciden`}
                </span>
              </div>

              {/* Banderas y Regiones que tratan este tema */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-borderSubtle/40">
                <span className="text-[10px] font-mono text-muted mr-0.5">
                  Cobertura:
                </span>
                {item.regiones.map((reg) => {
                  const info = REGIONES_INFO[reg] || { bandera: "📍", nombre: reg };
                  return (
                    <span
                      key={reg}
                      title={`${info.nombre} (${reg})`}
                      className="inline-flex items-center gap-1 rounded bg-panel px-1.5 py-0.5 text-[10px] font-mono text-title border border-borderSubtle shadow-2xs"
                    >
                      <span>{info.bandera}</span>
                      <span className="font-bold">{reg}</span>
                    </span>
                  );
                })}

                {item.conteo > 1 && (
                  <span className="ml-auto text-[10px] font-mono text-muted">
                    {item.conteo} titulares
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
