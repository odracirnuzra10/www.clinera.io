"use client";

// /contrata: página de producto de Flux modular, con el gesto de una tienda
// (tarjeta, agregar, carrito, total). Los colores son los de Clinera.

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import UrgenciaPromo from "@/components/contrata/UrgenciaPromo";
import {
  CARRITO,
  FLUX_BASE_INCLUYE,
  ITEM_IDS,
  REGALOS,
  type Carrito,
  type ItemId,
  esRegaloNoviembre,
  preseleccion,
  regaloVigente,
  sanear,
  totalLista,
  totalPromo,
} from "@/content/carrito-flux";
import { sanitizarRef, soloTracking } from "@/content/checkout";
import { track, trackPixel } from "@/lib/tracking";
import styles from "./FluxCarrito.module.css";

const STORAGE = "contrata_carrito";
const ADICIONALES = ITEM_IDS.filter((id) => id !== "flux_base");

declare global {
  interface Window {
    clineraStripeRef?: () => string;
    dataLayer?: Record<string, unknown>[];
  }
}

function monto(usd: number): string {
  const texto = usd.toLocaleString("es-CL", {
    minimumFractionDigits: Number.isInteger(usd) ? 0 : 2,
    maximumFractionDigits: 2,
  });
  return `US$ ${texto}`;
}

function etiqueta(nombre: string): string {
  return nombre.charAt(0).toLowerCase() + nombre.slice(1);
}

/** null hasta hidratar: el servidor no decide el regalo (el reloj del build no es el del visitante). */
function useRegalo(): boolean | null {
  return useSyncExternalStore(
    (cb) => {
      const t = setInterval(cb, 60_000);
      return () => clearInterval(t);
    },
    () => regaloVigente(),
    () => null,
  );
}

