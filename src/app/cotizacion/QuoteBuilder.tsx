"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import {
  ANNUAL_DISCOUNT_PERCENT,
  ANNUAL_MONTHS,
  CLINERA_PLANS,
  EXTRA_CREDIT_PACK_CREDITS,
  EXTRA_CREDIT_PACK_USD,
  EXTRA_USER_USD,
  SEMESTER_DISCOUNT_PERCENT,
  SEMESTER_MONTHS,
  SETUP_FEE_USD,
  planPeriodTotal,
  type Billing,
} from "@/content/pricing";
import styles from "./cotizacion.module.css";

type Discounts = {
  plan: number;
  users: number;
  credits: number;
  setup: number;
  global: number;
};

type QuoteBuilderProps = {
  initialDate: string;
  initialValidUntil: string;
  initialQuoteNumber: string;
};

type QuoteRow = {
  id: "plan" | "users" | "credits" | "setup";
  name: string;
  detail: string;
  quantity: string;
  base: number;
  discount: number;
  total: number;
};

const DEFAULT_NOTES =
  "La fecha de inicio del servicio se coordina según disponibilidad del equipo de implementación.";

const clampPercent = (value: number) => Math.min(100, Math.max(0, value || 0));
const applyDiscount = (amount: number, discount: number) =>
  amount * (1 - clampPercent(discount) / 100);

const formatUsd = (value: number) =>
  new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

const formatNumber = (value: number) =>
  new Intl.NumberFormat("es-CL", { maximumFractionDigits: 0 }).format(value);

