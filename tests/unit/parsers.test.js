import { test } from "node:test";
import assert from "node:assert/strict";
import { parseDecimal } from "../../src/utils/parsers.js";

test("convierte la coma decimal en punto", () => {
  assert.equal(parseDecimal("1,5", 2), 1.5);
});

test("acepta texto con punto decimal", () => {
  assert.equal(parseDecimal("12.50", 2), 12.5);
});

test("redondea a la cantidad de decimales indicada", () => {
  assert.equal(parseDecimal(2.3456, 2), 2.35);
  assert.equal(parseDecimal("0,1234", 3), 0.123);
});

test("deja pasar un número sin alterarlo", () => {
  assert.equal(parseDecimal(5, 3), 5);
});

test("devuelve 0 cuando el valor no es numérico", () => {
  assert.equal(parseDecimal("abc", 2), 0);
});
