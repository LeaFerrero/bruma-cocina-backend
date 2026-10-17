const parseDecimal = (value, decimals) => {
  if (typeof value === "string") {
    value = Number(value.replace(",", "."));
  }
  if (isNaN(value)) return 0;

  return Number(value.toFixed(decimals));
};

export { parseDecimal };
