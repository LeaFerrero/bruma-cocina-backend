const ORDER_STATUS = Object.freeze({
  PENDIENTE: "pendiente",
  DESPACHADO: "despachado",
  CANCELADO: "cancelado",
});

const VALID_ORDER_STATUS = Object.values(ORDER_STATUS);

export { ORDER_STATUS, VALID_ORDER_STATUS };
