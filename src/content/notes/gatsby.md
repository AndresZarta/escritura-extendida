---
title: gatsby
description: "SSG basado en React (2015): potente, pero con modelo de aplicación y JS global."
tags: []
pubDate: 2025-12-27
upDate:
image: ""
draft: false
---

Gatsby emerge en 2015 basado en React y con una capa de datos centralizada mediante GraphQL, su objetivo histórico fue unificar múltiples fuentes de contenido (CMS, APIs, archivos) bajo una arquitectura de aplicación moderna, pre-renderizada para mejorar el rendimiento.

Cuando evalué Gatsby para **escritura::extendida**, encontré que resolvía sin problemas la integración con el ecosistema moderno de frontend. El problema no era técnico, sino estructural. Gatsby trata cada página como una aplicación React que luego se hidrata en el cliente. Incluso el contenido puramente textual termina envuelto en el modelo de una [[spa|SPA]].

Esto introducía dos costos claros. El primero: una cantidad significativa de JavaScript para páginas que no lo necesitaban. El segundo, más profundo: un cambio en el modelo mental. El texto deja de ser un documento y pasa a ser una vista dentro de una aplicación. La capa adicional de GraphQL y plugins, útil en proyectos complejos, añadía complejidad operativa innecesaria para un sitio cuyo núcleo era la escritura y la experimentación localizada.

Gatsby podía hacer todo lo necesario, pero lo hacía desde un paradigma que invertía las prioridades del proyecto.
