"use client";

import { useCallback, useEffect, useState } from "react";
import "@/app/speech/speech.css";

const SLIDES = [
  { id: "hielo", label: "Romper el hielo" },
  { id: "descubrimiento", label: "Descubrimiento" },
  { id: "software", label: "Mostrar software" },
  { id: "cierre", label: "Cerrar negocio" },
] as const;

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M13.3 4.3 6.5 11.1 2.7 7.3"
        stroke="#3D7A45"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Quote({ label = "Tú dices", children }: { label?: string; children: React.ReactNode }) {
  return (
    <blockquote className="sp-quote">
      <span className="sp-quote-label">{label}</span>
      <p>{children}</p>
    </blockquote>
  );
}

function Why({ children }: { children: React.ReactNode }) {
  return (
    <p className="sp-why">
      <CheckIcon />
      <span>{children}</span>
    </p>
  );
}

function SlideHielo() {
  return (
    <section className="sp-slide" aria-label="Etapa 1: Romper el hielo y halagar">
      <p className="sp-kicker">Etapa 01</p>
      <h1 className="sp-title">Romper el hielo y halagar</h1>
      <p className="sp-lede">
        Parte con una conversación breve y genuina. Halaga la clínica y el trabajo del doctor
        antes de hablar de Clinera.
      </p>

      <Quote>
        &ldquo;Doctor(a), muchas gracias por darse el tiempo. ¿Cómo ha estado? ¿Cómo ha estado
        la consulta esta semana?&rdquo;
      </Quote>
      <p className="sp-aside">Conversación breve.</p>
      <Quote>
        &ldquo;Primero que todo, gracias por la oportunidad. Mi objetivo hoy no es venderle un
        software, sino entender cómo están trabajando actualmente y mostrarle si Clinera
        realmente puede aportar valor. Si al final vemos que les sirve, avanzamos; y si no, al
        menos tendrá una referencia para comparar.&rdquo;
      </Quote>
      <Why>Eso baja las defensas del cliente.</Why>
    </section>
  );
}

function SlideDescubrimiento() {
  return (
    <section className="sp-slide" aria-label="Etapa 2: Descubrimiento">
      <p className="sp-kicker">Etapa 02</p>
      <h1 className="sp-title">Descubrimiento</h1>
      <p className="sp-lede">Aquí es donde se venden las futuras ventas. Preguntas como:</p>

      <ul className="sp-questions">
        <li>
          <span className="sp-q-index">A</span>
          ¿Cuántos profesionales trabajan actualmente?
        </li>
        <li>
          <span className="sp-q-index">B</span>
          ¿Cómo agendan las horas?
        </li>
        <li>
          <span className="sp-q-index">C</span>
          ¿Qué sistema utilizan hoy?
        </li>
        <li>
          <span className="sp-q-index">D</span>
          ¿Qué es lo que más les complica de ese sistema?
        </li>
        <li>
          <span className="sp-q-index">E</span>
          Si pudiera mejorar una sola cosa, ¿cuál sería?
        </li>
      </ul>
      <Why>Escucha mucho. Anota palabras claves.</Why>
    </section>
  );
}

function SlideSoftware() {
  return (
    <section className="sp-slide" aria-label="Etapa 3: Mostrar software">
      <p className="sp-kicker">Etapa 03</p>
      <h1 className="sp-title">Mostrar software</h1>
      <p className="sp-lede">
        No muestres todo: solo lo que resuelve los problemas que el doctor mencionó en el
        descubrimiento. Y prepara siempre estos dos momentos.
      </p>

      <div className="sp-wow-grid">
        <div className="sp-wow-card">
          <span className="sp-wow-icon" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <rect x="4" y="5" width="16" height="12" rx="2.5" stroke="currentColor" strokeWidth="1.7" />
              <circle cx="9.5" cy="10.5" r="1.3" fill="currentColor" />
              <circle cx="14.5" cy="10.5" r="1.3" fill="currentColor" />
              <path d="M9 14h6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
              <path d="M12 17v3M8.5 20h7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
          </span>
          <span className="sp-wow-num">Momento WOW 01</span>
          <h3>Mostrar el agente IA interno</h3>
          <p>
            En vivo, dentro de la plataforma: el doctor ve cómo la IA trabaja sobre la agenda y
            los pacientes de la clínica.
          </p>
        </div>

        <div className="sp-wow-card">
          <span className="sp-wow-icon" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <rect x="7" y="3" width="10" height="18" rx="2.5" stroke="currentColor" strokeWidth="1.7" />
              <path d="M10.5 6h3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
              <path d="m14.8 11.2-3.1 3.1-1.5-1.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="sp-wow-num">Momento WOW 02</span>
          <h3>Que el cliente agende desde su número</h3>
          <p>
            El doctor escribe desde su propio teléfono y agenda una hora mientras compartimos
            pantalla: ve a la IA responder y la cita aparecer en la agenda en tiempo real.
          </p>
        </div>
      </div>

      <div style={{ marginTop: 28 }}>
        <Quote label="Ejemplo">
          &ldquo;Me comentó que pierden tiempo confirmando pacientes. Mire cómo funciona el
          módulo de agenda&hellip;&rdquo;
        </Quote>
      </div>
    </section>
  );
}

