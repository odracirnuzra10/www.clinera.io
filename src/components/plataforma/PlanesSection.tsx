"use client";

import Link from "next/link";
import { useReveal } from "@/components/home-v3/sections";
import PlanesVigentes from "@/components/pricing/PlanesVigentes";
import { track } from "@/lib/tracking";
import styles from "./PlataformaLanding.module.css";

/* En esta página el comprador tiene varias sedes y compra con migración
   gestionada: necesita un carril de ventas. Las dos opciones vigentes (Vortex y
   Ecosistema) llevan a /agenda, porque el objetivo de /plataforma es la reunión. */
export default function PlanesSection() {
  useReveal();
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
          .reveal{opacity:0;transform:translateY(12px);transition:opacity .6s cubic-bezier(.16,1,.3,1),transform .6s cubic-bezier(.16,1,.3,1);}
          .reveal.in{opacity:1;transform:none;}
          @media (prefers-reduced-motion: reduce){*{animation-duration:0ms!important;transition-duration:0ms!important;}}
          @media (max-width:720px){#precios{padding-left:24px!important;padding-right:24px!important;}}
        `,
        }}
      />
      <PlanesVigentes id="precios" titulo="Elige cómo" tituloAcento="quieres partir." />
      <div className={styles.salesLane}>
        <p>
          ¿Varias sedes, migración desde otro sistema o facturación a empresa? Lo vemos antes de
          contratar.
        </p>
        <Link
          href="/agenda"
          className={styles.ghostCta}
          data-cta="planes-ventas"
          onClick={() =>
            track("cta_click", { cta_id: "planes-ventas", cta_location: "precios", page: "plataforma" })
          }
        >
          Agendar reunión
        </Link>
      </div>
    </>
  );
}
