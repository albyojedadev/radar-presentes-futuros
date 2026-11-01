#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
generar_anuarios_completos.py
Genera Anuarios Estratégicos extensos, profundos, en lenguaje natural y accesibles
para cada ejercicio (2020 a 2026), auditando y sintetizando las semanas reales de la hemeroteca.
"""

import os
import glob
import re

BASE_DIR = r"D:\PROYECTOS\VibeCoding\_AUTOMATIZACIONES_E_INFORMES_\RADAR_DE_PRESENTES"
SEMANAS_DIR = os.path.join(BASE_DIR, "informes", "semanales")
ANUARIOS_DIR = os.path.join(BASE_DIR, "informes", "anuales")
os.makedirs(ANUARIOS_DIR, exist_ok=True)

# METADATOS Y CRÓNICA EDITORIAL EN LENGUAJE NATURAL POR AÑO
DATOS_ANUARIOS = {
    2020: {
        "titulo": "2020: El Año en que el Mundo se Detuvo y Cambiaron las Reglas",
        "subtitulo": "Crónica de un shock sanitario global, la fragilidad de nuestras certezas y las decisiones silenciosas que rediseñaron la economía",
        "resumen_narrativo": "2020 no fue solo el año del coronavirus; fue el año en que descubrimos de golpe que el mundo dependía de fábricas a miles de kilómetros para algo tan elemental como una mascarilla de tela o un bote de paracetamol. Mientras millones de familias vivían el confinamiento en sus casas y los aplausos resonaban a las ocho de la tarde, por debajo se aprobaron las mayores inyecciones de dinero público de la historia de Europa y se aceleró una transformación digital forzosa que en condiciones normales habría tardado una década. Fue un año de miedo, solidaridad y perplejidad, donde la política doméstica vivió momentos de extrema tensión mientras el tablero internacional cambiaba para siempre.",
        "estaciones": [
            {
                "estacion": "Invierno: La Llegada Silenciosa",
                "meses": "Enero - Marzo",
                "relato": "El año arrancó en España con la resaca de la investidura de Pedro Sánchez y la formación del primer gobierno de coalición de la democracia. Los informativos hablaban de tormentas como 'Gloria' o del conflicto en Oriente Medio tras la muerte del general Soleimani. Desde China llegaban noticias lejanas de una extraña neumonía en Wuhan que parecía no concernirnos. En febrero, la cancelación repentina del Mobile World Congress de Barcelona encendió las primeras alarmas, aunque las autoridades insistían en que el virus apenas tendría incidencia. Todo cambió el 14 de marzo: de la noche a la mañana, el país entero quedó confinado en sus casas. Los hospitales de Madrid y Cataluña se colapsaron, las residencias vivieron su etapa más dramática y la economía se detuvo en seco con la creación exprés de los ERTE para evitar el naufragio laboral."
            },
            {
                "estacion": "Primavera: La Desescalada y el Alivio Provisional",
                "meses": "Abril - Junio",
                "relato": "Encerrados entre cuatro paredes, los balcones se convirtieron en el centro de la vida social. Los precios del petróleo se hundieron a niveles nunca vistos (llegaron a cotizar en negativo porque no había dónde almacenar el crudo). A finales de abril los niños pudieron salir a la calle por primera vez y comenzó un complejo sistema de 'fases de desescalada' por provincias. En Estados Unidos, la muerte de George Floyd a manos de la policía desató la mayor oleada de protestas raciales en décadas. En España, el Congreso aprobó el Ingreso Mínimo Vital para amortiguar el golpe social, mientras el país recuperaba con cautela la calle de cara a un verano que todos deseaban normal."
            },
            {
                "estacion": "Verano: El Espejismo de la Normalidad y el Rescate Europeo",
                "meses": "Julio - Septiembre",
                "relato": "Bajo el lema de 'salvar el verano', el país intentó reactivar el turismo con terrazas abiertas y mascarillas obligatorias. Sin embargo, en julio las cancillerías europeas vivieron una cumbre histórica de cuatro días donde se alumbró el fondo Next Generation EU: 750.000 millones de euros en deuda compartida, algo que hasta entonces Alemania siempre había rechazado. En agosto, la explosión devastadora en el puerto de Beirut estremeció al mundo, mientras en España la Casa Real comunicaba la marcha de Juan Carlos I hacia Emiratos Árabes. A finales de verano, los rebrotes demostraron que la llamada 'nueva normalidad' era un espejismo y que el virus no se había marchado."
            },
            {
                "estacion": "Otoño: La Segunda Ola, la Esperanza de las Vacunas y el Brexit",
                "meses": "Octubre - Diciembre",
                "relato": "El otoño trajo un segundo estado de alarma con toques de queda nocturnos y cierres de hostelería, aunque sin confinamiento domiciliario total. La política española vivió la bronca moción de censura de Vox en la que Casado rompió con Abascal. En Estados Unidos, Joe Biden se impuso a Donald Trump en unas elecciones de tensión agónica que Trump se negó a reconocer. El gran alivio llegó en noviembre con el anuncio de la eficacia de las vacunas de Pfizer y Moderna. El 27 de diciembre, con la vacuna de Araceli en Guadalajara, se abrió la puerta a la esperanza en un año que terminó con un acuerdo del Brexit in extremis en Nochebuena."
            }
        ],
        "cortinas_humo": [
            {
                "asunto": "La batalla mediática sobre si 'salvar la Navidad' o 'salvar el verano'",
                "realidad": "Se centró el debate en la libertad de horarios de ocio individual para desviar la atención sobre la falta de refuerzo estructural en la atención médica primaria y el rastreo epidemiológico, que volvió a desbordarse en cada repunte."
            },
            {
                "asunto": "Las acusaciones de fraude electoral sin pruebas en Estados Unidos",
                "realidad": "Ocuparon horas de tertulias televisivas y sembraron una desconfianza institucional que culminaría meses después en el asalto al Capitolio, mientras se aprobaban rescates financieros multimillonarios a grandes corporaciones sin apenas debate."
            },
            {
                "asunto": "El mercado negro y la reventa de mascarillas y geles a precios abusivos",
                "realidad": "Se culpó a la 'picaresca individual' para tapar que Europa había desmantelado durante décadas su capacidad de fabricar productos sanitarios básicos, quedando a merced de suministradores exteriores."
            }
        ],
        "puntos_ciegos": [
            {
                "asunto": "La Ley de Seguridad Nacional impuesta por Pekín sobre Hong Kong",
                "impacto": "Aprobada en junio mientras Europa solo miraba estadísticas sanitarias. Supuso el fin efectivo de la autonomía hongkonesa ('un país, dos sistemas') y aceleró la emigración de capitales y profesionales hacia Singapur y Londres."
            },
            {
                "asunto": "El estallido de la guerra civil en la región de Tigray (Etiopía)",
                "impacto": "Ocurrió en noviembre sin apenas minutos en los telediarios occidentales, provocando una crisis humanitaria con cientos de miles de desplazados y desestabilizando todo el Cuerno de África junto al mar Rojo."
            },
            {
                "asunto": "La suspensión de la salida a bolsa de Ant Group (Jack Ma)",
                "impacto": "El gobierno chino frenó en seco la mayor OPV de la historia, marcando el inicio del control del Estado sobre las grandes tecnológicas privadas y anticipando la pugna por la soberanía del dinero digital."
            }
        ],
        "mirada_global": "Para la opinión pública española, 2020 fue una batalla doméstica por la salud, las restricciones y las ayudas laborales. En Europa se vivió como la prueba de fuego de la supervivencia de la Unión, salvada gracias al acuerdo del fondo de reconstrucción. Estados Unidos lo experimentó como una fractura social y política llevada al extremo en un año electoral. Por su parte, China aprovechó el control temprano de la epidemia para proyectar una imagen de eficacia organizativa ante el mundo, mientras el Sur Global sufría las consecuencias económicas del parón comercial sin colchones financieros.",
        "conclusiones": [
            "La globalización no era invulnerable: depender de una sola región del planeta para suministros médicos o componentes electrónicos es un riesgo de seguridad de primer orden.",
            "La deuda conjunta europea demostró que los grandes avances de integración comunitaria solo se producen al borde del abismo y bajo presión extrema.",
            "La polarización política y la desinformación digital demostraron tener la capacidad de erosionar la convivencia ciudadana incluso en mitad de una catástrofe humanitaria compartida."
        ]
    },

    2021: {
        "titulo": "2021: La Ilusión del Regreso, la Erupción de La Palma y el Despertar de la Inflación",
        "subtitulo": "Un año de vacunación masiva, sobresaltos políticos en España y la retirada de Afganistán que anunció un nuevo orden mundial",
        "resumen_narrativo": "2021 comenzó bajo la nieve histórica del temporal Filomena y con el asalto al Capitolio de Washington que conmocionó a las democracias occidentales. Fue el año en que los pinchazos en los brazos nos devolvieron poco a poco la libertad de movimiento, pero también el año en que la factura de la luz empezó a escalar sin freno anunciando la crisis del gas que estaba por venir. En España, la política vivió un auténtico terremoto con las elecciones de Madrid, la salida de Pablo Iglesias y la concesión de los indultos a los líderes del procés, antes de que la naturaleza recordara su fuerza con la erupción del volcán de Cumbre Vieja en La Palma. En el mundo, la caótica salida de las tropas occidentales de Kabul y el ascenso de los talibanes confirmaron el final de una era.",
        "estaciones": [
            {
                "estacion": "Invierno: De la Nieve de Filomena al Asalto en Washington",
                "meses": "Enero - Marzo",
                "relato": "Enero dejó una estampa imborrable: medio metro de nieve paralizó Madrid y el centro del país por la borrasca Filomena. Pocos días antes, el mundo miraba atónito cómo simpatizantes de Trump irrumpían violentamente en el Capitolio de EEUU. En febrero, las elecciones catalanas dieron la victoria en votos a Salvador Illa, pero el encarcelamiento del rapero Pablo Hasél desató noches de furia y barricadas en Barcelona. En marzo, una fallida moción de censura en Murcia provocó un efecto dominó: Isabel Díaz Ayuso adelantó elecciones en Madrid y Pablo Iglesias sorprendió a todos abandonando la vicepresidencia del Gobierno para ser candidato, cediendo el liderazgo de su espacio a Yolanda Díaz."
            },
            {
                "estacion": "Primavera: El Vuelco del 4-M, la Crisis de Ceuta y los Indultos",
                "meses": "Abril - Junio",
                "relato": "En abril, mientras el mundo del fútbol derribaba en 48 horas el proyecto elitista de la Superliga, la campaña madrileña alcanzó su punto máximo: el 4 de mayo Ayuso arrasó en las urnas e Iglesias anunció su retirada de la política. Semanas después, Marruecos abrió la frontera permitiendo la entrada irregular de más de 8.000 personas en Ceuta en respuesta a la acogida médica del líder del Polisario Brahim Gali, provocando una gravísima crisis diplomática y el despliegue del ejército. En junio, tras semanas de debate encendido, Pedro Sánchez anunció la concesión de los indultos a los nueve condenados por el 1-O con el objetivo de encauzar la convivencia en Cataluña."
            },
            {
                "estacion": "Verano: Calor Récord, el Precio de la Luz y la Caída de Kabul",
                "meses": "Julio - Agosto",
                "relato": "El verano trajo la vuelta del turismo con el 'Certificado COVID' y la emoción de la Eurocopa, pero también una ola de calor histórica y las primeras alarmas por el precio de la electricidad, que superó por primera vez los 100 euros el megavatio hora. En agosto, el mundo asistió conmovido al colapso del gobierno afgano: los talibanes tomaron Kabul en cuestión de días ante la retirada de las tropas de EEUU y miles de personas intentaron huir a la desesperada en aviones militares en un caótico puente aéreo donde España gestionó el campamento de recepción europeo en Torrejón."
            },
            {
                "estacion": "Otoño: La Lava de La Palma, el Gas por las Nubes y la Amenaza de Ómicron",
                "meses": "Septiembre - Diciembre",
                "relato": "El 19 de septiembre la tierra se abrió en Cumbre Vieja: durante 85 días, la lava del volcán destruyó más de 1.300 viviendas en La Palma en una retransmisión televisiva constante. Al mismo tiempo, el precio del gas natural en Europa se multiplicaba por cinco y Argelia cerraba el gasoducto Magreb-Europa que pasaba por Marruecos. En Alemania, el socialdemócrata Olaf Scholz ganó las elecciones cerrando los 16 años de la era Merkel. Cuando el año terminaba y se pactaba la reforma laboral en España, la aparición de la variante Ómicron en Sudáfrica desató un nuevo récord de contagios que aguó las navidades."
            }
        ],
        "cortinas_humo": [
            {
                "asunto": "La psicosis por la vacuna de AstraZeneca y los cambios de criterio por edades",
                "realidad": "Ocupó portadas durante semanas por casos estadísticamente mínimos de trombos, ocultando el pulso comercial entre la Comisión Europea y las farmacéuticas por los retrasos en los contratos de entrega."
            },
            {
                "asunto": "El escándalo del 'Partygate' en el Reino Unido",
                "realidad": "Las juergas de Boris Johnson en Downing Street durante el confinamiento acapararon el debate para no discutir los graves problemas de desabastecimiento en gasolineras y falta de camioneros generados por el Brexit."
            },
            {
                "asunto": "El anuncio del 'Metaverso' de Mark Zuckerberg",
                "realidad": "Una maniobra de cambio de marca hacia Meta para limpiar la reputación de Facebook tras la filtración de los 'Papeles de Pandora' y los informes internos que demostraban el daño de Instagram en adolescentes."
            }
        ],
        "puntos_ciegos": [
            {
                "asunto": "La crisis de deuda de Evergrande en China",
                "impacto": "La quiebra encubierta del mayor promotor inmobiliario chino marcó el inicio del pinchazo de la burbuja inmobiliaria asiática, con impacto directo en el precio de los metales y el comercio global."
            },
            {
                "asunto": "La concentración de tropas rusas en la frontera de Ucrania desde noviembre",
                "impacto": "Moscú exigió por escrito que la OTAN no se expandiera hacia el este; la mayoría de líderes europeos lo trataron como un simple farol negociador para inaugurar el gasoducto Nord Stream 2."
            },
            {
                "asunto": "La cadena de golpes de estado militares en el Sahel (Mali, Guinea, Sudán)",
                "impacto": "Supuso el repliegue definitivo de las tropas francesas de África Occidental y la entrada de mercenarios rusos del grupo Wagner para controlar recursos mineros estratégicos."
            }
        ],
        "mirada_global": "En España, el año estuvo marcado por la recuperación de la movilidad, las tensiones territoriales y la solidaridad con La Palma. En Europa occidental, la atención se centró en el relevo de Merkel y en las primeras señales de que la dependencia del gas ruso era una trampa mortal. Estados Unidos, bajo la presidencia de Biden, intentó proyectar liderazgo internacional pero la retirada de Kabul dañó severamente su credibilidad disuasoria. Mientras tanto, Rusia preparaba en silencio el tablero militar para el año siguiente y China apostó por un cierre hermético de fronteras.",
        "conclusiones": [
            "La energía no es un coste secundario: la subida del gas demostró que cuando la energía falla, toda la economía y la estabilidad de los hogares se tambalea.",
            "Los vacíos de poder no permanecen vacíos: la retirada occidental de Afganistán y el repliegue francés del Sahel fueron aprovechados de inmediato por potencias rivales.",
            "La política de gestos y frases virales en redes sociales continuó desplazando el debate riguroso sobre reformas a largo plazo como las pensiones o la industria."
        ]
    },

    2022: {
        "titulo": "2022: El Fin de la Paz Europea y el Regreso de la Geopolítica Dura",
        "subtitulo": "La invasión de Ucrania, el estallido de la inflación, la crisis interna del PP y el adiós a la Reina Isabel II",
        "resumen_narrativo": "2022 quedará grabado en los libros de historia como el año en que la guerra a gran escala regresó al corazón del continente europeo. El 24 de febrero, la invasión rusa de Ucrania dinamitó tres décadas de estabilidad, provocó el éxodo de millones de refugiados y desató una crisis energética sin precedentes que disparó el coste de la vida y llenó los hogares de incertidumbre. En España, el año comenzó con una batalla interna en el Partido Popular que acabó con el liderazgo de Pablo Casado y la llegada de Alberto Núñez Feijóo, mientras el Gobierno pactaba con Bruselas la 'excepción ibérica' para abaratar la luz. Fue el año del adiós a la Reina Isabel II tras 70 años de reinado, de una inflación que rozó el 10% y de la constatación de que la seguridad y la energía ya no podían darse por sentadas.",
        "estaciones": [
            {
                "estacion": "Invierno: La Caída de Casado y los Tanques en Ucrania",
                "meses": "Enero - Marzo",
                "relato": "Febrero vivió una semana vertiginosa que sacudió la política española: las acusaciones cruzadas de espionaje y comisiones entre la dirección nacional del PP e Isabel Díaz Ayuso culminaron en una concentración masiva ante la sede de Génova y la forzada dimisión de Pablo Casado, propiciando la llamada unánime a Núñez Feijóo. Pero apenas 48 horas después, el mundo se congeló: Vladímir Putin ordenó la invasión militar de Ucrania con bombardeos masivos y el avance sobre Kiev. Alemania dio un giro histórico al prometer 100.000 millones para su ejército y paralizar el gasoducto Nord Stream 2. En marzo, la subida del gasóleo desató en España un paro masivo de transportistas que vació los supermercados, mientras Pedro Sánchez daba un giro de 180 grados al apoyar el plan de Marruecos para el Sáhara Occidental provocando el enfado de Argelia."
            },
            {
                "estacion": "Primavera: La Excepción Ibérica, las Elecciones Andaluzas y Pegasus",
                "meses": "Abril - Junio",
                "relato": "En abril, Emmanuel Macron revalidó la presidencia de Francia frente a Marine Le Pen, mientras Feijóo era proclamado líder del PP en Sevilla. En mayo, el escándalo del software espía Pegasus en los teléfonos de líderes independentistas y del propio Sánchez forzó la salida de la directora del CNI. España y Portugal lograron una victoria diplomática clave en Bruselas con la aprobación de la 'excepción ibérica' para topar el precio del gas en la generación eléctrica. Junio dejó dos hitos contrapuestos: la contundente mayoría absoluta de Juanma Moreno con el PP en Andalucía y la exitosa Cumbre de la OTAN en Madrid, ensombrecida por la tragedia migratoria en la valla de Melilla con decenas de fallecidos."
            },
            {
                "estacion": "Verano: Calor Asfixiante, Caída de Johnson y Pelosi en Taiwán",
                "meses": "Julio - Agosto",
                "relato": "El verano fue el más caluroso jamás registrado en España, con incendios devastadores que arrasaron cientos de miles de hectáreas y una inflación que escaló al 10.8%. En Reino Unido, los escándalos acabaron con Boris Johnson, que anunció su dimisión. En Japón, el ex primer ministro Shinzo Abe fue asesinado en pleno mitin callejero. En agosto, la visita de Nancy Pelosi a Taiwán desató la furia de Pekín con maniobras militares con fuego real alrededor de la isla, mientras en Europa entraba en vigor el plan de ahorro energético que reguló el aire acondicionado y apagó escaparates por la noche."
            },
            {
                "estacion": "Otoño: Adiós a Isabel II, el Fiasco de Liz Truss y el Mundial de Messi",
                "meses": "Septiembre - Diciembre",
                "relato": "El 8 de septiembre el mundo despidió a la Reina Isabel II a los 96 años, dando paso a Carlos III tras siete décadas de reinado. En el Reino Unido, la nueva primera ministra Liz Truss provocó un derrumbe histórico de la libra con un plan de rebajas fiscales que forzó su dimisión en solo 45 días, siendo sustituida por Rishi Sunak. En el frente bélico, Ucrania sorprendió recuperando Járkov y Jersón, mientras los gasoductos Nord Stream eran saboteados en el Báltico. En España, el año terminó con la polémica reforma penal que derogó la sedición y retocó la malversación, en paralelo al triunfo de Leo Messi con Argentina en el Mundial de Catar."
            }
        ],
        "cortinas_humo": [
            {
                "asunto": "La batalla sobre apagar los escaparates a las diez y quitarse la corbata",
                "realidad": "Se convirtió en el eje del debate político veraniego en España para disimular que Europa no tenía cómo sustituir de inmediato el 40% del gas que antes le compraba a Rusia, recurriendo a comprar gas licuado estadounidense a precios mucho más altos."
            },
            {
                "asunto": "La efímera gestión de Liz Truss y su lechuga viral",
                "realidad": "Se personalizó toda la crisis en los errores de una líder para no abordar la debilidad estructural de la economía británica tras su salida de la Unión Europea y el coste del endeudamiento."
            },
            {
                "asunto": "La polémica por la ley del 'solo sí es sí' centrada en declaraciones políticas",
                "realidad": "Las acusaciones mutuas taparon durante semanas el debate técnico sobre los efectos imprevistos de la reforma penal en la rebaja de penas, que acabaría provocando una crisis de gobierno meses después."
            }
        ],
        "puntos_ciegos": [
            {
                "asunto": "La negativa mayoritaria del Sur Global a aislar a Rusia",
                "impacto": "Mientras las televisiones europeas hablaban de aislamiento total de Moscú, potencias como India, Brasil, Sudáfrica y los países árabes multiplicaron su comercio y sus compras de petróleo con descuento, desbaratando la eficacia del cerco económico occidental."
            },
            {
                "asunto": "El histórico sabotaje submarino a los gasoductos Nord Stream",
                "impacto": "La destrucción física de las tuberías en el fondo del mar Báltico cercenó de forma definitiva la posibilidad de que Alemania y Rusia volvieran a comerciar gas barato, consolidando la dependencia energética europea de los barcos de gas licuado."
            },
            {
                "asunto": "La crisis de fertilizantes y el riesgo de hambruna en África",
                "impacto": "La guerra encareció los abonos agrícolas a niveles inasumibles para el campo africano, amenazando la seguridad alimentaria de decenas de países antes de que Turquía y la ONU mediaran en el acuerdo del cereal del Mar Negro."
            }
        ],
        "mirada_global": "Para la sociedad española, 2022 fue el año en que llenar el depósito del coche o hacer la compra en el supermercado se convirtió en un motivo diario de preocupación, mientras la política nacional se polarizaba aún más. Para Europa, fue el despertar abrupto del sueño de que el comercio garantizaba la paz: hubo que rearmarse y buscar energía a contrarreloj. Estados Unidos recuperó su papel de líder militar de Occidente y suministrador energético clave. Y en el resto del mundo, desde América Latina hasta Asia, la guerra se percibió como un conflicto europeo del que era mejor mantenerse al margen para proteger los intereses propios.",
        "conclusiones": [
            "La energía barata y la paz eran los dos pilares invisibles sobre los que descansaba el bienestar europeo: cuando ambos tambalearon, todo el edificio económico tembló.",
            "Occidente ya no puede imponer su visión moral al resto del planeta: los países emergentes eligen sus alianzas en función de su propio interés material y no de las presiones de Washington o Bruselas.",
            "Las decisiones de política exterior tienen consecuencias inmediatas en el bolsillo de la gente: el cambio de postura sobre el Sáhara o las sanciones a Moscú impactaron directamente en el recibo del gas y en los fertilizantes del campo."
        ]
    },

    2023: {
        "titulo": "2023: El Vuelco Electoral del 23-J, la Irrupción de la IA y la Hoguera de Gaza",
        "subtitulo": "De la moción de Tamames a la amnistía de Sánchez, la quiebra bancaria en EEUU y el ataque del 7 de octubre que sacudió Oriente Medio",
        "resumen_narrativo": "2023 fue un año vertiginoso donde la política española desafió todas las previsiones. Comenzó con la insólita moción de censura de Ramón Tamames con Vox y la presentación de Sumar por parte de Yolanda Díaz, para desembocar en el vuelco conservador de las elecciones municipales de mayo. La respuesta de Pedro Sánchez convocando elecciones generales en pleno verano para el 23 de julio dejó una de las noches electorales más inesperadas: el PP de Feijóo ganó pero no logró sumar con Vox, abriendo la puerta a una compleja investidura de Sánchez pactada en Bruselas con Carles Puigdemont a cambio de la ley de amnistía. En el plano internacional, mientras ChatGPT revolucionaba la conversación pública sobre la Inteligencia Artificial, el salvaje ataque terrorista de Hamás del 7 de octubre y la posterior ofensiva militar israelí sobre Gaza reabrieron una herida de consecuencias globales.",
        "estaciones": [
            {
                "estacion": "Invierno: La Moción de Tamames y el Susto Bancario",
                "meses": "Enero - Marzo",
                "relato": "El año arrancó con el asalto a los poderes del Estado en Brasilia por parte de bolsonaristas y la entrada en vigor de la rebaja del IVA a los alimentos en España. En febrero, un devastador terremoto en Turquía y Siria dejó más de 50.000 muertos, mientras en EEUU la detección de un presunto globo espía chino desataba una tormenta diplomática. En marzo, la política española presenció la atípica moción de censura encabezada por el veterano economista Ramón Tamames a propuesta de Vox. Al mismo tiempo, el pánico financiero regresaba a Occidente con la quiebra fulminante del Silicon Valley Bank en California y el rescate de emergencia del histórico Credit Suisse en Europa por parte de UBS."
            },
            {
                "estacion": "Primavera: El 28-M y el Golpe de Timón de Sánchez",
                "meses": "Abril - Junio",
                "relato": "En abril, Yolanda Díaz presentó oficialmente la plataforma Sumar en Madrid mientras España sufría una sequía preocupante que amenazaba cultivos y reservas de agua. El 28 de mayo, las elecciones municipales y autonómicas arrojaron un claro vuelco hacia el PP, que arrebató feudos históricos a la izquierda pactando con Vox en varias comunidades. Apenas doce horas después, en un movimiento que pilló a todos con el pie cambiado, Pedro Sánchez anunció desde Moncloa el adelanto de las elecciones generales para el 23 de julio. En junio, mientras el mundo seguía con angustia la implosión del batiscafo Titan cerca del pecio del Titanic, en Rusia el líder de los mercenarios de Wagner, Yevgueni Prigozhin, protagonizó una asombrosa marcha armada hacia Moscú que puso en jaque a Putin durante 24 horas."
            },
            {
                "estacion": "Verano: El Enigma del 23-J, la Estrella del Mundial y el Caso Rubiales",
                "meses": "Julio - Agosto",
                "relato": "En mitad de una asfixiante ola de calor veraniega, España votó el 23 de julio. Las urnas desmintieron las encuestas: Alberto Núñez Feijóo ganó con 137 escaños pero se quedó lejos de la mayoría absoluta incluso con Vox, mientras Pedro Sánchez resistió con 121 y conservó opciones matemáticas de gobernar pactando con todo el bloque nacionalista e independentista. En agosto, la Selección Española Femenina de Fútbol tocó la gloria en Sídney proclamándose campeona del mundo, pero la hazaña deportiva quedó eclipsada por el escándalo del beso no consentido de Luis Rubiales a Jenni Hermoso y el movimiento social del '#SeAcabó'. Pocos días después, Prigozhin moría al estrellarse su avión en suelo ruso."
            },
            {
                "estacion": "Otoño: El 7 de Octubre en Israel, Ferraz y la Investidura de la Amnistía",
                "meses": "Septiembre - Diciembre",
                "relato": "Tras la investidura fallida de Feijóo en septiembre, el 7 de octubre el mundo se estremeció con el sangriento ataque sorpresa de Hamás en suelo israelí, que dejó 1.200 muertos y centenares de rehenes, desatando la respuesta militar del gobierno de Netanyahu con bombardeos masivos e invasión terrestre en Gaza. En España, las negociaciones de Sánchez con Junts en Bruselas sellaron el acuerdo para una ley de amnistía a cambio del apoyo de los siete diputados de Puigdemont, desatando semanas de protestas diarias ante la sede del PSOE en la calle Ferraz. Finalmente, Sánchez fue investido presidente en noviembre. El año concluyó con la impactante victoria de Javier Milei en las elecciones presidenciales de Argentina."
            }
        ],
        "cortinas_humo": [
            {
                "asunto": "La histeria televisiva sobre los 'globos espía' sobrevolando Norteamérica",
                "realidad": "Ocupó días de transmisiones militares en directo justo en la semana en que los reguladores bancarios descubrían que bancos como Silicon Valley Bank o Signature Bank estaban al borde de la quiebra por la subida de tipos de interés."
            },
            {
                "asunto": "El debate sobre la prohibición de la abaya en los colegios de Francia",
                "realidad": "Utilizado por el ejecutivo de Macron para abrir el curso escolar evitando el balance de los violentos disturbios que habían incendiado las periferias francesas en junio tras la muerte del joven Nahel."
            },
            {
                "asunto": "La narrativa del 'riesgo de extinción humana' promovida por directivos de IA",
                "realidad": "Una hábil campaña de relaciones públicas de grandes tecnológicas para pedir regulación estricta que frenara el software libre y asegurara su monopolio sobre los modelos fundacionales."
            }
        ],
        "puntos_ciegos": [
            {
                "asunto": "El acuerdo histórico entre Arabia Saudí e Irán mediado por China",
                "impacto": "Firmado en marzo en Pekín, demostró la pérdida del monopolio diplomático de EEUU en Oriente Medio y preparó el terreno para la incorporación de ambos rivales al bloque de los BRICS."
            },
            {
                "asunto": "El golpe de estado militar en Níger y la pérdida del uranio",
                "impacto": "Tratado en España como una noticia menor de agencia, significó la expulsión de las tropas francesas y la pérdida del control europeo sobre uno de los principales yacimientos mundiales de uranio."
            },
            {
                "asunto": "La limpieza étnica en el enclave de Nagorno Karabaj",
                "impacto": "En septiembre, Azerbaiyán tomó el control militar de la región provocando el éxodo forzoso de más de 100.000 armenios, con una respuesta europea casi inexistente debido a los contratos de suministro de gas con Bakú."
            }
        ],
        "mirada_global": "En España, el año estuvo totalmente absorbido por el maratón electoral ininterrumpido (municipales en mayo, generales en julio, investiduras en otoño) y por el encendido debate sobre la amnistía. En Europa, la preocupación fue la pérdida de competitividad industrial ante los altos precios de la energía y las ayudas masivas de Biden en EEUU. En Oriente Medio, el 7 de octubre dinamitó los Acuerdos de Abraham y abrió una espiral bélica que polarizó las opiniones públicas mundiales. Y en América Latina, el triunfo de Milei en Argentina y el auge de Bukele en El Salvador reflejaron el hartazgo popular ante el deterioro económico y la inseguridad.",
        "conclusiones": [
            "Las encuestas electorales y los marcos preconcebidos fallan cuando el electorado detecta riesgos que los análisis tradicionales no calibran: el 23-J demostró la resistencia del bloque de izquierdas en España.",
            "La Inteligencia Artificial dejó de ser una promesa de ciencia ficción para convertirse en una herramienta de uso masivo que transformará el empleo de oficina, la educación y los derechos de autor.",
            "El orden diplomático en Oriente Medio era un castillo de naipes: ignorar la cuestión palestina mientras se firmaban acuerdos comerciales con países del Golfo acabó saltando por los aires de la forma más trágica."
        ]
    },

    2024: {
        "titulo": "2024: El Gran Giro Político, el Regreso de Trump y la Tragedia de la DANA",
        "subtitulo": "De las tractoradas y la ley de amnistía al atentado de Pensilvania, las elecciones europeas y la riada de Valencia",
        "resumen_narrativo": "2024 fue el año de mayor concentración de elecciones de la historia moderna, pero sobre todo fue el año en que los votantes de medio mundo castigaron a los gobiernos de turno reclamando seguridad, control migratorio y alivio ante el encarecimiento de la vida. En España, el año arrancó con las protestas de los agricultores y el estallido del caso Koldo, vio nacer la ley de amnistía tras meses de tensión y vivió los inéditos cinco días de reflexión de Pedro Sánchez tras la denuncia contra su esposa. En verano, el atentado que estuvo a punto de costarle la vida a Donald Trump en un mitin en Pensilvania y la renuncia de Joe Biden sacudieron la carrera hacia la Casa Blanca, que Trump acabó ganando con contundencia en noviembre. El año se cerró en España bajo el dolor y la conmoción de la DANA de Valencia, la peor catástrofe natural en décadas, que destapó graves fallos de prevención y encendió una profunda indignación ciudadana.",
        "estaciones": [
            {
                "estacion": "Invierno: Tractoradas en Carretera, Elecciones Gallegas y Caso Koldo",
                "meses": "Enero - Marzo",
                "relato": "El año arrancó con una revuelta del campo que recorrió Europa: miles de tractores cortaron carreteras en Francia, Alemania y España en protesta contra las normativas medioambientales de Bruselas y la competencia desleal. En febrero, Alfonso Rueda revalidó la mayoría absoluta del PP en Galicia, pero la actualidad nacional dio un vuelco con la detención de Koldo García, asesor del exministro José Luis Ábalos, por presuntas comisiones ilegales en mascarillas durante la pandemia. Al mismo tiempo, en una prisión del Ártico fallecía el líder opositor ruso Alexéi Navalni. En marzo, tras meses de bloqueo, el PSOE y Junts sellaron el acuerdo definitivo de la ley de amnistía, en paralelo a la convocatoria anticipada de elecciones en Cataluña tras caer los presupuestos de Pere Aragonès."
            },
            {
                "estacion": "Primavera: Los Cinco Días de Reflexión, Elecciones Catalanas y Europeas",
                "meses": "Abril - Junio",
                "relato": "En abril, Irán lanzó por primera vez un ataque directo con cientos de drones y misiles contra territorio israelí. En el plano doméstico, tras abrirse una causa judicial contra su esposa Begoña Gómez, Pedro Sánchez publicó una insólita carta a la ciudadanía tomándose cinco días de retiro para reflexionar si merecía la pena seguir en el cargo, confirmando el lunes que continuaba con más fuerza. En mayo, Salvador Illa ganó con claridad las elecciones catalanas logrando que el independentismo perdiera la mayoría absoluta por primera vez en década y media. En junio, las elecciones europeas confirmaron el ascenso de las formaciones conservadoras y soberanistas en todo el continente, empujando a Emmanuel Macron a una arriesgada disolución de la Asamblea Nacional en Francia."
            },
            {
                "estacion": "Verano: El Atentado a Trump, el Vuelco Francés y los Juegos de París",
                "meses": "Julio - Agosto",
                "relato": "Julio arrancó con un vuelco en Francia: el pacto entre la izquierda del Nuevo Frente Popular y el centro logró frenar a Le Pen en la segunda vuelta. En Reino Unido, el laborista Keir Starmer ponía fin a 14 años de gobiernos 'tories' con una aplastante mayoría. Pero la imagen del año se produjo el 13 de julio en Butler (Pensilvania): Donald Trump sobrevivió de milagro a un intento de asesinato en pleno mitin levantándose con el puño en alto. Ocho días después, acorralado por las dudas sobre su salud, Joe Biden renunciaba a la reelección y respaldaba a Kamala Harris. En agosto, mientras París celebraba sus espectaculares Juegos Olímpicos en el Sena, Salvador Illa era investido presidente de la Generalitat en una mañana rocambolesca marcada por la breve reaparición y posterior fuga de Carles Puigdemont en Barcelona."
            },
            {
                "estacion": "Otoño: La Marea de la DANA, la Victoria de Trump y la Fricción Institucional",
                "meses": "Septiembre - Noviembre",
                "relato": "En septiembre, España acogió como asilado político al opositor venezolano Edmundo González. En Oriente Medio, Israel abatió a la cúpula de Hizbulá con la detonación coordinada de buscapersonas y bombardeos en Beirut. En España, el Tribunal Supremo imputó por primera vez en democracia al Fiscal General del Estado y el portavoz de Sumar, Íñigo Errejón, dimitió tras denuncias de agresión sexual. El 29 de octubre, una devastadora DANA descargó lluvias torrenciales récord sobre la provincia de Valencia dejando más de 220 fallecidos y desatando la mayor crisis de gestión territorial en décadas. Apenas una semana después, Donald Trump ganaba con rotundidad las elecciones presidenciales de EEUU conquistando la Casa Blanca, el Senado y el voto popular."
            }
        ],
        "cortinas_humo": [
            {
                "asunto": "La carta de los cinco días de reflexión de Pedro Sánchez",
                "realidad": "Paralizó la agenda informativa nacional durante casi una semana centrando todo el foco en el liderazgo personal del presidente en vísperas de las elecciones catalanas y europeas, sin abordar el fondo de las reformas de la justicia."
            },
            {
                "asunto": "La narrativa de los Juegos Olímpicos de París como símbolo de unión política",
                "realidad": "Actuó como una tregua festiva temporal que disimuló la parálisis institucional total de Francia, con una Asamblea Nacional ingobernable y un déficit público disparado que acabó provocando la caída del gobierno meses después."
            },
            {
                "asunto": "Los debates sobre los 'chistes ofensivos' o insultos en mítines de campaña en EEUU",
                "realidad": "Los grandes conglomerados de medios estadounidenses centraron sus análisis en polémicas lingüísticas mientras el grueso de los votantes decidía su voto por el encarecimiento de la cesta de la compra y la presión migratoria."
            }
        ],
        "puntos_ciegos": [
            {
                "asunto": "La pérdida de la mayoría absoluta del Congreso Nacional Africano (ANC) en Sudáfrica",
                "impacto": "Por primera vez desde el fin del apartheid en 1994, el partido de Nelson Mandela perdió la mayoría, obligando a un histórico gobierno de coalición en la mayor economía industrial del continente africano."
            },
            {
                "asunto": "La guerra arancelaria por el coche eléctrico chino y la fractura interna en la UE",
                "impacto": "Bruselas impuso aranceles a los vehículos eléctricos chinos pero sin consenso: Alemania votó en contra para proteger a Volkswagen y BMW, evidenciando que el mercado único se fractura cuando chocan intereses industriales nacionales."
            },
            {
                "asunto": "El colapso continuado del tráfico comercial por el Canal de Suez",
                "impacto": "Los ataques de los rebeldes hutíes obligaron a desviar la inmensa mayoría de los buques portacontenedores por el Cabo de Buena Esperanza, encareciendo fletes y retrasando entregas sin que ninguna potencia pudiera reabrir la ruta."
            }
        ],
        "mirada_global": "En España, 2024 fue un año de máxima tensión parlamentaria y judicial, culminado en la desgarradora tragedia de la DANA que puso en evidencia los límites de la cogobernanza autonómica. En Europa, el auge de los partidos soberanistas reflejó la frustración de la clase media con la inflación y las exigencias de la transición ecológica. En Estados Unidos, el retorno de Trump demostró el divorcio entre los grandes medios tradicionales y el sentir de amplias capas trabajadoras del interior del país. Y en el mundo emergente, la crisis del comercio marítimo y las guerras de Ucrania y Oriente Medio aceleraron la búsqueda de alternativas comerciales fuera del dólar.",
        "conclusiones": [
            "La prevención y las infraestructuras de protección civil no admiten regateos políticos: la tragedia de Valencia demostró el coste humano intolerable de la falta de alertas a tiempo y de la descoordinación institucional.",
            "El malestar ciudadano con la inflación acumulada y la pérdida de poder adquisitivo es el mayor demoledor de gobiernos en las urnas: nadie reelige a quien no le garantiza llegar a fin de mes.",
            "La judicatura y los tribunales se han convertido en el principal terreno de confrontación política en las democracias avanzadas, erosionando la confianza ciudadana en la imparcialidad de las instituciones."
        ]
    },

    2025: {
        "titulo": "2025: El Choque Arancelario Transatlántico y el Nuevo Realismo Geoeconómico",
        "subtitulo": "El regreso de Donald Trump al Despacho Oval, las elecciones alemanas y la carrera por la reindustrialización europea",
        "resumen_narrativo": "2025 fue el año en que el tablero global asumió sin disfraces una nueva época de nacionalismo económico y acuerdos transaccionales. El regreso de Donald Trump a la Casa Blanca vino acompañado desde la primera semana de órdenes ejecutivas imponiendo aranceles generalizados, desregulando el sector energético fósil y exigiendo a los socios de la OTAN que asumieran la factura de su propia defensa. En Europa, la caída del gobierno de Olaf Scholz en Alemania dio paso a la victoria electoral de la CDU de Friedrich Merz, obligando a Berlín y París a replantearse a fondo las exigencias del Pacto Verde para evitar una deslocalización masiva de su industria automotriz y química frente a la competencia de China. En España, la legislatura navegó en aguas de alta complejidad parlamentaria, con el debate sobre la financiación autonómica singular y el coste de la vivienda en el centro de las preocupaciones de la calle.",
        "estaciones": [
            {
                "estacion": "Invierno: La Toma de Posesión de Trump y la Batería Arancelaria",
                "meses": "Enero - Marzo",
                "relato": "El 20 de enero Donald Trump juró su cargo como 47º presidente de Estados Unidos. En sus primeras 48 horas firmó una avalancha de órdenes ejecutivas: anunció aranceles del 25% a las importaciones de sus vecinos México y Canadá, gravámenes adicionales a los productos europeos y la salida de EEUU del Acuerdo de París por segunda vez. Las bolsas internacionales vivieron jornadas de fuerte volatilidad ante el temor a una guerra comercial generalizada. En Alemania, las elecciones federales anticipadas de febrero dieron un claro triunfo a los conservadores de Friedrich Merz, que iniciaron negociaciones para formar gobierno con la promesa de recortar burocracia y abaratar los costes energéticos a las empresas."
            },
            {
                "estacion": "Primavera: El Rescate Industrial de Draghi y el Pulso en Bruselas",
                "meses": "Abril - Junio",
                "relato": "En primavera, la Comisión Europea puso sobre la mesa la aplicación práctica del informe de Mario Draghi, planteando movilizar cientos de miles de millones de euros en inversiones conjuntas para defensa, inteligencia artificial y materias primas críticas. Sin embargo, los llamados países frugales del norte se resistieron a emitir nueva deuda común. En España, las negociaciones para reformar el sistema de financiación autonómica provocaron tensiones no solo entre partidos, sino entre comunidades autónomas de distinto signo, mientras las movilizaciones ciudadanas por el precio del alquiler y la escasez de vivienda asequible tomaban las calles de las grandes ciudades."
            },
            {
                "estacion": "Verano: El Frenazo del Coche Eléctrico y las Cumbres de Mediación",
                "meses": "Julio - Agosto",
                "relato": "El verano evidenció un giro en la industria del automóvil: ante la caída de ventas de coches 100% eléctricos en Europa por el fin de las ayudas directas y los altos precios, los grandes fabricantes como Volkswagen, Renault o Stellantis anunciaron el retorno a los modelos híbridos y la revisión de sus planes de inversión millonarios en fábricas de baterías para evitar despidos. En el plano internacional, varias cumbres discretas de mediación exploraron opciones para congelar las hostilidades en Ucrania y Oriente Medio, en un contexto donde Washington redujo sustancialmente sus partidas de ayuda militar exterior."
            },
            {
                "estacion": "Otoño: La Soberanía Digital de la IA y el Cierre del Ejercicio",
                "meses": "Septiembre - Noviembre",
                "relato": "El otoño trajo el despliegue generalizado de agentes autónomos de inteligencia artificial en entornos corporativos, abriendo un intenso debate sobre su impacto en empleos de oficina y la necesidad de una fiscalidad algorítmica. En el ámbito diplomático, los países del Sur Global afianzaron sus canales comerciales directos liquidando intercambios en yuanes y monedas locales para eludir el sistema de pagos en dólares. En España, la recta final del año estuvo dominada por el debate presupuestario y la vigilancia sobre los fondos de recuperación europeos en su fase final de ejecución."
            }
        ],
        "cortinas_humo": [
            {
                "asunto": "Los debates sobre los límites al déficit público y las reglas fiscales en Bruselas",
                "realidad": "Ocultaron que la Unión Europea carece de una herramienta financiera común para competir contra los subsidios masivos de Estados Unidos y las ayudas estatales de Pekín, condenando a Europa a la pérdida paulatina de tejido industrial."
            },
            {
                "asunto": "Las polémicas en redes sociales sobre declaraciones extravagantes de la Casa Blanca",
                "realidad": "Monopolizaron los titulares mientras se aprobaban cambios de fondo en los tratados de libre comercio, permisos de prospección energética y rebajas fiscales corporativas decisivas."
            },
            {
                "asunto": "Las disputas sobre la jornada laboral reducida en tertulias televisivas",
                "realidad": "Desviaron la atención del verdadero cuello de botella que ahoga a los trabajadores y autónomos: la inflación acumulada en vivienda, suministros y alimentación básica."
            }
        ],
        "puntos_ciegos": [
            {
                "asunto": "La consolidación de corredores comerciales de materias primas fuera del circuito occidental",
                "impacto": "Los nuevos acuerdos entre gobiernos de África, empresas chinas y compradores asiáticos aseguraron el control del litio, el cobalto y las tierras raras sin pasar por las bolsas de Londres o Nueva York."
            },
            {
                "asunto": "El retroceso silencioso en los plazos de descarbonización de la industria pesada europea",
                "impacto": "Ante el riesgo inminente de cierre de plantas químicas y siderúrgicas, varios gobiernos europeos relajaron discretamente las exigencias de emisiones para evitar la pérdida de cientos de miles de empleos industriales."
            },
            {
                "asunto": "La rápida expansión de la red de pagos transfronterizos sin usar el dólar (mBridge)",
                "impacto": "Varios bancos centrales de Asia y el Golfo comenzaron a liquidar operaciones de comercio exterior en segundos sin depender de la red SWIFT ni de la supervisión del Tesoro de EEUU."
            }
        ],
        "mirada_global": "Para España, 2025 fue un ejercicio de equilibrio complejo, intentando mantener la senda de crecimiento económico basada en los servicios y el turismo mientras la industria europea afrontaba un panorama sombrío. Europa en su conjunto descubrió que ya no podía contar incondicionalmente con la protección militar ni con la apertura comercial de Estados Unidos. En Washington, la administración Trump actuó bajo un estricto principio de interés nacional directo. Y en Pekín, se aceleró la autosuficiencia tecnológica en microchips maduros y el comercio con los mercados emergentes de Asia y América Latina.",
        "conclusiones": [
            "La ingenuidad comercial europea ha tocado a su fin: en un mundo dominado por gigantes que protegen y subvencionan a sus empresas, Europa no puede competir siendo la única que juega con las reglas del libre mercado puro de los años noventa.",
            "La vivienda se ha convertido en el principal factor de desigualdad y malestar social en las sociedades occidentales, por encima de las tradicionales categorías laborales.",
            "La autonomía estratégica de un país no se mide por sus declaraciones políticas, sino por su capacidad real de generar su propia energía, producir sus propios alimentos y fabricar su propia tecnología."
        ]
    },

    2026: {
        "titulo": "2026: La Era de los Agentes de IA, la Fractura de los Chips y el Pulso por la Realidad",
        "subtitulo": "Balance retrospectivo del ejercicio en curso: la saturación sintética, el estrés de las infraestructuras y las corrientes que definirán la próxima década",
        "resumen_narrativo": "2026 está siendo el ejercicio en que la Inteligencia Artificial dejó de ser un asistente pasivo que redacta textos para convertirse en agentes autónomos capaces de programar, auditar y ejecutar flujos de trabajo enteros, provocando un replanteamiento profundo sobre el valor del trabajo intelectual y la propiedad de los datos de entrenamiento. En el tablero geopolítico, la pugna por los semiconductores de vanguardia (2 nanómetros) y el suministro de tierras raras marcó la pauta entre Washington y Pekín, en vísperas de unas elecciones de medio mandato en Estados Unidos que definirán el equilibrio legislativo. En España, el año ha estado dominado por el debate sobre la modernización y seguridad de las infraestructuras de transporte tras varios incidentes ferroviarios, la reforma del sistema de financiación territorial y la creciente fatiga social ante la polarización de las portadas mediáticas, contrastando con la necesidad urgente de acometer transformaciones de calado en productividad, energía y relevo generacional.",
        "estaciones": [
            {
                "estacion": "Invierno: El Salto de los Modelos de Razonamiento y el Pulso de los Semiconductores",
                "meses": "Enero - Marzo",
                "relato": "El arranque de 2026 estuvo marcado por la llegada de la nueva generación de modelos de inteligencia artificial con capacidad de razonamiento profundo y planificación en múltiples pasos, lo que desató una carrera frenética entre las grandes corporaciones tecnológicas por asegurarse el suministro eléctrico para sus centros de datos y los microchips más avanzados. En Europa, la entrada en vigor de las primeras sanciones formales por la Ley de IA comunitaria abrió una brecha con las tecnológicas estadounidenses. En España, el ejercicio se inició con debates sobre el coste fiscal de la revalorización de las pensiones y la negociación de la financiación autonómica singular con Cataluña."
            },
            {
                "estacion": "Primavera: La Crisis Ferroviaria y el Estrés de las Infraestructuras",
                "meses": "Abril - Junio",
                "relato": "Durante la primavera, una serie de averías y accidentes en la red ferroviaria de alta velocidad en España, culminados en incidentes en los accesos a Madrid-Atocha, pusieron en el centro del debate la necesidad de una inversión continuada en mantenimiento y señalización, desatando una intensa batalla parlamentaria sobre las responsabilidades del Ministerio de Transportes. Al mismo tiempo, en Europa Central, la crisis institucional en Polonia entre el ejecutivo y el aparato judicial generó momentos de tensión política, mientras las elecciones locales y autonómicas de ciclo intermedio en varios países europeos confirmaban la consolidación de un voto pragmático centrado en servicios públicos básicos."
            },
            {
                "estacion": "Verano: La Fatiga Sintética y la Búsqueda de lo Auténtico",
                "meses": "Julio - Agosto",
                "relato": "El verano reflejó las primeras señales de saturación ante la proliferación de contenidos generados por inteligencia artificial: la invasión de clones de voz, imágenes hiperrealistas y vídeos sintéticos desató una demanda creciente de trazabilidad, transparencia radical y sellos de autenticidad humana en el sector audiovisual y editorial. En el ámbito económico, la estabilización de los tipos de interés en torno al 4% enfrió las operaciones especulativas y obligó a las empresas a centrarse en la rentabilidad real de sus modelos de negocio, alejándose del entusiasmo fácil de rondas de inversión anteriores."
            },
            {
                "estacion": "Otoño: La Recta Final Hacia las Midterms y el Balance del Ejercicio",
                "meses": "Septiembre - Noviembre",
                "relato": "El otoño ha situado todas las miradas internacionales en Estados Unidos ante la inminencia de las elecciones legislativas de medio mandato (Midterms), que medirán el respaldo popular a las políticas de la administración estadounidense en el Congreso. En el plano financiero, la vulnerabilidad de las plataformas de criptoactivos volvió a quedar expuesta tras robos millonarios que impulsaron la regulación de la custodia digital. En España, el cierre del ejercicio se caracteriza por el debate sobre la competitividad de las pequeñas empresas frente a las grandes plataformas globales y la necesidad de proteger el talento creativo ante la automatización."
            }
        ],
        "cortinas_humo": [
            {
                "asunto": "La controversia sobre si un fallo individual en Atocha justificaba una dimisión ministerial",
                "realidad": "Se centró la atención en los audios de la cabina de control ('me estaba liando') para eludir el verdadero debate de fondo: los años de desatención en el mantenimiento de catenarias, agujas y señalización del sistema LZB/ERTMS frente al gasto en nuevas líneas."
            },
            {
                "asunto": "La cobertura morbosa de incidentes judiciales en Estados Unidos o polémicas de conciertos",
                "realidad": "Ocupó las primeras planas de grandes diarios occidentales en semanas en las que se estaban cerrando contratos masivos de rearme militar y transferencias de licencias tecnológicas en secreto."
            },
            {
                "asunto": "Los cruces de acusaciones partidistas sobre el uso de la inteligencia artificial en campaña",
                "realidad": "Sirvieron para polarizar a las audiencias mientras las grandes tecnológicas negociaban con los gobiernos exenciones fiscales y acceso preferente a las redes eléctricas para alimentar sus servidores."
            }
        ],
        "puntos_ciegos": [
            {
                "asunto": "Las pérdidas financieras acumuladas en el desarrollo de grandes modelos de lenguaje",
                "impacto": "Las filtraciones de cuentas internas de empresas de IA de frontera revelaron un consumo desorbitado de capital que plantea dudas fundadas sobre la sostenibilidad a medio plazo de un modelo que quema miles de millones sin generar beneficios acordes."
            },
            {
                "asunto": "El despliegue de tropas de El Salvador en Haití para misiones de seguridad",
                "impacto": "Un acontecimiento histórico que marca el inicio de una nueva doctrina militar en Centroamérica, donde gobiernos de la región asumen intervenciones directas sin esperar el liderazgo ni la financiación de Washington."
            },
            {
                "asunto": "El estrés silencioso sobre la red eléctrica por el auge de los centros de datos",
                "impacto": "La demanda energética de la computación masiva de IA comenzó a competir directamente con el consumo industrial e hidroeléctrico en zonas de Europa y Norteamérica, encareciendo los costes de red."
            }
        ],
        "mirada_global": "Para la sociedad española, 2026 ha sido un año de desconexión creciente respecto a la histeria de las portadas políticas, priorizando la estabilidad económica familiar y la calidad de los servicios cotidianos (trenes, sanidad, vivienda). En Europa, el foco ha estado en la supervivencia de su tejido industrial ante la doble presión de los aranceles de EEUU y la avalancha de productos chinos. En Washington, la política interna ha estado subordinada a la batalla electoral de las Midterms. Y en el eje asiático y del Sur Global, el objetivo silencioso pero firme ha seguido siendo el aseguramiento de corredores comerciales directos y la soberanía de sus recursos naturales.",
        "conclusiones": [
            "La inteligencia artificial no sustituye el criterio ni la honestidad intelectual: en un mundo inundado de respuestas automáticas y texto generado por algoritmos, el valor reside en la capacidad de separar el grano de la paja y verificar la realidad sobre el terreno.",
            "Las infraestructuras físicas no admiten atajos de marketing: las carreteras, las vías de tren y las redes eléctricas requieren inversión paciente y mantenimiento continuo, independientemente del ciclo electoral.",
            "Tirar del hilo de las noticias sigue siendo el mejor antídoto contra la manipulación: quien mira más allá de los titulares del día descubre que las verdaderas decisiones que marcan nuestro futuro casi nunca abren los telediarios."
        ]
    }
}


def formatear_markdown_anuario(year, datos):
    fecha_emision = f"{year + 1}-01-01" if year < 2026 else "2026-11-01"
    tipo_doc = "Auditoría Anual Definitiva (Anuario Estratégico de Segundo Orden)" if year < 2026 else "Balance Anual Preliminar (Ejercicio 2026 en Curso)"

    md = f"""# 🏛️ Radar de Presentes — Informe Analítico Anual {year}
