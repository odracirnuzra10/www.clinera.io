# Formato de diseño Clinera × heymark (Ricardo, 19-nov-2026)

Ricardo lo aprobó («me encantó») el 19-nov-2026 al ver `/home2` (`public/home-mix/index.html`). Desde entonces es el
formato de referencia para páginas, landings y piezas de redes de Clinera. Se usó en `/home2`, `/home-mix`,
`/prueba-gratis` y en el primer carrusel de redes.

## Lo nuestro (no se negocia)
- Fondo blanco puro, light-first. El oscuro solo en tarjetas puntuales.
- Degradado azul → violeta → magenta (`#3B82F6 → #7C3AED → #D946EF`), siempre en degradado, nunca plano.
- Tipografía: Plus Jakarta Sans 800 para titulares (interletrado −0,04 em) y Geist Mono en mayúsculas para la metadata.
- Botón principal en píldora con el degradado y chip «GRATIS». Secundario blanco con borde.

## Lo que tomamos de heymark.ai
1. **Trazo a mano que se dibuja solo**: un círculo con el degradado alrededor de la palabra clave del titular (SVG
   `stroke-dasharray` animado, ~1,4 s). Máximo uno por bloque. También flechas a mano que apuntan al botón o bajan.
2. **Íconos flotando** junto al titular: WhatsApp, Instagram, Facebook, agenda y, encima, los modelos de IA
   (Anthropic, Gemini, OpenAI). Entran uno a uno y flotan suave.
3. **Relato con scroll**: pasos a la izquierda (uno activo, los demás al 22 % de opacidad, gota de color como viñeta)
   y a la derecha una pantalla de Clinera fija que cambia por paso: chat → horas → agenda → pago → ficha → Intelligence.
   En el celular la pantalla va arriba, fija, y los pasos debajo.
4. **Cursores con nombre** («AURA · IA» violeta, «Dra. Paz» celeste) que se mueven a donde ocurre la acción.
5. **Tarjetas oscuras** con una pregunta que se escribe sola y la respuesta que aparece después.
6. Lienzo detrás de la pantalla: degradado suave lila/rosa/celeste con una grilla de puntos.

## Qué no copiamos
La ilustración del edificio, el fondo crema con textura y su logo. Son la marca de heymark.

## Reglas
- Datos y pacientes de las pantallas son de ejemplo (Valentina R., Dra. Paz) y se rotulan así cuando haga falta.
- Siempre con `prefers-reduced-motion`: sin animación, el trazo aparece dibujado.
- Fuente del código: `public/home-mix/index.html` (copiar de ahí, no reinventar). En `/prueba-gratis` las clases
  llevan prefijo `r-` para no chocar con las de la landing.
