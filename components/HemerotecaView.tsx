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

      {/* Navegador de Semanas */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-borderSubtle bg-panel px-5 py-3 shadow-sm">
        <div className="flex items-center gap-2">
          <button
            onClick={irSemanaAnterior}
            disabled={semanaIdx <= 0}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-borderSubtle bg-subtle text-muted disabled:opacity-40 hover:text-title"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="font-mono text-sm font-bold text-title">
            {semanaSeleccionada}
          </span>
          <button
            onClick={irSemanaSiguiente}
            disabled={semanaIdx >= semanasDelAno.length - 1}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-borderSubtle bg-subtle text-muted disabled:opacity-40 hover:text-title"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <span className="text-xs text-muted font-mono ml-2">
            ({semanaIdx + 1} de {semanasDelAno.length} semanas registradas en {anoSeleccionado})
          </span>
        </div>

        {/* Barra de píldoras de semanas con scroll horizontal */}
        <div className="flex items-center gap-1 overflow-x-auto max-w-full sm:max-w-md py-1">
          {semanasDelAno.map((s) => {
            const isActiva = s.codigo === semanaSeleccionada;
            const num = s.codigo.split("-W")[1];
            return (
              <button
                key={s.codigo}
                onClick={() => setSemanaSeleccionada(s.codigo)}
                className={`rounded px-2 py-0.5 text-[10px] font-mono font-medium transition-all ${
                  isActiva
                    ? "bg-alby-green text-[#fbfaf7] font-bold"
                    : "bg-subtle text-muted hover:text-title"
                }`}
              >
                W{num}
              </button>
            );
          })}
        </div>
      </div>

      {/* Contenedor del Informe Semanal: Tarjetas por Bloque con Titulares Reales */}
      <div className="rounded-2xl border border-borderSubtle bg-panel p-6 shadow-sm space-y-6">
        <div className="border-b border-borderSubtle pb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono tracking-widest text-alby-green uppercase font-bold">
              // INFORME SEMANAL ARCHIVADO //
            </span>
          </div>
          <h2 className="text-xl font-bold text-title">
            Auditoría de Portadas y Agenda Global ({semanaSeleccionada})
          </h2>
          <p className="text-xs text-muted mt-1 leading-relaxed">
            Filtro de 'La Oruga': contraste entre superficie mediática de los 9 bloques y corrientes subterráneas. Titulares reales indexados con enlace canónico a fuentes de archivo.
          </p>
        </div>

        {/* 9 Bloques Geopolíticos con Titulares */}
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

        {/* Bloque de Síntesis de Segundo Orden */}
        <div className="rounded-xl border border-borderSubtle bg-subtle p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-borderSubtle pb-2.5">
            <Compass className="h-4 w-4 text-alby-green" />
            <h3 className="text-sm font-bold text-title">
              Síntesis de Segundo Orden ({semanaSeleccionada})
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1 text-xs">
              <span className="font-mono text-[11px] text-alby-terr font-bold block">
                Punto Ciego en la Prensa Española
              </span>
              <p className="text-body leading-relaxed">
                Durante esta semana, el debate doméstico en España eclipsó por completo los avances normativos en Pekín y las transformaciones mineras en el continente africano.
              </p>
            </div>

            <div className="space-y-1 text-xs">
              <span className="font-mono text-[11px] text-alby-green font-bold block">
                Divergencia de Encuadre (Framing)
              </span>
              <p className="text-body leading-relaxed">
                Mientras las cabeceras occidentales priorizaron controversias electorales inmediatas, el eje oriental centró su cobertura en la seguridad física de cadenas de valor y soberanía de chips.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
