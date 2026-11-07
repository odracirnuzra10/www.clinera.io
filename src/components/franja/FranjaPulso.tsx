/**
 * Franja lateral de marca (Ricardo, 7-nov-2026; inspirada en loops.so): cuatro bandas azul → violeta →
 * magenta que crecen al cargar (Ricardo sacó el pulso de electrocardiograma el 7-nov-2026).
 * La misma pieza vive en HTML en public/kimi-gratis/index.html (.franja). Decorativa: no recibe clics.
 */
export default function FranjaPulso() {
  return (
    <div className="franja-pulso" aria-hidden="true">
      <i />
      <i />
      <i />
      <i />
      <style>{`
        .franja-pulso{position:fixed;top:0;right:0;bottom:0;width:44px;display:grid;grid-template-columns:repeat(4,1fr);z-index:47;pointer-events:none;overflow:hidden}
        .franja-pulso i{display:block;transform-origin:top;transform:scaleY(0);animation:franjaSube 1s cubic-bezier(.2,.8,.2,1) forwards}
        .franja-pulso i:nth-child(1){background:#60A5FA;animation-delay:.05s}
        .franja-pulso i:nth-child(2){background:#2563EB;animation-delay:.18s}
        .franja-pulso i:nth-child(3){background:#7C3AED;animation-delay:.31s}
        .franja-pulso i:nth-child(4){background:#C026D3;animation-delay:.44s}
        @keyframes franjaSube{to{transform:scaleY(1)}}
        @media (max-width:1279px){.franja-pulso{width:10px}}
        footer{position:relative;z-index:48}
        @media (prefers-reduced-motion:reduce){.franja-pulso i{animation:none;transform:none}}
        @media (min-width:1280px){.flota-cta{right:64px}}
        @media (min-width:769px) and (max-width:1279px){.flota-cta{right:26px}}
        @media (max-width:768px){.flota-cta{right:22px}}
      `}</style>
    </div>
  );
}
