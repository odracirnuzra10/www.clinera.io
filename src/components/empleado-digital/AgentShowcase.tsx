import type { ReactNode } from "react";
import styles from "@/app/empleado-digital/empleado-digital.module.css";

type Props = {
  id: "aura" | "lia";
  eyebrow: string;
  headline: string;
  body: string;
  imageSrc: string;
  imageAlt: string;
  reverse?: boolean;
  bg?: string;
  /** true → invierte colores de texto para fondos oscuros */
  dark?: boolean;
  /** Card flotante que se ancla a la esquina de la imagen del lado de la copy */
  floatingCard?: ReactNode;
};

export default function AgentShowcase({
  id,
  eyebrow,
  headline,
  body,
  imageSrc,
  imageAlt,
  reverse,
  bg,
  dark,
  floatingCard,
}: Props) {
  return (
    <section
      id={id}
      className={[
        styles.showcase,
        reverse ? styles.showcaseReverse : "",
        dark ? styles.showcaseDark : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={bg ? { background: bg } : undefined}
      aria-labelledby={`${id}-headline`}
    >
      <div className={styles.showcaseInner}>
        <div className={styles.showcaseImageWrap}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageSrc}
            alt={imageAlt}
            className={styles.showcaseImage}
            loading="lazy"
            decoding="async"
          />
          {floatingCard && (
            <div
              className={`${styles.showcaseFloatingCard} ${
                reverse ? styles.showcaseFloatingCardLeft : styles.showcaseFloatingCardRight
              }`}
            >
              {floatingCard}
            </div>
          )}
        </div>
        <div className={styles.showcaseCopy}>
          <p className={styles.showcaseEyebrow}>{eyebrow}</p>
          <h2 id={`${id}-headline`} className={styles.showcaseHeadline}>
            {headline}
          </h2>
          <p className={styles.showcaseBody}>{body}</p>
        </div>
      </div>
    </section>
  );
}