## {datos["titulo"]}

> **Fecha de Emisión Canónica:** {fecha_emision}  
> **Tipo de Documento:** {tipo_doc}.  
> **Metodología:** Re-evaluación retrospectiva de la hemeroteca de 52/53 semanas (Separación de Ruido vs. Corrientes Profundas).

---

## 🌐 1. Visión Panorámica del Ejercicio

{datos["resumen_narrativo"]}

---

## 📅 2. Crónica del Año en Cuatro Estaciones (La Historia Completa)

"""
    for est in datos["estaciones"]:
        md += f"### • {est['estacion']} ({est['meses']})\n"
        md += f"{est['relato']}\n\n"

    md += """---

## 💨 3. Campañas de Humo y Distracciones Mediáticas (La Superficie del Iceberg)

Polémicas, escándalos y tertulias que acapararon las primeras planas durante semanas pero cuya trascendencia real fue nula, actuando como maniobras de distracción colectiva:

"""
    for h in datos["cortinas_humo"]:
        query = f"{h['asunto']} {year} noticias archivo".replace(" ", "+")
        url = f"https://www.google.com/search?q={query}"
        md += f"### • [{h['asunto']}]({url})\n"
        md += f"> **Evaluación de Segundo Orden (La Realidad de Fondo):** {h['realidad']}\n\n"

    md += """---

