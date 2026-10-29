/**
 * Convierte un valor a número con la cantidad de decimales especificada (soporta comas).
 * Si el valor es inválido o vacío, retorna el original o NaN.
 *
 * @param {string|number} value El valor numérico o texto a procesar.
 * @param {number} decimals La cantidad de posiciones decimales a conservar.
 * @returns {number|string} El número decimal, o el valor original/NaN si falla.
 */
const parseDecimal = (value, decimals) => {
  if (value === "" || value === null || value === undefined) return 0;

  let parsedNumber = value;

  if (typeof value === "string") {
    parsedNumber = Number(value.replace(",", "."));
  }

  if (isNaN(parsedNumber)) return NaN;

  return Number(parsedNumber.toFixed(decimals));
};

/**
 * Convierte un valor a número entero puro.
 * Si el valor es inválido o vacío, retorna el original o NaN.
 *
 * @param {string|number} value El valor numérico o texto a procesar.
 * @returns {number|string} El número entero, o el valor original/NaN si falla.
 */
const parseInteger = (value) => {
  if (value === "" || value === null || value === undefined) return 0;

  const parsedNumber = parseInt(value, 10);

  if (isNaN(parsedNumber)) return NaN;

  return parsedNumber;
};

export { parseDecimal, parseInteger };
