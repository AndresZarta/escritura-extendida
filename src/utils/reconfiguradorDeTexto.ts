import { offsetRuido, duracionFadeGaussiano, GeneradorDeIntervalosSimplex } from './aleatorizadores';

/**
 * Reconfigura texto con animación FLIP
 */

export type Token = { clave: string; texto: string };

export interface ConfiguracionReconfiguracion {
  variantes: string[];
  intervaloMs?: number;
  indiceInicial?: number;
}

/**
 * Reconfigura texto con animación FLIP
 * Instancia que mantiene estado y controla el ciclo de animación
 */
export class ReconfiguradorDeTexto {
  private variantes: string[]; // Variantes de texto
  private tokensVariantes: Token[][]; // Variantes tokenizadas y con claves únicas
  private flujo: HTMLElement; // Elemento que contiene los spans de texto
  private intervaloMs: number; // Intervalo entre transiciones
  private indice: number; // Índice actual de variante
  private timeoutId: number | undefined; // Identificador del timeout programado
  private generadorIntervalos: GeneradorDeIntervalosSimplex; // Generador de intervalos con ruido orgánico
  private animaciones = new WeakMap<HTMLElement, Animation>();

  constructor(flujo: HTMLElement, config: ConfiguracionReconfiguracion) {
    this.flujo = flujo;
    this.variantes = config.variantes;
    if (!this.variantes || this.variantes.length < 1) {
      throw new Error('Se requieren variantes de texto para inicializar ReconfiguradorDeTexto');
    }
    this.intervaloMs = config.intervaloMs ?? 2600;
    this.generadorIntervalos = new GeneradorDeIntervalosSimplex(0.02);
    
    // Preprocesar todas las variantes a tokens
    this.tokensVariantes = this.variantes.map((v) => 
      this.conClavesDeOcurrencia(this.tokenizar(v))
    );
    
    // Calcular índice inicial seguro
    const indiceInicial = config.indiceInicial ?? 0;
    this.indice = ((indiceInicial % this.tokensVariantes.length) + this.tokensVariantes.length) % this.tokensVariantes.length;
  }

  /**
   * Inicia el ciclo de animación
   */
  iniciar(): void {
    this.aplicarVariante(this.indice);
    this.programarSiguiente();
  }

  /**
   * Detiene el ciclo de animación
   */
  detener(): void {
    if (this.timeoutId) {
      window.clearTimeout(this.timeoutId);
      this.timeoutId = undefined;
    }
  }

  /**
   * Programa la siguiente transición
   */
  private programarSiguiente(): void {
    const intervalo = this.generadorIntervalos.siguienteIntervalo(this.intervaloMs);
    this.timeoutId = window.setTimeout(() => this.tick(), intervalo);
  }

  /**
   * Ejecuta un tick del ciclo
   */
  private tick(): void {
    this.indice = (this.indice + 1) % this.tokensVariantes.length;
    this.aplicarVariante(this.indice);
    this.programarSiguiente();
  }

  /**
   * Aplica una variante específica con animación FLIP
   * Las letras nuevas aparecen en la posición de las que desaparecen
   */
  private aplicarVariante(indice: number): void {
    const objetivo = this.tokensVariantes[indice];
    const spans = this.asegurarSpans(objetivo);
    const posicionesAntes = this.capturarPosiciones(spans);
    
    // Actualizar spans y obtener info de reemplazo
    const { spansNuevos, posicionesDesaparecidas } = this.actualizarSpans(spans, objetivo);
    
    this.animarFLIP(spans, posicionesAntes, spansNuevos, posicionesDesaparecidas, Date.now() / 1000);
  }

  /**
   * Tokeniza una cadena de texto en caracteres individuales
   * Los espacios se mantienen como tokens separados
   */
  private tokenizar(s: string): string[] {
    return s.split('');
  }

  /**
   * Añade claves únicas a tokens basadas en su ocurrencia
   */
  private conClavesDeOcurrencia(tokens: string[]): Token[] {
    const conteos = new Map<string, number>();
    return tokens.map((t) => {
      const n = (conteos.get(t) ?? 0) + 1;
      conteos.set(t, n);
      return { clave: `${t}__#${n}`, texto: t };
    });
  }

  /**
   * Asegura que haya suficientes spans para mostrar todos los tokens
   */
  private asegurarSpans(objetivo: Token[]): HTMLElement[] {
    const existentes = Array.from(this.flujo.children) as HTMLElement[];
    const necesarios = objetivo.length;

    while (existentes.length < necesarios) {
      const span = document.createElement('span');
      span.className = 'er__tok';
      this.flujo.appendChild(span);
      existentes.push(span);
    }

    return existentes;
  }

  /**
   * Captura las posiciones actuales de los elementos
   */
  private capturarPosiciones(elementos: HTMLElement[]): Map<HTMLElement, DOMRect> {
    const posiciones = new Map<HTMLElement, DOMRect>();
    elementos.forEach((el) => {
      posiciones.set(el, el.getBoundingClientRect());
    });
    return posiciones;
  }

