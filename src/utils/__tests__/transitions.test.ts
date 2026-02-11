import { describe, it, expect, beforeEach, vi } from 'vitest';
import { inicializarTransiciones } from '../transitions';

// Mock de sessionStorage
const createMockSessionStorage = () => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
};

// Mock de document.documentElement
const createMockDocumentElement = () => {
  const dataset: Record<string, string> = {};
  const attributes: Record<string, string> = {};

  return {
    dataset,
    getAttribute: (name: string) => attributes[name] || null,
    setAttribute: (name: string, value: string) => { attributes[name] = value; },
    _attributes: attributes, // Para facilitar las aserciones
  };
};

describe('Transiciones - Resolución de tipos de transición', () => {
  let mockSessionStorage: ReturnType<typeof createMockSessionStorage>;
  let mockDocumentElement: ReturnType<typeof createMockDocumentElement>;

  beforeEach(() => {
    mockSessionStorage = createMockSessionStorage();
    mockDocumentElement = createMockDocumentElement();

    // Reemplazar globals
    global.sessionStorage = mockSessionStorage as unknown as Storage;
    global.document = { documentElement: mockDocumentElement } as unknown as Document;
    global.window = { addEventListener: vi.fn() } as unknown as Window & typeof globalThis;
  });

  it('aplica zoom-in al navegar de home a post', () => {
    mockDocumentElement.dataset.pageType = 'post';
    mockSessionStorage.setItem('lastPageType', 'home');

    inicializarTransiciones();

    expect(mockDocumentElement._attributes['data-transition']).toBe('zoom-in');
  });

  it('aplica zoom-in al navegar de blog-list a post', () => {
    mockDocumentElement.dataset.pageType = 'post';
    mockSessionStorage.setItem('lastPageType', 'blog-list');

    inicializarTransiciones();

    expect(mockDocumentElement._attributes['data-transition']).toBe('zoom-in');
  });

  it('aplica zoom-out al navegar de post a blog-list', () => {
    mockDocumentElement.dataset.pageType = 'blog-list';
    mockSessionStorage.setItem('lastPageType', 'post');

    inicializarTransiciones();

    expect(mockDocumentElement._attributes['data-transition']).toBe('zoom-out');
  });

  it('aplica zoom-in al navegar de post a note', () => {
    mockDocumentElement.dataset.pageType = 'note';
    mockSessionStorage.setItem('lastPageType', 'post');

    inicializarTransiciones();

    expect(mockDocumentElement._attributes['data-transition']).toBe('zoom-in');
  });

  it('aplica zoom-out al navegar de note a post', () => {
    mockDocumentElement.dataset.pageType = 'post';
    mockSessionStorage.setItem('lastPageType', 'note');

    inicializarTransiciones();

    expect(mockDocumentElement._attributes['data-transition']).toBe('zoom-out');
  });

  it('aplica slow-fade al navegar desde about a cualquier página', () => {
    mockDocumentElement.dataset.pageType = 'post';
    mockSessionStorage.setItem('lastPageType', 'about');

    inicializarTransiciones();

    expect(mockDocumentElement._attributes['data-transition']).toBe('slow-fade');
  });

  it('aplica slow-fade al navegar hacia about desde cualquier página', () => {
    mockDocumentElement.dataset.pageType = 'about';
    mockSessionStorage.setItem('lastPageType', 'post');

    inicializarTransiciones();

    expect(mockDocumentElement._attributes['data-transition']).toBe('slow-fade');
  });

  it('aplica slow-fade al navegar hacia home desde cualquier página', () => {
    mockDocumentElement.dataset.pageType = 'home';
    mockSessionStorage.setItem('lastPageType', 'post');

    inicializarTransiciones();

    expect(mockDocumentElement._attributes['data-transition']).toBe('slow-fade');
  });

  it('aplica fade como transición por defecto para combinaciones no especificadas', () => {
    mockDocumentElement.dataset.pageType = 'unknown';
    mockSessionStorage.setItem('lastPageType', 'other');

    inicializarTransiciones();

    expect(mockDocumentElement._attributes['data-transition']).toBe('fade');
  });
});

