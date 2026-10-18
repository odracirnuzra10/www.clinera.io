"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./HeroCarousel.module.css";

/* Carrusel del hero: siete vistas del producto rotando en la misma ventana (o el
   subconjunto que pida `only`).
   Muestra qué es Clinera O.S. en vez de describirlo.

   Cada vista arma sus elementos en cascada al entrar (las animaciones cuelgan
   de .slideOn en el CSS, así que se reinician cada vez que la vista se activa)
   y la barra del tab activo avanza durante el ciclo para que se vea que la
   siguiente vista viene sola. */

const VIEWS = [
  { id: "aura", label: "WhatsApp con IA", url: "app.clinera.io / conversaciones", hold: 9200 },
  { id: "intelligence", label: "Intelligence", url: "app.clinera.io / intelligence", hold: 6200 },
  { id: "creditos", label: "Créditos", url: "app.clinera.io / consumo", hold: 7200 },
  { id: "red", label: "Consolidado", url: "app.clinera.io / consolidado-red", hold: 6000 },
  { id: "ficha", label: "Ficha clínica", url: "app.clinera.io / pacientes / ficha", hold: 6400 },
  { id: "odonto", label: "Odontograma", url: "app.clinera.io / pacientes / odontograma", hold: 6000 },
  { id: "corporal", label: "Ficha corporal", url: "app.clinera.io / pacientes / evaluacion", hold: 6200 },
] as const;

export type HeroViewId = (typeof VIEWS)[number]["id"];

function Check() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" width="15" height="15" fill="none">
      <path d="m5 10 3 3 7-7" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* El total de Intelligence sube desde cero cada vez que la vista entra: es el
   dato que el ojo persigue y quieto se ve como una captura. */
function CountUp({
  value,
  run,
  prefix = "$",
}: {
  value: number;
  run: number;
  prefix?: string;
}) {
  const [shown, setShown] = useState(value);

  useEffect(() => {
    // Sin animación el estado ya arranca en el valor final.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const start = performance.now();
    const duration = 950;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setShown(Math.round(value * eased));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, run]);

  return (
    <>
      {prefix}
      {shown.toLocaleString("es-CL")}
    </>
  );
}

function NetworkView() {
  return (
    <div className={styles.view}>
      <div className={styles.viewHead}>
        <div>
          <span className={styles.eyebrow}>Consolidado de red</span>
          <strong>3 sedes · este mes</strong>
        </div>
        <span className={styles.synced}>Sincronizado hace 40 s</span>
      </div>

      <div className={styles.kpiGrid}>
        <div><span>Citas</span><strong>2.347</strong><small>+11,4%</small></div>
        <div><span>Ocupación</span><strong>83%</strong><small>+6 pts</small></div>
        <div><span>No-show</span><strong>6,1%</strong><small>−8,3 pts</small></div>
        <div><span>Recuperados</span><strong>184</strong><small>por IA</small></div>
      </div>

      <div className={styles.branchList}>
        <div><span><i className={styles.dotViolet} />Providencia</span><b><i style={{ width: "88%" }} /></b><small>88%</small></div>
        <div><span><i className={styles.dotBlue} />Las Condes</span><b><i style={{ width: "81%" }} /></b><small>81%</small></div>
        <div><span><i className={styles.dotMagenta} />Viña del Mar</span><b><i style={{ width: "74%" }} /></b><small>74%</small></div>
      </div>
    </div>
  );
}

