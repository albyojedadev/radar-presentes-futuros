"use client";

import React, { useState } from "react";
import { Calendar, Search, ExternalLink, ChevronLeft, ChevronRight, Compass } from "lucide-react";

interface HemerotecaViewProps {
  semanasPorAno: Record<string, Array<{ archivo: string; codigo: string; year: number }>>;
}

export function HemerotecaView({ semanasPorAno }: HemerotecaViewProps) {
  const anosDisponibles = Object.keys(semanasPorAno).sort().reverse();
  const [anoSeleccionado, setAnoSeleccionado] = useState<string>("2026");
  const semanasDelAno = semanasPorAno[anoSeleccionado] || [];
  const [semanaSeleccionada, setSemanaSeleccionada] = useState<string>(
    semanasDelAno.length > 0 ? semanasDelAno[semanasDelAno.length - 1].codigo : "2026-W44"
  );
  const [filtroTexto, setFiltroTexto] = useState<string>("");

  // Encontrar el índice de la semana seleccionada
  const semanaIdx = semanasDelAno.findIndex((s) => s.codigo === semanaSeleccionada);

  const irSemanaAnterior = () => {
    if (semanaIdx > 0) {
      setSemanaSeleccionada(semanasDelAno[semanaIdx - 1].codigo);
    }
  };

  const irSemanaSiguiente = () => {
    if (semanaIdx < semanasDelAno.length - 1) {
      setSemanaSeleccionada(semanasDelAno[semanaIdx + 1].codigo);
    }
  };

  return (
    <div className="space-y-6">
      {/* Barra de Controles: Selector de Año y Buscador */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-[#0c121e]/90 p-4">
        {/* Selector de Años */}
        <div className="flex items-center gap-1 overflow-x-auto">
          <span className="text-xs font-mono text-slate-500 mr-2 uppercase">Año:</span>
          {anosDisponibles.map((a) => (
            <button
              key={a}
              onClick={() => {
                setAnoSeleccionado(a);
                const sAno = semanasPorAno[a] || [];
                if (sAno.length > 0) {
                  setSemanaSeleccionada(sAno[sAno.length - 1].codigo);
                }
              }}
              className={`rounded-lg px-3 py-1.5 text-xs font-mono font-medium transition-all ${
                anoSeleccionado === a
                  ? "bg-sky-500 text-slate-950 font-bold shadow-md"
                  : "border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200"
              }`}
            >
              {a}
            </button>
          ))}
        </div>

        {/* Buscador */}
        <div className="relative min-w-[240px]">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar por término clave..."
            value={filtroTexto}
            onChange={(e) => setFiltroTexto(e.target.value)}
            className="w-full rounded-lg border border-slate-800 bg-slate-900/80 pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:border-sky-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Navegador de Semanas */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800/80 bg-slate-900/40 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <button
            onClick={irSemanaAnterior}
            disabled={semanaIdx <= 0}
            className="rounded p-1 text-slate-400 hover:bg-slate-800 disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="font-mono text-sm font-semibold text-slate-200">
            SEMANA {semanaSeleccionada}
          </span>
          <button
            onClick={irSemanaSiguiente}
            disabled={semanaIdx >= semanasDelAno.length - 1}
            className="rounded p-1 text-slate-400 hover:bg-slate-800 disabled:opacity-30"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Desplegable o Selector de Semanas del Año */}
        <div className="flex items-center gap-2 overflow-x-auto max-w-full py-1">
          <span className="text-[11px] font-mono text-slate-500">Semana:</span>
          <select
            value={semanaSeleccionada}
            onChange={(e) => setSemanaSeleccionada(e.target.value)}
            className="rounded border border-slate-800 bg-slate-900 px-2 py-1 text-xs font-mono text-slate-300 focus:border-sky-500 focus:outline-none"
          >
            {semanasDelAno.map((s) => (
              <option key={s.codigo} value={s.codigo}>
                {s.codigo}
              </option>
            ))}
          </select>
          <span className="text-[11px] font-mono text-slate-500">
            ({semanasDelAno.length} semanas registradas en {anoSeleccionado})
          </span>
        </div>
      </div>

      {/* Vista Previa del Informe de la Semana */}
      <div className="rounded-2xl border border-slate-800 bg-[#0c121e]/90 p-6 shadow-xl space-y-6">
        <div className="border-b border-slate-800/80 pb-4">
          <span className="text-xs font-mono text-sky-400 uppercase tracking-widest">
            // INFORME SEMANAL ARCHIVADO //
          </span>
          <h2 className="text-lg font-bold text-slate-100 mt-1">
            Auditoría de Portadas y Agenda Global ({semanaSeleccionada})
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Filtro de 'La Oruga': contraste entre superficie mediática de los 9 bloques y corrientes subterráneas.
          </p>
        </div>

        {/* Cuadrícula de Bloques de la Semana */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { cod: "ES", nombre: "España", bloque: "Europa del Sur", medio: "El País / El Mundo" },
            { cod: "FR", nombre: "Francia", bloque: "Europa Continental", medio: "Le Monde / Le Figaro" },
            { cod: "DE", nombre: "Alemania", bloque: "Europa Central", medio: "FAZ / Der Spiegel" },
            { cod: "UK", nombre: "Reino Unido", bloque: "Mundo Anglosajón", medio: "BBC / The Guardian" },
            { cod: "EU", nombre: "Europa", bloque: "Unión Europea", medio: "Politico / Euronews" },
            { cod: "US", nombre: "EEUU", bloque: "Norteamérica", medio: "NYT / Wall Street Journal" },
            { cod: "LATAM", nombre: "Latinoamérica", bloque: "América Latina", medio: "Clarín / Infobae" },
            { cod: "AFRICA", nombre: "África", bloque: "Continente Africano", medio: "The Africa Report" },
            { cod: "CHINA", nombre: "China", bloque: "Eje Oriental", medio: "Global Times / SCMP" },
          ].map((item) => {
            const queryHilo = encodeURIComponent(`${item.nombre} ${semanaSeleccionada} noticias`);
            const urlSearch = `https://www.google.com/search?q=${queryHilo}`;

            return (
              <div
                key={item.cod}
                className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="rounded bg-slate-800/80 px-2 py-0.5 text-[11px] font-mono text-sky-400">
                      {item.cod}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      {item.bloque}
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-slate-200">
                    {item.nombre}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Cabeceras clave: {item.medio}
                  </p>
                </div>

                <div className="mt-4 pt-2 border-t border-slate-800/60 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-500">
                    Filtro Oruga OK
                  </span>
                  <a
                    href={urlSearch}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[11px] font-mono text-sky-400 hover:text-sky-300"
                  >
                    <span>Tirar del hilo</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sección de Puntos Ciegos y Framing */}
        <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-4 space-y-3">
          <h4 className="text-xs font-mono font-semibold text-sky-300 uppercase tracking-wider">
            // SÍNTESIS DE SEGUNDO ORDEN ({semanaSeleccionada}) //
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="border-l-2 border-amber-500/40 pl-3">
              <strong className="text-amber-300 block mb-1">
                Punto Ciego en la Prensa Española
              </strong>
              <p className="text-slate-400 leading-relaxed">
                Durante esta semana, el debate doméstico en España eclipsó por completo los avances normativos en Pekín y las transformaciones mineras en el continente africano.
              </p>
            </div>
            <div className="border-l-2 border-sky-500/40 pl-3">
              <strong className="text-sky-300 block mb-1">
                Divergencia de Encuadre (Framing)
              </strong>
              <p className="text-slate-400 leading-relaxed">
                Mientras las cabeceras occidentales priorizaron controversias electorales inmediatas, el eje oriental centró su cobertura en la seguridad física de cadenas de valor.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
