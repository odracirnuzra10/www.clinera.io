# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: analytics.spec.ts >> Meta Pixel & dataLayer events >> 5) EngagedSession fires after 60 seconds of visible time
- Location: tests/analytics.spec.ts:142:7

# Error details

```
Test timeout of 60000ms exceeded.
```

```
Error: page.waitForTimeout: Test timeout of 60000ms exceeded.
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - link "Saltar al contenido" [ref=e2] [cursor=pointer]:
    - /url: "#contenido"
  - paragraph [ref=e3]: "Clinera es software de IA para clínicas médicas y estéticas en LATAM: AURA, CAMILA y LIA agendan, confirman, cobran y recuperan pacientes."
  - banner [ref=e4]:
    - generic [ref=e6]:
      - generic [ref=e8]: Atendiendo clínicas en Chile, México y toda LATAM
      - generic [ref=e9]:
        - link "Ver demo 3 min" [ref=e10] [cursor=pointer]:
          - /url: /demo
          - text: Ver demo 3 min
        - link "Ayuda y soporte" [ref=e12] [cursor=pointer]:
          - /url: /ayuda
        - link "Iniciar sesión" [ref=e13] [cursor=pointer]:
          - /url: https://app.clinera.io/
    - generic [ref=e14]:
      - link "Clinera.io" [ref=e15] [cursor=pointer]:
        - /url: /
        - generic [ref=e16]:
          - generic [ref=e17]: c
          - generic [ref=e18]: clinera.io
      - navigation [ref=e19]:
        - link "Clinera O.S." [ref=e20] [cursor=pointer]:
          - /url: /#clinera-intelligence
        - link "Funciones" [ref=e21] [cursor=pointer]:
          - /url: /funciones
        - link "Planes" [ref=e22] [cursor=pointer]:
          - /url: /planes
        - link "Prensa" [ref=e23] [cursor=pointer]:
          - /url: /prensa
        - link "Novedades" [ref=e24] [cursor=pointer]:
          - /url: /novedades
      - link "Activar cuenta →" [ref=e26] [cursor=pointer]:
        - /url: /clinica-estetica/activar-cuenta
        - text: Activar cuenta
        - generic [ref=e27]: →
  - main [ref=e28]:
    - generic [ref=e31]:
      - generic [ref=e32]:
        - generic [ref=e33]:
          - generic [ref=e34]: ✦
          - text: CLINERA O.S. · SOFTWARE PARA CLÍNICAS ESTÉTICAS
          - generic [ref=e35]: ·
          - generic [ref=e36]: en vivo en Chile y México
        - heading "El software que entiende tu clínica estética." [level=1] [ref=e37]
        - paragraph [ref=e38]: "Ficha médica, ficha estética facial y ficha estética corporal, con evoluciones, presupuestos y ventas en un solo software, y tratamientos como Sculptra, Radiesse, Endoláser y Rinolips ya cargados. Y si quieres más, la IA atiende tu WhatsApp y agenda por ti. Lo construimos para nuestras propias clínicas estéticas: Método Hebe y Protocolo Lumina."
        - generic [ref=e39]:
          - link "Activar cuenta →" [ref=e40] [cursor=pointer]:
            - /url: /clinica-estetica/activar-cuenta
            - text: Activar cuenta
            - generic [ref=e41]: →
          - link "Ver demo 3 min" [ref=e42] [cursor=pointer]:
            - /url: "#demo-3-min"
            - img [ref=e43]
            - text: Ver demo 3 min
        - generic [ref=e45]:
          - generic [ref=e46]:
            - generic [ref=e47]: KM
            - generic [ref=e48]: FR
            - generic [ref=e49]: PS
            - generic [ref=e50]: AL
          - generic [ref=e51]: +500 profesionales coordinados en 9 países
        - generic [ref=e52]:
          - generic [ref=e54]: +52 clínicas activas
          - generic [ref=e55]: ·
          - generic [ref=e56]: +2.400 citas gestionadas por IA
          - generic [ref=e57]: ·
          - generic [ref=e58]: 95% agendadas al primer intento
          - link "Ver estudio →" [ref=e59] [cursor=pointer]:
            - /url: /efectividad
      - generic [ref=e61]:
        - generic [ref=e62]:
          - generic [ref=e63]:
            - generic [ref=e68]: Agenda · Jueves 23 abril
            - generic [ref=e69]: 24 citas
          - generic [ref=e70]:
            - generic [ref=e71]:
              - generic [ref=e72]: 09:00
              - generic [ref=e73]:
                - generic [ref=e74]: Limpieza facial · Javiera S.
                - generic [ref=e75]: Confirmada · 8:12 am
            - generic [ref=e76]:
              - generic [ref=e77]: 10:00
              - generic [ref=e78]:
                - generic [ref=e79]: Consulta nueva · Carla V.
                - generic [ref=e80]: Agendada por AURA · hace 2 min
            - generic [ref=e81]:
              - generic [ref=e82]: 11:30
              - generic [ref=e83]:
                - generic [ref=e84]: Control · Matías Ríos
                - generic [ref=e85]: Confirmada · ayer
            - generic [ref=e86]:
              - generic [ref=e87]: 12:30
              - generic [ref=e88]:
                - generic [ref=e89]: —
                - generic [ref=e90]: Disponible
            - generic [ref=e91]:
              - generic [ref=e92]: 14:00
              - generic [ref=e93]:
                - generic [ref=e94]: Primera vez · Ana Méndez
                - generic [ref=e95]: Confirmada · recordatorio 24h enviado
        - generic [ref=e96]:
          - generic [ref=e97]:
            - generic [ref=e98]:
              - generic [ref=e99]: A
              - generic [ref=e100]: AURA
            - generic [ref=e101]: 10:02
          - generic [ref=e102]:
            - generic [ref=e103]: Necesito cita mañana 10am
            - generic [ref=e104]:
              - text: 10:00 con Dra. Meza ✓
              - text: Te agendé y te envié el recordatorio.
        - generic [ref=e105]:
          - generic [ref=e106]: ✦
          - generic [ref=e107]:
            - generic [ref=e108]: AURA · < 1 s
            - generic [ref=e109]: 14 citas agendadas hoy
    - region "Un software que entiende tu clínica estética." [ref=e110]:
      - generic [ref=e111]:
        - text: Hecho para estética facial y corporal
        - heading "Un software que entiende tu clínica estética." [level=2] [ref=e112]
        - paragraph [ref=e113]: Ficha médica, ficha estética facial y ficha estética corporal, con evoluciones, presupuestos y tus tratamientos ya cargados. Lo que hace tu equipo en box queda registrado para la próxima sesión.
        - figure [ref=e114]:
          - generic [ref=e115]:
            - img "Dueña de clínica estética sonriendo mientras revisa los mensajes de sus pacientes" [ref=e116]
            - generic [ref=e117]: Radiesse · Sculptra · Hialurónico
            - generic [ref=e118]:
              - generic [ref=e119]: "23"
              - text: DMs sin responder
          - generic [ref=e120]:
            - generic [ref=e121]: Para dueñas de clínicas estéticas
            - paragraph [ref=e122]: Diplomado en bioestimuladores. Postgrado en contestar DMs a medianoche.
            - paragraph [ref=e123]: Una bandeja para WhatsApp, Instagram y Facebook, conectada a tu agenda. Tu equipo responde y agenda sin que tú estés pegada al celular.
            - generic [ref=e124]:
              - generic [ref=e125]: US$
              - generic [ref=e126]: "129"
            - paragraph [ref=e127]: al mes · hasta 5 profesionales
            - link "Activar cuenta" [ref=e128] [cursor=pointer]:
              - /url: /clinica-estetica/activar-cuenta
        - generic [ref=e129]:
          - article [ref=e130]:
            - img "Evaluación facial en la ficha de Clinera, con tercios faciales y eje de simetría" [ref=e132]
            - generic [ref=e133]:
              - text: Ficha facial
              - heading "Evaluación facial con tercios y eje de simetría" [level=3] [ref=e134]
              - paragraph [ref=e135]: La evaluación del rostro queda en la ficha del paciente, con el consentimiento de cada procedimiento y las fotos de cada sesión.
              - list [ref=e136]:
                - listitem [ref=e137]: Tercios faciales y eje de simetría
                - listitem [ref=e138]: Fotos antes y después atadas al paciente
                - listitem [ref=e139]: Consentimiento informado en la ficha
          - article [ref=e140]:
            - img "Evaluación corporal en la ficha de Clinera, con abdomen, flancos y muslos marcados" [ref=e142]
            - generic [ref=e143]:
              - text: Ficha corporal
              - heading "Evaluación corporal por zonas" [level=3] [ref=e144]
              - paragraph [ref=e145]: Marca abdomen, flancos o muslos sobre el cuerpo, define el plan de sesiones y sigue la evolución. Las fotos no viven en el celular de la clínica.
              - list [ref=e146]:
                - listitem [ref=e147]: Zonas marcadas de frente y espalda
                - listitem [ref=e148]: Plan de tratamiento por sesiones
                - listitem [ref=e149]: Evolución visible antes de entrar a box
          - article [ref=e150]:
            - generic [ref=e152]:
              - generic [ref=e153]:
                - generic [ref=e154]: Presupuesto · plan corporal
                - generic [ref=e155]: Desde la evaluación
              - generic [ref=e156]:
                - generic [ref=e157]: Endoláser · abdomen
                - generic [ref=e158]: Corporal
              - generic [ref=e159]:
                - generic [ref=e160]: Endoláser · flancos
                - generic [ref=e161]: Corporal
              - generic [ref=e162]:
                - generic [ref=e163]: Radiesse · contorno mandibular
                - generic [ref=e164]: Facial
              - generic [ref=e165]:
                - img [ref=e166]
                - text: Enviado por WhatsApp · pendiente de aprobación
            - generic [ref=e168]:
              - text: Presupuestos
              - heading "Presupuesto facial o corporal desde la evaluación" [level=3] [ref=e169]
              - paragraph [ref=e170]: Lo que evaluaste se convierte en presupuesto y sale por WhatsApp. El seguimiento queda en el CRM de la misma ficha, no en una planilla aparte.
              - list [ref=e171]:
                - listitem [ref=e172]: Armado desde la evaluación
                - listitem [ref=e173]: Envío por WhatsApp
                - listitem [ref=e174]: Seguimiento hasta que el paciente agenda
          - article [ref=e175]:
            - generic [ref=e177]:
              - generic [ref=e178]:
                - text: Sculptra
                - generic [ref=e179]: facial
              - generic [ref=e180]:
                - text: Radiesse
                - generic [ref=e181]: facial
              - generic [ref=e182]:
                - text: Rinolips
                - generic [ref=e183]: facial
              - generic [ref=e184]:
                - text: Endoláser
                - generic [ref=e185]: corporal
              - generic [ref=e186]: y el resto de tu catálogo
            - generic [ref=e187]:
              - text: Tratamientos precargados
              - heading "Tu catálogo de estética, listo desde el día uno" [level=3] [ref=e188]
              - paragraph [ref=e189]: Los tratamientos de estética facial y corporal ya vienen cargados. Ajustas precios, duración y profesionales, y AURA los ofrece por WhatsApp.
        - generic [ref=e190]:
          - paragraph [ref=e191]: Usado por clínicas líderes en Chile y LATAM
          - list [ref=e192]:
            - listitem [ref=e193]:
              - img "Método Hebe" [ref=e194]
            - listitem [ref=e195]:
              - img "Protocolo Lumina" [ref=e196]
            - listitem [ref=e197]:
              - img "Andes Salud" [ref=e198]
            - listitem [ref=e199]:
              - img "Sanatorio Alemán" [ref=e200]
            - listitem [ref=e201]:
              - img "Everest Clínicas Dentales" [ref=e202]
            - listitem [ref=e203]:
              - img "Sonríe" [ref=e204]
    - generic [ref=e206]:
      - generic [ref=e207]:
        - generic [ref=e208]: Ver demo 3 min
        - heading "Mira Clinera en 3 minutos" [level=2] [ref=e210]
      - iframe [ref=e213]:
        - generic [ref=f1e4]:
          - generic:
            - generic:
              - img
          - generic:
            - generic:
              - generic:
                - generic:
                  - img
            - generic:
              - img
              - generic: Playing in picture-in-picture
          - generic:
            - link "Link to video owner's profile" [ref=f1e12] [cursor=pointer]:
              - /url: https://vimeo.com/user255258676?fl=pl&fe=po
              - img "Link to video owner's profile" [ref=f1e13]
            - generic [ref=f1e14]:
              - generic [ref=f1e15]:
                - link "Demo | Clinera.io" [ref=f1e16] [cursor=pointer]:
                  - /url: https://vimeo.com/1229275734/6bb3791685?fl=pl&fe=ti
                - generic [ref=f1e17]: Demo | Clinera.io
              - link "Clinera.io" [ref=f1e18] [cursor=pointer]:
                - /url: https://vimeo.com/user255258676?fl=pl&fe=by
                - generic [ref=f1e19]: Clinera.io
            - generic:
              - generic:
                - generic:
                  - generic:
                    - generic: Like
                  - button "Like (this opens in a new window)" [ref=f1e20] [cursor=pointer]:
                    - img
                - generic:
                  - generic:
                    - generic: Add to Watch Later
                  - button "Add to Watch Later (this opens in a new window)" [ref=f1e21] [cursor=pointer]:
                    - img
            - generic:
              - button "Play" [ref=f1e23] [cursor=pointer]:
                - img [ref=f1e24]
                - generic:
                  - generic: Play
              - generic [ref=f1e27]:
                - generic [ref=f1e28]:
                  - slider "Progress Bar" [ref=f1e29] [cursor=pointer]
                  - generic:
                    - generic:
                      - generic: 00:00
                  - generic [ref=f1e34]: 03:06
                - generic [ref=f1e35]:
                  - generic:
                    - generic [ref=f1e36]:
                      - button "Mute" [ref=f1e38] [cursor=pointer]:
                        - img [ref=f1e39]
                      - slider "Volume (use up/down arrow keys to change)"
                    - button "CC/subtitles" [ref=f1e41] [cursor=pointer]:
                      - img [ref=f1e42]
                      - generic:
                        - generic: CC/subtitles
                    - button "Settings" [ref=f1e44] [cursor=pointer]:
                      - img [ref=f1e45]
                      - generic:
                        - generic: Settings
                    - button "Speed" [ref=f1e47] [cursor=pointer]:
                      - img [ref=f1e48]
                      - generic:
                        - generic: Speed
                    - button "Transcript" [ref=f1e51] [cursor=pointer]:
                      - img [ref=f1e52]
                      - generic:
                        - generic: Transcript
                    - button "Picture-in-Picture" [ref=f1e54] [cursor=pointer]:
                      - img [ref=f1e55]
                      - generic:
                        - generic: Picture-in-Picture
                    - button "Fullscreen" [ref=f1e57] [cursor=pointer]:
                      - img [ref=f1e58]
                      - generic:
                        - generic: Fullscreen
                  - link "Watch on Vimeo" [ref=f1e60] [cursor=pointer]:
                    - /url: https://vimeo.com/1229275734/6bb3791685?fl=pl&fe=vl
                    - img [ref=f1e61]
    - generic [ref=e215]:
      - generic [ref=e216]:
        - generic [ref=e217]:
          - text: Historias
          - heading "Clínicas chilenas que ya no vuelven atrás." [level=2] [ref=e218]
        - generic [ref=e219]:
          - button "Anterior" [ref=e220] [cursor=pointer]:
            - img [ref=e221]
          - button "Siguiente" [disabled] [ref=e223]:
            - img [ref=e224]
      - generic [ref=e227]:
        - figure [ref=e228]:
          - generic [ref=e229]:
            - img "Dra. Katherine Meza" [ref=e230]
            - generic [ref=e231]: No-shows 30% → 5%
          - generic [ref=e232]:
            - blockquote [ref=e233]: “Por fin tengo tiempo para mis pacientes. AURA contesta incluso cuando estoy en pabellón o durmiendo. Mi secretaria ahora se dedica a lo importante.”
            - generic [ref=e234]:
              - generic [ref=e235]: Dra. Katherine Meza
              - generic [ref=e236]: Clínica Estética · Santiago
        - figure [ref=e237]:
          - generic [ref=e238]:
            - img "Dr. Flavio Rojas" [ref=e239]
            - generic [ref=e240]: −71% gasto en marketing
          - generic [ref=e241]:
            - blockquote [ref=e242]: “Probamos Clinera un mes para ver. No volvimos atrás. Llenó la agenda sin gastar un peso más en Instagram.”
            - generic [ref=e243]:
              - generic [ref=e244]: Dr. Flavio Rojas
              - generic [ref=e245]: infiltracion.cl · Los Ángeles, Chile
        - figure [ref=e246]:
          - generic [ref=e247]:
            - img "Dra. Stefani Michailiszen" [ref=e248]
            - generic [ref=e249]: +38% agenda ocupada
          - generic [ref=e250]:
            - blockquote [ref=e251]: "“Lo que más me sorprende: las pacientes creen que AURA es la recepcionista nueva. Responde con el tono de la clínica, sin que nadie note que es IA.”"
            - generic [ref=e252]:
              - generic [ref=e253]: Dra. Stefani Michailiszen
              - generic [ref=e254]: Dermaclinic · Las Condes
        - figure [ref=e255]:
          - generic [ref=e256]:
            - img "Tamara Oyarzún" [ref=e257]
            - generic [ref=e258]: +47 pacientes recuperados
          - generic [ref=e259]:
            - blockquote [ref=e260]: “AURA reactivó 47 pacientes inactivos el primer mes. Eso pagó la suscripción del año.”
            - generic [ref=e261]:
              - generic [ref=e262]: Tamara Oyarzún
              - generic [ref=e263]: Estética Corporal · Vitacura
        - figure [ref=e264]:
          - generic [ref=e265]:
            - img "Dra. Yasna Vásquez" [ref=e266]
            - generic [ref=e267]: Respuesta <1s · 24/7
          - generic [ref=e268]:
            - blockquote [ref=e269]: “Dejamos de perder pacientes por no contestar a tiempo. Responde en menos de un segundo y con el historial de cada uno.”
            - generic [ref=e270]:
              - generic [ref=e271]: Dra. Yasna Vásquez
              - generic [ref=e272]: Estética Facial · Talca
      - generic [ref=e273]:
        - button "Ir a grupo 1" [ref=e274] [cursor=pointer]
        - button "Ir a grupo 2" [ref=e275] [cursor=pointer]
        - button "Ir a grupo 3" [ref=e276] [cursor=pointer]
    - region "Planes de Clinera" [ref=e277]:
      - generic [ref=e278]:
        - generic [ref=e279]:
          - text: Planes
          - heading "Elige según tu equipo. Crece sin cambiar de sistema." [level=2] [ref=e280]
          - paragraph [ref=e281]: Ficha estética facial y corporal, evoluciones, presupuestos, email marketing y Clinera Intelligence desde el primer plan. Subes de plan cuando crece tu equipo o cuando quieres que la IA atienda y agende por ti.
        - generic [ref=e282]: Plan mensual en dólares
        - generic [ref=e283]:
          - article [ref=e284]:
            - generic [ref=e285]:
              - generic [ref=e286]:
                - generic [ref=e287]: Plan
                - generic [ref=e288]: Flux
              - img [ref=e290]
            - table "Cobro del plan Flux" [ref=e294]:
              - row "Plan mensual Hasta 5 profesionales $129 USD/mes" [ref=e295]:
                - cell "Plan mensual Hasta 5 profesionales" [ref=e296]:
                  - generic [ref=e297]: Plan mensual
                  - generic [ref=e298]: Hasta 5 profesionales
                - cell "$129 USD/mes" [ref=e299]:
                  - generic [ref=e300]: $129
                  - generic [ref=e301]: USD/mes
            - link "Activar cuenta · Flux" [ref=e303] [cursor=pointer]:
              - /url: /clinica-estetica/activar-cuenta?plan=flux
            - generic [ref=e304]:
              - generic [ref=e305]: Funciones base
              - generic [ref=e306]:
                - generic [ref=e307]:
                  - img [ref=e309]
                  - text: Hasta 5 profesionales
                - generic [ref=e311]:
                  - img [ref=e313]
                  - text: Ficha estética facial y corporal personalizada, evoluciones y presupuestos
                - generic [ref=e315]:
                  - img [ref=e317]
                  - text: WhatsApp, Facebook, Instagram y email marketing
                - generic [ref=e319]:
                  - img [ref=e321]
                  - text: Hasta 500 conversaciones
                - generic [ref=e323]:
                  - img [ref=e325]
                  - text: 100 créditos de Clinera Intelligence
                - generic [ref=e327]:
                  - img [ref=e329]
                  - text: Sin agente IA
              - generic [ref=e331]:
                - generic [ref=e332]:
                  - generic [ref=e333]: "5"
                  - generic [ref=e334]: Profesionales
                - generic [ref=e335]:
                  - generic [ref=e336]: "500"
                  - generic [ref=e337]: Conversaciones/mes
              - generic [ref=e338]:
                - generic [ref=e339]: Canales
                - list "Canales incluidos" [ref=e340]:
                  - listitem [ref=e341]:
                    - img [ref=e343]
                    - text: WhatsApp
                  - listitem [ref=e345]:
                    - img [ref=e347]
                    - text: Facebook
                  - listitem [ref=e350]:
                    - img [ref=e352]
                    - text: Instagram
                  - listitem [ref=e356]:
                    - img [ref=e358]
                    - text: Email marketing
          - article [ref=e361]:
            - generic [ref=e362]: ★ Con IA
            - generic [ref=e363]:
              - generic [ref=e364]:
                - generic [ref=e365]: Plan
                - generic [ref=e366]: Hurricane
              - img [ref=e368]
            - table "Cobro del plan Hurricane" [ref=e372]:
              - row "Plan mensual Hasta 10 profesionales $179 USD/mes" [ref=e373]:
                - cell "Plan mensual Hasta 10 profesionales" [ref=e374]:
                  - generic [ref=e375]: Plan mensual
                  - generic [ref=e376]: Hasta 10 profesionales
                - cell "$179 USD/mes" [ref=e377]:
                  - generic [ref=e378]: $179
                  - generic [ref=e379]: USD/mes
            - link "Activar cuenta · Hurricane" [ref=e381] [cursor=pointer]:
              - /url: /clinica-estetica/activar-cuenta?plan=hurricane
            - generic [ref=e382]:
              - generic [ref=e383]: Funciones base
              - generic [ref=e384]:
                - generic [ref=e385]:
                  - img [ref=e387]
                  - text: Hasta 10 profesionales
                - generic [ref=e389]:
                  - img [ref=e391]
                  - text: Ficha estética facial y corporal personalizada, evoluciones y presupuestos
                - generic [ref=e393]:
                  - img [ref=e395]
                  - text: WhatsApp, Facebook, Instagram y email marketing
                - generic [ref=e397]:
                  - img [ref=e399]
                  - text: Hasta 1.500 conversaciones
                - generic [ref=e401]:
                  - img [ref=e403]
                  - text: 200 créditos de Clinera Intelligence
                - generic [ref=e405]:
                  - img [ref=e407]
                  - strong [ref=e410]: Agente IA · 5.000 créditos de IA
                - generic [ref=e411]:
                  - img [ref=e413]
                  - strong [ref=e416]: Onboarding humano dedicado
              - generic [ref=e417]:
                - generic [ref=e418]:
                  - generic [ref=e419]: "10"
                  - generic [ref=e420]: Profesionales
                - generic [ref=e421]:
                  - generic [ref=e422]: "1.500"
                  - generic [ref=e423]: Conversaciones/mes
              - generic [ref=e424]:
                - generic [ref=e425]: Canales
                - list "Canales incluidos" [ref=e426]:
                  - listitem [ref=e427]:
                    - img [ref=e429]
                    - text: WhatsApp
                  - listitem [ref=e431]:
                    - img [ref=e433]
                    - text: Facebook
                  - listitem [ref=e436]:
                    - img [ref=e438]
                    - text: Instagram
                  - listitem [ref=e442]:
                    - img [ref=e444]
                    - text: Email marketing
          - article [ref=e447]:
            - generic [ref=e448]:
              - generic [ref=e449]:
                - generic [ref=e450]: Plan
                - generic [ref=e451]: Vortex
              - img [ref=e453]
            - table "Cobro del plan Vortex" [ref=e455]:
              - row "Plan mensual Hasta 20 profesionales $279 USD/mes" [ref=e456]:
                - cell "Plan mensual Hasta 20 profesionales" [ref=e457]:
                  - generic [ref=e458]: Plan mensual
                  - generic [ref=e459]: Hasta 20 profesionales
                - cell "$279 USD/mes" [ref=e460]:
                  - generic [ref=e461]: $279
                  - generic [ref=e462]: USD/mes
            - link "Activar cuenta · Vortex" [ref=e464] [cursor=pointer]:
              - /url: /clinica-estetica/activar-cuenta?plan=vortex
            - generic [ref=e465]:
              - generic [ref=e466]: Funciones base
              - generic [ref=e467]:
                - generic [ref=e468]:
                  - img [ref=e470]
                  - text: Hasta 20 profesionales
                - generic [ref=e472]:
                  - img [ref=e474]
                  - text: Ficha estética facial y corporal personalizada, evoluciones y presupuestos
                - generic [ref=e476]:
                  - img [ref=e478]
                  - text: WhatsApp, Facebook, Instagram, email marketing y llamada telefónica
                - generic [ref=e480]:
                  - img [ref=e482]
                  - text: Hasta 3.000 conversaciones
                - generic [ref=e484]:
                  - img [ref=e486]
                  - text: 500 créditos de Clinera Intelligence
                - generic [ref=e488]:
                  - img [ref=e490]
                  - strong [ref=e493]: Agente IA · 15.000 créditos de IA
                - generic [ref=e494]:
                  - img [ref=e496]
                  - strong [ref=e499]: Onboarding humano dedicado
              - generic [ref=e500]:
                - generic [ref=e501]:
                  - generic [ref=e502]: "20"
                  - generic [ref=e503]: Profesionales
                - generic [ref=e504]:
                  - generic [ref=e505]: "3.000"
                  - generic [ref=e506]: Conversaciones/mes
              - generic [ref=e507]:
                - generic [ref=e508]: Canales
                - list "Canales incluidos" [ref=e509]:
                  - listitem [ref=e510]:
                    - img [ref=e512]
                    - text: WhatsApp
                  - listitem [ref=e514]:
                    - img [ref=e516]
                    - text: Facebook
                  - listitem [ref=e519]:
                    - img [ref=e521]
                    - text: Instagram
                  - listitem [ref=e525]:
                    - img [ref=e527]
                    - text: Email marketing
                  - listitem [ref=e530]:
                    - img [ref=e532]
                    - text: Llamada telefónica
        - generic [ref=e535]: "Extras: US$15 · 500 conversaciones · US$15 · 5.000 créditos IA · US$9 · profesional extra"
        - generic [ref=e536]:
          - generic [ref=e537]: Modelos de IA · Clinera Intelligence
          - generic [ref=e538]:
            - generic [ref=e539]: GLM 5.2
            - generic [ref=e541]: Gemini 3.7 Flash
            - generic [ref=e543]: Claude Opus 4.8
            - generic [ref=e545]: Claude Sonnet 5
    - region "Activa tu agente IA" [ref=e547]:
      - generic [ref=e548]:
        - generic [ref=e549]: Agente IA · 24/7 · en tu WhatsApp, Facebook, Instagram y teléfono
        - heading "Activa tu agente IA. Que agende tus pacientes por WhatsApp, Facebook, Instagram y llamadas telefónicas" [level=2] [ref=e551]:
          - generic [ref=e552]: Activa tu agente IA.
          - generic [ref=e553]:
            - text: Que agende tus pacientes por
            - generic [ref=e554]:
              - generic [ref=e555]: WhatsApp
              - generic [ref=e556]: Facebook
              - generic [ref=e557]: Instagram
              - generic [ref=e558]: teléfono
            - generic [ref=e559]: WhatsApp, Facebook, Instagram y llamadas telefónicas
        - list [ref=e560]:
          - listitem [ref=e561]:
            - img [ref=e563]
            - generic [ref=e565]:
              - generic [ref=e566]: WhatsApp
              - generic [ref=e567]: Responde, agenda y confirma
          - listitem [ref=e568]:
            - img [ref=e570]
            - generic [ref=e573]:
              - generic [ref=e574]: Facebook
              - generic [ref=e575]: Contesta Messenger y agenda
          - listitem [ref=e576]:
            - img [ref=e578]
            - generic [ref=e582]:
              - generic [ref=e583]: Instagram
              - generic [ref=e584]: Convierte mensajes directos en citas
          - listitem [ref=e585]:
            - img [ref=e587]
            - generic [ref=e589]:
              - generic [ref=e590]: Llamadas con IA
              - generic [ref=e591]: Atiende la llamada y agenda
        - generic [ref=e592]:
          - link "Activar cuenta" [ref=e593] [cursor=pointer]:
            - /url: /clinica-estetica/activar-cuenta
            - text: Activar cuenta
            - generic [ref=e594]: →
          - generic [ref=e595]: El agente IA viene desde el plan Hurricane · US$ 179/mes.
    - generic [ref=e598]:
      - generic [ref=e599]:
        - generic [ref=e600]: Clinera en la prensa
        - generic [ref=e602]:
          - generic [ref=e603]: Visto en
          - img "CNN" [ref=e604]
        - heading "Un gran paso para Clinera." [level=2] [ref=e606]
        - paragraph [ref=e607]: Ricardo Oyarzún, fundador de Clinera, fue entrevistado por CNN sobre cómo la IA está transformando la atención de las clínicas en LATAM. Un reconocimiento que confirma hacia dónde vamos.
        - link "Ver la entrevista en CNN" [ref=e608] [cursor=pointer]:
          - /url: /prensa
          - text: Ver la entrevista en CNN
          - generic [ref=e610]: →
        - link "Ver emisión original en YouTube ↗" [ref=e612] [cursor=pointer]:
          - /url: https://www.youtube.com/watch?v=Gskr4kELyx4
          - img [ref=e613]
          - text: Ver emisión original en YouTube ↗
      - iframe [ref=e618]:
        
    - generic [ref=e620]:
      - generic [ref=e621]:
        - text: Preguntas frecuentes
        - heading "Lo que siempre nos preguntan." [level=2] [ref=e622]
      - generic [ref=e623]:
        - generic [ref=e624]:
          - button "¿Necesito cambiar mi número de WhatsApp?" [ref=e625] [cursor=pointer]:
            - generic [ref=e626]: ¿Necesito cambiar mi número de WhatsApp?
            - img [ref=e628]
          - generic [ref=e630]: No. Clinera se conecta con tu número actual usando la API oficial de WhatsApp Business. Tus pacientes siguen escribiendo al mismo número de siempre.
        - button "¿Cuánto demora en estar funcionando?" [ref=e632] [cursor=pointer]:
          - generic [ref=e633]: ¿Cuánto demora en estar funcionando?
          - img [ref=e635]
        - button "¿Y si AURA no entiende algo?" [ref=e638] [cursor=pointer]:
          - generic [ref=e639]: ¿Y si AURA no entiende algo?
          - img [ref=e641]
        - button "¿Mis pacientes aceptarán hablar con una IA?" [ref=e644] [cursor=pointer]:
          - generic [ref=e645]: ¿Mis pacientes aceptarán hablar con una IA?
          - img [ref=e647]
        - button "¿Puedo cobrar la reserva?" [ref=e650] [cursor=pointer]:
          - generic [ref=e651]: ¿Puedo cobrar la reserva?
          - img [ref=e653]
        - button "¿Funciona para clínicas con varios profesionales?" [ref=e656] [cursor=pointer]:
          - generic [ref=e657]: ¿Funciona para clínicas con varios profesionales?
          - img [ref=e659]
        - button "¿Dónde se guardan los datos de mis pacientes?" [ref=e662] [cursor=pointer]:
          - generic [ref=e663]: ¿Dónde se guardan los datos de mis pacientes?
          - img [ref=e665]
    - generic [ref=e669]:
      - generic [ref=e670]:
        - text: Activa tu cuenta
        - heading "Coordina todo tu equipo y tus sedes con IA." [level=2] [ref=e671]
        - paragraph [ref=e672]: Crea tu cuenta en minutos y obtén 50% de descuento el primer mes con el código CUKI. Ficha estética, evoluciones, presupuestos y la IA que agenda por ti.
        - generic [ref=e673]:
          - link "Activar cuenta →" [ref=e674] [cursor=pointer]:
            - /url: /clinica-estetica/activar-cuenta
            - text: Activar cuenta
            - generic [ref=e675]: →
          - link "Ver demo 3 min" [ref=e676] [cursor=pointer]:
            - /url: "#demo-3-min"
            - img [ref=e677]
            - text: Ver demo 3 min
        - generic [ref=e679]: ● Onboarding asistido · Soporte en Chile y México · Factura en USD
      - generic [ref=e680]:
        - generic [ref=e681]:
          - generic [ref=e682]: ✦
          - generic [ref=e683]: Así parte AURA en tu operación
        - generic [ref=e684]:
          - generic [ref=e685]: "01"
          - generic [ref=e686]:
            - generic [ref=e687]: Conectas tu WhatsApp Business
            - generic [ref=e688]: Sin cambiar de número. 2 minutos.
        - generic [ref=e689]:
          - generic [ref=e690]: "02"
          - generic [ref=e691]:
            - generic [ref=e692]: AURA se conecta a tu agenda y BD
            - generic [ref=e693]: Importamos tu base de pacientes y horas disponibles.
        - generic [ref=e694]:
          - generic [ref=e695]: "03"
          - generic [ref=e696]:
            - generic [ref=e697]: Empieza a responder con contexto
            - generic [ref=e698]: Esta misma tarde, sabiendo quién es quién.
    - paragraph [ref=e699]: Actualizado el 3 de septiembre de 2026
  - contentinfo [ref=e700]:
    - link "Ver demo" [ref=e701] [cursor=pointer]:
      - /url: /demo
      - img [ref=e703]
      - text: Ver demo
    - generic [ref=e705]:
      - generic [ref=e706]:
        - generic [ref=e707]:
          - generic [ref=e708]: c
          - generic [ref=e709]: clinera.io
        - generic [ref=e710]: La IA que atiende, agenda y confirma pacientes por ti. Para clínicas que quieren crecer sin contratar más recepción.
        - generic [ref=e713]: +500 médicos · 9 países
      - generic [ref=e714]:
        - generic [ref=e715]: Producto
        - generic [ref=e716]:
          - link "Ver demo 3 min" [ref=e717] [cursor=pointer]:
            - /url: /demo
          - link "Software médico" [ref=e718] [cursor=pointer]:
            - /url: /software-medico
          - link "Software dental" [ref=e719] [cursor=pointer]:
            - /url: /software-dental
          - link "Software estético" [ref=e720] [cursor=pointer]:
            - /url: /software-estetica
          - link "Software para clínicas" [ref=e721] [cursor=pointer]:
            - /url: /software-para-clinicas
          - link "Agendamiento por WhatsApp" [ref=e722] [cursor=pointer]:
            - /url: /agendamiento-whatsapp-ia
          - link "Funciones" [ref=e723] [cursor=pointer]:
            - /url: /funciones
          - link "Planes" [ref=e724] [cursor=pointer]:
            - /url: /planes
          - link "App móvil" [ref=e725] [cursor=pointer]:
            - /url: /app
          - link "Partners" [ref=e726] [cursor=pointer]:
            - /url: /partners
          - link "Convenio doctores" [ref=e727] [cursor=pointer]:
            - /url: /convenio-doctores
          - link "Integraciones" [ref=e728] [cursor=pointer]:
            - /url: /blog/clinera-api-webhooks-n8n-make-zapier
      - generic [ref=e729]:
        - generic [ref=e730]: Recursos
        - generic [ref=e731]:
          - link "Calcula tu consumo" [ref=e732] [cursor=pointer]:
            - /url: /calculadora-de-consumo
          - link "Estudio de efectividad" [ref=e733] [cursor=pointer]:
            - /url: /efectividad
          - link "Equipo" [ref=e734] [cursor=pointer]:
            - /url: /equipo
          - link "Caso Método Hebe" [ref=e735] [cursor=pointer]:
            - /url: /casos/metodo-hebe
          - link "Caso Protocolo Lumina" [ref=e736] [cursor=pointer]:
            - /url: /casos/protocolo-lumina
          - link "Caso Katherine Meza" [ref=e737] [cursor=pointer]:
            - /url: /casos/katherine-meza
          - link "Estudio de confianza" [ref=e738] [cursor=pointer]:
            - /url: /blog/estudio-ia-respuesta-humana-confianza-pacientes
          - link "Novedades Clinera" [ref=e739] [cursor=pointer]:
            - /url: /novedades
          - link "Clinera Podcast" [ref=e740] [cursor=pointer]:
            - /url: /podcast
      - generic [ref=e741]:
        - generic [ref=e742]: Soporte
        - generic [ref=e743]:
          - link "Centro de ayuda" [ref=e744] [cursor=pointer]:
            - /url: /ayuda
          - link "Migrar a Clinera" [ref=e745] [cursor=pointer]:
            - /url: /migracion
          - link "Activar cuenta" [ref=e746] [cursor=pointer]:
            - /url: /clinica-estetica/activar-cuenta
          - link "Agendar reunión" [ref=e747] [cursor=pointer]:
            - /url: /reunion-comercial
          - link "Ley de Datos N° 21.719" [ref=e748] [cursor=pointer]:
            - /url: /seguridad
          - link "Seguridad de datos" [ref=e749] [cursor=pointer]:
            - /url: /ley20584
          - link "Normativa y acreditación" [ref=e750] [cursor=pointer]:
            - /url: /acreditacion
      - generic [ref=e751]:
        - generic [ref=e752]: Comparativas
        - generic [ref=e753]:
          - link "Clinera vs Reservo" [ref=e754] [cursor=pointer]:
            - /url: /comparativas/reservo
          - link "Clinera vs AgendaPro" [ref=e755] [cursor=pointer]:
            - /url: /comparativas/agendapro
          - link "Clinera vs Medilink" [ref=e756] [cursor=pointer]:
            - /url: /comparativas/medilink
          - link "Clinera vs Manual" [ref=e757] [cursor=pointer]:
            - /url: /comparativas/manual
          - link "Ver todas →" [ref=e758] [cursor=pointer]:
            - /url: /comparativas
      - generic [ref=e759]:
        - generic [ref=e760]: Recursos LLM✦
        - generic [ref=e761]:
          - link "llms.txt" [ref=e762] [cursor=pointer]:
            - /url: /llms.txt
          - link "llms-full.txt" [ref=e763] [cursor=pointer]:
            - /url: /llms-full.txt
          - link "Robots.txt" [ref=e764] [cursor=pointer]:
            - /url: /robots.txt
    - generic [ref=e765]:
      - generic [ref=e766]:
        - text: © 2026 Clinera SpA · OACG Group · Santiago, Chile · CDMX, México ·
        - link "Términos" [ref=e767] [cursor=pointer]:
          - /url: /terminos
        - text: ·
        - link "Privacidad" [ref=e768] [cursor=pointer]:
          - /url: /privacidad
        - text: ·
        - link "Cookies" [ref=e769] [cursor=pointer]:
          - /url: /cookies
      - generic [ref=e770]: USD · WhatsApp Business API · LATAM
  - button "Open Next.js Dev Tools" [ref=e776] [cursor=pointer]:
    - img [ref=e777]
  - alert [ref=e780]
```

