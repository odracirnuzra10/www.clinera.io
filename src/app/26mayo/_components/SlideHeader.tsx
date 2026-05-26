import React from "react";

interface SlideHeaderProps {
  num: string;
  eyebrow: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
}

/** Encabezado consistente para cada "slide" de la presentación. */
export default function SlideHeader({ num, eyebrow, title, lead }: SlideHeaderProps) {
  return (
    <header className="mb-14">
      <div className="eyebrow">
        <span className="num">{num}</span>
        <span className="dash" />
        {eyebrow}
      </div>
      <h2 className="slide-title">{title}</h2>
      {lead && <p className="slide-lead">{lead}</p>}
    </header>
  );
}
