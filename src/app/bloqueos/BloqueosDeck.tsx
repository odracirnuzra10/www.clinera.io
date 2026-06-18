"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

/* ──────────────────────────────────────────────────────────────────────────
   Deck "Cuida tu WhatsApp" — /bloqueos
   Autocontenido. Estado del slide en memoria. Estética Clinera STERILE:
   light-first, único acento cyan, Outfit + DM Mono, sin gradiente arcoíris.
   ────────────────────────────────────────────────────────────────────────── */

const TOTAL = 5;
const SANS = "'Outfit', system-ui, sans-serif";
const MONO = "'DM Mono', ui-monospace, monospace";
const CYAN = "#009FE3";

const TONES = {
  green: { bg: "#EDF3EC", fg: "#2F6B30" },
  yellow: { bg: "#FBF3DB", fg: "#8A6D0F" },
  red: { bg: "#FDEBEC", fg: "#991B1B" },
} as const;
type Tone = keyof typeof TONES;

// Delay en cascada por elemento al entrar el slide (60–80ms).
const rise = (i: number): CSSProperties => ({ animationDelay: `${i * 70}ms` });

/* ── Iconos (SVG inline, sin emojis) ─────────────────────────────────────── */
type IconProps = { className?: string };
const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function IconStore({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...stroke} aria-hidden="true">
      <path d="M4 9.5 5.2 5h13.6L20 9.5" />
      <path d="M4 9.5a2.4 2.4 0 0 0 4 0 2.4 2.4 0 0 0 4 0 2.4 2.4 0 0 0 4 0 2.4 2.4 0 0 0 4 0" />
      <path d="M5 11.5V19h14v-7.5" />
      <path d="M10 19v-4h4v4" />
    </svg>
  );
}
function IconBroadcast({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...stroke} aria-hidden="true">
      <circle cx="12" cy="12" r="2" />
      <path d="M16.2 7.8a6 6 0 0 1 0 8.4M7.8 16.2a6 6 0 0 1 0-8.4" />
      <path d="M19 5a10 10 0 0 1 0 14M5 19A10 10 0 0 1 5 5" />
    </svg>
  );
}
function IconShield({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...stroke} aria-hidden="true">
      <path d="M12 3 5 6v5c0 4.2 2.9 7.6 7 9 4.1-1.4 7-4.8 7-9V6l-7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
function IconGauge({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...stroke} aria-hidden="true">
      <path d="M4 18a8 8 0 1 1 16 0" />
      <path d="m12 14 4-3.5" />
      <circle cx="12" cy="14" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}
function IconChevron({ className, dir }: IconProps & { dir: "left" | "right" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...stroke} strokeWidth={2} aria-hidden="true">
      <path d={dir === "left" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"} />
    </svg>
  );
}

/* ── Piezas reutilizables ────────────────────────────────────────────────── */
function Kicker({ children, i = 0 }: { children: ReactNode; i?: number }) {
  return (
    <p
      className="bq-rise uppercase text-[11px] sm:text-[12px]"
      style={{ ...rise(i), fontFamily: MONO, color: CYAN, letterSpacing: "0.18em" }}
    >
      {children}
    </p>
  );
}

function Pill({
  tone,
  icon,
  children,
  size = "sm",
}: {
  tone: Tone;
  icon?: ReactNode;
  children: ReactNode;
  size?: "sm" | "md";
}) {
  const t = TONES[tone];
  const pad = size === "md" ? "px-5 py-2.5 text-[15px] sm:text-[17px]" : "px-3.5 py-1.5 text-[13px] sm:text-[14px]";
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full font-semibold ${pad}`}
      style={{ background: t.bg, color: t.fg }}
    >
      {icon ?? <span className="h-2 w-2 rounded-full" style={{ background: t.fg }} aria-hidden="true" />}
      {children}
    </span>
  );
}

function Bullet({ children }: { children: ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span
        className="mt-[9px] h-1.5 w-1.5 flex-none rounded-full"
        style={{ background: "#C9C9C9" }}
        aria-hidden="true"
      />
      <span className="text-[14.5px] sm:text-[16px] leading-snug text-[#141518]">{children}</span>
    </li>
  );
}

/* ── Slides ──────────────────────────────────────────────────────────────── */
function Slide1() {
  return (
    <div className="mx-auto flex max-w-[820px] flex-col items-center text-center">
      <Kicker i={0}>Clinera · Cuida tu WhatsApp</Kicker>
      <h1
        className="bq-rise mt-5 font-extrabold tracking-[-0.025em] text-[28px] leading-[1.08] sm:text-[42px] lg:text-[52px]"
        style={rise(1)}
      >
        Por qué un número de WhatsApp se bloquea{" "}
        <span style={{ color: CYAN }}>(y cómo lo evitamos contigo)</span>
      </h1>
      <p
        className="bq-rise mt-5 max-w-[560px] text-[16px] sm:text-[19px] leading-relaxed text-[#6B6B6B]"
        style={rise(2)}
      >
        Lo que toda clínica debería saber para no perder su número.
      </p>
    </div>
  );
}

function Slide2() {
  return (
    <div className="mx-auto flex w-full max-w-[940px] flex-col items-center text-center">
      <Kicker i={0}>Lo que pone en riesgo tu número</Kicker>
      <h2
        className="bq-rise mt-4 font-bold tracking-[-0.02em] text-[24px] leading-[1.12] sm:text-[34px] lg:text-[40px]"
        style={rise(1)}
      >
        Dos cosas ponen en riesgo tu número
      </h2>

      <div className="mt-8 grid w-full gap-4 text-left sm:grid-cols-2">
        {/* Bloque A — lo más grave (rojo) */}
        <div
          className="bq-rise flex flex-col rounded-xl border p-6 sm:p-7"
          style={{ ...rise(2), background: "#FDF6F6", borderColor: "#F1D6D8" }}
        >
          <Pill tone="red" icon={<IconStore className="h-4 w-4" />}>
            Usarlo como tienda
          </Pill>
          <p className="mt-4 text-[14.5px] sm:text-[16px] leading-snug text-[#141518]">
            Vender insumos médicos por el chat: medicamentos, botox, inyectables o dispositivos.
          </p>
          <p
            className="mt-3 text-[14.5px] sm:text-[16px] font-semibold leading-snug"
            style={{ color: TONES.red.fg }}
          >
            Esto puede desactivar la cuenta de inmediato y para siempre.
          </p>
        </div>

        {/* Bloque B — desgaste (amarillo) */}
        <div
          className="bq-rise flex flex-col rounded-xl border border-[#EAEAEA] bg-white p-6 sm:p-7"
          style={rise(3)}
        >
          <Pill tone="yellow" icon={<IconBroadcast className="h-4 w-4" />}>
            Mandar de más
          </Pill>
          <ul className="mt-4 flex flex-col gap-2.5">
            <Bullet>Demasiadas plantillas o difusiones masivas</Bullet>
            <Bullet>Recordatorios o promociones a quien no los pidió</Bullet>
            <Bullet>Mensajes que casi nadie abre ni responde</Bullet>
          </ul>
        </div>
      </div>

      <p
        className="bq-rise mt-6 max-w-[640px] text-[13.5px] sm:text-[15px] leading-relaxed text-[#6B6B6B]"
        style={rise(4)}
      >
        Lo primero te puede costar el número al instante. Lo segundo lo desgasta de a poco.
      </p>
    </div>
  );
}

function Slide3() {
  return (
    <div className="relative mx-auto flex max-w-[760px] flex-col items-center text-center">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 sm:h-[480px] sm:w-[480px]"
        style={{ background: "radial-gradient(circle, rgba(0,159,227,0.12), transparent 70%)" }}
      />
      <Kicker i={0}>El dato que nadie te dice</Kicker>
      <span
        className="bq-rise mt-3 block font-extrabold leading-[0.85] text-[110px] sm:text-[176px] lg:text-[212px]"
        style={{ ...rise(1), color: CYAN, letterSpacing: "-0.04em" }}
      >
        1%
      </span>
      <p
        className="bq-rise mt-4 max-w-[620px] text-[18px] sm:text-[23px] font-medium leading-snug tracking-[-0.01em]"
        style={rise(2)}
      >
        Con que solo el 1% de los pacientes que reciben un mensaje bloqueen el número, ya te baja la nota.
      </p>
      <p
        className="bq-rise mt-3 max-w-[540px] text-[14px] sm:text-[16px] leading-relaxed text-[#6B6B6B]"
        style={rise(3)}
      >
        Y si el número sigue acumulando bloqueos y reportes, con el tiempo WhatsApp lo termina bloqueando.
      </p>
    </div>
  );
}

function Slide4() {
  return (
    <div className="mx-auto flex max-w-[820px] flex-col items-center text-center">
      <Kicker i={0}>El estado de tu número</Kicker>
      <h2
        className="bq-rise mt-4 font-bold tracking-[-0.02em] text-[24px] leading-[1.12] sm:text-[34px] lg:text-[40px]"
        style={rise(1)}
      >
        Tu número tiene un semáforo
      </h2>
      <div className="bq-rise mt-8 flex flex-wrap items-center justify-center gap-3" style={rise(2)}>
        <Pill tone="green" size="md">
          Sano
        </Pill>
        <Pill tone="yellow" size="md">
          En aviso
        </Pill>
        <Pill tone="red" size="md">
          En riesgo
        </Pill>
      </div>
      <p
        className="bq-rise mt-8 max-w-[620px] text-[16px] sm:text-[19px] leading-snug text-[#141518]"
        style={rise(3)}
      >
        El problema: hoy no sabes en qué color estás. Una clínica puede estar en{" "}
        <span style={{ color: TONES.yellow.fg, fontWeight: 600 }}>amarillo</span> sin enterarse, hasta que es
        tarde.
      </p>
    </div>
  );
}

function Slide5() {
  return (
    <div className="mx-auto flex w-full max-w-[860px] flex-col items-center text-center">
      <Kicker i={0}>Lo que Clinera hace por ti</Kicker>
      <h2
        className="bq-rise mt-4 font-bold tracking-[-0.02em] text-[24px] leading-[1.12] sm:text-[34px] lg:text-[40px]"
        style={rise(1)}
      >
        Te ponemos un cortafuegos
      </h2>

      <div className="mt-8 grid w-full gap-4 text-left sm:grid-cols-2">
        <div className="bq-rise flex flex-col rounded-xl border border-[#EAEAEA] bg-white p-6 sm:p-7" style={rise(2)}>
          <span
            className="grid h-11 w-11 place-items-center rounded-xl"
            style={{ background: "#EAF7FD", color: CYAN }}
          >
            <IconShield className="h-5 w-5" />
          </span>
          <p className="mt-4 text-[15px] sm:text-[16.5px] leading-snug text-[#141518]">
            Clinera vigila y modera los envíos riesgosos para proteger tu número.
          </p>
        </div>
        <div className="bq-rise flex flex-col rounded-xl border border-[#EAEAEA] bg-white p-6 sm:p-7" style={rise(3)}>
          <span
            className="grid h-11 w-11 place-items-center rounded-xl"
            style={{ background: "#EAF7FD", color: CYAN }}
          >
            <IconGauge className="h-5 w-5" />
          </span>
          <p className="mt-4 text-[15px] sm:text-[16.5px] leading-snug text-[#141518]">
            Muy pronto vas a poder ver tu propio semáforo dentro de Clinera, en tiempo real.
          </p>
        </div>
      </div>

      <p className="bq-rise mt-7 max-w-[600px] text-[17px] sm:text-[21px] font-semibold leading-snug" style={rise(4)}>
        Tú atiendes pacientes. Nosotros cuidamos que tu número siga vivo.
      </p>

      <div className="bq-rise mt-7 flex items-center gap-2.5" style={rise(5)}>
        <span
          className="grid h-7 w-7 place-items-center rounded-lg text-[15px] font-bold text-white"
          style={{ background: CYAN }}
          aria-hidden="true"
        >
          C
        </span>
        <span className="text-[15px] font-semibold tracking-[-0.01em]">Clinera</span>
      </div>
    </div>
  );
}

const SLIDES = [Slide1, Slide2, Slide3, Slide4, Slide5];

/* ── Deck ────────────────────────────────────────────────────────────────── */
export default function BloqueosDeck() {
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const clamp = (n: number) => Math.max(0, Math.min(TOTAL - 1, n));
  const go = useCallback((n: number) => setCurrent(() => clamp(n)), []);
  const next = useCallback(() => setCurrent((c) => clamp(c + 1)), []);
  const prev = useCallback(() => setCurrent((c) => clamp(c - 1)), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "PageDown") next();
      else if (e.key === "ArrowLeft" || e.key === "PageUp") prev();
      else if (e.key === "Home") setCurrent(0);
      else if (e.key === "End") setCurrent(TOTAL - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) (dx < 0 ? next : prev)();
    touchStartX.current = null;
  };

  const Current = SLIDES[current];

  return (
    <div
      className="bq-deck relative flex min-h-[100dvh] flex-col overflow-hidden"
      style={{ background: "#FBFBFA", color: "#141518", fontFamily: SANS }}
      role="region"
      aria-roledescription="presentación"
      aria-label="Cuida tu WhatsApp"
    >
      <style>{`
        .bq-deck .bq-rise { opacity: 0; animation: bqRise .45s cubic-bezier(.16,1,.3,1) both; }
        @keyframes bqRise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
        .bq-deck :focus-visible { outline: 2px solid ${CYAN}; outline-offset: 3px; border-radius: 8px; }
        @media (prefers-reduced-motion: reduce) {
          .bq-deck .bq-rise { animation: none; opacity: 1; }
        }
      `}</style>

      <main
        className="flex flex-1 items-center justify-center px-5 pb-28 pt-10 sm:px-8"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div className="w-full max-w-[1040px]">
          <div
            key={current}
            className="flex flex-col justify-center lg:aspect-[16/9]"
            aria-roledescription="diapositiva"
            aria-label={`Diapositiva ${current + 1} de ${TOTAL}`}
            aria-live="polite"
          >
            <Current />
          </div>
        </div>
      </main>

      {/* Barra de navegación inferior */}
      <nav
        className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center"
        style={{ paddingBottom: "max(16px, env(safe-area-inset-bottom))" }}
        aria-label="Navegación de la presentación"
      >
        <div
          className="pointer-events-auto flex items-center gap-3 rounded-full border border-[#EAEAEA] px-3 py-2 sm:gap-4"
          style={{
            background: "rgba(255,255,255,0.82)",
            backdropFilter: "blur(14px) saturate(140%)",
            WebkitBackdropFilter: "blur(14px) saturate(140%)",
            boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
          }}
        >
          <button
            type="button"
            onClick={prev}
            disabled={current === 0}
            aria-label="Slide anterior"
            className="grid h-10 w-10 place-items-center rounded-full border border-[#EAEAEA] bg-white text-[#141518] transition active:scale-[0.94] disabled:cursor-not-allowed disabled:opacity-30"
          >
            <IconChevron dir="left" className="h-[18px] w-[18px]" />
          </button>

          <div className="flex items-center gap-2" role="tablist" aria-label="Ir a slide">
            {SLIDES.map((_, i) => {
              const active = i === current;
              return (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-label={`Ir al slide ${i + 1}`}
                  onClick={() => go(i)}
                  className="h-1.5 rounded-full transition-all duration-300"
                  style={{
                    width: active ? 24 : 6,
                    background: active ? CYAN : "#D4D4D4",
                  }}
                />
              );
            })}
          </div>

          <span
            className="tabular-nums text-[#6B6B6B]"
            style={{ fontFamily: MONO, fontSize: 12, letterSpacing: "0.04em" }}
            aria-hidden="true"
          >
            {String(current + 1).padStart(2, "0")} / {String(TOTAL).padStart(2, "0")}
          </span>

          <button
            type="button"
            onClick={next}
            disabled={current === TOTAL - 1}
            aria-label="Slide siguiente"
            className="grid h-10 w-10 place-items-center rounded-full border border-[#EAEAEA] bg-white text-[#141518] transition active:scale-[0.94] disabled:cursor-not-allowed disabled:opacity-30"
          >
            <IconChevron dir="right" className="h-[18px] w-[18px]" />
          </button>
        </div>
      </nav>
    </div>
  );
}
