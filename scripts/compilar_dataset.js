const fs = require('fs');
const path = require('path');

const ROOT_RADAR = path.resolve(__dirname, '..', '..', '_AUTOMATIZACIONES_E_INFORMES_', 'RADAR_DE_PRESENTES');
const OUT_DIR = path.resolve(__dirname, '..', 'public', 'data');
const OUT_FILE = path.join(OUT_DIR, 'dataset.json');

// Si no existe la carpeta local de automatizaciones (por ejemplo, en el entorno de compilación de Vercel),
// conservamos intacto el dataset.json ya compilado y commiteado en el repositorio.
if (!fs.existsSync(ROOT_RADAR)) {
  console.log("ℹ️ Entorno Cloud/Vercel detectado: No existe carpeta local de automatizaciones.");
  if (fs.existsSync(OUT_FILE)) {
    console.log("✅ Conservando dataset.json pre-compilado en el repositorio.");
  } else {
    console.warn("⚠️ Advertencia: No se encontró dataset.json preexistente.");
  }
  process.exit(0);
}

// 1. Cargar fuentes
const fuentesPath = path.join(ROOT_RADAR, 'fuentes.json');
let fuentesConfig = {};
if (fs.existsSync(fuentesPath)) {
  fuentesConfig = JSON.parse(fs.readFileSync(fuentesPath, 'utf8'));
}

// 2. Cargar ingesta de hoy
const semanaActualDir = path.join(ROOT_RADAR, 'data', 'semana_actual');
let noticiasHoy = null;
if (fs.existsSync(semanaActualDir)) {
  const files = fs.readdirSync(semanaActualDir).filter(f => f.endsWith('.json')).sort();
  if (files.length > 0) {
    const ultimoArchivo = path.join(semanaActualDir, files[files.length - 1]);
    noticiasHoy = JSON.parse(fs.readFileSync(ultimoArchivo, 'utf8'));
  }
}

// 3. Cargar todos los anuarios estratégicos
const anuariosDir = path.join(ROOT_RADAR, 'informes', 'anuales');
const anuarios = {};
if (fs.existsSync(anuariosDir)) {
  const anuarioFiles = fs.readdirSync(anuariosDir).filter(f => f.endsWith('.md')).sort();
  for (const f of anuarioFiles) {
    const match = f.match(/INFORME_ANUAL_(\d{4})\.md/);
    if (match) {
      const year = match[1];
      const content = fs.readFileSync(path.join(anuariosDir, f), 'utf8');
      anuarios[year] = {
        archivo: f,
        year: parseInt(year),
        markdown: content
      };
    }
  }
}

// 4. Indexar semanas por año (2020 a 2026)
const semanasDir = path.join(ROOT_RADAR, 'informes', 'semanales');
const semanasPorAno = {};
if (fs.existsSync(semanasDir)) {
  const anos = fs.readdirSync(semanasDir).filter(f => /^\d{4}$/.test(f)).sort();
  for (const ano of anos) {
    const dirAno = path.join(semanasDir, ano);
    const semFiles = fs.readdirSync(dirAno).filter(f => f.startsWith('INFORME_SEMANA_')).sort();
    semanasPorAno[ano] = semFiles.map(sf => {
      const semMatch = sf.match(/INFORME_SEMANA_(\d{4}-W\d{2})\.md/);
      const codigo = semMatch ? semMatch[1] : sf;
      return {
        archivo: sf,
        codigo: codigo,
        year: parseInt(ano),
        rutaRelativa: `${ano}/${sf}`
      };
    });
  }
}

// 5. Cargar Hipótesis de Futuro (Las 22 hipótesis reales de futures_radar.db)
let hipotesisFuturos = [];
const hipotesisDbPath = path.join(OUT_DIR, 'hipotesis_db.json');
if (fs.existsSync(hipotesisDbPath)) {
  try {
    hipotesisFuturos = JSON.parse(fs.readFileSync(hipotesisDbPath, 'utf8'));
    console.log(`✅ Cargadas ${hipotesisFuturos.length} hipótesis activas reales desde hipotesis_db.json`);
  } catch (e) {
    console.warn("⚠️ Error al leer hipotesis_db.json:", e);
  }
}

