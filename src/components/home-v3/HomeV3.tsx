"use client";

import TrialBanner from "@/components/cro/TrialBanner";
import ModosAgendamiento from "@/components/empleado-digital/ModosAgendamiento";
import {
  DarkBreak,
  Estudios,
  Faq,
  Features,
  FinalCTA,
  Hero,
  Integraciones,
  Logos,
  PrensaCNN,
  Pricing,
  Testimonios,
  useReveal,
} from "./sections";

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
      `}</style>
      <Hero />
      <TrialBanner />
      <Logos />
      <Features />
      <ModosAgendamiento />
      <Integraciones />
      <Estudios />
      <DarkBreak />
      <Testimonios />
      <PrensaCNN />
      <Pricing />
      <Faq />
      <FinalCTA />
    </>
  );
}
