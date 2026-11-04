(() => {
  const A = window.ATLAS;
  A.types = {
    vote:{label:'Voto y participación',color:'#236747',dash:'',width:1.7},
    appointment:{label:'Nombramiento y delegación',color:'#87651D',dash:'9 4',width:1.6},
    oversight:{label:'Regulación y control',color:'#924451',dash:'',width:2.4},
    capital:{label:'Dinero: capital, contratos, ayudas y cuotas',color:'#A34F30',dash:'4 3',width:1.8},
    influence:{label:'Interlocución e influencia',color:'#66635C',dash:'2 5',width:1.7}
  };
  A.edges = [];
  const e = (from,to,type,label,detail,refs,status='framework',date='Referencia normativa',phase=null) => A.edges.push({id:`r${String(A.edges.length+1).padStart(3,'0')}`,from,to,type,label,detail,sources:refs.split(' '),status,date,phase});
  e('citizens','congress','vote','Elige representación','Voto a candidaturas del Congreso según la ley electoral; no permite reordenar la lista en el régimen general.','election ce');
  e('citizens','senate','vote','Vota candidatos','Elección directa de parte del Senado mediante candidatos individuales. Otra parte procede de designación autonómica.','election ce');
  e('citizens','ep','vote','Elige eurodiputados','Sufragio directo en elecciones europeas. El Parlamento ejerce poderes legislativos y de control.','ep election');
  e('citizens','municipal','vote','Elige concejales','Elección municipal; la elección del alcalde tiene su propio procedimiento y excepciones.','election');
  e('citizens','cabildos','vote','Elige consejeros','Representación insular canaria en el régimen electoral de cabildos.','election');
  e('citizens','regionalparl','vote','Elige parlamentos','Sufragio autonómico según legislación y estatuto aplicables.','ce election');
  e('regionalparl','regionalgov','appointment','Interviene en la investidura','La presidencia autonómica se forma según su estatuto; no se confunde parlamento con ejecutivo.','ce');
  e('regionalparl','senate','appointment','Designa senadores','Designación autonómica de una parte de la Cámara territorial.','ce');
  e('citizens','parties','vote','Puede afiliarse y participar','La participación interna depende de estatutos y procedimientos. No equivale a poder elegir libremente todo candidato.','ce');
  e('parties','congress','influence','Presenta candidaturas','La selección partidaria condiciona las listas; no constituye mandato imperativo jurídico sobre el escaño.','election ce');
  e('congress','gov','appointment','Otorga la confianza','Investidura de la presidencia del Gobierno conforme al art. 99.','ce');
  e('crown','gov','appointment','Formaliza el nombramiento','Nombramiento constitucional de la presidencia tras la confianza parlamentaria; no selección discrecional independiente.','ce');
  e('congress','gov','oversight','Controla y puede censurar','Responsabilidad parlamentaria y moción de censura constructiva bajo requisitos constitucionales.','ce');
  e('gov','congress','oversight','Presenta proyectos y presupuestos','La iniciativa del ejecutivo no sustituye a la aprobación parlamentaria; los decretos-leyes requieren convalidación o derogación en 30 días.','ce');
  e('congress','senate','oversight','Remite textos legislativos','Participación sucesiva de las dos cámaras, con las facultades y plazos previstos en la Constitución.','ce');
  e('gov','council','appointment','Representa a España','Ministros del Gobierno participan en el Consejo de la UE según la materia.','eu councils');
  e('gov','eucouncil','appointment','Participa en las cumbres','La presidencia del Gobierno integra el Consejo Europeo por España.','councils');
  e('commission','ep','oversight','Presenta propuestas','Iniciativa general de la Comisión; el Parlamento negocia, enmienda y decide según el procedimiento.','ep teu');
  e('commission','council','oversight','Presenta propuestas','El Consejo de la UE es colegislador en el procedimiento ordinario.','eu');
  e('ep','council','oversight','Colegisla con el Consejo','Relación de decisión conjunta, no mando del Parlamento sobre el Consejo. Hay materias con procedimientos especiales.','eu ep');
  e('ep','commission','appointment','Elige y da aprobación','Elige la presidencia de la Comisión y aprueba el colegio en el procedimiento del art. 17 TUE.','teu');
  e('ep','commission','oversight','Solicita iniciativas y controla','Puede solicitar propuestas por art. 225 TFUE y ejercer control político; la iniciativa indirecta no equivale a iniciativa general propia.','ep teu');
  e('eucouncil','commission','appointment','Propone su presidencia','Propuesta al Parlamento teniendo en cuenta las elecciones europeas; después intervienen otros pasos del nombramiento.','teu');
  e('eucouncil','bce','appointment','Nombra el Comité Ejecutivo','Mayoría cualificada, recomendación del Consejo y consultas al Parlamento y al Consejo de Gobierno del BCE según art. 283.','bceappointment');
  e('ep','bce','oversight','Exige rendición de cuentas','Informes y diálogo monetario. Control democrático no significa potestad para ordenar un tipo de interés.','accountability');
  e('bce','bde','oversight','Dirige la política del Eurosistema','Banco de España se ajusta a orientaciones e instrucciones BCE en sus funciones del sistema europeo, no en todo ámbito indiscriminadamente.','bde');
  e('bde','banks','oversight','Supervisa dentro de su marco','Supervisión bancaria compartida según las competencias del Mecanismo Único de Supervisión.','bde');
  e('bce','citizens','oversight','Incide en las condiciones monetarias','Las decisiones monetarias afectan crédito, ahorro y actividad. No fijan individualmente cada contrato ni producen siempre el mismo efecto.','bce accountability');
  e('citizens','civil','vote','Se organiza','Derecho de asociación y participación colectiva; las organizaciones no representan automáticamente a toda la ciudadanía.','ce');
  e('citizens','unions','vote','Puede afiliarse','Libertad sindical en el marco constitucional y legal.','ce');
  e('unions','employers','influence','Negocia colectivamente','Interlocución y negociación colectiva según representatividad y ámbito. No se acredita aquí un convenio concreto.','ce');
  e('citizens','ilp','vote','Promueve o apoya','Iniciativa estatal con admisión y firmas autenticadas conforme a su ley.','ilp');
  e('ilp','congress','vote','Presenta una proposición','500.000 firmas y materias habilitadas. La admisibilidad está sujeta a causas legales y no garantiza aprobación.','ilp');
  e('citizens','ice','vote','Impulsa una iniciativa','Grupo organizador y apoyos con los requisitos de la Iniciativa Ciudadana Europea.','ice');
  e('ice','commission','vote','Solicita una propuesta','Un millón de apoyos y umbrales en siete Estados. La Comisión examina y responde sin obligación de legislar.','ice');
  e('citizens','petitions','vote','Presenta una petición','Derecho individual o colectivo en asuntos de competencia UE que afectan al peticionario.','petitions');
  e('petitions','ep','vote','Solicita examen parlamentario','La comisión competente examina la admisibilidad y las actuaciones posibles; no sustituye a un tribunal.','petitions');
  e('citizens','transparency','vote','Solicita documentos','Derecho de acceso a información pública existente, con los límites legalmente previstos.','transparency');
  e('transparency','admin','vote','Pide información al órgano','Se solicita al sujeto competente. Deben distinguirse documento existente, dato público y elaboración nueva.','transparency');
  e('transparency','ctbg','vote','Permite reclamar','Tras denegación o silencio, dentro del ámbito competencial del Consejo y plazos aplicables.','transparency');
  e('ctbg','admin','oversight','Resuelve reclamaciones','Control del derecho de acceso en el ámbito atribuido; hay autoridades autonómicas distintas.','transparency');
  e('citizens','defensor','vote','Presenta una queja','Vía gratuita de supervisión administrativa; no paraliza los plazos de otros recursos.','defensor');
  e('defensor','admin','oversight','Investiga y recomienda','Puede formular recomendaciones pero no anular por sí mismo actos administrativos.','defensor');
  e('citizens','courts','vote','Solicita tutela judicial','Acceso mediante el procedimiento, legitimación, plazos y requisitos correspondientes.','ce');
  e('courts','admin','oversight','Controla la legalidad','Control judicial de actuaciones administrativas dentro de los procesos previstos.','ce');
  e('tc','congress','oversight','Controla constitucionalidad','Control sobre normas y actuaciones en sus procedimientos; no subordinación política de la Cámara.','tc');
  e('congress','tc','appointment','Propone magistrados','Cuatro magistrados a propuesta del Congreso por mayoría de tres quintos. El nombramiento formal corresponde al Rey.','ce tc');
  e('senate','tc','appointment','Propone magistrados','Cuatro a propuesta del Senado en su procedimiento, con mayoría de tres quintos.','ce tc');
  e('gov','tc','appointment','Propone dos magistrados','Una de las vías de propuesta constitucional; no instrucción de sentencias.','ce tc');
  e('cgpj','tc','appointment','Propone dos magistrados','Competencia de propuesta diferenciada del ejercicio de jurisdicción constitucional.','ce tc');
  e('congress','cgpj','appointment','Elige vocales','Participación parlamentaria en la elección de vocales según la LOPJ. No prueba decisiones judiciales pactadas.','judiciary');
  e('senate','cgpj','appointment','Elige vocales','Participación del Senado en la elección de vocales según la LOPJ.','judiciary');
  e('gov','fiscal','appointment','Propone fiscal general','Nombramiento por el Rey a propuesta del Gobierno, oído el CGPJ y con procedimiento estatutario.','fiscal');
  e('cgpj','fiscal','appointment','Emite su parecer','Intervención consultiva en el nombramiento, distinta de la decisión de propuesta gubernamental.','fiscal');
  e('gov','admin','appointment','Dirige la Administración','Dirección del ejecutivo con sometimiento a ley y servicio objetivo a los intereses generales.','ce');
  e('accounts','admin','oversight','Fiscaliza cuentas públicas','Control de cuentas y gestión económica; no sustitución de decisiones presupuestarias.','ce');
  e('accounts','parties','oversight','Fiscaliza financiación','Examen de financiación según la legislación de partidos.','parties');
  e('airef','gov','oversight','Evalúa y recomienda','Informes y recomendaciones fiscales; no aprueba los presupuestos.','airef');
  e('cnmc','telefonica','oversight','Regula en su competencia','Marco de supervisión sectorial y competencia. No representa una sanción concreta a Telefónica.','cnmc');
  e('cnmc','endesa','oversight','Supervisa en su competencia','Marco de competencia y energía. No acredita una infracción particular.','cnmc');
  e('cnmv','telefonica','oversight','Supervisa como cotizada','Marco de transparencia de emisores y mercados de valores; no juicio de rentabilidad.','cnmv telefonica');
  e('admin','contractors','capital','Puede adjudicar contratos','Marco general de obras, suministros y servicios. Falta expediente para atribuir una adjudicación singular.','contracts');
  e('citizens','aeat','capital','Tributación estatal de hogares','La AEAT gestiona impuestos como el IRPF y el IVA. En el IVA, las empresas repercuten el impuesto y lo liquidan cuando procede. La flecha resume el circuito, no implica que cada hogar ingrese directamente todos los impuestos.','aeat');
  e('contractors','aeat','capital','Tributación empresarial','Las empresas que contratan con el Estado también están sujetas a las obligaciones tributarias que les correspondan, como Sociedades o la liquidación de IVA. El caso se ilustra con el nodo de contratistas, sin atribuirle una cifra.','aeat');
  e('aeat','state-budget','capital','La recaudación estatal nutre los ingresos públicos','Se representa la parte que corresponde al Estado. La AEAT también gestiona ingresos de otras administraciones. La previsión de ingresos y la recaudación efectiva se consultan por separado.','aeat tax-revenue budget-law');
  e('gov','state-budget','oversight','Elabora el proyecto de presupuestos','La elaboración corresponde al Gobierno y la aprobación a las Cortes Generales. Puede haber prórroga presupuestaria conforme al artículo 134.','ce');
  e('congress','state-budget','oversight','Interviene en la aprobación parlamentaria','La aprobación de los Presupuestos corresponde a las Cortes Generales, con intervención de ambas cámaras.','ce');
  e('state-budget','admin','capital','Autoriza créditos para ejecutar gasto','Los créditos habilitan gasto en las condiciones legales. La ejecución tiene fases como el reconocimiento de la obligación y el pago.','budget-law budget-execution');
  e('admin','public-spend','capital','Ejecuta el gasto público','Los órganos competentes gestionan el gasto con cargo a sus créditos. Las cifras de ejecución permiten distinguir obligaciones reconocidas y pagos.','budget-law budget-execution');
  e('state-budget','regionalgov','capital','Canaliza transferencias a comunidades autónomas','Las transferencias presupuestarias son una vía. También hay tributos propios y cedidos, fondos y modelos de financiación distintos, incluidos los regímenes forales.','regional-funding');
  e('state-budget','municipal','capital','Canaliza la participación local en ingresos estatales','La participación en tributos del Estado es una fuente de financiación local prevista en la ley.','local-tax');
  e('citizens','municipal','capital','Paga tributos locales cuando corresponde','Por ejemplo, IBI según la titularidad y las reglas del impuesto. La gestión puede estar delegada.','local-tax');
  e('citizens','unions','capital','Cuotas de afiliación','Las pagan las personas afiliadas. UGT y CCOO publican sus tarifas. Esta relación no cuantifica el peso de las cuotas en cada sindicato.','ugt-fees ccoo-fees');
  e('admin','unions','capital','Convoca subvenciones para actividad sindical','Trabajo convocó en 2026 ayudas por representatividad con un máximo conjunto de 32 millones de euros. La convocatoria no acredita la concesión individual ni el pago.','union-call grants','documented','26/06/2026 · publicación en el BOE','Convocatoria publicada');
  e('admin','stellantis','capital','Concede subvención industrial','Industria concedió 133.708.540,40 € de subvención, con 0 € de préstamo, en el expediente VEB-010100-2024-7. La convocatoria está cofinanciada por el Mecanismo de Recuperación y Resiliencia de la UE. Importe concedido, no pago comprobado.','stellantis-grant','documented','12/12/2024 · resolución firmada','Concesión aprobada');
  e('admin','indra','capital','Regula préstamos públicos a Indra','El Real Decreto 913/2025 fija condiciones para préstamos reintegrables por programa. Cada concesión se instrumenta mediante orden. No se han verificado desembolsos.','indra-loan','framework','16/10/2025 · publicación en el BOE','Regulación del instrumento');
  e('admin','media','capital','Puede contratar publicidad institucional','El sector público estatal puede contratar campañas y difusión conforme al régimen aplicable. La compra puede pasar por intermediarios. No acredita un pago a un medio concreto.','ad-law contracts');
  e('banks','parties','capital','Puede conceder crédito','Mecanismo legal sujeto a información y fiscalización. No se afirma aquí un préstamo singular; condonaciones prohibidas.','parties');
  e('lobbies','commission','influence','Busca influir en decisiones','Interlocución de representantes de intereses conforme al registro. No prueba adopción de sus propuestas.','lobby');
  e('civil','commission','influence','Participa en interlocución','La representación de intereses incluye sociedad civil, además de empresas. No garantiza igualdad material de acceso.','lobby');
  e('media','citizens','influence','Difunde información y opiniones','Canal comunicativo amparado por libertades informativas. No se representa como capacidad acreditada de dirigir el voto.','ce');
  e('commission','blackrock','capital','Adjudicó un estudio','Estudio sobre criterios ambientales, sociales y de gobierno en banca. Caso examinado por la Defensora: crítica al escrutinio de conflictos, sin declaración de mala administración.','blackrock','documented','Adjudicación: marzo de 2020 · revisión: 25/11/2020','Adjudicación documentada');
  e('ombudsman','commission','oversight','Examinó el contrato BlackRock','Investigación 853/2020/KR y propuestas para fortalecer las reglas de conflictos de interés.','blackrock','documented','25/11/2020');
  e('fink','blackrock','appointment','Ocupa funciones directivas','El perfil del WEF identifica a Fink como presidente y consejero delegado de BlackRock. Vínculo personal.','wef','documented','Página consultada el 03/11/2026');
  e('fink','wef','appointment','Copreside el foro','La página identifica a Larry Fink y André Hoffmann como copresidentes. No es una arista de propiedad corporativa.','wef','documented','Página consultada el 03/11/2026');
  e('italy','enel','capital','Participación en el capital','El Ministerio figura con el 23,60% en la fotografía de Enel de diciembre de 2025.','enel','documented','31/12/2025','Participación a fecha de corte');
  e('enel','endesa','capital','Es accionista mayoritario','Participación mediante Enel Iberia; el informe semestral declara 71,2% del capital mercantil. No atribuir ese mismo porcentaje directamente al Estado italiano.','endesa','documented','30/06/2026','Participación a fecha de corte');
  e('mubadala','moeve','capital','Figura como accionista','Moeve identifica a Mubadala junto a Carlyle; no propiedad exclusiva de Mubadala.','moeve','documented','Página consultada el 03/11/2026');
  e('carlyle','moeve','capital','Figura como accionista','Vínculo de inversión identificado por la compañía; sin cuantificación actual añadida.','moeve','documented','Página consultada el 03/11/2026');
  e('sepi','telefonica','capital','Adquirió el 10%','Hito anunciado por SEPI, completando la operación de compra. No es una certificación de composición accionarial a fecha actual.','sepi','documented','20/05/2024','Adquisición anunciada');
  e('telefonica','ert','influence','Su presidente figura entre los miembros','El directorio identifica a Marc Murtra y su cargo en Telefónica. Representación abreviada de un vínculo personal, no propiedad societaria.','ert','documented','Directorio consultado el 03/11/2026');
  e('bce','euro','oversight','Desarrolla el proyecto','Según el diseño consultado, requiere marco legislativo europeo; no equivale a decisión unilateral de implantación.','digital');
  e('ep','euro','oversight','Participa como colegislador','El marco jurídico corresponde al Parlamento y al Consejo. Se muestra competencia, no aprobación final acreditada.','digital');
  e('council','euro','oversight','Participa como colegislador','El Consejo participa en la legislación del proyecto; no se da por cerrada la negociación.','digital');
  e('imf','gov','influence','Marco de vigilancia y asesoría','Función general del FMI respecto a sus miembros. No se afirma un programa de rescate vigente ni una orden fiscal concreta.','imf');
  e('municipal','mayor','appointment','Elección de la alcaldía','La corporación elige en los términos del art. 196 de la LOREG. Se aplica la regla de mayoría y, cuando corresponde, la regla subsidiaria de la lista más votada. Hay regímenes especiales.','election');
  e('citizens','admin','vote','Puede recurrir actos administrativos','La persona interesada puede presentar alzada o reposición según el acto, la vía y el plazo aplicables. Es una vía distinta de la queja y del recurso judicial.','procedure');
  e('courts','tjue','oversight','Plantea una cuestión prejudicial','Un órgano judicial nacional plantea una cuestión sobre interpretación o validez del Derecho de la UE conforme al art. 267. No es una apelación del litigio nacional.','preliminary');
  e('tjue','courts','oversight','Responde a la cuestión prejudicial','La respuesta europea sirve al órgano remitente para resolver el litigio conforme al Derecho de la UE.','preliminary');
  e('commission','tjue','oversight','Puede interponer un recurso de incumplimiento','La Comisión puede acudir al Tribunal por incumplimiento imputado a un Estado miembro tras la fase previa correspondiente.','infringement');
  e('bde','basel','influence','Participa en el Comité de Basilea','El BIS identifica al Banco de España como representante de España. Los estándares del Comité carecen de fuerza legal propia.','basel-members basel');
  e('bce','basel','influence','Participa en el Comité de Basilea','El BIS incluye al BCE y su Mecanismo Único de Supervisión entre sus representantes. Participar no equivale a delegar potestades jurídicas.','basel-members basel');
  e('icsid','gov','oversight','España figura como parte demandada en un arbitraje','Berkeley Exploration Ltd. contra Reino de España, ARB/24/22, sobre una concesión minera. El CIADI administra el procedimiento. El tribunal arbitral se constituyó el 10/03/2025. Se muestra este hito y no se infiere el resultado.','berkeley','documented','10/03/2025','Tribunal constituido');
  e('citizens','social-security','capital','Cotizaciones de trabajadores y autónomos','El sistema recibe cotizaciones según el régimen aplicable. También hay aportaciones empresariales y otras fuentes.','social-funding');
  e('contractors','social-security','capital','Cotizaciones empresariales','Las empresas con personal sujeto a cotización realizan las aportaciones correspondientes. El nodo de contratistas ilustra una parte del universo empresarial.','social-funding');
  e('state-budget','social-security','capital','Aportaciones del Estado','El Estado aporta recursos al presupuesto de la Seguridad Social. La Ley General de la Seguridad Social distingue entre modalidades contributivas y no contributivas.','social-funding');
  e('social-security','citizens','capital','Paga prestaciones de su competencia','Incluye prestaciones como pensiones, conforme a los requisitos del sistema.','social-funding');
  e('citizens','treasury','capital','Puede comprar deuda en emisión','Las compras en emisión aportan financiación. En el mercado secundario, la compraventa se realiza entre inversores.','treasury treasury-faq');
  e('treasury','state-budget','capital','Cubre necesidades de financiación mediante deuda','La emisión financia al Estado y genera pasivos. Se distingue de los impuestos y de los ingresos no financieros.','treasury budget-law');
  e('treasury','citizens','capital','Atiende intereses y amortización a tenedores','Los títulos tienen reglas de remuneración y devolución. La flecha ilustra a los particulares que sean titulares, no identifica a todos los acreedores.','treasury-faq');
  e('admin','parties','capital','Subvenciones públicas a partidos','La ley distingue subvenciones electorales y de funcionamiento, entre otras fuentes públicas.','parties');
  e('citizens','parties','capital','Cuotas y donaciones admitidas','La ley regula las cuotas de afiliados y las donaciones privadas permitidas. Esta arista describe el mecanismo, no una operación concreta.','parties');
  e('state-budget','eu-budget','capital','Contribuye a financiar el presupuesto europeo','Los recursos propios incluyen bases de cálculo vinculadas a RNB, IVA y plásticos, además de derechos de aduana. No significa que se transfiera un porcentaje de cada ticket de compra.','eu-funding');
  e('eu-recovery','admin','capital','Financia el plan de recuperación de España','La UE canaliza financiación al Estado bajo el plan aprobado y sus condiciones. La Comisión publica hitos y desembolsos.','spain-rrf');
  e('admin','indra','capital','Formaliza un contrato de asistencia técnica','El BOE identifica a Indra en el expediente 2025/EA15/00003777 y publica un valor de oferta seleccionada de 54.458,88 €. No acredita el pago.','indra-contract','documented','19/12/2025 · publicación en el BOE','Formalización publicada');
  A.routes = [
    {id:'social-money',topic:'money',title:'Cómo se financia la Seguridad Social',nodes:['state-budget','social-security','citizens'],context:['contractors'],sources:['social-funding'],text:'Las cotizaciones de trabajadores y empresas y las aportaciones del Estado son vías distintas. Las prestaciones se pagan según las reglas de cada modalidad.'},
    {id:'debt-money',topic:'money',title:'Quién financia la deuda pública',nodes:['citizens','treasury','state-budget'],sources:['treasury','treasury-faq'],text:'El Tesoro capta financiación al emitir títulos y atiende intereses y amortización. La compra en el mercado secundario no financia directamente una nueva emisión.'},
    {id:'party-money',topic:'money',title:'Cómo se financian los partidos',nodes:['admin','parties'],context:['citizens','banks','accounts'],sources:['parties'],text:'Subvenciones, cuotas y donaciones admitidas y crédito son vías distintas. El Tribunal de Cuentas fiscaliza la financiación.'},
    {id:'eu-money',topic:'money',title:'Dinero entre España y la UE',nodes:['state-budget','eu-budget'],context:['eu-recovery','admin','stellantis'],sources:['eu-funding','spain-rrf','stellantis-grant'],text:'El mapa muestra dos circuitos diferentes: las aportaciones al presupuesto europeo y la financiación del plan de recuperación español. La cofinanciación de un programa no acredita un pago europeo directo a la empresa.'},
    {id:'ballot',title:'De tu voto al Gobierno',nodes:['citizens','congress','gov'],text:'Eliges representación; el Congreso otorga la confianza. Puedes seguir ambas relaciones y sus límites.'},
    {id:'europe',title:'De tu voto a Europa',nodes:['citizens','ep','commission'],text:'El Parlamento elegido participa en la elección y aprobación de la Comisión y controla su actuación.'},
    {id:'information',title:'Pedir información pública',nodes:['citizens','transparency','admin'],text:'Identifica el documento y la administración que lo tiene. Hay límites de acceso y vías para reclamar.'},
    {id:'initiative',title:'Impulsar una ley europea',nodes:['citizens','ice','commission'],text:'Una iniciativa con apoyos suficientes obliga a examinar y responder; no garantiza una propuesta legislativa.'},
    {id:'taxes',title:'¿Adónde van los impuestos?',nodes:['citizens','aeat','state-budget','admin','public-spend'],context:['gov','congress','accounts','regionalgov','municipal','contractors'],sources:['tax-revenue','budget-execution','execution-2024','regional-funding','local-tax','canary-tax'],text:'Recorrido estatal simplificado. La recaudación se integra en los ingresos públicos y financia el conjunto de obligaciones, salvo afectación legal. El Gobierno prepara el presupuesto y las Cortes lo aprueban. En el avance provisional de la IGAE para 2024, los pagos del presupuesto corriente del Estado sumaron 387.995,8 millones de euros. Entre ellos: 153.898,4 millones en transferencias corrientes, 35.426,8 en gastos financieros, 20.779,3 en personal y 10.334,2 en inversiones reales. Son partidas seleccionadas del Estado, no el gasto consolidado de todas las administraciones ni el destino individual de los impuestos. Comunidades y municipios tienen sus propios presupuestos y fuentes. En Canarias, el IGIC forma parte de su régimen fiscal específico.'}
  ];
})();