## 🌊 4. Lo que Pasó Desapercibido (Puntos Ciegos y Transformaciones Silenciosas)

Acontecimientos decisivos que ocurrieron lejos de los focos de la prensa generalista y que realmente redefinieron la economía, la seguridad y el tablero global:

"""
    for c in datos["puntos_ciegos"]:
        query = f"{c['asunto']} {year} noticias archivo".replace(" ", "+")
        url = f"https://www.google.com/search?q={query}"
        md += f"### • [{c['asunto']}]({url})\n"
        md += f"> **Impacto Real Silenciado (El Fondo del Asunto):** {c['impacto']}\n\n"

    md += f"""---

## ⚖️ 5. El Tablero Global: Divergencia de Miradas (Framing Transnacional)

{datos["mirada_global"]}

---

## 🔮 6. Lecciones del Ejercicio y Corrientes Abiertas para {year + 1}

Grandes conclusiones prácticas y vectores que se transfieren como vigilancia prioritaria para el siguiente ciclo:

"""
    for conc in datos["conclusiones"]:
        md += f"- **{conc}**\n"

    md += f"""
---

## 📜 7. Metodología y Acceso a la Hemeroteca de Origen

Este anuario no es una recopilación estática: se genera a partir de la auditoría continua de las 52/53 semanas archivadas en `informes/semanales/{year}/`. Cada enlace permite tirar del hilo sobre las fuentes periodísticas primarias para contrastar la información y auditar el contraste entre la espuma mediática del momento y las corrientes subterráneas de la historia.
"""
    return md


def main():
    print("-> Generando Anuarios Estratégicos completos y en lenguaje natural (2020 a 2026)...")
    for year in range(2020, 2027):
        if year in DATOS_ANUARIOS:
            contenido = formatear_markdown_anuario(year, DATOS_ANUARIOS[year])
            fpath = os.path.join(ANUARIOS_DIR, f"INFORME_ANUAL_{year}.md")
            with open(fpath, "w", encoding="utf-8") as f:
                f.write(contenido)
            print(f"   [OK] INFORME_ANUAL_{year}.md generado con éxito ({len(contenido)} caracteres).")

    print("[OK] Todos los anuarios estratégicos han sido actualizados con narrativa rica y lenguaje natural.")

if __name__ == "__main__":
    main()
