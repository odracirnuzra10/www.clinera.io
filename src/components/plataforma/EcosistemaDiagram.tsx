"use client";

import { GRAD, Mono } from "@/components/brand-v3/Brand";

/* ============================================================
   Diagrama de ecosistema para /plataforma — cada sede alimenta
   la IA (AURA) y la IA ejecuta. Misma estética que la home
   (EcosistemaIA), con clases propias plt-eco-* para no colisionar.
   ============================================================ */

const sources = [
  { n: "Agenda", s: "Horas y bloqueos", d: '<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18M8 2v4M16 2v4"/>' },
  { n: "Sedes", s: "Todas tus sucursales", d: '<path d="M3 21h18M5 21V8l7-5 7 5v13M10 21v-5h4v5"/>' },
  { n: "Fichas", s: "Historial de cada paciente", d: '<path d="M14 3v4a1 1 0 0 0 1 1h4"/><path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z"/><path d="M9 13h6M9 17h6"/>' },
  { n: "Tratamientos", s: "Precios y protocolos", d: '<path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6z"/>' },
  { n: "Ventas", s: "Qué se vende y cuánto", d: '<path d="M3 3v18h18"/><path d="M7 15l3-4 3 2 5-6"/>' },
  { n: "Pagos", s: "Cobros y conciliación", d: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>' },
  { n: "Marketing", s: "Campañas y difusiones", d: '<path d="M3 11l16-5v13L3 14z"/><path d="M11 15.5a3 3 0 0 1-5.5-1.5"/>' },
  { n: "WhatsApp", s: "Toda la conversación", d: '<path d="M21 12a8 8 0 0 1-11.5 7.2L4 21l1.8-5.5A8 8 0 1 1 21 12z"/>' },
  { n: "Consentimientos", s: "Firmados y archivados", d: '<path d="M14 3v4a1 1 0 0 0 1 1h4"/><path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z"/><path d="M9 15l1.5 1.5L14 13"/>' },
  { n: "Exámenes", s: "Resultados y controles", d: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>' },
];

const actions = [
  { n: "Agenda y reagenda", s: "Reserva y mueve horas sola", d: '<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18M8 2v4M16 2v4M9 15l2 2 4-4"/>' },
  { n: "Responde 24/7", s: "Por WhatsApp, sin descanso", d: '<path d="M21 12a8 8 0 0 1-11.5 7.2L4 21l1.8-5.5A8 8 0 1 1 21 12z"/>' },
  { n: "Cobra y recupera", s: "Confirma pagos, reactiva pacientes", d: '<path d="M12 1v22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>' },
  { n: "Automatiza", s: "Flujos que se disparan solos", d: '<path d="M13 2 3 14h8l-1 8 10-12h-8z"/>' },
];

function icon(d: string, color: string) {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: d }} />
  );
}

function srcTile(p: { n: string; s: string; d: string }) {
  return (
    <div key={p.n} style={{ display: "flex", alignItems: "center", gap: 11, background: "#fff", border: "1px solid #F0F0F0", borderRadius: 12, padding: "11px 13px", boxShadow: "0 3px 12px rgba(0,0,0,.03)" }}>
      <span style={{ width: 32, height: 32, borderRadius: 9, background: "#F6F5FF", border: "1px solid #EDE9FE", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{icon(p.d, "#7C3AED")}</span>
      <span style={{ minWidth: 0 }}>
        <span style={{ display: "block", fontFamily: "Inter", fontSize: 13.5, fontWeight: 600, color: "#0A0A0A", lineHeight: 1.2 }}>{p.n}</span>
        <span style={{ display: "block", fontFamily: "Inter", fontSize: 11.5, color: "#6B7280", marginTop: 1, lineHeight: 1.3 }}>{p.s}</span>
      </span>
    </div>
  );
}

function actTile(p: { n: string; s: string; d: string }) {
  return (
    <div key={p.n} style={{ display: "flex", alignItems: "center", gap: 11, background: "#0E1014", border: "1px solid #241F34", borderRadius: 12, padding: "13px 15px", boxShadow: "0 10px 28px -14px rgba(124,58,237,.5)" }}>
      <span style={{ width: 32, height: 32, borderRadius: 9, background: "rgba(124,58,237,.18)", border: "1px solid rgba(124,58,237,.35)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{icon(p.d, "#D8B4FE")}</span>
      <span style={{ minWidth: 0 }}>
        <span style={{ display: "block", fontFamily: "Inter", fontSize: 13.5, fontWeight: 600, color: "#fff", lineHeight: 1.2 }}>{p.n}</span>
        <span style={{ display: "block", fontFamily: "Inter", fontSize: 11.5, color: "rgba(255,255,255,.6)", marginTop: 1, lineHeight: 1.3 }}>{p.s}</span>
      </span>
    </div>
  );
}

export default function EcosistemaDiagram() {
  return (
    <>
      <div className="reveal plt-eco-grid" style={{ display: "grid", gridTemplateColumns: "1.5fr 0.85fr 1.1fr", gap: 28, alignItems: "center" }}>
        <div>
          <div style={{ marginBottom: 14 }}><Mono>Cada sede alimenta la IA</Mono></div>
          <div className="plt-eco-src" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {sources.map(srcTile)}
          </div>
        </div>
        <div className="plt-eco-core" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
          <div style={{ position: "relative", width: 128, height: 128, borderRadius: "50%", background: GRAD, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 28px 64px -14px rgba(124,58,237,.55)" }}>
            <span className="live-dot" style={{ position: "absolute", inset: -6, borderRadius: "50%", border: "2px solid rgba(124,58,237,.35)" }} />
            <span style={{ color: "#fff", fontSize: 46, fontWeight: 700, lineHeight: 1 }}>✦</span>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "Inter", fontSize: 18, fontWeight: 700, color: "#0A0A0A", letterSpacing: "-0.01em" }}>AURA</div>
            <div style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: 10.5, letterSpacing: "0.12em", textTransform: "uppercase", color: "#7C3AED", marginTop: 5 }}>Núcleo IA · una sola</div>
          </div>
        </div>
        <div>
          <div style={{ marginBottom: 14 }}><Mono>La IA ejecuta por ti</Mono></div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {actions.map(actTile)}
          </div>
        </div>
      </div>
      <style jsx>{`
        @media (max-width: 960px) {
          :global(.plt-eco-grid) { grid-template-columns: 1fr !important; gap: 32px !important; }
          :global(.plt-eco-core) { order: -1; }
        }
        @media (max-width: 520px) {
          :global(.plt-eco-src) { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
