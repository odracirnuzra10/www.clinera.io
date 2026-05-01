import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: false,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async headers() {
    // CSP — permite los scripts/iframes que el sitio usa hoy:
    // GTM, GA, Meta Pixel, Microsoft Clarity, Vercel scripts, YouTube, Vimeo,
    // Google Fonts, Linkedin Insight Tag. 'unsafe-inline' / 'unsafe-eval' son
    // necesarios para Next.js sin nonce middleware.
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.vercel-scripts.com https://vercel.live https://*.googletagmanager.com https://*.google-analytics.com https://www.google-analytics.com https://www.google.com https://www.gstatic.com https://*.facebook.net https://connect.facebook.net https://www.clarity.ms https://*.clarity.ms https://snap.licdn.com https://player.vimeo.com https://app.cal.com https://*.cal.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' data: https://fonts.gstatic.com",
      "img-src 'self' data: blob: https:",
      "media-src 'self' https://*.vimeo.com",
      "connect-src 'self' https: wss:",
      "frame-src 'self' https://player.vimeo.com https://www.youtube.com https://www.youtube-nocookie.com https://www.google.com https://td.doubleclick.net https://*.calendly.com https://app.cal.com https://*.cal.com",
      "frame-ancestors 'self'",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
      "upgrade-insecure-requests",
    ].join("; ");

    const securityHeaders = [
      // Anti-clickjacking. frame-ancestors en CSP cubre browsers modernos;
      // X-Frame-Options sigue siendo el fallback para clientes viejos.
      { key: "X-Frame-Options", value: "DENY" },
      // Bloquea MIME-sniffing de contenido.
      { key: "X-Content-Type-Options", value: "nosniff" },
      // Limita info de Referer hacia terceros.
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      // Apaga features sensibles que no usamos a nivel landing.
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
      },
      // HSTS: ya estaba activo desde Vercel; lo declaro explicito para
      // dejar el tope de subdominios + preload.
      {
        key: "Strict-Transport-Security",
        value: "max-age=63072000; includeSubDomains; preload",
      },
      // Override del CORS `*` que Vercel emite por default. Limitamos a
      // mismo dominio (no exponemos APIs publicas en este host).
      {
        key: "Access-Control-Allow-Origin",
        value: "https://www.clinera.io",
      },
      { key: "Vary", value: "Origin" },
      // Content Security Policy.
      { key: "Content-Security-Policy", value: csp },
    ];

    return [
      // Aplica a todas las rutas excepto assets estaticos de Next (los
      // _next/static necesitan CORS abierto para que los CDN funcionen).
      {
        source: "/((?!_next/static|_next/image|favicon.ico).*)",
        headers: securityHeaders,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/support',
        destination: '/support/index.html',
      },
      {
        source: '/presentacion',
        destination: '/presentacion/index.html',
      },
      {
        source: '/test-prompt',
        destination: '/test-prompt/index.html',
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/software',
        destination: '/funciones',
        permanent: true,
      },
      {
        source: '/funcionalidades',
        destination: '/funciones',
        permanent: true,
      },
      {
        source: '/contrata',
        destination: '/planes',
        permanent: true,
      },
      {
        source: '/contrata/:path*',
        destination: '/planes',
        permanent: true,
      },
      {
        source: '/gracias.html',
        destination: '/gracias',
        permanent: true,
      },
      {
        source: '/start',
        destination: '/planes',
        permanent: true,
      },
      {
        source: '/inicia',
        destination: '/planes',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
