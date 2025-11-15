// Utilidad para formatear fechas del sitio. Se proporcionan dos helpers:
// - formatDateET: formatea una cadena solo de fecha (YYYY-MM-DD) como la
//   fecha de calendario correspondiente, o bien formatea un Date/instante en
//   la zona horaria del Este (America/New_York).
// - formatCoercedDateAsCalendar: dado un Date producido por z.coerce.date()
//   (es decir, cuando el parser convierte el frontmatter a un Date), lo
//   formatea como la fecha de calendario que el autor pretendía (usa
//   componentes UTC).

export function formatDateET(date: Date | string): string {
  // Si la entrada es una cadena con formato YYYY-MM-DD, trátala como fecha
  // de calendario (sin conversión por huso horario)
  if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    const [y, m, d] = date.split('-').map(Number);
    const utcDate = new Date(Date.UTC(y, m - 1, d));
    return new Intl.DateTimeFormat('es-ES', {
      timeZone: 'UTC',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(utcDate);
  }

  // En caso contrario, tratamos el valor como un instante y lo formateamos en
  // la hora del Este (Eastern Time)
  const dObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('es-ES', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dObj as Date);
}

export default formatDateET;

/**
 * Formatea un `Date` producido por `z.coerce.date()` como la fecha de
 * calendario que escribió el autor. Extrae año/mes/día en UTC y formatea esa
 * fecha, evitando desplazamientos de zona horaria que cambiarían el día.
 */
export function formatCoercedDateAsCalendar(date: Date): string {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  const day = date.getUTCDate();
  const utcDate = new Date(Date.UTC(year, month, day));
  return new Intl.DateTimeFormat('es-ES', {
    timeZone: 'UTC',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(utcDate);
}

/**
 * Comprueba si dos fechas representan el mismo día de calendario.
 */
export function isSameCalendarDay(date1: Date, date2: Date): boolean {
  return (
    date1.getUTCFullYear() === date2.getUTCFullYear() &&
    date1.getUTCMonth() === date2.getUTCMonth() &&
    date1.getUTCDate() === date2.getUTCDate()
  );
}
