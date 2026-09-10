import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * /reunion redirige a /agenda en producción, pero ReunionLanding sigue
 * en el repo. El MQL no puede salir al enviar el form (H6).
 */
const src = readFileSync(
  join(process.cwd(), "src/components/reunion/ReunionLanding.tsx"),
  "utf8",
);

function sliceFn(name: string): string {
  const start = src.indexOf(`async function ${name}`);
  expect(start, name).toBeGreaterThan(-1);
  const next = src.indexOf("\nasync function ", start + 1);
  const end = next === -1 ? src.indexOf("\nfunction Step", start + 1) : next;
  return src.slice(start, end === -1 ? undefined : end);
}

test.describe("/reunion — MQL solo al agendar", () => {
  test("submitPartialLead no dispara MQL; sí InitiateCheckout", () => {
    const fn = sliceFn("submitPartialLead");
    expect(fn).toContain('"InitiateCheckout"');
    expect(fn).not.toMatch(/fbq\(\s*"track",\s*"MQL"/);
  });

  test("submitBookingConfirmation dispara MQL 10, no Schedule", () => {
    const fn = sliceFn("submitBookingConfirmation");
    expect(fn).toContain('"MQL"');
    expect(fn).toContain("value: 10");
    expect(fn).not.toMatch(/fbq\(\s*"track",\s*"Schedule"/);
  });
});