// Fallback si no existe hipotesis_db.json
if (!hipotesisFuturos || hipotesisFuturos.length === 0) {
  hipotesisFuturos = [
  {
    id: "FUT-01",
    titulo: "Bifurcación del Estándar Tecnológico Global (Pila Dual Occidente vs. Oriente)",
    horizonte: "H2 (2026 - 2030)",
    categoria: "Geopolítica Tecnológica",
    traccionScore: 78,
    tesis: "Las restricciones a semiconductores avanzados y exportaciones de software fuerzan al eje euroasiático (China/Rusia) a estandarizar una arquitectura informática paralela basada en litografía doméstica, RISC-V y sistemas operativos propios, fracturando la interoperabilidad de internet hacia 2030.",
    senalesPro: [
      {
        titular: "Pekín intensifica directrices de autosuficiencia en chips y restricciones a materiales críticos (galio y germanio)",
        fuente: "Global Times (2026)",
        url: "https://www.google.com/search?q=China+autosuficiencia+chips+galio+germanio+Global+Times+2026",
        impacto: "Acelera el desacoplamiento de componentes de hardware occidental."
      },
      {
        titular: "Presentación del procesador avanzado de Huawei desafiando las sanciones comerciales de Washington",
        fuente: "SCMP (2023)",
        url: "https://www.google.com/search?q=Huawei+Mate+60+Pro+chip+avanzado+SCMP+2023",
        impacto: "Demuestra capacidad de ingeniería inversa y producción sin maquinaria estadounidense."
      },
      {
        titular: "Nuevas restricciones de Países Bajos y ASML para el mantenimiento de máquinas de litografía en territorio chino",
        fuente: "The Wall Street Journal (2024)",
        url: "https://www.google.com/search?q=ASML+restricciones+litografia+China+WSJ+2024",
        impacto: "Cierra el acceso al soporte técnico oficial forzando el reemplazo integral."
      }
    ],
    senalesContra: [
      {
        titular: "Contrabando y canales paralelos de distribución de procesadores Nvidia H100 a través del Sudeste Asiático",
        fuente: "Financial Times (2024)",
        url: "https://www.google.com/search?q=Nvidia+chips+mercado+negro+Asia+FT+2024",
        impacto: "Indica que las tecnológicas chinas siguen dependiendo críticamente del silicio estadounidense."
      },
      {
        titular: "La complejidad extrema de la litografía EUV por debajo de 3nm frena la producción a gran escala sin patentes occidentales",
        fuente: "Nikkei Asia (2025)",
        url: "https://www.google.com/search?q=EUV+lithography+China+bottlenecks+Nikkei+2025",
        impacto: "Mantiene una brecha temporal de 4 a 6 años en rendimiento y eficiencia energética."
      }
    ]
  },
  {
    id: "FUT-02",
    titulo: "Desdolarización Energética y Fragmentación del Sistema SWIFT",
    horizonte: "H2 (2025 - 2032)",
    categoria: "Macroeconomía & Soberanía Financiera",
    traccionScore: 65,
    tesis: "La congelación de reservas soberanas en Occidente acelera la liquidación de contratos bilaterales de petróleo y gas en yuanes, dirhams y monedas locales entre el bloque BRICS+, reduciendo la cuota del petrodólar y fragmentando los sistemas de compensación interbancaria.",
    senalesPro: [
      {
        titular: "Ampliación histórica del bloque BRICS en Johannesburgo incorporando a Emiratos Árabes Unidos e Irán",
        fuente: "Jeune Afrique (2023)",
        url: "https://www.google.com/search?q=Ampliacion+BRICS+Johannesburgo+Emiratos+Iran+2023",
        impacto: "El bloque controla ahora más del 42% de la producción mundial de crudo."
      },
      {
        titular: "India utiliza dirhams emiratíes para adquirir petróleo ruso con descuento sorteando el tope de precios del G7",
        fuente: "Reuters (2023)",
        url: "https://www.google.com/search?q=India+compra+petroleo+ruso+dirhams+emiraties+Reuters+2023",
        impacto: "Crea precedentes de pago fuera de la jurisdicción bancaria del dólar."
      },
      {
        titular: "Acuerdos comerciales bilaterales de suministro energético liquidados íntegramente en yuanes en el Golfo Pérsico",
        fuente: "SCMP (2026)",
        url: "https://www.google.com/search?q=Acuerdos+suministro+energetico+yuanes+Golfo+SCMP+2026",
        impacto: "Debilita el monopolio del petrodólar en los mercados de futuros de energía."
      }
    ],
    senalesContra: [
      {
        titular: "El dólar estadounidense mantiene más del 84% de las transacciones globales de divisas según el Banco de Pagos Internacionales",
        fuente: "BIS Triennial Survey (2024)",
        url: "https://www.google.com/search?q=BIS+survey+US+dollar+dominance+forex+2024",
        impacto: "La liquidez y profundidad de los mercados de deuda estadounidenses no tienen sustituto cercano."
      },
      {
        titular: "Discrepancias geopolíticas estructurales entre China e India bloquean la creación de una moneda común BRICS",
        fuente: "The Times of India (2024)",
        url: "https://www.google.com/search?q=India+rejects+BRICS+common+currency+Times+of+India+2024",
        impacto: "Frena la transición hacia una divisa de reserva multinacional cohesionada."
      }
    ]
  },
  {
    id: "FUT-03",
    titulo: "Desindustrialización Estructural Europea por Brecha Energética y Regulatoria",
    horizonte: "H1 (2024 - 2028)",
    categoria: "Industria & Competitividad",
    traccionScore: 82,
    tesis: "La pérdida permanente del gas barato por gasoducto y la asfixia normativa europea frente a los subsidios de EEUU (IRA) y la sobrecapacidad industrial china provocan la relocalización de plantas químicas, de automoción y acero hacia Norteamérica y Asia.",
    senalesPro: [
      {
        titular: "El informe Mario Draghi advierte de una lenta agonía económica en Europa sin una inversión común de 800.000M€ al año",
        fuente: "Politico Europe (2024)",
        url: "https://www.google.com/search?q=Informe+Mario+Draghi+competitividad+europea+Politico+2024",
        impacto: "Diagnóstico oficial al más alto nivel comunitario sobre la pérdida de modelo productivo."
      },
      {
        titular: "Volkswagen y BASF anuncian planes de ajuste y relocalización de inversiones fuera de Alemania",
        fuente: "Der Spiegel / FAZ (2024)",
        url: "https://www.google.com/search?q=Volkswagen+BASF+ajustes+inversiones+Alemania+Der+Spiegel+2024",
        impacto: "Afecta al núcleo vertebrador del empleo industrial de Europa Central."
      },
      {
        titular: "El precio del gas natural industrial en Europa triplica de forma sostenida las tarifas vigentes en el mercado de EEUU",
        fuente: "Expansión (2025)",
        url: "https://www.google.com/search?q=Brecha+precios+gas+industrial+Europa+EEUU+Expansion+2025",
        impacto: "Destruye los márgenes operativos de la industria de síntesis química y fertilizantes."
      }
    ],
    senalesContra: [
      {
        titular: "Récord histórico de generación eléctrica renovable (solar y eólica) en España y el sur de Europa con precios marginales cero",
        fuente: "El País (2025)",
        url: "https://www.google.com/search?q=Record+generacion+renovable+precios+cero+Espana+El+Pais+2025",
        impacto: "Genera una ventaja competitiva para la electrificación limpia en la periferia europea."
      },
      {
        titular: "Entrada en vigor del Fondo Europeo para Chips y ayudas estatales a grandes fábricas en Dresde y Grenoble",
        fuente: "Euronews (2024)",
        url: "https://www.google.com/search?q=European+Chips+Act+fabricas+semiconductores+Euronews+2024",
        impacto: "Intento de retención de industria de alto valor añadido con respaldo fiscal."
      }
    ]
  },
  {
    id: "FUT-04",
    titulo: "Giro Poscolonial del Sahel y Monopolio de Recursos Críticos",
    horizonte: "H1 (2023 - 2030)",
    categoria: "Seguridad & Recursos Estratégicos",
    traccionScore: 88,
    tesis: "La expulsión de tropas occidentales de Mali, Níger y Burkina Faso crea un bloque militar soberano (AES) que renegocia o cancela contratos de uranio, litio y oro, desplazando a las multinacionales europeas en favor de operadores estatales chinos y rusos.",
    senalesPro: [
      {
        titular: "Mali, Níger y Burkina Faso anuncian su salida irrevocable de la CEDEAO y consolidan la Alianza del Sahel",
        fuente: "The Africa Report (2024)",
        url: "https://www.google.com/search?q=Salida+CEDEAO+Alianza+Sahel+The+Africa+Report+2024",
        impacto: "Ruptura definitiva de la arquitectura institucional de tutela occidental en África Occidental."
      },
      {
        titular: "La junta de Níger retira la licencia de explotación de la gigantesca mina de uranio de Imouraren a la francesa Orano",
        fuente: "Jeune Afrique (2024)",
        url: "https://www.google.com/search?q=Niger+retira+licencia+uranio+Orano+Imouraren+Jeune+Afrique+2024",
        impacto: "Pone en riesgo el aprovisionamiento de combustible para los reactores nucleares franceses."
      },
      {
        titular: "Firma de nuevos acuerdos mineros y de seguridad con empresas estatales rusas y consorcios de Pekín",
        fuente: "AllAfrica (2025)",
        url: "https://www.google.com/search?q=Sahel+acuerdos+mineros+Rusia+China+AllAfrica+2025",
        impacto: "Monopoliza la salida de tierras raras y minerales para baterías fuera del control occidental."
      }
    ],
    senalesContra: [
      {
        titular: "Recrudecimiento violento de atentados yihadistas de JNIM e ISGS en las fronteras de Mali y Burkina Faso",
        fuente: "Le Monde (2025)",
        url: "https://www.google.com/search?q=Atentados+yihadistas+Sahel+JNIM+Le+Monde+2025",
        impacto: "Demuestra la incapacidad militar de las juntas para asegurar los corredores de transporte sin logística internacional."
      },
      {
        titular: "Dificultades financieras extremas y aislamiento comercial por falta de acceso directo a puertos marítimos de la costa",
        fuente: "The Africa Report (2025)",
        url: "https://www.google.com/search?q=Crisis+financiera+aislamiento+Sahel+Africa+Report+2025",
        impacto: "Obliga a negociaciones de compromiso pragmático con vecinos como Togo o Costa de Marfil."
      }
    ]
  },
  {
    id: "FUT-05",
    titulo: "Automatización Agéntica de Servicios Profesionales y Reemplazo de Backoffice",
    horizonte: "H1 (2024 - 2028)",
    categoria: "Inteligencia Artificial & Economía del Trabajo",
    traccionScore: 74,
    tesis: "La evolución de LLMs conversacionales hacia enjambres agénticos autónomos con capacidad de ejecución de herramientas sustituye de forma masiva tareas de programación junior, auditoría documental, análisis financiero y soporte al cliente.",
    senalesPro: [
      {
        titular: "Las grandes consultoras y entidades de Wall Street anuncian recortes drásticos en la contratación de analistas junior",
        fuente: "The Wall Street Journal (2025)",
        url: "https://www.google.com/search?q=Wall+Street+reducir+contratacion+analistas+junior+IA+WSJ+2025",
        impacto: "Primer síntoma visible de desintermediación de mano de obra cualificada en sectores de alta remuneración."
      },
      {
        titular: "Despliegue operativo de sistemas agénticos de desarrollo de software autónomo capaces de completar proyectos de código de punta a punta",
        fuente: "Ars Technica (2026)",
        url: "https://www.google.com/search?q=Autonomous+coding+agents+software+development+2026",
        impacto: "Reduce el ciclo de desarrollo de software en órdenes de magnitud a costes cercanos a cero."
      },
      {
        titular: "Anthropic advierte en sus documentos de inversores de la inminente sustitución de procesos corporativos enteros por agentes",
        fuente: "Le Figaro (2026)",
        url: "https://www.google.com/search?q=Anthropic+documento+inversores+automatizacion+Le+Figaro+2026",
        impacto: "Los propios laboratorios pioneros fijan la fecha del impacto antes de 2028."
      }
    ],
    senalesContra: [
      {
        titular: "La barrera de fiabilidad en entornos fuertemente regulados (sanidad, banca y tribunales) exige supervisión humana obligatoria",
        fuente: "Financial Times (2025)",
        url: "https://www.google.com/search?q=AI+reliability+hallucinations+regulated+industries+FT+2025",
        impacto: "El coste legal y de cumplimiento de un error alucinado frena el reemplazo completo del profesional."
      },
      {
        titular: "Cuellos de botella de energía eléctrica y refrigeración en centros de datos frenan el ritmo de escalado masivo de inferencia",
        fuente: "Bloomberg (2025)",
        url: "https://www.google.com/search?q=Data+centers+power+grid+bottlenecks+AI+Bloomberg+2025",
        impacto: "Pone límites físicos al coste por consulta de los modelos más potentes."
      }
    ]
  }
];
}

// 6. Escribir el dataset consolidado
os_dataset = {
  fechaGeneracion: new Date().toISOString(),
  fuentesConfig,
  noticiasHoy,
  anuarios,
  semanasPorAno,
  hipotesisFuturos,
  totalSemanas: Object.values(semanasPorAno).reduce((acc, curr) => acc + curr.length, 0),
  totalAnuarios: Object.keys(anuarios).length
};

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(OUT_FILE, JSON.stringify(os_dataset, null, 2), 'utf8');

console.log(`✅ Dataset maestro compilado con éxito:`);
console.log(`   -> Total semanas indexadas: ${os_dataset.totalSemanas}`);
console.log(`   -> Total anuarios indexados: ${os_dataset.totalAnuarios}`);
console.log(`   -> Hipótesis de futuro configuradas: ${hipotesisFuturos.length}`);
console.log(`   -> Guardado en: ${OUT_FILE}`);
