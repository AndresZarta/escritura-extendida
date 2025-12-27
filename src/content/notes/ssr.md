---
title: ssr
description: "Server Side Rendering: renderizado de páginas en el servidor para cada solicitud, entregando HTML ya procesado al navegador."
tags: [web, arquitectura]
pubDate: 2025-12-27
draft: false
---

SSR (Server Side Rendering) es una técnica en la que cada vez que un usuario solicita una página, el servidor genera el HTML correspondiente y lo envía al navegador. Esto mejora el SEO y el tiempo de carga inicial, pero requiere un servidor activo para cada visita.

En los sitios web estáticos, SSR es menos común, ya que la mayoría de las páginas se generan de antemano ([[ssg|SSG]]) y se sirven directamente desde una [[cdn|CDN]]. Sin embargo, SSR puede ser útil en casos donde el contenido cambia frecuentemente o necesita personalización en tiempo real.
