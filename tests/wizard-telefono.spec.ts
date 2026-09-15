import { expect, test } from "@playwright/test";
import { telefonoValido } from "@/app/api/wizard/validation";

test.describe("API wizard — teléfono de /reserva-tu-hora", () => {
  test("acepta EE.UU. y Puerto Rico en +1; Uruguay en +598", () => {
    expect(telefonoValido("+1", "4155551234")).toBe(true);
    expect(telefonoValido("+1", "7871234567")).toBe(true);
    expect(telefonoValido("+1", "0155551234")).toBe(false);
    expect(telefonoValido("+598", "94123456")).toBe(true);
  });
});
