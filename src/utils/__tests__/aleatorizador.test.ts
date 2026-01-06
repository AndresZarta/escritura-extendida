import { describe, it, expect } from 'vitest';
import {
  aleatorioGaussiano,
  GeneradorDeIntervalosSimplex,
  pasosCaminataAleatoria,
  offsetRuido,
  vibracionHibrida,
  duracionFadeGaussiano,
} from '../aleatorizadores';

describe('aleatorioGaussiano', () => {
  it('genera valores con media aproximada correcta', () => {
    const muestras = Array.from({ length: 1000 }, () => aleatorioGaussiano(100, 10));
    const media = muestras.reduce((a, b) => a + b, 0) / muestras.length;
    
    // La media debe estar cerca de 100 (tolerancia de 2)
    expect(media).toBeGreaterThan(98);
    expect(media).toBeLessThan(102);
  });

  it('genera valores con desviación estándar aproximada correcta', () => {
    const muestras = Array.from({ length: 1000 }, () => aleatorioGaussiano(0, 15));
    const media = muestras.reduce((a, b) => a + b, 0) / muestras.length;
    const varianza = muestras.reduce((acc, val) => acc + (val - media) ** 2, 0) / muestras.length;
    const desviacion = Math.sqrt(varianza);
    
    // La desviación debe estar cerca de 15 (tolerancia de 3)
    expect(desviacion).toBeGreaterThan(12);
    expect(desviacion).toBeLessThan(18);
  });

  it('usa valores por defecto (media=0, desviacion=1)', () => {
    const muestras = Array.from({ length: 500 }, () => aleatorioGaussiano());
    const media = muestras.reduce((a, b) => a + b, 0) / muestras.length;
    
    // Media debe estar cerca de 0
    expect(media).toBeGreaterThan(-0.2);
    expect(media).toBeLessThan(0.2);
  });
});

describe('GeneradorDeIntervalosSimplex', () => {
  it('genera intervalos dentro del rango esperado (±30% del base)', () => {
    const generador = new GeneradorDeIntervalosSimplex(0.02);
    const base = 1000;
    
    const intervalos = Array.from({ length: 100 }, () => generador.siguienteIntervalo(base));
    
    intervalos.forEach(intervalo => {
      // Rango: base * 0.7 a base * 1.3
      expect(intervalo).toBeGreaterThanOrEqual(base * 0.7);
      expect(intervalo).toBeLessThanOrEqual(base * 1.3);
    });
  });

  it('produce variación suave entre intervalos consecutivos', () => {
    const generador = new GeneradorDeIntervalosSimplex(0.01); // velocidad lenta para suavidad
    const base = 1000;
    
    let anterior = generador.siguienteIntervalo(base);
    let cambiosBruscos = 0;
    
    for (let i = 0; i < 50; i++) {
      const actual = generador.siguienteIntervalo(base);
      const diferencia = Math.abs(actual - anterior);
      
      // Con velocidad lenta, las diferencias no deben ser enormes
      if (diferencia > base * 0.3) {
        cambiosBruscos++;
      }
      anterior = actual;
    }
    
    // Muy pocos cambios bruscos esperados
    expect(cambiosBruscos).toBeLessThan(5);
  });

  it('respeta diferentes velocidades de ruido', () => {
    const generadorLento = new GeneradorDeIntervalosSimplex(0.001);
    const generadorRapido = new GeneradorDeIntervalosSimplex(0.1);
    const base = 1000;
    
    // Generar varias muestras
    const lentos = Array.from({ length: 20 }, () => generadorLento.siguienteIntervalo(base));
    const rapidos = Array.from({ length: 20 }, () => generadorRapido.siguienteIntervalo(base));
    
    // Calcular variabilidad (desviación estándar)
    const calcDesviacion = (arr: number[]) => {
      const media = arr.reduce((a, b) => a + b, 0) / arr.length;
      return Math.sqrt(arr.reduce((acc, v) => acc + (v - media) ** 2, 0) / arr.length);
    };
    
    // El generador rápido debería tener más variabilidad
    expect(calcDesviacion(rapidos)).toBeGreaterThan(calcDesviacion(lentos));
  });
});

describe('pasosCaminataAleatoria', () => {
  it('retorna array de misma longitud', () => {
    const orden = [0, 1, 2, 3, 4];
    const resultado = pasosCaminataAleatoria(orden);
    
    expect(resultado).toHaveLength(orden.length);
  });

  it('no modifica el array original', () => {
    const orden = [0, 1, 2, 3, 4];
    const copia = [...orden];
    pasosCaminataAleatoria(orden);
    
    expect(orden).toEqual(copia);
  });

  it('intercambia exactamente un par de elementos adyacentes', () => {
    const orden = [0, 1, 2, 3, 4];
    const resultado = pasosCaminataAleatoria(orden);
    
    // Contar diferencias
    let diferencias = 0;
    for (let i = 0; i < orden.length; i++) {
      if (orden[i] !== resultado[i]) diferencias++;
    }
    
    // Exactamente 2 elementos deben ser diferentes (el par intercambiado)
    expect(diferencias).toBe(2);
  });

  it('mantiene el array igual si tiene menos de 2 elementos', () => {
    expect(pasosCaminataAleatoria([])).toEqual([]);
    expect(pasosCaminataAleatoria([1])).toEqual([1]);
  });

  it('conserva todos los elementos originales', () => {
    const orden = [5, 10, 15, 20, 25];
    const resultado = pasosCaminataAleatoria(orden);
    
    expect(resultado.sort((a, b) => a - b)).toEqual(orden.sort((a, b) => a - b));
  });
});