export default function FluxCarrito({
  planInicial = "",
  pago = "",
  sessionId = "",
}: {
  planInicial?: string;
  pago?: string;
  sessionId?: string;
}) {
  const [carrito, setCarrito] = useState(() => sanear({}));
  const [listo, setListo] = useState(false);
  const [promoOff, setPromoOff] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");
  const debounce = useRef<number | null>(null);
  const regalo = useRegalo();

  useEffect(() => {
    let inicial: Carrito = preseleccion(planInicial);
    try {
      const raw = sessionStorage.getItem(STORAGE);
      if (raw) inicial = JSON.parse(raw) as Carrito;
    } catch {
      inicial = preseleccion(planInicial);
    }
    setCarrito(sanear(inicial));
    setListo(true);
  }, [planInicial]);

  useEffect(() => {
    if (!listo) return;
    try {
      sessionStorage.setItem(STORAGE, JSON.stringify(carrito));
    } catch {
      /* el carrito sigue en memoria */
    }
  }, [carrito, listo]);

  if (pago === "ok") return <Exito sessionId={sessionId} />;

  const lista = totalLista(carrito);
  const promo = totalPromo(carrito);
  const hoy = promoOff ? lista : promo;
  const unidades = ITEM_IDS.reduce((n, id) => n + carrito[id], 0);
  const ahorro = Math.round((lista - promo) * 100) / 100;

  function emitir(id: ItemId, accion: "agregar" | "quitar", qty: number, next: ReturnType<typeof sanear>) {
    if (debounce.current) window.clearTimeout(debounce.current);
    debounce.current = window.setTimeout(() => {
      try {
        track("carrito_addon", {
          item_id: id,
          accion,
          quantity: qty,
          total_lista: totalLista(next),
          total_promo: totalPromo(next),
        });
      } catch (e) {
        console.error("[contrata] addon", e);
      }
    }, 300);
  }

  function fijar(id: ItemId, delta: number, accion: "agregar" | "quitar") {
    setCarrito((prev) => {
      const next = sanear({ ...prev, [id]: prev[id] + delta });
      emitir(id, accion, next[id], next);
      return next;
    });
  }

  async function pagar() {
    if (enviando) return;
    setEnviando(true);
    setError("");
    const limpio = sanear(carrito);
    const value = promoOff ? totalLista(limpio) : totalPromo(limpio);
    try {
      const search = window.location.search;
      const ref = window.clineraStripeRef?.() || sanitizarRef(new URLSearchParams(search).get("gclid") || "");
      const utm = Object.fromEntries(soloTracking(search));
      try {
        track("initiate_checkout", {
          plan: "flux_modular",
          content_name: "Clinera Flux modular",
          value,
          value_lista: totalLista(limpio),
          currency: "USD",
          items: ITEM_IDS.filter((id) => limpio[id] > 0).map((id) => ({
            item_id: id,
            quantity: limpio[id],
            price: CARRITO[id].usd,
          })),
          promo: promoOff ? "none" : "CLINERA50X3",
          regalo,
        });
        trackPixel("InitiateCheckout", {
          value,
          currency: "USD",
          content_name: "Clinera Flux modular",
          contents: ITEM_IDS.filter((id) => limpio[id] > 0).map((id) => ({ id, quantity: limpio[id] })),
        });
      } catch (e) {
        console.error("[contrata] checkout", e);
      }
      const res = await fetch("/api/contrata/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ carrito: limpio, clientRef: ref, utm }),
      });
      const json = (await res.json()) as { ok?: boolean; url?: string; promo?: boolean };
      if (json.promo === false) setPromoOff(true);
      if (json.ok && json.url && json.promo !== false) {
        window.location.assign(json.url);
        return;
      }
      setError("El pago en línea no está disponible todavía. Agenda una reunión y lo activamos contigo.");
    } catch (e) {
      console.error("[contrata] checkout", e);
      setError("El pago en línea no está disponible todavía. Agenda una reunión y lo activamos contigo.");
    } finally {
      setEnviando(false);
    }
  }

  const search = useSyncExternalStore(
    () => () => {},
    () => window.location.search,
    () => "",
  );
  const agenda = `/agenda${search}`;

  return (
    <div className={styles.pagina} data-carrito>
      <header className={styles.barra}>
        <a className={styles.marca} href="/">clinera</a>
        <button
          type="button"
          className={styles.bolsa}
          data-carrito-icon
          aria-label={`Tu carrito, ${unidades} ítems`}
          onClick={() => document.getElementById("tu-carrito")?.scrollIntoView({ behavior: "smooth", block: "start" })}
        >
          <Bolsa />
          <span className={styles.badge} data-carrito-count>{unidades}</span>
        </button>
      </header>

      {!promoOff ? <UrgenciaPromo className={styles.urgencia} /> : null}

      <div className={styles.grid}>
        <div className={styles.tienda}>
          <p className={styles.heroMl}>
            Activa la IA de tu clínica como cuando compras en Mercado Libre: elige qué funciones quieres y comienza.
          </p>
          <h1 className={styles.h1}>Crece a tu medida</h1>
          <p className={styles.bajada}>Parte con Flux por US$ 29/mes y suma solo lo que necesitas.</p>

          <article className={styles.card} data-flux-base>
            <div className={styles.cardTop}>
              <div>
                <p className={styles.kicker}>En tu carrito</p>
                <h2 className={styles.cardTitulo}>Clinera Flux</h2>
                <p className={styles.cardSub}>La base de tu clínica. Siempre va en el pedido.</p>
              </div>
              <Precio usd={29} promo={!promoOff} />
            </div>
            <ul className={styles.incluye}>
              {FLUX_BASE_INCLUYE.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <section data-adicionales>
            <h2 className={styles.seccion}>Adicionales</h2>
            <p className={styles.seccionSub}>Elige tus adicionales</p>
            <div className={styles.cards}>
              {ADICIONALES.filter((id) => !esRegaloNoviembre(id) || regalo === false).map((id) => (
                <Addon
                  key={id}
                  id={id}
                  qty={carrito[id]}
                  promo={!promoOff}
                  onAdd={() => fijar(id, 1, "agregar")}
                  onSub={() => fijar(id, -1, "quitar")}
                />
              ))}
            </div>
          </section>

          {regalo ? (
            <section className={styles.regalo} data-regalo>
              <h2 className={styles.cardTitulo}>Regalo de noviembre</h2>
              <ul className={styles.incluye}>
                {REGALOS.map((r) => (
                  <li key={r.id}>{r.nombre}</li>
                ))}
              </ul>
            </section>
          ) : null}

          <section className={styles.faq}>
            <h2 className={styles.seccion}>Preguntas</h2>
            <details>
              <summary>¿Hay permanencia?</summary>
              <p>No. Cancelas cuando quieras y el mes en curso sigue activo hasta que termina.</p>
            </details>
            {!promoOff ? (
              <details>
                <summary>¿Cómo se aplica el 50%?</summary>
                <p>Los 3 primeros meses pagas la mitad de todo el carrito. Desde el mes 4 rige el precio de lista.</p>
              </details>
            ) : null}
          </section>
        </div>

        <aside className={styles.resumen} id="tu-carrito" data-resumen>
          <h2 className={styles.resumenTitulo}>Tu carrito</h2>
          <ul className={styles.lineas}>
            <li>
              <span>Clinera Flux</span>
              <span>{monto(29)}</span>
            </li>
            {ADICIONALES.filter((id) => carrito[id] > 0).map((id) => (
              <li key={id}>
                <span>
                  {CARRITO[id].nombre}
                  {carrito[id] > 1 ? ` × ${carrito[id]}` : ""}
                </span>
                <span>{monto(CARRITO[id].usd * carrito[id])}</span>
              </li>
            ))}
            {regalo ? (
              <li>
                <span>Regalo de noviembre</span>
                <span>US$ 0</span>
              </li>
            ) : null}
          </ul>
          <div className={styles.totales}>
            <p>
              <span>Subtotal</span>
              <span className={styles.num}>{monto(lista)}</span>
            </p>
            {!promoOff ? (
              <p className={styles.descuento}>
                <span>Descuento 50%</span>
                <span className={styles.num}>−{monto(ahorro)}</span>
              </p>
            ) : null}
            <p className={styles.hoy}>
              <span>Total hoy</span>
              <span className={styles.num} data-total-hoy>
                {monto(hoy)}
                {!promoOff ? <s>{monto(lista)}</s> : null}
              </span>
            </p>
            {!promoOff ? <p className={styles.luego}>Luego {monto(lista)}/mes</p> : <p className={styles.luego}>{monto(lista)}/mes</p>}
          </div>
          {!promoOff ? <p className={styles.urgenciaChica}><UrgenciaPromo /></p> : null}
          <ul className={styles.confianza}>
            <li>Pago seguro con Stripe</li>
            <li>Cancela cuando quieras</li>
            <li>Activación inmediata</li>
          </ul>
          {error ? <p className={styles.error} role="alert" data-pago-error>{error}</p> : null}
          <div className={styles.accion}>
            <p className={styles.hoyMovil}>
              <span>Total hoy</span>
              <span className={styles.num}>
                {monto(hoy)}
                {!promoOff ? <s>{monto(lista)}</s> : null}
              </span>
            </p>
            <button
              type="button"
              className={styles.cta}
              data-cta="carrito-checkout"
              data-plan="flux_modular"
              data-plan-value={String(hoy)}
              data-plan-lista={String(lista)}
              data-promo={promoOff ? "no" : "si"}
              disabled={enviando}
              onClick={pagar}
            >
              {enviando ? "Abriendo pago…" : "Comienza ya"}
            </button>
            <a className={styles.secundario} href={agenda} data-cta="agendar-reunion">Agendar reunión</a>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Precio({ usd, promo }: { usd: number; promo: boolean }) {
  const mitad = Math.round(usd * 50) / 100;
  return (
    <p className={styles.precio}>
      {promo ? <s>{monto(usd)}</s> : null}
      <b>{promo ? monto(mitad) : monto(usd)}</b>
      <span>/mes</span>
    </p>
  );
}

function Addon({
  id,
  qty,
  promo,
  onAdd,
  onSub,
}: {
  id: ItemId;
  qty: number;
  promo: boolean;
  onAdd: () => void;
  onSub: () => void;
}) {
  const spec = CARRITO[id];
  const nombre = etiqueta(spec.nombre);
  const enCarrito = qty > 0;
  return (
    <article className={`${styles.card} ${enCarrito ? styles.cardOn : ""}`} data-addon={id}>
      <div className={styles.cardTop}>
        <div>
          <h3 className={styles.cardTitulo}>{spec.nombre}</h3>
          {id === "agente_ia" ? <p className={styles.cardSub}>Incluye 7.000 créditos de IA</p> : null}
          {id === "conversaciones_1000" ? <p className={styles.cardSub}>Cada pack suma 1.000 conversaciones al mes</p> : null}
        </div>
        <Precio usd={spec.usd} promo={promo} />
      </div>
      {enCarrito ? (
        <div className={styles.stepper}>
          <button type="button" aria-label={`Quitar ${nombre}`} onClick={onSub} disabled={qty <= spec.min}>−</button>
          <output aria-live="polite">{qty}</output>
          <button type="button" aria-label={`Sumar ${nombre}`} onClick={onAdd} disabled={qty >= spec.max}>+</button>
        </div>
      ) : (
        <button type="button" className={styles.agregar} onClick={onAdd}>
          Agregar al carrito
        </button>
      )}
    </article>
  );
}

function Bolsa() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path fill="none" stroke="currentColor" strokeWidth="1.8" d="M6.5 8h11l-.8 12h-9.4L6.5 8z" />
      <path fill="none" stroke="currentColor" strokeWidth="1.8" d="M9 8V7a3 3 0 0 1 6 0v1" />
    </svg>
  );
}

