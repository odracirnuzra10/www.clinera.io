"use client";

import React, { useEffect, useState } from "react";

/** Barra fina de progreso de lectura en el borde superior. */
export default function DeckProgress() {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight || 1);
      setWidth(Math.min(100, Math.max(0, scrolled * 100)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return <div className="deck-progress" style={{ width: `${width}%` }} />;
}
