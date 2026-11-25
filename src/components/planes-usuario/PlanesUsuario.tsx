"use client";

import { useState } from "react";
import { CtaAsistencia, CtaRegistro } from "@/components/cta/CtaPar";
import {
  EXTRA_CONVERSACIONES,
  INCLUYE_TODOS,
  PLANES_USUARIO,
  precioPorProfesional,
} from "@/content/planes-usuario";
import s from "./PlanesUsuario.module.css";

const AZUL = "#1E5BD8";

function Check() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" className={s.check}>
      <path d="M3.5 8.5l3 3 6-7" fill="none" stroke={AZUL} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function PlanesUsuario() {
  const [anual, setAnual] = useState(true);
  const [profesionales, setProfesionales] = useState(5);
  const pro = PLANES_USUARIO.find((p) => p.id === "pro")!;
  const esencial = PLANES_USUARIO.find((p) => p.id === "esencial")!;
  const totalPro = precioPorProfesional(pro.mensualUsd!, anual) * profesionales;
  const totalEsencial = precioPorProfesional(esencial.mensualUsd!, anual) * profesionales;

  return (
    <div className={s.page}>
      <header className={s.hero}>
        <p className={s.kicker}>PLANES · POR PROFESIONAL</p>
        <h1 className={s.titulo}>Paga por quien atiende. La recepción no paga.</h1>
        <p className={s.bajada}>
          Un precio por cada profesional con agenda. Agrega o quita profesionales cuando quieras.
        </p>
        <div className={s.toggle} role="group" aria-label="Forma de pago" data-toggle-anual>
          <button type="button" aria-pressed={!anual} className={!anual ? s.on : ""} onClick={() => setAnual(false)}>
            Mensual
          </button>
          <button type="button" aria-pressed={anual} className={anual ? s.on : ""} onClick={() => setAnual(true)}>
            Anual <span className={s.ahorro}>−20%</span>
          </button>
        </div>
      </header>

      <section className={s.grid} aria-label="Planes">
        {PLANES_USUARIO.map((p) => (
          <article key={p.id} data-plan-card={p.id} className={`${s.card} ${p.recomendado ? s.recomendado : ""}`}>
            <div className={s.cardHead}>
              <h2 className={s.nombre}>{p.nombre}</h2>
              {p.recomendado && <span className={s.badge}>Recomendado</span>}
            </div>
            <p className={s.cardBajada}>{p.bajada}</p>
            <div className={s.precio} data-precio>
              {p.mensualUsd === null ? (
                <span className={s.monto}>A medida</span>
              ) : (
                <>
                  <span className={s.monto}>US$ {precioPorProfesional(p.mensualUsd, anual)}</span>
                  <span className={s.unidad}>por profesional / mes</span>
                </>
              )}
            </div>
            <p className={s.nota}>
              {p.mensualUsd === 0
                ? "Gratis para siempre"
                : p.mensualUsd === null
                  ? "Cotización según volumen"
                  : anual
                    ? "Facturado anual"
                    : "Facturado mensual"}
            </p>
            {p.cta === "registro" ? (
              <CtaRegistro tam="md" texto={p.mensualUsd === 0 ? "Empieza gratis" : "Prueba 7 días gratis"} style={{ width: "100%", justifyContent: "center" }} />
            ) : (
              <CtaAsistencia tam="md" style={{ width: "100%", justifyContent: "center" }} />
            )}
            <p className={s.sumaTit}>{p.id === "gratis" ? "Incluye" : p.id === "esencial" ? "Todo lo de Gratis, más" : p.id === "pro" ? "Todo lo de Esencial, más" : "Todo lo de Pro, más"}</p>
            <ul className={s.lista}>
              {p.suma.map((x) => (
                <li key={x}>
                  <Check />
                  {x}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section className={s.incluye} data-incluye-todos aria-labelledby="incluye-tit">
        <h2 id="incluye-tit" className={s.secTit}>Todos los planes incluyen</h2>
        <ul className={s.incluyeLista}>
          {INCLUYE_TODOS.map((x) => (
            <li key={x}>
              <Check />
              {x}
            </li>
          ))}
        </ul>
      </section>

      <section className={s.calc} aria-labelledby="calc-tit" data-calculadora>
        <h2 id="calc-tit" className={s.secTit}>¿Cuánto pagaría tu clínica?</h2>
        <label className={s.calcLabel} htmlFor="calc-prof">
          Profesionales con agenda: <strong data-calc-n>{profesionales}</strong>
        </label>
        <input
          id="calc-prof"
          type="range"
          min={1}
          max={20}
          value={profesionales}
          onChange={(e) => setProfesionales(Number(e.target.value))}
          className={s.rango}
        />
        <div className={s.calcRes}>
          <div>
            <span className={s.calcPlan}>Esencial</span>
            <span className={s.calcMonto} data-calc-esencial>US$ {totalEsencial}</span>
            <span className={s.unidad}>al mes</span>
          </div>
          <div>
            <span className={s.calcPlan}>Pro</span>
            <span className={s.calcMonto} data-calc-pro>US$ {totalPro}</span>
            <span className={s.unidad}>al mes</span>
          </div>
        </div>
        <p className={s.nota}>
          Recepción y administración no suman. Desde 15 profesionales conviene Clínicas grandes.
        </p>
      </section>

      <section className={s.faq} aria-labelledby="faq-tit">
        <h2 id="faq-tit" className={s.secTit}>Preguntas</h2>
        <dl>
          <dt>¿Quién cuenta como profesional?</dt>
          <dd>Quien tiene agenda propia y atiende pacientes. Recepción, administración y gerencia entran sin costo.</dd>
          <dt>¿Qué pasa si se acaban las conversaciones de IA?</dt>
          <dd>
            Las conversaciones del plan Pro se suman entre todos los profesionales. Si faltan, agregas{" "}
            {EXTRA_CONVERSACIONES.cantidad.toLocaleString("es-CL")} por US$ {EXTRA_CONVERSACIONES.usd}.
          </dd>
          <dt>¿Puedo cambiar de plan?</dt>
          <dd>Sí, cuando quieras. Si ya eres cliente, mantienes tu plan y tu precio.</dd>
        </dl>
      </section>
    </div>
  );
}
