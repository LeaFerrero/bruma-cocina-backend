const PAYMENT_STATUS = Object.freeze({
  PENDIENTE: "pendiente",
  PAGADO: "pagado",
  CANCELADO: "cancelado",
  REEMBOLSADO: "reembolsado",
  FALLIDO: "fallido",
});

const VALID_PAYMENT_STATUS = Object.values(PAYMENT_STATUS);

export { PAYMENT_STATUS, VALID_PAYMENT_STATUS };
