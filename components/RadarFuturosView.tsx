"use client";

import React, { useState } from "react";
import { Compass, CheckCircle2, XCircle, TrendingUp, ExternalLink, Filter, Lightbulb } from "lucide-react";

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

export function RadarFuturosView({ hipotesisList }: RadarFuturosViewProps) {
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>("ALL");
  const [hipotesisActiva, setHipotesisActiva] = useState<string>(
    hipotesisList.length > 0 ? hipotesisList[0].id : ""
  );

  const categorias = ["ALL", ...Array.from(new Set(hipotesisList.map((h) => h.categoria)))];

  const filtradas =
    categoriaFiltro === "ALL"
      ? hipotesisList
      : hipotesisList.filter((h) => h.categoria === categoriaFiltro);

  const seleccionada = hipotesisList.find((h) => h.id === hipotesisActiva) || hipotesisList[0];

  return (
    <div className="space-y-6">
      {/* Cabecera del Módulo de Futuros */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-[#0c121e]/90 p-5 shadow-lg">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-sky-400 uppercase">
            // PROSPECTIVA ESTRATÉGICA //
          </span>
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Compass className="h-5 w-5 text-sky-400" />
            Radar de Diseño de Futuros — Hipótesis & Señales
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Matriz de tesis falsables a 3, 5 y 10 años contrastadas con señales empíricas de la hemeroteca de presentes.
          </p>
        </div>

        {/* Filtro por Categoría */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <Filter className="h-3.5 w-3.5 text-slate-500 mr-1" />
          {categorias.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoriaFiltro(cat)}
              className={`rounded-lg px-2.5 py-1 text-xs font-mono transition-all ${
                categoriaFiltro === cat
                  ? "bg-sky-500 font-bold text-slate-950 shadow-sm"
                  : "border border-slate-800 bg-slate-900/40 text-slate-400 hover:text-slate-200"
              }`}
            >
              {cat === "ALL" ? "TODAS" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid: Lista de Hipótesis (Izquierda) + Ficha Detallada de Señales (Derecha) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Selector de Hipótesis (4 columnas) */}
        <div className="space-y-3 lg:col-span-5">
          <h4 className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider px-1">
            Tesis en Observación ({filtradas.length})
          </h4>

          {filtradas.map((h) => {
            const isSelected = seleccionada?.id === h.id;

            return (
              <div
                key={h.id}
                onClick={() => setHipotesisActiva(h.id)}
                className={`cursor-pointer rounded-xl border p-4 transition-all ${
                  isSelected
                    ? "border-sky-500/80 bg-sky-950/20 shadow-lg shadow-sky-500/5"
                    : "border-slate-800/80 bg-[#0c121e]/80 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[10px] text-sky-400 font-semibold bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                    {h.id} • {h.horizonte}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-mono">
                    <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="font-bold text-emerald-400">
                      {h.traccionScore}%
                    </span>
                  </div>
                </div>

                <h3 className="text-xs font-semibold text-slate-100 line-clamp-2">
                  {h.titulo}
                </h3>
                <p className="mt-1 text-[11px] text-slate-400 font-mono">
                  {h.categoria}
                </p>

                {/* Barra de progreso de tracción */}
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-sky-500 to-emerald-400"
                    style={{ width: `${h.traccionScore}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Ficha Detallada: Señales A Favor (🟢) vs En Contra (🔴) (7 columnas) */}
        {seleccionada && (
          <div className="rounded-2xl border border-slate-800 bg-[#0c121e]/90 p-6 shadow-xl lg:col-span-7 space-y-6">
            {/* Cabecera de la Hipótesis */}
            <div className="border-b border-slate-800/80 pb-4">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="rounded bg-sky-500/20 text-sky-300 border border-sky-500/30 px-2 py-0.5 text-xs font-mono">
                  {seleccionada.id} // {seleccionada.horizonte}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Categoría: <strong className="text-slate-200">{seleccionada.categoria}</strong>
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-100">
                {seleccionada.titulo}
              </h2>
            </div>

            {/* Tesis Estratégica */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="h-4 w-4 text-amber-400" />
                <h4 className="text-xs font-mono font-semibold text-amber-200 uppercase">
                  Declaración de la Hipótesis (Tesis Falsable)
                </h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {seleccionada.tesis}
              </p>
            </div>

            {/* Gráfica de Tracción y Balance de Señales */}
            <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-4">
              <div className="flex items-center justify-between text-xs font-mono mb-2">
                <span className="text-slate-400">Puntaje de Tracción / Probabilidad:</span>
                <span className="font-bold text-emerald-400 text-sm">
                  {seleccionada.traccionScore}% — VALIDÁNDOSE
                </span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-sky-500 via-emerald-400 to-emerald-500"
                  style={{ width: `${seleccionada.traccionScore}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                <span>0% Falsada</span>
                <span>50% Ambigua</span>
                <span>100% Consolidada</span>
              </div>
            </div>

            {/* Doble Columna de Señales */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Columna Verde: Señales A Favor (🟢 Pro) */}
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-3">
                <div className="flex items-center gap-2 border-b border-emerald-500/20 pb-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <h4 className="text-xs font-semibold text-emerald-200 font-mono uppercase">
                    Señales de Tracción (A Favor)
                  </h4>
                </div>

                <div className="space-y-3">
                  {seleccionada.senalesPro.map((s, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg border border-slate-800/80 bg-slate-900/60 p-2.5 text-xs space-y-1.5"
                    >
                      <p className="text-slate-200 font-medium leading-snug">
                        {s.titular}
                      </p>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                        <span className="font-mono text-emerald-400/90">{s.fuente}</span>
                        <a
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-sky-400 hover:text-sky-300"
                        >
                          <span>Ver</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                      <p className="text-[11px] text-slate-400 border-t border-slate-800/40 pt-1">
                        <strong className="text-slate-300">Impacto:</strong> {s.impacto}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Columna Roja: Señales En Contra (🔴 Fricción) */}
              <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4 space-y-3">
                <div className="flex items-center gap-2 border-b border-rose-500/20 pb-2">
                  <XCircle className="h-4 w-4 text-rose-400" />
                  <h4 className="text-xs font-semibold text-rose-200 font-mono uppercase">
                    Señales de Fricción (En Contra)
                  </h4>
                </div>

                <div className="space-y-3">
                  {seleccionada.senalesContra.map((s, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg border border-slate-800/80 bg-slate-900/60 p-2.5 text-xs space-y-1.5"
                    >
                      <p className="text-slate-200 font-medium leading-snug">
                        {s.titular}
                      </p>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                        <span className="font-mono text-rose-400/90">{s.fuente}</span>
                        <a
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-sky-400 hover:text-sky-300"
                        >
                          <span>Ver</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                      <p className="text-[11px] text-slate-400 border-t border-slate-800/40 pt-1">
                        <strong className="text-slate-300">Fricción:</strong> {s.impacto}
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
