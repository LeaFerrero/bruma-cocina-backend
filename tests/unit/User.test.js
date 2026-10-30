import { describe, it } from "node:test";
import assert from "node:assert/strict";
import User from "../../src/models/User.js";
import { ROLES } from "../../src/constants/roles.js";

describe("Modelo de Usuario y Seguridad de Contraseñas", () => {
  it("generateSafePassword no guarda la contraseña en texto plano y genera el hash correcto", () => {
    const { salt, passwordHash } = User.generateSafePassword("Admin1234");

    assert.ok(salt.length > 0);
    assert.notEqual(passwordHash, "Admin1234");
    assert.equal(passwordHash.length, 128);
  });

  it("validatePassword acepta la contraseña correcta para diferentes perfiles", () => {
    const testCases = [
      { password: "Admin1234", role: ROLES.ADMIN },
      { password: "Cocina1234", role: ROLES.COCINA },
      { password: "Caja1234", role: ROLES.CAJA },
      { password: "ClaveSuperSegura99!", role: ROLES.ADMIN },
    ];

    for (const { password, role } of testCases) {
      const { salt, passwordHash } = User.generateSafePassword(password);
      const user = new User({ salt, passwordHash, role });

      assert.equal(
        user.validatePassword(password),
        true,
        `Debería aceptar la contraseña correcta para el rol ${role}`,
      );
    }
  });

  it("validatePassword rechaza contraseñas incorrectas o modificadas", () => {
    const originalPassword = "Cocina1234";
    const { salt, passwordHash } = User.generateSafePassword(originalPassword);
    const user = new User({ salt, passwordHash });

    const invalidAttempts = [
      "cocina1234", // minúsculas alteradas
      "Cocina1235", // número cambiado
      "Admin1234", // otra clave válida
      "", // vacío
    ];

    for (const invalidPassword of invalidAttempts) {
      assert.equal(
        user.validatePassword(invalidPassword),
        false,
        `Debería rechazar la contraseña inválida: "${invalidPassword}"`,
      );
    }
  });

  it("la misma contraseña genera hashes y salts distintos de forma aleatoria", () => {
    const password = "Caja1234";
    const first = User.generateSafePassword(password);
    const second = User.generateSafePassword(password);

    assert.notEqual(first.salt, second.salt);
    assert.notEqual(first.passwordHash, second.passwordHash);
  });
});
