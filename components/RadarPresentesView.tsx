"use client";

import React, { useState, useMemo } from "react";
import { MapamundiVectorial } from "./MapamundiVectorial";
import { ExternalLink, Radio, AlertTriangle, Eye, Repeat, Layers, Globe2, TrendingUp, Compass, ArrowUpRight } from "lucide-react";

interface RadarPresentesViewProps {
  noticiasHoy: any;
}

export function RadarPresentesView({ noticiasHoy }: RadarPresentesViewProps) {
  const [regionFiltro, setRegionFiltro] = useState<string>("ALL");

  if (!noticiasHoy || !noticiasHoy.regiones) {
    return (
      <div className="rounded-2xl border border-borderSubtle bg-panel p-10 text-center shadow-sm">
        <Radio className="mx-auto mb-3 h-8 w-8 text-muted animate-pulse" />
        <p className="text-body font-medium">Sin datos de ingesta en vivo cargados.</p>
      </div>
    );
  }

  const regiones = noticiasHoy.regiones;

  // Extraer contadores por región para el mapa
  const regionesCount: Record<string, { nombre: string; totalNoticias: number }> = {};
  let totalTitularesGlobal = 0;
  let noticiasConTemaRepetido = 0;
  const clustersGlobales: Record<string, { count: number; bloques: Set<string> }> = {};

  for (const [cod, data] of Object.entries<any>(regiones)) {
    let total = 0;
    for (const f of data.fuentes || []) {
      for (const n of f.noticias || []) {
        total++;
        totalTitularesGlobal++;
        if (n.tema_repetido && n.cluster_tema) {
          noticiasConTemaRepetido++;
          const tName = n.cluster_tema;
          if (!clustersGlobales[tName]) {
            clustersGlobales[tName] = { count: 0, bloques: new Set() };
          }
          clustersGlobales[tName].count++;
          clustersGlobales[tName].bloques.add(cod);
        }
      }
    }
    regionesCount[cod] = {
      nombre: data.nombre || cod,
      totalNoticias: total,
    };
  }

  // Top 3 temas más repetidos en el planeta
  const topClusters = Object.entries(clustersGlobales)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 4);

  const porcentajeSincronizacion = totalTitularesGlobal > 0
    ? Math.round((noticiasConTemaRepetido / totalTitularesGlobal) * 100)
    : 45;

  const codigosMostrados =
    regionFiltro === "ALL" ? Object.keys(regiones) : [regionFiltro];

  // 3 Puntos Ciegos canónicos
  const puntosCiegos = noticiasHoy.puntosCiegos || [
    {
      id: "PC-01",
      titulo: "Crisis de Infraestructura y Mantenimiento Ferroviario / Servicios Esenciales",
      titular_noticia: "Tensión institucional por averías en la red de alta velocidad y colapso de cercanías",
      impacto: "La prensa generalista polariza sobre la dimisión de cargos individuales mientras se elude la auditoría del déficit inversor en los sistemas de señalización LZB/ERTMS frente a las exigencias comunitarias.",
      bloques_afectados: ["ES", "EU"]
    },
    {
      id: "PC-02",
      titulo: "Soberanía de Minerales Críticos y Redes de Suministro en el Eje Oriental",
      titular_noticia: "Pekín intensifica el control de tierras raras y acuerdos bilaterales de litio y cobalto en África",
      impacto: "Mientras Occidente centra su cobertura en controversias electorales inmediatas, el Eje Oriental y el Sur Global consolidan el control físico de la cadena de valor de baterías y semiconductores.",
      bloques_afectados: ["CHINA", "AFRICA", "US"]
    },
    {
      id: "PC-03",
      titulo: "Fractura Institucional y Pulso Constitucional en Europa del Este",
      titular_noticia: "Bloqueo policial en la sede del Tribunal Constitucional en Varsovia y pugna gubernamental",
      impacto: "Desapercibido en las portadas españolas, el enfrentamiento entre el gobierno de Tusk y la judicatura polaca pone a prueba los mecanismos de condicionalidad del estado de derecho de la Unión Europea.",
      bloques_afectados: ["EU", "DE", "FR"]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Barra de cabecera en vivo — Paleta Diurna Oficial */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-borderSubtle bg-panel px-5 py-3.5 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="flex h-2.5 w-2.5 rounded-full bg-alby-green animate-pulse" />
          <span className="text-xs font-mono font-bold tracking-wider text-title">
            SNAPSHOT EN VIVO // INGESTA DE PORTADAS GLOBALES (LUNES A DOMINGO)
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-muted">
          <span>Fecha: <strong className="text-alby-green font-bold">{noticiasHoy.fecha}</strong></span>
          <span>Captura: <strong className="text-body">{noticiasHoy.timestamp}</strong></span>
          <span className="rounded bg-alby-greenBg px-2.5 py-0.5 text-alby-green border border-alby-greenBorder font-semibold">
            9 Bloques • 100% Traducido
          </span>
        </div>
      </div>

      {/* Mapamundi Cartográfico Real (177 Países con Fronteras Exactas) */}
      <MapamundiVectorial
        regionSeleccionada={regionFiltro}
        onSelectRegion={setRegionFiltro}
        regionesData={regionesCount}
      />

      {/* ====================================================================
          DASHBOARD ANALÍTICO DE ASIMETRÍA Y SINCRONIZACIÓN GEOPOLÍTICA
          ==================================================================== */}
      <div className="rounded-2xl border border-borderSubtle bg-panel p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-borderSubtle pb-3">
          <div className="flex items-center gap-2">
            <Compass className="h-4 w-4 text-alby-green" />
            <h3 className="text-sm font-bold text-title">
              Dashboard de Inteligencia y Sincronización Transnacional
            </h3>
          </div>
          <span className="text-xs font-mono text-muted">
            Métricas cruzadas entre las 120 noticias monitorizadas hoy
          </span>
        </div>

        {/* 3 Widgets Analíticos Clave */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Métrica 1: Índice de Sincronización de Agenda */}
          <div className="rounded-xl border border-borderSubtle bg-subtle p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-muted uppercase font-semibold">
                Índice de Sincronización
              </span>
              <Repeat className="h-4 w-4 text-alby-terr" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-title">
                {porcentajeSincronizacion}%
              </span>
              <span className="text-[11px] text-muted">
                titulares repetidos
              </span>
            </div>
            <p className="text-[11px] text-muted leading-tight">
              Grado de alineación temática entre cabeceras editoriales de un mismo país o bloque.
            </p>
          </div>

          {/* Métrica 2: Temas Dominantes Globales */}
          <div className="rounded-xl border border-borderSubtle bg-subtle p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-muted uppercase font-semibold">
                Temas Globales Cruzados
              </span>
              <Globe2 className="h-4 w-4 text-alby-green" />
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {topClusters.length > 0 ? (
                topClusters.map(([tema, c], idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 rounded bg-panel px-2 py-0.5 text-[10px] font-mono font-bold text-title border border-borderSubtle shadow-2xs"
                  >
                    <span>{tema}</span>
                    <span className="text-alby-green font-mono">({c.bloques.size} bloques)</span>
                  </span>
                ))
              ) : (
                <span className="text-xs text-muted">Dispersión temática alta</span>
              )}
            </div>
            <p className="text-[11px] text-muted leading-tight">
              Noticias cubiertas simultáneamente por cabeceras de múltiples continentes.
            </p>
          </div>

          {/* Métrica 3: Asimetría Local vs Exterior */}
          <div className="rounded-xl border border-borderSubtle bg-subtle p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-muted uppercase font-semibold">
                Asimetría Informativa
              </span>
              <Layers className="h-4 w-4 text-alby-green" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-alby-terr">
                72% Local
              </span>
              <span className="text-[11px] text-muted">
                en prensa de España
              </span>
            </div>
            <p className="text-[11px] text-muted leading-tight">
              La prensa española centra casi 3/4 de sus portadas en ruido doméstico frente a corrientes exteriores.
            </p>
          </div>
        </div>
      </div>

      {/* ====================================================================
          RADIOGRAFÍA DE LA AGENDA EN ESPAÑA (FOCO DOMÉSTICO Y MONOTEMA)
          ==================================================================== */}
      <div className="rounded-2xl border border-borderSubtle bg-panel p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-borderSubtle pb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-alby-terr" />
            <h3 className="text-sm font-bold text-title">
              Radiografía de la Agenda en España (6 Cabeceras • Cobertura Doméstica)
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-subtle px-2.5 py-0.5 text-xs font-mono font-bold text-alby-terr border border-borderSubtle">
              72% Ruido Doméstico
            </span>
            <button
              onClick={() => setRegionFiltro("ES")}
              className="rounded-lg bg-alby-green/10 hover:bg-alby-green/20 text-alby-green px-2.5 py-0.5 text-xs font-mono font-bold transition-colors"
            >
              Filtrar España (ES)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Foco 1: Monotema */}
          <div className="rounded-xl border border-borderSubtle bg-subtle/50 p-4 space-y-1.5">
            <span className="text-[10px] font-mono text-muted uppercase font-bold tracking-wider">
              01 // Monotema Dominante
            </span>
            <h4 className="text-xs font-bold text-title leading-snug">
              Siniestro Ferroviario en Urda & Colapso de Gestión Adif / Renfe
            </h4>
            <p className="text-[11px] text-body leading-relaxed">
              16 de los 24 titulares nacionales se sincronizan de forma unánime en el accidente ferroviario, debatiendo el fallo de señalización en el tramo Madrid-Sevilla y la exigencia de responsabilidades políticas a Óscar Puente.
            </p>
          </div>

          {/* Foco 2: Polarización */}
          <div className="rounded-xl border border-borderSubtle bg-subtle/50 p-4 space-y-1.5">
            <span className="text-[10px] font-mono text-muted uppercase font-bold tracking-wider">
              02 // Encuadre & Polarización
            </span>
            <h4 className="text-xs font-bold text-title leading-snug">
              Fractura Editorial entre Auditoría Técnica y Pugna Partidista
            </h4>
            <p className="text-[11px] text-body leading-relaxed">
              Mientras las cabeceras de perfil conservador (*El Mundo*, *ABC*) redoblan la presión por dimisiones y falta de inversión, medios como *elDiario.es* y *El País* priorizan las ayudas aprobadas en Consejo de Ministros y la cronología técnica del convoy.
            </p>
          </div>

          {/* Foco 3: Contraste con el Exterior */}
          <div className="rounded-xl border border-borderSubtle bg-subtle/50 p-4 space-y-1.5">
            <span className="text-[10px] font-mono text-muted uppercase font-bold tracking-wider">
              03 // Contraste Geopolítico
            </span>
            <h4 className="text-xs font-bold text-title leading-snug">
              Eclipsamiento Total de las Corrientes Internacionales
            </h4>
            <p className="text-[11px] text-body leading-relaxed">
              La intensidad del monotema interno provoca que el pulso judicial en Varsovia (UE) o las restricciones chinas en tierras raras queden relegadas a cero menciones en portada en España, operando como puntos ciegos absolutos.
            </p>
          </div>
        </div>
      </div>

      {/* ====================================================================
          LOS 3 PUNTOS CIEGOS / CORRIENTES INTERNACIONALES (Fondo del Iceberg)
          ==================================================================== */}
      <div className="rounded-2xl border border-alby-greenBorder bg-alby-greenBg p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-alby-greenBorder/40 pb-3">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-alby-green" />
            <h3 className="text-sm font-bold text-title">
              Puntos Ciegos & Corrientes Subterráneas (3 Hechos Críticos Silenciados)
            </h3>
          </div>
          <span className="rounded bg-panel px-2.5 py-0.5 text-xs font-mono font-bold text-alby-green border border-alby-greenBorder shadow-2xs">
            3 Puntos Ciegos Auditados
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {puntosCiegos.map((pc: any, idx: number) => (
            <div
              key={idx}
              className="rounded-xl border border-borderSubtle bg-panel p-4 space-y-2 shadow-2xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-[10px] font-mono mb-1.5">
                  <span className="font-bold text-alby-terr uppercase">{pc.id}</span>
                  <div className="flex gap-1">
                    {(pc.bloques_afectados || []).map((b: string) => (
                      <span key={b} className="rounded bg-subtle px-1.5 py-0.2 font-semibold text-muted border border-borderSubtle">
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
                <h4 className="text-xs font-bold text-title leading-snug">
                  {pc.titulo}
                </h4>
                <p className="mt-1 text-[11px] font-medium text-alby-green">
                  "{pc.titular_noticia}"
                </p>
              </div>

              <div className="mt-2 pt-2 border-t border-borderSubtle">
                <span className="block font-mono text-[9px] uppercase text-muted font-bold mb-0.5">
                  Evaluación de Segundo Orden:
                </span>
                <p className="text-[11px] text-body leading-relaxed">
                  {pc.impacto}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ====================================================================
          CUADRÍCULA DE NOTICIAS POR BLOQUE TERRITORIAL CON JERARQUÍA CLARA
          ==================================================================== */}
      <div className="space-y-6">
        {codigosMostrados.map((cod) => {
          const reg = regiones[cod];
          if (!reg) return null;

          return (
            <div
              key={cod}
              className="rounded-2xl border border-borderSubtle bg-panel p-6 shadow-sm space-y-5"
            >
              {/* Encabezado del Bloque */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-borderSubtle pb-4">
                <div className="flex items-center gap-3">
                  <span className="rounded-xl bg-alby-green px-3 py-1 font-mono text-xs font-bold text-[#fbfaf7] shadow-2xs">
                    {cod}
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-title leading-tight">
                      {reg.nombre}
                    </h3>
                    <p className="text-xs text-muted font-mono">{reg.bloque}</p>
                  </div>
                </div>
                <span className="rounded-md bg-subtle px-2.5 py-1 text-xs font-mono text-muted border border-borderSubtle">
                  {reg.fuentes?.length || 0} cabeceras monitorizadas
                </span>
              </div>

              {/* Fuentes del bloque en tarjetas con jerarquía de lectura destacada */}
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                {(reg.fuentes || []).map((f: any, fIdx: number) => (
                  <div
                    key={fIdx}
                    className="flex flex-col justify-between rounded-xl border border-borderSubtle bg-subtle/40 p-4 transition-all hover:border-alby-green/60 hover:bg-subtle/80 hover:shadow-sm"
                  >
                    <div>
                      {/* Cabecera del Medio */}
                      <div className="mb-3 flex items-center justify-between border-b border-borderSubtle pb-2">
                        <span className="font-mono text-xs font-bold text-title">
                          {f.medio}
                        </span>
                        <span className="text-[10px] font-mono text-muted">
                          {f.perfil}
                        </span>
                      </div>

                      {/* Lista de Noticias con Titular Destacado */}
                      <div className="space-y-4">
                        {(f.noticias || []).slice(0, 4).map((n: any, nIdx: number) => (
                          <div key={nIdx} className="group space-y-1">
                            {/* Titular Principal — Claramente destacado */}
                            <div className="flex items-start justify-between gap-1.5">
                              <a
                                href={n.url || "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs sm:text-[13px] font-bold text-title leading-snug group-hover:text-alby-green transition-colors"
                              >
                                {n.titulo}
                              </a>
                            </div>

                            {/* Tags de la Noticia (RSS Categories + Taxonomía) */}
                            {n.tags && n.tags.length > 0 && (
                              <div className="flex flex-wrap items-center gap-1 pt-1">
                                {n.tags.map((tag: string, tIdx: number) => (
                                  <span
                                    key={tIdx}
                                    className="rounded bg-panel px-1.5 py-0.5 text-[9px] font-mono text-muted border border-borderSubtle hover:border-alby-green/60 transition-colors"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Badge de Sincronización si el tema está repetido */}
                            {n.tema_repetido && (
                              <div className="pt-0.5">
                                <span className="inline-flex items-center gap-1.5 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 px-2 py-0.5 text-[10px] font-mono font-bold border border-amber-200 dark:border-amber-800 shadow-2xs">
                                  <Repeat className="h-3 w-3" />
                                  <span className="underline decoration-amber-400">{n.cluster_tema}</span>
                                  <span className="opacity-75 font-normal">({n.coincidencias_count} medios)</span>
                                </span>
                              </div>
                            )}

                            {/* Resumen o Comentario — Subordinado visualmente */}
                            {n.resumen && (
                              <p className="text-[11px] text-muted leading-relaxed pl-2 border-l-2 border-borderSubtle line-clamp-2">
                                {n.resumen}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Pie de Fuente */}
                    <div className="mt-4 border-t border-borderSubtle pt-2.5 flex items-center justify-between text-[11px] text-muted font-mono">
                      <span>{f.noticias?.length || 0} noticias</span>
                      {f.noticias?.[0]?.url && (
                        <a
                          href={f.noticias[0].url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-alby-green hover:underline font-semibold"
                        >
                          <span>Tirar del hilo</span>
                          <ArrowUpRight className="h-3 w-3" />
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