function AuraView() {
  return (
    <div className={styles.view}>
      <div className={styles.viewHead}>
        <div>
          <span className={styles.eyebrow}>AURA · WhatsApp</span>
          <strong>Atiende las 3 sedes · 24/7</strong>
        </div>
        <span className={styles.livePill}><i />En línea</span>
      </div>

      <div className={styles.thread}>
        <p className={styles.incoming}>Hola, ¿tienen hora mañana en Las Condes?</p>
        {/* El "escribiendo" se apaga justo cuando aparece la respuesta: es lo
            que hace que la conversación se lea en vivo y no como captura. */}
        <span className={styles.typing} aria-hidden="true"><i /><i /><i /></span>
        <p className={styles.outgoing}>Sí: mañana 10:00 con la Dra. Meza. ¿Se la agendo?</p>
        <p className={styles.incoming}>Dale, perfecto</p>
        <span className={styles.systemEvent}>
          <Check />Cita agendada en el sistema · jue 10:00 · Dra. Meza
        </span>
      </div>

      <div className={styles.callRow}>
        <span className={styles.avatar}>MR</span>
        <div><strong>Sra. Rojas</strong><small>llamada de confirmación · 00:14</small></div>
        <span className={styles.wave} aria-hidden="true"><i /><i /><i /><i /><i /></span>
      </div>

      <div className={styles.result}><Check />14 citas agendadas hoy sin intervención del equipo</div>
    </div>
  );
}

function ChartView() {
  return (
    <div className={styles.view}>
      <div className={styles.viewHead}>
        <div>
          <span className={styles.eyebrow}>Ficha clínica</span>
          <strong>Carla Mendieta · 34 años</strong>
        </div>
        <span className={styles.tagOk}><Check />Consentimiento firmado</span>
      </div>

      <div className={styles.chips}>
        <span>Última visita: 14 ago</span>
        <span>Plan: 6 sesiones</span>
        <span>Alergias: ninguna</span>
      </div>

      <ul className={styles.timeline}>
        <li>
          <span className={styles.tlDate}>14 ago</span>
          <div><strong>Sesión 4 · Rejuvenecimiento facial</strong><small>Dra. Javiera Solís · evolución favorable</small></div>
        </li>
        <li>
          <span className={styles.tlDate}>31 jul</span>
          <div><strong>Control post-tratamiento</strong><small>Sin reacciones adversas</small></div>
        </li>
        <li>
          <span className={styles.tlDate}>17 jul</span>
          <div><strong>Exámenes cargados</strong><small>2 archivos · revisados</small></div>
        </li>
      </ul>

      <div className={styles.nextUp}>
        <Check />Próximo control agendado por AURA · 28 ago 11:30
      </div>
    </div>
  );
}

/* ---------- Odontograma ---------- */

function OdontogramView() {
  return (
    <div className={styles.view}>
      <div className={styles.viewHead}>
        <div>
          <span className={styles.eyebrow}>Odontograma</span>
          <strong>Tomás Errázuriz · pieza 1.6</strong>
        </div>
        <span className={styles.tagOk}><Check />Actualizado hoy</span>
      </div>

      <figure className={styles.odontoShot}>
        <Image
          src="/presentacion/odontograma.webp"
          alt="Odontograma con hallazgos por pieza y por cara"
          width={708}
          height={478}
          sizes="(max-width: 720px) 100vw, 540px"
          style={{ width: "100%", height: "auto" }}
        />
      </figure>

      <div className={styles.nextUp}>
        <Check />Presupuesto de 1.6 enviado por WhatsApp · pendiente de aprobación
      </div>
    </div>
  );
}

/* ---------- Ficha corporal ---------- */

function BodyChartView() {
  return (
    <div className={styles.view}>
      <div className={styles.viewHead}>
        <div>
          <span className={styles.eyebrow}>Ficha corporal</span>
          <strong>Matías Fuentes · 41 años</strong>
        </div>
        <span className={styles.livePill}><i />Reducción localizada</span>
      </div>

      {/* Evaluación corporal real del producto, encuadrada en las figuras;
          el detalle del plan va al lado para aprovechar el ancho. */}
      <div className={styles.bodyCard}>
        <figure className={styles.bodyShot}>
          <Image
            src="/presentacion/eval-corporal.jpg"
            alt="Evaluación corporal con abdomen, flancos y muslos marcados"
            width={1600}
            height={1022}
            sizes="260px"
          />
          <span className={styles.scan} aria-hidden="true" />
        </figure>

        <div className={styles.bodyPanel}>
          <span className={styles.panelLabel}>Zonas evaluadas</span>
          <ul className={styles.zoneList}>
            <li><i className={styles.zAbdomen} />Abdomen<b>3 sesiones</b></li>
            <li><i className={styles.zFlank} />Flancos<b>2 sesiones</b></li>
            <li><i className={styles.zThigh} />Muslos<b>1 sesión</b></li>
          </ul>
          <dl className={styles.panelMeta}>
            <div><dt>Plan</dt><dd>Reducción localizada</dd></div>
            <div><dt>Próxima</dt><dd>jue 14:30 · Dra. Reyes</dd></div>
          </dl>
        </div>
      </div>

      <div className={styles.nextUp}>
        <Check />Zonas leídas por AURA desde el chat · próxima sesión jue 14:30
      </div>
    </div>
  );
}

