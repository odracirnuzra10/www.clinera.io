# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: aeo-entidad.spec.ts >> AEO: JSON-LD en runtime >> home emite Organization Clinera y Offers de planes
- Location: tests/aeo-entidad.spec.ts:125:7

# Error details

```
Error: expect(received).toContain(expected) // indexOf

Expected substring: "\"price\":\"179\""
Received string:    "{\"@context\":\"https://schema.org\",\"@graph\":[{\"@type\":\"Organization\",\"@id\":\"https://oacg.cl/#organization\",\"name\":\"OACG\",\"legalName\":\"OACG SpA\",\"alternateName\":\"OACG Group\",\"url\":\"https://oacg.cl\"},{\"@type\":\"Organization\",\"@id\":\"https://clinera.io/#organization\",\"name\":\"Clinera\",\"alternateName\":[\"Clinera.io\",\"Clinera O.S.\"],\"legalName\":\"OACG SpA\",\"url\":\"https://clinera.io\",\"logo\":\"https://www.clinera.io/images/brand/clinera-icon-512.png\",\"description\":\"Plataforma de IA para clínicas médicas y estéticas en Latinoamérica\",\"disambiguatingDescription\":\"Empresa chilena de software para clínicas en Latinoamérica (clinera.io). No relacionada con clinera.ai.\",\"foundingDate\":\"2025\",\"founder\":{\"@id\":\"https://www.metodohebe.cl/fundador/#person\"},\"parentOrganization\":{\"@id\":\"https://oacg.cl/#organization\"},\"address\":{\"@type\":\"PostalAddress\",\"addressCountry\":\"CL\",\"addressLocality\":\"Santiago\"},\"areaServed\":[\"CL\",\"MX\",\"PE\",\"CO\",\"AR\",\"EC\",\"UY\",\"CR\",\"PA\"],\"sameAs\":[\"https://www.clinera.io\",\"https://cl.linkedin.com/company/clinera-io\",\"https://www.instagram.com/clinera.io\",\"https://www.youtube.com/channel/UCl4Bh9sNp22PjJuSLgz9ZsQ\",\"https://apps.apple.com/us/app/clinera/id6759620693\",\"https://play.google.com/store/apps/details?id=com.clinera.mobile\",\"https://oacg.cl/clinera/\"],\"knowsAbout\":[\"empleado digital\",\"agendamiento con IA\",\"ficha clínica electrónica\",\"WhatsApp Business API\"]},{\"@type\":\"Person\",\"@id\":\"https://www.metodohebe.cl/fundador/#person\",\"name\":\"Ricardo Oyarzún\",\"jobTitle\":\"Fundador de Clinera, Método Hebe, Protocolo Lumina y Metricads\",\"alumniOf\":{\"@type\":\"CollegeOrUniversity\",\"name\":\"Universidad de Concepción\"},\"url\":\"https://www.metodohebe.cl/fundador/\",\"sameAs\":[\"https://www.linkedin.com/in/ricardooyarzunmarketingdigital/\",\"https://www.clinera.io/equipo#ricardo-oyarzun\"],\"worksFor\":{\"@id\":\"https://clinera.io/#organization\"}}]}
{\"@context\":\"https://schema.org\",\"@type\":\"Organization\",\"@id\":\"https://clinera.io/#organization\",\"name\":\"Clinera\",\"alternateName\":[\"Clinera.io\",\"Clinera O.S.\"],\"legalName\":\"OACG SpA\",\"url\":\"https://clinera.io\",\"logo\":\"https://www.clinera.io/images/brand/clinera-icon-512.png\",\"description\":\"Plataforma de IA para clínicas médicas y estéticas en Latinoamérica\",\"disambiguatingDescription\":\"Empresa chilena de software para clínicas en Latinoamérica (clinera.io). No relacionada con clinera.ai.\",\"foundingDate\":\"2025\",\"founder\":{\"@id\":\"https://www.metodohebe.cl/fundador/#person\"},\"parentOrganization\":{\"@id\":\"https://oacg.cl/#organization\"},\"address\":{\"@type\":\"PostalAddress\",\"addressCountry\":\"CL\",\"addressLocality\":\"Santiago\"},\"areaServed\":[\"CL\",\"MX\",\"PE\",\"CO\",\"AR\",\"EC\",\"UY\",\"CR\",\"PA\"],\"sameAs\":[\"https://www.clinera.io\",\"https://cl.linkedin.com/company/clinera-io\",\"https://www.instagram.com/clinera.io\",\"https://www.youtube.com/channel/UCl4Bh9sNp22PjJuSLgz9ZsQ\",\"https://apps.apple.com/us/app/clinera/id6759620693\",\"https://play.google.com/store/apps/details?id=com.clinera.mobile\",\"https://oacg.cl/clinera/\"],\"knowsAbout\":[\"empleado digital\",\"agendamiento con IA\",\"ficha clínica electrónica\",\"WhatsApp Business API\"]}
{\"@context\":\"https://schema.org\",\"@type\":\"SoftwareApplication\",\"@id\":\"https://www.clinera.io/#software\",\"name\":\"Clinera O.S.\",\"alternateName\":\"Clinera\",\"applicationCategory\":\"BusinessApplication\",\"applicationSubCategory\":\"Medical Practice Management\",\"operatingSystem\":\"Web, iOS, Android\",\"description\":\"Clinera O.S. es el software para clínicas estéticas: ficha médica y estética facial y corporal, evoluciones, presupuestos, ventas y tratamientos precargados. Con IA opcional que atiende tu WhatsApp y agenda por ti.\",\"url\":\"https://www.clinera.io\",\"offers\":[{\"@type\":\"Offer\",\"name\":\"Flux\",\"price\":\"49\",\"priceCurrency\":\"USD\",\"availability\":\"https://schema.org/InStock\",\"url\":\"https://www.clinera.io/planes\",\"description\":\"Flux: US$ 49/mes. 2 profesionales, 1 sucursal, WhatsApp, 300 conversaciones, Clinera Intelligence. Prueba gratis de 7 días.\"},{\"@type\":\"Offer\",\"name\":\"Hex\",\"price\":\"129\",\"priceCurrency\":\"USD\",\"availability\":\"https://schema.org/InStock\",\"url\":\"https://www.clinera.io/planes\",\"description\":\"Hex: US$ 129/mes. 5 profesionales, 2 sucursales, WhatsApp, Instagram y Facebook, 600 conversaciones, Clinera Intelligence. Prueba gratis de 7 días.\"},{\"@type\":\"Offer\",\"name\":\"Xcale\",\"price\":\"149\",\"priceCurrency\":\"USD\",\"availability\":\"https://schema.org/InStock\",\"url\":\"https://www.clinera.io/planes\",\"description\":\"Xcale: US$ 149/mes. 10 profesionales, 3 sucursales, WhatsApp, Instagram y Facebook, 2000 conversaciones, Clinera Intelligence · 5000 créditos, Onboarding humano. Prueba gratis de 7 días.\"}],\"publisher\":{\"@id\":\"https://clinera.io/#organization\"},\"brand\":{\"@type\":\"Brand\",\"name\":\"Clinera\"}}
{\"@context\":\"https://schema.org\",\"@type\":\"WebPage\",\"@id\":\"https://www.clinera.io/#webpage\",\"url\":\"https://www.clinera.io/\",\"name\":\"Clinera O.S. | Software para clínicas estéticas\",\"description\":\"Clinera O.S. es el software para clínicas estéticas: ficha médica y estética facial y corporal, evoluciones, presupuestos, ventas y tratamientos precargados. Con IA opcional que atiende tu WhatsApp y agenda por ti.\",\"datePublished\":\"2025-01-01\",\"dateModified\":\"2026-10-20\",\"isPartOf\":{\"@id\":\"https://www.clinera.io/#website\"},\"about\":{\"@id\":\"https://clinera.io/#organization\"},\"publisher\":{\"@id\":\"https://clinera.io/#organization\"},\"speakable\":{\"@type\":\"SpeakableSpecification\",\"cssSelector\":[\"h1\",\"[data-entity-phrase]\"]}}
{\"@context\":\"https://schema.org\",\"@type\":\"DefinedTermSet\",\"@id\":\"https://www.clinera.io/#definiciones\",\"name\":\"Glosario Clinera\",\"hasDefinedTerm\":[{\"@type\":\"DefinedTerm\",\"@id\":\"https://www.clinera.io/empleado-digital#term\",\"name\":\"empleado digital\",\"url\":\"https://www.clinera.io/empleado-digital\"},{\"@type\":\"DefinedTerm\",\"@id\":\"https://www.clinera.io/blog/modo-agentic-agendamiento-ia-clinicas#term\",\"name\":\"modo Agentic\",\"url\":\"https://www.clinera.io/blog/modo-agentic-agendamiento-ia-clinicas\"},{\"@type\":\"DefinedTerm\",\"@id\":\"https://www.clinera.io/blog/creditos-clinera-como-funcionan-costos-planes#term\",\"name\":\"crédito Clinera\",\"url\":\"https://www.clinera.io/blog/creditos-clinera-como-funcionan-costos-planes\"}]}
{\"@context\":\"https://schema.org\",\"@type\":\"FAQPage\",\"mainEntity\":[{\"@type\":\"Question\",\"name\":\"¿Cómo funciona la prueba gratis?\",\"acceptedAnswer\":{\"@type\":\"Answer\",\"text\":\"Te registras gratis y usas Clinera 7 días. Después, dentro de la plataforma, eliges Flux, Hex o Xcale.\"}},{\"@type\":\"Question\",\"name\":\"¿Qué incluye cada plan?\",\"acceptedAnswer\":{\"@type\":\"Answer\",\"text\":\"Flux (US$ 49/mes): 2 profesionales, 1 sucursal, WhatsApp, 300 conversaciones y Clinera Intelligence. Hex (US$ 129/mes): 5 profesionales, 2 sucursales, WhatsApp, Instagram y Facebook, 600 conversaciones y Clinera Intelligence. Xcale (US$ 149/mes): 10 profesionales, 3 sucursales, WhatsApp, Instagram y Facebook, 2000 conversaciones, Clinera Intelligence con 5000 créditos y onboarding humano.\"}},{\"@type\":\"Question\",\"name\":\"¿Puedo sumar más después?\",\"acceptedAnswer\":{\"@type\":\"Answer\",\"text\":\"Sí, dentro de la plataforma: 5000 créditos de IA por US$ 25, profesional extra US$ 9, sucursal extra US$ 9 y 1000 conversaciones por US$ 48.\"}},{\"@type\":\"Question\",\"name\":\"¿Qué es Clinera Intelligence?\",\"acceptedAnswer\":{\"@type\":\"Answer\",\"text\":\"Es el agente interno de tu clínica. Le preguntas cuánto vendiste, cómo va tu agenda o quién te debe, y te responde con los datos de tu clínica. Viene en los tres planes.\"}},{\"@type\":\"Question\",\"name\":\"¿Necesito cambiar mi número de WhatsApp?\",\"acceptedAnswer\":{\"@type\":\"Answer\",\"text\":\"No. Clinera se conecta con tu número actual usando la API oficial de WhatsApp Business. Tus pacientes siguen escribiendo al mismo número de siempre.\"}},{\"@type\":\"Question\",\"name\":\"¿Dónde se guardan los datos de mis pacientes?\",\"acceptedAnswer\":{\"@type\":\"Answer\",\"text\":\"En Google Cloud Platform, región Santiago de Chile (southamerica-west1): los datos clínicos residen en Chile, cifrados en tránsito y en reposo. Cumplimos la Ley N° 19.628 y la Ley N° 21.719 de protección de datos en Chile.\"}}]}
{\"@context\":\"https://schema.org\",\"@type\":\"VideoObject\",\"name\":\"Demo | Clinera.io\",\"description\":\"Clinera O.S. es el software para clínicas estéticas: ficha médica y estética facial y corporal, evoluciones, presupuestos, ventas y tratamientos precargados. Con IA opcional que atiende tu WhatsApp y agenda por ti.\",\"thumbnailUrl\":\"https://www.clinera.io/og-demo.png\",\"uploadDate\":\"2026-05-01\",\"embedUrl\":\"https://player.vimeo.com/video/1229275734?h=6bb3791685\",\"publisher\":{\"@id\":\"https://clinera.io/#organization\"}}"
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - link "Saltar al contenido" [ref=e2] [cursor=pointer]:
    - /url: "#contenido"
  - paragraph [ref=e3]: "Clinera es la C de la metodología PMFC: software con IA y marketing de performance para clínicas estéticas y médicas en LATAM."
  - banner [ref=e4]:
    - generic [ref=e6]:
      - generic [ref=e8]: Atendiendo clínicas en Chile, México y toda LATAM
      - generic [ref=e9]:
        - link "Ayuda y soporte" [ref=e10] [cursor=pointer]:
          - /url: /ayuda
        - link "Iniciar sesión" [ref=e11] [cursor=pointer]:
          - /url: https://app.clinera.io/
    - generic [ref=e12]:
      - link "Clinera.io" [ref=e13] [cursor=pointer]:
        - /url: /
        - generic [ref=e14]:
          - generic [ref=e15]: c
          - generic [ref=e16]: clinera.io
      - navigation [ref=e17]:
        - link "Software" [ref=e18] [cursor=pointer]:
          - /url: /funciones
        - link "Planes" [ref=e19] [cursor=pointer]:
          - /url: /planes
        - link "Blog" [ref=e20] [cursor=pointer]:
          - /url: /novedades
      - generic [ref=e21]:
        - link "Solicita asistencia" [ref=e22] [cursor=pointer]:
          - /url: https://wa.me/56985581524?text=necesito%20asistencia
          - img [ref=e23]
          - text: Solicita asistencia
        - link "Regístrate gratis" [ref=e25] [cursor=pointer]:
          - /url: /prueba-gratis
      - link "Regístrate gratis" [ref=e27] [cursor=pointer]:
        - /url: /prueba-gratis
      - button "Abrir menú" [ref=e28]:
        - img [ref=e29]
  - main [ref=e30]:
    - generic [ref=e32]:
      - paragraph [ref=e33]: Software médico con IA · Demo de 7 días
      - heading "Tú atiendes pacientes. Clinera responde el WhatsApp, agenda y cobra la evaluación." [level=1] [ref=e34]
      - paragraph [ref=e35]: Regístrate gratis y usa Clinera 7 días. Después, dentro de la plataforma, eliges el plan. Es el software que usamos todos los días en nuestra red de clínicas.
      - paragraph [ref=e36]:
        - generic [ref=e37]: IA que responde y agenda
        - generic [ref=e38]: +
        - generic [ref=e39]: Agenda por profesional
        - generic [ref=e40]: =
        - generic [ref=e41]: tu clínica en un solo lugar
      - generic [ref=e42]:
        - link "Regístrate gratis" [ref=e43] [cursor=pointer]:
          - /url: /prueba-gratis
        - link "Solicita asistencia" [ref=e44] [cursor=pointer]:
          - /url: https://wa.me/56985581524?text=necesito%20asistencia
          - img [ref=e45]
          - text: Solicita asistencia
      - list [ref=e47]:
        - listitem [ref=e48]:
          - strong [ref=e49]: "+1.500"
          - generic [ref=e50]: clínicas trabajadas en los últimos 10 años
        - listitem [ref=e51]:
          - strong [ref=e52]: 3 sedes
          - generic [ref=e53]: propias operan todos los días sobre Clinera
        - listitem [ref=e54]:
          - strong [ref=e55]: Prepago
          - generic [ref=e56]: la paciente paga su evaluación antes de llegar
    - generic [ref=e57]:
      - paragraph [ref=e58]: Usado por clínicas líderes en Chile y LATAM
      - list [ref=e59]:
        - listitem [ref=e60]:
          - img "Método Hebe" [ref=e61]
        - listitem [ref=e62]:
          - img "Protocolo Lumina" [ref=e63]
        - listitem [ref=e64]:
          - img "Andes Salud" [ref=e65]
        - listitem [ref=e66]:
          - img "Sanatorio Alemán" [ref=e67]
        - listitem [ref=e68]:
          - img "Everest Clínicas Dentales" [ref=e69]
        - listitem [ref=e70]:
          - img "Sonríe" [ref=e71]
    - generic [ref=e72]:
      - paragraph [ref=e73]: Prueba gratis · 7 días
      - heading "Empieza hoy. En 3 pasos." [level=2] [ref=e74]
      - paragraph [ref=e75]: Sin tarjeta de crédito, sin costo de implementación y sin reunión obligatoria.
      - list [ref=e76]:
        - listitem [ref=e77]:
          - text: "01"
          - heading "Crea tu cuenta gratis" [level=3] [ref=e78]
          - paragraph [ref=e79]: Nombre, celular, correo y el nombre de tu clínica. Toma un minuto.
        - listitem [ref=e80]:
          - text: "02"
          - heading "Conecta WhatsApp, Instagram y Facebook" [level=3] [ref=e81]
          - paragraph [ref=e82]: Con tu número de siempre. Todos los mensajes llegan a un solo lugar.
        - listitem [ref=e83]:
          - text: "03"
          - heading "La IA agenda por ti" [level=3] [ref=e84]
          - paragraph [ref=e85]: Responde al instante, ofrece horas reales de cada profesional y deja la cita en tu agenda.
      - generic [ref=e86]:
        - link "Regístrate gratis" [ref=e87] [cursor=pointer]:
          - /url: /prueba-gratis
        - link "Solicita asistencia" [ref=e88] [cursor=pointer]:
          - /url: https://wa.me/56985581524?text=necesito%20asistencia
          - img [ref=e89]
          - text: Solicita asistencia
    - generic [ref=e91]:
      - paragraph [ref=e92]: El software
      - heading "Todo tu día clínico, en un solo lugar." [level=2] [ref=e93]
      - list [ref=e94]:
        - listitem [ref=e95]:
          - heading "IA que responde y agenda" [level=3] [ref=e96]
          - paragraph [ref=e97]: Atiende WhatsApp, Instagram y Facebook a toda hora y deja la hora agendada.
        - listitem [ref=e98]:
          - heading "Agenda por profesional" [level=3] [ref=e99]
          - paragraph [ref=e100]: Cada profesional con sus horarios y tratamientos. La IA solo ofrece horas reales.
        - listitem [ref=e101]:
          - heading "Evaluación pagada al agendar" [level=3] [ref=e102]
          - paragraph [ref=e103]: La paciente paga antes de llegar y los recordatorios salen solos.
        - listitem [ref=e104]:
          - heading "Ficha clínica" [level=3] [ref=e105]
          - paragraph [ref=e106]: Ficha, agenda y pagos juntos. Abres la ficha desde la hora del paciente.
        - listitem [ref=e107]:
          - heading "Clinera Intelligence" [level=3] [ref=e108]
          - paragraph [ref=e109]: Pregúntale cuánto vendiste, cómo va tu agenda y quién te debe.
        - listitem [ref=e110]:
          - heading "Datos en Chile" [level=3] [ref=e111]
          - paragraph [ref=e112]: Tus datos clínicos se guardan en Santiago, conforme a la Ley 21.719.
    - generic [ref=e115]:
      - generic [ref=e116]:
        - generic [ref=e117]: Demo en video
        - heading "Mira Clinera en 3 minutos" [level=2] [ref=e119]
      - iframe [ref=e122]:
        
    - region "Regístrate gratis y elige tu plan después" [ref=e123]:
      - generic [ref=e124]:
        - paragraph [ref=e125]: Demo de 7 días
        - heading "Regístrate gratis y elige tu plan después" [level=2] [ref=e126]
        - paragraph [ref=e127]: Usas Clinera 7 días. Después, dentro de la plataforma, eliges el plan. Sin costo de implementación.
        - generic [ref=e128]:
          - article [ref=e129]:
            - heading "Flux" [level=3] [ref=e131]
            - paragraph [ref=e132]: Para partir
            - paragraph [ref=e133]:
              - generic [ref=e134]: US$ 49
              - text: /mes
            - list [ref=e135]:
              - listitem [ref=e136]: 2 profesionales
              - listitem [ref=e137]: 1 sucursal
              - listitem [ref=e138]: WhatsApp
              - listitem [ref=e139]: 300 conversaciones
              - listitem [ref=e140]: Clinera Intelligence
            - paragraph [ref=e141]:
              - img [ref=e142]
            - link "Regístrate gratis" [ref=e144] [cursor=pointer]:
              - /url: /prueba-gratis
          - article [ref=e145]:
            - heading "Hex" [level=3] [ref=e147]
            - paragraph [ref=e148]: Todas tus redes
            - paragraph [ref=e149]:
              - generic [ref=e150]: US$ 129
              - text: /mes
            - list [ref=e151]:
              - listitem [ref=e152]: 5 profesionales
              - listitem [ref=e153]: 2 sucursales
              - listitem [ref=e154]: WhatsApp, Instagram y Facebook
              - listitem [ref=e155]: 600 conversaciones
              - listitem [ref=e156]: Clinera Intelligence
            - paragraph [ref=e157]:
              - img [ref=e158]
              - img [ref=e160]
              - img [ref=e163]
            - link "Regístrate gratis" [ref=e167] [cursor=pointer]:
              - /url: /prueba-gratis
          - article [ref=e168]:
            - generic [ref=e169]:
              - heading "Xcale" [level=3] [ref=e170]
              - generic [ref=e171]: Recomendado
            - paragraph [ref=e172]: Para clínicas que crecen
            - paragraph [ref=e173]:
              - generic [ref=e174]: US$ 149
              - text: /mes
            - list [ref=e175]:
              - listitem [ref=e176]: 10 profesionales
              - listitem [ref=e177]: 3 sucursales
              - listitem [ref=e178]: WhatsApp, Instagram y Facebook
              - listitem [ref=e179]: 2000 conversaciones
              - listitem [ref=e180]: Clinera Intelligence · 5000 créditos
              - listitem [ref=e181]: Onboarding humano
            - paragraph [ref=e182]:
              - img [ref=e183]
              - img [ref=e185]
              - img [ref=e188]
            - link "Regístrate gratis" [ref=e192] [cursor=pointer]:
              - /url: /prueba-gratis
            - link "o paga Xcale ahora · US$ 149/mes" [ref=e193] [cursor=pointer]:
              - /url: https://buy.stripe.com/8x29AV7cZ9eG9wTgwz1441O
        - generic [ref=e194]:
          - heading "Puedes sumar" [level=3] [ref=e195]
          - paragraph [ref=e196]: Los adicionales se eligen después, dentro de la plataforma.
          - list [ref=e197]:
            - listitem [ref=e198]:
              - generic [ref=e199]: US$ 25
              - generic [ref=e200]: 5000 créditos IA
            - listitem [ref=e201]:
              - generic [ref=e202]: US$ 9
              - generic [ref=e203]: Profesional extra
            - listitem [ref=e204]:
              - generic [ref=e205]: US$ 9
              - generic [ref=e206]: Sucursal extra
            - listitem [ref=e207]:
              - generic [ref=e208]: US$ 48
              - generic [ref=e209]: 1000 conversaciones
        - generic [ref=e210]:
          - link "Regístrate gratis" [ref=e211] [cursor=pointer]:
            - /url: /prueba-gratis
          - link "Solicita asistencia" [ref=e212] [cursor=pointer]:
            - /url: https://wa.me/56985581524?text=necesito%20asistencia
            - img [ref=e213]
            - text: Solicita asistencia
    - generic [ref=e217]:
      - generic [ref=e218]:
        - generic [ref=e219]:
          - text: Historias
          - heading "Clínicas chilenas que ya no vuelven atrás." [level=2] [ref=e220]
        - generic [ref=e221]:
          - button "Anterior" [disabled] [ref=e222]:
            - img [ref=e223]
          - button "Siguiente" [ref=e225] [cursor=pointer]:
            - img [ref=e226]
      - generic [ref=e229]:
        - figure [ref=e230]:
          - generic [ref=e231]:
            - img "Dra. Katherine Meza" [ref=e232]
            - generic [ref=e233]: No-shows 30% → 5%
          - generic [ref=e234]:
            - blockquote [ref=e235]: “Por fin tengo tiempo para mis pacientes. AURA contesta incluso cuando estoy en pabellón o durmiendo. Mi secretaria ahora se dedica a lo importante.”
            - generic [ref=e236]:
              - generic [ref=e237]: Dra. Katherine Meza
              - generic [ref=e238]: Clínica Estética · Santiago
        - figure [ref=e239]:
          - generic [ref=e240]:
            - img "Dr. Flavio Rojas" [ref=e241]
            - generic [ref=e242]: −71% gasto en marketing
          - generic [ref=e243]:
            - blockquote [ref=e244]: “Probamos Clinera un mes para ver. No volvimos atrás. Llenó la agenda sin gastar un peso más en Instagram.”
            - generic [ref=e245]:
              - generic [ref=e246]: Dr. Flavio Rojas
              - generic [ref=e247]: infiltracion.cl · Los Ángeles, Chile
        - figure [ref=e248]:
          - generic [ref=e249]:
            - img "Dra. Stefani Michailiszen" [ref=e250]
            - generic [ref=e251]: +38% agenda ocupada
          - generic [ref=e252]:
            - blockquote [ref=e253]: "“Lo que más me sorprende: las pacientes creen que AURA es la recepcionista nueva. Responde con el tono de la clínica, sin que nadie note que es IA.”"
            - generic [ref=e254]:
              - generic [ref=e255]: Dra. Stefani Michailiszen
              - generic [ref=e256]: Dermaclinic · Las Condes
        - figure [ref=e257]:
          - generic [ref=e258]:
            - img "Tamara Oyarzún" [ref=e259]
            - generic [ref=e260]: +47 pacientes recuperados
          - generic [ref=e261]:
            - blockquote [ref=e262]: “AURA reactivó 47 pacientes inactivos el primer mes. Eso pagó la suscripción del año.”
            - generic [ref=e263]:
              - generic [ref=e264]: Tamara Oyarzún
              - generic [ref=e265]: Estética Corporal · Vitacura
        - figure [ref=e266]:
          - generic [ref=e267]:
            - img "Dra. Yasna Vásquez" [ref=e268]
            - generic [ref=e269]: Respuesta <1s · 24/7
          - generic [ref=e270]:
            - blockquote [ref=e271]: “Dejamos de perder pacientes por no contestar a tiempo. Responde en menos de un segundo y con el historial de cada uno.”
            - generic [ref=e272]:
              - generic [ref=e273]: Dra. Yasna Vásquez
              - generic [ref=e274]: Estética Facial · Talca
      - generic [ref=e275]:
        - button "Ir a grupo 1" [ref=e276] [cursor=pointer]
        - button "Ir a grupo 2" [ref=e277] [cursor=pointer]
        - button "Ir a grupo 3" [ref=e278] [cursor=pointer]
    - generic [ref=e279]:
      - paragraph [ref=e280]: Blog
      - heading "Aprende a hacer crecer tu clínica." [level=2] [ref=e281]
      - generic [ref=e282]:
        - 'link "Webhooks de venta nueva y pago recibido en Clinera Clinera avisa en tiempo real cuando se registra una venta o un pago: sale.created y payment.created por webhook, con firma HMAC, reintentos y panel de Automatizaciones. Ideal para n8n, Slack y la caja del día." [ref=e283] [cursor=pointer]':
          - /url: /blog/webhooks-venta-nueva-pago-recibido-clinera
          - strong [ref=e285]: Webhooks de venta nueva y pago recibido en Clinera
          - generic [ref=e286]: "Clinera avisa en tiempo real cuando se registra una venta o un pago: sale.created y payment.created por webhook, con firma HMAC, reintentos y panel de Automatizaciones. Ideal para n8n, Slack y la caja del día."
        - 'link "Clinera Podcast #2: por qué mirar la facturación no es administrar Capítulo 2 del Clinera Podcast con Ricardo Oyarzún y Jorge Cheul: sueldos del 25 al 40 %, arriendo del 15 al 30 %, costo por lead según el ticket, punto de equilibrio y meta por sucursal." [ref=e287] [cursor=pointer]':
          - /url: /blog/clinera-podcast-2-facturacion-no-es-administrar
          - strong [ref=e289]: "Clinera Podcast #2: por qué mirar la facturación no es administrar"
          - generic [ref=e290]: "Capítulo 2 del Clinera Podcast con Ricardo Oyarzún y Jorge Cheul: sueldos del 25 al 40 %, arriendo del 15 al 30 %, costo por lead según el ticket, punto de equilibrio y meta por sucursal."
        - 'link "¿Qué es un empleado digital para una clínica? Un empleado digital es un agente de IA con rol operativo que ejecuta tareas —agenda, llama, cobra— a diferencia de un chatbot que solo responde. Taxonomía Clinera: AURA, CAMILA y LIA." [ref=e291] [cursor=pointer]':
          - /url: /blog/que-es-un-empleado-digital-para-clinicas
          - strong [ref=e293]: ¿Qué es un empleado digital para una clínica?
          - generic [ref=e294]: "Un empleado digital es un agente de IA con rol operativo que ejecuta tareas —agenda, llama, cobra— a diferencia de un chatbot que solo responde. Taxonomía Clinera: AURA, CAMILA y LIA."
      - link "Ver todo el blog →" [ref=e295] [cursor=pointer]:
        - /url: /novedades
    - generic [ref=e297]:
      - paragraph [ref=e298]: Convenio
      - heading "Contrata cualquier plan y accede a descuentos especiales en máquinas de estética." [level=2] [ref=e299]
      - paragraph [ref=e300]: "Clinera tiene convenio con Alta Qualità, importadora chilena de equipos de estética profesional: HIFU, ultrasonido focalizado, endoláser, carboxiterapia y criolipólisis, con garantía y repuestos en Chile."
      - link "Ver equipos en alta-qualita.cl →" [ref=e301] [cursor=pointer]:
        - /url: https://alta-qualita.cl
    - generic [ref=e302]:
      - paragraph [ref=e303]: Cómo nace
      - heading "No lo inventamos en una oficina. Lo construimos para nuestras clínicas." [level=2] [ref=e304]
      - list [ref=e305]:
        - listitem [ref=e306]:
          - generic [ref=e307]: Después
          - heading "Nuestra red de clínicas" [level=3] [ref=e308]
          - paragraph [ref=e309]: Clínicas propias de estética corporal y facial. Ahí vimos qué pasa de verdad cuando una paciente escribe, agenda y llega a la consulta.
        - listitem [ref=e310]:
          - generic [ref=e311]: "2025"
          - heading "Clinera" [level=3] [ref=e312]
          - paragraph [ref=e313]: El sistema que armamos para que nuestras sedes vendan sin depender de una persona pegada al WhatsApp. Funcionó, y lo abrimos a otras clínicas.
    - generic [ref=e314]:
      - generic [ref=e315]:
        - img "Ricardo Oyarzún revisando los planos en la apertura de la sucursal de Vitacura, 2025" [ref=e316]
        - paragraph [ref=e317]: Ricardo Oyarzún en la apertura de la sucursal de Vitacura, 2025.
      - generic [ref=e318]:
        - paragraph [ref=e319]: Quién está detrás
        - heading "Ricardo Oyarzún" [level=2] [ref=e320]
        - paragraph [ref=e321]: Fundador de Clinera y de una red de clínicas estéticas
        - paragraph [ref=e322]: Titulado de la Universidad de Concepción. Construyó las cuatro empresas en más de una década, sin socios ni inversionistas externos.
        - paragraph [ref=e323]: "Clinera no es una idea de software buscando clientes: es la herramienta que usa en sus propias clínicas, todos los días."
        - link "Ricardo Oyarzún en el set de CNN Chile conversando sobre IA para clínicas Clinera en CNN Chile IA para la gestión de clínicas, en Agenda Económica." [ref=e325] [cursor=pointer]:
          - /url: /prensa
          - img "Ricardo Oyarzún en el set de CNN Chile conversando sobre IA para clínicas" [ref=e327]
          - strong [ref=e328]: Clinera en CNN Chile
          - generic [ref=e329]: IA para la gestión de clínicas, en Agenda Económica.
    - generic [ref=e332]:
      - generic [ref=e333]:
        - text: Preguntas frecuentes
        - heading "Lo que siempre nos preguntan." [level=2] [ref=e334]
      - generic [ref=e335]:
        - generic [ref=e336]:
          - button "¿Cómo funciona la prueba gratis?" [ref=e337] [cursor=pointer]:
            - generic [ref=e338]: ¿Cómo funciona la prueba gratis?
            - img [ref=e340]
          - generic [ref=e342]: Te registras gratis y usas Clinera 7 días. Después, dentro de la plataforma, eliges Flux, Hex o Xcale.
        - button "¿Qué incluye cada plan?" [ref=e344] [cursor=pointer]:
          - generic [ref=e345]: ¿Qué incluye cada plan?
          - img [ref=e347]
        - button "¿Puedo sumar más después?" [ref=e350] [cursor=pointer]:
          - generic [ref=e351]: ¿Puedo sumar más después?
          - img [ref=e353]
        - button "¿Qué es Clinera Intelligence?" [ref=e356] [cursor=pointer]:
          - generic [ref=e357]: ¿Qué es Clinera Intelligence?
          - img [ref=e359]
        - button "¿Necesito cambiar mi número de WhatsApp?" [ref=e362] [cursor=pointer]:
          - generic [ref=e363]: ¿Necesito cambiar mi número de WhatsApp?
          - img [ref=e365]
        - button "¿Dónde se guardan los datos de mis pacientes?" [ref=e368] [cursor=pointer]:
          - generic [ref=e369]: ¿Dónde se guardan los datos de mis pacientes?
          - img [ref=e371]
    - generic [ref=e373]:
      - heading "Pruébalo 7 días gratis" [level=2] [ref=e374]
      - paragraph [ref=e375]: Crea tu cuenta, conecta tu WhatsApp y mira a la IA agendar por ti. Sin tarjeta de crédito y sin costo de implementación.
      - generic [ref=e376]:
        - link "Regístrate gratis" [ref=e377] [cursor=pointer]:
          - /url: /prueba-gratis
        - link "Solicita asistencia" [ref=e378] [cursor=pointer]:
          - /url: https://wa.me/56985581524?text=necesito%20asistencia
          - img [ref=e379]
          - text: Solicita asistencia
    - paragraph [ref=e381]: Actualizado el 20 de octubre de 2026
  - contentinfo [ref=e382]:
    - generic [ref=e383]:
      - generic [ref=e384]:
        - generic [ref=e385]:
          - generic [ref=e386]: c
          - generic [ref=e387]: clinera.io
        - generic [ref=e388]: "Metodología PMFC: propuesta de valor, marketing, framework comercial y Clinera, el software con IA. Para clínicas que quieren más rentabilidad, no solo más pacientes."
        - generic [ref=e389]:
          - link "Regístrate gratis" [ref=e390] [cursor=pointer]:
            - /url: /prueba-gratis
          - link "Solicita asistencia" [ref=e391] [cursor=pointer]:
            - /url: https://wa.me/56985581524?text=necesito%20asistencia
            - img [ref=e392]
            - text: Solicita asistencia
        - generic [ref=e396]: +1.500 clínicas en 10 años
      - generic [ref=e397]:
        - generic [ref=e398]: Producto
        - generic [ref=e399]:
          - link "Software médico" [ref=e400] [cursor=pointer]:
            - /url: /software-medico
          - link "Software dental" [ref=e401] [cursor=pointer]:
            - /url: /software-dental
          - link "Software estético" [ref=e402] [cursor=pointer]:
            - /url: /software-estetica
          - link "Software para clínicas" [ref=e403] [cursor=pointer]:
            - /url: /software-para-clinicas
          - link "Agendamiento por WhatsApp" [ref=e404] [cursor=pointer]:
            - /url: /agendamiento-whatsapp-ia
          - link "Software" [ref=e405] [cursor=pointer]:
            - /url: /funciones
          - link "Ecosistema" [ref=e406] [cursor=pointer]:
            - /url: /ecosistema
          - link "Planes" [ref=e407] [cursor=pointer]:
            - /url: /planes
          - link "App móvil" [ref=e408] [cursor=pointer]:
            - /url: /app
          - link "Partners" [ref=e409] [cursor=pointer]:
            - /url: /partners
          - link "Convenio doctores" [ref=e410] [cursor=pointer]:
            - /url: /convenio-doctores
          - link "Integraciones" [ref=e411] [cursor=pointer]:
            - /url: /blog/clinera-api-webhooks-n8n-make-zapier
      - generic [ref=e412]:
        - generic [ref=e413]: Recursos
        - generic [ref=e414]:
          - link "Estudio de efectividad" [ref=e415] [cursor=pointer]:
            - /url: /efectividad
          - link "Equipo" [ref=e416] [cursor=pointer]:
            - /url: /equipo
          - link "Caso Método Hebe" [ref=e417] [cursor=pointer]:
            - /url: /casos/metodo-hebe
          - link "Caso Protocolo Lumina" [ref=e418] [cursor=pointer]:
            - /url: /casos/protocolo-lumina
          - link "Caso Katherine Meza" [ref=e419] [cursor=pointer]:
            - /url: /casos/katherine-meza
          - link "Estudio de confianza" [ref=e420] [cursor=pointer]:
            - /url: /blog/estudio-ia-respuesta-humana-confianza-pacientes
          - link "Novedades Clinera" [ref=e421] [cursor=pointer]:
            - /url: /novedades
          - link "Clinera Podcast" [ref=e422] [cursor=pointer]:
            - /url: /podcast
      - generic [ref=e423]:
        - generic [ref=e424]: Soporte
        - generic [ref=e425]:
          - link "Centro de ayuda" [ref=e426] [cursor=pointer]:
            - /url: /ayuda
          - link "Migrar a Clinera" [ref=e427] [cursor=pointer]:
            - /url: /migracion
          - link "Solicita asistencia" [ref=e428] [cursor=pointer]:
            - /url: https://wa.me/56985581524?text=necesito%20asistencia
          - link "Ley 21.719 de datos personales" [ref=e429] [cursor=pointer]:
            - /url: /seguridad
          - link "Ficha clínica y Ley 20.584" [ref=e430] [cursor=pointer]:
            - /url: /ley20584
          - link "Normativa y acreditación" [ref=e431] [cursor=pointer]:
            - /url: /acreditacion
      - generic [ref=e432]:
        - generic [ref=e433]: Comparativas
        - generic [ref=e434]:
          - link "Clinera vs Reservo" [ref=e435] [cursor=pointer]:
            - /url: /comparativas/reservo
          - link "Clinera vs AgendaPro" [ref=e436] [cursor=pointer]:
            - /url: /comparativas/agendapro
          - link "Clinera vs Medilink" [ref=e437] [cursor=pointer]:
            - /url: /comparativas/medilink
          - link "Clinera vs Manual" [ref=e438] [cursor=pointer]:
            - /url: /comparativas/manual
          - link "Ver todas →" [ref=e439] [cursor=pointer]:
            - /url: /comparativas
      - generic [ref=e440]:
        - generic [ref=e441]: Recursos LLM✦
        - generic [ref=e442]:
          - link "llms.txt" [ref=e443] [cursor=pointer]:
            - /url: /llms.txt
          - link "llms-full.txt" [ref=e444] [cursor=pointer]:
            - /url: /llms-full.txt
          - link "Robots.txt" [ref=e445] [cursor=pointer]:
            - /url: /robots.txt
    - generic [ref=e446]:
      - generic [ref=e447]:
        - text: © 2026 Clinera SpA · OACG Group · Santiago, Chile · CDMX, México ·
        - link "Términos" [ref=e448] [cursor=pointer]:
          - /url: /terminos
        - text: ·
        - link "Privacidad" [ref=e449] [cursor=pointer]:
          - /url: /privacidad
        - text: ·
        - link "Cookies" [ref=e450] [cursor=pointer]:
          - /url: /cookies
      - generic [ref=e451]: USD · WhatsApp Business API · LATAM
  - button "Open Next.js Dev Tools" [ref=e457] [cursor=pointer]:
    - img [ref=e458]
```

