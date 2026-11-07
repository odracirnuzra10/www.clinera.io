// Ricardo, 7-nov-2026: en el home, las cifras (+1.500 · 3 sedes · Prepago) y la franja de logos se reemplazan por
// lo mismo que muestra /prueba-gratis: las tres tarjetas «IA · Redes sociales · Agenda por profesional» y la caja
// cuadrada de logos que se mueven en 3 filas, con «El sistema que ocupan las grandes redes de clínicas del país».
import { MARCAS_FILAS } from "@/content/marcas-filas";
import s from "./IncluyeYMarcas.module.css";

function Spark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={s.ic}>
      <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8Z" />
      <path d="M19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8Z" />
    </svg>
  );
}
function Cal() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={s.ic}>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
      <path d="M3.5 10h17M8 3v4M16 3v4" />
    </svg>
  );
}
function Redes() {
  return (
    <>
      <svg viewBox="0 0 24 24" aria-hidden="true" className={s.ch}><path fill="#25D366" d="M12 2C6.5 2 2 6.3 2 11.6c0 1.9.5 3.7 1.5 5.3L2 22l5.3-1.4c1.5.8 3.2 1.3 4.7 1.3 5.5 0 10-4.3 10-9.6S17.5 2 12 2zm5.7 13.6c-.2.7-1.2 1.2-1.9 1.4-.5.1-1.1.2-3.6-.8-3.1-1.3-5.1-4.5-5.2-4.7-.2-.2-1.3-1.7-1.3-3.3s.8-2.3 1.1-2.6c.3-.3.6-.4.8-.4h.6c.2 0 .4 0 .6.5.2.6.8 2 .8 2.1.1.2.1.3 0 .5-.1.2-.2.3-.3.5-.2.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.2 1.4 2.5 1.5.3.1.5.1.7-.1.2-.2.7-.8.9-1.1.2-.3.4-.2.7-.1.3.1 1.9.9 2.2 1.1.3.1.5.2.6.3.1.2.1.8-.1 1.5z" /></svg>
      <svg viewBox="0 0 24 24" aria-hidden="true" className={s.ch}><defs><linearGradient id="incluye-ig" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stopColor="#FEDA75" /><stop offset=".45" stopColor="#D62976" /><stop offset="1" stopColor="#4F5BD5" /></linearGradient></defs><rect x="2.5" y="2.5" width="19" height="19" rx="5.5" fill="none" stroke="url(#incluye-ig)" strokeWidth="2.2" /><circle cx="12" cy="12" r="4.2" fill="none" stroke="url(#incluye-ig)" strokeWidth="2.2" /><circle cx="17.3" cy="6.7" r="1.3" fill="#D62976" /></svg>
      <svg viewBox="0 0 24 24" aria-hidden="true" className={s.ch}><circle cx="12" cy="12" r="11" fill="#1877F2" /><path fill="#fff" d="M13.4 21v-7.6h2.5l.4-3h-2.9V8.5c0-.9.3-1.4 1.5-1.4h1.5V4.4c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2.1H8v3h2.5V21z" /></svg>
    </>
  );
}

const ITEMS = [
  { id: "ia", icono: <Spark />, titulo: "IA", texto: "responde, agenda y cobra la evaluación por ti", redes: false },
  { id: "redes", icono: <Redes />, titulo: "Redes sociales", texto: "WhatsApp, Instagram y Facebook en un solo lugar", redes: true },
  { id: "agenda", icono: <Cal />, titulo: "Agenda por profesional", texto: "cada profesional con sus horarios y tratamientos", redes: false },
];

export function IncluyeClinera() {
  return (
    <section className={s.incluye} aria-label="Qué incluye Clinera" data-home2="incluye">
      {ITEMS.map((it) => (
        <div key={it.id} className={s.item} data-home2-incluye={it.id}>
          <span className={it.redes ? `${s.icono} ${s.iconoRedes}` : s.icono}>{it.icono}</span>
          <b>{it.titulo}</b>
          <span className={s.texto}>{it.texto}</span>
        </div>
      ))}
    </section>
  );
}

export function MarcasCaja() {
  return (
    <section className={s.marcas} data-home2="marcas" aria-label="Usado por clínicas líderes en Chile y LATAM">
      <div className={s.marcasCopy}>
        <p className={s.eyebrow}>Usado por clínicas líderes en Chile y LATAM</p>
        <h2>El sistema que ocupan las grandes redes de clínicas del país</h2>
      </div>
      <div className={s.caja}>
        {MARCAS_FILAS.map((f, i) => (
          <div key={i} className={s.mask}>
            <div className={`${s.pista} ${f.clase === "vuelta" ? s.vuelta : f.clase === "lenta" ? s.lenta : ""}`}>
              <ul dangerouslySetInnerHTML={{ __html: f.html }} />
              <ul aria-hidden="true" dangerouslySetInnerHTML={{ __html: f.html.replace(/ alt="[^"]*"/g, ' alt=""').replace(/ role="img" aria-label="[^"]*"/g, "") }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
