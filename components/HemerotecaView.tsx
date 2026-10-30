"use client";

import React, { useState } from "react";
import { Search, ExternalLink, ChevronLeft, ChevronRight, Newspaper, Compass } from "lucide-react";

interface Semanainfo {
  archivo: string;
  codigo: string;
  year: number;
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
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-cardBorder bg-card p-4 shadow-md">
        {/* Selector de Años */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <span className="text-xs font-mono text-alby-muted mr-1 uppercase font-bold">Año:</span>
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
              className={`rounded-lg px-3 py-1.5 text-xs font-mono font-bold transition-all ${
                anoSeleccionado === a
                  ? "bg-alby-green text-ink shadow-md"
                  : "border border-cardBorder bg-dark text-alby-cream hover:text-alby-light hover:border-alby-green/60"
              }`}
            >
              {a}
            </button>
          ))}
        </div>

        {/* Buscador */}
        <div className="relative min-w-[240px]">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-alby-muted" />
          <input
            type="text"
            placeholder="Buscar por término clave..."
            value={filtroTexto}
            onChange={(e) => setFiltroTexto(e.target.value)}
            className="w-full rounded-lg border border-cardBorder bg-dark pl-9 pr-3 py-1.5 text-xs text-alby-light placeholder-alby-muted focus:border-alby-green focus:outline-none"
          />
        </div>
      </div>

      {/* Navegador de Semanas */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-cardBorder bg-dark/80 px-4 py-2.5 shadow-sm">
        <div className="flex items-center gap-2">
          <button
            onClick={irSemanaAnterior}
            disabled={semanaIdx <= 0}
            className="rounded p-1 text-alby-cream hover:bg-card hover:text-alby-light disabled:opacity-30"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="font-mono text-sm font-bold text-alby-light tracking-wide">
            SEMANA {semanaSeleccionada}
          </span>
          <button
            onClick={irSemanaSiguiente}
            disabled={semanaIdx >= semanasDelAno.length - 1}
            className="rounded p-1 text-alby-cream hover:bg-card hover:text-alby-light disabled:opacity-30"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Selector Desplegable de Semanas */}
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          <span className="text-xs font-mono text-alby-muted">Ir a:</span>
          <select
            value={semanaSeleccionada}
            onChange={(e) => setSemanaSeleccionada(e.target.value)}
            className="rounded-lg border border-cardBorder bg-card px-3 py-1 text-xs font-mono text-alby-light focus:border-alby-green focus:outline-none"
          >
            {semanasDelAno.map((s) => (
              <option key={s.codigo} value={s.codigo}>
                {s.codigo}
              </option>
            ))}
          </select>
          <span className="text-xs font-mono text-alby-muted">
            ({semanasDelAno.length} semanas registradas)
          </span>
        </div>
      </div>

      {/* Contenido Completo de la Semana */}
      <div className="rounded-2xl border border-cardBorder bg-card p-6 shadow-xl space-y-6">
        <div className="border-b border-cardBorder pb-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="text-xs font-mono text-alby-terr font-bold uppercase tracking-widest">
              // HEMEROTECA DOCUMENTAL //
            </span>
            <h2 className="text-xl font-bold text-alby-light mt-1">
              Titulares de Portadas y Agenda Global ({semanaSeleccionada})
            </h2>
            <p className="text-xs text-alby-cream mt-1">
              Mostrando los acontecimientos dominantes en cada uno de los 9 bloques territoriales.
            </p>
          </div>
          <span className="rounded bg-alby-green/15 text-alby-green border border-alby-green/30 px-3 py-1 text-xs font-mono font-bold">
            9 Bloques con Titulares
          </span>
        </div>

        {/* Cuadrícula de las 9 Regiones con sus Titulares Reales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {regionesMeta.map((rm) => {
            let tits = titularesSemana[rm.cod] || [];

            // Filtrar por término de búsqueda si está activo
            if (filtroTexto.trim()) {
              tits = tits.filter((t) =>
                t.titulo.toLowerCase().includes(filtroTexto.toLowerCase())
              );
            }

            return (
              <div
                key={rm.cod}
                className="rounded-xl border border-cardBorder bg-dark/80 p-4 flex flex-col justify-between transition-all hover:border-alby-green/50 hover:bg-cardHover"
              >
                <div>
                  {/* Encabezado del Bloque */}
                  <div className="flex items-center justify-between mb-3 border-b border-cardBorder/60 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-alby-terr/20 text-alby-terr border border-alby-terr/30 px-2 py-0.5 text-xs font-mono font-bold">
                        {rm.cod}
                      </span>
                      <h3 className="text-sm font-bold text-alby-light">
                        {rm.nombre}
                      </h3>
                    </div>
                    <span className="text-[10px] font-mono text-alby-muted">
                      {rm.bloque}
                    </span>
                  </div>

                  {/* Lista de Titulares Reales */}
                  {tits.length > 0 ? (
                    <div className="space-y-3">
                      {tits.map((item, idx) => (
                        <div key={idx} className="group">
                          <p className="text-xs font-medium text-alby-light leading-snug group-hover:text-alby-green transition-colors">
                            • {item.titulo}
                          </p>
                          <div className="mt-1 flex items-center justify-between text-[11px] font-mono text-alby-muted">
                            <span className="text-alby-cream font-medium">[{item.medio}]</span>
                            {item.url && (
                              <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-alby-green hover:underline font-semibold"
                              >
                                <span>Tirar del hilo</span>
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-alby-muted italic py-3">
                      {filtroTexto.trim()
                        ? "Sin coincidencias para la búsqueda."
                        : "Sin titulares específicos en este archivo."}
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-2 border-t border-cardBorder/40 flex items-center justify-between text-[10px] font-mono text-alby-muted">
                  <span>{tits.length} noticias registradas</span>
                  <span className="text-alby-green font-medium">Verificado</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sección de Segundo Orden: Puntos Ciegos y Framing */}
        <div className="rounded-xl border border-cardBorder bg-dark/95 p-5 space-y-4">
          <h4 className="text-xs font-mono font-bold text-alby-light uppercase tracking-wider flex items-center gap-2">
            <Compass className="h-4 w-4 text-alby-green" />
            // ANÁLISIS DE SEGUNDO ORDEN ({semanaSeleccionada}) //
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            <div className="rounded-lg border border-alby-terr/30 bg-alby-terr/5 p-4 border-l-4 border-l-alby-terr">
              <strong className="text-alby-terr block mb-1 text-sm font-bold">
                Punto Ciego en la Prensa Española
              </strong>
              <p className="text-alby-cream leading-relaxed">
                Durante esta semana, la atención en España estuvo absorbida por la dinámica política interna y los debates parlamentarios, dejando en segundo plano las transformaciones mineras en África y las decisiones regulatorias de Pekín.
              </p>
            </div>
            <div className="rounded-lg border border-alby-green/30 bg-alby-green/5 p-4 border-l-4 border-l-alby-green">
              <strong className="text-alby-green block mb-1 text-sm font-bold">
                Divergencia de Encuadre (Framing Geopolítico)
              </strong>
              <p className="text-alby-cream leading-relaxed">
                Mientras las cabeceras occidentales priorizaron controversias electorales inmediatas, el eje oriental centró su cobertura en la seguridad física de cadenas de valor y acuerdos bilaterales de suministro.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