function Exito({ sessionId }: { sessionId: string }) {
  const [regalo, setRegalo] = useState("");
  useEffect(() => {
    if (!sessionId) return;
    let vivo = true;
    (async () => {
      try {
        const res = await fetch(`/api/contrata/session?session_id=${encodeURIComponent(sessionId)}`);
        const json = (await res.json()) as { ok?: boolean; lista_usd?: string; regalo?: string; email?: string };
        if (!vivo || !json.ok) return;
        setRegalo(json.regalo || "");
        const value = Number(json.lista_usd);
        try {
          track("purchase", {
            transaction_id: sessionId,
            value: Number.isFinite(value) ? value : undefined,
            currency: "USD",
            plan: "flux_modular",
          });
          trackPixel(
            "Purchase",
            { value: Number.isFinite(value) ? value : 0, currency: "USD", content_name: "Clinera Flux modular" },
            `purchase_${sessionId}`,
          );
        } catch (e) {
          console.error("[contrata] purchase", e);
        }
      } catch {
        /* la confirmación se muestra igual */
      }
    })();
    return () => {
      vivo = false;
    };
  }, [sessionId]);

  return (
    <div className={styles.pagina} data-carrito data-pago="ok">
      <div className={styles.exito}>
        <p className={styles.kicker}>Listo</p>
        <h1 className={styles.h1}>Listo, revisa tu correo</h1>
        <p className={styles.bajada}>Stripe te manda el recibo y activamos Flux en tu clínica.</p>
        {regalo ? <p className={styles.regaloKicker}>Regalo de noviembre incluido: {regalo.split("_").join(" ")}</p> : null}
        <a className={styles.cta} href="/">Volver a Clinera</a>
      </div>
    </div>
  );
}
