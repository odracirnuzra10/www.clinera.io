import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
import { ACTIVA_CNN, ACTIVA_CTA, ACTIVA_CTA_HREF, ACTIVA_DEMO_IA, ACTIVA_FUNCIONES, ACTIVA_RESPALDO } from "../src/content/activa";
import { PLANS_2 } from "../src/content/planes2";
import { buildRobotsTxt } from "../src/lib/robots-txt";

// /activa (Ricardo, 17-oct-2026): landing informativa con los 3 planes, el reportaje de CNN y las
// funciones. Todos los CTA dicen «Activa tu cuenta ahora» y van a /go.
test.describe("/activa: landing informativa", () => {
  const landing = readFileSync("src/components/activa/ActivaLanding.tsx", "utf8");
  const cta = readFileSync("src/components/activa/ActivaCta.tsx", "utf8");
  const page = readFileSync("src/app/activa/page.tsx", "utf8");

  test("el CTA dice «Activa tu cuenta ahora» y va a /go", () => {
    expect(ACTIVA_CTA).toBe("Activa tu cuenta ahora");
    expect(ACTIVA_CTA_HREF).toBe("/go");
    expect(cta).toMatch(/href=\{ACTIVA_CTA_HREF\}/);
    expect(landing).not.toMatch(/buy\.stripe\.com|\/agenda|wa\.me/);
  });

  test("conserva la query (utm, fbclid, gclid) al ir a /go", () => {
    expect(cta).toMatch(/window\.location\.search/);
  });

  test("muestra los 3 planes desde PLANS_2, sin precios escritos a mano", () => {
    expect(landing).toMatch(/PLANS_2\.map/);
    expect(landing).toMatch(/plan\.monthlyUsd/);
    expect(PLANS_2.map((p) => p.monthlyUsd)).toEqual([17, 89, 179]);
    expect(landing).not.toMatch(/\b(89|179)\b/);
  });

  test("/activa mantiene el video de CNN (la animación de la IA va en /go)", () => {
    expect(ACTIVA_CNN.vimeoSrc).toContain("player.vimeo.com/video/1205127087");
    expect(landing).toMatch(/ACTIVA_CNN\.vimeoSrc/);
    expect(landing).not.toMatch(/DemoIA/);
  });

  test("la animación de la IA agendando por WhatsApp vive en /go, no en un video", () => {
    const demo = readFileSync("src/components/activa/DemoIA.tsx", "utf8");
    const go = readFileSync("src/components/go/GoWizard.tsx", "utf8");
    expect(go).toMatch(/<DemoIACompact/);
    expect(go).not.toMatch(/cnn-clinera\.jpg|<iframe|vimeo/i);
    expect(demo).not.toMatch(/<iframe|vimeo/i);
    expect(ACTIVA_DEMO_IA.cita.etiqueta).toBe("Agendado por IA");
    expect(demo).toMatch(/data-activa-etiqueta-ia/);
    expect(demo).toMatch(/prefers-reduced-motion/);
  });

  test("/go anima 3 escenas (agenda, recordatorio, difusión) y dice desde qué plan existe cada una", () => {
    const e = ACTIVA_DEMO_IA.escenas;
    expect(e.agenda.etiqueta).toMatch(/Ultra/);
    expect(e.recordatorio.etiqueta).toMatch(/desde Flux/);
    expect(e.difusion.etiqueta).toMatch(/desde Flux/);
    const demo = readFileSync("src/components/activa/DemoIA.tsx", "utf8");
    expect(demo).toMatch(/const CICLO = 12/); // más rápida que la versión de una escena (14 s)
    expect(demo).toMatch(/data-activa-etiqueta-recordatorio/);
    expect(demo).toMatch(/data-activa-etiqueta-difusion/);
    // Sin cifras inventadas: ni cantidad de pacientes ni porcentajes de reducción.
    expect(JSON.stringify(e)).not.toMatch(/\d+\s*(%|pacientes|contactos)|reduc/i);
  });

  test("la animación no se superpone si el texto se agranda: las escenas comparten celda y se bloquea el agrandado del navegador de Meta", () => {
    const demo = readFileSync("src/components/activa/DemoIA.tsx", "utf8");
    const go = readFileSync("src/components/go/GoWizard.tsx", "utf8");
    // Alto fijo = el texto inflado se salía de la caja y tapaba «Respaldado por» (visto desde un clic de Meta, 17-oct).
    expect(demo).not.toMatch(/\.dia-stage \{[^}]*\bheight: \d+px/);
    expect(demo).toMatch(/\.dia-stage \{ display: grid; min-height/);
    expect(demo).toMatch(/\.dia-escena \{ grid-area: 1 \/ 1;/);
    expect(demo).toMatch(/text-size-adjust: 100%/);
    expect(go).toMatch(/textSizeAdjust: "100%"/);
  });

  test("/go tiene versión de escritorio (≥1024 px, dos columnas) y versión móvil (una columna)", () => {
    const go = readFileSync("src/components/go/GoWizard.tsx", "utf8");
    expect(go).toMatch(/@media \(min-width: 1024px\)/);
    expect(go).toMatch(/className="gw-shell"/);
    expect(go).toMatch(/data-go-escritorio/);
    // El móvil conserva su animación compacta bajo el paso 1; el escritorio muestra la grande al costado.
    expect(go).toMatch(/className="gw-fig"/);
    expect(go).toMatch(/\.gw-fig \{ display: none; \}/);
  });

  test("«Respaldado por» CNN, Forbes y Clínica Alemana", () => {
    expect(ACTIVA_RESPALDO.medios).toEqual(["CNN", "Forbes", "Clínica Alemana"]);
    const demo = readFileSync("src/components/activa/DemoIA.tsx", "utf8");
    expect(demo).toMatch(/Forbes/);
    expect(demo).toMatch(/Clínica Alemana/);
    expect(demo).toMatch(/<CnnLogo/);
  });

  test("la animación usa datos de ejemplo: ninguna paciente real y se avisa que es ilustrativo", () => {
    expect(ACTIVA_DEMO_IA.ejemplo).toBe("Ejemplo ilustrativo");
    expect(JSON.stringify(ACTIVA_DEMO_IA)).not.toMatch(/Roc[ií]o|Sandra|Morales|Bustos|Mu[ñn]oz|Vitacura/);
  });

  test("funciones sin CAMILA ni LIA (próximamente) ni integraciones con agendas de terceros", () => {
    const copy = JSON.stringify(ACTIVA_FUNCIONES);
    expect(copy).not.toMatch(/CAMILA|\bLIA\b|Reservo|AgendaPro|Medilink|Dentalink/i);
    expect(ACTIVA_FUNCIONES.length).toBeGreaterThanOrEqual(6);
  });

  test("sin botones flotantes de demo: el único CTA es «Activa tu cuenta ahora»", () => {
    expect(readFileSync("src/components/cro/StickyMobileCTA.tsx", "utf8")).toContain('"/activa"');
    expect(readFileSync("src/components/demo/VerDemoFloat.tsx", "utf8")).toContain('"/activa"');
  });

  test("interna: noindex, Disallow en robots", () => {
    expect(page).toMatch(/index: false/);
    expect(buildRobotsTxt()).toMatch(/Disallow: \/activa/);
  });
});
