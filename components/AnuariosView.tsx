"use client";

import React, { useState } from "react";
import { FileText, Flame, Eye, Compass, ExternalLink, ArrowRight, CheckCircle2, Calendar, Sparkles } from "lucide-react";

interface AnuariosViewProps {
  anuarios: Record<string, { archivo: string; year: number; markdown: string }>;
}

interface ItemHumo {
  titulo: string;
  url: string;
  evaluacion: string;
}

interface ItemCiego {
  titulo: string;
  url: string;
  impacto: string;
}

interface EstacionAnual {
  estacion: string;
  meses: string;
  relato: string;
}

interface AnuarioEstructurado {
  titulo: string;
  subtitulo: string;
  fechaEmision: string;
  tipoDocumento: string;
  panoramica: string;
  estaciones: EstacionAnual[];
  campanasHumo: ItemHumo[];
  puntosCiegos: ItemCiego[];
  framing: string;
  cuentasPendientes: string[];
}

export function AnuariosView({ anuarios }: AnuariosViewProps) {
  const anosDisponibles = Object.keys(anuarios).sort().reverse();
  const [anoSeleccionado, setAnoSeleccionado] = useState<string>("2026");
  const [estacionActivaIdx, setEstacionActivaIdx] = useState<number>(0);

  const anuarioActivo = anuarios[anoSeleccionado];

  // Parser robusto de las secciones editoriales del Markdown del anuario
  const parsearAnuario = (md: string): AnuarioEstructurado => {
    if (!md) {
      return {
        titulo: `Auditoría Anual ${anoSeleccionado}`,
        subtitulo: "",
        fechaEmision: "",
        tipoDocumento: "Anuario Estratégico de Segundo Orden",
        panoramica: "",
        estaciones: [],
        campanasHumo: [],
        puntosCiegos: [],
        framing: "",
        cuentasPendientes: [],
      };
    }

    const lineas = md.split("\n");
    let titulo = `Auditoría Anual ${anoSeleccionado}`;
    let subtitulo = "";
    let fechaEmision = "";
    let tipoDocumento = "Anuario Estratégico de Segundo Orden";

    for (let i = 0; i < Math.min(10, lineas.length); i++) {
      const l = lineas[i].trim();
      if (l.startsWith("# ") && !titulo.includes("—")) {
        titulo = l.replace(/^#\s+/, "").replace(/^[^\w\s]+/, "").trim();
      } else if (l.startsWith("## ") && !l.includes("1.") && !subtitulo) {
        subtitulo = l.replace(/^##\s+/, "").trim();
      } else if (l.includes("Fecha de Emisión Canónica") || l.includes("Fecha de Emisi")) {
        fechaEmision = l.split(":")[1]?.replace(/[*_]/g, "").trim() || "";
      } else if (l.includes("Tipo de Documento")) {
        tipoDocumento = l.split(":")[1]?.replace(/[*_]/g, "").trim() || "";
      }
    }

    let seccionActual = "";
    let panoramica = "";
    const estaciones: EstacionAnual[] = [];
    const campanasHumo: ItemHumo[] = [];
    const puntosCiegos: ItemCiego[] = [];
    let framing = "";
    const cuentasPendientes: string[] = [];

    let currentItem: { titulo: string; url: string; detalle: string } | null = null;
    let currentEstacion: { estacion: string; meses: string; relato: string } | null = null;

    for (let i = 0; i < lineas.length; i++) {
      const l = lineas[i].trim();

      if (l.includes("1. Visión Panorámica") || l.includes("1. Visi")) {
        seccionActual = "panoramica";
        continue;
      } else if (l.includes("2. Crónica del Año") || l.includes("2. Cr")) {
        seccionActual = "estaciones";
        continue;
      } else if (l.includes("Campañas de Humo") || l.includes("Campa")) {
        if (currentEstacion) {
          estaciones.push(currentEstacion);
          currentEstacion = null;
        }
        seccionActual = "humo";
        continue;
      } else if (l.includes("Lo que Pasó Desapercibido") || l.includes("Lo que Pas")) {
        if (currentItem && seccionActual === "humo") {
          campanasHumo.push({ titulo: currentItem.titulo, url: currentItem.url, evaluacion: currentItem.detalle });
          currentItem = null;
        }
        seccionActual = "ciegos";
        continue;
      } else if (l.includes("Divergencia") || l.includes("Tablero Global")) {
        if (currentItem && seccionActual === "ciegos") {
          puntosCiegos.push({ titulo: currentItem.titulo, url: currentItem.url, impacto: currentItem.detalle });
          currentItem = null;
        }
        seccionActual = "framing";
        continue;
      } else if (l.includes("Lecciones") || l.includes("Corrientes Abiertas") || l.includes("Cuentas Pendientes")) {
        seccionActual = "pendientes";
        continue;
      } else if (l.includes("Metodología") || l.includes("Metodolog")) {
        seccionActual = "metodologia";
        continue;
      }

      if (seccionActual === "panoramica") {
        if (l && !l.startsWith("---") && !l.startsWith("#")) {
          panoramica += (panoramica ? " " : "") + l;
        }
      } else if (seccionActual === "estaciones") {
        if (l.startsWith("### ")) {
          if (currentEstacion) {
            estaciones.push(currentEstacion);
          }
          const raw = l.replace(/^###\s+/, "").replace(/^[^\w\s]+/, "").trim();
          const matchMeses = raw.match(/\((.*?)\)/);
          const meses = matchMeses ? matchMeses[1] : "";
          const nombreEstacion = raw.replace(/\(.*?\)/, "").trim();
          currentEstacion = { estacion: nombreEstacion, meses, relato: "" };
        } else if (currentEstacion && l && !l.startsWith("---") && !l.startsWith("#")) {
          currentEstacion.relato += (currentEstacion.relato ? " " : "") + l;
        }
      } else if (seccionActual === "humo") {
        if (l.startsWith("### ")) {
          if (currentItem) {
            campanasHumo.push({ titulo: currentItem.titulo, url: currentItem.url, evaluacion: currentItem.detalle });
          }
          const matchLink = l.match(/\[(.*?)\]\((.*?)\)/);
          if (matchLink) {
            currentItem = { titulo: matchLink[1], url: matchLink[2], detalle: "" };
          } else {
            currentItem = { titulo: l.replace(/^###\s+/, "").replace(/^[^\w\s]+/, "").trim(), url: "", detalle: "" };
          }
        } else if (currentItem && (l.startsWith(">") || l.includes("Evaluación") || l.includes("Evaluaci") || l.includes("Realidad"))) {
          const texto = l.replace(/^>\s*/, "").replace(/\*\*.*?\*\*:\s*/i, "").trim();
          currentItem.detalle += (currentItem.detalle ? " " : "") + texto;
        }
      } else if (seccionActual === "ciegos") {
        if (l.startsWith("### ")) {
          if (currentItem) {
            puntosCiegos.push({ titulo: currentItem.titulo, url: currentItem.url, impacto: currentItem.detalle });
          }
          const matchLink = l.match(/\[(.*?)\]\((.*?)\)/);
          if (matchLink) {
            currentItem = { titulo: matchLink[1], url: matchLink[2], detalle: "" };
          } else {
            currentItem = { titulo: l.replace(/^###\s+/, "").replace(/^[^\w\s]+/, "").trim(), url: "", detalle: "" };
          }
        } else if (currentItem && (l.startsWith(">") || l.includes("Impacto") || l.includes("Silenciado") || l.includes("Fondo"))) {
          const texto = l.replace(/^>\s*/, "").replace(/\*\*.*?\*\*:\s*/i, "").trim();
          currentItem.detalle += (currentItem.detalle ? " " : "") + texto;
        }
      } else if (seccionActual === "framing") {
        if (l && !l.startsWith("---") && !l.startsWith("#")) {
          framing += (framing ? " " : "") + l;
        }
      } else if (seccionActual === "pendientes") {
        if (l.startsWith("- **") || l.startsWith("- ") || l.startsWith("* ")) {
          const bullet = l.replace(/^[-*]\s+(\*\*)?/, "").replace(/(\*\*)?$/, "").trim();
          if (bullet) cuentasPendientes.push(bullet);
        }
      }
    }

    if (currentEstacion) {
      estaciones.push(currentEstacion);
    }

    if (currentItem) {
      if (seccionActual === "humo") {
        campanasHumo.push({ titulo: currentItem.titulo, url: currentItem.url, evaluacion: currentItem.detalle });
      } else if (seccionActual === "ciegos") {
        puntosCiegos.push({ titulo: currentItem.titulo, url: currentItem.url, impacto: currentItem.detalle });
      }
    }

    return {
      titulo,
      subtitulo: subtitulo || `Balance y Crónica Retrospectiva ${anoSeleccionado}`,
      fechaEmision: fechaEmision || `${anoSeleccionado}-12-31`,
      tipoDocumento,
      panoramica,
      estaciones,
      campanasHumo,
      puntosCiegos,
      framing,
      cuentasPendientes,
    };
  };

  const parsed = anuarioActivo ? parsearAnuario(anuarioActivo.markdown) : null;

  return (
    <div className="space-y-6">
      {/* Selector de Anuario — Paleta Diurna Oficial */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-borderSubtle bg-panel p-5 shadow-sm">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-alby-terr uppercase font-bold">
            // AUDITORÍAS DE SEGUNDO ORDEN //
          </span>
          <h2 className="text-base font-bold text-title">
            Anuarios Estratégicos (Emitidos cada 1 de Enero)
          </h2>
          <p className="text-xs text-muted mt-0.5">
            Separación retrospectiva de la espuma mediática efímera frente a las transformaciones geopolíticas reales.
          </p>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          {anosDisponibles.map((a) => {
            const isActive = anoSeleccionado === a;
            return (
              <button
                key={a}
                onClick={() => setAnoSeleccionado(a)}
                className={`rounded-xl px-3.5 py-2 text-xs font-mono font-bold transition-all ${
                  isActive
                    ? "bg-alby-green text-[#fbfaf7] shadow-sm"
                    : "border border-borderSubtle bg-subtle text-muted hover:text-title"
                }`}
              >
                Anuario {a}
              </button>
            );
          })}
        </div>
      </div>

      {parsed ? (
        <div className="space-y-6">
          {/* Tarjeta Hero: Encabezado Editorial */}
          <div className="rounded-2xl border border-borderSubtle bg-panel p-6 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-borderSubtle pb-4">
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-alby-greenBg text-alby-green border border-alby-greenBorder px-2.5 py-1 text-xs font-mono font-bold">
                  EJERCICIO {anoSeleccionado}
                </span>
                <span className="text-xs font-mono text-muted">
                  Auditado sobre 52/53 semanas de hemeroteca
                </span>
              </div>
              <div className="text-[11px] font-mono text-muted">
                Emisión Canónica: <strong className="text-title">{parsed.fechaEmision}</strong>
              </div>
            </div>

            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-title leading-snug">
                {parsed.subtitulo}
              </h1>
              <p className="text-xs font-mono text-alby-terr font-medium mt-1">
                {parsed.tipoDocumento}
              </p>
            </div>

            {/* 1. Visión Panorámica */}
            {parsed.panoramica && (
              <div className="rounded-xl border border-borderSubtle bg-subtle p-5 text-xs leading-relaxed space-y-2.5">
                <div className="flex items-center gap-2 text-alby-green font-mono text-xs font-bold uppercase tracking-wider">
                  <Compass className="h-4 w-4" />
                  <span>1. Visión Panorámica del Ejercicio</span>
                </div>
                <p className="text-body text-sm leading-relaxed font-normal">
                  {parsed.panoramica}
                </p>
              </div>
            )}
          </div>

          {/* ====================================================================
              2. CRÓNICA DEL AÑO EN CUATRO ESTACIONES (LA HISTORIA COMPLETA)
              ==================================================================== */}
          {parsed.estaciones.length > 0 && (
            <div className="rounded-2xl border border-borderSubtle bg-panel p-6 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-borderSubtle pb-3">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-alby-greenBg p-1.5 text-alby-green border border-alby-greenBorder">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-title">
                      2. Crónica del Año en Cuatro Estaciones
                    </h3>
                    <span className="text-[10px] font-mono text-muted uppercase">
                      El relato continuo y accesible de los acontecimientos que marcaron el ejercicio
                    </span>
                  </div>
                </div>

                {/* Selector de Estaciones */}
                <div className="flex items-center gap-1.5 overflow-x-auto">
                  {parsed.estaciones.map((est, idx) => {
                    const isActiva = (estacionActivaIdx || 0) === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => setEstacionActivaIdx(idx)}
                        className={`rounded-lg px-3 py-1.5 text-xs font-mono font-bold transition-all ${
                          isActiva
                            ? "bg-alby-green text-[#fbfaf7] shadow-xs"
                            : "border border-borderSubtle bg-subtle text-muted hover:text-title hover:border-alby-green"
                        }`}
                      >
                        {est.estacion.split(":")[0] || `Fase ${idx + 1}`}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Contenido de la Estación Activa */}
              {(() => {
                const est = parsed.estaciones[estacionActivaIdx || 0] || parsed.estaciones[0];
                return (
                  <div className="rounded-xl border border-borderSubtle bg-subtle/50 p-5 space-y-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="text-sm font-bold text-title">
                        {est.estacion}
                      </h4>
                      {est.meses && (
                        <span className="rounded-md bg-panel border border-borderSubtle px-2.5 py-0.5 text-xs font-mono text-muted font-medium">
                          {est.meses}
                        </span>
                      )}
                    </div>
                    <p className="text-body text-sm leading-relaxed pt-1">
                      {est.relato}
                    </p>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Bloque Doble: Campañas de Humo vs Puntos Ciegos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 3. Campañas de Humo (Terracota) */}
            <div className="rounded-2xl border border-alby-terrBorder bg-alby-terrBg/40 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-borderSubtle pb-3">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-alby-terrBg p-1.5 text-alby-terr border border-alby-terrBorder">
                    <Flame className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-title">
                      3. Campañas de Humo y Distracciones
                    </h3>
                    <span className="text-[10px] font-mono text-alby-terr uppercase font-semibold">
                      Superficie del Iceberg // Ruido Mediático
                    </span>
                  </div>
                </div>
                <span className="rounded bg-panel px-2 py-0.5 text-xs font-mono font-bold text-alby-terr border border-alby-terrBorder">
                  {parsed.campanasHumo.length} analizadas
                </span>
              </div>

              <div className="space-y-3">
                {parsed.campanasHumo.map((item, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-borderSubtle bg-panel p-4 space-y-2.5 transition-all hover:border-alby-terr"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h4 className="text-xs font-bold text-title leading-snug">
                        {item.titulo}
                      </h4>
                      {item.url && (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0 inline-flex items-center gap-1 rounded bg-subtle px-2 py-1 text-[10px] font-mono text-alby-terr hover:text-title border border-borderSubtle"
                          title="Tirar del hilo sobre la hemeroteca original"
                        >
                          <span>Tirar del hilo</span>
                          <ExternalLink className="h-2.5 w-2.5" />
                        </a>
                      )}
                    </div>

                    {item.evaluacion && (
                      <div className="rounded-lg bg-subtle border-l-2 border-alby-terr p-2.5 text-xs text-body space-y-1">
                        <span className="font-mono text-[10px] uppercase text-alby-terr font-bold block">
                          La Realidad de Fondo:
                        </span>
                        <p className="text-xs leading-relaxed text-muted">
                          {item.evaluacion}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Puntos Ciegos y Transformaciones Silenciosas (Verde Alby) */}
            <div className="rounded-2xl border border-alby-greenBorder bg-alby-greenBg/40 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-borderSubtle pb-3">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-alby-greenBg p-1.5 text-alby-green border border-alby-greenBorder">
                    <Eye className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-title">
                      4. Lo que Pasó Desapercibido
                    </h3>
                    <span className="text-[10px] font-mono text-alby-green uppercase font-semibold">
                      Fondo del Iceberg // Transformaciones Reales
                    </span>
                  </div>
                </div>
                <span className="rounded bg-panel px-2 py-0.5 text-xs font-mono font-bold text-alby-green border border-alby-greenBorder">
                  {parsed.puntosCiegos.length} analizados
                </span>
              </div>

              <div className="space-y-3">
                {parsed.puntosCiegos.map((item, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-borderSubtle bg-panel p-4 space-y-2.5 transition-all hover:border-alby-green"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h4 className="text-xs font-bold text-title leading-snug">
                        {item.titulo}
                      </h4>
                      {item.url && (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0 inline-flex items-center gap-1 rounded bg-subtle px-2 py-1 text-[10px] font-mono text-alby-green hover:text-title border border-borderSubtle"
                          title="Tirar del hilo sobre la hemeroteca original"
                        >
                          <span>Tirar del hilo</span>
                          <ExternalLink className="h-2.5 w-2.5" />
                        </a>
                      )}
                    </div>

                    {item.impacto && (
                      <div className="rounded-lg bg-subtle border-l-2 border-alby-green p-2.5 text-xs text-body space-y-1">
                        <span className="font-mono text-[10px] uppercase text-alby-green font-bold block">
                          El Fondo del Asunto:
                        </span>
                        <p className="text-xs leading-relaxed text-muted">
                          {item.impacto}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bloque Inferior: Framing Transnacional & Conclusiones */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* 5. Divergencia de Framing */}
            {parsed.framing && (
              <div className="rounded-2xl border border-borderSubtle bg-panel p-5 shadow-sm lg:col-span-7 space-y-3">
                <div className="flex items-center gap-2 border-b border-borderSubtle pb-3">
                  <FileText className="h-4 w-4 text-alby-green" />
                  <h3 className="text-sm font-bold text-title">
                    5. El Tablero Global: Divergencia de Miradas
                  </h3>
                </div>
                <p className="text-xs leading-relaxed text-body">
                  {parsed.framing}
                </p>
              </div>
            )}

            {/* 6. Lecciones y Cuentas Pendientes */}
            {parsed.cuentasPendientes.length > 0 && (
              <div className="rounded-2xl border border-borderSubtle bg-panel p-5 shadow-sm lg:col-span-5 space-y-3">
                <div className="flex items-center gap-2 border-b border-borderSubtle pb-3">
                  <ArrowRight className="h-4 w-4 text-alby-terr" />
                  <h3 className="text-sm font-bold text-title">
                    6. Lecciones y Corrientes para {parseInt(anoSeleccionado) + 1}
                  </h3>
                </div>
                <div className="space-y-2">
                  {parsed.cuentasPendientes.map((cuenta, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 text-xs text-muted bg-subtle p-2.5 rounded-lg border border-borderSubtle"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-alby-green shrink-0 mt-0.5" />
                      <span className="leading-snug text-title font-medium">{cuenta}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-borderSubtle bg-panel p-8 text-center text-muted">
          No hay informe anual archivado para el ejercicio seleccionado.
        </div>
      )}
    </div>
  );
}
