/**
 * Equipo público de implementación asistida (home).
 * Fotos: `public/images/team/<slug>.webp` (≤480px, 1:1).
 * Para sumar a alguien: agregar entrada + WebP con el mismo slug.
 */
export type TeamMember = {
  name: string;
  role: string;
  slug: string;
  image: string;
};

export const TEAM_MEMBERS: TeamMember[] = [
  {
    name: "Ricardo Oyarzún",
    role: "Founder & CEO",
    slug: "ricardo-oyarzun",
    image: "/images/team/ricardo-oyarzun.webp",
  },
  {
    name: "Mauricio López",
    role: "CTO",
    slug: "mauricio-lopez",
    image: "/images/team/mauricio-lopez.webp",
  },
  {
    name: "Jorge Cheul",
    role: "Gerente de Operaciones",
    slug: "jorge-cheul",
    image: "/images/team/jorge-cheul.webp",
  },
  {
    name: "Nicolás Agurto",
    role: "Desarrollador de Soporte y Soluciones Técnicas",
    slug: "nicolas-agurto",
    image: "/images/team/nicolas-agurto.webp",
  },
  {
    name: "Daniel Rozitchner",
    role: "Desarrollo",
    slug: "daniel-rozitchner",
    image: "/images/team/daniel-rozitchner.webp",
  },
  {
    name: "Jorge Quispe",
    role: "Desarrollo",
    slug: "jorge-quispe",
    image: "/images/team/jorge-quispe.webp",
  },
  {
    name: "Nohelymar Sánchez",
    role: "Ventas",
    slug: "nohelymar-sanchez",
    image: "/images/team/nohelymar-sanchez.webp",
  },
  {
    name: "Rebeca Navarro",
    role: "Ventas",
    slug: "rebeca-navarro",
    image: "/images/team/rebeca-navarro.webp",
  },
];
