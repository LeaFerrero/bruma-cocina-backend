const ROLES = Object.freeze({
  ADMIN: "admin",
  COCINA: "cocina",
  CAJA: "caja",
  STOCK: "stock",
});

const VALID_ROLES = Object.values(ROLES);

export { ROLES, VALID_ROLES };
