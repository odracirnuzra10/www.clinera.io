"use client";

// Barra fija de /promo. Se pinta solo en el cliente: la fecha depende del día en que
// se abre la página (la reunión), y un HTML generado en el build quedaría congelado.
//
// Jerarquía (Ricardo, 21-oct-2026: «que la barra tenga más jerarquía visual»): es lo
// primero que debe leer el cliente en la reunión. Por eso va grande, con degradado de
// marca, una etiqueta «PROMO» con punto que late, y las fechas en una píldora blanca.
// El texto sigue siendo el de Ricardo: «Aprovecha nuestro descuento desde el X al Y».

import { useSyncExternalStore } from "react";
import { promoRango } from "@/components/promo/promo-rango";

const noop = () => () => {};
// Un string (no un objeto): useSyncExternalStore compara por valor y no re-renderiza en bucle.
const leer = () => {
  const r = promoRango(new Date());
  return `${r.desde}|${r.hasta}`;
};
const servidor = () => "";

export default function PromoBar() {
  const clave = useSyncExternalStore(noop, leer, servidor);
  if (!clave) return null;
  const [desde, hasta] = clave.split("|");
  return (
    <div className="promo-bar-raiz">
    <style jsx>{`
      .promo-bar.promo-bar-fantasma {
        position: static;
        visibility: hidden;
        box-shadow: none;
        pointer-events: none;
      }
      .promo-bar {
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 60;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 14px 18px;
        flex-wrap: wrap;
        padding: 18px 20px calc(18px + env(safe-area-inset-bottom));
        background: linear-gradient(90deg, #009fe3, #7c3aed 55%, #c850c0);
        color: #fff;
        font-family: "Plus Jakarta Sans", Inter, sans-serif;
        text-align: center;
        box-shadow: 0 -18px 44px -14px rgba(124, 58, 237, 0.75), 0 -2px 0 rgba(255, 255, 255, 0.35) inset;
      }
      .promo-bar-tag {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 7px 14px;
        border-radius: 999px;
        background: rgba(10, 10, 10, 0.88);
        font-family: "JetBrains Mono", ui-monospace, monospace;
        font-size: 13px;
        font-weight: 800;
        letter-spacing: 0.16em;
      }
      .promo-bar-tag i {
        width: 9px;
        height: 9px;
        border-radius: 50%;
        background: #34d399;
        animation: promo-late 1.6s ease-out infinite;
      }
      .promo-bar-texto {
        font-size: clamp(18px, 2.4vw, 30px);
        font-weight: 800;
        letter-spacing: -0.02em;
        line-height: 1.25;
      }
      .promo-bar-fechas {
        display: inline-block;
        margin-top: 2px;
        padding: 4px 16px 5px;
        border-radius: 14px;
        background: #fff;
        color: #5b21b6;
        font-weight: 800;
        box-shadow: 0 10px 24px -12px rgba(10, 10, 10, 0.55);
      }
      @keyframes promo-late {
        0% { box-shadow: 0 0 0 0 rgba(52, 211, 153, 0.7); }
        70% { box-shadow: 0 0 0 10px rgba(52, 211, 153, 0); }
        100% { box-shadow: 0 0 0 0 rgba(52, 211, 153, 0); }
      }
      @media (prefers-reduced-motion: reduce) {
        .promo-bar-tag i { animation: none; }
      }
      @media (max-width: 560px) {
        .promo-bar { gap: 8px; padding-top: 14px; }
        .promo-bar-texto { font-size: 19px; }
      }
    `}</style>
    {/* Clon invisible en flujo normal: reserva EXACTAMENTE el alto de la barra al final de la
        página (cambia con el ancho y con el salto de línea), para no tapar el pie. */}
    <div aria-hidden="true" className="promo-bar promo-bar-fantasma">
      <span className="promo-bar-tag">
        <i />
        PROMO
      </span>
      <span className="promo-bar-texto">
        Aprovecha nuestro descuento desde el{" "}
        <b className="promo-bar-fechas">
          {desde} al {hasta}
        </b>
      </span>
    </div>
    <div role="status" data-promo-bar className="promo-bar">
      <span className="promo-bar-tag">
        <i aria-hidden="true" />
        PROMO
      </span>
      <span className="promo-bar-texto">
        Aprovecha nuestro descuento desde el{" "}
        <b className="promo-bar-fechas">
          {desde} al {hasta}
        </b>
      </span>
    </div>
    </div>
  );
}
