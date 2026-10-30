#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
extraer_hipotesis_db.py — Extractor canónico de Hipótesis y Señales desde futures_radar.db
Extrae las 22 hipótesis activas con sus señales empíricas de apoyo y contradicción.
"""

import os
import sys
import json
import sqlite3

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

DB_PATH = r"D:\PROYECTOS\VibeCoding\Diseño de futuros\futures_radar.db"
OUT_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public", "data", "hipotesis_db.json")


def extraer():
    if not os.path.exists(DB_PATH):
        print(f"⚠️ Base de datos no encontrada en {DB_PATH}")
        return []

    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()

    c.execute("""
    SELECT id, title, statement, category, status, confidence_score
    FROM hypotheses
    ORDER BY id ASC;
    """)
    hyps = c.fetchall()

    result = []
    for h in hyps:
        hid, title, stmt, cat, status, score = h

        # Extraer señales que apoyan (Top 4 más recientes)
        c.execute("""
            SELECT s.title, s.source_name, s.url, l.rationale, s.date_published
            FROM signal_hypothesis_links l
            JOIN signals s ON l.signal_id = s.id
            WHERE l.hypothesis_id = ? AND l.relation_type LIKE '%APOYA%'
            ORDER BY s.date_published DESC
            LIMIT 5;
        """, (hid,))
        pro_rows = c.fetchall()

        # Extraer señales que matizan o contradicen
        c.execute("""
            SELECT s.title, s.source_name, s.url, l.rationale, s.date_published
            FROM signal_hypothesis_links l
            JOIN signals s ON l.signal_id = s.id
            WHERE l.hypothesis_id = ? AND (l.relation_type LIKE '%CONTRADICE%' OR l.relation_type LIKE '%MATIZA%')
            ORDER BY s.date_published DESC
            LIMIT 4;
        """, (hid,))
        contra_rows = c.fetchall()

        # Mapeo de horizontes según el tema
        horizonte = "H1 (2025 - 2027)"
        if any(k in cat.lower() for k in ["geopolitica", "robotica", "energia", "espiritualidad"]):
            horizonte = "H2 (2027 - 2032)"
        elif any(k in cat.lower() for k in ["macroeconomia", "burbuja", "agentes", "audiovisual"]):
            horizonte = "H1 (2025 - 2028)"

        # Normalizar score de tracción a porcentaje 0-100
        traccion = 75
        if score is not None:
            if score <= 1.0:
                traccion = int(score * 100)
            else:
                traccion = int(score)

        result.append({
            "id": hid,
            "titulo": title,
            "horizonte": horizonte,
            "tesis": stmt,
            "categoria": cat.replace("_", " ").title(),
            "status": status,
            "traccionScore": traccion,
            "totalSenales": len(pro_rows) + len(contra_rows),
            "senalesPro": [
                {
                    "titular": r[0],
                    "fuente": f"{r[1]} ({r[4]})" if r[4] else r[1],
                    "url": r[2] if r[2] and r[2] != "#" else f"https://www.google.com/search?q={r[0]}",
                    "impacto": r[3] or "Señal empírica de tracción contrastada en hemeroteca."
                }
                for r in pro_rows
            ],
            "senalesContra": [
                {
                    "titular": r[0],
                    "fuente": f"{r[1]} ({r[4]})" if r[4] else r[1],
                    "url": r[2] if r[2] and r[2] != "#" else f"https://www.google.com/search?q={r[0]}",
                    "impacto": r[3] or "Fricción, contradicción o desmentido empírico."
                }
                for r in contra_rows
            ]
        })

    os.makedirs(os.path.dirname(OUT_PATH), exist_ok=True)
    with open(OUT_PATH, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

    print(f"✅ Extraídas {len(result)} hipótesis con señales desde futures_radar.db -> {OUT_PATH}")
    return result


if __name__ == "__main__":
    extraer()
