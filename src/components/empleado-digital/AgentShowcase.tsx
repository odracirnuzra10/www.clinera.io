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
}: Props) {
  return (
    <section
      id={id}
      className={`${styles.showcase} ${reverse ? styles.showcaseReverse : ""}`}
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