/* ---------- Intelligence ---------- */

function IntelligenceView({ run }: { run: number }) {
  return (
    <div className={styles.view}>
      <div className={styles.viewHead}>
        <div>
          <span className={styles.eyebrow}>Clinera Intelligence</span>
          <strong>Tu agente interno</strong>
        </div>
        <span className={styles.livePill}><i />Datos en vivo</span>
      </div>

      <p className={styles.question}>¿Cuánto vendimos hoy y qué tratamiento lidera?</p>

      <div className={styles.answer}>
        <strong className={styles.answerTotal}><CountUp value={4180000} run={run} /></strong>
        <small>32 tratamientos cerrados · +14% vs. mismo día del mes pasado</small>
        <div className={styles.bars}>
          <div><span>Rejuvenecimiento</span><b><i style={{ width: "100%" }} /></b><small>$1.840.000</small></div>
          <div><span>Depilación láser</span><b><i style={{ width: "62%" }} /></b><small>$1.140.000</small></div>
          <div><span>Limpieza facial</span><b><i style={{ width: "34%" }} /></b><small>$620.000</small></div>
        </div>
      </div>

      <div className={styles.result}><Check />Sin reportes manuales ni planillas</div>
    </div>
  );
}

/* ---------- Créditos / consumo ---------- */

function CreditsView({ run }: { run: number }) {
  return (
    <div className={styles.view}>
      <div className={styles.viewHead}>
        <div>
          <span className={styles.eyebrow}>Consumo · Vortex</span>
          <strong>Bolsa de créditos · este mes</strong>
        </div>
        <span className={styles.livePill}><i />En vivo</span>
      </div>

      <div className={styles.creditsBag}>
        <div className={styles.creditsRemain}>
          <span>Disponibles</span>
          <strong>
            <CountUp value={11840} run={run} prefix="" />
          </strong>
          <small>de 10.000 · Vortex</small>
        </div>
        <div className={styles.creditsMeter} aria-hidden="true">
          <div className={styles.creditsMeterTrack}>
            <i className={styles.creditsMeterFill} style={{ width: "68%" }} />
            <span className={styles.creditsMeterMark} style={{ left: "80%" }} title="Aviso 80%" />
          </div>
          <div className={styles.creditsMeterLabels}>
            <span>0</span>
            <span>80% aviso</span>
            <span>100%</span>
          </div>
        </div>
      </div>

      <div className={styles.creditTariffs}>
        <div><span>Texto</span><strong>30</strong><small>sin cita</small></div>
        <div><span>Agenda</span><strong>195</strong><small>cita</small></div>
        <div><span>Voz</span><strong>25</strong><small>/ min</small></div>
        <div><span>LIA</span><strong>0</strong><small>fiscaliza</small></div>
      </div>

      <ul className={styles.creditFeed}>
        <li>
          <span className={styles.creditFeedWho}>AURA</span>
          <span>Agendó Dra. Meza · 10:00</span>
          <b>−195</b>
        </li>
        <li>
          <span className={styles.creditFeedWhoCam}>CAMILA</span>
          <span>Confirmación · 2 min</span>
          <b>−50</b>
        </li>
        <li>
          <span className={styles.creditFeedWho}>AURA</span>
          <span>Consulta de horario</span>
          <b>−30</b>
        </li>
      </ul>

      <div className={styles.result}>
        <Check />Aviso al 80% y al 100% · sin corte silencioso
      </div>
    </div>
  );
}

