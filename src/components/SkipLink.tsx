"use client";

// Skip-link de accesibilidad (WCAG 2.4.1): permite a usuarios de teclado
// saltar la navegación. Enfoca el <main> de la página actual sin requerir
// un id por página.
export default function SkipLink() {
  return (
    <a
      href="#contenido"
      className="skip-link"
      onClick={(e) => {
        e.preventDefault();
        const main = document.querySelector("main");
        if (main) {
          main.setAttribute("tabindex", "-1");
          (main as HTMLElement).focus({ preventScroll: false });
        }
      }}
    >
      Saltar al contenido
    </a>
  );
}