function SlideCierre() {
  return (
    <section className="sp-slide" aria-label="Etapa 4: Cerrar negocio">
      <p className="sp-kicker">Etapa 04</p>
      <h1 className="sp-title">Cerrar negocio</h1>
      <p className="sp-lede">
        Al cerrar el negocio: si el cliente objeta que el precio es alto, usa esta jugada.
      </p>

      <Quote>
        &ldquo;Yo sé que usted es un empresario inteligente y que sus clínicas tienen
        proyección de crecimiento. Nosotros averiguamos sobre su negocio y califica
        perfectamente para lograr un ROAS positivo. Lo que puedo hacer es solicitar con mi
        superior una autorización especial para darle un descuento. Si le consigo el
        descuento, ¿usted implementaría Clinera?&rdquo;
      </Quote>

      <div className="sp-play" style={{ marginTop: 28 }}>
        <div className="sp-play-step">
          <span className="sp-play-num" aria-hidden="true" />
          <div>
            <h3>El cliente responderá &ldquo;depende del descuento&rdquo;</h3>
            <p>
              Es la respuesta esperada. Significa que la decisión ya no es si compra, sino en
              qué condiciones.
            </p>
          </div>
        </div>
        <div className="sp-play-step">
          <span className="sp-play-num" aria-hidden="true" />
          <div>
            <h3>Pausa la videollamada 2 minutos</h3>
            <p>
              En ese momento sales de la llamada para &ldquo;consultar la autorización&rdquo;
              con tu superior.
            </p>
          </div>
        </div>
        <div className="sp-play-step">
          <span className="sp-play-num" aria-hidden="true" />
          <div>
            <h3>Vuelve con el encargado para dar la autorización</h3>
            <p>
              Invita a Ricardo o vuelve con quien esté disponible para hacer de encargado y
              aprobar el descuento. Da lo mismo quién — si Ricardo puede, mejor.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function SpeechDeck() {
  const [index, setIndex] = useState(0);

  const goTo = useCallback((next: number) => {
    setIndex((prev) => {
      const clamped = Math.min(SLIDES.length - 1, Math.max(0, next));
      if (clamped !== prev) window.scrollTo({ top: 0 });
      return clamped;
    });
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setIndex((i) => Math.min(SLIDES.length - 1, i + 1));
      if (e.key === "ArrowLeft") setIndex((i) => Math.max(0, i - 1));
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") window.scrollTo({ top: 0 });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="sp-root">
      <header className="sp-topbar">
        <div className="sp-brand">
          <span className="sp-brand-mark" aria-hidden="true">
            C
          </span>
          <span className="sp-brand-name">Clinera</span>
          <span className="sp-brand-tag">Guía interna de ventas</span>
        </div>
        <span className="sp-counter">
          <strong>{String(index + 1).padStart(2, "0")}</strong> / {String(SLIDES.length).padStart(2, "0")}
        </span>
      </header>

      <main className="sp-stage" id="main">
        {index === 0 && <SlideHielo />}
        {index === 1 && <SlideDescubrimiento />}
        {index === 2 && <SlideSoftware />}
        {index === 3 && <SlideCierre />}
      </main>

      <nav className="sp-nav" aria-label="Navegación de etapas">
        <div className="sp-tabs">
          {SLIDES.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              className="sp-tab"
              aria-current={i === index}
              onClick={() => goTo(i)}
            >
              <span className="sp-tab-num">{String(i + 1).padStart(2, "0")}</span>
              <span className="sp-tab-text">{slide.label}</span>
            </button>
          ))}
        </div>
        <div className="sp-arrows">
          <span className="sp-hint">Usa las flechas del teclado</span>
          <button
            type="button"
            className="sp-arrow"
            aria-label="Etapa anterior"
            disabled={index === 0}
            onClick={() => goTo(index - 1)}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M10 3 5 8l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            className="sp-arrow sp-arrow--next"
            aria-label="Etapa siguiente"
            disabled={index === SLIDES.length - 1}
            onClick={() => goTo(index + 1)}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="m6 3 5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </nav>
    </div>
  );
}