const formatDate = (value: string) => {
  if (!value) return "Por definir";
  return new Intl.DateTimeFormat("es-CL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${value}T12:00:00`));
};

function DiscountField({
  label,
  value,
  onChange,
  disabled = false,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}) {
  return (
    <label className={`${styles.discountField} ${disabled ? styles.discountDisabled : ""}`}>
      <span>{label}</span>
      <span className={styles.percentInput}>
        <input
          type="number"
          min="0"
          max="100"
          step="1"
          value={value}
          disabled={disabled}
          onChange={(event) => onChange(clampPercent(Number(event.target.value)))}
          aria-label={`Descuento para ${label}`}
        />
        <span aria-hidden="true">%</span>
      </span>
    </label>
  );
}

function QuantityControl({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  const update = (next: number) => onChange(Math.min(999, Math.max(0, next || 0)));

  return (
    <div className={styles.quantityControl}>
      <button type="button" onClick={() => update(value - 1)} aria-label={`Restar ${label}`}>
        <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
          <path d="M2.25 7h9.5" />
        </svg>
      </button>
      <input
        type="number"
        min="0"
        max="999"
        value={value}
        onChange={(event) => update(Number(event.target.value))}
        aria-label={label}
      />
      <button type="button" onClick={() => update(value + 1)} aria-label={`Sumar ${label}`}>
        <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
          <path d="M7 2.25v9.5M2.25 7h9.5" />
        </svg>
      </button>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "email" | "tel" | "date";
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className={styles.field}>
      <span>
        {label}
        {required && <small>Requerido</small>}
      </span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        required={required}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

export default function QuoteBuilder({
  initialDate,
  initialValidUntil,
  initialQuoteNumber,
}: QuoteBuilderProps) {
  const [clientName, setClientName] = useState("Clínica Estética Aurora");
  const [clientEmail, setClientEmail] = useState("");
  const [quoteOwner, setQuoteOwner] = useState("Catalina Fuentes");
  const [ownerEmail, setOwnerEmail] = useState("catalina.fuentes@oacg.cl");
  const [ownerPhone, setOwnerPhone] = useState("+56 9 7882 4985");
  const [quoteNumber, setQuoteNumber] = useState(initialQuoteNumber);
  const [quoteDate, setQuoteDate] = useState(initialDate);
  const [validUntil, setValidUntil] = useState(initialValidUntil);
  const [selectedPlanId, setSelectedPlanId] =
    useState<(typeof CLINERA_PLANS)[number]["id"]>("atlas");
  const [billing, setBilling] = useState<Billing>("annual");
  const [extraUsers, setExtraUsers] = useState(0);
  const [extraCreditPacks, setExtraCreditPacks] = useState(0);
  const [includeSetup, setIncludeSetup] = useState(true);
  const [discounts, setDiscounts] = useState<Discounts>({
    plan: 0,
    users: 0,
    credits: 0,
    setup: 0,
    global: 0,
  });
  const [notes, setNotes] = useState(DEFAULT_NOTES);
  const [copyState, setCopyState] = useState<"idle" | "copied">("idle");

  // ── Link de pago en línea ─────────────────────────────────────────────────
  // El link se imprime dentro de la cotización: el cliente paga desde el PDF
  // y la firma del contrato se gestiona después, como paso secundario.
  const [linkPago, setLinkPago] = useState<{ id: string; url: string; config: string; correo?: string } | null>(
    null,
  );
  const [generandoLink, setGenerandoLink] = useState(false);
  const [errorLink, setErrorLink] = useState("");
  const [pedirClave, setPedirClave] = useState(false);
  const [claveFirma, setClaveFirma] = useState("");
  const [copiadoLink, setCopiadoLink] = useState(false);
  const [duracionTipo, setDuracionTipo] = useState<"primer_pago" | "meses" | "siempre">(
    "primer_pago",
  );
  const [duracionMeses, setDuracionMeses] = useState(6);

  const seccionCierreRef = useRef<HTMLElement>(null);

  const selectedPlan =
    CLINERA_PLANS.find((plan) => plan.id === selectedPlanId) ?? CLINERA_PLANS[0];
  const isAnnual = billing === "annual";
  const periodMonths = isAnnual ? ANNUAL_MONTHS : billing === "semester" ? SEMESTER_MONTHS : 1;
  const periodLabel = isAnnual ? "Anual" : billing === "semester" ? "Semestral" : "Mensual";
  // Semestral y anual incluyen la implementación: el checkbox queda anulado
  // para que la cotización no prometa un cobro que Stripe no hará.
  const freeSetup = billing !== "monthly";
  const setupCharged = includeSetup && !freeSetup;

  const rows = useMemo<QuoteRow[]>(() => {
    const planBase = planPeriodTotal(selectedPlan, billing);
    const userBase = extraUsers * EXTRA_USER_USD * periodMonths;
    const creditBase = extraCreditPacks * EXTRA_CREDIT_PACK_USD * periodMonths;

    return [
      {
        id: "plan",
        name: `Plan ${selectedPlan.name}`,
        detail:
          billing === "annual"
            ? `${ANNUAL_MONTHS} meses · ${ANNUAL_DISCOUNT_PERCENT}% de ahorro anual e implementación incluida`
            : billing === "semester"
              ? `${SEMESTER_MONTHS} meses · ${SEMESTER_DISCOUNT_PERCENT}% de ahorro semestral e implementación incluida`
              : "Facturación mes a mes · implementación cobrada al inicio",
        quantity: "1",
        base: planBase,
        discount: discounts.plan,
        total: applyDiscount(planBase, discounts.plan),
      },
      ...(extraUsers > 0
        ? [
            {
              id: "users" as const,
              name: "Usuarios / profesionales extra",
              detail: `${formatUsd(EXTRA_USER_USD)} por usuario/mes · ${periodMonths} ${
                periodMonths === 1 ? "mes" : "meses"
              }`,
              quantity: String(extraUsers),
              base: userBase,
              discount: discounts.users,
              total: applyDiscount(userBase, discounts.users),
            },
          ]
        : []),
      ...(extraCreditPacks > 0
        ? [
            {
              id: "credits" as const,
              name: "Créditos IA extra",
              detail: `${formatNumber(
                EXTRA_CREDIT_PACK_CREDITS,
              )} créditos por pack/mes · ${periodMonths} ${
                periodMonths === 1 ? "mes" : "meses"
              }`,
              quantity: String(extraCreditPacks),
              base: creditBase,
              discount: discounts.credits,
              total: applyDiscount(creditBase, discounts.credits),
            },
          ]
        : []),
      ...(setupCharged
        ? [
            {
              id: "setup" as const,
              name: "Configuración inicial",
              detail: "Pago único · migración, configuración y capacitación",
              quantity: "1",
              base: SETUP_FEE_USD,
              discount: discounts.setup,
              total: applyDiscount(SETUP_FEE_USD, discounts.setup),
            },
          ]
        : []),
    ];
  }, [
    billing,
    discounts,
    extraCreditPacks,
    extraUsers,
    setupCharged,
    periodMonths,
    selectedPlan,
  ]);

  const catalogSubtotal = rows.reduce((sum, row) => sum + row.base, 0);
  const afterItemDiscounts = rows.reduce((sum, row) => sum + row.total, 0);
  const itemDiscountSavings = catalogSubtotal - afterItemDiscounts;
  const globalDiscountAmount =
    afterItemDiscounts * (clampPercent(discounts.global) / 100);
  const total = afterItemDiscounts - globalDiscountAmount;
  const totalCredits =
    selectedPlan.credits + extraCreditPacks * EXTRA_CREDIT_PACK_CREDITS;
  const totalUsers = selectedPlan.users + extraUsers;

  const updateDiscount = (key: keyof Discounts, value: number) =>
    setDiscounts((current) => ({ ...current, [key]: clampPercent(value) }));

  const reset = () => {
    setClientName("Clínica Estética Aurora");
    setClientEmail("");
    setQuoteOwner("Catalina Fuentes");
    setOwnerEmail("catalina.fuentes@oacg.cl");
    setOwnerPhone("+56 9 7882 4985");
    setQuoteNumber(initialQuoteNumber);
    setQuoteDate(initialDate);
    setValidUntil(initialValidUntil);
    setSelectedPlanId("atlas");
    setBilling("annual");
    setExtraUsers(0);
    setExtraCreditPacks(0);
    setIncludeSetup(true);
    setDiscounts({ plan: 0, users: 0, credits: 0, setup: 0, global: 0 });
    setNotes(DEFAULT_NOTES);
    setCopyState("idle");
    setLinkPago(null);
    setErrorLink("");
    setPedirClave(false);
    setDuracionTipo("primer_pago");
    setDuracionMeses(6);
  };

  // Huella de la configuración que afecta el precio: si cambia después de
  // generar el link, el link queda obsoleto y hay que regenerarlo.
  const configPago = JSON.stringify({
    numero: quoteNumber,
    clienteEmail: clientEmail.trim(),
    planId: selectedPlanId,
    billing,
    extraUsuarios: extraUsers,
    extraPacks: extraCreditPacks,
    incluirSetup: setupCharged,
    descuentos: discounts,
    duracionDescuento:
      duracionTipo === "meses" ? { tipo: "meses", meses: duracionMeses } : { tipo: duracionTipo },
    // Datos de presentación: van al PDF que genera el servidor. También forman
    // parte de la huella: si cambian, el link (y su PDF) se regeneran.
    presentacion: {
      clienteNombre: clientName,
      cotizante: quoteOwner,
      cotizanteEmail: ownerEmail,
      cotizanteTelefono: ownerPhone,
      fecha: quoteDate,
      validaHasta: validUntil,
      notas: notes,
    },
  });
  const linkVigente = linkPago && linkPago.config === configPago ? linkPago : null;

  const generarLinkPago = async () => {
    if (generandoLink) return;
    setErrorLink("");
    setGenerandoLink(true);
    try {
      const clave = claveFirma.trim() || sessionStorage.getItem("clinera_firma_clave") || "";
      const datos = new FormData();
      datos.set("sinDocumento", "1");
      datos.set("titulo", `Cotización ${quoteNumber || "Clinera"} — ${clientName || "Cliente"}`.slice(0, 140));
      datos.set("clienteNombre", clientName.trim() || "Cliente");
      datos.set("clienteEmail", clientEmail.trim());
      datos.set("gestorNombre", quoteOwner.trim());
      datos.set("gestorEmail", ownerEmail.trim());
      datos.set("cotizacion", configPago);
      const respuesta = await fetch("/api/firma", {
        method: "POST",
        headers: clave ? { "x-firma-clave": clave } : {},
        body: datos,
      });
      const json = (await respuesta.json()) as {
        ok: boolean;
        id?: string;
        url?: string;
        correo?: string;
        error?: string;
      };
      if (respuesta.status === 401) {
        setPedirClave(true);
        setErrorLink(clave ? "Clave incorrecta." : "Ingresa la clave del equipo para generar el link.");
        return;
      }
      if (!respuesta.ok || !json.ok || !json.id || !json.url) {
        setErrorLink(json.error || "No pudimos generar el link de pago. Inténtalo de nuevo.");
        return;
      }
      if (claveFirma.trim()) sessionStorage.setItem("clinera_firma_clave", claveFirma.trim());
      setPedirClave(false);
      setLinkPago({ id: json.id, url: json.url, config: configPago, correo: json.correo });
    } catch {
      setErrorLink("Sin conexión con el servidor. Reintenta en un momento.");
    } finally {
      setGenerandoLink(false);
    }
  };

  const copiarLinkPago = async () => {
    if (!linkVigente) return;
    await navigator.clipboard.writeText(linkVigente.url);
    setCopiadoLink(true);
    window.setTimeout(() => setCopiadoLink(false), 1800);
  };

  // ── Envío de la cotización (habilitado solo con link de pago creado) ──────
  const textoEnvio = () =>
    [
      "Hola,",
      "",
      `Te comparto la cotización ${quoteNumber || "de Clinera"}: Plan ${selectedPlan.name} (${periodLabel.toLowerCase()}) por ${formatUsd(total)}.`,
      "",
      `Puedes revisarla y pagar en línea aquí: ${linkVigente?.url ?? ""}`,
      "",
      "Saludos,",
      quoteOwner,
    ].join("\n");

  const enviarPorCorreo = () => {
    if (!linkVigente) return;
    const asunto = `Cotización ${quoteNumber || ""} — Clinera`.trim();
    window.location.href = `mailto:?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(textoEnvio())}`;
  };

  const enviarPorWhatsApp = () => {
    if (!linkVigente) return;
    window.open(`https://wa.me/?text=${encodeURIComponent(textoEnvio())}`, "_blank", "noopener");
  };

  // Descarga el PDF canónico generado por el servidor: es el mismo que
  // previsualiza el cliente y trae el botón "Pagar suscripción" embebido.
  const descargarPdf = () => {
    if (!linkVigente) return;
    window.open(`/api/firma/${linkVigente.id}/pdf?descargar=1`, "_blank", "noopener");
  };

  // CTA principal del topbar: dispara el cierre completo — crea el link de
  // pago (si aún no existe o quedó obsoleto) y lleva al paso de envío.
  const crearCotizacion = async () => {
    seccionCierreRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    if (!linkVigente && !generandoLink) await generarLinkPago();
  };

  const copySummary = async () => {
    const summary = [
      `Cotización ${quoteNumber || "Clinera"}`,
      `Cliente: ${clientName || "Por definir"}`,
      `Plan: ${selectedPlan.name} · ${periodLabel.toLowerCase()}`,
      `${formatNumber(totalCredits)} créditos/mes · ${totalUsers} usuarios`,
      `Total: ${formatUsd(total)}`,
      `Válida hasta: ${formatDate(validUntil)}`,
    ].join("\n");

    await navigator.clipboard.writeText(summary);
    setCopyState("copied");
    window.setTimeout(() => setCopyState("idle"), 1800);
  };

  return (
    <main id="contenido" className={styles.page}>
      <header className={styles.topbar}>
        <div className={styles.topbarBrand}>
          <Image
            src="/images/brand/quote-logo.svg"
            width={32}
            height={32}
            alt="Clinera"
            priority
          />
          <span>clinera.io</span>
          <i aria-hidden="true" />
          <strong>Cotizaciones</strong>
        </div>
        <div className={styles.topbarActions}>
          <button type="button" className={styles.ghostButton} onClick={reset}>
            Restablecer
          </button>
          <button type="button" className={styles.secondaryButton} onClick={copySummary}>
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
              <rect x="5.25" y="5.25" width="7.5" height="7.5" rx="1.25" />
              <path d="M10.75 5V3.75a1.5 1.5 0 0 0-1.5-1.5h-5.5a1.5 1.5 0 0 0-1.5 1.5v5.5a1.5 1.5 0 0 0 1.5 1.5H5" />
            </svg>
            {copyState === "copied" ? "Resumen copiado" : "Copiar resumen"}
          </button>
          <button
            type="button"
            className={styles.primaryButton}
            onClick={crearCotizacion}
            disabled={generandoLink}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M6.5 9.5 9.5 6.5M7.25 4.5l1-1a2.65 2.65 0 0 1 3.75 3.75l-1 1M8.75 11.5l-1 1A2.65 2.65 0 0 1 4 8.75l1-1" />
            </svg>
            {generandoLink
              ? "Creando cotización…"
              : linkVigente
                ? "Enviar cotización"
                : "Crear cotización"}
          </button>
        </div>
      </header>

      <div className={styles.workspace}>
        <form className={styles.editor} onSubmit={(event) => event.preventDefault()}>
          <div className={styles.editorIntro}>
            <span>Constructor comercial</span>
            <h1>Arma una cotización clara en minutos.</h1>
            <p>Configura la propuesta y revisa el documento final en tiempo real.</p>
          </div>

          <section className={styles.formSection}>
            <div className={styles.sectionHeading}>
              <span>01</span>
              <div>
                <h2>Datos de la propuesta</h2>
                <p>Identifica al cliente y a quien presenta la cotización.</p>
              </div>
            </div>
            <div className={styles.fieldGrid}>
              <Field
                label="Nombre del cliente"
                value={clientName}
                onChange={setClientName}
                placeholder="Clínica o empresa"
                required
              />
              <Field
                label="Email del cliente"
                type="email"
                value={clientEmail}
                onChange={setClientEmail}
                placeholder="contacto@clinica.cl"
              />
              <Field
                label="Nombre del cotizante"
                value={quoteOwner}
                onChange={setQuoteOwner}
                placeholder="Nombre y apellido"
                required
              />
              <Field
                label="Correo del cotizante"
                type="email"
                value={ownerEmail}
                onChange={setOwnerEmail}
                placeholder="nombre@clinera.io"
              />
              <Field
                label="Teléfono del cotizante"
                type="tel"
                value={ownerPhone}
                onChange={setOwnerPhone}
                placeholder="+56 9"
              />
              <Field
                label="N.º de cotización"
                value={quoteNumber}
                onChange={setQuoteNumber}
              />
              <Field
                label="Fecha"
                type="date"
                value={quoteDate}
                onChange={setQuoteDate}
              />
              <Field
                label="Válida hasta"
                type="date"
                value={validUntil}
                onChange={setValidUntil}
              />
            </div>
          </section>

          <section className={styles.formSection}>
            <div className={styles.sectionHeading}>
              <span>02</span>
              <div>
                <h2>Plan y modalidad</h2>
                <p>Los valores se mantienen sincronizados con la página de planes.</p>
              </div>
            </div>

            <div className={styles.planList}>
              {CLINERA_PLANS.map((plan) => (
                <label
                  className={`${styles.planOption} ${
                    selectedPlan.id === plan.id ? styles.planOptionSelected : ""
                  }`}
                  key={plan.id}
                >
                  <input
                    type="radio"
                    name="plan"
                    value={plan.id}
                    checked={selectedPlan.id === plan.id}
                    onChange={() => setSelectedPlanId(plan.id)}
                  />
                  <span className={styles.radioMark} aria-hidden="true" />
                  <span className={styles.planName}>
                    <strong>{plan.name}</strong>
                    <small>
                      {formatNumber(plan.credits)} créditos · {plan.users} usuarios
                    </small>
                  </span>
                  <span className={styles.planPrice}>
                    <strong>{formatUsd(plan.monthlyPrice)}</strong>
                    <small>/mes</small>
                  </span>
                </label>
              ))}
            </div>

            <fieldset className={styles.billingFieldset}>
              <legend>Modalidad de pago</legend>
              <div className={styles.billingOptions}>
                <label className={isAnnual ? styles.billingSelected : ""}>
                  <input
                    type="radio"
                    name="billing"
                    value="annual"
                    checked={isAnnual}
                    onChange={() => setBilling("annual")}
                  />
                  <strong>Anual</strong>
                  <small>
                    {ANNUAL_MONTHS} meses · {ANNUAL_DISCOUNT_PERCENT}% OFF + implementación gratis
                  </small>
                </label>
                <label className={billing === "semester" ? styles.billingSelected : ""}>
                  <input
                    type="radio"
                    name="billing"
                    value="semester"
                    checked={billing === "semester"}
                    onChange={() => setBilling("semester")}
                  />
                  <strong>Semestral</strong>
                  <small>{SEMESTER_MONTHS} meses · {SEMESTER_DISCOUNT_PERCENT}% OFF</small>
                </label>
                <label className={billing === "monthly" ? styles.billingSelected : ""}>
                  <input
                    type="radio"
                    name="billing"
                    value="monthly"
                    checked={billing === "monthly"}
                    onChange={() => setBilling("monthly")}
                  />
                  <strong>Mensual</strong>
                  <small>Pago mes a mes</small>
                </label>
              </div>
            </fieldset>

            <label className={styles.setupToggle}>
              <span>
                <input
                  type="checkbox"
                  checked={setupCharged}
                  disabled={freeSetup}
                  onChange={(event) => setIncludeSetup(event.target.checked)}
                />
                <i aria-hidden="true" />
              </span>
              <span>
                <strong>Incluir configuración inicial</strong>
                <small>
                  {freeSetup
                    ? `Incluida sin costo en el plan ${billing === "annual" ? "anual" : "semestral"}`
                    : "Migración, configuración y capacitación · pago único · el plan se cobra después"}
                </small>
              </span>
              <b>{freeSetup ? "Gratis" : formatUsd(SETUP_FEE_USD)}</b>
            </label>
          </section>

          <section className={styles.formSection}>
            <div className={styles.sectionHeading}>
              <span>03</span>
              <div>
                <h2>Capacidad adicional</h2>
                <p>Las cantidades corresponden a cada mes del período elegido.</p>
              </div>
            </div>
            <div className={styles.addonList}>
              <div className={styles.addonRow}>
                <div>
                  <strong>Usuarios extra</strong>
                  <small>{formatUsd(EXTRA_USER_USD)} por usuario/mes</small>
                </div>
                <QuantityControl
                  label="Usuarios extra"
                  value={extraUsers}
                  onChange={setExtraUsers}
                />
              </div>
              <div className={styles.addonRow}>
                <div>
                  <strong>Créditos IA extra</strong>
                  <small>
                    {formatNumber(EXTRA_CREDIT_PACK_CREDITS)} créditos por{" "}
                    {formatUsd(EXTRA_CREDIT_PACK_USD)}
                  </small>
                </div>
                <QuantityControl
                  label="Packs de créditos extra"
                  value={extraCreditPacks}
                  onChange={setExtraCreditPacks}
                />
              </div>
            </div>
          </section>

          <section className={styles.formSection}>
            <div className={styles.sectionHeading}>
              <span>04</span>
              <div>
                <h2>Descuentos</h2>
                <p>Cada descuento se aplica sobre su línea. El global se calcula al final.</p>
              </div>
            </div>
            <div className={styles.discountGrid}>
              <DiscountField
                label={`Plan ${selectedPlan.name}`}
                value={discounts.plan}
                onChange={(value) => updateDiscount("plan", value)}
              />
              <DiscountField
                label="Usuarios extra"
                value={discounts.users}
                disabled={extraUsers === 0}
                onChange={(value) => updateDiscount("users", value)}
              />
              <DiscountField
                label="Créditos IA extra"
                value={discounts.credits}
                disabled={extraCreditPacks === 0}
                onChange={(value) => updateDiscount("credits", value)}
              />
              <DiscountField
                label="Configuración inicial"
                value={discounts.setup}
                disabled={!setupCharged}
                onChange={(value) => updateDiscount("setup", value)}
              />
            </div>
            <div className={styles.globalDiscount}>
              <div>
                <strong>Descuento global</strong>
                <small>Se aplica después de los descuentos por ítem.</small>
              </div>
              <span className={styles.percentInput}>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  value={discounts.global}
                  onChange={(event) =>
                    updateDiscount("global", Number(event.target.value))
                  }
                  aria-label="Descuento global"
                />
                <span aria-hidden="true">%</span>
              </span>
            </div>
          </section>

          <section className={styles.formSection}>
            <div className={styles.sectionHeading}>
              <span>05</span>
              <div>
                <h2>Nota comercial</h2>
                <p>Aparece al pie de la cotización.</p>
              </div>
            </div>
            <label className={styles.field}>
              <span>Nota</span>
              <textarea value={notes} onChange={(event) => setNotes(event.target.value)} />
            </label>
          </section>

          <section className={styles.formSection} ref={seccionCierreRef}>
            <div className={styles.sectionHeading}>
              <span>06</span>
              <div>
                <h2>Cerrar y enviar</h2>
                <p>
                  Primero crea el link de pago — queda impreso en la cotización — y luego
                  envíala al cliente. La firma del contrato se gestiona tras el pago.
                </p>
              </div>
            </div>

            {itemDiscountSavings + globalDiscountAmount > 0 && (
              <div className={styles.linkPagoDuracion}>
                <span className={styles.duracionEtiqueta}>
                  Duración del descuento en la suscripción
                </span>
                <div className={styles.duracionSegmento}>
                  <label
                    className={duracionTipo === "primer_pago" ? styles.duracionSeleccionada : ""}
                  >
                    <input
                      type="radio"
                      name="duracion-descuento"
                      checked={duracionTipo === "primer_pago"}
                      onChange={() => setDuracionTipo("primer_pago")}
                    />
                    <strong>Solo el primer pago</strong>
                    <small>Luego, precio de lista</small>
                  </label>
                  <label className={duracionTipo === "meses" ? styles.duracionSeleccionada : ""}>
                    <input
                      type="radio"
                      name="duracion-descuento"
                      checked={duracionTipo === "meses"}
                      onChange={() => setDuracionTipo("meses")}
                    />
                    <strong>Por meses</strong>
                    <small className={styles.duracionMesesLinea}>
                      <input
                        type="number"
                        min="1"
                        max="60"
                        value={duracionMeses}
                        onClick={() => setDuracionTipo("meses")}
                        onChange={(event) =>
                          setDuracionMeses(
                            Math.min(60, Math.max(1, Number(event.target.value) || 1)),
                          )
                        }
                        aria-label="Meses de descuento"
                      />
                      meses{billing === "semester" ? " · múltiplo de 6" : ""}
                    </small>
                  </label>
                  <label className={duracionTipo === "siempre" ? styles.duracionSeleccionada : ""}>
                    <input
                      type="radio"
                      name="duracion-descuento"
                      checked={duracionTipo === "siempre"}
                      onChange={() => setDuracionTipo("siempre")}
                    />
                    <strong>Para siempre</strong>
                    <small>Personalización perpetua</small>
                  </label>
                </div>
              </div>
            )}

            {pedirClave && (
              <label className={styles.field}>
                <span>Clave del equipo (solo la primera vez)</span>
                <input
                  type="password"
                  value={claveFirma}
                  onChange={(event) => setClaveFirma(event.target.value)}
                  autoComplete="current-password"
                />
              </label>
            )}

            {errorLink && <p className={styles.linkPagoError}>{errorLink}</p>}

            {linkVigente ? (
              <div className={styles.linkPagoListo}>
                <strong>
                  <svg width="15" height="15" viewBox="0 0 15 15" aria-hidden="true">
                    <circle cx="7.5" cy="7.5" r="6.75" />
                    <path d="m4.75 7.75 2 2 3.75-4" />
                  </svg>
                  {linkVigente.correo === "enviado"
                    ? `Cotización enviada por correo a ${clientEmail.trim()}`
                    : "Link de pago creado e incluido en la cotización"}
                </strong>
                {linkVigente.correo === "error" && (
                  <small className={styles.correoAviso}>
                    No pudimos enviar el correo automático: envíala manual desde la fila de
                    abajo.
                  </small>
                )}
                {linkVigente.correo === "sin-config" && (
                  <small className={styles.correoAviso}>
                    El envío automático por correo aún no está configurado (SMTP): envíala
                    manual desde la fila de abajo.
                  </small>
                )}
                {linkVigente.correo === "sin-email" && (
                  <small className={styles.correoAviso}>
                    Agrega el email del cliente (sección 01) para que la cotización se envíe
                    sola al crear el link.
                  </small>
                )}
                <code>{linkVigente.url}</code>
                <button type="button" className={styles.btnCopiarLink} onClick={copiarLinkPago}>
                  {copiadoLink ? "Link copiado" : "Copiar link"}
                </button>
              </div>
            ) : (
              <button
                type="button"
                className={styles.btnCrearLink}
                onClick={generarLinkPago}
                disabled={generandoLink}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M6.5 9.5 9.5 6.5M7.25 4.5l1-1a2.65 2.65 0 0 1 3.75 3.75l-1 1M8.75 11.5l-1 1A2.65 2.65 0 0 1 4 8.75l1-1" />
                </svg>
                {generandoLink ? "Creando link…" : "Crear link de pago"}
              </button>
            )}

            <div className={styles.envio}>
              <span className={styles.envioTitulo}>Enviar cotización</span>
              <div className={styles.envioAcciones}>
                <button
                  type="button"
                  className={styles.btnEnvio}
                  disabled={!linkVigente}
                  onClick={enviarPorCorreo}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                    <rect x="1.75" y="3.25" width="12.5" height="9.5" rx="1.5" />
                    <path d="m2.5 4.5 5.5 4.25L13.5 4.5" />
                  </svg>
                  Correo
                </button>
                <button
                  type="button"
                  className={styles.btnEnvio}
                  disabled={!linkVigente}
                  onClick={enviarPorWhatsApp}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                    <path d="M8 1.9a6.1 6.1 0 0 0-5.2 9.3L2 14l2.9-.76A6.1 6.1 0 1 0 8 1.9Z" />
                    <path d="M5.9 5.7c.9 2 2.1 3.2 4.3 4.1l.85-.85 1.35.7c-.3 1.1-1.3 1.4-2.4 1-2.3-.8-4-2.5-4.8-4.8-.4-1.1-.1-2.1 1-2.4l.7 1.35Z" />
                  </svg>
                  WhatsApp
                </button>
                <button
                  type="button"
                  className={styles.btnEnvio}
                  disabled={!linkVigente}
                  onClick={descargarPdf}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                    <path d="M8 2.25v8M4.75 7 8 10.25 11.25 7" />
                    <path d="M2.75 11v1.5a1.25 1.25 0 0 0 1.25 1.25h8a1.25 1.25 0 0 0 1.25-1.25V11" />
                  </svg>
                  Descargar PDF
                </button>
              </div>
              <small>
                {linkVigente
                  ? "El PDF sale con el botón de pago impreso. En correo o WhatsApp, adjunta también el PDF descargado."
                  : "Crea el link de pago para habilitar el envío."}
              </small>
            </div>
          </section>
        </form>

        <section className={styles.previewColumn} aria-label="Vista previa de la cotización">
          <div className={styles.previewLabel}>
            <span>
              <i aria-hidden="true" />
              Vista previa
            </span>
            <small>Formato A4 · se actualiza en tiempo real</small>
          </div>

          <div className={styles.paperViewport}>
            <article className={styles.quotePaper} aria-live="polite">
              <div className={styles.documentRail} aria-hidden="true">
                <span>CLINERA</span>
                <i />
                <small>{quoteNumber || "COTIZACIÓN"}</small>
              </div>

              <header className={styles.quoteHeader}>
                <div className={styles.quoteBrand}>
                  <Image
                    src="/images/brand/quote-logo.svg"
                    width={44}
                    height={44}
                    alt="Logo de Clinera"
                    priority
                  />
                  <div>
                    <strong>clinera.io</strong>
                    <small>Operación clínica inteligente</small>
                  </div>
                </div>
                <div className={styles.quoteMeta}>
                  <span>Cotización</span>
                  <strong>{quoteNumber || "Sin número"}</strong>
                  <small>{formatDate(quoteDate)}</small>
                </div>
              </header>

              <div className={styles.quoteHero}>
                <div>
                  <span>Propuesta comercial</span>
                  <h2>{clientName || "Nombre del cliente"}</h2>
                </div>
                <div className={styles.ownerBlock}>
                  <span>Preparada por</span>
                  <strong>{quoteOwner || "Nombre del cotizante"}</strong>
                  {ownerEmail && <small>{ownerEmail}</small>}
                  {ownerPhone && <small>{ownerPhone}</small>}
                </div>
              </div>

              <section className={styles.planSummary}>
                <div>
                  <span>Plan seleccionado</span>
                  <strong>{selectedPlan.name}</strong>
                  <small>{periodLabel} · valores en USD</small>
                </div>
                <dl>
                  <div>
                    <dt>Créditos / mes</dt>
                    <dd>{formatNumber(totalCredits)}</dd>
                  </div>
                  <div>
                    <dt>Usuarios</dt>
                    <dd>{formatNumber(totalUsers)}</dd>
                  </div>
                  <div>
                    <dt>Sucursales</dt>
                    <dd>{selectedPlan.branches}</dd>
                  </div>
                </dl>
              </section>

              <section className={styles.quoteDetail}>
                <div className={styles.detailHeading}>
                  <h3>Detalle de inversión</h3>
                  <span>{periodLabel}</span>
                </div>
                <table>
                  <thead>
                    <tr>
                      <th>Descripción</th>
                      <th>Cant.</th>
                      <th>Desc.</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr key={row.id}>
                        <td>
                          <strong>{row.name}</strong>
                          <small>{row.detail}</small>
                        </td>
                        <td>{row.quantity}</td>
                        <td>{row.discount > 0 ? `${row.discount}%` : "—"}</td>
                        <td>
                          {row.discount > 0 && <del>{formatUsd(row.base)}</del>}
                          <strong>{formatUsd(row.total)}</strong>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>

              <section className={styles.quoteTotals}>
                <div className={styles.savingsNote}>
                  <span>Condición comercial</span>
                  <p>
                    {billing === "annual"
                      ? `El plan ya incorpora ${ANNUAL_DISCOUNT_PERCENT}% de ahorro por pago anual e incluye la configuración inicial de ${formatUsd(SETUP_FEE_USD)} sin costo.`
                      : billing === "semester"
                        ? `El plan ya incorpora ${SEMESTER_DISCOUNT_PERCENT}% de ahorro por pago semestral e incluye la configuración inicial de ${formatUsd(SETUP_FEE_USD)} sin costo.`
                        : `Facturación mensual: primero la implementación (${formatUsd(SETUP_FEE_USD)}), después el plan. Permanencia mínima de ${SEMESTER_MONTHS} meses.`}
                  </p>
                  {itemDiscountSavings + globalDiscountAmount > 0 && (
                    <strong>
                      Ahorro adicional:{" "}
                      {formatUsd(itemDiscountSavings + globalDiscountAmount)}
                    </strong>
                  )}
                </div>
                <dl>
                  <div>
                    <dt>Subtotal</dt>
                    <dd>{formatUsd(catalogSubtotal)}</dd>
                  </div>
                  {itemDiscountSavings > 0 && (
                    <div>
                      <dt>Descuentos por ítem</dt>
                      <dd>− {formatUsd(itemDiscountSavings)}</dd>
                    </div>
                  )}
                  {globalDiscountAmount > 0 && (
                    <div>
                      <dt>Descuento global ({discounts.global}%)</dt>
                      <dd>− {formatUsd(globalDiscountAmount)}</dd>
                    </div>
                  )}
                  <div className={styles.grandTotal}>
                    <dt>
                      Total {billing === "annual" ? "anual" : billing === "semester" ? "semestral" : "inicial"}
                    </dt>
                    <dd>{formatUsd(total)}</dd>
                  </div>
                </dl>
              </section>

              {linkVigente && (
                <section className={styles.payBox}>
                  <div>
                    <span>Acepta y paga en línea</span>
                    <p>
                      Suscripción {periodLabel.toLowerCase()} por {formatUsd(total)}. Tras el
                      pago, recibirás el contrato para firma electrónica en el mismo enlace.
                    </p>
                  </div>
                  <div className={styles.payBoxAccion}>
                    <a href={linkVigente.url}>Pagar ahora</a>
                    <small>Pago seguro con Stripe</small>
                    <code>{linkVigente.url.replace("https://", "")}</code>
                  </div>
                </section>
              )}

              <footer className={styles.quoteFooter}>
                <div>
                  <span>Validez</span>
                  <strong>Hasta el {formatDate(validUntil)}</strong>
                  {notes && <p>{notes}</p>}
                </div>
                <div className={styles.legalNote}>
                  <p>
                    Valores expresados en USD. Impuestos no incluidos. Los créditos se
                    renuevan mensualmente y los extras se consideran por cada mes del período.
                  </p>
                  <span>www.clinera.io</span>
                </div>
              </footer>
            </article>
          </div>
        </section>
      </div>
    </main>
  );
}