describe('Transiciones - Deslizamiento direccional entre posts', () => {
  let mockSessionStorage: ReturnType<typeof createMockSessionStorage>;
  let mockDocumentElement: ReturnType<typeof createMockDocumentElement>;

  beforeEach(() => {
    mockSessionStorage = createMockSessionStorage();
    mockDocumentElement = createMockDocumentElement();

    global.sessionStorage = mockSessionStorage as unknown as Storage;
    global.document = { documentElement: mockDocumentElement } as unknown as Document;
    global.window = { addEventListener: vi.fn() } as unknown as Window & typeof globalThis;
  });

  it('aplica slide-left al navegar a un post más nuevo (índice menor)', () => {
    mockDocumentElement.dataset.pageType = 'post';
    mockDocumentElement.dataset.postIndex = '5';
    mockSessionStorage.setItem('lastPageType', 'post');
    mockSessionStorage.setItem('lastPostIndex', '10');

    inicializarTransiciones();

    expect(mockDocumentElement._attributes['data-transition']).toBe('slide-left');
  });

  it('aplica slide-right al navegar a un post más antiguo (índice mayor)', () => {
    mockDocumentElement.dataset.pageType = 'post';
    mockDocumentElement.dataset.postIndex = '15';
    mockSessionStorage.setItem('lastPageType', 'post');
    mockSessionStorage.setItem('lastPostIndex', '10');

    inicializarTransiciones();

    expect(mockDocumentElement._attributes['data-transition']).toBe('slide-right');
  });

  it('aplica fade al navegar al mismo post (mismo índice)', () => {
    mockDocumentElement.dataset.pageType = 'post';
    mockDocumentElement.dataset.postIndex = '10';
    mockSessionStorage.setItem('lastPageType', 'post');
    mockSessionStorage.setItem('lastPostIndex', '10');

    inicializarTransiciones();

    expect(mockDocumentElement._attributes['data-transition']).toBe('fade');
  });

  it('maneja índices como 0 correctamente', () => {
    mockDocumentElement.dataset.pageType = 'post';
    mockDocumentElement.dataset.postIndex = '0';
    mockSessionStorage.setItem('lastPageType', 'post');
    mockSessionStorage.setItem('lastPostIndex', '5');

    inicializarTransiciones();

    expect(mockDocumentElement._attributes['data-transition']).toBe('slide-left');
  });

  it('aplica slide-right cuando no hay índice de post anterior guardado (usa 0 por defecto)', () => {
    mockDocumentElement.dataset.pageType = 'post';
    mockDocumentElement.dataset.postIndex = '5';
    mockSessionStorage.setItem('lastPageType', 'post');
    // No hay lastPostIndex guardado - parseInt devuelve 0 por defecto

    inicializarTransiciones();

    // Como el índice actual (5) es mayor que el default (0), desliza a la derecha
    expect(mockDocumentElement._attributes['data-transition']).toBe('slide-right');
  });
});

describe('Transiciones - Gestión de estado de navegación', () => {
  let mockSessionStorage: ReturnType<typeof createMockSessionStorage>;
  let mockDocumentElement: ReturnType<typeof createMockDocumentElement>;

  beforeEach(() => {
    mockSessionStorage = createMockSessionStorage();
    mockDocumentElement = createMockDocumentElement();

    global.sessionStorage = mockSessionStorage as unknown as Storage;
    global.document = { documentElement: mockDocumentElement } as unknown as Document;
    global.window = { addEventListener: vi.fn() } as unknown as Window & typeof globalThis;
  });

  it('guarda el tipo de página actual en sessionStorage', () => {
    mockDocumentElement.dataset.pageType = 'post';

    inicializarTransiciones();

    expect(mockSessionStorage.getItem('lastPageType')).toBe('post');
  });

  it('guarda el índice del post cuando está disponible', () => {
    mockDocumentElement.dataset.pageType = 'post';
    mockDocumentElement.dataset.postIndex = '42';

    inicializarTransiciones();

    expect(mockSessionStorage.getItem('lastPostIndex')).toBe('42');
  });

  it('no guarda índice de post si no está disponible', () => {
    mockDocumentElement.dataset.pageType = 'home';
    // No hay postIndex

    inicializarTransiciones();

    expect(mockSessionStorage.getItem('lastPostIndex')).toBeNull();
  });

  it('usa "default" como tipo de página cuando no está definido', () => {
    // dataset.pageType no está definido

    inicializarTransiciones();

    expect(mockSessionStorage.getItem('lastPageType')).toBe('default');
  });

  it('aplica transición por defecto en primera navegación sin historial', () => {
    mockDocumentElement.dataset.pageType = 'post';
    // sessionStorage vacío

    inicializarTransiciones();

    expect(mockDocumentElement._attributes['data-transition']).toBe('fade');
  });
});

