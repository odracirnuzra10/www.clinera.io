"use client";

import { useCallback, useEffect, useState } from "react";
import "@/app/speech/speech.css";

const SLIDES = [
  { id: "speech", label: "Speech de ventas" },
  { id: "cierre", label: "Para cerrar el negocio" },
  { id: "wow", label: "Momentos WOW" },
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

function SlideSpeech() {
  return (
    <section className="sp-slide" aria-label="Speech de ventas">
      <p className="sp-kicker">Diapositiva 01 — Guía interna</p>
      <h1 className="sp-title">Speech de ventas</h1>
      <p className="sp-lede">
        La estructura completa de la reunión comercial, paso a paso. El objetivo no es
        presentar un software: es entender la clínica y dejar que el doctor decida.
      </p>

      <article className="sp-step">
        <span className="sp-step-num">01</span>
        <div>
          <div className="sp-step-head">
            <h2 className="sp-step-title">Rompe el hielo</h2>
            <span className="sp-chip">1–2 min</span>
          </div>
          <Quote>
            &ldquo;Doctor(a), muchas gracias por darse el tiempo. ¿Cómo ha estado? ¿Cómo ha
            estado la consulta esta semana?&rdquo;
          </Quote>
          <p className="sp-aside">Conversación breve.</p>
          <Quote>
            &ldquo;Primero que todo, gracias por la oportunidad. Mi objetivo hoy no es venderle
            un software, sino entender cómo están trabajando actualmente y mostrarle si Clinera
            realmente puede aportar valor. Si al final vemos que les sirve, avanzamos; y si no,
            al menos tendrá una referencia para comparar.&rdquo;
          </Quote>
          <Why>Eso baja las defensas del cliente.</Why>
        </div>
      </article>

      <article className="sp-step">
        <span className="sp-step-num">02</span>
        <div>
          <div className="sp-step-head">
            <h2 className="sp-step-title">Agenda de la reunión</h2>
          </div>
          <Quote>
            &ldquo;La reunión será muy simple. Primero le haré algunas preguntas para entender
            cómo trabajan hoy. Luego le mostraré cómo funciona Clinera a través de una
            presentación y una demo y, al final, veremos cuál sería el plan que mejor se adapta
            a su clínica. ¿Le parece bien?&rdquo;
          </Quote>
          <Why>
            Cuando el cliente dice &ldquo;sí&rdquo;, psicológicamente ya está comprometido con
            la estructura.
          </Why>
        </div>
      </article>

      <article className="sp-step">
        <span className="sp-step-num">03</span>
        <div>
          <div className="sp-step-head">
            <h2 className="sp-step-title">Descubrimiento</h2>
            <span className="sp-chip">5–10 min</span>
          </div>
          <p className="sp-step-goal">Aquí es donde se venden las futuras ventas.</p>
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
        </div>
      </article>

      <article className="sp-step">
        <span className="sp-step-num">04</span>
        <div>
          <div className="sp-step-head">
            <h2 className="sp-step-title">Transición</h2>
          </div>
          <Quote>
            &ldquo;Perfecto, doctor(a). Si entendí bien, hoy los principales desafíos
            son&hellip;&rdquo;
          </Quote>
          <p className="sp-aside">Repites exactamente lo que dijo.</p>
          <Quote>
            &ldquo;Ahora me gustaría mostrarle cómo Clinera puede ayudar precisamente en esos
            puntos.&rdquo;
          </Quote>
          <Why>Recién ahora compartes pantalla.</Why>
        </div>
      </article>

      <article className="sp-step">
        <span className="sp-step-num">05</span>
        <div>
          <div className="sp-step-head">
            <h2 className="sp-step-title">Presentación y demo</h2>
          </div>
          <p className="sp-step-goal">
            No muestres todo. Solo lo que resuelve los problemas que mencionó.
          </p>
          <Quote label="Ejemplo">
            &ldquo;Me comentó que pierden tiempo confirmando pacientes. Mire cómo funciona el
            módulo de agenda&hellip;&rdquo;
          </Quote>
        </div>
      </article>

      <article className="sp-step">
        <span className="sp-step-num">06</span>
        <div>
          <div className="sp-step-head">
            <h2 className="sp-step-title">Presentación del plan</h2>
          </div>
          <Quote>
            &ldquo;Doctor(a), considerando todo lo que vimos, el plan que yo le recomendaría es
            este&hellip;&rdquo;
          </Quote>
          <Why>Explicas el precio. No te disculpes por el valor.</Why>
        </div>
      </article>

      <article className="sp-step">
        <span className="sp-step-num">07</span>
        <div>
          <div className="sp-step-head">
            <h2 className="sp-step-title">Cierre</h2>
          </div>
          <Quote>
            &ldquo;Quisiera hacerle una última pregunta. Después de lo que vimos hoy, ¿cree que
            Clinera ayudaría a mejorar la gestión de su clínica?&rdquo;
          </Quote>
          <p className="sp-aside">Si responde que sí&hellip;</p>
          <Quote>
            &ldquo;Excelente. Entonces demos el siguiente paso para que puedan comenzar a
            utilizar la plataforma. ¿Le parece si iniciamos hoy el proceso de
            implementación?&rdquo;
          </Quote>
        </div>
      </article>

      <div className="sp-memorize">
        <p className="sp-memorize-label">Frase para memorizar — suele ser muy efectiva</p>
        <p>
          &ldquo;No estoy aquí para convencerlo de comprar Clinera. Estoy aquí para que usted
          decida si Clinera es la mejor herramienta para su clínica. Si al finalizar cree que
          le aporta valor, avanzamos; si no, seguiremos siendo un contacto para el
          futuro.&rdquo;
        </p>
      </div>
    </section>
  );
}

function SlideCierre() {
  return (
    <section className="sp-slide" aria-label="Para cerrar el negocio">
      <p className="sp-kicker">Diapositiva 02 — Guía interna</p>
      <h1 className="sp-title">Para cerrar el negocio</h1>
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
            <p>Es la respuesta esperada. Significa que la decisión ya no es si compra, sino en qué condiciones.</p>
          </div>
        </div>
        <div className="sp-play-step">
          <span className="sp-play-num" aria-hidden="true" />
          <div>
            <h3>Pausa la videollamada 2 minutos</h3>
            <p>En ese momento sales de la llamada para &ldquo;consultar la autorización&rdquo; con tu superior.</p>
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

function SlideWow() {
  return (
    <section className="sp-slide" aria-label="Momentos WOW">
      <p className="sp-kicker">Diapositiva 03 — Guía interna</p>
      <h1 className="sp-title">Momentos WOW</h1>
      <p className="sp-lede">
        Dos momentos de la demo que generan el mayor impacto. Prepáralos siempre antes de la
        reunión.
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
              <path
                d="M20 12a8 8 0 1 0-3.1 6.3L20 19l-.6-3.1A7.96 7.96 0 0 0 20 12Z"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinejoin="round"
              />
              <path d="M8.5 10.5h7M8.5 13.5h4.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
          </span>
          <span className="sp-wow-num">Momento WOW 02</span>
          <h3>El cliente escribe al número</h3>
          <p>
            El doctor escribe al número desde su propio teléfono mientras compartimos pantalla:
            ve la conversación llegar y a la IA responder en tiempo real.
          </p>
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
        {index === 0 && <SlideSpeech />}
        {index === 1 && <SlideCierre />}
        {index === 2 && <SlideWow />}
      </main>

      <nav className="sp-nav" aria-label="Navegación de diapositivas">
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
            aria-label="Diapositiva anterior"
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
            aria-label="Diapositiva siguiente"
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
