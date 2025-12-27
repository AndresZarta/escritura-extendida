---
title: jekyll
description: "Generador estático clásico (2008): publicación simple, fricción para JS moderno."
tags: []
pubDate: 2025-12-27
upDate:
image: ""
draft: false
---

Jekyll aparece en 2008, en un momento en que la web personal y técnica estaba dominada por blogs dinámicos con bases de datos y CMS pesados. Desarrollado por Tom Preston-Werner, uno de los fundadores de GitHub, su objetivo original era extremadamente concreto: permitir escribir contenido en Markdown, versionarlo con Git y generar HTML estático sin depender de una base de datos ni de un servidor complejo. Esta filosofía encajó perfectamente con la cultura emergente de GitHub, y terminó cristalizando cuando GitHub Pages lo adoptó como motor por defecto.

Históricamente, Jekyll resolvió muy bien el problema de la publicación simple y reproducible. Sin embargo, su arquitectura se consolidó antes de que el ecosistema moderno de JavaScript existiera como lo conocemos hoy. 

En el momento de evaluarlo como generador de sitios para **escritura::extendida**, Jekyll seguía careciendo de un pipeline integrado para JavaScript moderno: no existía **bundling**, es decir, el proceso que permite agrupar, optimizar y resolver dependencias entre múltiples archivos de JavaScript de forma automática; tampoco **code splitting**, la capacidad de dividir ese código en partes más pequeñas que se cargan solo cuando son necesarias, reduciendo el peso inicial de cada página; ni un modelo de componentes, entendido como una forma estructurada de encapsular marcado, estilos y lógica en unidades reutilizables.
