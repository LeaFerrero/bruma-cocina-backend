/**
 * Obtiene la fecha operativa del negocio ("business date") en formato YYYY-MM-DD,
 * asegurando que se respete la zona horaria local de Argentina sin importar
 * en qué región o servidor esté alojada la aplicación (evitando desfasajes por UTC).
 *
 * Nota: Se utiliza el locale 'en-CA' (Canadá) porque formatea nativamente
 * las fechas como Año-Mes-Día (YYYY-MM-DD).
 *
 * @returns {string} La fecha actual en formato "YYYY-MM-DD" (ej: "2026-10-25").
 */
const getBusinessDate = () => {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Argentina/Buenos_Aires",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
};

export { getBusinessDate };
