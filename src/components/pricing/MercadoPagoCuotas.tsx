/**
 * El anual se ofrece en 12 cuotas al mismo total de contado, con Mercado Pago.
 * El isotipo vive en public/brand/mercadopago.svg para compartirlo con
 * /presentacion, que no importa TS.
 */
export default function MercadoPagoCuotas() {
  return (
    <div
      data-mp-cuotas
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        maxWidth: 640,
        margin: "0 auto 16px",
        padding: "10px 16px",
        background: "#fff",
        border: "1px solid #D6F3FF",
        borderRadius: 14,
        boxShadow: "0 8px 24px -18px rgba(0,158,227,.7)",
      }}
    >
      <img
        src="/brand/mercadopago.svg"
        alt="Mercado Pago"
        width={34}
        height={34}
        style={{ display: "block", flex: "0 0 auto" }}
      />
      <p
        style={{
          margin: 0,
          fontFamily: "Inter, system-ui, sans-serif",
          fontSize: 14.5,
          lineHeight: 1.35,
          color: "#1F2937",
          textAlign: "left",
        }}
      >
        <strong style={{ fontWeight: 700, letterSpacing: "-0.02em" }}>
          12 cuotas a precio de contado
        </strong>
        {" "}pagando el plan anual con Mercado Pago.
      </p>
    </div>
  );
}
