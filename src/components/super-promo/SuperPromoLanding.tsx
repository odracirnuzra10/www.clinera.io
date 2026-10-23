"use client";

// /super-promo (Ricardo, 23-oct-2026): una sola pantalla para quien llega desde la difusión
// de WhatsApp o el correo. Oferta, boleta del ahorro, lo que incluye y un CTA a WhatsApp.
// Sin menú. La cuenta regresiva se calcula en el navegador (si saliera del build, quedaría
// congelada); cuando la promo termina, la página lo dice y el botón sigue llevando a ventas.

import { useSyncExternalStore } from "react";
import { Eyebrow, GRAD, Wordmark } from "@/components/brand-v3/Brand";
import {
  SUPER_PROMO,
  SUPER_PROMO_INCLUYE,
  SUPER_PROMO_SEPARADO,
  SUPER_PROMO_SEPARADO_TOTAL,
  SUPER_PROMO_WHATSAPP_URL,
} from "@/content/super-promo";
import styles from "./SuperPromoLanding.module.css";

type Restante = { dias: number; horas: number; minutos: number } | "terminada" | null;

/** Minutos que faltan como string: useSyncExternalStore compara por valor y no re-renderiza en bucle. */
function leer(): string {
  const ms = new Date(SUPER_PROMO.terminaIso).getTime() - Date.now();
  return ms <= 0 ? "fin" : String(Math.floor(ms / 60000));
}
function suscribir(aviso: () => void) {
  const id = setInterval(aviso, 30000);
  return () => clearInterval(id);
}

function useRestante(): Restante {
  const clave = useSyncExternalStore(suscribir, leer, () => "");
  if (clave === "") return null;
  if (clave === "fin") return "terminada";
  const min = Number(clave);
  return { dias: Math.floor(min / 1440), horas: Math.floor((min % 1440) / 60), minutos: min % 60 };
}

function IconoWhatsApp() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.47-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.08.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35M12.05 21.79h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88 2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 0 1 2.89 6.99c0 5.45-4.44 9.88-9.88 9.88m8.41-18.3A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.24-6.16-3.48-8.42" />
    </svg>
  );
}

function BotonWhatsApp({ donde, texto }: { donde: "hero" | "cierre"; texto: string }) {
  return (
    <a
      className={styles.whatsapp}
      href={SUPER_PROMO_WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      data-cta-ventas={`super-promo-${donde}`}
      data-super-promo-whatsapp={donde}
    >
      <IconoWhatsApp />
      {texto}
    </a>
  );
}

function Cuenta({ r }: { r: Restante }) {
  if (r === null) return <p className={styles.cuenta}>Termina el {SUPER_PROMO.terminaTexto}</p>;
  if (r === "terminada") {
    return (
      <p className={`${styles.cuenta} ${styles.cuentaFin}`} data-super-promo-terminada>
        Esta promoción terminó el {SUPER_PROMO.terminaTexto}. Escríbenos y te contamos lo que tenemos hoy.
      </p>
    );
  }
  return (
    <p className={styles.cuenta} data-super-promo-cuenta>
      ⏰ Termina el {SUPER_PROMO.terminaTexto} · quedan{" "}
      <b>
        {r.dias} {r.dias === 1 ? "día" : "días"}, {r.horas} h y {r.minutos} min
      </b>
    </p>
  );
}

export default function SuperPromoLanding() {
  const r = useRestante();
  const terminada = r === "terminada";

  return (
    <main className={styles.main}>
      <section className={styles.hero} aria-labelledby="super-promo-h1">
        <div className={styles.glow} aria-hidden />
        <div className={styles.contenido}>
          <div className={styles.marca}>
            <Wordmark size={22} />
          </div>
          <Eyebrow style={{ color: "#7C3AED" }}>Super promo · solo hasta el {SUPER_PROMO.terminaTexto}</Eyebrow>
          <h1 id="super-promo-h1" className={styles.h1}>
            Software + Marketing a{" "}
            <span style={{ background: GRAD, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
              US$ {SUPER_PROMO.precioUsd}
            </span>{" "}
            al mes
          </h1>
          <p className={styles.bajada}>
            Consigue más pacientes y deja de perder citas. Precio fijo por {SUPER_PROMO.meses} meses.
          </p>

          <div className={styles.boleta} data-super-promo-boleta>
            <p className={styles.boletaTitulo}>Lo que pagarías por separado</p>
            <ul>
              {SUPER_PROMO_SEPARADO.map((p) => (
                <li key={p.id}>
                  <span>{p.etiqueta}</span>
                  <span>{p.precio.replace("/mes", "")}</span>
                </li>
              ))}
            </ul>
            <p className={styles.boletaTotal}>
              <span>Total</span>
              <s>{SUPER_PROMO_SEPARADO_TOTAL.replace("/mes", "")}</s>
            </p>
            <div className={styles.boletaClinera}>
              <p>
                <span>Con Clinera</span>
                <b>US$ {SUPER_PROMO.precioUsd}/mes</b>
              </p>
              <p className={styles.ahorro}>Te ahorras desde US$ {SUPER_PROMO.ahorroDesdeUsd} al mes</p>
            </div>
          </div>

          <BotonWhatsApp donde="hero" texto={terminada ? "Escríbenos por WhatsApp" : "Sí, quiero la promo"} />
          <Cuenta r={r} />
        </div>
      </section>

      <section className={styles.incluye} aria-labelledby="super-promo-incluye">
        <h2 id="super-promo-incluye" className={styles.h2}>
          Qué incluye
        </h2>
        <ul data-super-promo-incluye>
          {SUPER_PROMO_INCLUYE.map((t) => (
            <li key={t}>
              <span className={styles.check} aria-hidden>
                ✓
              </span>
              {t}
            </li>
          ))}
        </ul>
        <div className={styles.cierre}>
          <BotonWhatsApp donde="cierre" texto={terminada ? "Escríbenos por WhatsApp" : "Quiero avanzar por WhatsApp"} />
          <p className={styles.persona}>Te responde una persona del equipo.</p>
        </div>
        <p className={styles.letraChica}>
          Promoción válida hasta el {SUPER_PROMO.terminaTexto} de 2026. US$ {SUPER_PROMO.precioUsd} al mes durante los primeros{" "}
          {SUPER_PROMO.meses} meses; después rige el precio normal (US$ {SUPER_PROMO.precioRegularUsd} al mes). La inversión en
          anuncios se paga aparte. Valores de referencia de mercado.
        </p>
      </section>
    </main>
  );
}
