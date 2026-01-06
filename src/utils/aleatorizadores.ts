import { createNoise2D } from 'simplex-noise';

/**
 * Utilidades para generar variaciones aleatorias orgánicas en intervalos de tiempo
 * Inspiradas en Nature of Code.
 * Usa Simplex noise para continuidad suave en animaciones procedurales.
 */

/**
 * Fuente de ruido continuo 2D.
 *
 * Nota: usamos Simplex noise porque ofrece continuidad y buena calidad visual
 * para animación procedural. La API devuelve valores aproximadamente en [-1, 1].
 */
const noise2D = createNoise2D(Math.random);

/**
 * Ruido 2D continuo en el rango aproximado [-1, 1].
 * @param x - Coordenada x  
 * @param y - Coordenada y
 * @returns Valor de ruido en el punto (x,y)
 */
function ruidoContinuo2D(x: number, y: number): number {
  return noise2D(x, y);
}

/**
 * Genera un valor aleatorio siguiendo una distribución gaussiana (normal)
 * Usa el método Box-Muller
 * @param media - Media de la distribución
 * @param desviacion - Desviación estándar
 * @returns Valor aleatorio gaussiano
 */
export function aleatorioGaussiano(media: number = 0, desviacion: number = 1): number {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return media + desviacion * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

/**
 * Generador de intervalos basado en ruido Simplex
 * Produce variación suave y orgánica en el tiempo
 */
export class GeneradorDeIntervalosSimplex {
  private tiempoRuido: number = 0;
  private velocidadRuido: number;
  
  constructor(velocidadRuido: number = 0.02) {
    this.velocidadRuido = velocidadRuido;
  }
  
  /**
   * Genera el siguiente intervalo usando ruido Simplex
   * @param base - Intervalo base en milisegundos
   * @returns Intervalo modulado por ruido Simplex
   */
  siguienteIntervalo(base: number): number {
    const ruido = ruidoContinuo2D(this.tiempoRuido, 0);
    this.tiempoRuido += this.velocidadRuido;
    
    // Normalizar ruido de [-1,1] a [0,1] y escalar ±30%
    const normalizado = (ruido + 1) / 2;
    return base * (0.7 + normalizado * 0.6);
  }
}

/**
 * Caminata aleatoria: intercambia elementos adyacentes
 * @param orden - Array de índices actual
 * @returns Nuevo array con un intercambio aleatorio
 */
export function pasosCaminataAleatoria(orden: number[]): number[] {
  const siguiente = [...orden];
  if (siguiente.length < 2) return siguiente;
  
  const i = Math.floor(Math.random() * (siguiente.length - 1));
  [siguiente[i], siguiente[i + 1]] = [siguiente[i + 1], siguiente[i]];
  
  return siguiente;
}

/**
 * Genera offset de ruido para animaciones suaves
 * @param tiempo - Tiempo actual
 * @param semilla - Semilla para variación entre elementos
 * @param amplitud - Amplitud del desplazamiento en píxeles
 * @returns Offset en píxeles
 */
export function offsetRuido(tiempo: number, semilla: number, amplitud: number = 4): number {
  return ruidoContinuo2D(semilla, tiempo * 0.05) * amplitud;
}

/**
 * Vibración híbrida con pausas orgánicas: señal portadora modulada por envolvente Simplex
 * Las pausas y vibraciones varían orgánicamente usando ruido Simplex como envolvente
 * @param tiempo - Tiempo actual en segundos (timestamp real)
 * @param indice - Índice del elemento (para desfase estable)
 * @param frecuenciaHz - Frecuencia de vibración en Hz (alta = vibración perceptible)
 * @param amplitudBase - Amplitud base en píxeles
 * @param amplitudOrganica - Factor de respiración orgánica (0-1)
 * @param velocidadEnvolvente - Velocidad de la envolvente on/off (menor = cambios más lentos)
 * @param umbralActivacion - Umbral de ruido para activar (0-1). Más alto = más pausas
 * @returns Offset de vibración en píxeles
 */
export function vibracionHibrida(
  tiempo: number,
  indice: number,
  frecuenciaHz: number = 30,        // elasticidad: 30Hz ≈ 30 vibraciones por segundo
  amplitudBase: number = 1.4,       // desplazamiento base en píxeles
  amplitudOrganica: number = 0.6,   // variación de amplitud por ruido (0-1)
  velocidadEnvolvente: number = 0.15, // Hz de muestreo de envolvente (lento = transiciones suaves)
  umbralActivacion: number = 0.4    // umbral Perlin normalizado: 0.4 ≈ 60% tiempo activo
): number {
  // Envolvente orgánica: determina si vibra o pausa
  // Usa ruido Simplex lento para transiciones suaves
  const ruidoEnvolvente = ruidoContinuo2D(
    indice * 7.3, // seed espacial por elemento
    tiempo * velocidadEnvolvente // evolución temporal lenta
  );
  const envolventeNormalizada = (ruidoEnvolvente + 1) / 2; // 0..1
  
  // Si la envolvente está bajo el umbral, pausa
  if (envolventeNormalizada < umbralActivacion) {
    return 0;
  }
  
  // Fade suave al entrar/salir de vibración (evita cortes bruscos)
  const distanciaDelUmbral = envolventeNormalizada - umbralActivacion;
  const margenFade = 0.15;
  const factorFade = Math.min(1, distanciaDelUmbral / margenFade);
  
  // Portador: vibración rápida
  const fase = indice * 1.37; // desfase estable entre elementos
  const seno = Math.sin(2 * Math.PI * frecuenciaHz * tiempo + fase);

  // Modulador: respiración orgánica de amplitud (lenta)
  const ruidoAmplitud = ruidoContinuo2D(indice * 10, tiempo * 0.4);
  const ruidoAmplitudNormalizado = (ruidoAmplitud + 1) / 2;

  const amplitudFinal =
    amplitudBase * (0.7 + amplitudOrganica * ruidoAmplitudNormalizado);

  // Micro-jitter controlado para romper suavidad perfecta
  const jitter = (Math.random() * 2 - 1) * 0.15;
  
  return (seno * amplitudFinal + jitter) * factorFade;
}

/**
 * Genera duración de fade basada en distribución gaussiana
 * @param media - Duración media en milisegundos
 * @param desviacion - Desviación estándar en milisegundos
 * @param minimo - Duración mínima permitida
 * @returns Duración en milisegundos
 */
export function duracionFadeGaussiano(
  media: number = 300,
  desviacion: number = 150,
  minimo: number = 150
): number {
  return Math.max(minimo, media + aleatorioGaussiano() * desviacion);
}
