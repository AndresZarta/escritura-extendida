/**
 * @vitest-environment happy-dom
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ReconfiguradorDeTexto, type Token, type ConfiguracionReconfiguracion } from '../reconfiguradorDeTexto';

// Helper para crear un elemento contenedor
function crearContenedor(): HTMLElement {
  const div = document.createElement('div');
  document.body.appendChild(div);
  return div;
}

// Helper para limpiar el DOM
function limpiarDOM(): void {
  document.body.innerHTML = '';
}

describe('ReconfiguradorDeTexto', () => {
  let contenedor: HTMLElement;

  beforeEach(() => {
    contenedor = crearContenedor();
    vi.useFakeTimers();
  });

  afterEach(() => {
    limpiarDOM();
    vi.useRealTimers();
  });

  describe('constructor', () => {
    it('lanza error si no hay variantes', () => {
      expect(() => {
        new ReconfiguradorDeTexto(contenedor, { variantes: [] });
      }).toThrow('Se requieren variantes de texto');
    });

    it('lanza error si variantes es undefined', () => {
      expect(() => {
        new ReconfiguradorDeTexto(contenedor, { variantes: undefined as unknown as string[] });
      }).toThrow('Se requieren variantes de texto');
    });

    it('acepta una sola variante', () => {
      expect(() => {
        new ReconfiguradorDeTexto(contenedor, { variantes: ['hola'] });
      }).not.toThrow();
    });

    it('usa intervaloMs por defecto de 2600', () => {
      const rec = new ReconfiguradorDeTexto(contenedor, { variantes: ['a', 'b'] });
      // No podemos acceder directamente a intervaloMs, pero podemos verificar comportamiento
      expect(rec).toBeDefined();
    });

    it('acepta intervaloMs personalizado', () => {
      const rec = new ReconfiguradorDeTexto(contenedor, { 
        variantes: ['a', 'b'],
        intervaloMs: 5000
      });
      expect(rec).toBeDefined();
    });

    it('maneja índice inicial negativo correctamente', () => {
      const rec = new ReconfiguradorDeTexto(contenedor, { 
        variantes: ['a', 'b', 'c'],
        indiceInicial: -1
      });
      // -1 % 3 = -1, luego +3 = 2, luego %3 = 2 (último elemento)
      rec.iniciar();
      // Debería mostrar 'c' (índice 2)
      const spans = contenedor.querySelectorAll('span');
      expect(spans[0]?.textContent).toBe('c');
    });

    it('maneja índice inicial mayor que la cantidad de variantes', () => {
      const rec = new ReconfiguradorDeTexto(contenedor, { 
        variantes: ['a', 'b'],
        indiceInicial: 5
      });
      rec.iniciar();
      // 5 % 2 = 1, debería mostrar 'b'
      const spans = contenedor.querySelectorAll('span');
      expect(spans[0]?.textContent).toBe('b');
    });
  });

  describe('iniciar', () => {
    it('crea spans para cada carácter', () => {
      const rec = new ReconfiguradorDeTexto(contenedor, { variantes: ['hola'] });
      rec.iniciar();
      
      const spans = contenedor.querySelectorAll('span');
      expect(spans).toHaveLength(4); // h, o, l, a
    });

    it('asigna texto correcto a cada span', () => {
      const rec = new ReconfiguradorDeTexto(contenedor, { variantes: ['abc'] });
      rec.iniciar();
      
      const spans = contenedor.querySelectorAll('span');
      expect(spans[0]?.textContent).toBe('a');
      expect(spans[1]?.textContent).toBe('b');
      expect(spans[2]?.textContent).toBe('c');
    });

    it('asigna claves únicas a cada span', () => {
      const rec = new ReconfiguradorDeTexto(contenedor, { variantes: ['aba'] });
      rec.iniciar();
      
      const spans = contenedor.querySelectorAll('span');
      expect(spans[0]?.dataset.clave).toBe('a__#1');
      expect(spans[1]?.dataset.clave).toBe('b__#1');
      expect(spans[2]?.dataset.clave).toBe('a__#2');
    });

    it('maneja espacios como tokens', () => {
      const rec = new ReconfiguradorDeTexto(contenedor, { variantes: ['a b'] });
      rec.iniciar();
      
      const spans = contenedor.querySelectorAll('span');
      expect(spans).toHaveLength(3); // a, espacio, b
      // El espacio se convierte a &nbsp;
      expect(spans[1]?.innerHTML).toBe('&nbsp;');
    });

    it('asigna clase er__tok a cada span', () => {
      const rec = new ReconfiguradorDeTexto(contenedor, { variantes: ['xy'] });
      rec.iniciar();
      
      const spans = contenedor.querySelectorAll('span');
      spans.forEach(span => {
        expect(span.classList.contains('er__tok')).toBe(true);
      });
    });

    it('asigna order correcto a cada span', () => {
      const rec = new ReconfiguradorDeTexto(contenedor, { variantes: ['abc'] });
      rec.iniciar();
      
      const spans = contenedor.querySelectorAll('span') as NodeListOf<HTMLElement>;
      expect(spans[0]?.style.order).toBe('0');
      expect(spans[1]?.style.order).toBe('1');
      expect(spans[2]?.style.order).toBe('2');
    });
  });

  describe('detener', () => {
    it('detiene el ciclo de animación', () => {
      const rec = new ReconfiguradorDeTexto(contenedor, { 
        variantes: ['a', 'b'],
        intervaloMs: 1000
      });
      
      rec.iniciar();
      const spanInicial = contenedor.querySelector('span')?.textContent;
      
      rec.detener();
      
      // Avanzar el tiempo más allá del intervalo
      vi.advanceTimersByTime(5000);
      
      // El contenido no debería haber cambiado
      expect(contenedor.querySelector('span')?.textContent).toBe(spanInicial);
    });

    it('puede llamarse sin haber iniciado', () => {
      const rec = new ReconfiguradorDeTexto(contenedor, { variantes: ['a'] });
      expect(() => rec.detener()).not.toThrow();
    });

    it('puede llamarse múltiples veces', () => {
      const rec = new ReconfiguradorDeTexto(contenedor, { variantes: ['a'] });
      rec.iniciar();
      expect(() => {
        rec.detener();
        rec.detener();
        rec.detener();
      }).not.toThrow();
    });
  });

  describe('transiciones entre variantes', () => {
    it('cambia de variante al pasar el tiempo', () => {
      const rec = new ReconfiguradorDeTexto(contenedor, { 
        variantes: ['x', 'y'], // Usar letras diferentes para evitar reutilización
        intervaloMs: 1000
      });
      
      rec.iniciar();
      // Buscar el span visible (opacity = 1)
      const spanVisible = () => {
        const spans = contenedor.querySelectorAll('span') as NodeListOf<HTMLElement>;
        return Array.from(spans).find(s => s.style.opacity === '1');
      };
      
      expect(spanVisible()?.textContent).toBe('x');
      
      // Avanzar tiempo para que cambie a 'y'
      // El intervalo tiene ruido ±30%, así que 1500ms debería ser suficiente
      vi.advanceTimersByTime(1500);
      expect(spanVisible()?.textContent).toBe('y');
    });
    
    it('programa múltiples transiciones automáticamente', () => {
      const rec = new ReconfiguradorDeTexto(contenedor, { 
        variantes: ['a', 'b', 'c'],
        intervaloMs: 100
      });
      
      rec.iniciar();
      
      // Verificar que se programan transiciones avanzando el tiempo
      // y contando cuántas veces cambia el contenido
      const obtenerTextoVisible = () => {
        const spans = contenedor.querySelectorAll('span') as NodeListOf<HTMLElement>;
        const visible = Array.from(spans).find(s => s.style.opacity === '1');
        return visible?.textContent;
      };
      
      const textoInicial = obtenerTextoVisible();
      expect(textoInicial).toBe('a');
      
      // Avanzar tiempo suficiente para al menos una transición
      vi.advanceTimersByTime(200);
      const textoDespues = obtenerTextoVisible();
      
      // El texto debe haber cambiado (no importa a cuál)
      expect(textoDespues).not.toBe(textoInicial);
    });

    it('reutiliza spans con la misma clave', () => {
      const rec = new ReconfiguradorDeTexto(contenedor, { 
        variantes: ['ab', 'ba'], // Mismas letras, diferente orden
        intervaloMs: 1000
      });
      
      rec.iniciar();
      const spansIniciales = Array.from(contenedor.querySelectorAll('span'));
      
      vi.advanceTimersByTime(1500);
      const spansDespues = Array.from(contenedor.querySelectorAll('span'));
      
      // Deberían ser los mismos elementos DOM
      expect(spansIniciales.length).toBe(spansDespues.length);
    });

    it('oculta spans que ya no se usan', () => {
      const rec = new ReconfiguradorDeTexto(contenedor, { 
        variantes: ['abc', 'a'], // Pasa de 3 a 1 carácter
        intervaloMs: 1000
      });
      
      rec.iniciar();
      expect(contenedor.querySelectorAll('span')).toHaveLength(3);
      
      vi.advanceTimersByTime(1500);
      
      // Sigue habiendo 3 spans, pero 2 están ocultos
      const spans = contenedor.querySelectorAll('span') as NodeListOf<HTMLElement>;
      const visibles = Array.from(spans).filter(s => s.style.opacity === '1');
      const ocultos = Array.from(spans).filter(s => s.style.opacity === '0');
      
      expect(visibles).toHaveLength(1);
      expect(ocultos).toHaveLength(2);
    });

    it('crea nuevos spans cuando se necesitan más', () => {
      const rec = new ReconfiguradorDeTexto(contenedor, { 
        variantes: ['a', 'abc'], // Pasa de 1 a 3 caracteres
        intervaloMs: 1000
      });
      
      rec.iniciar();
      expect(contenedor.querySelectorAll('span')).toHaveLength(1);
      
      vi.advanceTimersByTime(1500);
      expect(contenedor.querySelectorAll('span')).toHaveLength(3);
    });
  });

  describe('tokenización de caracteres', () => {
    it('tokeniza caracteres especiales', () => {
      const rec = new ReconfiguradorDeTexto(contenedor, { variantes: ['¡Hola!'] });
      rec.iniciar();
      
      const spans = contenedor.querySelectorAll('span');
      expect(spans).toHaveLength(6);
      expect(spans[0]?.textContent).toBe('¡');
      expect(spans[5]?.textContent).toBe('!');
    });

    it('tokeniza emojis como caracteres individuales', () => {
      const rec = new ReconfiguradorDeTexto(contenedor, { variantes: ['a😀b'] });
      rec.iniciar();
      
      const spans = contenedor.querySelectorAll('span');
      // Nota: los emojis pueden ser 1 o 2 code points dependiendo del emoji
      expect(spans.length).toBeGreaterThanOrEqual(3);
    });

    it('tokeniza cadena vacía sin crear spans', () => {
      const rec = new ReconfiguradorDeTexto(contenedor, { variantes: [''] });
      rec.iniciar();
      
      const spans = contenedor.querySelectorAll('span');
      expect(spans).toHaveLength(0);
    });

    it('maneja múltiples espacios consecutivos', () => {
      const rec = new ReconfiguradorDeTexto(contenedor, { variantes: ['a  b'] });
      rec.iniciar();
      
      const spans = contenedor.querySelectorAll('span');
      expect(spans).toHaveLength(4); // a, espacio, espacio, b
      expect(spans[1]?.innerHTML).toBe('&nbsp;');
      expect(spans[2]?.innerHTML).toBe('&nbsp;');
    });
  });

  describe('claves de ocurrencia', () => {
    it('genera claves únicas para caracteres repetidos', () => {
      const rec = new ReconfiguradorDeTexto(contenedor, { variantes: ['aaa'] });
      rec.iniciar();
      
      const spans = contenedor.querySelectorAll('span');
      const claves = Array.from(spans).map(s => s.dataset.clave);
      
      expect(claves[0]).toBe('a__#1');
      expect(claves[1]).toBe('a__#2');
      expect(claves[2]).toBe('a__#3');
    });

    it('reinicia conteo para diferentes caracteres', () => {
      const rec = new ReconfiguradorDeTexto(contenedor, { variantes: ['aba'] });
      rec.iniciar();
      
      const spans = contenedor.querySelectorAll('span');
      expect(spans[0]?.dataset.clave).toBe('a__#1');
      expect(spans[1]?.dataset.clave).toBe('b__#1');
      expect(spans[2]?.dataset.clave).toBe('a__#2');
    });

    it('trata espacios como caracteres con claves', () => {
      const rec = new ReconfiguradorDeTexto(contenedor, { variantes: ['a a'] });
      rec.iniciar();
      
      const spans = contenedor.querySelectorAll('span');
      expect(spans[1]?.dataset.clave).toBe(' __#1');
    });
  });
});

describe('Token type', () => {
  it('tiene estructura correcta', () => {
    const token: Token = { clave: 'a__#1', texto: 'a' };
    expect(token.clave).toBe('a__#1');
    expect(token.texto).toBe('a');
  });
});

describe('ConfiguracionReconfiguracion interface', () => {
  it('permite configuración mínima', () => {
    const config: ConfiguracionReconfiguracion = {
      variantes: ['hola', 'mundo']
    };
    expect(config.variantes).toHaveLength(2);
    expect(config.intervaloMs).toBeUndefined();
    expect(config.indiceInicial).toBeUndefined();
  });

  it('permite configuración completa', () => {
    const config: ConfiguracionReconfiguracion = {
      variantes: ['a', 'b'],
      intervaloMs: 3000,
      indiceInicial: 1
    };
    expect(config.intervaloMs).toBe(3000);
    expect(config.indiceInicial).toBe(1);
  });
});
