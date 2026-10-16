# Handoff SEO: análisis de keywords y páginas nuevas (15–16 oct 2026)

Para quien retome el trabajo en otra sesión. Lee esto antes de crear más páginas
de keywords. El mapa completo está en `docs/seo-keyword-map-2026-10.xlsx`.

## Qué se hizo

Ricardo pidió un análisis de keywords para clinera.io partiendo de «programa para
clínicas». Se armó un mapa de 48 keywords en 11 clusters y se publicaron 8 páginas
nuevas más ajustes en `/mejor-software-clinicas` y `/comparativas`.

| Ruta | Contenido (`content.ts` salvo que se indique) | Keyword objetivo |
|---|---|---|
| `/software-para-clinicas` | `CLINICAS` | programa / software / sistema de gestión para clínicas |
| `/recordatorios-citas-whatsapp` | `RECORDATORIOS` | recordatorios y confirmación de citas por WhatsApp |
| `/crm-para-clinicas` | `CRM` | CRM para clínicas |
| `/software-kinesiologia` | `KINESIOLOGIA` | software para kinesiólogos |
| `/software-psicologia` | `PSICOLOGIA` | software para psicólogos |
| `/software-nutricion` | `NUTRICION` | software para nutricionistas |
| `/software-podologia` | `PODOLOGIA` | software para podólogos |
| `/mejor-software-clinicas/peru` | `RANKINGS.peru` en `src/content/mejor-software.ts` | mejor software para clínicas en Perú (hreflang `es-PE` en `entidad.ts`) |

PRs mergeados a `main`: #312 (7 páginas + Perú), #313 (podología), #314 (ficha
editable y SUNAT confirmado). Las 4 de especialidad salen de la fábrica
`especialidad()` al final de `src/components/software-vertical/content.ts`.

Cada página quedó en: sitemap (`src/app/sitemap.ts`), fechas
(`src/content/page-dates.ts`), `public/llms.txt`, `public/llms-full.txt` y el guardián
`tests/seo-q4-paginas.spec.ts` (apertura de 40–60 palabras, FAQ sin integración con
terceros, sin residuos). Para sumar otra página del mismo tipo, copia ese patrón.

## Por qué estas páginas y no otras

- «Programa para clínicas» en Google Chile devuelve diplomados y programas
  académicos (PADE U. de Chile, Red Clínica), no software. Por eso la página genérica
  titula con «software» y usa «programa» y «sistema de gestión» como variantes.
- En México el SERP de software para clínicas estéticas lo dominan AgendaPro y Medesk.
  No competir con el término genérico allá: entrar por IA conversacional en WhatsApp.
- Lo que el sitio ya cubría bien y no se tocó: ficha clínica (9 artículos +
  `/ley20584`), `/mejor-software-clinicas` por país, `/comparativas/*`.

## Hechos confirmados por Ricardo (16-oct)

- Clinera **no emite comprobantes SUNAT** (lo dice la FAQ de Perú).
- La ficha clínica es **100% editable** y hay una **biblioteca de fichas para copiar**
  dentro de Clinera. Las páginas de especialidad lo dicen. No prometer fichas por
  especialidad ya armadas.

## Pendiente (en orden)

1. **Volúmenes de búsqueda.** Semrush respondió `no_api_units` (15-oct). Opciones:
   recargar en semrush.com/mcp-access, o pedirle a Ricardo el export de consultas de
   Search Console (12 meses). Con eso se llenan las columnas amarillas del Excel
   (volumen y dificultad), el score se calcula solo y se reordenan los TIER. Hasta
   entonces la prioridad es cualitativa y el «valor de negocio» (1–10) es una
   estimación.
2. **Copy de `/crm-para-clinicas` sin validar contra la app.** Dice que hay
   seguimiento de leads por WhatsApp, paso de lead a paciente, planes de tratamiento
   y atribución Meta/Google. Salió del copy de otras páginas del sitio, no de la app.
   Pedirle a Ricardo o a Mauricio López (producto) que lo confirme.
3. **Verificar producción.** El despliegue se dispara solo al mergear; en la sesión no
   se vio terminar. Abrir las 8 rutas en clinera.io y revisar que no den 404.
4. **Perú: competidores sin verificar a fondo.** Los datos de AgendaPro, Doctocliq y
   Medesk se reutilizaron del copy existente del repo y de una búsqueda; Medesk
   «declara facturación electrónica para Perú» según su propio blog. Revisar antes de
   usar la página en campañas.
5. **Ideas descartadas o sin validar** (en el Excel): «secretaria virtual para
   clínica» (variante de `/empleado-digital`, estado «Por validar»); más países
   (Ecuador, etc.) y más especialidades solo si el volumen lo justifica.
6. **Medición.** Cuando haya tráfico, mirar en Search Console qué páginas reciben
   impresiones y ajustar títulos; revisar el Share of Model en ChatGPT/Perplexity.

## Reglas que no se deben romper en páginas nuevas

Ya están en `AGENTS.md`; lo esencial para este trabajo:

- Clinera no se integra con agendas de terceros; solo Webhooks + API pública
  (Atlas y Summit). Las FAQ incluyen `INTEGRATION_FAQ`.
- Un solo modo de agendamiento (Agentic). Sin Eficiente / Agentic Pro.
- Precios solo desde `pricing.ts` (vía `vortex.monthlyPrice` etc.), nunca a mano.
- CAMILA (voz) solo Summit; LIA solo Summit. No prometer email marketing ni
  triggers de cumpleaños (son «próximas funciones»).
- Sin porcentajes de reducción de no-shows (no hay dato propio).
- Primera mención de un competidor lleva link al sitio oficial o a su comparativa.

## Cómo trabajar en este repo (trampas de la sesión)

- `node_modules` no viene instalado: `pnpm install --frozen-lockfile --ignore-scripts`.
- `npx playwright test tests/seo-q4-paginas.spec.ts --project=chromium` corre las
  pruebas estáticas. Las de «runtime» (`aeo-entidad`, `aeo-puente-clinicas`) fallan
  en el entorno cloud por falta de navegador: es normal, no es regresión.
- `npx tsc --noEmit` marca siempre 3 errores previos (`RouteContext`, `PageProps` en
  `/firma`). No son de estas páginas.
- Correr los tests modifica `next-env.d.ts` y borra archivos de `test-results/`
  que están versionados: restaurar con `git checkout -- next-env.d.ts test-results`
  antes de commitear.
- No se corrió `next build` en la sesión; la verificación de compilación fue el build
  de Vercel de cada PR.
- Cuando el PR de la rama ya está mergeado, rehacer la rama desde `main`
  (`git checkout -B <rama> origin/main`) y empujar con `--force-with-lease`.
