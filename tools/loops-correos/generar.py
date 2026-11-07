"""Arma un .zip por correo de la serie de la prueba gratis, listo para subir en Loops.

Loops pide un .zip con `index.mjml` y una carpeta `img` (botón «Code» del editor). El texto sale de
docs/loops-serie-prueba-gratis.md: si cambias un correo ahí, vuelve a correr esto.

    python3 tools/loops-correos/generar.py <carpeta-de-salida>
"""
import html, os, re, sys, zipfile

AQUI = os.path.dirname(os.path.abspath(__file__))
DOC = os.path.join(AQUI, "..", "..", "docs", "loops-serie-prueba-gratis.md")
WA = "https://wa.me/56985581524?text=necesito%20asistencia"
PREVIEW = {
    1: "Conecta tus activos, carga tus tratamientos y empieza a agendar pacientes con IA.",
    2: "Son 3 minutos y no cambias de número.",
    3: "Así la IA solo ofrece horas reales.",
    4: "Todos los mensajes en un solo lugar.",
    5: "Escríbele a tu clínica como si fueras paciente.",
    6: "Mañana termina tu prueba gratis.",
    7: "Cuéntame qué te faltó y lo vemos juntos.",
}
T = '<mj-text font-size="16px" line-height="1.6" color="#1F2937" padding="0 0 16px">{}</mj-text>'


def negrita(t: str) -> str:
    return re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", html.escape(t))


def mjml(asunto: str, preview: str, cuerpo: str) -> str:
    partes, caja, prim = [], [], False

    def cerrar_caja():
        if caja:
            partes.append(
                '<mj-text font-size="16px" line-height="1.55" color="#1F2937" padding="0 0 20px">'
                '<div style="padding:16px 18px;border-radius:12px;background:#F5F3FF;border-left:4px solid #7C3AED">'
                + "<br/><br/>".join(caja) + "</div></mj-text>")
            caja.clear()

    for l in cuerpo.split("\n"):
        l = l.strip()
        if l.startswith("> "):
            caja.append(negrita(l[2:]))
            continue
        cerrar_caja()
        if not l or l.startswith("Fundador"):
            continue
        m = re.match(r"^(.*?)\[([^\]]+)\] → (\S+)$", l)
        if m:
            antes, lab, url = m.groups()
            url = WA if url == "wa.me" else url
            if antes.strip():
                partes.append(T.format(html.escape(antes.strip())))
            if not prim:
                prim = True
                partes.append(f'<mj-button href="{url}" background-color="#111318" color="#ffffff" font-size="16px" font-weight="700" border-radius="10px" inner-padding="14px 24px" align="left" padding="8px 0 24px">{html.escape(lab)} &#8594;</mj-button>')
            else:
                partes.append(f'<mj-text font-size="16px" padding="0 0 16px"><a href="{url}" style="color:#7C3AED;font-weight:700">{html.escape(lab)} &#8594;</a></mj-text>')
        elif l == "Ricardo":
            partes.append('<mj-text font-size="16px" font-weight="700" color="#111827" padding="8px 0 0">Ricardo</mj-text>')
        else:
            partes.append(T.format(negrita(l)))
    cerrar_caja()
    partes.append('<mj-text font-size="14px" color="#6B7280" padding="0">Fundador de Clinera</mj-text>')
    cuerpo_mj = "\n        ".join(partes)
    return f"""<mjml>
  <mj-head>
    <mj-title>{html.escape(asunto)}</mj-title>
    <mj-preview>{html.escape(preview)}</mj-preview>
    <mj-attributes><mj-all font-family="-apple-system, 'Segoe UI', Helvetica, Arial, sans-serif" /></mj-attributes>
  </mj-head>
  <mj-body background-color="#F7F7F8" width="560px">
    <!-- Franja de la marca en el borde derecho, como en clinera.io (Ricardo, 7-nov-2026). img/franja.png mide 560x8:
         blanco con las 4 bandas en los últimos 32 px, repetida hacia abajo y anclada a la derecha, así en el celular (más angosto) también se ve. Outlook de escritorio no la muestra. -->
    <mj-wrapper background-color="#ffffff" background-url="img/franja.png" background-repeat="repeat" background-position="top right" background-size="560px 8px" padding="0" css-class="franja">
    <mj-section padding="32px 60px 8px 28px">
      <mj-column>
        <mj-text font-size="20px" font-weight="800" color="#111318" padding="0 0 24px">clinera<span style="color:#22C55E">.</span>io</mj-text>
        {cuerpo_mj}
      </mj-column>
    </mj-section>
    <mj-section padding="12px 60px 28px 28px">
      <mj-column>
        <mj-text font-size="12px" color="#9CA3AF" padding="0">Recibes este correo porque creaste una cuenta gratis en Clinera. <a href="{{unsubscribe_link}}" style="color:#9CA3AF">Darme de baja</a></mj-text>
      </mj-column>
    </mj-section>
    </mj-wrapper>
  </mj-body>
</mjml>
""".replace("{{unsubscribe_link}}", "{unsubscribe_link}")


def main(salida: str):
    os.makedirs(salida, exist_ok=True)
    src = open(DOC, encoding="utf-8").read()
    bloques = re.split(r"\n## (\d) · [^«]*«([^»]+)»\n", src)
    hechos = []
    for i in range(1, len(bloques), 3):
        n, asunto = int(bloques[i]), bloques[i + 1]
        cuerpo = bloques[i + 2].split("\n---")[0].strip()
        slug = re.sub(r"[^a-z0-9]+", "-", asunto.lower().translate(str.maketrans("áéíóúñ¿", "aeioun "))).strip("-")
        z = os.path.join(salida, f"{n:02d}-{slug}.zip")
        with zipfile.ZipFile(z, "w", zipfile.ZIP_DEFLATED) as f:
            f.writestr("index.mjml", mjml(asunto, PREVIEW[n], cuerpo))
            f.write(os.path.join(AQUI, "img", "franja.png"), "img/franja.png")
        hechos.append(os.path.basename(z))
    print("\n".join(hechos))


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "loops-zips")
