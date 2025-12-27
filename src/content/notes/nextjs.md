---
title: nextjs
description: "Framework de React (2016): estándar para apps, sobredimensionado para texto."
tags: [web, sitios_web_estaticos]
pubDate: 2025-12-14
upDate:
image: ""
draft: false
---


Next.js nace en 2016 y se consolida rápidamente como el estándar para aplicaciones web modernas basadas en React. Su historia está ligada al problema de combinar [SSR](/notes/ssr), [SSG](/notes/ssg) y experiencia de desarrollo sólida en un solo framework. En ese objetivo, Next ha sido extraordinariamente exitoso.

Cuando evalué Next.js para **escritura::extendida**, la conclusión fue similar a la de [Gatsby](/notes/gatsby) y [SvelteKit](/notes/sveltekit).

Next.js ofrecía una solución robusta y madura, pero orientada claramente a aplicaciones. Incluso utilizando generación estática, el framework asume rutas dinámicas, estado compartido y, en muchos casos, backend integrado. El runtime de React está presente como base, y el modelo de desarrollo empuja a pensar en páginas como vistas de una app.

Para un sitio mayormente textual, este enfoque resultaba sobredimensionado. El costo no era solo en peso de JavaScript, sino en complejidad conceptual y operativa. Next era una herramienta poderosa, pero resolvía un problema distinto al que este proyecto planteaba.
