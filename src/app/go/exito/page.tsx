import type { Metadata } from "next";
import GoExito from "@/components/go/GoExito";

export const metadata: Metadata = {
  title: "Pago recibido",
  robots: { index: false, follow: false },
};

export default function GoExitoPage() {
  return (
    <main>
      <GoExito />
    </main>
  );
}
