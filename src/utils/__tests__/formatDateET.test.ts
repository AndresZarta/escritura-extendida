import { describe, it, expect } from 'vitest';
import formatDateET, { formatCoercedDateAsCalendar, isSameCalendarDay } from '../formatDateET';

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

describe('isSameCalendarDay', () => {
  it('devuelve true para la misma fecha exacta', () => {
    const date1 = new Date(Date.UTC(2025, 10, 10, 0, 0, 0));
    const date2 = new Date(Date.UTC(2025, 10, 10, 0, 0, 0));
    expect(isSameCalendarDay(date1, date2)).toBe(true);
  });

  it('devuelve true para el mismo día con diferentes horas', () => {
    const date1 = new Date(Date.UTC(2025, 10, 10, 0, 0, 0)); // medianoche
    const date2 = new Date(Date.UTC(2025, 10, 10, 23, 59, 59)); // casi medianoche del día siguiente
    expect(isSameCalendarDay(date1, date2)).toBe(true);
  });

  it('devuelve false para días consecutivos', () => {
    const date1 = new Date(Date.UTC(2025, 10, 10, 23, 59, 59));
    const date2 = new Date(Date.UTC(2025, 10, 11, 0, 0, 0));
    expect(isSameCalendarDay(date1, date2)).toBe(false);
  });

  it('devuelve false para meses diferentes', () => {
    const date1 = new Date(Date.UTC(2025, 9, 31)); // octubre
    const date2 = new Date(Date.UTC(2025, 10, 1)); // noviembre
    expect(isSameCalendarDay(date1, date2)).toBe(false);
  });

  it('devuelve false para años diferentes', () => {
    const date1 = new Date(Date.UTC(2024, 11, 31)); // 31 dic 2024
    const date2 = new Date(Date.UTC(2025, 0, 1)); // 1 ene 2025
    expect(isSameCalendarDay(date1, date2)).toBe(false);
  });

  it('ignora la hora al comparar (mismo día calendario, horas distintas)', () => {
    const morning = new Date(Date.UTC(2025, 10, 15, 8, 30, 0));
    const evening = new Date(Date.UTC(2025, 10, 15, 20, 45, 30));
    expect(isSameCalendarDay(morning, evening)).toBe(true);
  });
});

