import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: false,
  turbopack: {
    root: __dirname,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async headers() {
    // CSP — allowlist permanente de los terceros que el stack usa o puede
    // usar a futuro. Si se integra un vendor nuevo que no esta abajo, hay
    // que agregarlo aca antes de pushear, o el browser lo bloquea.
    // 'unsafe-inline' / 'unsafe-eval' son necesarios para Next.js sin
    // nonce middleware.
    //
    // ┌──────────────────────────────────────────────────────────────────┐
    // │ ALLOWLIST DE TERCEROS — preautorizados                          │
    // ├──────────────────────────────────────────────────────────────────┤
    // │ Vendor              │ Directiva(s)                               │
    // │ ──────────────────  │ ─────────────────────────────────────────  │
    // │ GTM                 │ script-src                                 │
    // │ Google Analytics    │ script-src + img-src + connect-src         │
    // │ Meta Pixel / CAPI   │ script-src + img-src                       │
    // │ Microsoft Clarity   │ script-src + connect-src                   │
    // │ Hotjar              │ script-src + frame-src + connect-src       │
    // │ LinkedIn Insight    │ script-src                                 │
    // │ Stripe              │ script-src + frame-src (js.stripe.com)     │
    // │ Cal.com             │ script-src + frame-src (app.cal.com)       │
    // │ Calendly            │ script-src + frame-src (*.calendly.com)    │
    // │ SavvyCal            │ script-src + frame-src (embed.savvycal.com)│
    // │ Google Calendar     │ frame-src              (calendar.google)   │
    // │ Vimeo               │ script-src + frame-src + media-src         │
    // │ YouTube             │ frame-src                                  │
    // │ Google Fonts        │ style-src + font-src                       │
    // │ app.clinera.io      │ script-src + frame-src + connect-src       │
    // │ n8n / Make / Zapier │ connect-src (cubierto por https: wildcard) │
    // └──────────────────────────────────────────────────────────────────┘
    const csp = [
      "default-src 'self'",
      [
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
        // Vercel infra
        "https://*.vercel-scripts.com https://vercel.live",
        // GTM + GA + Google
        "https://*.googletagmanager.com https://*.google-analytics.com https://www.google-analytics.com https://www.google.com https://www.gstatic.com",
        // Meta Pixel
        "https://*.facebook.net https://connect.facebook.net",
        // Microsoft Clarity
        "https://www.clarity.ms https://*.clarity.ms",
        // Hotjar
        "https://*.hotjar.com https://*.hotjar.io",
        // LinkedIn Insight Tag
        "https://snap.licdn.com",
        // Vimeo player
        "https://player.vimeo.com",
        // Stripe
        "https://js.stripe.com",
        // Cal.com inline embed
        "https://app.cal.com https://*.cal.com",
        // Calendly inline embed
        "https://assets.calendly.com https://*.calendly.com",
        // SavvyCal embed
        "https://embed.savvycal.com https://*.savvycal.com",
        // App propia (Clinera dashboard)
        "https://app.clinera.io",
      ].join(" "),
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://assets.calendly.com",
      "font-src 'self' data: https://fonts.gstatic.com",
      "img-src 'self' data: blob: https:",
      "media-src 'self' https://*.vimeo.com",
      "connect-src 'self' https: wss:",
      [
        "frame-src 'self'",
        // Video
        "https://player.vimeo.com https://www.youtube.com https://www.youtube-nocookie.com",
        // Google (reCAPTCHA / DoubleClick)
        "https://www.google.com https://td.doubleclick.net",
        // Hotjar surveys
        "https://*.hotjar.com",
        // Stripe checkout
        "https://js.stripe.com https://hooks.stripe.com https://*.stripe.com",
        // Schedulers
        "https://app.cal.com https://*.cal.com",
        "https://*.calendly.com",
        "https://embed.savvycal.com https://*.savvycal.com",
        "https://calendar.google.com",
        // App propia
        "https://app.clinera.io",
      ].join(" "),
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
      // Fuerza descarga de archivos en /downloads/* (workflows, templates, etc).
      // Sin esto, el browser intenta renderizar el JSON inline en vez de descargarlo.
      // El nombre del archivo lo controla el atributo HTML download del <a> que
      // dispara la descarga (ver DownloadCTA.tsx).
      {
        source: "/downloads/:path*",
        headers: [
          { key: "Content-Disposition", value: "attachment" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
        ],
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
        source: '/webinars-presentacion',
        destination: '/webinars-presentacion/index.html',
      },
      {
        source: '/presentacion',
        destination: '/presentacion/index.html',
      },
      {
        source: '/futuro',
        destination: '/futuro/index.html',
      },
      {
        source: '/chat',
        destination: '/chat/index.html',
      },
      {
        source: '/lopez',
        destination: '/lopez/index.html',
      },
      {
        source: '/test-prompt',
        destination: '/test-prompt/index.html',
      },
      {
        source: '/workers',
        destination: '/workers/index.html',
      },
      {
        source: '/prompt',
        destination: '/prompt/index.html',
      },
      {
        source: '/update',
        destination: '/update/index.html',
      },
      {
        source: '/ckd',
        destination: '/ckd/index.html',
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/cdk',
        destination: '/ckd',
        permanent: true,
      },
      {
        source: '/cdk/:path*',
        destination: '/ckd/:path*',
        permanent: true,
      },
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
        source: '/planes.html',
        destination: '/planes',
        permanent: true,
      },
      {
        source: '/activar.html',
        destination: '/planes',
        permanent: true,
      },
      {
        source: '/ayuda.html',
        destination: '/ayuda',
        permanent: true,
      },
      {
        source: '/blog.html',
        destination: '/novedades',
        permanent: true,
      },
      {
        source: '/blog',
        destination: '/novedades',
        permanent: true,
      },
      {
        source: '/index.html',
        destination: '/',
        permanent: true,
      },
      {
        source: '/nosotros.html',
        destination: '/',
        permanent: true,
      },
      {
        source: '/software.html',
        destination: '/funciones',
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
      {
        source: '/reunion',
        destination: '/hablar-con-ventas',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
