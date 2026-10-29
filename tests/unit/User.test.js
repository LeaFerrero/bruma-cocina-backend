import { test } from "node:test";
import assert from "node:assert/strict";
import User from "../../src/models/User.js";

test("generateSafePassword no guarda la contraseña en texto plano", () => {
  const { salt, passwordHash } = User.generateSafePassword("Admin1234");

  assert.ok(salt.length > 0);
  assert.notEqual(passwordHash, "Admin1234");
  assert.equal(passwordHash.length, 128); // 64 bytes en hexadecimal
});

test("validatePassword acepta la contraseña correcta", () => {
  const { salt, passwordHash } = User.generateSafePassword("Admin1234");
  const user = new User({ salt, passwordHash });

  assert.equal(user.validatePassword("Admin1234"), true);
});

test("validatePassword rechaza una contraseña incorrecta", () => {
  const { salt, passwordHash } = User.generateSafePassword("Admin1234");
  const user = new User({ salt, passwordHash });

  assert.equal(user.validatePassword("otraClave"), false);
});

test("la misma contraseña genera hashes distintos por el salt aleatorio", () => {
  const first = User.generateSafePassword("Admin1234");
  const second = User.generateSafePassword("Admin1234");

  assert.notEqual(first.salt, second.salt);
  assert.notEqual(first.passwordHash, second.passwordHash);
});
