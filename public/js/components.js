class ClineraHeader extends HTMLElement {
    connectedCallback() {
        // --- INYECCIÓN DE TRACKING (Google Ads + Meta Pixel) ---
        if (!window.__clineraTrackingInitialized) {
            window.__clineraTrackingInitialized = true;

            // Meta Pixel Code
            !function (f, b, e, v, n, t, s) {
                if (f.fbq) return; n = f.fbq = function () {
                    n.callMethod ?
                        n.callMethod.apply(n, arguments) : n.queue.push(arguments)
                };
                if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0';
                n.queue = []; t = b.createElement(e); t.async = !0;
                t.src = v; s = b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t, s)
            }(window, document, 'script',
                'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '2251201709002818');
            fbq('track', 'PageView');

            // Google Ads Code removed — now managed via GTM
        }
        // ---------------------------------------------------------

        // Usamos el atributo 'base' para rutas relativas (ej: base="../")
        const b = this.getAttribute('base') || '';

        this.innerHTML = `
        <style>
            .site-header-wrapper {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                z-index: 1000;
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(10px);
                border-bottom: 1px solid var(--border-light);
            }
            :host {
                display: block;
                width: 100%;
            }
            .micro-header {
                background: #fdfdfd;
                border-bottom: 1px solid #eaeaea;
                font-size: 0.8rem;
                color: var(--text-muted);
            }
            .micro-header-inner {
                display: flex;
                justify-content: space-between;
                align-items: center;
                height: 40px;
                max-width: var(--max-width, 1280px);
                margin: 0 auto;
                padding: 0 24px;
            }
            .micro-header-left, .micro-header-right {
                display: flex;
                gap: 1.5rem;
                align-items: center;
            }
            .micro-link {
                color: var(--text-muted);
                text-decoration: none;
                display: flex;
                align-items: center;
                gap: 0.4rem;
                transition: color 0.2s;
            }
            .micro-link:hover {
                color: var(--brand-cyan);
            }
            .micro-link .icon {
                font-size: 0.95rem;
                opacity: 0.8;
                filter: grayscale(1);
            }
            .micro-link .icon-globe { filter: grayscale(0.5); }
            
            .font-medium {
                font-weight: 500;
            }
            
            .main-header-inner {
                display: flex;
                justify-content: space-between;
                align-items: center;
                height: 72px;
                max-width: var(--max-width, 1280px);
                margin: 0 auto;
                padding: 0 24px;
            }
            .main-header .logo {
                display: flex;
                align-items: center;
            }
            .main-header .nav-links {
                display: flex;
                gap: 2rem;
                align-items: center;
            }
            .main-header .nav-links a, .main-header .dropdown-trigger {
                color: var(--text-main);
                font-weight: 500;
                text-decoration: none;
                cursor: pointer;
                transition: color 0.2s ease;
            }
            .main-header .nav-links a:hover, .main-header .dropdown:hover .dropdown-trigger {
                color: var(--brand-cyan);
            }
            
            .main-header .dropdown {
                position: relative;
            }
            .main-header .dropdown-menu {
                display: none;
                position: absolute;
                top: 100%;
                left: 0;
                background: #fff;
                min-width: 160px;
                box-shadow: 0 4px 10px rgba(0,0,0,0.1);
                border-radius: 8px;
                border: 1px solid var(--border-light);
                padding: 0.5rem 0;
                margin-top: 10px;
                z-index: 100;
            }
            /* Triángulo del dropdown */
            .main-header .dropdown-menu::before {
                content: '';
                position: absolute;
                top: -6px;
                left: 20px;
                width: 10px;
                height: 10px;
                background: #fff;
                transform: rotate(45deg);
                border-top: 1px solid var(--border-light);
                border-left: 1px solid var(--border-light);
            }
            .main-header .dropdown:hover .dropdown-menu {
                display: block;
            }
            .main-header .dropdown-menu a {
                display: block;
                padding: 0.6rem 1.5rem;
                color: var(--text-muted);
                transition: all 0.2s;
                font-size: 0.95rem;
            }
            .main-header .dropdown-menu a:hover {
                background: var(--brand-cyan-light);
                color: var(--brand-cyan);
            }
            
            .header-actions {
                display: flex;
                gap: 1rem;
                align-items: center;
            }
            
            /* Ajuste del body global */
            body {
                padding-top: 112px;
            }

            @media (max-width: 968px) {
                .micro-header { display: none; }
                .main-header .nav-links { display: none; }
                .header-actions { display: none; }
                .main-header-inner {
                    padding: 0 24px;
                    height: 72px;
                }
                body { padding-top: 72px; }
                
                .mobile-menu-toggle {
                    display: block;
                    background: none;
                    border: none;
                    cursor: pointer;
                    padding: 8px;
                    z-index: 1001;
                }
                
                .mobile-menu {
                    position: fixed;
                    top: 0;
                    right: -100%;
                    width: 100%;
                    height: 100vh;
                    background: #fff;
                    z-index: 1000;
                    display: flex;
                    flex-direction: column;
                    padding: 100px 24px 40px;
                    transition: right 0.3s ease;
                    overflow-y: auto;
                }
                
                .mobile-menu.active {
                    right: 0;
                }
                
                .mobile-menu .nav-links-mobile {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                    margin-bottom: 2rem;
                }
                
                .mobile-menu .nav-links-mobile a {
                    font-size: 1.25rem;
                    font-weight: 700;
                    text-decoration: none;
                    color: var(--text-main);
                }
                
                .mobile-menu .micro-links-mobile {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    padding-top: 2rem;
                    border-top: 1px solid var(--border-light);
                    margin-bottom: 2rem;
                }
                
                .mobile-menu .micro-link-m {
                    color: var(--text-muted);
                    text-decoration: none;
                    font-size: 1rem;
                }
                
                .mobile-menu .header-actions-mobile {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
            }
            
            @media (min-width: 969px) {
                .mobile-menu-toggle { display: none; }
                .mobile-menu { display: none; }
            }
        </style>

        <div class="site-header-wrapper">
          <div class="micro-header">
            <div class="micro-header-inner">
              <div class="micro-header-left">
                <a href="${b}ayuda.html" class="micro-link"><span class="icon">💬</span> Ayuda y soporte</a>
              </div>
              <div class="micro-header-right">
                <a href="https://app.clinera.io" class="micro-link font-medium">Iniciar sesión</a>
                <a href="${b}nosotros.html" class="micro-link font-medium">Sobre nosotros ▾</a>
              </div>
            </div>
          </div>

          <header class="main-header">
            <div class="main-header-inner">
              <a href="${b}index.html" class="logo">
                <img src="${b}clinera-new.svg?v=3" alt="Clinera Logo" height="34">
              </a>
              <nav class="nav-links">
                <a href="${b}software.html">Funcionalidades</a>
                <a href="${b}planes.html">Planes</a>
                <a href="${b}roadmap.html">Roadmap</a>
              </nav>
              <div class="header-actions">
                <a href="${b}planes.html" class="btn btn-primary">Prueba Gratis</a>
              </div>
              
              <button class="mobile-menu-toggle" aria-label="Abrir menú">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              </button>
            </div>
          </header>
          
          <div class="mobile-menu">
            <div class="nav-links-mobile">
                <a href="${b}software.html">Funcionalidades</a>
                <a href="${b}planes.html">Planes</a>
                <a href="${b}roadmap.html">Roadmap</a>
            </div>
            <div class="micro-links-mobile">
                <a href="${b}ayuda.html" class="micro-link-m">💬 Ayuda y soporte</a>
                <a href="https://app.clinera.io" class="micro-link-m">Log in</a>
                <a href="${b}nosotros.html" class="micro-link-m">Sobre nosotros</a>
            </div>
            <div class="header-actions-mobile">
                <a href="${b}planes.html" class="btn btn-primary">Prueba Gratis</a>
            </div>
          </div>
        </div>
        `;

        this.initMobileMenu();
    }

    initMobileMenu() {
        const toggle = this.querySelector('.mobile-menu-toggle');
        const menu = this.querySelector('.mobile-menu');
        const body = document.body;

        if (toggle && menu) {
            toggle.addEventListener('click', () => {
                menu.classList.toggle('active');
                body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';

                // Animación simple de icono
                const isActive = menu.classList.contains('active');
                toggle.innerHTML = isActive
                    ? `
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>`
                    : `
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <line x1="3" y1="12" x2="21" y2="12"></line>
                      <line x1="3" y1="6" x2="21" y2="6"></line>
                      <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>`;
            });
        }
    }
}
customElements.define('clinera-header', ClineraHeader);
