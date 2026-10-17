# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: activa.spec.ts >> /activa: landing informativa >> la animación no se superpone si el texto se agranda: las escenas comparten celda y se bloquea el agrandado del navegador de Meta
- Location: tests/activa.spec.ts:62:7

# Error details

```
Error: expect(received).not.toMatch(expected)

Expected pattern: not /\.dia-stage \{[^}]*\bheight: \d+px/
Received string:      "import { CnnLogo } from \"@/components/brand-v3/Brand\";
import { ChannelLogo } from \"@/components/pricing/PlanChannelLogos\";
import { ACTIVA_DEMO_IA as D, ACTIVA_RESPALDO } from \"@/content/activa\";

const MONO = \"'JetBrains Mono', ui-monospace, monospace\";
const CICLO = 12; // segundos por vuelta (3 escenas de ~4 s)

/** Ventanas de cada escena, en % del ciclo. */
const ESCENA = { s1: [0, 33], s2: [33, 66], s3: [66, 100] } as const;

/** Piezas: instante de entrada (% del ciclo) y escena a la que pertenecen. Cada una se apaga con su escena. */
const PIEZAS = [
  { id: \"a1\", t: 2, s: \"s1\" }, // mensaje de la paciente
  { id: \"a2\", t: 9, s: \"s1\" }, // respuesta de la IA
  { id: \"a3\", t: 16, s: \"s1\" }, // cita en la agenda
  { id: \"a4\", t: 22, s: \"s1\" }, // etiqueta «Agendado por IA»
  { id: \"r1\", t: 35, s: \"s2\" }, // recordatorio de la clínica
  { id: \"r2\", t: 42, s: \"s2\" }, // confirmación de la paciente
  { id: \"r3\", t: 50, s: \"s2\" }, // cita confirmada
  { id: \"r4\", t: 56, s: \"s2\" }, // etiqueta de recordatorio
  { id: \"d1\", t: 68, s: \"s3\" }, // mensaje de difusión
  { id: \"d2\", t: 74, s: \"s3\" }, // destinatarios (cada uno con su retraso)
  { id: \"d3\", t: 90, s: \"s3\" }, // etiqueta de difusión
] as const;

/** Un keyframe por pieza y uno por escena: invisible → aparece → se queda → se apaga con su escena. */
const KEYFRAMES =
  PIEZAS.map((p) => {
    const fin = ESCENA[p.s][1];
    return `@keyframes dia-${p.id}{0%,${p.t}%{opacity:0;transform:translateY(7px) scale(.97)}${p.t + 3}%{opacity:1;transform:none}${fin - 3}%{opacity:1;transform:none}${fin}%,100%{opacity:0;transform:none}}`;
  }).join(\"\") +
  (Object.keys(ESCENA) as (keyof typeof ESCENA)[])
    .map((k) => {
      const [ini, fin] = ESCENA[k];
      return `@keyframes dia-${k}{0%,${Math.max(ini - 1, 0)}%{opacity:0}${ini + 1}%,${fin - 2}%{opacity:1}${fin}%,100%{opacity:0}}`;
    })
    .join(\"\");

const pieza = (id: string, extra = \"\"): React.CSSProperties => ({ opacity: 0, animation: `dia-${id} ${CICLO}s ease-out ${extra} infinite` });
const escena = (k: string): React.CSSProperties => ({ opacity: 0, animation: `dia-${k} ${CICLO}s linear infinite` });

const burbuja = (bg: string): React.CSSProperties => ({ background: bg, borderRadius: 8, padding: \"5px 8px\", fontFamily: \"Inter\", fontSize: 11.5, color: \"#111827\", maxWidth: \"92%\" });
const chip: React.CSSProperties = { fontFamily: \"Inter\", fontSize: 12, fontWeight: 700, background: \"#F3F4F6\", borderRadius: 6, padding: \"3px 7px\" };
const etiquetaOscura: React.CSSProperties = { justifySelf: \"start\", fontFamily: \"Inter\", fontSize: 11, fontWeight: 700, background: \"#1F2937\", color: \"#fff\", borderRadius: 6, padding: \"3px 8px\" };
const panelChat: React.CSSProperties = { background: \"#ECE5DD\", borderRadius: 10, padding: 7, display: \"grid\", gap: 5, alignContent: \"start\" };
const panelCita: React.CSSProperties = { background: \"#fff\", borderRadius: 10, padding: 9, border: \"1px solid #E5E7EB\", display: \"grid\", alignContent: \"center\", gap: 5 };

/**
 * Animación compacta (sin JavaScript) del wizard de /go. Tres escenas que rotan en el mismo espacio:
 * 1) la IA agenda por WhatsApp y la cita queda «Agendado por IA»; 2) recordatorio automático de la cita;
 * 3) difusión masiva por WhatsApp. Cada escena dice desde qué plan existe (Go! no trae ninguna de las tres).
 * Debajo, «Respaldado por». Cabe en el alto de la imagen de CNN que reemplazó, para no sumar scroll.
 * Con «reducir movimiento» queda quieta la primera escena.
 */
export function DemoIACompact() {
  const c = D.cita;
  const e = D.escenas;
  return (
    <div className=\"dia-root\" data-activa-demo-ia>
      <style>{`
        ${KEYFRAMES}
        /* Las 3 escenas comparten la MISMA celda de la grilla: la caja mide lo que mide la escena más alta. Con alto fijo, un texto más grande (el navegador interno de Meta infla el texto en Android) se salía de la caja y se superponía con «Respaldado por». */
        .dia-root { -webkit-text-size-adjust: 100%; text-size-adjust: 100%; }
        .dia-stage { display: grid; min-height: 112px; }
        .dia-escena { grid-area: 1 / 1; position: relative; display: grid; grid-template-columns: 1.15fr 1fr; gap: 8px; align-items: stretch; }
        .dia-lab { position: absolute; top: -17px; right: 4px; z-index: 2; font-family: ${MONO}; font-size: 9px; letter-spacing: .06em; text-transform: uppercase; background: #fff; border: 1px solid #E5E7EB; border-radius: 999px; padding: 2px 8px; color: #6B7280; }
        @media (max-height: 800px) {
          .dia-stage { min-height: 100px; }
          .dia-head, .dia-estado { display: none !important; }
          .dia-resp { margin-top: 5px !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          .dia-s2, .dia-s3 { display: none !important; }
          .dia-s1, .dia-s1 [style*=\"dia-\"] { animation: none !important; opacity: 1 !important; transform: none !important; }
        }
      `}</style>

      <div style={{ position: \"relative\", border: \"1px solid #E5E7EB\", borderRadius: 14, padding: 8, background: \"#FAFAFA\" }}>
        <div className=\"dia-stage\">
          {/* Escena 1: la IA agenda */}
          <div className=\"dia-escena dia-s1\" style={escena(\"s1\")}>
            <span className=\"dia-lab\">{e.agenda.etiqueta}</span>
            <div style={panelChat}>
              <div className=\"dia-head\" style={{ display: \"flex\", alignItems: \"center\", gap: 5, fontFamily: \"Inter\", fontSize: 10.5, fontWeight: 700, color: \"#075E54\" }}>
                <ChannelLogo channel=\"whatsapp\" size={14} /> {D.chatNombre}
              </div>
              <div style={{ ...pieza(\"a1\"), ...burbuja(\"#DCF8C6\"), justifySelf: \"end\" }}>{D.compacto.paciente}</div>
              <div style={{ ...pieza(\"a2\"), ...burbuja(\"#fff\"), justifySelf: \"start\" }}>{D.compacto.ia}</div>
            </div>
            <div style={{ ...pieza(\"a3\"), ...panelCita }}>
              <div style={{ display: \"flex\", gap: 5, flexWrap: \"wrap\", alignItems: \"center\" }}>
                <span style={chip}>🕒 {c.hora}</span>
                <span className=\"dia-estado\" style={{ fontFamily: \"Inter\", fontSize: 10.5, fontWeight: 700, background: \"#FEF3C7\", color: \"#92400E\", borderRadius: 999, padding: \"3px 8px\" }}>Pendiente</span>
              </div>
              <div style={{ fontFamily: \"Inter\", fontSize: 14, fontWeight: 700, color: \"#3B5BDB\" }}>{c.paciente}</div>
              <span data-activa-etiqueta-ia style={{ ...pieza(\"a4\"), ...etiquetaOscura }}>⚡ {c.etiqueta}</span>
            </div>
          </div>

          {/* Escena 2: recordatorio automático */}
          <div className=\"dia-escena dia-s2\" style={escena(\"s2\")}>
            <span className=\"dia-lab\">{e.recordatorio.etiqueta}</span>
            <div style={panelChat}>
              <div style={{ ...pieza(\"r1\"), ...burbuja(\"#fff\"), justifySelf: \"start\" }}>{e.recordatorio.clinica}</div>
              <div style={{ ...pieza(\"r2\"), ...burbuja(\"#DCF8C6\"), justifySelf: \"end\" }}>{e.recordatorio.paciente}</div>
            </div>
            <div style={{ ...pieza(\"r3\"), ...panelCita }}>
              <div style={{ display: \"flex\", gap: 5, flexWrap: \"wrap\", alignItems: \"center\" }}>
                <span style={chip}>🕒 {c.hora}</span>
                <span className=\"dia-estado\" style={{ fontFamily: \"Inter\", fontSize: 10.5, fontWeight: 700, background: \"#ECFDF5\", color: \"#047857\", borderRadius: 999, padding: \"3px 8px\" }}>{c.estado}</span>
              </div>
              <div style={{ fontFamily: \"Inter\", fontSize: 14, fontWeight: 700, color: \"#3B5BDB\" }}>{c.paciente}</div>
              <span data-activa-etiqueta-recordatorio style={{ ...pieza(\"r4\"), ...etiquetaOscura }}>{e.recordatorio.tag}</span>
            </div>
          </div>

          {/* Escena 3: difusión masiva */}
          <div className=\"dia-escena dia-s3\" style={escena(\"s3\")}>
            <span className=\"dia-lab\">{e.difusion.etiqueta}</span>
            <div style={panelChat}>
              <div style={{ ...pieza(\"d1\"), ...burbuja(\"#DCF8C6\"), justifySelf: \"end\" }}>{e.difusion.mensaje}</div>
            </div>
            <div style={{ background: \"#fff\", borderRadius: 10, padding: 9, border: \"1px solid #E5E7EB\", display: \"grid\", alignContent: \"center\", gap: 6 }}>
              <div style={{ display: \"flex\", gap: 3, flexWrap: \"wrap\" }}>
                {e.difusion.destinatarios.map((n, i) => (
                  <span
                    key={n + i}
                    style={{ ...pieza(\"d2\", `${(i * 0.18).toFixed(2)}s`), width: 20, height: 20, borderRadius: \"50%\", background: \"#EDE9FE\", color: \"#5B21B6\", fontFamily: \"Inter\", fontSize: 10.5, fontWeight: 700, display: \"grid\", placeItems: \"center\" }}
                  >
                    {n}
                  </span>
                ))}
              </div>
              <div style={{ fontFamily: \"Inter\", fontSize: 11, color: \"#047857\", fontWeight: 700 }}>✓✓ {e.difusion.pie}</div>
              <span data-activa-etiqueta-difusion style={{ ...pieza(\"d3\"), ...etiquetaOscura }}>{e.difusion.tag}</span>
            </div>
          </div>
        </div>
      </div>

      <div className=\"dia-resp\" data-activa-respaldo style={{ display: \"flex\", alignItems: \"center\", justifyContent: \"center\", gap: 12, flexWrap: \"wrap\", marginTop: 8 }}>
        <span style={{ fontFamily: MONO, fontSize: 9.5, letterSpacing: \".1em\", textTransform: \"uppercase\", color: \"#6B7280\" }}>{ACTIVA_RESPALDO.etiqueta}</span>
        <CnnLogo height={17} color=\"#F03A47\" />
        <span style={{ fontFamily: \"Georgia, 'Times New Roman', serif\", fontSize: 16, fontWeight: 700, color: \"#111827\" }}>Forbes</span>
        <span style={{ fontFamily: \"Inter\", fontSize: 12.5, fontWeight: 700, letterSpacing: \"-0.02em\", color: \"#0B4F8A\" }}>Clínica Alemana</span>
      </div>
    </div>
  );
}
"
```

# Test source

```ts
  1   | import { test, expect } from "@playwright/test";
  2   | import { readFileSync } from "node:fs";
  3   | import { ACTIVA_CNN, ACTIVA_CTA, ACTIVA_CTA_HREF, ACTIVA_DEMO_IA, ACTIVA_FUNCIONES, ACTIVA_RESPALDO } from "../src/content/activa";
  4   | import { PLANS_2 } from "../src/content/planes2";
  5   | import { buildRobotsTxt } from "../src/lib/robots-txt";
  6   | 
  7   | // /activa (Ricardo, 17-oct-2026): landing informativa con los 3 planes, el reportaje de CNN y las
  8   | // funciones. Todos los CTA dicen «Activa tu cuenta ahora» y van a /go.
  9   | test.describe("/activa: landing informativa", () => {
  10  |   const landing = readFileSync("src/components/activa/ActivaLanding.tsx", "utf8");
  11  |   const cta = readFileSync("src/components/activa/ActivaCta.tsx", "utf8");
  12  |   const page = readFileSync("src/app/activa/page.tsx", "utf8");
  13  | 
  14  |   test("el CTA dice «Activa tu cuenta ahora» y va a /go", () => {
  15  |     expect(ACTIVA_CTA).toBe("Activa tu cuenta ahora");
  16  |     expect(ACTIVA_CTA_HREF).toBe("/go");
  17  |     expect(cta).toMatch(/href=\{ACTIVA_CTA_HREF\}/);
  18  |     expect(landing).not.toMatch(/buy\.stripe\.com|\/agenda|wa\.me/);
  19  |   });
  20  | 
  21  |   test("conserva la query (utm, fbclid, gclid) al ir a /go", () => {
  22  |     expect(cta).toMatch(/window\.location\.search/);
  23  |   });
  24  | 
  25  |   test("muestra los 3 planes desde PLANS_2, sin precios escritos a mano", () => {
  26  |     expect(landing).toMatch(/PLANS_2\.map/);
  27  |     expect(landing).toMatch(/plan\.monthlyUsd/);
  28  |     expect(PLANS_2.map((p) => p.monthlyUsd)).toEqual([17, 89, 179]);
  29  |     expect(landing).not.toMatch(/\b(89|179)\b/);
  30  |   });
  31  | 
  32  |   test("/activa mantiene el video de CNN (la animación de la IA va en /go)", () => {
  33  |     expect(ACTIVA_CNN.vimeoSrc).toContain("player.vimeo.com/video/1205127087");
  34  |     expect(landing).toMatch(/ACTIVA_CNN\.vimeoSrc/);
  35  |     expect(landing).not.toMatch(/DemoIA/);
  36  |   });
  37  | 
  38  |   test("la animación de la IA agendando por WhatsApp vive en /go, no en un video", () => {
  39  |     const demo = readFileSync("src/components/activa/DemoIA.tsx", "utf8");
  40  |     const go = readFileSync("src/components/go/GoWizard.tsx", "utf8");
  41  |     expect(go).toMatch(/<DemoIACompact/);
  42  |     expect(go).not.toMatch(/cnn-clinera\.jpg|<iframe|vimeo/i);
  43  |     expect(demo).not.toMatch(/<iframe|vimeo/i);
  44  |     expect(ACTIVA_DEMO_IA.cita.etiqueta).toBe("Agendado por IA");
  45  |     expect(demo).toMatch(/data-activa-etiqueta-ia/);
  46  |     expect(demo).toMatch(/prefers-reduced-motion/);
  47  |   });
  48  | 
  49  |   test("/go anima 3 escenas (agenda, recordatorio, difusión) y dice desde qué plan existe cada una", () => {
  50  |     const e = ACTIVA_DEMO_IA.escenas;
  51  |     expect(e.agenda.etiqueta).toMatch(/Ultra/);
  52  |     expect(e.recordatorio.etiqueta).toMatch(/desde Flux/);
  53  |     expect(e.difusion.etiqueta).toMatch(/desde Flux/);
  54  |     const demo = readFileSync("src/components/activa/DemoIA.tsx", "utf8");
  55  |     expect(demo).toMatch(/const CICLO = 12/); // más rápida que la versión de una escena (14 s)
  56  |     expect(demo).toMatch(/data-activa-etiqueta-recordatorio/);
  57  |     expect(demo).toMatch(/data-activa-etiqueta-difusion/);
  58  |     // Sin cifras inventadas: ni cantidad de pacientes ni porcentajes de reducción.
  59  |     expect(JSON.stringify(e)).not.toMatch(/\d+\s*(%|pacientes|contactos)|reduc/i);
  60  |   });
  61  | 
  62  |   test("la animación no se superpone si el texto se agranda: las escenas comparten celda y se bloquea el agrandado del navegador de Meta", () => {
  63  |     const demo = readFileSync("src/components/activa/DemoIA.tsx", "utf8");
  64  |     const go = readFileSync("src/components/go/GoWizard.tsx", "utf8");
  65  |     // Alto fijo = el texto inflado se salía de la caja y tapaba «Respaldado por» (visto desde un clic de Meta, 17-oct).
> 66  |     expect(demo).not.toMatch(/\.dia-stage \{[^}]*\bheight: \d+px/);
      |                      ^ Error: expect(received).not.toMatch(expected)
  67  |     expect(demo).toMatch(/\.dia-stage \{ display: grid; min-height/);
  68  |     expect(demo).toMatch(/\.dia-escena \{ grid-area: 1 \/ 1;/);
  69  |     expect(demo).toMatch(/text-size-adjust: 100%/);
  70  |     expect(go).toMatch(/textSizeAdjust: "100%"/);
  71  |   });
  72  | 
  73  |   test("/go tiene versión de escritorio (≥1024 px, dos columnas) y versión móvil (una columna)", () => {
  74  |     const go = readFileSync("src/components/go/GoWizard.tsx", "utf8");
  75  |     expect(go).toMatch(/@media \(min-width: 1024px\)/);
  76  |     expect(go).toMatch(/className="gw-shell"/);
  77  |     expect(go).toMatch(/data-go-escritorio/);
  78  |     // El móvil conserva su animación compacta bajo el paso 1; el escritorio muestra la grande al costado.
  79  |     expect(go).toMatch(/className="gw-fig"/);
  80  |     expect(go).toMatch(/\.gw-fig \{ display: none; \}/);
  81  |   });
  82  | 
  83  |   test("«Respaldado por» CNN, Forbes y Clínica Alemana", () => {
  84  |     expect(ACTIVA_RESPALDO.medios).toEqual(["CNN", "Forbes", "Clínica Alemana"]);
  85  |     const demo = readFileSync("src/components/activa/DemoIA.tsx", "utf8");
  86  |     expect(demo).toMatch(/Forbes/);
  87  |     expect(demo).toMatch(/Clínica Alemana/);
  88  |     expect(demo).toMatch(/<CnnLogo/);
  89  |   });
  90  | 
  91  |   test("la animación usa datos de ejemplo: ninguna paciente real y se avisa que es ilustrativo", () => {
  92  |     expect(ACTIVA_DEMO_IA.ejemplo).toBe("Ejemplo ilustrativo");
  93  |     expect(JSON.stringify(ACTIVA_DEMO_IA)).not.toMatch(/Roc[ií]o|Sandra|Morales|Bustos|Mu[ñn]oz|Vitacura/);
  94  |   });
  95  | 
  96  |   test("funciones sin CAMILA ni LIA (próximamente) ni integraciones con agendas de terceros", () => {
  97  |     const copy = JSON.stringify(ACTIVA_FUNCIONES);
  98  |     expect(copy).not.toMatch(/CAMILA|\bLIA\b|Reservo|AgendaPro|Medilink|Dentalink/i);
  99  |     expect(ACTIVA_FUNCIONES.length).toBeGreaterThanOrEqual(6);
  100 |   });
  101 | 
  102 |   test("sin botones flotantes de demo: el único CTA es «Activa tu cuenta ahora»", () => {
  103 |     expect(readFileSync("src/components/cro/StickyMobileCTA.tsx", "utf8")).toContain('"/activa"');
  104 |     expect(readFileSync("src/components/demo/VerDemoFloat.tsx", "utf8")).toContain('"/activa"');
  105 |   });
  106 | 
  107 |   test("interna: noindex, Disallow en robots", () => {
  108 |     expect(page).toMatch(/index: false/);
  109 |     expect(buildRobotsTxt()).toMatch(/Disallow: \/activa/);
  110 |   });
  111 | });
  112 | 
```