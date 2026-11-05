"use client";

// /contrata: ficha de producto al estilo de una tienda (Mercado Libre), con los
// colores de Clinera. Flux se agrega al carrito. Activar, dentro del carrito,
// abre el pago. El correo lo pide Stripe; si la URL trae uno válido, viaja en el POST.

import { Outfit } from "next/font/google";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

const outfit = Outfit({
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-outfit",
  display: "swap",
});
import UrgenciaPromo from "@/components/contrata/UrgenciaPromo";
import {
  ASISTENCIA_LABEL,
  ASISTENCIA_WHATSAPP,
  CARRITO,
  FLUX_BASE_INCLUYE,
  ITEM_IDS,
  REGALOS,
  type Carrito,
  type ItemId,
  PROMO_PCT,
  carritoDesdeQuery,
  esRegaloNoviembre,
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

const TEXTO: Record<Exclude<ItemId, "flux_base">, string> = {
  profesional_extra: "Otro profesional en la agenda de tu clínica.",
  sucursal_extra: "Otra sucursal con su propia agenda.",
  conversaciones_1000: "Cada pack suma 1.000 conversaciones al mes.",
  instagram: "Los mensajes de Instagram llegan a tu agenda.",
  facebook: "Los mensajes de Facebook llegan a tu agenda.",
  agente_ia: "Incluye 7.000 créditos de IA. Atiende por ti.",
  email_marketing: "Correos a tus pacientes desde Clinera.",
  automatizaciones: "Avisos y tareas que se disparan solas.",
  onboarding_humano: "Una persona te deja la clínica andando. Se cobra una sola vez.",
};

declare global {
  interface Window {
    clineraStripeRef?: () => string;
  }
}

type Cantidades = Record<ItemId, number>;

/**
 * El carrito de la pantalla puede traer Flux en 0: el visitante lo agrega.
 * `sanear()` (el checkout) sigue forzando la base en 1. Acá solo se recortan
 * los adicionales y se apagan los regalos de noviembre.
 */
function vista(c: Carrito, now = new Date()): Cantidades {
  const clamped = sanear({ ...c, flux_base: 1 }, now);
  const raw = c.flux_base;
  const n = typeof raw === "number" && Number.isFinite(raw) ? Math.trunc(raw) : 0;
  clamped.flux_base = n >= 1 ? 1 : 0;
  return clamped;
}

function redondear(n: number): number {
  return Math.round(n * 100) / 100;
}

/** Totales de lo que se ve. No usa `sanear()`: ahí Flux vacío pasaría a 1. */
function desglose(c: Cantidades): { mensual: number; unico: number; lista: number; promo: number } {
  let mensual = 0;
  let unico = 0;
  for (const id of ITEM_IDS) {
    const usd = CARRITO[id].usd * c[id];
    if (CARRITO[id].cobro === "unico") unico += usd;
    else mensual += usd;
  }
  mensual = redondear(mensual);
  unico = redondear(unico);
  const promoMes = Math.round(mensual * (100 - PROMO_PCT)) / 100;
  return { mensual, unico, lista: redondear(mensual + unico), promo: redondear(promoMes + unico) };
}

function precioLinea(id: ItemId, qty: number, promo: boolean): number {
  const bruto = CARRITO[id].usd * qty;
  if (!promo || CARRITO[id].cobro === "unico") return redondear(bruto);
  return Math.round(bruto * (100 - PROMO_PCT)) / 100;
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
  query = "",
  pago = "",
  sessionId = "",
}: {
  /** Query de esta visita, sin el `?`. La arma el servidor para que un link de AURA no dependa del reloj del efecto. */
  query?: string;
  pago?: string;
  sessionId?: string;
}) {
  const [carrito, setCarrito] = useState(() => vista({}));
  const [listo, setListo] = useState(false);
  const [promoOff, setPromoOff] = useState(false);
  const [emailPrefill, setEmailPrefill] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");
  const [aviso, setAviso] = useState("");
  const [abierto, setAbierto] = useState(false);
  const debounce = useRef<number | null>(null);
  const foco = useRef<ItemId | null>(null);
  const regalo = useRegalo();
  useEffect(() => {
    // La query (?plan= y pe, ig, fb…) es la intención de esta visita y gana
    // al carrito guardado. Sin eso, vuelve lo de sessionStorage (?pago=cancelado).
    const desde = carritoDesdeQuery(query);
    let inicial: Carrito = {};
    if (desde.aplica) {
      inicial = desde.carrito;
    } else {
      try {
        const raw = sessionStorage.getItem(STORAGE);
        if (raw) inicial = JSON.parse(raw) as Carrito;
      } catch {
        inicial = {};
      }
    }
    setEmailPrefill(desde.email);
    setCarrito(vista(inicial));
    setListo(true);
  }, [query]);

  useEffect(() => {
    if (!listo) return;
    try {
      sessionStorage.setItem(STORAGE, JSON.stringify(carrito));
    } catch {
      /* el carrito sigue en memoria */
    }
  }, [carrito, listo]);

  useEffect(() => {
    const id = foco.current;
    if (!id) return;
    foco.current = null;
    const root = document.querySelector(id === "flux_base" ? "[data-flux-base]" : `[data-addon="${id}"]`);
    const buscar = CARRITO[id].max > 1 ? "Sumar" : "Quitar";
    const boton = root?.querySelector(`button[aria-label^="${buscar}"]`);
    if (boton instanceof HTMLElement) boton.focus();
  }, [carrito]);

  useEffect(() => {
    if (!aviso) return;
    const t = window.setTimeout(() => setAviso(""), 2400);
    return () => window.clearTimeout(t);
  }, [aviso]);

  const [salida, setSalida] = useState(false);
  const salirRef = useRef({ flux: false, pagar: () => {}, agregar: () => {} });
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("pago") === "ok") return;
    let armado = false;
    const t = window.setTimeout(() => { armado = true; }, 4000);
    const visto = () => {
      try { return sessionStorage.getItem("clinera_oferta_salida") === "1"; } catch { return true; }
    };
    const abrir = () => {
      if (!armado || visto()) return;
      try { sessionStorage.setItem("clinera_oferta_salida", "1"); } catch { /* la sesión igual sigue */ }
      setSalida(true);
    };
    const onOut = (e: MouseEvent) => {
      if (e.clientY > 8 || e.relatedTarget) return;
      abrir();
    };
    let oculto = false;
    const onVis = () => {
      if (document.visibilityState === "hidden") { oculto = true; return; }
      if (oculto) { oculto = false; abrir(); }
    };
    document.addEventListener("mouseout", onOut);
    document.addEventListener("visibilitychange", onVis);
    let onBack: (() => void) | null = null;
    if (window.matchMedia("(max-width: 800px)").matches) {
      history.pushState({ clineraSalida: 1 }, "");
      onBack = () => {
        if (visto()) return;
        abrir();
        history.pushState({ clineraSalida: 1 }, "");
      };
      window.addEventListener("popstate", onBack);
    }
    return () => {
      window.clearTimeout(t);
      document.removeEventListener("mouseout", onOut);
      document.removeEventListener("visibilitychange", onVis);
      if (onBack) window.removeEventListener("popstate", onBack);
    };
  }, []);

  useEffect(() => {
    if (!abierto) return;
    const previo = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAbierto(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previo;
      window.removeEventListener("keydown", onKey);
    };
  }, [abierto]);

  if (pago === "ok") return <Exito sessionId={sessionId} />;

  salirRef.current = {
    flux: carrito.flux_base > 0,
    pagar: () => { void pagar(); },
    agregar: () => fijar("flux_base", 1),
  };

  const partes = desglose(carrito);
  const lista = partes.lista;
  const hoy = promoOff ? lista : partes.promo;
  const unidades = ITEM_IDS.reduce((n, id) => n + carrito[id], 0);
  const fluxEnCarrito = carrito.flux_base >= 1;

  function emitir(id: ItemId, accion: "agregar" | "quitar", qty: number, next: Cantidades) {
    if (debounce.current) window.clearTimeout(debounce.current);
    debounce.current = window.setTimeout(() => {
      try {
        const partes = desglose(next);
        track("carrito_addon", {
          item_id: id,
          accion,
          quantity: qty,
          total_lista: partes.lista,
          total_promo: partes.promo,
        });
      } catch (e) {
        console.error("[contrata] addon", e);
      }
    }, 300);
  }

  function fijar(id: ItemId, delta: number) {
    if (id !== "flux_base" && delta > 0 && carrito.flux_base < 1) return;
    if (delta > 0) {
      foco.current = id;
      setAviso("Agregado al carrito");
    }
    setCarrito((prev) => {
      if (id !== "flux_base" && delta > 0 && prev.flux_base < 1) return prev;
      const base = { ...prev, [id]: prev[id] + delta };
      if (id === "flux_base" && base.flux_base < 1) {
        for (const k of ITEM_IDS) {
          if (k !== "flux_base") base[k] = 0;
        }
      }
      const next = vista(base);
      emitir(id, delta > 0 ? "agregar" : "quitar", next[id], next);
      return next;
    });
  }

  async function pagar() {
    if (enviando) return;
    if (carrito.flux_base < 1) {
      setAbierto(true);
      setError("Agrega Clinera Flux para activar tu clínica.");
      return;
    }
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
        body: JSON.stringify({
          carrito: limpio,
          clientRef: ref,
          utm,
          ...(emailPrefill ? { email: emailPrefill } : {}),
        }),
      });
      const json = (await res.json()) as { ok?: boolean; url?: string; promo?: boolean };
      if (json.promo === false) setPromoOff(true);
      if (json.ok && json.url) {
        window.location.assign(json.url);
        return;
      }
      setAbierto(true);
      setError("Pago online pronto — agenda con ventas");
    } catch (e) {
      console.error("[contrata] checkout", e);
      setAbierto(true);
      setError("Pago online pronto — agenda con ventas");
    } finally {
      setEnviando(false);
    }
  }

  const pulso = aviso ? styles.badgePulso : "";
  const lineas = ITEM_IDS.filter((id) => carrito[id] > 0);

  return (
    <div className={`${styles.pagina} ${outfit.variable}`} data-carrito>
      <header className={styles.barra}>
        <a className={styles.marca} href="/">clinera</a>
        <div className={styles.acciones}>
          <a
            className={styles.asistencia}
            href={ASISTENCIA_WHATSAPP}
            target="_blank"
            rel="noopener noreferrer"
            data-cta="asistencia"
          >
            {ASISTENCIA_LABEL}
          </a>
        <button
          type="button"
          className={styles.bolsa}
          data-carrito-icon
          aria-expanded={abierto}
          aria-controls="tu-carrito"
          aria-label={`Tu carrito, ${unidades} ítems`}
          onClick={() => setAbierto((v) => !v)}
        >
          <Bolsa />
          {unidades > 0 ? <span className={`${styles.badge} ${pulso}`} data-carrito-count>{unidades}</span> : null}
        </button>
        </div>
      </header>
      {aviso ? (
        <div className={styles.toast} role="status" data-toast>
          {aviso}
        </div>
      ) : null}

      {!promoOff ? <UrgenciaPromo className={styles.urgencia} /> : null}

      <div className={styles.grid}>
        <p className={styles.frase}>Haz que sea tu clínica</p>
        <p className={styles.heroMl}>
          Hacer crecer tu clínica es como comprar en Mercado Libre: elige qué funciones quieres, agrégalas al carrito y comienza.
        </p>
        <h1 className={styles.h1}>Activa tu clínica</h1>
        {!promoOff ? (
          <p className={styles.ofertaHero}>Activa Flux a {monto(14.5)}/mes por 3 meses. Después, {monto(29)}/mes.</p>
        ) : null}

        <article className={styles.producto} data-flux-base>
          <div className={styles.foto}>
            <Foto id="flux_base" />
          </div>
          <div className={styles.productoCompra}>
            <h2 className={styles.cardTitulo}>Clinera Flux</h2>
            <p className={styles.cardSub}>Configura tu clínica y agrégala al carrito.</p>
            <Precio usd={29} promo={!promoOff} />
            {fluxEnCarrito ? (
              <button type="button" className={styles.quitar} aria-label="Quitar Clinera Flux" onClick={() => fijar("flux_base", -1)}>
                Quitar
              </button>
            ) : (
              <button type="button" className={styles.agregar} aria-label="Agregar al carrito: Clinera Flux" onClick={() => fijar("flux_base", 1)}>
                {promoOff ? "Agregar al carrito" : `Activa Flux a ${monto(14.5)}/mes`}
              </button>
            )}
          </div>
          <ul className={styles.incluye}>
            {FLUX_BASE_INCLUYE.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <ul className={styles.confianza}>
            <li>Pago seguro con Stripe</li>
            <li>Cancela cuando quieras</li>
            <li>Activación rápida</li>
          </ul>
        </article>

        <section data-adicionales>
          <h2 className={styles.seccion}>También puedes agregar</h2>
          <p className={styles.seccionSub}>Depende de ti elegir lo adicional</p>
          <div className={styles.cards}>
            {ADICIONALES.filter((id) => !esRegaloNoviembre(id) || regalo === false).map((id) => (
              <Addon
                key={id}
                id={id}
                qty={carrito[id]}
                promo={!promoOff}
                bloqueado={!fluxEnCarrito}
                onAdd={() => fijar(id, 1)}
                onSub={() => fijar(id, -1)}
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
              <p>Los 3 primeros meses pagas la mitad de lo mensual. El onboarding humano, si lo agregas, se cobra una sola vez y entero. Desde el mes 4 lo mensual vuelve al precio de lista.</p>
            </details>
          ) : null}
        </section>
      </div>

      <div className={styles.barraMovil} hidden={abierto} data-testid="mobile-cta">
        {fluxEnCarrito ? (
          <>
            <p className={styles.hoyMovil}>
              <span>Hoy pagas</span>
              <span className={styles.num}>{monto(hoy)}</span>
            </p>
            <Checkout
              hoy={hoy}
              lista={lista}
              promoOff={promoOff}
              enviando={enviando}
              listo={fluxEnCarrito}
              onClick={pagar}
            />
          </>
        ) : (
          <button type="button" className={styles.cta} onClick={() => fijar("flux_base", 1)}>
            Clinera Flux · {monto(promoOff ? 29 : 14.5)} → Agregar
          </button>
        )}
      </div>

      {abierto ? (
        <button type="button" className={styles.cortina} aria-label="Cerrar carrito" onClick={() => setAbierto(false)} />
      ) : null}
      <aside
        id="tu-carrito"
        className={styles.drawer}
        data-drawer
        hidden={!abierto}
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-carrito"
      >
        <div className={styles.drawerCabeza}>
          <div>
            <p className={styles.estado}><span className={styles.chk} aria-hidden="true">✓</span> Tu clínica</p>
            <h2 id="titulo-carrito" className={styles.resumenTitulo}>
              Tu clínica está<br />a punto de crecer
            </h2>
          </div>
          <button type="button" className={styles.cerrar} aria-label="Cerrar" onClick={() => setAbierto(false)}>
            ×
          </button>
        </div>
        <div className={styles.drawerCuerpo}>
          {lineas.length === 0 ? (
            <p className={styles.vacio}>Tu carrito está vacío. Agrega Clinera Flux para armar tu clínica.</p>
          ) : (
            <ul className={styles.lineas}>
              {lineas.map((id) => (
                <li key={id}>
                  <span>
                    <i className={styles.chk} aria-hidden="true">✓</i>
                    {CARRITO[id].nombre}
                    {CARRITO[id].cobro === "unico" ? " · cobro único" : ""}
                    {carrito[id] > 1 ? ` × ${carrito[id]}` : ""}
                  </span>
                  <span className={styles.num}>{monto(precioLinea(id, carrito[id], !promoOff))}</span>
                  {id === "flux_base" || id === "onboarding_humano" ? (
                    <button type="button" className={styles.quitarLinea} aria-label={`Quitar ${CARRITO[id].nombre}`} onClick={() => fijar(id, -1)}>
                      Quitar
                    </button>
                  ) : (
                    <Stepper id={id} qty={carrito[id]} donde="drawer" onAdd={() => fijar(id, 1)} onSub={() => fijar(id, -1)} />
                  )}
                </li>
              ))}
            </ul>
          )}
          {regalo ? (
            <p className={styles.regaloLinea}>
              <span>Regalo de noviembre</span>
              <span>US$ 0</span>
            </p>
          ) : null}
          <div className={styles.totales}>
            <p className={styles.hoy}>
              <span>Hoy pagas</span>
              <span className={styles.num} data-total-hoy>{monto(hoy)}</span>
            </p>
            {partes.unico > 0 ? (
              <p className={styles.luego}>
                {monto(promoOff ? partes.mensual : Math.round(partes.mensual * (100 - PROMO_PCT)) / 100)} mensual + {monto(partes.unico)} de onboarding
              </p>
            ) : null}
            {!promoOff && partes.mensual > 0 ? <p className={styles.luego}>50% por 3 meses</p> : null}
            {!promoOff && partes.mensual > 0 ? <p className={styles.luego}>Luego {monto(partes.mensual)}/mes</p> : null}
          </div>
          {!promoOff ? <div className={styles.urgenciaChica}><UrgenciaPromo /></div> : null}
          {error ? <p className={styles.error} role="alert" data-pago-error>{error}</p> : null}
        </div>
        <div className={styles.drawerPie}>
          <p className={styles.apuro}>No pierdas más tu tiempo</p>
          <Checkout
            hoy={hoy}
            lista={lista}
            promoOff={promoOff}
            enviando={enviando}
            listo={fluxEnCarrito}
            onClick={pagar}
          />
          <a
            className={styles.asistenciaBtn}
            href={ASISTENCIA_WHATSAPP}
            target="_blank"
            rel="noopener noreferrer"
            data-cta="asistencia"
          >
            {ASISTENCIA_LABEL}
          </a>
        </div>
      </aside>
      {salida ? (
        <div className={styles.salida} role="dialog" aria-modal="true" aria-labelledby="salida-titulo" data-salida>
          <button type="button" className={styles.cortina} aria-label="Cerrar oferta" onClick={() => setSalida(false)} />
          <div className={styles.salidaCard}>
            <p className={styles.estado}><span className={styles.chk} aria-hidden="true">✓</span> 50% por 3 meses</p>
            <h2 id="salida-titulo">No te vayas sin tu 50%</h2>
            <p>Clinera Flux queda en US$ 14,50 por 3 meses. Después vuelve al precio normal.</p>
            <button
              type="button"
              className={styles.cta}
              onClick={() => {
                setSalida(false);
                if (salirRef.current.flux) salirRef.current.pagar();
                else salirRef.current.agregar();
              }}
            >
              {salirRef.current.flux ? "Activar" : "Agregar Flux"}
            </button>
            <button type="button" className={styles.salidaNo} onClick={() => setSalida(false)}>Ahora no</button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Checkout({
  hoy,
  lista,
  promoOff,
  enviando,
  listo,
  onClick,
}: {
  hoy: number;
  lista: number;
  promoOff: boolean;
  enviando: boolean;
  listo: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={styles.cta}
      data-cta="carrito-checkout"
      data-plan="flux_modular"
      data-plan-value={String(hoy)}
      data-plan-lista={String(lista)}
      data-promo={promoOff ? "no" : "si"}
      disabled={enviando || !listo}
      onClick={onClick}
    >
      {enviando ? "Abriendo pago…" : "Activar"}
    </button>
  );
}

function Precio({ usd, promo, desde = false, unico = false }: { usd: number; promo: boolean; desde?: boolean; unico?: boolean }) {
  if (unico) {
    return (
      <p className={styles.precio}>
        <b>{monto(usd)}</b>
        <span className={styles.cobro}>cobro único</span>
      </p>
    );
  }
  const mitad = Math.round(usd * 50) / 100;
  return (
    <p className={styles.precio}>
      {desde ? <span className={styles.desde}>Desde {monto(usd)}/mes</span> : null}
      {promo ? <s>{monto(usd)}</s> : null}
      <b>
        {promo ? monto(mitad) : monto(usd)}
        <span className={styles.periodo}>/mes</span>
      </b>
      {promo ? <span className={styles.pill}>50% por 3 meses</span> : null}
      {promo ? <span className={styles.luegoPrecio}>{monto(mitad)} por 3 meses, luego precio normal</span> : null}
    </p>
  );
}

function Addon({
  id,
  qty,
  promo,
  bloqueado,
  onAdd,
  onSub,
}: {
  id: Exclude<ItemId, "flux_base">;
  qty: number;
  promo: boolean;
  bloqueado: boolean;
  onAdd: () => void;
  onSub: () => void;
}) {
  const spec = CARRITO[id];
  const enCarrito = qty > 0;
  const esperaFlux = bloqueado && !enCarrito;
  return (
    <article className={`${styles.card} ${enCarrito ? styles.cardOn : ""} ${bloqueado ? styles.espera : ""}`} data-addon={id} data-espera={bloqueado ? "si" : "no"}>
      <div className={styles.addonTop}>
        <div className={styles.icono}>
          <Foto id={id} />
        </div>
        <div>
          <h3 className={styles.cardTitulo}>{spec.nombre}</h3>
          <p className={styles.cardSub}>{TEXTO[id]}</p>
        </div>
        <Precio usd={spec.usd} promo={promo && spec.cobro !== "unico"} unico={spec.cobro === "unico"} />
      </div>
      {enCarrito && id === "onboarding_humano" ? (
        <button type="button" className={styles.quitar} aria-label="Quitar Onboarding humano" onClick={onSub}>
          Quitar
        </button>
      ) : enCarrito ? (
        <Stepper id={id} qty={qty} donde="card" onAdd={onAdd} onSub={onSub} />
      ) : (
        <button
          type="button"
          className={styles.agregar}
          aria-label={esperaFlux ? "Primero agrega Clinera Flux" : `Agregar al carrito: ${spec.nombre}`}
          disabled={esperaFlux}
          onClick={onAdd}
        >
          {esperaFlux ? "Primero agrega Clinera Flux" : "Agregar al carrito"}
        </button>
      )}
    </article>
  );
}

function Stepper({
  id,
  qty,
  donde,
  onAdd,
  onSub,
}: {
  id: ItemId;
  qty: number;
  donde: "card" | "drawer";
  onAdd: () => void;
  onSub: () => void;
}) {
  const spec = CARRITO[id];
  const nombre = etiqueta(spec.nombre);
  const sufijo = donde === "drawer" ? " en el carrito" : "";
  return (
    <div className={styles.stepper} role="group" aria-label={`Cantidad de ${nombre}${sufijo}`}>
      <button type="button" aria-label={`Quitar ${nombre}${sufijo}`} onClick={onSub} disabled={qty <= 0}>−</button>
      <output aria-live="polite">{qty}</output>
      <button type="button" aria-label={`Sumar ${nombre}${sufijo}`} onClick={onAdd} disabled={qty >= spec.max}>+</button>
    </div>
  );
}

const FOTOS: Partial<Record<ItemId, string>> = {
  flux_base: "/kimi/productos/flux.jpg",
  profesional_extra: "/kimi/productos/profesional.jpg",
  sucursal_extra: "/kimi/productos/sucursal.jpg",
  conversaciones_1000: "/kimi/productos/conversaciones.jpg",
  instagram: "/kimi/productos/instagram.jpg",
  facebook: "/kimi/productos/facebook.jpg",
  agente_ia: "/kimi/productos/agente-ia.jpg",
  email_marketing: "/kimi/productos/email-marketing.jpg",
  automatizaciones: "/kimi/productos/automatizaciones.jpg",
  onboarding_humano: "/kimi/productos/onboarding.jpg",
};

function Foto({ id }: { id: ItemId }) {
  const src = FOTOS[id];
  if (!src) return <Icono id={id} />;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={CARRITO[id].nombre} width={1024} height={1024} />
  );
}

function Icono({ id, grande = false }: { id: ItemId; grande?: boolean }) {
  const s = grande ? 72 : 28;
  return (
    <svg viewBox="0 0 24 24" width={s} height={s} aria-hidden="true">
      {id === "flux_base" ? (
        <path fill="currentColor" d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5z" />
      ) : null}
      {id === "profesional_extra" ? (
        <path fill="currentColor" d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm-7 8a7 7 0 0 1 14 0H5z" />
      ) : null}
      {id === "sucursal_extra" ? (
        <path fill="currentColor" d="M3 20V9l6-4 6 4v11H3zm8-2h2v-3h-2v3zm6 2V8l4-2v14h-4z" />
      ) : null}
      {id === "conversaciones_1000" ? (
        <path fill="currentColor" d="M4 4h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H8l-4 4V5a1 1 0 0 1 1-1z" />
      ) : null}
      {id === "instagram" ? (
        <path fill="currentColor" d="M8 3h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5zm4 5a4 4 0 1 0 4 4 4 4 0 0 0-4-4zm5.2-.9a1 1 0 1 0 1 1 1 1 0 0 0-1-1z" />
      ) : null}
      {id === "facebook" ? (
        <path fill="currentColor" d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h2.6l.4-3H13v-2c0-.6.4-1 1-1z" />
      ) : null}
      {id === "agente_ia" ? (
        <path fill="currentColor" d="M12 2l1.6 5.2L19 9l-5.4 1.8L12 16l-1.6-5.2L5 9l5.4-1.8L12 2zM18 14l.8 2.2L21 17l-2.2.8L18 20l-.8-2.2L15 17l2.2-.8L18 14z" />
      ) : null}
      {id === "email_marketing" ? (
        <path fill="currentColor" d="M3 6h18v12H3V6zm9 6L4.5 7.5h15L12 12z" />
      ) : null}
      {id === "automatizaciones" ? (
        <path fill="currentColor" d="M12 2a2 2 0 0 1 2 2 2 2 0 0 1-.2.9l2.1 1.2a2 2 0 1 1 0 2.2l-2.1 1.2a2 2 0 0 1 0 1.8l2.1 1.2a2 2 0 1 1-1 1.7l-2.1-1.2a2 2 0 0 1-1.8.9 2 2 0 0 1-1.8-.9l-2.1 1.2a2 2 0 1 1-1-1.7l2.1-1.2a2 2 0 0 1 0-1.8L4.2 8.3a2 2 0 1 1 1-1.7l2.1 1.2A2 2 0 0 1 12 2z" />
      ) : null}
      {id === "onboarding_humano" ? (
        <path fill="currentColor" d="M12 12a3.5 3.5 0 1 0-3.5-3.5A3.5 3.5 0 0 0 12 12zm-6 8a6 6 0 0 1 12 0H6zm9.2-9.8 1.2 1.2 2.6-2.6-1.2-1.2z" />
      ) : null}
    </svg>
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
    <div className={`${styles.pagina} ${outfit.variable}`} data-carrito data-pago="ok">
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
