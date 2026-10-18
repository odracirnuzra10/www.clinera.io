// Clínicas reales que operan con Clinera, con logo. Es la misma lista que
// /plataforma publica (`CLIENTS` en PlataformaLanding). La franja vieja del home
// («Hospital del Valle», «Dermaclinic»…) tenía nombres INVENTADOS: no vuelvas a
// esa lista. Para sumar una clínica, su logo va en `public/presentacion/clientes/`.
export const CLINICAS_LOGOS = [
  { src: "/presentacion/clientes/hebe.png", alt: "Método Hebe" },
  { src: "/presentacion/clientes/lumina.png", alt: "Protocolo Lumina" },
  { src: "/presentacion/clientes/andes.png", alt: "Andes Salud" },
  { src: "/presentacion/clientes/sanatorio.png", alt: "Sanatorio Alemán" },
  // Everest viene sobre un fondo azul sólido: `everest-mono.png` es el mismo logo sin el recuadro.
  { src: "/presentacion/clientes/everest-mono.png", alt: "Everest Clínicas Dentales" },
  { src: "/presentacion/clientes/sonrie.png", alt: "Sonríe" },
] as const;

export const CLINICAS_LOGOS_TITULO = "Usado por clínicas líderes en Chile y LATAM";
