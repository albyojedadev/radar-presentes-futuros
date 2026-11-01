"use client";

import React, { useState, useEffect } from "react";
import paisesDataStatic from "@/public/data/paises_mapamundi.json";

interface MapamundiVectorialProps {
  regionSeleccionada: string;
  onSelectRegion: (codigo: string) => void;
  regionesData: Record<string, { nombre: string; totalNoticias: number }>;
}

interface PaisGeo {
  id: string;
  name: string;
  bloque: string | null;
  d: string;
}

export function MapamundiVectorial({
  regionSeleccionada,
  onSelectRegion,
  regionesData,
}: MapamundiVectorialProps) {
  const [hoveredPais, setHoveredPais] = useState<{ name: string; bloque: string | null } | null>(null);
  const paises: PaisGeo[] = paisesDataStatic as PaisGeo[];

  // Coordenadas tácticas exactas sobre los centros neurálgicos de cada uno de los 9 bloques
  const marcadores = [
    { id: "ES", nombre: "España", x: 494, y: 153, label: "ESPAÑA", cod: "ES" },
    { id: "FR", nombre: "Francia", x: 508, y: 135, label: "FRANCIA", cod: "FR" },
    { id: "DE", nombre: "Alemania", x: 529, y: 119, label: "ALEMANIA", cod: "DE" },
    { id: "UK", nombre: "Reino Unido", x: 494, y: 108, label: "UK", cod: "UK" },
    { id: "EU", nombre: "Unión Europea", x: 516, y: 125, label: "UE (BRUSELAS)", cod: "EU" },
    { id: "US", nombre: "EEUU", x: 240, y: 155, label: "EEUU", cod: "US" },
    { id: "LATAM", nombre: "Latinoamérica", x: 310, y: 325, label: "LATAM", cod: "LATAM" },
    { id: "AFRICA", nombre: "África", x: 555, y: 285, label: "ÁFRICA", cod: "AFRICA" },
    { id: "CHINA", nombre: "China", x: 790, y: 175, label: "CHINA", cod: "CHINA" },
  ];

  const getPaisFill = (pais: PaisGeo) => {
    const isSelected = regionSeleccionada === pais.bloque;
    const isHovered = hoveredPais && hoveredPais.bloque === pais.bloque;

    if (isSelected) {
      return "var(--alby-green, #4d6b35)";
    }
    if (isHovered && pais.bloque) {
      return "var(--alby-terr, #b3512e)";
    }
    if (pais.bloque) {
      // Perteneciente a un bloque monitorizado
      return "#d6cfbe";
    }
    // Resto del mundo
    return "#e8e3d5";
  };

  const getPaisStroke = (pais: PaisGeo) => {
    if (regionSeleccionada === pais.bloque) {
      return "#2d441c";
    }
    return "#c2b8a3";
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-borderSubtle bg-panel p-5 shadow-sm space-y-4">
      {/* Cabecera del Mapa */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-borderSubtle pb-3">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 rounded-full bg-alby-green animate-pulse" />
          <span className="text-[11px] font-mono tracking-widest text-alby-green uppercase font-bold">
            // MAPAMUNDI CARTOGRÁFICO REAL //
          </span>
          <span className="text-sm font-bold text-title ml-1">
            Fronteras Oficiales (177 Países) • 9 Bloques Activos
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-muted">
          {hoveredPais ? (
            <span className="rounded bg-alby-greenBg px-2 py-0.5 text-alby-green font-semibold border border-alby-greenBorder">
              {hoveredPais.name} {hoveredPais.bloque ? `[${hoveredPais.bloque}]` : "(Sin monitorizar)"}
            </span>
          ) : (
            <span>Pasa el cursor o haz clic en cualquier país o nodo</span>
          )}
        </div>
      </div>

      {/* Visor SVG de Alta Definición con Proyección Cartográfica */}
      <div className="relative aspect-[1000/510] w-full rounded-xl border border-borderSubtle bg-[#eef3f7] dark:bg-[#0c0b09] overflow-hidden shadow-inner">
        <svg
          viewBox="0 0 1000 510"
          className="h-full w-full select-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Cuadrícula cartográfica de meridianos y paralelos */}
            <pattern id="cartoGrid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#dbe4ec" strokeWidth="0.6" strokeDasharray="1 3" />
            </pattern>
          </defs>

          {/* Océano y retícula cartográfica */}
          <rect width="1000" height="510" fill="#eef3f7" className="dark:fill-[#0c0b09]" />
          <rect width="1000" height="510" fill="url(#cartoGrid)" />

          {/* Líneas de referencia geodésica (Ecuador y Trópicos) */}
          <line x1="0" y1="255" x2="1000" y2="255" stroke="#cbd5e1" strokeWidth="0.7" strokeDasharray="4 4" />
          <line x1="0" y1="165" x2="1000" y2="165" stroke="#cbd5e1" strokeWidth="0.5" strokeDasharray="2 4" />
          <line x1="0" y1="345" x2="1000" y2="345" stroke="#cbd5e1" strokeWidth="0.5" strokeDasharray="2 4" />

          {/* 177 Países Reales del Mundo proyectados en polígonos exactos */}
          <g id="world_countries" strokeLinejoin="round">
            {paises.map((pais, idx) => {
              const isSelected = regionSeleccionada === pais.bloque;

              return (
                <path
                  key={`${pais.id}-${idx}`}
                  d={pais.d}
                  fill={getPaisFill(pais)}
                  stroke={getPaisStroke(pais)}
                  strokeWidth={isSelected ? 1.4 : 0.6}
                  className={`transition-all duration-150 ${
                    pais.bloque ? "cursor-pointer hover:opacity-90" : "cursor-default"
                  }`}
                  onMouseEnter={() => setHoveredPais({ name: pais.name, bloque: pais.bloque })}
                  onMouseLeave={() => setHoveredPais(null)}
                  onClick={() => {
                    if (pais.bloque) {
                      onSelectRegion(pais.bloque);
                    }
                  }}
                >
                  <title>{`${pais.name} ${pais.bloque ? `(// Bloque: ${pais.bloque})` : ""}`}</title>
                </path>
              );
            })}
          </g>

          {/* Líneas Geodésicas Tácticas que unen Madrid/Bruselas con Washington, Pekín y África */}
          <g stroke="#9ab484" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" fill="none">
            <path d="M 494 153 Q 360 120 240 155" />
            <path d="M 516 125 Q 650 110 790 175" />
            <path d="M 494 153 Q 510 220 555 285" />
            <path d="M 240 155 Q 260 250 310 325" />
          </g>

          {/* Marcadores HUD Tácticos sobre los 9 bloques */}
          {marcadores.map((m) => {
            const isSelected = regionSeleccionada === m.cod;
            const dataReg = regionesData[m.cod];
            const titCount = dataReg ? dataReg.totalNoticias : 0;

            return (
              <g
                key={m.id}
                transform={`translate(${m.x}, ${m.y})`}
                onClick={() => onSelectRegion(m.cod)}
                className="cursor-pointer group"
              >
                {/* Halo pulsante */}
                <circle
                  r={isSelected ? 16 : 10}
                  fill={isSelected ? "#4d6b35" : "#b3512e"}
                  fillOpacity={isSelected ? "0.25" : "0.15"}
                  className="animate-ping"
                />

                {/* Círculo central */}
                <circle
                  r={isSelected ? 7 : 5}
                  fill={isSelected ? "#4d6b35" : "#110f0d"}
                  stroke="#ffffff"
                  strokeWidth="1.5"
                  className="shadow-md"
                />

                {/* Etiqueta del bloque */}
                <g transform="translate(0, 16)">
                  <rect
                    x="-32"
                    y="-10"
                    width="64"
                    height="18"
                    rx="4"
                    fill={isSelected ? "#110f0d" : "#ffffff"}
                    stroke={isSelected ? "#4d6b35" : "#d0c8b8"}
                    strokeWidth="1"
                    className="shadow-sm"
                  />
                  <text
                    x="0"
                    y="2"
                    textAnchor="middle"
                    fill={isSelected ? "#fbfaf7" : "#110f0d"}
                    fontSize="8.5"
                    fontFamily="JetBrains Mono, monospace"
                    fontWeight="bold"
                  >
                    {m.cod} • {titCount}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Barra de Filtro Rápido por Bloque Geopolítico */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1">
        <button
          onClick={() => onSelectRegion("ALL")}
          className={`rounded-lg px-3 py-1.5 text-xs font-mono font-bold transition-all ${
            regionSeleccionada === "ALL"
              ? "bg-alby-green text-[#fbfaf7] shadow-sm"
              : "border border-borderSubtle bg-subtle text-muted hover:text-title hover:bg-subtleHover"
          }`}
        >
          GLOBAL (TODOS)
        </button>

        {marcadores.map((m) => {
          const isSelected = regionSeleccionada === m.cod;
          const count = regionesData[m.cod]?.totalNoticias || 0;

          return (
            <button
              key={m.cod}
              onClick={() => onSelectRegion(m.cod)}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-mono transition-all ${
                isSelected
                  ? "bg-alby-green text-[#fbfaf7] shadow-sm font-bold"
                  : "border border-borderSubtle bg-panel text-body hover:bg-subtle hover:text-title"
              }`}
            >
              <span>{m.cod}</span>
              <span className="text-[10px] text-muted">({m.nombre})</span>
              <span
                className={`rounded px-1 text-[9px] font-bold ${
                  isSelected ? "bg-black/20 text-[#fbfaf7]" : "bg-subtle text-muted"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