  /**
   * Actualiza el contenido y orden de los spans
   * Retorna información sobre spans nuevos y posiciones de los que desaparecen
   */
  private actualizarSpans(spans: HTMLElement[], objetivo: Token[]): {
    spansNuevos: Set<HTMLElement>;
    posicionesDesaparecidas: DOMRect[];
  } {
    // Mapa de clave a array de spans que la tienen
    const mapClave = new Map<string, HTMLElement[]>();
    spans.forEach((el) => {
      const clave = el.dataset.clave;
      if (!clave) return;
      if (!mapClave.has(clave)) {
        mapClave.set(clave, []);
      }
      mapClave.get(clave)!.push(el);
    });

    const usados = new Set<HTMLElement>();
    const spansNuevos = new Set<HTMLElement>();
    const noAsignados: HTMLElement[] = spans.filter(el => !el.dataset.clave);

    const duracionFade = duracionFadeGaussiano(300, 150, 150);

    // Asignar tokens a spans
    objetivo.forEach((tok, i) => {
      let span: HTMLElement | undefined;
      let esNuevo = false;
      
      const disponibles = mapClave.get(tok.clave);
      if (disponibles && disponibles.length > 0) {
        span = disponibles.shift();
      } else if (noAsignados.length > 0) {
        span = noAsignados.shift();
        esNuevo = true;
      } else {
        span = document.createElement('span');
        span.className = 'er__tok';
        this.flujo.appendChild(span);
        esNuevo = true;
      }

      if (!span) return;

      usados.add(span);
      if (esNuevo) {
        spansNuevos.add(span);
      }
      
      // Usar &nbsp; para espacios para que sean visibles en inline-block
      if (tok.texto === ' ') {
        span.innerHTML = '&nbsp;';
      } else {
        span.textContent = tok.texto;
      }
      span.dataset.clave = tok.clave;
      span.style.order = String(i);
      span.style.opacity = '1';
      span.style.transition = `opacity ${duracionFade}ms ease-in-out`;
    });

    // Capturar posiciones de spans que van a desaparecer ANTES de ocultarlos
    const posicionesDesaparecidas: DOMRect[] = [];
    spans.forEach((el) => {
      if (!usados.has(el) && el.dataset.clave) {
        posicionesDesaparecidas.push(el.getBoundingClientRect());
      }
    });

    // Los spans no usados se ocultan
    spans.forEach((el, i) => {
      if (!usados.has(el)) {
        el.style.opacity = '0';
        el.style.order = String(9999 + i);
        el.textContent = '';
        delete el.dataset.clave;
        el.style.transition = `opacity ${duracionFade}ms ease-in-out`;
      }
    });

    // Forzar reflow
    void this.flujo.offsetHeight;
    
    return { spansNuevos, posicionesDesaparecidas };
  }

  /**
   * Anima los elementos usando la técnica FLIP con ruido orgánico
   * Los spans nuevos aparecen en la posición de las letras que desaparecen
   */
  private animarFLIP(
    spans: HTMLElement[],
    posicionesAntes: Map<HTMLElement, DOMRect>,
    spansNuevos: Set<HTMLElement>,
    posicionesDesaparecidas: DOMRect[],
    tiempoAnimacion: number
  ): void {
    // Índice para asignar posiciones de desaparecidos a nuevos
    let indiceDesaparecido = 0;
    
    spans.forEach((el, i) => {
      const despues = el.getBoundingClientRect();
      const antes = posicionesAntes.get(el);
      
      let dx: number;
      let dy: number;
      
      if (spansNuevos.has(el)) {
        // Span nuevo: aparece en la posición de una letra que desaparece
        if (posicionesDesaparecidas.length > 0) {
          const posOrigen = posicionesDesaparecidas[indiceDesaparecido % posicionesDesaparecidas.length];
          indiceDesaparecido++;
          dx = posOrigen.left - despues.left;
          dy = posOrigen.top - despues.top;
        } else {
          // No hay letras desapareciendo, fade-in sin movimiento
          return;
        }
      } else if (antes) {
        // Span existente: se mueve desde su posición anterior
        dx = antes.left - despues.left;
        dy = antes.top - despues.top;
      } else {
        return;
      }

      // Si casi no se movió, no animar
      if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) return;

      const ruidoX = offsetRuido(tiempoAnimacion, i, 3);
      const ruidoY = offsetRuido(tiempoAnimacion, i + 100, 3);

      const animacionExistente = this.animaciones.get(el);
      if (animacionExistente) {
        animacionExistente.cancel();
      }

      const animacion = el.animate(
        [
          { transform: `translate(${dx}px, ${dy}px)` },
          { transform: `translate(${ruidoX}px, ${ruidoY}px)`, offset: 0.5 },
          { transform: 'translate(0, 0)' },
        ],
        {
          duration: 3500,
          easing: 'cubic-bezier(0.2, 0.9, 0.2, 1)',
        }
      );

      this.animaciones.set(el, animacion);
    });
  }
}
