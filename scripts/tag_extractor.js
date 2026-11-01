// Diccionario semántico de temas geopolíticos y palabras clave para detección de tags
const DICCIONARIO_TAGS = [
  {
    tag: "Guerra en Ucrania & OTAN",
    keywords: ["ucrania", "zelenski", "rusia", "putin", "otan", "taurus", "leopard", "crimea", "kursk", "moscú", "donbás", "kiev", "invasión", "kremlin"]
  },
  {
    tag: "Conflicto en Gaza & Mar Rojo",
    keywords: ["gaza", "israel", "hamás", "netanyahu", "palestina", "mar rojo", "hutíes", "líbano", "beirut", "hezbolá", "hizbulá", "irán", "teherán", "damasco", "yemen"]
  },
  {
    tag: "Inflación & Política Monetaria",
    keywords: ["inflación", "tipos de interés", "reserva federal", "fed", "bce", "precios", "coste de la vida", "banco central", "recesión", "déficit", "deuda"]
  },
  {
    tag: "Inteligencia Artificial & Chips",
    keywords: ["inteligencia artificial", "ia", "semiconductores", "chips", "modelos", "anthropic", "openai", "chatgpt", "deepfake", "computación", "tecnología", "autónomos"]
  },
  {
    tag: "Pacto Verde & Rebelión Agrícola",
    keywords: ["tractoradas", "agricultores", "campo", "pesticidas", "normas verdes", "pacto verde", "sequía", "medioambiente", "pesca", "fit for 55"]
  },
  {
    tag: "Crisis Energética & Gas",
    keywords: ["gas", "petróleo", "luz", "electricidad", "energía", "nord stream", "baterías", "renovables", "gasoducto", "uranio", "excepción ibérica"]
  },
  {
    tag: "Elecciones en EEUU & Polarización",
    keywords: ["trump", "biden", "harris", "elecciones", "caucus", "primarias", "congreso de eeuu", "senado", "casa blanca", "midterms", "capitolio", "pensilvania"]
  },
  {
    tag: "Gobernanza de la UE & Fondos",
    keywords: ["bruselas", "comisión europea", "parlamento europeo", "von der leyen", "next generation", "schengen", "asilo", "unión europea", "draghi"]
  },
  {
    tag: "Agenda Política en España",
    keywords: ["amnistía", "koldo", "sánchez", "feijóo", "pensiones", "puigdemont", "ayuso", "congreso", "tribunal supremo", "cgpj", "dana", "valencia", "atocha", "galicia", "cataluña", "euskadi", "begoña", "vox", "sumar"]
  },
  {
    tag: "Crisis y Reformas en América Latina",
    keywords: ["milei", "argentina", "bukele", "el salvador", "venezuela", "maduro", "ecuador", "brasil", "lula", "chile", "boric", "petro", "colombia", "haití"]
  },
  {
    tag: "Potencia Industrial de China & Taiwán",
    keywords: ["pekín", "china", "xi jinping", "taiwán", "yuan", "evergrande", "hong kong", "brics", "aranceles"]
  },
  {
    tag: "Soberanía y Recursos en África",
    keywords: ["sahel", "mali", "níger", "burkina faso", "cedeao", "sudáfrica", "etiopía", "minerales", "litio", "coltán", "tigray"]
  },
  {
    tag: "Seguridad Sanitaria & Pandemia",
    keywords: ["covid", "coronavirus", "vacunas", "confinamiento", "estado de alarma", "mascarillas", "uci", "hospitales", "oms", "ómicron"]
  }
];

function extraerTagsDeTitulares(bloques) {
  const regiones = Object.keys(bloques);
  const tagScores = {};

  for (const reg of regiones) {
    const lista = bloques[reg] || [];
    for (const item of lista) {
      const texto = (item.titulo || "").toLowerCase();

      for (const tDef of DICCIONARIO_TAGS) {
        const coincide = tDef.keywords.some(k => texto.includes(k));
        if (coincide) {
          if (!tagScores[tDef.tag]) {
            tagScores[tDef.tag] = {
              tag: tDef.tag,
              regiones: new Set(),
              conteo: 0
            };
          }
          tagScores[tDef.tag].regiones.add(reg);
          tagScores[tDef.tag].conteo += 1;
        }
      }
    }
  }

  // Convertir a array y clasificar por alcance
  const resultado = Object.values(tagScores).map(item => {
    const regArray = Array.from(item.regiones);
    let alcance = "individual"; // 1 region
    let tipoEtiqueta = "Asunto Doméstico";

    if (regArray.length >= 4) {
      alcance = "global";
      tipoEtiqueta = "Sincronización Global";
    } else if (regArray.length >= 2) {
      alcance = "regional";
      tipoEtiqueta = "Corriente Regional";
    }

    return {
      tag: item.tag,
      regiones: regArray,
      numRegiones: regArray.length,
      conteo: item.conteo,
      alcance,
      tipoEtiqueta
    };
  });

  // Ordenar de MÁS COMÚN (más regiones) a MÁS INDIVIDUAL (1 región)
  resultado.sort((a, b) => {
    if (b.numRegiones !== a.numRegiones) {
      return b.numRegiones - a.numRegiones;
    }
    return b.conteo - a.conteo;
  });

  return resultado;
}

module.exports = { extraerTagsDeTitulares, DICCIONARIO_TAGS };
