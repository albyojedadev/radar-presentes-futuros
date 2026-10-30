"use client";

import React from "react";

interface MapamundiVectorialProps {
  regionSeleccionada: string;
  onSelectRegion: (codigo: string) => void;
  regionesData: Record<string, { nombre: string; totalNoticias: number }>;
}

export function MapamundiVectorial({
  regionSeleccionada,
  onSelectRegion,
  regionesData,
}: MapamundiVectorialProps) {
  const bloques = [
    { id: "US", nombre: "EEUU", cx: 210, cy: 160, r: 28, label: "EEUU" },
    { id: "LATAM", nombre: "Latinoamérica", cx: 290, cy: 330, r: 34, label: "LATAM" },
    { id: "UK", nombre: "Reino Unido", cx: 460, cy: 120, r: 16, label: "UK" },
    { id: "ES", nombre: "España", cx: 450, cy: 175, r: 18, label: "ES" },
    { id: "FR", nombre: "Francia", cx: 480, cy: 150, r: 16, label: "FR" },
    { id: "DE", nombre: "Alemania", cx: 510, cy: 130, r: 16, label: "DE" },
    { id: "EU", nombre: "Unión Europea", cx: 525, cy: 165, r: 20, label: "EU" },
    { id: "AFRICA", nombre: "África", cx: 520, cy: 280, r: 38, label: "ÁFRICA" },
    { id: "CHINA", nombre: "China", cx: 740, cy: 180, r: 36, label: "CHINA" },
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-[#0c121e]/80 p-4 shadow-xl">
      <div className="mb-2 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-sky-400 uppercase">
            // MAPAMUNDI TÁCTICO //
          </span>
          <h3 className="text-sm font-semibold text-slate-200">
            Los 9 Bloques Geopolíticos
          </h3>
        </div>
        <span className="text-[11px] font-mono text-slate-500">
          Haz clic en cualquier nodo para filtrar
        </span>
      </div>

      <div className="relative aspect-[16/8] w-full max-h-[380px]">
        <svg
          viewBox="0 0 960 480"
          className="h-full w-full select-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="worldGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
            </radialGradient>
            <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#1e293b" strokeWidth="0.5" strokeOpacity="0.4" />
            </pattern>
          </defs>

          {/* Grid background */}
          <rect width="960" height="480" fill="url(#grid)" />
          <circle cx="480" cy="240" r="320" fill="url(#worldGlow)" />

          {/* Siluetas esquemáticas de continentes en tono neutro oscuro */}
          <g fill="#172235" opacity="0.6">
            {/* Norteamérica */}
            <path d="M 120 80 Q 230 60 270 120 T 260 210 Q 180 250 140 180 Z" />
            {/* Sudamérica */}
            <path d="M 250 250 Q 320 270 320 340 T 280 430 Q 240 370 250 250 Z" />
            {/* Europa */}
            <path d="M 440 90 Q 560 80 560 180 T 450 210 Q 420 140 440 90 Z" />
            {/* África */}
            <path d="M 450 210 Q 570 220 580 300 T 520 420 Q 440 350 450 210 Z" />
            {/* Asia */}
            <path d="M 570 80 Q 820 60 840 200 T 700 300 Q 600 230 570 80 Z" />
            {/* Oceanía */}
            <path d="M 760 330 Q 850 340 840 400 T 760 410 Z" />
          </g>

          {/* Líneas de conexión diplomática sutiles */}
          <g stroke="#38bdf8" strokeWidth="0.8" strokeDasharray="3 4" opacity="0.25">
            <line x1="210" y1="160" x2="480" y2="150" />
            <line x1="480" y1="150" x2="740" y2="180" />
            <line x1="520" y1="280" x2="740" y2="180" />
            <line x1="290" y1="330" x2="450" y2="175" />
          </g>

          {/* Bloques / Nodos interactivos */}
          {bloques.map((b) => {
            const isSelected = regionSeleccionada === b.id;
            const dataReg = regionesData[b.id];
            const count = dataReg ? dataReg.totalNoticias : 0;

            return (
              <g
                key={b.id}
                onClick={() => onSelectRegion(isSelected ? "ALL" : b.id)}
                className="cursor-pointer transition-transform duration-200"
                style={{ transformOrigin: `${b.cx}px ${b.cy}px` }}
              >
                {/* Aura de pulso si está seleccionado */}
                {isSelected && (
                  <circle
                    cx={b.cx}
                    cy={b.cy}
                    r={b.r + 10}
                    fill="#38bdf8"
                    opacity="0.2"
                    className="animate-ping"
                  />
                )}

                {/* Base del nodo */}
                <circle
                  cx={b.cx}
                  cy={b.cy}
                  r={b.r}
                  fill={isSelected ? "#38bdf8" : "#0f172a"}
                  stroke={isSelected ? "#bae6fd" : "#334155"}
                  strokeWidth={isSelected ? "2.5" : "1.5"}
                  className="transition-colors hover:stroke-sky-400"
                />

                {/* Texto del bloque */}
                <text
                  x={b.cx}
                  y={b.cy - 2}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={isSelected ? "#090d16" : "#f1f5f9"}
                  fontSize="10"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  {b.label}
                </text>

                {/* Contador de noticias */}
                <text
                  x={b.cx}
                  y={b.cy + 10}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={isSelected ? "#090d16" : "#38bdf8"}
                  fontSize="9"
                  fontFamily="monospace"
                >
                  {count > 0 ? `${count} tit` : ""}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Barra de filtrado rápido */}
      <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-slate-800/80 pt-3">
        <button
          onClick={() => onSelectRegion("ALL")}
          className={`rounded-lg px-2.5 py-1 text-xs font-mono font-medium transition-all ${
            regionSeleccionada === "ALL"
              ? "bg-slate-100 text-slate-900"
              : "border border-slate-800 bg-slate-900/40 text-slate-400 hover:text-slate-200"
          }`}
        >
          GLOBAL (TODOS)
        </button>
        {bloques.map((b) => (
          <button
            key={b.id}
            onClick={() => onSelectRegion(b.id)}
            className={`rounded-lg px-2 py-1 text-xs font-mono transition-all ${
              regionSeleccionada === b.id
                ? "bg-sky-500 font-bold text-slate-950 shadow-sm"
                : "border border-slate-800/60 bg-slate-900/30 text-slate-400 hover:border-slate-700 hover:text-slate-300"
            }`}
          >
            {b.id} ({b.nombre})
          </button>
        ))}
      </div>
    </div>
  );
}
