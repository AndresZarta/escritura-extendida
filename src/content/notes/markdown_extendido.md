---
title: "markdown_extendido"
description: "Descripción y características de MDX, la extensión de Markdown para componentes interactivos."
tags: []
pubDate: 2025-12-27
upDate:
image: ""
draft: false
---

MDX es una extensión de [[markdown|Markdown]] que permite insertar componentes interactivos y JSX (usualmente de React, pero también de otros frameworks) directamente dentro del flujo del texto. Esto habilita la combinación de contenido escrito en Markdown con elementos dinámicos y reutilizables.

## Características principales
- Permite toda la sintaxis de Markdown estándar.
- Permite importar e insertar componentes dentro del texto.
- Ideal para sitios donde el contenido requiere interactividad o visualizaciones personalizadas.
- Muy usado en blogs técnicos, documentación interactiva y sitios generados con frameworks modernos como Astro, Next.js, etc.

```html
---
title: "Ejemplo MDX"
---

Este es un texto en MDX.

<MiComponente mensaje="¡Hola, soy un componente!" />
```

MDX es útil cuando se necesita enriquecer el contenido con funcionalidades que van más allá del texto estático.