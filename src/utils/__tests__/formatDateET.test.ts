import { describe, it, expect } from 'vitest';
import formatDateET, { formatCoercedDateAsCalendar } from '../formatDateET';

describe('formatDateET', () => {
  it('formatea una cadena solo de fecha (YYYY-MM-DD) como la misma fecha del calendario', () => {
    // Las fechas sin hora deben tratarse como fecha de calendario y no desplazarse por la zona
    expect(formatDateET('2025-11-10')).toBe('10 de noviembre de 2025');
  });

  it('formatea un instante ISO en UTC que cae a medianoche UTC y muestra el día anterior en ET', () => {
    // 2025-11-10T00:00:00Z es medianoche UTC -> en America/New_York (UTC-5) es el día anterior
    expect(formatDateET('2025-11-10T00:00:00Z')).toBe('9 de noviembre de 2025');
  });

  it('trata Date como instante: medianoche UTC cae al día anterior en ET; helper muestra la fecha de calendario', () => {
    const d = new Date(Date.UTC(2025, 10, 10)); // Medianoche UTC del 10 de nov de 2025
    // Como instante en ET esto es la noche anterior (UTC-5), por lo que formatDateET
    // debe mostrar el día anterior.
    expect(formatDateET(d)).toBe('9 de noviembre de 2025');

    // Si queremos formatear el Date coerced por Zod como la fecha de calendario que
    // escribió el autor, usamos formatCoercedDateAsCalendar.
    expect(formatCoercedDateAsCalendar(d)).toBe('10 de noviembre de 2025');
  });

  it('formatea un instante ISO a mediodía sin desplazar la fecha', () => {
    // Mediodía UTC debe mantener la misma fecha en ET
    expect(formatDateET('2025-11-10T12:00:00Z')).toBe('10 de noviembre de 2025');
  });
});
