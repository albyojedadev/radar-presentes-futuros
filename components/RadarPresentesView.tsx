"use client";

import React, { useState } from "react";
import { MapamundiVectorial } from "./MapamundiVectorial";
import { ExternalLink, Radio, AlertTriangle, Eye, ShieldAlert } from "lucide-react";

interface RadarPresentesViewProps {
  noticiasHoy: any;
}

export function RadarPresentesView({ noticiasHoy }: RadarPresentesViewProps) {
  const [regionFiltro, setRegionFiltro] = useState<string>("ALL");

  if (!noticiasHoy || !noticiasHoy.regiones) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8 text-center">
        <Radio className="mx-auto mb-3 h-8 w-8 text-slate-500 animate-pulse" />
        <p className="text-slate-400">Sin datos de ingesta en vivo cargados.</p>
      </div>
    );
  }

  const regiones = noticiasHoy.regiones;

  // Extraer contadores por región para el mapa
  const regionesCount: Record<string, { nombre: string; totalNoticias: number }> = {};
  for (const [cod, data] of Object.entries<any>(regiones)) {
    let total = 0;
    for (const f of data.fuentes || []) {
      total += (f.noticias || []).length;
    }
    regionesCount[cod] = {
      nombre: data.nombre || cod,
      totalNoticias: total,
    };
  }

  // Filtrar regiones según selección
  const codigosMostrados =
    regionFiltro === "ALL" ? Object.keys(regiones) : [regionFiltro];

  return (
    <div className="space-y-6">
      {/* Barra de cabecera con timestamp */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-800/80 bg-slate-900/40 px-5 py-3">
        <div className="flex items-center gap-3">
          <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-mono font-medium text-slate-300">
            SNAPSHOT EN VIVO // INGESTA DE PORTADAS GLOBALES
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
          <span>Fecha: <strong className="text-sky-400">{noticiasHoy.fecha}</strong></span>
          <span>Captura: <strong className="text-slate-300">{noticiasHoy.timestamp}</strong></span>
          <span className="rounded bg-sky-500/10 px-2 py-0.5 text-sky-400 border border-sky-500/20">
            9 Bloques Monitoreados
          </span>
        </div>
      </div>

      {/* Mapamundi Interactivo */}
      <MapamundiVectorial
        regionSeleccionada={regionFiltro}
        onSelectRegion={setRegionFiltro}
        regionesData={regionesCount}
      />

      {/* Bloque Destacado: El Iceberg Mediático de Hoy */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Lado A: Foco Superficial / España */}
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between border-b border-amber-500/20 pb-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-400" />
              <h4 className="text-xs font-semibold tracking-wider text-amber-200 uppercase font-mono">
                Saturación de Atención Local (España)
              </h4>
            </div>
            <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-mono text-amber-300">
              Superficie del Iceberg
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed mb-3">
            La atención pública nacional se concentra de forma casi exclusiva en las derivadas del choque ferroviario de alta velocidad, las declaraciones del ministro de Transportes y el cruce de reproches técnicos entre operadores.
          </p>
          <div className="space-y-1.5">
            {(regiones.ES?.fuentes || []).flatMap((f: any) =>
              (f.noticias || []).slice(0, 2).map((n: any, idx: number) => (
                <div key={idx} className="rounded-lg border border-slate-800 bg-slate-900/60 p-2 text-xs">
                  <span className="font-mono text-[10px] text-amber-400/80 mr-2">[{f.medio}]</span>
                  <span className="text-slate-200">{n.titulo}</span>
                </div>
              ))
            ).slice(0, 3)}
          </div>
        </div>

        {/* Lado B: Corrientes de Fondo y Puntos Ciegos Globales */}
        <div className="rounded-2xl border border-sky-500/20 bg-sky-500/5 p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between border-b border-sky-500/20 pb-2">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-sky-400" />
              <h4 className="text-xs font-semibold tracking-wider text-sky-200 uppercase font-mono">
                Puntos Ciegos / Corrientes Internacionales
              </h4>
            </div>
            <span className="rounded bg-sky-500/20 px-2 py-0.5 text-[10px] font-mono text-sky-300">
              Profundidad del Iceberg
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed mb-3">
            Acontecimientos con impacto sistémico que hoy no abren informativos españoles: la crisis institucional y despliegue policial en Varsovia por el Tribunal Constitucional, y el hackeo multimillonario a Binance vinculado a actores norcoreanos.
          </p>
          <div className="space-y-1.5">
            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-2 text-xs">
              <span className="font-mono text-[10px] text-sky-400/80 mr-2">[Polonia / UE]</span>
              <span className="text-slate-200">
                Choque institucional entre Tusk y la judicatura polaca con policías antidisturbios en Varsovia.
              </span>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-2 text-xs">
              <span className="font-mono text-[10px] text-sky-400/80 mr-2">[Cripto / Geopolítica]</span>
              <span className="text-slate-200">
                Robo récord de 6.300M$ a Binance atribuido a redes estatales de ciberdefensa de Corea del Norte.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Cuadrícula de Noticias por Bloque Territorial */}
      <div className="space-y-6">
        {codigosMostrados.map((cod) => {
          const reg = regiones[cod];
          if (!reg) return null;

          return (
            <div
              key={cod}
              className="rounded-2xl border border-slate-800 bg-[#0c121e]/90 p-5 shadow-lg"
            >
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-3">
                  <span className="rounded-lg bg-sky-500/10 px-2.5 py-1 font-mono text-xs font-bold text-sky-400 border border-sky-500/20">
                    {cod}
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-100">
                      {reg.nombre}
                    </h3>
                    <p className="text-[11px] text-slate-400">{reg.bloque}</p>
                  </div>
                </div>
                <span className="text-xs font-mono text-slate-500">
                  {reg.fuentes?.length || 0} cabeceras monitorizadas
                </span>
              </div>

              {/* Fuentes del bloque */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {(reg.fuentes || []).map((f: any, fIdx: number) => (
                  <div
                    key={fIdx}
                    className="flex flex-col justify-between rounded-xl border border-slate-800/80 bg-slate-900/40 p-4 transition-colors hover:border-slate-700"
                  >
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <span className="font-mono text-xs font-semibold text-slate-200">
                          {f.medio}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">
                          {f.perfil}
                        </span>
                      </div>

                      <div className="space-y-2.5">
                        {(f.noticias || []).slice(0, 3).map((n: any, nIdx: number) => (
                          <div key={nIdx} className="group">
                            <a
                              href={n.url || "#"}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-slate-300 font-medium group-hover:text-sky-300 transition-colors line-clamp-2"
                            >
                              • {n.titulo}
                            </a>
                            {n.resumen && (
                              <p className="mt-1 text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                                {n.resumen}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-3 border-t border-slate-800/60 pt-2 flex items-center justify-between text-[11px] text-slate-500">
                      <span className="font-mono">Estado: OK</span>
                      {f.noticias?.[0]?.url && (
                        <a
                          href={f.noticias[0].url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-sky-400/80 hover:text-sky-300"
                        >
                          <span>Fuente original</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
