"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { RadarPresentesView } from "@/components/RadarPresentesView";
import { HemerotecaView } from "@/components/HemerotecaView";
import { AnuariosView } from "@/components/AnuariosView";
import { RadarFuturosView } from "@/components/RadarFuturosView";
import { Radio } from "lucide-react";

export default function Home() {
  const [vistaActiva, setVistaActiva] = useState<"presentes" | "hemeroteca" | "anuarios" | "futuros">("presentes");
  const [dataset, setDataset] = useState<any>(null);
  const [cargando, setCargando] = useState<boolean>(true);

  useEffect(() => {
    fetch("/data/dataset.json")
      .then((res) => res.json())
      .then((data) => {
        setDataset(data);
        setCargando(false);
      })
      .catch((err) => {
        console.error("Error al cargar dataset:", err);
        setCargando(false);
      });
  }, []);

  if (cargando) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#090d16]">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-sky-500/30 bg-sky-500/10 text-sky-400">
            <Radio className="h-6 w-6 animate-pulse" />
          </div>
          <p className="font-mono text-xs text-slate-400">
            CARGANDO RADAR GLOBAL // 357 SEMANAS & ANUARIOS...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col justify-between">
      <div>
        <Header
          vistaActiva={vistaActiva}
          setVistaActiva={setVistaActiva}
          totalSemanas={dataset?.totalSemanas || 357}
        />

        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
          {vistaActiva === "presentes" && (
            <RadarPresentesView noticiasHoy={dataset?.noticiasHoy} />
          )}

          {vistaActiva === "hemeroteca" && (
            <HemerotecaView semanasPorAno={dataset?.semanasPorAno || {}} />
          )}

          {vistaActiva === "anuarios" && (
            <AnuariosView anuarios={dataset?.anuarios || {}} />
          )}

          {vistaActiva === "futuros" && (
            <RadarFuturosView hipotesisList={dataset?.hipotesisFuturos || []} />
          )}
        </main>
      </div>

      <footer className="border-t border-slate-800/80 bg-[#090d16]/80 py-4 text-center text-[11px] font-mono text-slate-500">
        RADAR DE PRESENTES & FUTUROS // 9 BLOQUES GEOPOLÍTICOS • ACTUALIZACIÓN DIARIA CONTINUA • PUBLICADO EN VERCEL
      </footer>
    </div>
  );
}
