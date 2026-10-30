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
  // Puntos de los 9 bloques sobre una proyección cartográfica equi-rectangular de 1000x500
  const marcadores = [
    { id: "US", nombre: "EEUU", x: 230, y: 165, label: "EEUU", cod: "US" },
    { id: "LATAM", nombre: "Latinoamérica", x: 320, y: 320, label: "LATAM", cod: "LATAM" },
    { id: "UK", nombre: "Reino Unido", x: 485, y: 125, label: "UK", cod: "UK" },
    { id: "ES", nombre: "España", x: 480, y: 175, label: "ESPAÑA", cod: "ES" },
    { id: "FR", nombre: "Francia", x: 502, y: 150, label: "FRANCIA", cod: "FR" },
    { id: "DE", nombre: "Alemania", x: 525, y: 135, label: "ALEMANIA", cod: "DE" },
    { id: "EU", nombre: "Unión Europea", x: 535, y: 165, label: "UE (BRUSELAS)", cod: "EU" },
    { id: "AFRICA", nombre: "África", x: 540, y: 275, label: "ÁFRICA", cod: "AFRICA" },
    { id: "CHINA", nombre: "China", x: 770, y: 185, label: "CHINA", cod: "CHINA" },
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-cardBorder bg-card p-5 shadow-2xl">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-alby-green animate-ping" />
          <span className="text-[11px] font-mono tracking-widest text-alby-green uppercase font-semibold">
            // MAPAMUNDI GEOPOLÍTICO GLOBAL //
          </span>
          <span className="text-sm font-bold text-alby-light ml-2">
            9 Bloques Territoriales Monitorizados
          </span>
        </div>
        <span className="text-xs font-mono text-alby-muted">
          Haz clic en cualquier punto del mapa para filtrar el panel lateral
        </span>
      </div>

      <div className="relative aspect-[2/1] w-full rounded-xl border border-cardBorder/60 bg-[#0a0907] p-1 overflow-hidden shadow-inner">
        <svg
          viewBox="0 0 1000 500"
          className="h-full w-full select-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Cuadrícula cartográfica de meridianos y paralelos */}
            <pattern id="cartoGrid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#241f19" strokeWidth="0.6" strokeDasharray="1 3" />
            </pattern>
            <radialGradient id="mapGlow" cx="50%" cy="50%" r="60%">
              <stop offset="0%" stopColor="#7a9a5c" stopOpacity="0.06" />
              <stop offset="100%" stopColor="#7a9a5c" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Océano y retícula */}
          <rect width="1000" height="500" fill="#0c0b09" />
          <rect width="1000" height="500" fill="url(#cartoGrid)" />
          <circle cx="500" cy="250" r="450" fill="url(#mapGlow)" />

          {/* Línea del Ecuador y Trópicos */}
          <line x1="0" y1="250" x2="1000" y2="250" stroke="#332a20" strokeWidth="0.8" strokeDasharray="4 4" />
          <line x1="0" y1="165" x2="1000" y2="165" stroke="#262019" strokeWidth="0.5" strokeDasharray="2 4" />
          <line x1="0" y1="335" x2="1000" y2="335" stroke="#262019" strokeWidth="0.5" strokeDasharray="2 4" />

          {/* ========================================================
              TRAZADO CARTOGRÁFICO REALISTA DE CONTINENTES (ESCALA MUNDIAL)
             ======================================================== */}
          <g fill="#1a1612" stroke="#3d3429" strokeWidth="1" strokeLinejoin="round">
            {/* NORTEAMÉRICA & GROENLANDIA */}
            <path d="M 120 70 L 160 55 L 210 65 L 240 50 L 300 70 L 290 110 L 270 120 L 290 145 L 305 180 L 285 205 L 240 220 L 225 240 L 205 230 L 175 190 L 150 170 L 115 130 L 95 100 Z" />
            <path d="M 330 40 L 390 35 L 410 75 L 370 100 L 335 70 Z" /> {/* Groenlandia */}
            
            {/* CENTROAMÉRICA & CARIBE */}
            <path d="M 225 240 L 250 260 L 280 270 L 275 285 L 250 275 L 225 250 Z" />

            {/* SUDAMÉRICA */}
            <path d="M 275 285 L 330 280 L 380 310 L 390 350 L 360 410 L 320 460 L 295 440 L 290 380 L 265 320 L 275 285 Z" />

            {/* EUROPA */}
            <path d="M 470 120 L 510 90 L 550 85 L 565 110 L 545 135 L 560 160 L 525 180 L 490 190 L 465 175 L 470 145 Z" />
            <path d="M 460 110 L 485 105 L 480 135 L 460 130 Z" /> {/* Islas Británicas */}
            <path d="M 495 65 L 530 55 L 540 85 L 515 95 Z" /> {/* Escandinavia */}

            {/* ÁFRICA */}
            <path d="M 475 195 L 550 190 L 590 230 L 610 260 L 560 360 L 530 400 L 485 350 L 460 260 L 450 220 Z" />
            <path d="M 605 330 L 620 340 L 610 375 L 595 365 Z" /> {/* Madagascar */}

            {/* ASIA */}
            <path d="M 565 110 L 650 80 L 760 70 L 870 95 L 890 140 L 850 180 L 800 210 L 760 270 L 710 260 L 685 210 L 620 200 L 590 170 L 565 140 Z" />
            <path d="M 660 220 L 710 230 L 720 290 L 680 290 Z" /> {/* Subcontinente Indio */}
            <path d="M 830 140 L 860 150 L 845 200 L 825 190 Z" /> {/* Japón */}
            <path d="M 750 280 L 820 290 L 830 340 L 770 330 Z" /> {/* Sudeste Asiático / Malasia */}

            {/* OCEANÍA / AUSTRALIA */}
            <path d="M 790 350 L 880 340 L 900 410 L 840 440 L 780 400 Z" />
          </g>

          {/* Rutas de interconexión geopolítica */}
          <g stroke="#7a9a5c" strokeWidth="0.8" strokeDasharray="4 6" opacity="0.3">
            <line x1="230" y1="165" x2="502" y2="150" />
            <line x1="502" y1="150" x2="770" y2="185" />
            <line x1="540" y1="275" x2="770" y2="185" />
            <line x1="320" y1="320" x2="480" y2="175" />
            <line x1="230" y1="165" x2="770" y2="185" stroke="#c97755" strokeDasharray="3 7" opacity="0.4" />
          </g>

          {/* ========================================================
              MARCADORES DE ALTA PRECISIÓN PARA LOS 9 BLOQUES
             ======================================================== */}
          {marcadores.map((m) => {
            const isSelected = regionSeleccionada === m.id;
            const regInfo = regionesData[m.id];
            const count = regInfo ? regInfo.totalNoticias : 0;

            return (
              <g
                key={m.id}
                onClick={() => onSelectRegion(isSelected ? "ALL" : m.id)}
                className="cursor-pointer group"
              >
                {/* Ping de radar exterior animado */}
                {isSelected ? (
                  <>
                    <circle cx={m.x} cy={m.y} r="22" fill="#7a9a5c" opacity="0.25" className="animate-ping" />
                    <circle cx={m.x} cy={m.y} r="18" fill="none" stroke="#7a9a5c" strokeWidth="1.5" />
                  </>
                ) : (
                  <circle
                    cx={m.x}
                    cy={m.y}
                    r="12"
                    fill="none"
                    stroke="#c97755"
                    strokeWidth="0.8"
                    strokeDasharray="2 2"
                    opacity="0.6"
                    className="group-hover:opacity-100 group-hover:stroke-alby-green"
                  />
                )}

                {/* Núcleo del marcador */}
                <circle
                  cx={m.x}
                  cy={m.y}
                  r={isSelected ? "9" : "7"}
                  fill={isSelected ? "#7a9a5c" : "#c97755"}
                  stroke="#f8f6f0"
                  strokeWidth="1.5"
                  className="transition-all duration-200 group-hover:scale-125"
                />

                {/* Etiqueta flotante con código de país */}
                <rect
                  x={m.x - 22}
                  y={m.y - 25}
                  width="44"
                  height="16"
                  rx="4"
                  fill="#0f0e0c"
                  stroke={isSelected ? "#7a9a5c" : "#2e2820"}
                  strokeWidth="1"
                />
                <text
                  x={m.x}
                  y={m.y - 14}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={isSelected ? "#7a9a5c" : "#f8f6f0"}
                  fontSize="9"
                  fontWeight="bold"
                  fontFamily="JetBrains Mono, monospace"
                >
                  {m.id}
                </text>

                {/* Badge inferior con el recuento de titulares */}
                {count > 0 && (
                  <text
                    x={m.x}
                    y={m.y + 18}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={isSelected ? "#7a9a5c" : "#c5bfb1"}
                    fontSize="9"
                    fontWeight="500"
                    fontFamily="JetBrains Mono, monospace"
                  >
                    {count} tit
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Botonera de Filtrado Limpia y Alineada */}
      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-cardBorder pt-3">
        <button
          onClick={() => onSelectRegion("ALL")}
          className={`rounded-lg px-3 py-1.5 text-xs font-mono font-bold transition-all ${
            regionSeleccionada === "ALL"
              ? "bg-alby-light text-ink shadow-sm"
              : "border border-cardBorder bg-dark text-alby-cream hover:border-alby-green hover:text-alby-light"
          }`}
        >
          TODOS LOS BLOQUES
        </button>
        {marcadores.map((b) => {
          const isSelected = regionSeleccionada === b.id;
          return (
            <button
              key={b.id}
              onClick={() => onSelectRegion(b.id)}
              className={`rounded-lg px-2.5 py-1.5 text-xs font-mono transition-all ${
                isSelected
                  ? "bg-alby-green font-bold text-ink shadow-md"
                  : "border border-cardBorder bg-dark/60 text-alby-cream hover:border-alby-green/60 hover:text-alby-light"
              }`}
            >
              {b.id} · {b.nombre}
            </button>
          );
        })}
      </div>
    </div>
  );
}