# Test source

```ts
  49  |     expect(script).toContain("localhost");
  50  |     expect(await page.evaluate(() => typeof (window as unknown as { fbq?: unknown }).fbq)).toBe(
  51  |       "undefined",
  52  |     );
  53  | 
  54  |     const dl = await readDataLayer(page);
  55  |     console.log("dataLayer after load:", JSON.stringify(dl, null, 2));
  56  |     console.log("pixel hits after load:", hits.map((h) => h.event));
  57  |   });
  58  | 
  59  |   test("2) ViewContent fires after scrolling to bottom of home", async ({ page }) => {
  60  |     const hits = await installPixelRecorder(page);
  61  |     await page.goto("/", { waitUntil: "domcontentloaded" });
  62  |     await page.waitForTimeout(1500);
  63  | 
  64  |     // Slow scroll in chunks so IntersectionObserver + scroll listeners fire
  65  |     await page.evaluate(async () => {
  66  |       const total = document.documentElement.scrollHeight;
  67  |       const step = window.innerHeight * 0.7;
  68  |       for (let y = 0; y < total; y += step) {
  69  |         window.scrollTo(0, y);
  70  |         await new Promise((r) => setTimeout(r, 350));
  71  |       }
  72  |       window.scrollTo(0, document.documentElement.scrollHeight);
  73  |       await new Promise((r) => setTimeout(r, 1500));
  74  |     });
  75  | 
  76  |     await page.waitForTimeout(2000);
  77  | 
  78  |     const viewContents = hits.filter((h) => h.event === "ViewContent");
  79  |     const dl = await readDataLayer(page);
  80  |     const dlVC = (dl as Array<Record<string, unknown>>).filter(
  81  |       (e) => e.event === "view_content"
  82  |     );
  83  | 
  84  |     console.log("ViewContent Meta Pixel hits:", viewContents.length);
  85  |     console.log("view_content dataLayer hits:", dlVC.length);
  86  |     console.log("All hits:", hits.map((h) => h.event));
  87  | 
  88  |     expect(
  89  |       viewContents.length + dlVC.length,
  90  |       "expected ViewContent to fire on Meta Pixel OR dataLayer after scroll-to-bottom"
  91  |     ).toBeGreaterThanOrEqual(1);
  92  |   });
  93  | 
  94  |   test("3) ViewContent fires on SPA navigation between pages", async ({ page }) => {
  95  |     const hits = await installPixelRecorder(page);
  96  |     const consoleLogs: string[] = [];
  97  |     page.on("console", (msg) => consoleLogs.push(`[${msg.type()}] ${msg.text()}`));
  98  | 
  99  |     await page.goto("/", { waitUntil: "domcontentloaded" });
  100 |     await page.waitForTimeout(1800);
  101 | 
  102 |     const hitsBefore = hits.length;
  103 |     const dlBefore = (await readDataLayer(page)) as Array<Record<string, unknown>>;
  104 | 
  105 |     // Navigate to /planes via Next.js client-side nav
  106 |     await page.click('a[href="/planes"]');
  107 |     await page.waitForURL("**/planes");
  108 |     await page.waitForTimeout(3000);
  109 | 
  110 |     const newHits = hits.slice(hitsBefore);
  111 |     const dlAfter = (await readDataLayer(page)) as Array<Record<string, unknown>>;
  112 |     const dlNew = dlAfter.slice(dlBefore.length);
  113 | 
  114 |     console.log("hits before navigation:", hits.slice(0, hitsBefore).map((h) => h.event));
  115 |     console.log("new pixel hits after navigation:", newHits.map((h) => h.event));
  116 |     console.log("dataLayer new events after navigation:");
  117 |     dlNew.forEach((e) => console.log(" ", JSON.stringify(e).slice(0, 200)));
  118 |     console.log(
  119 |       "debug: location after nav:",
  120 |       await page.evaluate(() => location.pathname)
  121 |     );
  122 | 
  123 |     const viewContentsAfter = newHits.filter((h) => h.event === "ViewContent");
  124 |     const dlViewContentsAfter = dlNew.filter((e) => e.event === "view_content");
  125 | 
  126 |     expect(
  127 |       viewContentsAfter.length + dlViewContentsAfter.length,
  128 |       "expected ViewContent on SPA navigation (Meta Pixel or dataLayer)"
  129 |     ).toBeGreaterThanOrEqual(1);
  130 |   });
  131 | 
  132 |   // Desde el 18-oct-2026 /planes tiene un solo CTA: «Activar cuenta» → la landing (ahí se paga).
  133 |   test("4) Plan cards on /planes: «Activar cuenta» → landing con el plan", async ({ page }) => {
  134 |     await page.goto("/planes", { waitUntil: "domcontentloaded" });
  135 |     const cta = page.locator('[data-plan-card="hurricane"] a[data-cta-ventas="hurricane"]');
  136 |     await expect(cta).toBeVisible({ timeout: 10_000 });
  137 |     await expect(cta).toContainText(/Activar cuenta/i);
  138 |     await expect(cta).toHaveAttribute("href", /^\/clinica-estetica\/activar-cuenta\?(.*&)?plan=hurricane/);
  139 |     await expect(page.locator('main a[href*="buy.stripe.com"]')).toHaveCount(0);
  140 |   });
  141 | 
  142 |   test("5) EngagedSession fires after 60 seconds of visible time", async ({ page }) => {
  143 |     const hits = await installPixelRecorder(page);
  144 |     await page.goto("/", { waitUntil: "domcontentloaded" });
  145 |     await page.waitForTimeout(1500);
  146 | 
  147 |     // Simulate 65 seconds of presence. We can't actually wait 65s per test,
  148 |     // so we cheat by dispatching a custom synthetic tick — inspect state.
> 149 |     await page.waitForTimeout(65_000);
      |                ^ Error: page.waitForTimeout: Test timeout of 60000ms exceeded.
  150 | 
  151 |     const customEvents = hits.filter((h) => h.event === "EngagedSession" || h.params["ev"] === "EngagedSession");
  152 |     const dl = await readDataLayer(page);
  153 |     const dlEngaged = (dl as Array<Record<string, unknown>>).filter(
  154 |       (e) => e.event === "engaged_60s"
  155 |     );
  156 | 
  157 |     console.log("EngagedSession Meta Pixel hits:", customEvents.length);
  158 |     console.log("engaged_60s dataLayer hits:", dlEngaged.length);
  159 |     console.log("all hits names:", hits.map((h) => h.event));
  160 | 
  161 |     expect(
  162 |       customEvents.length + dlEngaged.length,
  163 |       "expected EngagedSession / engaged_60s after 60+ seconds"
  164 |     ).toBeGreaterThanOrEqual(1);
  165 |   });
  166 | });
  167 | 
```