/* `only` recorta el carrusel a un subconjunto de vistas, en el orden pedido: el
   wizard de /agenda muestra sólo las vistas del paso en que va el visitante. Sin
   la prop se ven las seis, que es lo que hace /plataforma. */
export default function HeroCarousel({ only }: { only?: readonly HeroViewId[] } = {}) {
  const views = useMemo(
    () => {
      const picked = only ? only.map((id) => VIEWS.find((v) => v.id === id)).filter((v) => !!v) : [];
      return picked.length ? picked : [...VIEWS];
    },
    [only],
  );
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  // Cambia en cada arranque de ciclo: reinicia la barra de progreso y el
  // contador sin desincronizarse del temporizador.
  const [run, setRun] = useState(0);
  const [playing, setPlaying] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  // Las escenas se reproducen sólo mientras la ventana está a la vista: si
  // rotara desde la carga, quien llega scrolleando se pierde la animación.
  useEffect(() => {
    const el = frameRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setPlaying(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => setPlaying(entry.isIntersecting),
      { threshold: 0.45 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (paused || !playing || reduced.current) return;
    const t = setTimeout(() => setActive((i) => (i + 1) % views.length), views[active].hold);
    return () => clearTimeout(t);
  }, [active, paused, playing, run, views]);

  const next = views[(active + 1) % views.length].label;

  return (
    <div
      ref={frameRef}
      className={playing ? `${styles.frame} ${styles.playing}` : styles.frame}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => {
        setPaused(false);
        setRun((r) => r + 1);
      }}
    >
      <div className={styles.bar}>
        <span className={styles.dots} aria-hidden="true"><i /><i /><i /></span>
        <span className={styles.url}>{views[active].url}</span>
        <span className={styles.badge}><i /> IA activa</span>
      </div>

      <div className={styles.stage}>
        {views.map((v, i) => (
          <div
            key={v.id}
            className={i === active ? `${styles.slide} ${styles.slideOn}` : styles.slide}
            aria-hidden={i !== active}
            inert={i !== active}
          >
            {v.id === "red" && <NetworkView />}
            {v.id === "aura" && <AuraView />}
            {v.id === "ficha" && <ChartView />}
            {v.id === "odonto" && <OdontogramView />}
            {v.id === "corporal" && <BodyChartView />}
            {v.id === "intelligence" && <IntelligenceView run={playing ? run : -1} />}
            {v.id === "creditos" && <CreditsView run={playing ? run : -1} />}
          </div>
        ))}
      </div>

      <div className={styles.tabs} role="tablist" aria-label="Vistas de Clinera">
        {views.map((v, i) => (
          <button
            key={v.id}
            type="button"
            role="tab"
            aria-selected={i === active}
            className={i === active ? `${styles.tab} ${styles.tabOn}` : styles.tab}
            onClick={() => {
              setActive(i);
              setRun((r) => r + 1);
            }}
          >
            {v.label}
          </button>
        ))}
      </div>

      <p className={styles.note}>
        <span>Vistas de ejemplo con datos de demostración.</span>
        <span className={styles.upNext}>
          {paused ? (
            "En pausa"
          ) : (
            <>
              <i className={styles.upNextDot} aria-hidden="true" />
              Sigue: {next}
            </>
          )}
        </span>
      </p>

      <div className={styles.progressTrack} aria-hidden="true">
        {/* La key incluye la vista: al rotar sola, la barra debe volver a cero. */}
        <i
          key={`${active}-${run}`}
          className={styles.progressFill}
          style={{
            animationDuration: `${views[active].hold}ms`,
            animationPlayState: paused || !playing ? "paused" : "running",
          }}
        />
      </div>
    </div>
  );
}
