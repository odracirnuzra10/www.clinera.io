"use client";

import DemoEnVivo from "./DemoEnVivo";
import ClinicasLogos from "@/components/clinicas/ClinicasLogos";
import PlanesVigentes from "@/components/pricing/PlanesVigentes";
import PmfcSection from "@/components/pmfc/PmfcSection";
import { Faq, FinalCTA, Hero, Testimonios, useReveal } from "./sections";

export default function HomeV3() {
  useReveal();
  return (
    <>
      <style jsx global>{`
        .reveal {
          opacity: 0;
          transform: translateY(12px);
          transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1),
            transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .reveal.in {
          opacity: 1;
          transform: none;
        }
        @keyframes pulseDot {
          0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.45); }
          70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
          100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }
        .live-dot { animation: pulseDot 2.2s infinite; }
        @keyframes waGlow {
          0%, 100% { box-shadow: 0 20px 48px rgba(15,10,30,.18), 0 0 0 0 rgba(37,211,102,.5); }
          50% { box-shadow: 0 20px 48px rgba(15,10,30,.18), 0 0 22px 3px rgba(37,211,102,.9); }
        }
        .wa-glow { animation: waGlow 1.6s ease-in-out infinite; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: none; }
        }
        .msg-in { animation: fadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both; }
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0ms !important;
            transition-duration: 0ms !important;
          }
        }
        /* Responsive side padding: 80px desktop → 32px mobile */
        @media (max-width: 720px) {
          main > section { padding-left: 32px !important; padding-right: 32px !important; }
        }
        /* Aire entre secciones (Ricardo, 18-oct-2026: «más aire, más limpio»). */
        main > :is(section, div) + :is(section, div) { margin-top: clamp(40px, 7vw, 104px); }
      `}</style>
      {/* Home corto (Ricardo, 20-oct-2026: «el home es muy largo, elimina lo
          redundante; preponderancia a Vortex y Ecosistema»). Las dos opciones van
          justo después del hero. Salieron Marketing de performance (vive en
          /ecosistema), la sección estética (vive en /funciones), la banda «Activa
          tu ecosistema» y CNN (vive en /plataforma y /prensa). */}
      <Hero />
      <ClinicasLogos />
      <PlanesVigentes titulo="Dos formas de trabajar" tituloAcento="con Clinera." bajada="Vortex es el software con IA para tu clínica. El Ecosistema es Vortex más un equipo de marketing que te trae pacientes." />
      <PmfcSection />
      <DemoEnVivo />
      <Testimonios />
      <Faq />
      <FinalCTA />
    </>
  );
}
