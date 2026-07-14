import { NextRequest, NextResponse } from "next/server";

// Gate mínimo para /mid-market (material interno de estrategia).
// Protegido con HTTP Basic Auth contra la variable de entorno MIDMARKET_KEY.
// La clave es la contraseña; el usuario puede ser cualquiera.
export const config = {
  matcher: ["/mid-market", "/mid-market/:path*"],
};

function unauthorized() {
  return new NextResponse("Autenticación requerida.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Clinera Mid-Market", charset="UTF-8"',
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow, noarchive",
    },
  });
}

export function middleware(req: NextRequest) {
  const key = process.env.MIDMARKET_KEY;

  // Fail-closed: si no hay clave configurada, no exponemos el deck.
  if (!key) {
    return new NextResponse("Mid-Market: acceso no configurado.", {
      status: 503,
      headers: { "X-Robots-Tag": "noindex, nofollow, noarchive" },
    });
  }

  const auth = req.headers.get("authorization");
  if (auth) {
    const [scheme, encoded] = auth.split(" ");
    if (scheme === "Basic" && encoded) {
      let decoded = "";
      try {
        decoded = atob(encoded);
      } catch {
        decoded = "";
      }
      const sep = decoded.indexOf(":");
      const pass = sep >= 0 ? decoded.slice(sep + 1) : decoded;
      if (pass === key) {
        const res = NextResponse.next();
        res.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
        return res;
      }
    }
  }

  return unauthorized();
}
