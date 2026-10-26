import { permanentRedirect } from "next/navigation";

// /home2 fue el borrador del home (26-oct-2026). Ricardo lo aprobó y pasó a ser
// `/` el mismo día: esta URL ahora redirige al home.
export default function Home2Page() {
  permanentRedirect("/");
}
