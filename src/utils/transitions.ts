// Configuración de enrutamiento de transiciones
type TransitionType = 'zoom-in' | 'zoom-out' | 'fade' | 'slow-fade' | 'slide-left' | 'slide-right';
type TransitionRule = TransitionType | (() => TransitionType);

const TRANSITION_RULES: Record<string, TransitionRule> = {
  'home->post': 'zoom-in',
  'blog-list->post': 'zoom-in',
  'post->post': getDirectionalSlide,
  'post->blog-list': 'zoom-out',
  'post->note': 'zoom-out',
  'about->*': 'slow-fade',
  '*->about': 'slow-fade',
  '*->home': 'slow-fade',
  'default': 'fade'
};

function getDirectionalSlide(): TransitionType {
  const lastPostIndex = parseInt(sessionStorage.getItem('lastPostIndex') || '0', 10);
  const currentPostIndex = parseInt(document.documentElement.dataset.postIndex || '0', 10);
  
  // Si es el mismo post, solo hacer fade
  if (currentPostIndex === lastPostIndex) {
    return 'fade';
  }
  
  // Índice más bajo = post más nuevo (ordenados descendente), avanzar en el tiempo desliza a la izquierda
  return currentPostIndex < lastPostIndex ? 'slide-left' : 'slide-right';
}

function getTransitionType(from: string, to: string): TransitionType {
  // Verificar en orden de prioridad: coincidencia exacta -> wildcard desde -> wildcard hacia -> default
  const keys = [
    `${from}->${to}`,
    `${from}->*`,
    `*->${to}`,
    'default'
  ];
  
  for (const key of keys) {
    if (key in TRANSITION_RULES) {
      const rule = TRANSITION_RULES[key];
      // Si la regla es una función, llamarla; de lo contrario, usarla directamente
      return typeof rule === 'function' ? rule() : rule;
    }
  }
  
  return 'fade';
}

function applyTransition(): void {
  const currentPageType = document.documentElement.dataset.pageType || 'default';
  const lastPageType = sessionStorage.getItem('lastPageType') || 'default';
  
  const transitionType = getTransitionType(lastPageType, currentPageType);
  document.documentElement.setAttribute('data-transition', transitionType);
  
  // Guardar tipo de página actual e índice de post para la próxima navegación
  sessionStorage.setItem('lastPageType', currentPageType);
  
  const postIndex = document.documentElement.dataset.postIndex;
  if (postIndex) {
    sessionStorage.setItem('lastPostIndex', postIndex);
  }
}

// Inicializar transición al cargar la página
export function initTransitions(): void {
  // Verificación para SSR - sessionStorage solo existe en el navegador
  if (typeof sessionStorage !== 'undefined') {
    applyTransition();
    
    // Escuchar eventos de navegación del navegador (botones adelante/atrás)
    window.addEventListener('pageshow', (event) => {
      // Si la página se restaura desde BFCache, recalcular la transición
      if (event.persisted) {
        applyTransition();
      }
    });
  }
}
