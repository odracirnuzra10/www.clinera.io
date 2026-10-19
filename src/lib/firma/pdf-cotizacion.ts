// ============================================================================
// PDF de la cotización — generado server-side
// ----------------------------------------------------------------------------
// Cuando el closer crea el link de pago desde /cotizacion, el servidor genera
// este PDF a partir del snapshot recalculado del catálogo y lo deja como
// documento del sobre. Es el archivo canónico que se envía al cliente:
//
//   - Se previsualiza en /firma/<id> antes de pagar.
//   - Lleva un BOTÓN "PAGAR SUSCRIPCIÓN" real dentro del PDF (anotación de
//     link nativa, clickeable en cualquier visor) que abre el checkout.
//   - Tras el pago es el mismo documento que el cliente firma, salvo que el
//     closer lo reemplace por un contrato formal.
// ============================================================================

import { PDFDocument, PDFFont, PDFName, PDFPage, PDFString, StandardFonts, rgb } from "pdf-lib";
import { latin1 } from "./certificado";
import { ENTIDAD_LEGAL } from "./firma-ceo";
import { lineaConDescuento, periodoAdjetivo, type CotizacionSnapshot } from "./cotizacion";

const A4: [number, number] = [595.28, 841.89];
const MARGEN = 52;

const TINTA = rgb(0.067, 0.075, 0.094); // #111318
const GRIS = rgb(0.396, 0.416, 0.463); // #656a76
const BORDE = rgb(0.89, 0.89, 0.874); // #e3e3df
const VIOLETA = rgb(0.412, 0.255, 0.776); // #6941c6
const PAPEL_SUAVE = rgb(0.973, 0.973, 0.965);

const usd = (centavos: number) =>
  new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  })
    .format(centavos / 100)
    .replace(/ /g, " ");

