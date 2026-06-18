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
   Estilo vía <style> scoped (.bq-*) + inline styles — el proyecto NO usa
   utilidades Tailwind, sino CSS propio + inline (igual que interior-v3).
   ────────────────────────────────────────────────────────────────────────── */

const TOTAL = 5;
const CYAN = "#009FE3";
const TONES = {
  green: { bg: "#EDF3EC", fg: "#2F6B30" },
  yellow: { bg: "#FBF3DB", fg: "#8A6D0F" },
  red: { bg: "#FDEBEC", fg: "#991B1B" },
} as const;
type Tone = keyof typeof TONES;

const rise = (i: number): CSSProperties => ({ animationDelay: `${i * 70}ms` });

/* ── Iconos (SVG inline con dimensiones explícitas, sin emojis) ──────────── */
type IconProps = { size?: number };
const sk = (w = 1.6) => ({
  fill: "none",
  stroke: "currentColor",
  strokeWidth: w,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

function IconStore({ size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...sk()} aria-hidden="true" style={{ flex: "none" }}>
      <path d="M4 9.5 5.2 5h13.6L20 9.5" />
      <path d="M4 9.5a2.4 2.4 0 0 0 4 0 2.4 2.4 0 0 0 4 0 2.4 2.4 0 0 0 4 0 2.4 2.4 0 0 0 4 0" />
      <path d="M5 11.5V19h14v-7.5" />
      <path d="M10 19v-4h4v4" />
    </svg>
  );
}
function IconBroadcast({ size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...sk()} aria-hidden="true" style={{ flex: "none" }}>
      <circle cx="12" cy="12" r="2" />
      <path d="M16.2 7.8a6 6 0 0 1 0 8.4M7.8 16.2a6 6 0 0 1 0-8.4" />
      <path d="M19 5a10 10 0 0 1 0 14M5 19A10 10 0 0 1 5 5" />
    </svg>
  );
}
function IconShield({ size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...sk()} aria-hidden="true" style={{ flex: "none" }}>
      <path d="M12 3 5 6v5c0 4.2 2.9 7.6 7 9 4.1-1.4 7-4.8 7-9V6l-7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
function IconGauge({ size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...sk()} aria-hidden="true" style={{ flex: "none" }}>
      <path d="M4 18a8 8 0 1 1 16 0" />
      <path d="m12 14 4-3.5" />
      <circle cx="12" cy="14" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}
function IconChevron({ dir, size = 18 }: IconProps & { dir: "left" | "right" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...sk(2)} aria-hidden="true">
      <path d={dir === "left" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"} />
    </svg>
  );
}

/* ── Piezas ──────────────────────────────────────────────────────────────── */
function Kicker({ children, i = 0 }: { children: ReactNode; i?: number }) {
  return (
    <p className="bq-rise bq-kicker" style={rise(i)}>
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
  return (
    <span
      className={size === "md" ? "bq-pill bq-pill--md" : "bq-pill"}
      style={{ background: t.bg, color: t.fg }}
    >
      {icon ?? <span className="bq-dotmark" style={{ background: t.fg }} aria-hidden="true" />}
      {children}
    </span>
  );
}

/* ── Slides ──────────────────────────────────────────────────────────────── */
function Slide1() {
  return (
    <div className="bq-slide" style={{ maxWidth: 840 }}>
      <Kicker i={0}>Clinera · Cuida tu WhatsApp</Kicker>
      <h1 className="bq-rise bq-title" style={{ ...rise(1), marginTop: 20 }}>
        Por qué un número de WhatsApp se bloquea{" "}
        <span style={{ color: CYAN }}>(y cómo lo evitamos contigo)</span>
      </h1>
      <p className="bq-rise bq-lead" style={{ ...rise(2), marginTop: 20, maxWidth: 540 }}>
        Lo que toda clínica debería saber para no perder su número.
      </p>
    </div>
  );
}

function Slide2() {
  return (
    <div className="bq-slide" style={{ maxWidth: 880 }}>
      <Kicker i={0}>Lo que pone en riesgo tu número</Kicker>
      <h2 className="bq-rise bq-h2" style={{ ...rise(1), marginTop: 14 }}>
        Dos cosas ponen en riesgo tu número
      </h2>

      <div className="bq-grid2" style={{ marginTop: 30, width: "100%", textAlign: "left" }}>
        <div className="bq-rise bq-card" style={{ ...rise(2), background: "#FDF6F6", borderColor: "#F1D6D8" }}>
          <Pill tone="red" icon={<IconStore size={16} />}>
            Usarlo como tienda
          </Pill>
          <p className="bq-card-text" style={{ marginTop: 16 }}>
            Vender insumos médicos por el chat: medicamentos, botox, inyectables o dispositivos.
          </p>
          <p className="bq-card-text" style={{ marginTop: 12, fontWeight: 600, color: TONES.red.fg }}>
            Esto puede desactivar la cuenta de inmediato y para siempre.
          </p>
        </div>

        <div className="bq-rise bq-card" style={rise(3)}>
          <Pill tone="yellow" icon={<IconBroadcast size={16} />}>
            Mandar de más
          </Pill>
          <ul className="bq-list" style={{ marginTop: 16 }}>
            <li>Demasiadas plantillas o difusiones masivas</li>
            <li>Recordatorios o promociones a quien no los pidió</li>
            <li>Mensajes que casi nadie abre ni responde</li>
          </ul>
        </div>
      </div>

      <p className="bq-rise bq-foot" style={{ ...rise(4), marginTop: 22, maxWidth: 640 }}>
        Lo primero te puede costar el número al instante. Lo segundo lo desgasta de a poco.
      </p>
    </div>
  );
}

function Slide3() {
  return (
    <div className="bq-slide" style={{ maxWidth: 760, position: "relative" }}>
      <div className="bq-glow" aria-hidden="true" />
      <Kicker i={0}>El dato que nadie te dice</Kicker>
      <span className="bq-rise bq-stat" style={{ ...rise(1), marginTop: 8 }}>
        1%
      </span>
      <p className="bq-rise bq-stat-lead" style={{ ...rise(2), marginTop: 12, maxWidth: 620 }}>
        Con que solo el 1% de los pacientes que reciben un mensaje bloqueen el número, ya te baja la nota.
      </p>
      <p className="bq-rise bq-lead" style={{ ...rise(3), marginTop: 14, maxWidth: 540, fontSize: 16 }}>
        Y si el número sigue acumulando bloqueos y reportes, con el tiempo WhatsApp lo termina bloqueando.
      </p>
    </div>
  );
}

function Slide4() {
  return (
    <div className="bq-slide" style={{ maxWidth: 820 }}>
      <Kicker i={0}>El estado de tu número</Kicker>
      <h2 className="bq-rise bq-h2" style={{ ...rise(1), marginTop: 14 }}>
        Tu número tiene un semáforo
      </h2>
      <div
        className="bq-rise"
        style={{ ...rise(2), marginTop: 30, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 12 }}
      >
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
      <p className="bq-rise bq-key" style={{ ...rise(3), marginTop: 30, maxWidth: 620 }}>
        El problema: hoy no sabes en qué color estás. Una clínica puede estar en{" "}
        <span style={{ color: TONES.yellow.fg, fontWeight: 600 }}>amarillo</span> sin enterarse, hasta que es
        tarde.
      </p>
    </div>
  );
}

function Slide5() {
  return (
    <div className="bq-slide" style={{ maxWidth: 860 }}>
      <Kicker i={0}>Lo que Clinera hace por ti</Kicker>
      <h2 className="bq-rise bq-h2" style={{ ...rise(1), marginTop: 14 }}>
        Te ponemos un cortafuegos
      </h2>

      <div className="bq-grid2" style={{ marginTop: 30, width: "100%", textAlign: "left" }}>
        <div className="bq-rise bq-card" style={rise(2)}>
          <span className="bq-iconbox">
            <IconShield size={20} />
          </span>
          <p className="bq-card-text" style={{ marginTop: 16 }}>
            Clinera vigila y modera los envíos riesgosos para proteger tu número.
          </p>
        </div>
        <div className="bq-rise bq-card" style={rise(3)}>
          <span className="bq-iconbox">
            <IconGauge size={20} />
          </span>
          <p className="bq-card-text" style={{ marginTop: 16 }}>
            Muy pronto vas a poder ver tu propio semáforo dentro de Clinera, en tiempo real.
          </p>
        </div>
      </div>

      <p className="bq-rise bq-key" style={{ ...rise(4), marginTop: 26, maxWidth: 600, fontWeight: 600 }}>
        Tú atiendes pacientes. Nosotros cuidamos que tu número siga vivo.
      </p>

      <div className="bq-rise bq-brand" style={{ ...rise(5), marginTop: 26 }}>
        <span className="bq-logo" aria-hidden="true">
          C
        </span>
        <span style={{ fontWeight: 600, letterSpacing: "-0.01em" }}>Clinera</span>
      </div>
    </div>
  );
}

const SLIDES = [Slide1, Slide2, Slide3, Slide4, Slide5];

/* ── CSS scoped ──────────────────────────────────────────────────────────── */
const CSS = `
.bq-deck{ position:relative; min-height:100dvh; display:flex; flex-direction:column;
  background:#FBFBFA; color:#141518; overflow:hidden;
  font-family:'Outfit', system-ui, -apple-system, sans-serif; }
.bq-stage{ flex:1; display:flex; align-items:center; justify-content:center;
  padding:84px 22px 120px; overflow-y:auto; }
.bq-frame{ width:100%; max-width:1000px; margin:0 auto; }
.bq-slide{ margin:0 auto; display:flex; flex-direction:column; align-items:center; text-align:center; }

.bq-kicker{ margin:0; font-family:'DM Mono', ui-monospace, monospace; font-size:12px;
  font-weight:500; letter-spacing:0.16em; text-transform:uppercase; color:${CYAN}; }
.bq-title{ margin:0; font-weight:800; letter-spacing:-0.025em; line-height:1.08;
  font-size:clamp(28px, 4.6vw, 52px); }
.bq-h2{ margin:0; font-weight:700; letter-spacing:-0.02em; line-height:1.12;
  font-size:clamp(25px, 3.8vw, 40px); }
.bq-lead{ margin:0; color:#6B6B6B; line-height:1.6; font-size:clamp(16px, 2vw, 19px); }
.bq-key{ margin:0; color:#141518; line-height:1.4; font-size:clamp(16px, 2.1vw, 20px); }
.bq-foot{ margin:0; color:#6B6B6B; line-height:1.55; font-size:clamp(13.5px, 1.6vw, 15.5px); }

.bq-stat{ display:block; font-weight:800; color:${CYAN}; letter-spacing:-0.045em;
  line-height:0.82; font-size:clamp(116px, 24vw, 232px); }
.bq-stat-lead{ margin:0; font-weight:500; letter-spacing:-0.01em; line-height:1.25;
  font-size:clamp(18px, 2.6vw, 23px); }
.bq-glow{ position:absolute; left:50%; top:42%; width:clamp(320px,46vw,520px);
  height:clamp(320px,46vw,520px); transform:translate(-50%,-50%); z-index:0;
  background:radial-gradient(circle, rgba(0,159,227,0.13), transparent 70%); pointer-events:none; }
.bq-slide > *:not(.bq-glow){ position:relative; z-index:1; }

.bq-grid2{ display:grid; gap:16px; grid-template-columns:1fr; }
@media (min-width:720px){ .bq-grid2{ grid-template-columns:1fr 1fr; } }
.bq-card{ background:#fff; border:1px solid #EAEAEA; border-radius:16px; padding:26px;
  display:flex; flex-direction:column; box-shadow:0 1px 2px rgba(0,0,0,0.04); }
.bq-card-text{ margin:0; color:#141518; line-height:1.45; font-size:clamp(14.5px,1.7vw,16.5px); }
.bq-list{ margin:0; padding:0; list-style:none; display:flex; flex-direction:column; gap:11px; }
.bq-list li{ position:relative; padding-left:18px; color:#141518; line-height:1.4;
  font-size:clamp(14.5px,1.7vw,16px); }
.bq-list li::before{ content:""; position:absolute; left:0; top:9px; width:6px; height:6px;
  border-radius:50%; background:#C9C9C9; }

.bq-pill{ display:inline-flex; align-self:flex-start; align-items:center; gap:8px;
  border-radius:999px; font-weight:600; padding:7px 15px; font-size:14px; line-height:1; }
.bq-pill--md{ padding:11px 22px; font-size:clamp(15px,1.8vw,17px); }
.bq-dotmark{ width:8px; height:8px; border-radius:50%; flex:none; }

.bq-iconbox{ width:44px; height:44px; border-radius:12px; display:grid; place-items:center;
  background:#EAF7FD; color:${CYAN}; }

.bq-brand{ display:flex; align-items:center; gap:10px; }
.bq-logo{ width:28px; height:28px; border-radius:9px; display:grid; place-items:center;
  background:${CYAN}; color:#fff; font-weight:700; font-size:15px; }

.bq-rise{ opacity:0; animation:bqRise .45s cubic-bezier(.16,1,.3,1) both; }
@keyframes bqRise{ from{ opacity:0; transform:translateY(14px);} to{ opacity:1; transform:none; } }

.bq-nav{ position:fixed; left:0; right:0; bottom:0; z-index:40; display:flex; justify-content:center;
  padding-bottom:max(16px, env(safe-area-inset-bottom)); pointer-events:none; }
.bq-navbar{ pointer-events:auto; display:flex; align-items:center; gap:12px;
  border:1px solid #EAEAEA; border-radius:999px; padding:8px 12px;
  background:rgba(255,255,255,0.82); -webkit-backdrop-filter:blur(14px) saturate(140%);
  backdrop-filter:blur(14px) saturate(140%); box-shadow:0 1px 2px rgba(0,0,0,0.04); }
.bq-navbtn{ width:40px; height:40px; border-radius:999px; border:1px solid #EAEAEA;
  background:#fff; display:grid; place-items:center; color:#141518; cursor:pointer; padding:0;
  transition:transform .15s ease, border-color .2s ease; }
.bq-navbtn:hover:not(:disabled){ border-color:rgba(0,159,227,.45); }
.bq-navbtn:active:not(:disabled){ transform:scale(.94); }
.bq-navbtn:disabled{ opacity:.3; cursor:not-allowed; }
.bq-dots{ display:flex; align-items:center; gap:7px; }
.bq-dot{ height:6px; width:6px; border-radius:999px; background:#D4D4D4; border:0; padding:0;
  cursor:pointer; transition:width .3s ease, background .3s ease; }
.bq-dot.is-active{ width:24px; background:${CYAN}; }
.bq-counter{ font-family:'DM Mono', ui-monospace, monospace; font-size:12px; letter-spacing:.04em;
  color:#6B6B6B; font-variant-numeric:tabular-nums; }

.bq-deck :focus-visible{ outline:2px solid ${CYAN}; outline-offset:3px; border-radius:8px; }
@media (prefers-reduced-motion: reduce){ .bq-rise{ animation:none; opacity:1; } }
@media (max-width:520px){
  .bq-stage{ padding:64px 18px 104px; }
  .bq-card{ padding:22px; }
  .bq-counter{ display:none; }
}
`;

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
      className="bq-deck"
      role="region"
      aria-roledescription="presentación"
      aria-label="Cuida tu WhatsApp"
    >
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="bq-stage" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <div className="bq-frame">
          <div
            key={current}
            aria-roledescription="diapositiva"
            aria-label={`Diapositiva ${current + 1} de ${TOTAL}`}
            aria-live="polite"
          >
            <Current />
          </div>
        </div>
      </div>

      <nav className="bq-nav" aria-label="Navegación de la presentación">
        <div className="bq-navbar">
          <button
            type="button"
            className="bq-navbtn"
            onClick={prev}
            disabled={current === 0}
            aria-label="Slide anterior"
          >
            <IconChevron dir="left" />
          </button>

          <div className="bq-dots" role="tablist" aria-label="Ir a slide">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === current}
                aria-label={`Ir al slide ${i + 1}`}
                onClick={() => go(i)}
                className={i === current ? "bq-dot is-active" : "bq-dot"}
              />
            ))}
          </div>

          <span className="bq-counter" aria-hidden="true">
            {String(current + 1).padStart(2, "0")} / {String(TOTAL).padStart(2, "0")}
          </span>

          <button
            type="button"
            className="bq-navbtn"
            onClick={next}
            disabled={current === TOTAL - 1}
            aria-label="Slide siguiente"
          >
            <IconChevron dir="right" />
          </button>
        </div>
      </nav>
    </div>
  );
}
