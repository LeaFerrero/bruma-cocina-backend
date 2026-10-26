const PAYMENT_METHODS = Object.freeze({
  EFECTIVO: "efectivo",
  MERCADO_PAGO: "mercado_pago",
  TRANSFERENCIA: "transferencia",
  TARJETA_DEBITO: "tarjeta_debito",
  TARJETA_CREDITO: "tarjeta_credito",
});

const VALID_PAYMENT_METHODS = Object.values(PAYMENT_METHODS);

export { PAYMENT_METHODS, VALID_PAYMENT_METHODS };
