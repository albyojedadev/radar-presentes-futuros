"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { RadarPresentesView } from "@/components/RadarPresentesView";
import { HemerotecaView } from "@/components/HemerotecaView";
import { AnuariosView } from "@/components/AnuariosView";
import { RadarFuturosView } from "@/components/RadarFuturosView";
import datasetStatic from "@/public/data/dataset.json";

export default function Home() {
  const [vistaActiva, setVistaActiva] = useState<"presentes" | "hemeroteca" | "anuarios" | "futuros">("presentes");
  const dataset = datasetStatic;

  return (
    <div className="min-h-screen bg-[#0f0e0c] text-[#f8f6f0] flex flex-col justify-between">
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

      <footer className="border-t border-[#2e2820] bg-[#14120f] py-4 text-center text-[11px] font-mono text-[#c5bfb1]">
        RADAR DE PRESENTES & FUTUROS // 9 BLOQUES GEOPOLÍTICOS • ACTUALIZACIÓN DIARIA CONTINUA • ALBY OJEDA
      </footer>
    </div>
  );
}
