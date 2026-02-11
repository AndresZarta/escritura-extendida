// Configuración de enrutamiento de transiciones
type TipoDeTransicion = 'zoom-in' | 'zoom-out' | 'fade' | 'slow-fade' | 'slide-left' | 'slide-right';
type ReglaDeTransicion = TipoDeTransicion | (() => TipoDeTransicion);

const REGLAS_DE_TRANSICION: Record<string, ReglaDeTransicion> = {
  'home->post': 'zoom-in',
  'blog-list->post': 'zoom-in',
  'post->post': obtenerDeslizamientoDireccional,
  'post->blog-list': 'zoom-out',
  'post->note': 'zoom-in',
  'note->post': 'zoom-out',
  'about->*': 'slow-fade',
  '*->about': 'slow-fade',
  '*->home': 'slow-fade',
  'default': 'fade'
};

function obtenerDeslizamientoDireccional(): TipoDeTransicion {
  const ultimoIndicePost = parseInt(sessionStorage.getItem('lastPostIndex') || '0', 10);
  const indicePostActual = parseInt(document.documentElement.dataset.postIndex || '0', 10);

  // Si es el mismo post, solo hacer fade
  if (indicePostActual === ultimoIndicePost) {
    return 'fade';
  }

  // Índice más bajo = post más nuevo (ordenados descendente), avanzar en el tiempo desliza a la izquierda
  return indicePostActual < ultimoIndicePost ? 'slide-left' : 'slide-right';
}

function obtenerTipoDeTransicion(from: string, to: string): TipoDeTransicion {
  // Verificar en orden de prioridad: coincidencia exacta -> wildcard desde -> wildcard hacia -> default
  const claves = [
    `${from}->${to}`,
    `${from}->*`,
    `*->${to}`,
    'default'
  ];

  for (const clave of claves) {
    if (clave in REGLAS_DE_TRANSICION) {
      const regla = REGLAS_DE_TRANSICION[clave];
      // Si la regla es una función, llamarla; de lo contrario, usarla directamente
      return typeof regla === 'function' ? regla() : regla;
    }
  }

  return 'fade';
}

function aplicarTransicion(): void {
  const tipoPaginaActual = document.documentElement.dataset.pageType || 'default';
  const tipoPaginaAnterior = sessionStorage.getItem('lastPageType') || 'default';

  const tipoTransicion = obtenerTipoDeTransicion(tipoPaginaAnterior, tipoPaginaActual);
  document.documentElement.setAttribute('data-transition', tipoTransicion);
}

function guardarEstadoNavegacion(): void {
  const tipoPaginaActual = document.documentElement.dataset.pageType || 'default';
  sessionStorage.setItem('lastPageType', tipoPaginaActual);

  const indicePost = document.documentElement.dataset.postIndex;
  if (indicePost) {
    sessionStorage.setItem('lastPostIndex', indicePost);
  }
}

// Inicializar transición al cargar la página
export function inicializarTransiciones(): void {
  // Verificación para SSR - sessionStorage solo existe en el navegador
  if (typeof sessionStorage !== 'undefined') {
    aplicarTransicion();
    guardarEstadoNavegacion();

    // Escuchar eventos de navegación del navegador (botones adelante/atrás)
    window.addEventListener('pageshow', (event) => {
      // Si la página se restaura desde BFCache, recalcular la transición
      if (event.persisted) {
        aplicarTransicion();
      }
    });
  }
}