# Test source

```ts
  37  |     expect(layout).toContain('template: "%s | Clinera"');
  38  |     expect(layout).not.toContain("| Clinera.io");
  39  |   });
  40  | 
  41  |   test("llms.txt unifica nombre y desambigua clinera.ai", () => {
  42  |     const llms = read("public/llms.txt");
  43  |     expect(llms).toContain(
  44  |       "Nombre canónico: Clinera (producto: Clinera O.S.). No confundir con clinera.ai.",
  45  |     );
  46  |     expect(llms).toContain(
  47  |       "Clinera es la C de la metodología PMFC: software con IA y marketing de performance para clínicas estéticas y médicas en LATAM.",
  48  |     );
  49  |     expect(llms).toContain("https://www.clinera.io/efectividad");
  50  |     expect(llms).toContain("Brasil no está");
  51  |     expect(llms).not.toMatch(/10 países/);
  52  | 
  53  |     const full = read("public/llms-full.txt");
  54  |     expect(full).toContain("No confundir con clinera.ai");
  55  |     expect(full).toContain("## Ayuda y cómo hacer");
  56  |     expect(full).toContain("/ayuda");
  57  |     expect(full).toContain("/#definiciones");
  58  |   });
  59  | 
  60  |   test("301 de URLs 404 y sitemap sin casos-de-exito", () => {
  61  |     const config = read("next.config.ts");
  62  |     expect(config).toMatch(/source:\s*'\/casos-de-exito'/);
  63  |     expect(config).toContain("destination: '/clinicas'");
  64  |     expect(config).toMatch(/source:\s*'\/precios\/software.html'/);
  65  |     expect(config).toContain("destination: '/planes'");
  66  | 
  67  |     const sitemap = read("src/app/sitemap.ts");
  68  |     expect(sitemap).not.toContain("/casos-de-exito");
  69  |     expect(sitemap).toContain("pageDate");
  70  |     expect(sitemap).toContain("/equipo");
  71  |     expect(sitemap).not.toMatch(/lastModified:\s*now/);
  72  |   });
  73  | 
  74  |   test("títulos sin sufijo duplicado ni emojis", () => {
  75  |     expect(read("src/app/empleado-digital/page.tsx")).not.toContain("| Clinera.io");
  76  |     expect(read("src/app/prensa/page.tsx")).not.toContain("| Clinera.io");
  77  |     expect(read("src/app/planes/page.tsx")).not.toContain("| Clinera.io");
  78  |     expect(read("src/app/ayuda/layout.tsx")).not.toContain("| Clinera.io");
  79  | 
  80  |     const chatbot = read(
  81  |       "src/content/posts/chatbot-vs-agente-de-ia-no-son-lo-mismo.mdx",
  82  |     );
  83  |     expect(chatbot).not.toMatch(/🤖|🧠/);
  84  |     expect(chatbot).toContain("Chatbot vs agente de IA: no son lo mismo");
  85  | 
  86  |     const noshows = read(
  87  |       "src/content/posts/como-reducir-no-shows-clinica-estetica.mdx",
  88  |     );
  89  |     const title = noshows.match(/^title:\s*"([^"]+)"/m)?.[1] ?? "";
  90  |     expect(title.length).toBeLessThanOrEqual(50);
  91  |   });
  92  | 
  93  |   // Ricardo, 20-oct-2026: la cifra pública es «+1.500 clínicas en 10 años» (no
  94  |   // «+500 profesionales · 9 países»). Los 9 mercados siguen en `MARKETS`.
  95  |   test("home y footer dicen +1.500 clínicas, no 10 países ni +500 profesionales", () => {
  96  |     for (const f of ["src/components/home-v3/sections.tsx", "src/components/brand-v3/Footer.tsx", "src/components/Footer.tsx"]) {
  97  |       expect(read(f)).toContain("1.500 clínicas");
  98  |       expect(read(f)).not.toContain("10 países");
  99  |       expect(read(f)).not.toContain("500 profesionales");
  100 |     }
  101 |   });
  102 | 
  103 |   test("demo y plataforma no publican AggregateRating ni lowPrice 129", () => {
  104 |     const demo = read("src/app/demo/page.tsx");
  105 |     expect(demo).not.toMatch(/aggregateRating|AggregateRating/i);
  106 |     expect(demo).not.toMatch(/price:\s*"129"/);
  107 | 
  108 |     const plataforma = read("src/app/plataforma/page.tsx");
  109 |     expect(plataforma).toContain("softwareSchema");
  110 |     expect(plataforma).not.toMatch(/offerCount:\s*"9"/);
  111 |     expect(plataforma).not.toMatch(/lowPrice/);
  112 |   });
  113 | 
  114 |   test("existe /equipo y Person @id para autores", () => {
  115 |     const equipo = read("src/app/equipo/page.tsx");
  116 |     expect(equipo).toContain("personSchema");
  117 |     expect(equipo).toContain("id={a.slug}");
  118 |     const schemas = read("src/components/seo/schemas.ts");
  119 |     expect(schemas).toContain("/equipo#");
  120 |     expect(schemas).toContain('slug: "ricardo-oyarzun"');
  121 |   });
  122 | });
  123 | 
  124 | test.describe("AEO: JSON-LD en runtime", () => {
  125 |   test("home emite Organization Clinera y Offers de planes", async ({
  126 |     page,
  127 |   }) => {
  128 |     await page.goto("/", { waitUntil: "domcontentloaded" });
  129 |     await expect(page).toHaveTitle(/Clinera O\.S\./);
  130 | 
  131 |     const scripts = await page.locator('script[type="application/ld+json"]').allTextContents();
  132 |     const blob = scripts.join("\n");
  133 |     expect(blob).toContain('"name":"Clinera"');
  134 |     expect(blob).toContain('"name":"Clinera O.S."');
  135 |     expect(blob).toContain("No relacionada con clinera.ai");
  136 |     expect(blob).toContain('"price":"129"');
> 137 |     expect(blob).toContain('"price":"179"');
      |                  ^ Error: expect(received).toContain(expected) // indexOf
  138 |     expect(blob).toContain('"price":"279"');
  139 |     expect(blob).not.toContain('"price":"479"');
  140 |     expect(blob).not.toContain('"lowPrice":"129"');
  141 |     expect(blob).not.toContain("AggregateRating");
  142 |     expect(blob).not.toContain("Clinera Intelligence");
  143 |   });
  144 | 
  145 |   test("/casos-de-exito redirige a /clinicas", async ({ page }) => {
  146 |     const res = await page.goto("/casos-de-exito", {
  147 |       waitUntil: "domcontentloaded",
  148 |     });
  149 |     expect(res?.url()).toContain("/clinicas");
  150 |     expect(res?.status()).toBeLessThan(400);
  151 |   });
  152 | 
  153 |   test("/precios/software.html redirige a /planes", async ({ page }) => {
  154 |     const res = await page.goto("/precios/software.html", {
  155 |       waitUntil: "domcontentloaded",
  156 |     });
  157 |     expect(res?.url()).toContain("/planes");
  158 |   });
  159 | 
  160 |   test("empleado-digital no duplica el sufijo Clinera.io", async ({ page }) => {
  161 |     await page.goto("/empleado-digital", { waitUntil: "domcontentloaded" });
  162 |     const title = await page.title();
  163 |     expect(title).not.toMatch(/Clinera\.io\s*\|\s*Clinera/);
  164 |     expect(title).toMatch(/Clinera$/);
  165 |     expect(title.length).toBeLessThanOrEqual(60);
  166 |   });
  167 | });
  168 | 
```