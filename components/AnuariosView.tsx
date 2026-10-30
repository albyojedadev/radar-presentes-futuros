"use client";

import React, { useState } from "react";
import { FileText, Flame, Eye, Compass, ExternalLink, ShieldCheck } from "lucide-react";

interface AnuariosViewProps {
  anuarios: Record<string, { archivo: string; year: number; markdown: string }>;
}

export function AnuariosView({ anuarios }: AnuariosViewProps) {
  const anosDisponibles = Object.keys(anuarios).sort().reverse();
  const [anoSeleccionado, setAnoSeleccionado] = useState<string>("2026");

  const anuarioActivo = anuarios[anoSeleccionado];

  // Helper para parsear secciones clave del markdown
  const parsearSecciones = (md: string) => {
    if (!md) return { titulo: "", panoramica: "", humo: [], ciegos: [], pendientes: [] };

    const tituloMatch = md.match(/## (.*?)\n/);
    const titulo = tituloMatch ? tituloMatch[1] : `Auditoría Anual ${anoSeleccionado}`;

    return {
      titulo,
      raw: md,
    };
  };

  const dataParsed = anuarioActivo ? parsearSecciones(anuarioActivo.markdown) : null;

  return (
    <div className="space-y-6">
      {/* Selector de Anuario */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-[#0c121e]/90 p-4">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-sky-400 uppercase">
            // AUDITORÍAS DE SEGUNDO ORDEN //
          </span>
          <h2 className="text-base font-bold text-slate-100">
            Anuarios Estratégicos (Emitidos cada 1 de Enero)
          </h2>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          {anosDisponibles.map((a) => (
            <button
              key={a}
              onClick={() => setAnoSeleccionado(a)}
              className={`rounded-lg px-3 py-1.5 text-xs font-mono font-medium transition-all ${
                anoSeleccionado === a
                  ? "bg-sky-500 font-bold text-slate-950 shadow-md"
                  : "border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200"
              }`}
            >
              Anuario {a}
            </button>
          ))}
        </div>
      </div>

      {anuarioActivo ? (
        <div className="rounded-2xl border border-slate-800 bg-[#0c121e]/90 p-6 shadow-xl space-y-8">
          {/* Encabezado del Anuario */}
          <div className="border-b border-slate-800/80 pb-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="rounded bg-sky-500/20 text-sky-300 border border-sky-500/30 px-2 py-0.5 text-xs font-mono">
                EJERCICIO {anoSeleccionado}
              </span>
              <span className="text-xs font-mono text-slate-500">
                Auditado sobre 52/53 semanas de hemeroteca
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-100">
              {dataParsed?.titulo}
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Informe emitido canónicamente el 1 de enero posterior al ejercicio. Re-evaluación retrospectiva de la agenda informativa para separar el ruido mediático efímero de las transformaciones sistémicas.
            </p>
          </div>

          {/* Renderizado Estructurado del Markdown Anual */}
          <div className="prose prose-invert max-w-none prose-headings:font-mono prose-headings:text-slate-200 prose-p:text-slate-300 prose-p:text-xs prose-p:leading-relaxed prose-li:text-xs prose-li:text-slate-300 prose-blockquote:border-l-sky-500 prose-blockquote:bg-slate-900/40 prose-blockquote:py-1 prose-blockquote:px-3 prose-blockquote:text-slate-300 prose-a:text-sky-400 prose-a:no-underline hover:prose-a:underline">
            <div
              dangerouslySetInnerHTML={{
                __html: anuarioActivo.markdown
                  .replace(/^# .*/gm, "") // Quitar H1 repetido
                  .replace(/^## (.*$)/gim, '<h2 class="text-base font-bold text-sky-300 border-b border-slate-800 pb-2 mt-6 mb-3">$1</h2>')
                  .replace(/^### (.*$)/gim, '<h3 class="text-xs font-semibold text-slate-200 mt-4 mb-2">$1</h3>')
                  .replace(/^> (.*$)/gim, '<blockquote class="border-l-2 border-sky-500/50 bg-slate-900/60 p-2.5 rounded-r-lg my-2 text-xs text-slate-300">$1</blockquote>')
                  .replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-100 font-semibold">$1</strong>')
                  .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-sky-400 hover:text-sky-300 inline-flex items-center gap-1 font-mono text-[11px]">$1 ↗</a>')
                  .replace(/\n\n/g, "<br/>"),
              }}
            />
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8 text-center text-slate-400">
          No hay anuario disponible para el año seleccionado.
        </div>
      )}
    </div>
  );
}
