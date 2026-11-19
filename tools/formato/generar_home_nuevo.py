# Genera src/components/formato/HomeNuevo.tsx desde public/home-mix/index.html.
# Uso, desde la raíz del repo: python3 tools/formato/generar_home_nuevo.py
import json, re
src = open('public/home-mix/index.html').read()
css = src[src.index('<style>')+7:src.index('</style>')]
body = src[src.index('<body>')+6:src.index('<script>', src.index('<body>'))]
js = src[src.index('<script>', src.index('<body>'))+8:src.rindex('</script>')]
# quitar nav y footer propios: el sitio pone NavV3 y FooterV3
body = re.sub(r'<nav id="nav">.*?</nav>', '', body, flags=re.S)
body = re.sub(r'<footer>.*?</footer>', '', body, flags=re.S)
assert '<nav' not in body and '<footer' not in body
# Logos: la caja real (MarcasCaja) reemplaza la fila de nombres en texto
body = re.sub(r'<section class="logos">.*?</section>', '<!--MARCAS-->', body, flags=re.S)
assert '<!--MARCAS-->' in body
body = body.replace('<a class="btn btn-grad" href="https://app.clinera.io/auth/register?plan=xcale" data-registro>Crea tu cuenta', '<a data-home2-registro="hero" class="btn btn-grad" href="https://app.clinera.io/auth/register?plan=xcale" data-registro>Crea tu cuenta', 1)
body = body.replace('<a class="btn btn-line" href="https://wa.me/56985581524?text=necesito%20asistencia">', '<a data-home2-cta="hero" class="btn btn-line" href="https://wa.me/56985581524?text=necesito%20asistencia">', 1)
body = body.replace('<section class="relato" id="como">', '<section class="relato" id="como" data-home2="relato">', 1)
assert body.count('data-home2-registro="hero"')==1 and body.count('data-home2-cta="hero"')==1
body = body.replace('<header class="hero">','<section class="hero" data-home2="hero">',1).replace('</header>','</section>',1)
assert '<header' not in body
# CTA de registro: los intercepta RegistroModal (suma utm/fbclid)
def cta(m):
    tag = m.group(0)
    plan = re.search(r'plan=(\w+)', tag).group(1)
    return tag.replace('<a ', f'<a data-cta-registro data-plan-elegido="{plan}" ', 1)
body = re.sub(r'<a [^>]*href="https://app\.clinera\.io/auth/register\?plan=\w+"[^>]*>', cta, body)
body = re.sub(r'<a ([^>]*href="https://wa\.me/56985581524\?text=necesito%20asistencia")', r'<a data-cta-asistencia \1', body)
# script: sin nav propio
js = js.replace("var nav=document.getElementById('nav');", "var nav=document.getElementById('nav')||document.createElement('div');")

# Encapsular el CSS bajo .hm para que no toque el menú, el pie ni los modales del sitio
def scope_sel(sel):
    out=[]
    for s in sel.split(','):
        s=s.strip()
        if not s: continue
        if s in ('html','body',':root'): out.append('.hm'); continue
        if s=='*': out.append('.hm, .hm *'); continue
        s=re.sub(r'^(html|body)\s+','',s)
        out.append('.hm '+s)
    return ', '.join(out)
def scope(block):
    res=[];i=0
    while i<len(block):
        j=block.find('{',i)
        if j<0: res.append(block[i:]);break
        head=block[i:j].strip()
        # buscar cierre balanceado
        d=0;k=j
        while True:
            if block[k]=='{': d+=1
            elif block[k]=='}':
                d-=1
                if d==0: break
            k+=1
        inner=block[j+1:k]
        h=re.sub(r'/\*.*?\*/','',head,flags=re.S).strip()
        if h.startswith('@media') or h.startswith('@supports'):
            res.append(h+'{'+scope(inner)+'}')
        elif h.startswith('@'):
            res.append(h+'{'+inner+'}')
        else:
            res.append(scope_sel(h)+'{'+inner+'}')
        i=k+1
    return '\n'.join(res)
css = re.sub(r'/\*.*?\*/','',css,flags=re.S)
css = scope(css)
css = css.replace("overflow-x:hidden","overflow-x:clip")
css = "@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Geist+Mono:wght@500&display=swap');\n" + css + "\n.hm h1,.hm h2,.hm h3,.hm p{margin:0}\n"

tsx = '''// @ts-nocheck
/* eslint-disable */
"use client";

// Home nuevo (Ricardo, 19-nov-2026): la página de /home2 (public/home-mix/index.html) dentro del sitio.
// Generado desde ese archivo: CSS encapsulado bajo .hm, sin su menú ni pie (el sitio pone NavV3 y FooterV3),
// y los botones de registro con data-cta-registro para que RegistroModal sume los utm.
// Si cambia public/home-mix/index.html, se vuelve a generar. Formato: docs/formato-diseno-clinera.md.

import { useEffect, useRef } from "react";
import { MarcasCaja } from "@/components/home2/IncluyeYMarcas";

const CSS = %s;
const [HTML_A, HTML_B] = %s.split("<!--MARCAS-->");

function iniciar() {
%s
}

export default function HomeNuevo() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || el.dataset.iniciado) return;
    el.dataset.iniciado = "1";
    iniciar();
  }, []);
  return (
    <div ref={ref} className="hm" data-home-nuevo>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div dangerouslySetInnerHTML={{ __html: HTML_A }} />
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px 24px" }}>
        <MarcasCaja />
      </div>
      <div dangerouslySetInnerHTML={{ __html: HTML_B }} />
    </div>
  );
}
''' % (json.dumps(css, ensure_ascii=False), json.dumps(body, ensure_ascii=False), js)
open('src/components/formato/HomeNuevo.tsx','w').write(tsx)
print('ok', len(css), len(body), len(js))
