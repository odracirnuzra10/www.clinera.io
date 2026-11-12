"use client";

// Demo viva del home (Ricardo, 12-nov-2026): copia de la caja [data-demo-viva] de /prueba-gratis
// (public/kimi-gratis/index.html). El doctor escribe el nombre de su clínica y ve a la IA agendar
// con ese nombre. Todo pasa en el navegador: no envía nada, solo un `demo_viva` al dataLayer.
// El botón final es un «Regístrate gratis» con data-clinica: RegistroModal lo pasa a app.clinera.io.

import { useEffect, useRef, useState, type FormEvent } from "react";
import { registroHref } from "@/components/cta/CtaPar";
import s from "./DemoViva.module.css";

const TIPOS = {
  estetica: { nombre: "Estética", pide: "una evaluación", cita: "Evaluación", pago: "Paga tu evaluación aquí:" },
  medica: { nombre: "Médica", pide: "una consulta", cita: "Consulta", pago: "Confirma tu hora aquí:" },
  dental: { nombre: "Dental", pide: "una evaluación dental", cita: "Evaluación dental", pago: "Paga tu evaluación aquí:" },
  kine: { nombre: "Kinesiología", pide: "una sesión de kinesiología", cita: "Sesión de kinesiología", pago: "Confirma tu hora aquí:" },
  psico: { nombre: "Psicología", pide: "una primera sesión", cita: "Primera sesión", pago: "Confirma tu hora aquí:" },
  otra: { nombre: "Otra", pide: "una hora", cita: "Atención", pago: "Confirma tu hora aquí:" },
} as const;
type Tipo = keyof typeof TIPOS;

const PASO_MS = 900;

export default function DemoViva() {
  const [nombre, setNombre] = useState("");
  const [tipo, setTipo] = useState<Tipo>("estetica");
  const [clinica, setClinica] = useState(""); // la de la demo en curso
  const [visto, setVisto] = useState(5); // en reposo se ve la conversación completa
  const [error, setError] = useState(false);
  const relojes = useRef<number[]>([]);

  useEffect(() => () => relojes.current.forEach(clearTimeout), []);

  const t = TIPOS[tipo];
  const n = clinica || "tu clínica";
  const mensajes = clinica
    ? {
        p1: `Hola, ¿es ${n}? Quiero pedir ${t.pide}.`,
        a1: `¡Hola! Sí, soy la asistente de ${n}. Tengo mañana 10:00 u 11:30. ¿Cuál te acomoda?`,
        a2: `Listo, 11:30 reservada en ${n}. ${t.pago}`,
        ag: t.cita,
        est: /Paga/.test(t.pago) ? "Pagada ✓" : "Confirmada ✓",
      }
    : {
        p1: "Hola, quiero pedir una hora para evaluación.",
        a1: "Tengo mañana 10:00 u 11:30. ¿Cuál te acomoda?",
        a2: "Listo, 11:30 reservada. Paga tu evaluación aquí:",
        ag: "Evaluación",
        est: "Pagada ✓",
      };

  function probar(e: FormEvent) {
    e.preventDefault();
    const limpio = nombre.replace(/\s+/g, " ").trim();
    if (limpio.length < 2) {
      setError(true);
      return;
    }
    setError(false);
    setClinica(limpio);
    relojes.current.forEach(clearTimeout);
    relojes.current = [];
    const quieto = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (quieto) {
      setVisto(5);
    } else {
      setVisto(0);
      for (let i = 1; i <= 5; i++) {
        relojes.current.push(window.setTimeout(() => setVisto(i), 350 + (i - 1) * PASO_MS));
      }
    }
    try {
      const w = window as unknown as { dataLayer?: unknown[] };
      (w.dataLayer = w.dataLayer || []).push({ event: "demo_viva", tipo_clinica: tipo, source_path: "/" });
    } catch {}
  }

  const ver = (i: number) => (visto >= i ? `${s.anim} ${s.visto}` : s.anim);

  return (
    <div className={s.caja} data-demo-viva>
      <form className={s.form} onSubmit={probar} noValidate>
        <label className={s.label}>
          <b>Pruébalo con tu clínica</b>
          <span>Escribe su nombre y mira cómo respondería la IA.</span>
        </label>
        <div className={s.fila}>
          <input
            aria-label="Nombre de tu clínica"
            aria-invalid={error || undefined}
            placeholder="Nombre de tu clínica"
            value={nombre}
            maxLength={60}
            onChange={(e) => setNombre(e.target.value)}
          />
          <select aria-label="Tipo de clínica" value={tipo} onChange={(e) => setTipo(e.target.value as Tipo)}>
            {(Object.keys(TIPOS) as Tipo[]).map((k) => (
              <option key={k} value={k}>
                {TIPOS[k].nombre}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className={s.probar} data-demo-probar>
          Ver la demo
        </button>
      </form>

      <div className={s.chat} role="img" aria-label="Ejemplo de conversación por WhatsApp: la paciente pide hora, la IA ofrece horarios de la agenda y deja la cita reservada.">
        <p className={s.titulo} data-demo-titulo>
          <span className={s.punto} aria-hidden /> {clinica ? `WhatsApp de ${clinica}` : "La IA atiende en tus canales"}
        </p>
        <p className={`${s.msg} ${s.p} ${ver(1)}`}>{mensajes.p1}</p>
        <p className={`${s.msg} ${s.a} ${ver(2)}`}>
          <span className={s.ia}>IA</span> {mensajes.a1}
        </p>
        <p className={`${s.msg} ${s.p} ${ver(3)}`}>Mañana 11:30, por favor.</p>
        <p className={`${s.msg} ${s.a} ${ver(4)}`}>
          <span className={s.ia}>IA</span> {mensajes.a2} <u>link de pago</u>
        </p>
        <p className={`${s.agenda} ${ver(5)}`}>
          <span className={s.dot} aria-hidden />
          <b>Mañana 11:30</b> · {mensajes.ag} · <span className={s.pagada}>{mensajes.est}</span>
        </p>
      </div>

      {clinica && visto >= 5 ? (
        <div className={s.fin} data-demo-fin>
          <p>
            <b>Así atendería Clinera a los pacientes de {clinica}.</b> A toda hora, sin que nadie de tu equipo escriba.
          </p>
          <a
            href={registroHref("")}
            data-cta-registro
            data-clinica={clinica}
            data-demo-activar
            className={s.activar}
          >
            Actívalo en tu clínica <span className={s.chip}>GRATIS</span>
          </a>
        </div>
      ) : null}
    </div>
  );
}