function fechaLarga(iso: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return "Por definir";
  return new Intl.DateTimeFormat("es-CL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${iso}T12:00:00`));
}

/** Botón con anotación de link nativa: el rectángulo completo es clickeable. */
function botonConLink(
  pdf: PDFDocument,
  pagina: PDFPage,
  opciones: {
    x: number;
    y: number;
    ancho: number;
    alto: number;
    etiqueta: string;
    url: string;
    fuente: PDFFont;
    tamano: number;
  },
) {
  const { x, y, ancho, alto, etiqueta, url, fuente, tamano } = opciones;
  pagina.drawRectangle({ x, y, width: ancho, height: alto, color: VIOLETA });
  const texto = latin1(etiqueta);
  pagina.drawText(texto, {
    x: x + (ancho - fuente.widthOfTextAtSize(texto, tamano)) / 2,
    y: y + (alto - tamano) / 2 + 1,
    size: tamano,
    font: fuente,
    color: rgb(1, 1, 1),
  });
  const anotacion = pdf.context.register(
    pdf.context.obj({
      Type: "Annot",
      Subtype: "Link",
      Rect: [x, y, x + ancho, y + alto],
      Border: [0, 0, 0],
      A: { Type: "Action", S: "URI", URI: PDFString.of(url) },
    }),
  );
  const previas = pagina.node.Annots();
  if (previas) {
    previas.push(anotacion);
  } else {
    pagina.node.set(PDFName.of("Annots"), pdf.context.obj([anotacion]));
  }
}

/** "Mensual" / "Semestral" / "Anual" para las bandas del PDF. */
function etiquetaPeriodo(c: CotizacionSnapshot): string {
  const adj = periodoAdjetivo(c.periodoMeses);
  return adj.charAt(0).toUpperCase() + adj.slice(1);
}

type Filas = Array<{ nombre: string; detalle: string; cantidad: string; dcto: number; dctoUsd: number; lista: number; final: number }>;

function filasDeCotizacion(c: CotizacionSnapshot): Filas {
  // Los snapshots guardados antes del descuento en monto fijo no traen descuentosUsd.
  const m = c.descuentosUsd ?? { plan: 0, users: 0, credits: 0, setup: 0, global: 0 };
  const filas: Filas = [
    {
      nombre: `Plan ${c.planNombre}`,
      detalle:
        c.periodoMeses === 12
          ? "12 meses · 20% de ahorro anual de catálogo"
          : c.periodoMeses === 6
            ? "6 meses · 20% de ahorro semestral de catálogo"
            : "Facturación mes a mes",
      cantidad: "1",
      dcto: c.descuentos.plan,
      dctoUsd: m.plan,
      lista: c.centavos.planLista,
      final: lineaConDescuento(c.centavos.planLista, c.descuentos.plan, m.plan),
    },
  ];
  if (c.extraUsuarios > 0) {
    const lista = c.centavos.usuarioLista * c.extraUsuarios;
    filas.push({
      nombre: "Usuarios / profesionales extra",
      detalle: `${usd(c.centavos.usuarioLista)} por usuario por período`,
      cantidad: String(c.extraUsuarios),
      dcto: c.descuentos.users,
      dctoUsd: m.users,
      lista,
      final: lineaConDescuento(lista, c.descuentos.users, m.users),
    });
  }
  if (c.extraPacks > 0) {
    const lista = c.centavos.packLista * c.extraPacks;
    filas.push({
      nombre: "Créditos IA extra",
      detalle: `${usd(c.centavos.packLista)} por pack por período`,
      cantidad: String(c.extraPacks),
      dcto: c.descuentos.credits,
      dctoUsd: m.credits,
      lista,
      final: lineaConDescuento(lista, c.descuentos.credits, m.credits),
    });
  }
  if (c.incluirSetup) {
    filas.push({
      nombre: "Configuración inicial",
      detalle: "Pago único · migración, configuración y capacitación",
      cantidad: "1",
      dcto: c.descuentos.setup,
      dctoUsd: m.setup,
      lista: c.centavos.setupLista,
      final: lineaConDescuento(c.centavos.setupLista, c.descuentos.setup, m.setup),
    });
  }
  return filas;
}

/** Genera el PDF de la cotización con el botón de pago embebido. */
export async function generarPdfCotizacion(
  cotizacion: CotizacionSnapshot,
  urls: { pago: string; enLinea: string },
): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const negrita = await pdf.embedFont(StandardFonts.HelveticaBold);
  const mono = await pdf.embedFont(StandardFonts.Courier);
  const pagina = pdf.addPage(A4);
  const ancho = A4[0] - MARGEN * 2;
  const p = cotizacion.presentacion;
  let y = A4[1] - MARGEN;

  const texto = (
    contenido: string,
    x: number,
    yPos: number,
    tamano: number,
    fuente = regular,
    color = TINTA,
  ) => pagina.drawText(latin1(contenido), { x, y: yPos, size: tamano, font: fuente, color });
  const anchoDe = (contenido: string, tamano: number, fuente = regular) =>
    fuente.widthOfTextAtSize(latin1(contenido), tamano);

  // ── Cabecera ──
  texto("CLINERA", MARGEN, y - 12, 15, negrita);
  texto("clinera.io", MARGEN + ancho - anchoDe("clinera.io", 9), y - 11, 9, regular, GRIS);
  y -= 24;
  pagina.drawRectangle({ x: MARGEN, y, width: ancho, height: 2, color: VIOLETA });
  y -= 36;

  texto("Cotización", MARGEN, y, 22, negrita);
  const folio = cotizacion.numero;
  texto(folio, MARGEN + ancho - anchoDe(folio, 11, mono), y + 6, 11, mono, VIOLETA);
  const fechaTxt = `Emitida el ${fechaLarga(p?.fecha ?? "")}`;
  texto(fechaTxt, MARGEN + ancho - anchoDe(fechaTxt, 8.5), y - 8, 8.5, regular, GRIS);
  y -= 34;

  // ── Cliente / preparada por ──
  const mitad = ancho / 2;
  texto("PREPARADA PARA", MARGEN, y, 7, negrita, GRIS);
  texto(p?.clienteNombre || "Cliente", MARGEN, y - 15, 11.5, negrita);
  texto("PREPARADA POR", MARGEN + mitad, y, 7, negrita, GRIS);
  texto(p?.cotizante || "Equipo Clinera", MARGEN + mitad, y - 15, 11.5, negrita);
  let yContacto = y - 28;
  for (const linea of [p?.cotizanteEmail, p?.cotizanteTelefono].filter(Boolean) as string[]) {
    texto(linea, MARGEN + mitad, yContacto, 8.5, regular, GRIS);
    yContacto -= 12;
  }
  y -= 58;

  // ── Banda del plan ──
  pagina.drawRectangle({ x: MARGEN, y: y - 44, width: ancho, height: 44, color: PAPEL_SUAVE });
  texto("PLAN SELECCIONADO", MARGEN + 14, y - 15, 7, negrita, GRIS);
  texto(
    `${cotizacion.planNombre} · ${etiquetaPeriodo(cotizacion)}`,
    MARGEN + 14,
    y - 32,
    12.5,
    negrita,
  );
  const duracion =
    cotizacion.duracionDescuento.tipo === "siempre"
      ? "Descuento permanente"
      : cotizacion.duracionDescuento.tipo === "meses"
        ? `Descuento por ${cotizacion.duracionDescuento.meses} meses`
        : cotizacion.centavos.descuentoRecurrente > 0
          ? "Descuento en el primer pago"
          : "Valores de catálogo";
  texto(duracion, MARGEN + ancho - 14 - anchoDe(duracion, 8.5), y - 26, 8.5, regular, VIOLETA);
  y -= 64;

  // ── Tabla de detalle ──
  const filas = filasDeCotizacion(cotizacion);
  const colCant = MARGEN + ancho - 190;
  const colDcto = MARGEN + ancho - 130;
  const colTotal = MARGEN + ancho;
  texto("DESCRIPCIÓN", MARGEN, y, 7, negrita, GRIS);
  texto("CANT.", colCant, y, 7, negrita, GRIS);
  texto("DESC.", colDcto, y, 7, negrita, GRIS);
  texto("TOTAL", colTotal - anchoDe("TOTAL", 7, negrita), y, 7, negrita, GRIS);
  y -= 8;
  pagina.drawRectangle({ x: MARGEN, y, width: ancho, height: 0.8, color: TINTA });
  y -= 18;

  for (const fila of filas) {
    texto(fila.nombre, MARGEN, y, 10, negrita);
    texto(fila.detalle, MARGEN, y - 12, 8, regular, GRIS);
    texto(fila.cantidad, colCant, y, 9.5);
    const dctoTexto = [fila.dcto > 0 ? `${fila.dcto}%` : "", fila.dctoUsd > 0 ? `-US$ ${fila.dctoUsd}` : ""]
      .filter(Boolean)
      .join(" ");
    texto(dctoTexto || "—", colDcto, y, 9.5, regular, dctoTexto ? VIOLETA : GRIS);
    const monto = usd(fila.final);
    texto(monto, colTotal - anchoDe(monto, 9.5, negrita), y, 9.5, negrita);
    y -= 30;
    pagina.drawRectangle({ x: MARGEN, y: y + 8, width: ancho, height: 0.5, color: BORDE });
  }
  y -= 6;

  // ── Totales ──
  const totalPeriodo = cotizacion.centavos.recurrenteFinal + cotizacion.centavos.setupFinal;
  const subtotalLista = filas.reduce((s, f) => s + f.lista, 0);
  const descuentoTotal = subtotalLista - totalPeriodo;
  const resumen: Array<[string, string]> = [
    ["Subtotal", usd(subtotalLista)],
    ...(descuentoTotal > 0
      ? ([["Descuentos aplicados", `- ${usd(descuentoTotal)}`]] as Array<[string, string]>)
      : []),
  ];
  const xResumen = MARGEN + ancho - 240;
  for (const [etiqueta, valor] of resumen) {
    texto(etiqueta, xResumen, y, 9, regular, GRIS);
    texto(valor, colTotal - anchoDe(valor, 9), y, 9);
    y -= 16;
  }
  // Caja de total
  const altoTotal = 34;
  pagina.drawRectangle({ x: xResumen - 12, y: y - altoTotal + 8, width: 252, height: altoTotal, color: TINTA });
  const etiquetaTotal =
    cotizacion.periodoMeses === 12
      ? "TOTAL ANUAL"
      : cotizacion.periodoMeses === 6
        ? "TOTAL SEMESTRAL"
        : "TOTAL PRIMER MES";
  texto(etiquetaTotal, xResumen, y - 14, 7.5, negrita, rgb(1, 1, 1));
  const totalTxt = usd(totalPeriodo);
  texto(totalTxt, colTotal - 12 - anchoDe(totalTxt, 13, negrita), y - 16, 13, negrita, rgb(1, 1, 1));
  y -= altoTotal + 26;

  // ── Botón de pago (anotación de link real) ──
  pagina.drawRectangle({
    x: MARGEN,
    y: y - 92,
    width: ancho,
    height: 92,
    borderColor: BORDE,
    borderWidth: 1,
  });
  pagina.drawRectangle({ x: MARGEN, y: y - 92, width: 3, height: 92, color: VIOLETA });
  texto("ACEPTA Y PAGA EN LÍNEA", MARGEN + 18, y - 20, 7.5, negrita, VIOLETA);
  texto(
    `Suscripción ${periodoAdjetivo(cotizacion.periodoMeses)} por ${usd(totalPeriodo)}. Tras el pago, firmarás el contrato en el mismo enlace.`,
    MARGEN + 18,
    y - 34,
    8.5,
    regular,
    GRIS,
  );
  botonConLink(pdf, pagina, {
    x: MARGEN + 18,
    y: y - 74,
    ancho: 190,
    alto: 28,
    etiqueta: "PAGAR SUSCRIPCIÓN",
    url: urls.pago,
    fuente: negrita,
    tamano: 9.5,
  });
  texto("Pago seguro con Stripe", MARGEN + 222, y - 60, 7, regular, GRIS);
  texto(
    `o visita ${urls.enLinea.replace("https://", "")}`,
    MARGEN + 222,
    y - 71,
    6.5,
    mono,
    GRIS,
  );
  y -= 118;

  // ── Validez y notas ──
  texto("VALIDEZ", MARGEN, y, 7, negrita, GRIS);
  texto(`Hasta el ${fechaLarga(p?.validaHasta ?? "")}`, MARGEN, y - 13, 9.5, negrita);
  if (p?.notas) {
    const palabras = latin1(p.notas).split(" ");
    let linea = "";
    let yNota = y - 27;
    for (const palabra of palabras) {
      const candidata = linea ? `${linea} ${palabra}` : palabra;
      if (regular.widthOfTextAtSize(candidata, 8) <= ancho) {
        linea = candidata;
      } else {
        texto(linea, MARGEN, yNota, 8, regular, GRIS);
        yNota -= 11;
        linea = palabra;
      }
    }
    if (linea) texto(linea, MARGEN, yNota, 8, regular, GRIS);
  }

  // ── Pie legal ──
  texto(
    "Valores expresados en USD. Impuestos no incluidos. Los créditos se renuevan mensualmente.",
    MARGEN,
    MARGEN - 4,
    6.5,
    regular,
    GRIS,
  );
  texto(latin1(ENTIDAD_LEGAL.linea1), MARGEN, MARGEN - 14, 6.5, regular, GRIS);
  texto("www.clinera.io", MARGEN + ancho - anchoDe("www.clinera.io", 7, negrita), MARGEN - 4, 7, negrita, VIOLETA);

  pdf.setTitle(latin1(`Cotización ${cotizacion.numero} — Clinera`), { showInWindowTitleBar: true });
  pdf.setProducer("clinera.io/cotizacion");
  return pdf.save();
}
