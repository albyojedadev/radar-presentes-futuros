"use client";

import React, { useState, useRef } from "react";
import paisesDataStatic from "@/public/data/paises_mapamundi.json";
import { ZoomIn, ZoomOut, Maximize2, Compass, Move } from "lucide-react";

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

  // Estados interactivos para Zoom y Desplazamiento (Pan)
  const [viewBox, setViewBox] = useState({ x: 0, y: 0, w: 1000, h: 510 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Coordenadas tácticas en modo VISTA GLOBAL (para los 9 bloques)
  const marcadoresGlobales = [
    { id: "ES", nombre: "España", x: 494, y: 153, cod: "ES" },
    { id: "FR", nombre: "Francia", x: 508, y: 135, cod: "FR" },
    { id: "DE", nombre: "Alemania", x: 530, y: 119, cod: "DE" },
    { id: "UK", nombre: "Reino Unido", x: 494, y: 106, cod: "UK" },
    { id: "EU", nombre: "Unión Europea", x: 516, y: 125, cod: "EU" },
    { id: "US", nombre: "EEUU", x: 240, y: 155, cod: "US" },
    { id: "LATAM", nombre: "Latinoamérica", x: 310, y: 325, cod: "LATAM" },
    { id: "AFRICA", nombre: "África", x: 555, y: 285, cod: "AFRICA" },
    { id: "CHINA", nombre: "China", x: 790, y: 175, cod: "CHINA" },
  ];

  // Micro-Pines Tácticos en MODO ZOOM EUROPA (distribución calculada anti-solapamiento)
  // Se desacoplan las posiciones con márgenes de seguridad para que nunca colisionen
  const microPinesEuropa = [
    { cod: "ES", nombre: "ESPAÑA", x: 486, y: 159, isActivo: true },
    { cod: "FR", nombre: "FRANCIA", x: 504, y: 137, isActivo: true },
    { cod: "UK", nombre: "UK", x: 490, y: 98, isActivo: true },
    { cod: "EU", nombre: "UE", x: 515, y: 124, isActivo: true },
    { cod: "DE", nombre: "ALEMANIA", x: 535, y: 116, isActivo: true },
    { cod: null, nombre: "PORTUGAL", x: 464, y: 153, isActivo: false },
    { cod: null, nombre: "ITALIA", x: 536, y: 148, isActivo: false },
    { cod: null, nombre: "POLONIA", x: 558, y: 113, isActivo: false },
    { cod: null, nombre: "UCRANIA", x: 590, y: 120, isActivo: false },
    { cod: null, nombre: "ESCANDINAVIA", x: 534, y: 82, isActivo: false },
  ];

  // Presets de Zoom
  const zoomGlobal = () => {
    setViewBox({ x: 0, y: 0, w: 1000, h: 510 });
    setZoomLevel(1);
  };

  const zoomEuropa = () => {
    // Encuadre optimizado sobre Europa (Península Ibérica, Francia, Alemania, UK, Bruselas, Italia y Polonia)
    setViewBox({ x: 415, y: 65, w: 215, h: 110 });
    setZoomLevel(4.6);
  };

  const handleZoom = (factor: number) => {
    setViewBox((prev) => {
      const newW = Math.max(120, Math.min(1000, prev.w / factor));
      const newH = Math.max(61, Math.min(510, prev.h / factor));
      const cx = prev.x + prev.w / 2;
      const cy = prev.y + prev.h / 2;
      const newX = Math.max(0, Math.min(1000 - newW, cx - newW / 2));
      const newY = Math.max(0, Math.min(510 - newH, cy - newH / 2));
      const nextLevel = Number((1000 / newW).toFixed(1));
      setZoomLevel(nextLevel);
      return { x: newX, y: newY, w: newW, h: newH };
    });
  };

  // Drag & Pan para mover el mapa cuando está ampliado
  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    if (zoomLevel > 1.05) {
      setIsPanning(true);
      setPanStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isPanning || !svgRef.current) return;
    const dx = e.clientX - panStart.x;
    const dy = e.clientY - panStart.y;
    setPanStart({ x: e.clientX, y: e.clientY });

    const rect = svgRef.current.getBoundingClientRect();
    const scaleX = viewBox.w / rect.width;
    const scaleY = viewBox.h / rect.height;

    setViewBox((prev) => ({
      ...prev,
      x: Math.max(0, Math.min(1000 - prev.w, prev.x - dx * scaleX)),
      y: Math.max(0, Math.min(510 - prev.h, prev.y - dy * scaleY)),
    }));
  };

  const handleMouseUp = () => setIsPanning(false);

  // Soporte táctil (Touch) para móviles y tablets
  const handleTouchStart = (e: React.TouchEvent<SVGSVGElement>) => {
    if (e.touches.length === 1 && zoomLevel > 1.05) {
      setIsPanning(true);
      setPanStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  const handleTouchMove = (e: React.TouchEvent<SVGSVGElement>) => {
    if (!isPanning || !svgRef.current || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - panStart.x;
    const dy = e.touches[0].clientY - panStart.y;
    setPanStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });

    const rect = svgRef.current.getBoundingClientRect();
    const scaleX = viewBox.w / rect.width;
    const scaleY = viewBox.h / rect.height;

    setViewBox((prev) => ({
      ...prev,
      x: Math.max(0, Math.min(1000 - prev.w, prev.x - dx * scaleX)),
      y: Math.max(0, Math.min(510 - prev.h, prev.y - dy * scaleY)),
    }));
  };

  const handleTouchEnd = () => setIsPanning(false);

  const handleWheel = (e: React.WheelEvent<SVGSVGElement>) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.25 : 0.8;
    handleZoom(factor);
  };

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
      return "#d6cfbe";
    }
    return "#e8e3d5";
  };

  const getPaisStroke = (pais: PaisGeo) => {
    if (regionSeleccionada === pais.bloque) {
      return "#2d441c";
    }
    return "#c2b8a3";
  };

  const isEuropaZoom = zoomLevel >= 2.2;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-borderSubtle bg-panel p-5 shadow-sm space-y-4">
      {/* Cabecera del Mapa */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-borderSubtle pb-3">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 rounded-full bg-alby-green animate-pulse" />
          <span className="text-[10px] sm:text-[11px] font-mono tracking-widest text-alby-green uppercase font-bold">
            // MAPAMUNDI CARTOGRÁFICO REAL //
          </span>
          <span className="text-xs sm:text-sm font-bold text-title ml-1">
            177 Países • 9 Bloques
          </span>
        </div>
        <div className="flex items-center gap-2 text-[11px] sm:text-xs font-mono text-muted">
          {hoveredPais ? (
            <span className="rounded bg-alby-greenBg px-2 py-0.5 text-alby-green font-semibold border border-alby-greenBorder">
              {hoveredPais.name} {hoveredPais.bloque ? `[${hoveredPais.bloque}]` : "(Sin monitorizar)"}
            </span>
          ) : (
            <span className="hidden sm:inline">Explora el mapa con zoom o haz clic en cualquier país</span>
          )}
        </div>
      </div>

      {/* Visor SVG Cartográfico con Zoom y Pan Dinámico */}
      <div className="relative aspect-[1000/510] w-full rounded-xl border border-borderSubtle bg-[#eef3f7] dark:bg-[#0c0b09] overflow-hidden shadow-inner group">
        
        {/* Barra Flotante de Controles de Zoom */}
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10 flex items-center gap-1 sm:gap-1.5 rounded-xl border border-borderSubtle bg-panel/95 p-1 sm:p-1.5 backdrop-blur-md shadow-md text-xs">
          <button
            onClick={zoomEuropa}
            className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 text-[11px] sm:text-xs font-mono font-bold rounded-lg transition-all ${
              isEuropaZoom
                ? "bg-alby-green text-[#fbfaf7] shadow-sm"
                : "border border-borderSubtle bg-panel text-body hover:bg-subtle hover:text-title"
            }`}
            title="Enfoque de Alta Definición a Europa"
          >
            <Compass className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            <span><span className="hidden sm:inline">Enfoque </span>Europa</span>
          </button>

          <button
            onClick={zoomGlobal}
            className={`px-1.5 sm:px-2 py-1 text-[11px] sm:text-xs font-mono rounded-lg transition-all ${
              zoomLevel === 1
                ? "bg-subtle text-muted border border-transparent font-medium"
                : "border border-borderSubtle bg-panel text-body hover:bg-subtle hover:text-title"
            }`}
            title="Vista Global Completa (100%)"
          >
            Global
          </button>

          <div className="h-4 w-px bg-borderSubtle mx-0.5" />

          <button
            onClick={() => handleZoom(1.35)}
            className="rounded-lg p-1 sm:p-1.5 text-title hover:bg-subtle transition-all"
            title="Acercar Zoom (+)"
          >
            <ZoomIn className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </button>

          <button
            onClick={() => handleZoom(0.74)}
            className="rounded-lg p-1 sm:p-1.5 text-title hover:bg-subtle transition-all"
            title="Alejar Zoom (-)"
          >
            <ZoomOut className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </button>

          <button
            onClick={zoomGlobal}
            className="hidden sm:inline-flex rounded-lg p-1.5 text-muted hover:text-title hover:bg-subtle transition-all"
            title="Restablecer Encuadre"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </button>

          <span className="text-[10px] font-mono text-muted pl-0.5 sm:pl-1 pr-0.5 sm:pr-1 font-semibold">
            {zoomLevel}x
          </span>
        </div>

        {/* Indicador de ayuda al arrastrar */}
        {zoomLevel > 1.1 && (
          <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 z-10 flex items-center gap-1.5 rounded-lg border border-borderSubtle bg-panel/85 px-2 py-1 text-[10px] sm:text-[11px] font-mono text-muted backdrop-blur-sm pointer-events-none">
            <Move className="h-3 w-3 text-alby-green" />
            <span className="hidden sm:inline">Haz clic o arrastra con el dedo para desplazarte</span>
            <span className="sm:hidden">Arrastra para mover</span>
          </div>
        )}

        <svg
          ref={svgRef}
          viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`}
          className={`h-full w-full select-none transition-all duration-300 ease-out touch-none ${
            zoomLevel > 1.1 ? (isPanning ? "cursor-grabbing" : "cursor-grab") : "cursor-default"
          }`}
          xmlns="http://www.w3.org/2000/svg"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
          onWheel={handleWheel}
        >
          <defs>
            <pattern id="cartoGrid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#dbe4ec" strokeWidth="0.6" strokeDasharray="1 3" />
            </pattern>
          </defs>

          {/* Océano y retícula cartográfica */}
          <rect width="1000" height="510" fill="#eef3f7" className="dark:fill-[#0c0b09]" />
          <rect width="1000" height="510" fill="url(#cartoGrid)" />

          {/* Líneas de referencia geodésica */}
          <line x1="0" y1="255" x2="1000" y2="255" stroke="#cbd5e1" strokeWidth="0.7" strokeDasharray="4 4" />
          <line x1="0" y1="165" x2="1000" y2="165" stroke="#cbd5e1" strokeWidth="0.5" strokeDasharray="2 4" />
          <line x1="0" y1="345" x2="1000" y2="345" stroke="#cbd5e1" strokeWidth="0.5" strokeDasharray="2 4" />

          {/* 177 Países Reales del Mundo */}
          <g id="world_countries" strokeLinejoin="round">
            {paises.map((pais, idx) => {
              const isSelected = regionSeleccionada === pais.bloque;

              return (
                <path
                  key={`${pais.id}-${idx}`}
                  d={pais.d}
                  fill={getPaisFill(pais)}
                  stroke={getPaisStroke(pais)}
                  strokeWidth={isSelected ? (isEuropaZoom ? 0.6 : 1.4) : (isEuropaZoom ? 0.35 : 0.6)}
                  className={`transition-all duration-150 ${
                    pais.bloque ? "cursor-pointer hover:opacity-90" : "cursor-default"
                  }`}
                  onMouseEnter={() => setHoveredPais({ name: pais.name, bloque: pais.bloque })}
                  onMouseLeave={() => setHoveredPais(null)}
                  onClick={(e) => {
                    if (pais.bloque) {
                      e.stopPropagation();
                      onSelectRegion(pais.bloque);
                    }
                  }}
                >
                  <title>{`${pais.name} ${pais.bloque ? `(// Bloque: ${pais.bloque})` : ""}`}</title>
                </path>
              );
            })}
          </g>

          {/* Rutas Geodésicas Tácticas */}
          <g stroke="#9ab484" strokeWidth={isEuropaZoom ? 0.5 : 1} strokeDasharray="3 3" opacity="0.35" fill="none">
            <path d="M 494 153 Q 360 120 240 155" />
            <path d="M 516 125 Q 650 110 790 175" />
            <path d="M 494 153 Q 510 220 555 285" />
            <path d="M 240 155 Q 260 250 310 325" />
          </g>

          {/* ============================================================
              MODO ZOOM EUROPA: MICRO-PINES TÁCTICOS ANTI-SOLAPAMIENTO
              Elimina los badges gigantes globales y muestra micro-etiquetas nítidas
              ============================================================ */}
          {isEuropaZoom ? (
            <g id="europa_micro_pines">
              {microPinesEuropa.map((pin) => {
                const isSelected = pin.cod ? regionSeleccionada === pin.cod : false;
                const titCount = pin.cod ? regionesData[pin.cod]?.totalNoticias || 0 : 0;
                const labelText = pin.cod ? `${pin.nombre} • ${titCount}` : pin.nombre;
                const badgeWidth = pin.cod ? 22 : 16;

                return (
                  <g
                    key={pin.nombre}
                    transform={`translate(${pin.x}, ${pin.y})`}
                    onClick={(e) => {
                      if (pin.cod) {
                        e.stopPropagation();
                        onSelectRegion(pin.cod);
                      }
                    }}
                    className={pin.cod ? "cursor-pointer group" : "pointer-events-none"}
                  >
                    {/* Punto focal sutil */}
                    {pin.cod && (
                      <circle
                        r={isSelected ? 2.5 : 1.5}
                        fill={isSelected ? "#4d6b35" : "#110f0d"}
                        stroke="#ffffff"
                        strokeWidth="0.5"
                      />
                    )}

                    {/* Micro-etiqueta no colisionante */}
                    <g transform={`translate(0, ${pin.cod ? 4.5 : 0})`}>
                      <rect
                        x={-badgeWidth / 2}
                        y="-3"
                        width={badgeWidth}
                        height="6"
                        rx="1.2"
                        fill={isSelected ? "#110f0d" : (pin.isActivo ? "#ffffff" : "#fbfaf7")}
                        fillOpacity={pin.isActivo ? 0.95 : 0.75}
                        stroke={isSelected ? "#4d6b35" : (pin.isActivo ? "#c2b8a3" : "#d8d0c2")}
                        strokeWidth="0.4"
                        className="shadow-2xs"
                      />
                      <text
                        x="0"
                        y="1.1"
                        textAnchor="middle"
                        fill={isSelected ? "#fbfaf7" : (pin.isActivo ? "#110f0d" : "#5a5247")}
                        fontSize="3.2"
                        fontFamily="JetBrains Mono, monospace"
                        fontWeight={pin.isActivo ? "bold" : "normal"}
                      >
                        {labelText}
                      </text>
                    </g>
                  </g>
                );
              })}
            </g>
          ) : (
            /* ============================================================
               MODO GLOBAL: HUD COMPLETO DE LOS 9 BLOQUES GEOPOLÍTICOS
               ============================================================ */
            <g id="global_hud_marcadores">
              {marcadoresGlobales.map((m) => {
                const isSelected = regionSeleccionada === m.cod;
                const dataReg = regionesData[m.cod];
                const titCount = dataReg ? dataReg.totalNoticias : 0;

                return (
                  <g
                    key={m.id}
                    transform={`translate(${m.x}, ${m.y})`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectRegion(m.cod);
                    }}
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
            </g>
          )}
        </svg>
      </div>

      {/* Barra de Filtro Rápido por Bloque Geopolítico (Adaptable y Scrollable en móvil) */}
      <div className="flex items-center gap-1 sm:gap-1.5 pt-1 overflow-x-auto scrollbar-none pb-1 sm:flex-wrap">
        <button
          onClick={() => onSelectRegion("ALL")}
          className={`shrink-0 rounded-lg px-2.5 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-xs font-mono font-bold transition-all ${
            regionSeleccionada === "ALL"
              ? "bg-alby-green text-[#fbfaf7] shadow-sm"
              : "border border-borderSubtle bg-subtle text-muted hover:text-title hover:bg-subtleHover"
          }`}
        >
          GLOBAL (TODOS)
        </button>

        {marcadoresGlobales.map((m) => {
          const isSelected = regionSeleccionada === m.cod;
          const count = regionesData[m.cod]?.totalNoticias || 0;

          return (
            <button
              key={m.cod}
              onClick={() => onSelectRegion(m.cod)}
              className={`shrink-0 flex items-center gap-1 sm:gap-1.5 rounded-lg px-2 sm:px-2.5 py-1 text-[11px] sm:text-xs font-mono transition-all ${
                isSelected
                  ? "bg-alby-green text-[#fbfaf7] shadow-sm font-bold"
                  : "border border-borderSubtle bg-panel text-body hover:bg-subtle hover:text-title"
              }`}
            >
              <span>{m.cod}</span>
              <span className="text-[9px] sm:text-[10px] text-muted">({m.nombre})</span>
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
