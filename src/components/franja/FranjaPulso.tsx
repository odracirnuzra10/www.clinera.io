/**
 * Franja lateral de marca (Ricardo, 7-nov-2026; inspirada en loops.so): cuatro bandas azul → violeta →
 * magenta que crecen al cargar y un pulso de electrocardiograma que las recorre (software + medicina).
 * La misma pieza vive en HTML en public/kimi-gratis/index.html (.franja). Decorativa: no recibe clics.
 */
export default function FranjaPulso() {
  return (
    <div className="franja-pulso" aria-hidden="true">
      <i />
      <i />
      <i />
      <i />
      <svg viewBox="0 0 44 160" preserveAspectRatio="none">
        <path d="M22 0V58l-9 6 18 10-24 8 20 9-5 5V160" />
      </svg>
      <style>{`
        .franja-pulso{position:fixed;top:0;right:0;bottom:0;width:44px;display:grid;grid-template-columns:repeat(4,1fr);z-index:40;pointer-events:none;overflow:hidden}
        .franja-pulso i{display:block;transform-origin:top;transform:scaleY(0);animation:franjaSube 1s cubic-bezier(.2,.8,.2,1) forwards}
        .franja-pulso i:nth-child(1){background:#60A5FA;animation-delay:.05s}
        .franja-pulso i:nth-child(2){background:#2563EB;animation-delay:.18s}
        .franja-pulso i:nth-child(3){background:#7C3AED;animation-delay:.31s}
        .franja-pulso i:nth-child(4){background:#C026D3;animation-delay:.44s}
        @keyframes franjaSube{to{transform:scaleY(1)}}
        .franja-pulso svg{position:absolute;left:0;width:44px;height:160px;top:-170px;animation:franjaPulso 4.2s linear 1.3s infinite}
        .franja-pulso path{fill:none;stroke:#fff;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;filter:drop-shadow(0 0 4px rgba(255,255,255,.9))}
        @keyframes franjaPulso{to{transform:translateY(calc(100vh + 180px))}}
        @media (max-width:1279px){.franja-pulso{width:10px}.franja-pulso svg{display:none}}
        @media (prefers-reduced-motion:reduce){.franja-pulso i{animation:none;transform:none}.franja-pulso svg{display:none}}
        @media (min-width:1280px){.flota-cta{right:64px}}
        @media (min-width:769px) and (max-width:1279px){.flota-cta{right:26px}}
        @media (max-width:768px){.flota-cta{right:22px}}
      `}</style>
    </div>
  );
}
