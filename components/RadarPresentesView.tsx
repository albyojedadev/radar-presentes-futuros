"use client";

import React, { useState } from "react";
import { MapamundiVectorial } from "./MapamundiVectorial";
import { ExternalLink, Radio, AlertTriangle, Eye } from "lucide-react";

interface RadarPresentesViewProps {
  noticiasHoy: any;
}

export function RadarPresentesView({ noticiasHoy }: RadarPresentesViewProps) {
  const [regionFiltro, setRegionFiltro] = useState<string>("ALL");

  if (!noticiasHoy || !noticiasHoy.regiones) {
    return (
      <div className="rounded-2xl border border-cardBorder bg-card p-10 text-center">
        <Radio className="mx-auto mb-3 h-8 w-8 text-alby-muted animate-pulse" />
        <p className="text-alby-cream">Sin datos de ingesta en vivo cargados.</p>
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

  const codigosMostrados =
    regionFiltro === "ALL" ? Object.keys(regiones) : [regionFiltro];

  return (
    <div className="space-y-6">
      {/* Barra de cabecera en vivo */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-cardBorder bg-card px-5 py-3.5 shadow-md">
        <div className="flex items-center gap-3">
          <span className="flex h-2.5 w-2.5 rounded-full bg-alby-green animate-pulse" />
          <span className="text-xs font-mono font-bold tracking-wider text-alby-light">
            SNAPSHOT EN VIVO // INGESTA DE PORTADAS GLOBALES
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono text-alby-pale">
          <span>Fecha: <strong className="text-alby-green">{noticiasHoy.fecha}</strong></span>
          <span>Captura: <strong className="text-alby-cream">{noticiasHoy.timestamp}</strong></span>
          <span className="rounded bg-alby-green/15 px-2.5 py-0.5 text-alby-green border border-alby-green/30 font-semibold">
            9 Bloques en Tiempo Real
          </span>
        </div>
      </div>

      {/* Mapamundi Vectorial Geográfico */}
      <MapamundiVectorial
        regionSeleccionada={regionFiltro}
        onSelectRegion={setRegionFiltro}
        regionesData={regionesCount}
      />

      {/* Bloque Destacado: El Iceberg Mediático de Hoy */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Lado A: Foco Superficial / España */}
        <div className="rounded-2xl border border-alby-terr/40 bg-alby-terr/10 p-5 shadow-lg">
          <div className="mb-3 flex items-center justify-between border-b border-alby-terr/30 pb-2.5">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-alby-terr" />
              <h4 className="text-xs font-bold tracking-wider text-alby-light uppercase font-mono">
                Saturación de Atención Local (España)
              </h4>
            </div>
            <span className="rounded bg-alby-terr/30 px-2 py-0.5 text-[10px] font-mono text-alby-light border border-alby-terr/40 font-semibold">
              Superficie del Iceberg
            </span>
          </div>
          <p className="text-xs text-alby-cream leading-relaxed mb-4">
            La atención pública nacional se concentra de forma casi exclusiva en las derivadas del choque ferroviario de alta velocidad, las declaraciones del ministro de Transportes y el cruce de reproches técnicos entre operadores.
          </p>
          <div className="space-y-2">
            {(regiones.ES?.fuentes || []).flatMap((f: any) =>
              (f.noticias || []).slice(0, 2).map((n: any, idx: number) => (
                <div key={idx} className="rounded-xl border border-cardBorder bg-dark/80 p-2.5 text-xs">
                  <span className="font-mono text-[10px] text-alby-terr font-semibold mr-2">[{f.medio}]</span>
                  <span className="text-alby-light font-medium">{n.titulo}</span>
                </div>
              ))
            ).slice(0, 3)}
          </div>
        </div>

        {/* Lado B: Corrientes de Fondo y Puntos Ciegos Globales */}
        <div className="rounded-2xl border border-alby-green/40 bg-alby-green/10 p-5 shadow-lg">
          <div className="mb-3 flex items-center justify-between border-b border-alby-green/30 pb-2.5">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-alby-green" />
              <h4 className="text-xs font-bold tracking-wider text-alby-light uppercase font-mono">
                Puntos Ciegos / Corrientes Internacionales
              </h4>
            </div>
            <span className="rounded bg-alby-green/30 px-2 py-0.5 text-[10px] font-mono text-alby-light border border-alby-green/40 font-semibold">
              Profundidad del Iceberg
            </span>
          </div>
          <p className="text-xs text-alby-cream leading-relaxed mb-4">
            Acontecimientos con impacto sistémico que hoy no abren informativos españoles: la crisis institucional y despliegue policial en Varsovia por el Tribunal Constitucional, y el hackeo multimillonario a Binance vinculado a actores norcoreanos.
          </p>
          <div className="space-y-2">
            <div className="rounded-xl border border-cardBorder bg-dark/80 p-2.5 text-xs">
              <span className="font-mono text-[10px] text-alby-green font-semibold mr-2">[Polonia / UE]</span>
              <span className="text-alby-light font-medium">
                Choque institucional entre Tusk y la judicatura polaca con policías antidisturbios en Varsovia.
              </span>
            </div>
            <div className="rounded-xl border border-cardBorder bg-dark/80 p-2.5 text-xs">
              <span className="font-mono text-[10px] text-alby-green font-semibold mr-2">[Cripto / Geopolítica]</span>
              <span className="text-alby-light font-medium">
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
              className="rounded-2xl border border-cardBorder bg-card p-6 shadow-xl"
            >
              <div className="mb-5 flex flex-wrap items-center justify-between gap-2 border-b border-cardBorder pb-3.5">
                <div className="flex items-center gap-3">
                  <span className="rounded-lg bg-alby-green/20 px-3 py-1 font-mono text-xs font-bold text-alby-green border border-alby-green/40">
                    {cod}
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-alby-light">
                      {reg.nombre}
                    </h3>
                    <p className="text-xs text-alby-pale font-mono">{reg.bloque}</p>
                  </div>
                </div>
                <span className="text-xs font-mono text-alby-muted">
                  {reg.fuentes?.length || 0} cabeceras monitorizadas
                </span>
              </div>

              {/* Fuentes del bloque */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {(reg.fuentes || []).map((f: any, fIdx: number) => (
                  <div
                    key={fIdx}
                    className="flex flex-col justify-between rounded-xl border border-cardBorder bg-dark/70 p-4 transition-all hover:border-alby-green/50 hover:bg-cardHover"
                  >
                    <div>
                      <div className="mb-2.5 flex items-center justify-between border-b border-cardBorder/60 pb-2">
                        <span className="font-mono text-xs font-bold text-alby-light">
                          {f.medio}
                        </span>
                        <span className="text-[10px] font-mono text-alby-muted">
                          {f.perfil}
                        </span>
                      </div>

                      <div className="space-y-3">
                        {(f.noticias || []).slice(0, 3).map((n: any, nIdx: number) => (
                          <div key={nIdx} className="group">
                            <a
                              href={n.url || "#"}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs font-medium text-alby-light leading-snug group-hover:text-alby-green transition-colors line-clamp-2"
                            >
                              • {n.titulo}
                            </a>
                            {n.resumen && (
                              <p className="mt-1 text-[11px] text-alby-pale line-clamp-2 leading-relaxed">
                                {n.resumen}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 border-t border-cardBorder/60 pt-2.5 flex items-center justify-between text-[11px] text-alby-muted font-mono">
                      <span>{f.noticias?.length || 0} noticias</span>
                      {f.noticias?.[0]?.url && (
                        <a
                          href={f.noticias[0].url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-alby-green hover:underline font-semibold"
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