describe('offsetRuido', () => {
  it('retorna valores dentro de la amplitud especificada', () => {
    const amplitud = 10;
    
    // Probar con diferentes tiempos y semillas
    for (let tiempo = 0; tiempo < 10; tiempo += 0.5) {
      for (let semilla = 0; semilla < 10; semilla++) {
        const offset = offsetRuido(tiempo, semilla, amplitud);
        
        expect(offset).toBeGreaterThanOrEqual(-amplitud);
        expect(offset).toBeLessThanOrEqual(amplitud);
      }
    }
  });

  it('produce valores diferentes para diferentes semillas', () => {
    const tiempo = 1.5;
    const amplitud = 5;
    
    const offsets = new Set<number>();
    for (let semilla = 0; semilla < 10; semilla++) {
      offsets.add(offsetRuido(tiempo, semilla, amplitud));
    }
    
    // Debe haber variación (no todos iguales)
    expect(offsets.size).toBeGreaterThan(5);
  });

  it('usa amplitud por defecto de 4', () => {
    // Sin especificar amplitud
    for (let i = 0; i < 50; i++) {
      const offset = offsetRuido(Math.random() * 10, Math.random() * 100);
      expect(offset).toBeGreaterThanOrEqual(-4);
      expect(offset).toBeLessThanOrEqual(4);
    }
  });

  it('es continuo en el tiempo (cambios suaves)', () => {
    const semilla = 5;
    const amplitud = 10;
    let anterior = offsetRuido(0, semilla, amplitud);
    
    for (let tiempo = 0.01; tiempo < 1; tiempo += 0.01) {
      const actual = offsetRuido(tiempo, semilla, amplitud);
      const diferencia = Math.abs(actual - anterior);
      
      // Cambios suaves entre pasos pequeños de tiempo
      expect(diferencia).toBeLessThan(amplitud * 0.5);
      anterior = actual;
    }
  });
});

describe('vibracionHibrida', () => {
  it('retorna 0 cuando está bajo el umbral de activación', () => {
    // Con umbral muy alto (0.99), casi nunca debería vibrar
    let cerosEncontrados = 0;
    
    for (let i = 0; i < 100; i++) {
      const resultado = vibracionHibrida(
        Math.random() * 10,
        i,
        30,    // frecuencia
        1.4,   // amplitud base
        0.6,   // amplitud orgánica
        0.15,  // velocidad envolvente
        0.99   // umbral muy alto = casi siempre pausado
      );
      if (resultado === 0) cerosEncontrados++;
    }
    
    // La mayoría deberían ser ceros
    expect(cerosEncontrados).toBeGreaterThan(80);
  });

  it('produce valores diferentes para diferentes índices', () => {
    const tiempo = 1.0;
    const valores = new Set<number>();
    
    for (let indice = 0; indice < 20; indice++) {
      valores.add(vibracionHibrida(tiempo, indice));
    }
    
    // Debe haber variación entre elementos
    expect(valores.size).toBeGreaterThan(5);
  });

  it('respeta la amplitud base aproximadamente', () => {
    const amplitudBase = 2.0;
    let maxAbsoluto = 0;
    
    for (let tiempo = 0; tiempo < 5; tiempo += 0.1) {
      for (let indice = 0; indice < 10; indice++) {
        const valor = vibracionHibrida(
          tiempo,
          indice,
          30,
          amplitudBase,
          0.6,
          0.15,
          0.0 // umbral 0 = siempre activo
        );
        maxAbsoluto = Math.max(maxAbsoluto, Math.abs(valor));
      }
    }
    
    // El valor máximo no debe exceder mucho la amplitud base + orgánica + jitter
    expect(maxAbsoluto).toBeLessThan(amplitudBase * 2);
  });
});

describe('duracionFadeGaussiano', () => {
  it('nunca retorna valores menores al mínimo', () => {
    const minimo = 200;
    
    for (let i = 0; i < 100; i++) {
      const duracion = duracionFadeGaussiano(300, 150, minimo);
      expect(duracion).toBeGreaterThanOrEqual(minimo);
    }
  });

  it('genera valores alrededor de la media', () => {
    const media = 500;
    const muestras = Array.from({ length: 500 }, () => duracionFadeGaussiano(media, 100, 100));
    const promedio = muestras.reduce((a, b) => a + b, 0) / muestras.length;
    
    // El promedio debe estar cerca de la media (considerando el truncamiento por mínimo)
    expect(promedio).toBeGreaterThan(media - 50);
    expect(promedio).toBeLessThan(media + 50);
  });

  it('usa valores por defecto correctamente', () => {
    const muestras = Array.from({ length: 100 }, () => duracionFadeGaussiano());
    
    muestras.forEach(d => {
      // Mínimo por defecto es 150
      expect(d).toBeGreaterThanOrEqual(150);
    });
  });
});
