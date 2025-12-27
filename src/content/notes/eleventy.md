---
title: eleventy
description: "SSG en Node (2017): minimalista y flexible, pero te exige diseñar arquitectura."
tags: []
pubDate: 2025-12-27
upDate:
image: ""
draft: false
---

Eleventy aparece en 2017 como una reacción consciente a los límites de Jekyll, pero sin caer en la complejidad de los frameworks de aplicaciones. Escrito en JavaScript y ejecutado sobre Node.js, su propuesta histórica es minimalista: generar HTML estático sin imponer frameworks, sin runtime en el cliente y sin decisiones innecesarias.

Cuando lo evalué para **escritura::extendida**, encontré que Eleventy era una de las opciones más atractivas desde el punto de vista conceptual. Permitía trabajar en el ecosistema JavaScript, producía HTML limpio y evitaba cargar JavaScript por defecto. Sin embargo, esa flexibilidad es también su principal costo: Eleventy evita tomar decisiones arquitectónicas en nombre del desarrollador.

Esto se vuelve evidente cuando el proyecto requiere interactividad estructurada. Eleventy no define cómo manejar componentes interactivos, cómo organizar un pipeline de JavaScript, ni cómo implementar hidratación parcial. Todo es posible, pero todo debe diseñarse explícitamente. En un proyecto maduro, esta libertad puede ser una ventaja. En una etapa exploratoria, implicaba invertir una cantidad considerable de tiempo en definir convenciones, herramientas y límites antes de validar ideas.

Eleventy no falló en capacidad, sino en economía de decisión. Para un proyecto que todavía estaba descubriendo qué tipo de interactividad necesitaba, la carga cognitiva de diseñar toda la arquitectura interna desde cero resultaba excesiva.
