"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  DEFAULT_PRICE_MODALITY,
  PRICE_MODALITY,
  type PriceModality,
  type PriceModalityMeta,
} from "@/content/pricing";
import {
  PRICE_MODALITY_QUERY,
  PRICE_MODALITY_STORAGE_KEY,
  parsePriceModality,
} from "@/lib/price-modality";

type PriceModalityContextValue = {
  modality: PriceModality;
  meta: PriceModalityMeta;
  setModality: (next: PriceModality) => void;
};

const PriceModalityContext = createContext<PriceModalityContextValue | null>(null);

function persistModality(next: PriceModality) {
  try {
    localStorage.setItem(PRICE_MODALITY_STORAGE_KEY, next);
  } catch {
    /* private browsing */
  }
}

function writeModalityQuery(next: PriceModality) {
  const url = new URL(window.location.href);
  url.searchParams.set(PRICE_MODALITY_QUERY, next);
  window.history.replaceState(
    window.history.state,
    "",
    `${url.pathname}${url.search}${url.hash}`,
  );
}

export function PriceModalityProvider({ children }: { children: React.ReactNode }) {
  const [modality, setModalityState] = useState<PriceModality>(DEFAULT_PRICE_MODALITY);

  useEffect(() => {
    const fromUrl = parsePriceModality(
      new URLSearchParams(window.location.search).get(PRICE_MODALITY_QUERY),
    );
    if (fromUrl) {
      setModalityState(fromUrl);
      persistModality(fromUrl);
      return;
    }
    try {
      const stored = parsePriceModality(localStorage.getItem(PRICE_MODALITY_STORAGE_KEY));
      if (stored) setModalityState(stored);
    } catch {
      /* ignore */
    }
  }, []);

  const setModality = useCallback((next: PriceModality) => {
    setModalityState(next);
    persistModality(next);
    writeModalityQuery(next);
  }, []);

  const value = useMemo<PriceModalityContextValue>(
    () => ({ modality, meta: PRICE_MODALITY[modality], setModality }),
    [modality, setModality],
  );

  return (
    <PriceModalityContext.Provider value={value}>{children}</PriceModalityContext.Provider>
  );
}

export function usePriceModality(): PriceModalityContextValue {
  const ctx = useContext(PriceModalityContext);
  if (!ctx) {
    return {
      modality: DEFAULT_PRICE_MODALITY,
      meta: PRICE_MODALITY[DEFAULT_PRICE_MODALITY],
      setModality: () => {},
    };
  }
  return ctx;
}
