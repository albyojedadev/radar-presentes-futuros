"use client";

import React, { useState } from "react";
import { Search, ExternalLink, ChevronLeft, ChevronRight, Newspaper, Compass } from "lucide-react";

interface Semanainfo {
  archivo: string;
  codigo: string;
  year: number;
  periodo?: string;
  analisis?: {
    fase: string;
    ejeDominante: string;
    puntoCiego: string;
    evaluacion: string;
    divergencia: string;
    tesis: string;
  };
  titulares?: Record<string, Array<{ titulo: string; medio: string; url: string }>>;
}

interface HemerotecaViewProps {
  semanasPorAno: Record<string, Semanainfo[]>;
}

export function HemerotecaView({ semanasPorAno }: HemerotecaViewProps) {
  const anosDisponibles = Object.keys(semanasPorAno).sort().reverse();
  const [anoSeleccionado, setAnoSeleccionado] = useState<string>("2026");
  const semanasDelAno = semanasPorAno[anoSeleccionado] || [];
  
  const [semanaSeleccionada, setSemanaSeleccionada] = useState<string>(
    semanasDelAno.length > 0 ? semanasDelAno[semanasDelAno.length - 1].codigo : "2026-W44"
  );
  const [filtroTexto, setFiltroTexto] = useState<string>("");

  const semanaObj = semanasDelAno.find((s) => s.codigo === semanaSeleccionada) || semanasDelAno[semanasDelAno.length - 1];
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

  const regionesMeta = [
    { cod: "ES", nombre: "España", bloque: "Europa del Sur" },
    { cod: "FR", nombre: "Francia", bloque: "Europa Continental" },
    { cod: "DE", nombre: "Alemania", bloque: "Europa Central" },
    { cod: "UK", nombre: "Reino Unido", bloque: "Mundo Anglosajón" },
    { cod: "EU", nombre: "Europa", bloque: "Unión Europea" },
    { cod: "US", nombre: "Estados Unidos", bloque: "Norteamérica" },
    { cod: "LATAM", nombre: "Latinoamérica", bloque: "América Latina" },
    { cod: "AFRICA", nombre: "África", bloque: "Continente Africano" },
    { cod: "CHINA", nombre: "China", bloque: "Eje Oriental" },
  ];

  const titularesSemana = semanaObj?.titulares || {};

  return (
    <div className="space-y-6">
      {/* Barra de Controles: Selector de Año y Buscador */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-borderSubtle bg-panel p-4 shadow-sm">
        {/* Selector de Años */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {anosDisponibles.map((ano) => (
            <button
              key={ano}
              onClick={() => {
                setAnoSeleccionado(ano);
                const semanas = semanasPorAno[ano] || [];
                if (semanas.length > 0) {
                  setSemanaSeleccionada(semanas[semanas.length - 1].codigo);
                }
              }}
              className={`rounded-lg px-3 py-1.5 text-xs font-mono font-bold transition-all ${
                anoSeleccionado === ano
                  ? "bg-alby-green text-[#fbfaf7] shadow-sm"
                  : "border border-borderSubtle bg-subtle text-muted hover:text-title"
              }`}
            >
              {ano}
            </button>
          ))}
        </div>

        {/* Buscador Contextual */}
        <div className="relative min-w-[240px]">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted" />
          <input
            type="text"
            value={filtroTexto}
            onChange={(e) => setFiltroTexto(e.target.value)}
            placeholder="Buscar titular o país..."
            className="w-full rounded-xl border border-borderSubtle bg-subtle py-1.5 pl-9 pr-3 text-xs text-title placeholder-muted focus:border-alby-green focus:outline-hidden"
          />
        </div>
      </div>

      {/* Navegador de Semanas Mejorado */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-borderSubtle bg-panel px-5 py-3.5 shadow-sm">
        {/* Controles de Navegación Rápida */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <button
              onClick={irSemanaAnterior}
              disabled={semanaIdx <= 0}
              title="Semana anterior"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-borderSubtle bg-subtle text-muted disabled:opacity-30 hover:text-title hover:border-alby-green transition-all"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={irSemanaSiguiente}
              disabled={semanaIdx >= semanasDelAno.length - 1}
              title="Semana siguiente"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-borderSubtle bg-subtle text-muted disabled:opacity-30 hover:text-title hover:border-alby-green transition-all"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Desplegable Directo de Semanas con Título de Hito */}
          <div className="relative">
            <select
              value={semanaSeleccionada}
              onChange={(e) => setSemanaSeleccionada(e.target.value)}
              className="rounded-xl border border-borderSubtle bg-subtle py-1.5 pl-3 pr-8 text-xs font-mono font-bold text-title focus:border-alby-green focus:outline-hidden cursor-pointer"
            >
              {semanasDelAno.map((s) => (
                <option key={s.codigo} value={s.codigo}>
                  {s.codigo} {s.analisis?.fase ? `• ${s.analisis.fase}` : s.periodo ? `• ${s.periodo}` : ""}
                </option>
              ))}
            </select>
          </div>

          <span className="text-xs text-muted font-mono hidden sm:inline">
            ({semanaIdx + 1} de {semanasDelAno.length} semanas en {anoSeleccionado})
          </span>
        </div>

        {/* Barra de píldoras de semanas completa con scroll fluido */}
        <div className="flex items-center gap-1 overflow-x-auto max-w-full lg:max-w-xl py-1 px-1 scrollbar-thin">
          {semanasDelAno.map((s) => {
            const isActiva = s.codigo === semanaSeleccionada;
            const num = s.codigo.split("-W")[1];
            return (
              <button
                key={s.codigo}
                onClick={() => setSemanaSeleccionada(s.codigo)}
                title={`${s.codigo}: ${s.analisis?.fase || ''}`}
                className={`rounded px-2 py-1 text-[10px] font-mono font-bold transition-all shrink-0 ${
                  isActiva
                    ? "bg-alby-green text-[#fbfaf7] shadow-xs scale-105"
                    : "bg-subtle text-muted hover:text-title hover:bg-borderSubtle/60"
                }`}
              >
                W{num}
              </button>
            );
          })}
        </div>
      </div>

      {/* Contenedor del Informe Semanal */}
      <div className="rounded-2xl border border-borderSubtle bg-panel p-6 shadow-sm space-y-6">
        {/* Cabecera del Informe */}
        <div className="border-b border-borderSubtle pb-4 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono tracking-widest text-alby-green uppercase font-bold">
                // INFORME SEMANAL ARCHIVADO //
              </span>
              {semanaObj?.periodo && (
                <span className="text-[10px] font-mono text-muted bg-subtle px-2 py-0.5 rounded border border-borderSubtle">
                  {semanaObj.periodo}
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold text-title">
              Auditoría de Portadas y Agenda Global ({semanaSeleccionada})
            </h2>
            <p className="text-xs text-muted mt-1 leading-relaxed">
              Filtro de &apos;La Oruga&apos;: contraste entre superficie mediática de los 9 bloques y corrientes subterráneas.
            </p>
          </div>

          {semanaObj?.analisis?.fase && (
            <div className="flex items-center gap-1.5 self-start rounded-lg border border-alby-greenBorder bg-alby-green/10 px-3 py-1 font-mono text-xs font-bold text-alby-green">
              <span>Fase:</span>
              <span>{semanaObj.analisis.fase}</span>
            </div>
          )}
        </div>

        {/* ====================================================================
            1. SÍNTESIS DE SEGUNDO ORDEN (ANÁLISIS ESTRATÉGICO SUPERIOR)
            ==================================================================== */}
        {(() => {
          const analisis = semanaObj?.analisis || {
            fase: "Consolidación de agenda",
            ejeDominante: "Cobertura centrada en la superficie informativa y controversias de corto plazo.",
            puntoCiego: "Durante esta semana, el debate doméstico eclipsó por completo los avances normativos y las transformaciones de fondo.",
            evaluacion: "La atención pública quedó absorbida por el ciclo político inmediato.",
            divergencia: "Mientras las cabeceras occidentales priorizaron controversias electorales, el eje oriental centró su cobertura en cadenas de valor y soberanía tecnológica.",
            tesis: "La divergencia de encuadres evidencia la desconexión entre la esfera mediática y las corrientes estructurales."
          };

          return (
            <div className="rounded-xl border border-borderSubtle bg-subtle p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-borderSubtle pb-2.5">
                <div className="flex items-center gap-2">
                  <Compass className="h-4 w-4 text-alby-green" />
                  <h3 className="text-sm font-bold text-title">
                    Síntesis de Segundo Orden ({semanaSeleccionada})
                  </h3>
                </div>
                {analisis.ejeDominante && (
                  <span className="text-[11px] font-mono text-muted">
                    Eje dominante: <span className="text-body font-medium">{analisis.ejeDominante}</span>
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Bloque Punto Ciego */}
                <div className="rounded-lg border border-borderSubtle bg-panel/70 p-4 space-y-2">
                  <div className="flex items-center gap-1.5">
                    <span className="flex h-2 w-2 rounded-full bg-alby-terr" />
                    <span className="font-mono text-xs text-alby-terr font-bold uppercase tracking-wide">
                      Punto Ciego en la Prensa Española
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-title leading-relaxed">
                    {analisis.puntoCiego}
                  </p>
                  {analisis.evaluacion && (
                    <p className="text-[11px] text-muted leading-relaxed pt-1 border-t border-borderSubtle/60">
                      <strong className="text-body font-mono">Evaluación:</strong> {analisis.evaluacion}
                    </p>
                  )}
                </div>

                {/* Bloque Divergencia de Encuadre */}
                <div className="rounded-lg border border-borderSubtle bg-panel/70 p-4 space-y-2">
                  <div className="flex items-center gap-1.5">
                    <span className="flex h-2 w-2 rounded-full bg-alby-green" />
                    <span className="font-mono text-xs text-alby-green font-bold uppercase tracking-wide">
                      Divergencia de Encuadre (Framing Geopolítico)
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-title leading-relaxed">
                    {analisis.divergencia}
                  </p>
                  {analisis.tesis && (
                    <p className="text-[11px] text-muted leading-relaxed pt-1 border-t border-borderSubtle/60">
                      <strong className="text-body font-mono">Tesis Emergente:</strong> {analisis.tesis}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })()}

        {/* ====================================================================
            2. EVIDENCIA DOCUMENTAL: 9 BLOQUES GEOPOLÍTICOS CON TITULARES REALES
            ==================================================================== */}
        <div className="space-y-4 pt-2">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-borderSubtle pb-2">
            <div className="flex items-center gap-2">
              <Newspaper className="h-4 w-4 text-alby-green" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-muted">
                // EVIDENCIA DOCUMENTAL: PORTADAS Y TITULARES DE LOS 9 BLOQUES //
              </h3>
            </div>
            <span className="text-[11px] font-mono text-muted">
              Haz clic en cualquier titular para auditar la cobertura original
            </span>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {regionesMeta.map((reg) => {
              const listaTitulares = titularesSemana[reg.cod] || [];
              const filtrados = filtroTexto
                ? listaTitulares.filter((t) =>
                    t.titulo.toLowerCase().includes(filtroTexto.toLowerCase()) ||
                    t.medio.toLowerCase().includes(filtroTexto.toLowerCase())
                  )
                : listaTitulares;

              return (
                <div
                  key={reg.cod}
                  className="flex flex-col justify-between rounded-xl border border-borderSubtle bg-subtle/40 p-4 transition-all hover:border-alby-green hover:bg-subtle/80 hover:shadow-sm"
                >
                  <div>
                    <div className="flex items-center justify-between border-b border-borderSubtle pb-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-alby-green/15 text-alby-green border border-alby-greenBorder px-2 py-0.5 font-mono text-[10px] font-bold">
                          {reg.cod}
                        </span>
                        <h4 className="text-xs font-bold text-title">
                          {reg.nombre}
                        </h4>
                      </div>
                      <span className="text-[10px] font-mono text-muted">
                        {reg.bloque}
                      </span>
                    </div>

                    {filtrados.length > 0 ? (
                      <div className="space-y-3">
                        {filtrados.slice(0, 4).map((t, idx) => (
                          <div key={idx} className="space-y-1">
                            <a
                              href={t.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block text-xs font-bold text-title leading-snug hover:text-alby-green transition-colors line-clamp-2"
                            >
                              • {t.titulo}
                            </a>
                            {t.medio && (
                              <span className="font-mono text-[10px] text-muted block">
                                Cabecera: <strong className="text-body">{t.medio}</strong>
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-4 text-center text-xs font-mono text-muted">
                        {filtroTexto ? "Sin coincidencias de búsqueda." : "Vigilancia de archivo completada."}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 border-t border-borderSubtle pt-2.5 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-muted">
                      {listaTitulares.length} titulares archivados
                    </span>
                    <a
                      href={`https://www.google.com/search?q=${encodeURIComponent(
                        `${reg.nombre} noticias hemeroteca ${semanaSeleccionada}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-alby-green hover:underline font-semibold"
                    >
                      <span>Tirar del hilo</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
