// /api/verificar-sitio: lógica pura de la verificación de sitios. Desde el 28-oct-2026 /agenda ya
// no pide web ni Instagram (Ricardo: la verificación es manual, la hace el closer), así que el
// formulario no la llama; la ruta y su lógica quedan para otros usos y se prueban acá.

import { expect, test } from "@playwright/test";
import { esIpPrivada, extraerTexto, esEstacionado, normalizarSitio, pareceClinica } from "../src/lib/verificar-sitio";

test("normalizarSitio: dominios, redes sociales y basura", () => {
  expect(normalizarSitio("www.MetodoHebe.cl")).toEqual({ url: "https://www.metodohebe.cl", host: "www.metodohebe.cl" });
  expect(normalizarSitio("http://clinica.cl/inicio")).toEqual({ url: "https://clinica.cl/inicio", host: "clinica.cl" });
  for (const v of ["@miclinica", "instagram.com/hebe", "https://www.facebook.com/x", "linktr.ee/x", "wa.me/569", "google.com"]) {
    expect(normalizarSitio(v), v).toEqual({ motivo: "red_social" });
  }
  for (const v of ["", "abc", "no tengo", "localhost", "127.0.0.1", "http://clinica.cl:8080", "ftp://clinica.cl", "https://u:p@clinica.cl"]) {
    expect(normalizarSitio(v), v).toEqual({ motivo: "formato" });
  }
});

test("esIpPrivada: el servidor no visita la red interna", () => {
  for (const ip of ["10.0.0.1", "127.0.0.1", "169.254.169.254", "172.16.5.4", "192.168.1.1", "100.64.0.1", "::1", "fd00::1", "::ffff:10.1.1.1", "0.0.0.0"]) {
    expect(esIpPrivada(ip), ip).toBe(true);
  }
  for (const ip of ["8.8.8.8", "190.98.200.1", "2606:4700::1111"]) expect(esIpPrivada(ip), ip).toBe(false);
});

test("extraerTexto, dominio en venta y heurística de clínica", () => {
  const html = `<html><head><title>Clínica Vela</title><meta name="description" content="Tratamientos faciales"><script>var x=1</script></head>
    <body><h1>Medicina estética</h1><p>Agenda tu consulta con nuestra doctora.</p><style>p{}</style></body></html>`;
  const t = extraerTexto(html);
  expect(t).toContain("Clínica Vela");
  expect(t).toContain("Tratamientos faciales");
  expect(t).not.toContain("var x");
  expect(pareceClinica(t)).toBe(true);
  expect(pareceClinica("Ofertas en televisores y celulares, despacho gratis")).toBe(false);
  expect(esEstacionado("This domain is for sale! Buy this domain today")).toBe(true);
  expect(esEstacionado(t)).toBe(false);
});
