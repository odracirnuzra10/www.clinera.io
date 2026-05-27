'use client';

import { useEffect } from 'react';
import styles from './reunion.module.css';
import { buildCalLinkWithAttribution } from '@/lib/gclid';

declare global {
  interface Window {
    Cal?: any;
    dataLayer?: any[];
    fbq?: (...args: unknown[]) => void;
  }
}

export default function CalEmbed() {
  useEffect(() => {
    // ── Cal.com embed init ────────────────────────────────────────
    (function (C: any, A: string, L: string) {
      const p = function (a: any, ar: IArguments) {
        a.q.push(ar);
      };
      const d = C.document;
      C.Cal =
        C.Cal ||
        function () {
          // eslint-disable-next-line prefer-rest-params
          const cal = C.Cal;
          // eslint-disable-next-line prefer-rest-params
          const ar = arguments as unknown as IArguments;
          if (!cal.loaded) {
            cal.ns = {};
            cal.q = cal.q || [];
            d.head.appendChild(d.createElement('script')).src = A;
            cal.loaded = true;
          }
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          if ((ar as any)[0] === L) {
            const api = function () {
              // eslint-disable-next-line prefer-rest-params
              p(api, arguments as unknown as IArguments);
            };
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const namespace = (ar as any)[1];
            (api as any).q = (api as any).q || [];
            if (typeof namespace === 'string') {
              cal.ns[namespace] = cal.ns[namespace] || api;
              p(cal.ns[namespace], ar);
              p(cal, ['initNamespace', namespace] as unknown as IArguments);
            } else {
              p(cal, ar);
            }
            return;
          }
          p(cal, ar);
        };
    })(window, 'https://app.cal.com/embed/embed.js', 'init');

    const Cal = window.Cal!;
    Cal('init', 'organico', { origin: 'https://app.cal.com' });
    Cal.ns.organico('inline', {
      elementOrSelector: '#my-cal-inline-organico',
      config: { layout: 'month_view', useSlotsViewOnSmallScreen: 'true' },
      calLink: buildCalLinkWithAttribution('team/clinera.io/organico'),
    });
    Cal.ns.organico('ui', {
      hideEventTypeDetails: true,
      layout: 'month_view',
    });

    // ── dataLayer page_view ───────────────────────────────────────
    window.dataLayer = window.dataLayer || [];
    const PAGE_META = {
      page_path: '/reunion',
      page_name: 'reunion_cal_booking',
      content_name: 'Cal - Reunión Marketing',
      content_category: 'booking',
      currency: 'USD',
    };
    window.dataLayer.push({ event: 'page_view', ...PAGE_META });

    // ── Booking confirmed listener (Pixel Schedule + Lead) ────────
    let bookingFired = false;
    const onMessage = (ev: MessageEvent) => {
      try {
        if (!ev.data) return;
        const data = typeof ev.data === 'string' ? JSON.parse(ev.data) : ev.data;
        if (
          data &&
          (data.type === 'bookingSuccessful' ||
            data.action === 'bookingSuccessful')
        ) {
          if (bookingFired) return;
          bookingFired = true;
          window.dataLayer!.push({
            event: 'booking_confirmed',
            ...PAGE_META,
          });
          if (typeof window.fbq === 'function') {
            window.fbq('track', 'Schedule', {
              content_name: 'Cal - Reunión Marketing',
              content_category: 'booking',
            });
            window.fbq('track', 'Lead', {
              content_name: 'Cal - Reunión Marketing',
              content_category: 'booking',
              currency: 'USD',
              value: 0,
            });
          }
        }
      } catch {
        // ignore
      }
    };
    window.addEventListener('message', onMessage);

    // ── fbclid + gclid + utm capture → cookies + enrich register links
    function getCookie(name: string) {
      const m = document.cookie.match(
        new RegExp(
          '(?:^|;\\s*)' +
            name.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&') +
            '=([^;]*)'
        )
      );
      return m ? m[1] : '';
    }
    function setCookie(name: string, value: string, days: number) {
      const d = new Date();
      d.setTime(d.getTime() + days * 86400000);
      document.cookie = `${name}=${value};expires=${d.toUTCString()};path=/;SameSite=Lax`;
    }
    const qs = new URLSearchParams(window.location.search);
    const fbclid = qs.get('fbclid');
    if (fbclid) {
      if (!getCookie('_fbc'))
        setCookie('_fbc', `fb.1.${Date.now()}.${fbclid}`, 90);
      setCookie('fbclid', fbclid, 90);
    }
    ['gclid', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(
      (k) => {
        const v = qs.get(k);
        if (v) setCookie(k, v, 90);
      }
    );

    const onClick = (ev: MouseEvent) => {
      const target = ev.target as HTMLElement | null;
      const a = target?.closest('a') as HTMLAnchorElement | null;
      if (!a) return;
      if (!a.href.includes('app.clinera.io/auth/register')) return;
      try {
        const u = new URL(a.href, window.location.origin);
        const params: [string, string][] = [
          ['fbclid', getCookie('fbclid') || qs.get('fbclid') || ''],
          ['gclid', getCookie('gclid') || qs.get('gclid') || ''],
          ['utm_source', getCookie('utm_source') || qs.get('utm_source') || ''],
          ['utm_medium', getCookie('utm_medium') || qs.get('utm_medium') || ''],
          ['utm_campaign', getCookie('utm_campaign') || qs.get('utm_campaign') || ''],
          ['utm_term', getCookie('utm_term') || qs.get('utm_term') || ''],
          ['utm_content', getCookie('utm_content') || qs.get('utm_content') || ''],
        ];
        params.forEach(([k, v]) => {
          if (v) u.searchParams.set(k, v);
        });
        const fbc = getCookie('_fbc');
        if (fbc) u.searchParams.set('_fbc', fbc);
        const fbp = getCookie('_fbp');
        if (fbp) u.searchParams.set('_fbp', fbp);
        a.href = u.toString();
      } catch {
        // ignore
      }
    };
    document.addEventListener('click', onClick, { capture: true });

    return () => {
      window.removeEventListener('message', onMessage);
      document.removeEventListener('click', onClick, { capture: true } as AddEventListenerOptions);
    };
  }, []);

  return <div id="my-cal-inline-organico" className={styles.calInline} />;
}
