---
title: astro
description: "Framework de generación de sitios web estáticos enfocado en contenido, con arquitectura de islas de interactividad."
tags: []
pubDate: 2025-12-27
upDate:
image: ""
draft: false
---

Astro aparece en 2021 como respuesta explícita a una tensión acumulada en el ecosistema: demasiados sitios de contenido estaban pagando el costo de frameworks diseñados para aplicaciones. Si bien herramientas como [[nextjs|Next.js]] o [[gatsby|Gatsby]] habían avanzado mucho en la optimización de sitios estáticos, el modelo de aplicación seguía dominando la arquitectura subyacente. Esto implicaba que incluso páginas simples terminaban cargando grandes cantidades de JavaScript innecesario, afectando el rendimiento y la experiencia del usuario.

Astro resolvió el conflicto central del proyecto. Su output por defecto es HTML estático sin JavaScript adicional, lo que devuelve control total sobre el [arbol_del_dom|DOM] final. El contenido en [[markdown|Markdown]] y [[markdown_extendido|MDX]] es tratado como contenido principal, con colecciones, metadatos y transformaciones integradas en el núcleo del framework.

El punto decisivo fue la arquitectura de _islands_. Astro permite incrustar interactividad de forma explícita y acotada, decidiendo cuándo y cómo se hidrata cada componente. Esto habilita texto reactivo, animaciones o sketches sin convertir la página completa en una aplicación. El uso de **Vite** como motor de build aporta un ciclo de desarrollo moderno sin necesidad de pipelines paralelos.

Además, Astro no impone un framework único: **React**, **p5.js** u otras librerías pueden coexistir de manera localizada. Para un proyecto orientado a texto con interactividad puntual, esta combinación —documento como base, JavaScript bajo demanda y tooling moderno— se alineó de forma precisa con el propósito del sitio.