describe('Transiciones - Inicialización y eventos del navegador', () => {
  let mockSessionStorage: ReturnType<typeof createMockSessionStorage>;
  let mockDocumentElement: ReturnType<typeof createMockDocumentElement>;
  let addEventListenerSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockSessionStorage = createMockSessionStorage();
    mockDocumentElement = createMockDocumentElement();
    addEventListenerSpy = vi.fn();

    global.sessionStorage = mockSessionStorage as unknown as Storage;
    global.document = { documentElement: mockDocumentElement } as unknown as Document;
    global.window = { addEventListener: addEventListenerSpy } as unknown as Window & typeof globalThis;
  });

  it('registra un listener para el evento pageshow', () => {
    inicializarTransiciones();

    expect(addEventListenerSpy).toHaveBeenCalledWith('pageshow', expect.any(Function));
  });

  it('no ejecuta código si sessionStorage no está disponible (SSR)', () => {
    global.sessionStorage = undefined as unknown as Storage;

    // No debería lanzar error
    expect(() => inicializarTransiciones()).not.toThrow();
  });

  it('recalcula la transición cuando la página se restaura desde BFCache', () => {
    // Primer escenario: estábamos en home
    mockDocumentElement.dataset.pageType = 'home';
    mockSessionStorage.setItem('lastPageType', 'default');

    inicializarTransiciones();

    // Obtener el callback del evento pageshow
    const pageShowCallback = addEventListenerSpy.mock.calls[0][1];

    // Simular navegación: ahora estamos en un post pero el navegador restauró la página desde cache
    mockDocumentElement.dataset.pageType = 'post';
    mockDocumentElement._attributes['data-transition'] = ''; // Limpiar transición

    // Al restaurar desde BFCache, debe recalcular basándose en el estado actual
    pageShowCallback({ persisted: true });

    // La transición debería ser slow-fade (*->home se convirtió en home guardado, y ahora post actual)
    // Pero como lastPageType se actualizó a 'home', y pageType es 'post', debería ser zoom-in
    expect(mockDocumentElement._attributes['data-transition']).toBe('zoom-in');
  });

  it('no recalcula la transición si la página no viene desde BFCache', () => {
    mockDocumentElement.dataset.pageType = 'post';

    inicializarTransiciones();

    const pageShowCallback = addEventListenerSpy.mock.calls[0][1];

    // Cambiar el valor para verificar que no se recalcula
    mockDocumentElement._attributes['data-transition'] = 'test-value';

    // Simular evento pageshow sin BFCache
    pageShowCallback({ persisted: false });

    // No debería haber cambiado
    expect(mockDocumentElement._attributes['data-transition']).toBe('test-value');
  });
});

describe('Transiciones - Casos especiales y prioridad de reglas', () => {
  let mockSessionStorage: ReturnType<typeof createMockSessionStorage>;
  let mockDocumentElement: ReturnType<typeof createMockDocumentElement>;

  beforeEach(() => {
    mockSessionStorage = createMockSessionStorage();
    mockDocumentElement = createMockDocumentElement();

    global.sessionStorage = mockSessionStorage as unknown as Storage;
    global.document = { documentElement: mockDocumentElement } as unknown as Document;
    global.window = { addEventListener: vi.fn() } as unknown as Window & typeof globalThis;
  });

  it('prioriza reglas específicas sobre wildcards', () => {
    // La regla específica 'home->post' debería tener prioridad sobre '*->post'
    mockDocumentElement.dataset.pageType = 'post';
    mockSessionStorage.setItem('lastPageType', 'home');

    inicializarTransiciones();

    expect(mockDocumentElement._attributes['data-transition']).toBe('zoom-in');
  });

  it('usa wildcard "desde" cuando no hay coincidencia exacta', () => {
    // 'about->*' debería aplicarse para about->cualquier-cosa
    mockDocumentElement.dataset.pageType = 'random-page';
    mockSessionStorage.setItem('lastPageType', 'about');

    inicializarTransiciones();

    expect(mockDocumentElement._attributes['data-transition']).toBe('slow-fade');
  });

  it('usa wildcard "hacia" cuando no hay coincidencia exacta ni "desde"', () => {
    // '*->home' debería aplicarse
    mockDocumentElement.dataset.pageType = 'home';
    mockSessionStorage.setItem('lastPageType', 'random-page');

    inicializarTransiciones();

    expect(mockDocumentElement._attributes['data-transition']).toBe('slow-fade');
  });

  it('maneja valores vacíos correctamente', () => {
    mockDocumentElement.dataset.pageType = '';
    mockSessionStorage.setItem('lastPageType', '');

    inicializarTransiciones();

    // Debería usar la transición por defecto
    expect(mockDocumentElement._attributes['data-transition']).toBeTruthy();
  });
});
