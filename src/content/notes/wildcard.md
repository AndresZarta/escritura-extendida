---
title: wildcard
description: "Carácter o patrón que representa uno o más elementos en expresiones de búsqueda, coincidencia o filtrado."
tags: [programación, patrones]
pubDate: 2026-02-09
draft: false
---

Un **wildcard** (comodín) es un símbolo que representa uno o varios caracteres o elementos en expresiones de búsqueda, coincidencia de patrones o sistemas de reglas.

En programación, los wildcards permiten crear **reglas flexibles** sin tener que especificar cada caso individual. Los principales tipos son:

## Asterisco (`*`)

Coincide con **cualquier número de caracteres** (cero o más):

- `*.js` encuentra todos los archivos JavaScript (`app.js`, `index.js`, `main.js`)
- `/api/*` coincide con cualquier ruta que empiece con `/api/`
- `about->*` significa "desde about hacia cualquier destino"

## Signo de interrogación (`?`)

Coincide con **exactamente un carácter**:

- `archivo?.txt` encuentra `archivo1.txt`, `archivo2.txt`, pero no `archivo10.txt`
- `test-?.js` coincide con `test-a.js`, `test-1.js`, pero no `test-final.js`

## Corchetes (`[]`)

Coincide con **un carácter de un conjunto específico**:

- `[abc]*.js` encuentra archivos que empiecen con `a`, `b` o `c`
- `file[0-9].txt` coincide con `file0.txt` hasta `file9.txt`
- `[!a]*.js` encuentra archivos que NO empiecen con `a`

Los wildcards reducen la redundancia al permitir que una sola regla cubra múltiples casos, haciendo el código más expresivo y mantenible.

En **escritura::extendida**, usamos wildcards en el [sistema de transiciones](/blog/coreografiar_transiciones_de_vista) para definir comportamientos que aplican a múltiples destinos u orígenes. Por ejemplo, `'about->*': 'slow-fade'` declara que cualquier navegación que salga de la página "about" debe usar una transición de tipo "slow-fade", sin importar el destino específico.

### Referencias

Apunte Impensado. [Qué son las wildcards y para qué sirven](https://apunteimpensado.com/wildcards-que-son-para-que-sirven/)
