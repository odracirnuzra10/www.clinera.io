Respaldos del JSON vivo de W1 antes de un PUT. Restaurar:
`PUT /api/v1/workflows/W1SybZZSEZqAItIt` con `name`, `nodes`,
`connections`, `settings` y `staticData` del archivo.

`W1SybZZSEZqAItIt-20260909-163845.json` es el mapeo cruzado
(PQL→MQL 10) que se reemplazó el 2026-09-09.

`W1SybZZSEZqAItIt-20260910-185007.json` es el mapeo sin PQL del 10-sep
(16:02Z) tal como estaba antes del relleno de etapas implícitas, que lo
reemplazó el 2026-09-10 18:50Z. El respaldo de las 16:02:50Z (previo al
mapeo sin PQL) no se conservó en el repo.

`W1SybZZSEZqAItIt-20260911-165330.json` es el mapeo del 10-sep
(relleno de etapas) tal como estaba antes de retirar esa etapa, aplicado
el 2026-09-11 16:53Z. SQL_Plus no se tocó.

`W1SybZZSEZqAItIt-20260912-164253.json` es el mapeo previo al de cinco
etapas del 12-sep (NEW→Lead 1; sin relleno de peldaños).
