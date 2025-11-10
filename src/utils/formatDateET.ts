export function formatDateET(date: Date | string) {
  // Ensure we have a Date object
  const d = typeof date === 'string' ? new Date(date) : date;

  // Intl formatter using Eastern Time (America/New_York) and Spanish locale
  const formatter = new Intl.DateTimeFormat('es-ES', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return formatter.format(d);
}

export default formatDateET;
