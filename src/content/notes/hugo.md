---
title: hugo
description: "Generador estático en Go (2013): rapidez y estabilidad, interactividad como capa externa."
tags: [web, sitios_web_estaticos]
pubDate: 2025-12-27
upDate:
image: ""
draft: false
---

Hugo surge en 2013 como respuesta directa a una crítica recurrente a Jekyll: la lentitud de los builds y la fricción operativa. Escrito en [Go](https://go.dev) y concebido desde el inicio como una herramienta extremadamente rápida, Hugo se posicionó rápidamente en proyectos de documentación, blogs de gran escala y sitios con miles de páginas. Su promesa histórica fue clara: velocidad, previsibilidad y estabilidad.

En mi caso, nunca llegué a utilizar Hugo en un proyecto real, pero sí investigué a fondo su propuesta y evalué su arquitectura como opción para **escritura::extendida**. Los tiempos de build reportados por la comunidad son casi instantáneos y el HTML generado es limpio y predecible. Sin embargo, esa eficiencia está íntimamente ligada a su modelo mental: Hugo asume que el HTML generado es un artefacto terminado. La interactividad no forma parte del núcleo conceptual del sistema, sino que se concibe como una capa externa que el desarrollador añade manualmente.

Al analizar cómo se podría integrar JavaScript moderno, encontré que, aunque Hugo Pipes permite cierto procesamiento de assets y es posible montar pipelines con herramientas externas, estas soluciones no forman parte del flujo principal ni están pensadas para componer interactividad como una extensión natural del contenido.

Además, el uso de plantillas en Go desplaza la lógica de transformación del contenido a un lenguaje ajeno al ecosistema JavaScript, dificultando reutilizar librerías y patrones front-end ya conocidos.

Hugo sigue siendo una herramienta excelente para publicar contenido estable. Pero cuando el objetivo pasa de “mostrar texto” a “manipular texto”, su arquitectura puede sentirse restrictiva, no por fallas técnicas, sino por un desalineamiento conceptual.
