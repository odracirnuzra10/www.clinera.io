# Mensajes programados — MCP «Google Chat Ricardo»

El conector MCP de Google Chat de Ricardo vive en n8n (`MCP · Google Chat`,
`xDXIu0jNUdcYAf2U`, path `google-chat-ricardo`), no en este repo. Cada tool es
un sub-workflow que habla con Google usando la credencial
`Google Chat - Ricardo (OAuth)`. La API de Chat no programa envíos, así que
la cola y el envío diferido se arman en n8n.

| Pieza | Id n8n | Qué hace |
|---|---|---|
| Data Table `gchat_mensajes_programados` | `hvtzcf2VGb7SQzjN` | La cola persistente (Postgres de n8n). Una fila por mensaje. |
| `programar_mensaje` | `PWQ3J44jTpsXNss2` | Valida espacio/texto/hilo y fecha (sin zona → `America/Santiago`; pasado → rechazo), resuelve el nombre del destino y guarda `pendiente`. |
| `listar_programados` | `BobJ9exxqeFCG65e` | Por defecto los `pendiente`; filtro `estado` (o `todos`). Fechas en hora Chile. |
| `cancelar_programado` | `wHSGSQxQzJ6EOmKa` | `pendiente` → `cancelado` con un solo UPDATE condicionado; si ya no estaba pendiente, explica por qué. |
| `enviar_programado (interno)` | `ghrtw0UH6L7Uj9jb` | Reclama una fila, la manda por el sub-workflow de `enviar_mensaje` y guarda el resultado. |
| `Envío de programados (cron)` | `pTm4EVtXl6BpyEHa` | Schedule Trigger cada 1 minuto: busca vencidos y llama al interno por cada uno. |

## Por qué no hay envíos dobles

1. **Reclamo atómico.** El interno hace `UPDATE … SET estado='enviando'
   WHERE id=? AND estado='pendiente' RETURNING` (Data Table sobre Postgres).
   Si dos ejecuciones del cron se pisan, sólo una recibe la fila.
2. **`requestId` en Google.** `enviar_mensaje` acepta un input opcional
   `request_id` que va como `requestId` al POST. El interno manda
   `gchat-prog-{tabla}-{id}`: un reintento después de un envío que sí salió
   devuelve el mismo mensaje en vez de crear otro. Probado el 23-sep-2026
   forzando el reenvío de una fila ya enviada: mismo `mensajeId`, un solo
   mensaje en el chat. La tool MCP no pasa `request_id`, así que
   `enviar_mensaje` directo quedó igual que antes.
3. **Atascados.** Un `enviando` con más de 10 min vuelve a `pendiente`
   (lo cubre el `requestId`); si ya iba en el último intento, queda en
   `error` para revisar a mano.

## Errores y reintentos

`clasificarEnvio()` en `helpers.js`:

- **429 / 5xx / sin respuesta** → hasta 3 reintentos (esperas de 1, 2 y
  4 min vía `proximoIntento`); después `error` con el detalle.
- **Credencial** (401/403, o n8n no pudo refrescar el token) → `error` al
  toque, sin reintento. El refresco del token OAuth lo hace n8n solo en cada
  HTTP con la credencial; si el refresh falla, hay que reconectar la
  credencial en n8n.
- **Resto** (404, 400…) → `error` definitivo.

`enviado` guarda `enviadoEn` (hora real), `mensajeId` (el `name` que
devolvió Google) y `link`.

## Aplicar / probar

```bash
python3 aplicar_programados.py              # simulacro
python3 aplicar_programados.py --aplicar    # escribe en n8n (idempotente)
python3 aplicar_programados.py --prueba-crear   # MCP clon con bearer propio
python3 aplicar_programados.py --prueba-borrar  # lo elimina
```

`helpers.js` es el prefijo de todos los nodos Code nuevos; su guardián es
`tests/gchat-programados.spec.ts`. `backup-2026-09-23/` tiene
`enviar_mensaje` y el MCP server tal como estaban antes del cambio.

Google Chat no deja que Ricardo tenga un DM consigo mismo (`spaces:setup`
responde 400). Para pruebas existe el espacio privado
`Pruebas MCP · mensajes programados` (`spaces/AAQAJkH0DMs`), donde Ricardo
es el único miembro.
