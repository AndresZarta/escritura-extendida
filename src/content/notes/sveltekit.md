---
title: sveltekit
description: "Framework (2022): excelente DX, pero paradigma de app y framework único."
tags: [web, sitios_web_estaticos]
pubDate: 2025-12-27
upDate:
image: ""
draft: false
---

SvelteKit alcanza estabilidad en 2022, en un contexto donde los frameworks de aplicaciones ya estaban bien establecidos. Su objetivo histórico es similar al de [[nextjs|Next.js]], pero con un runtime más liviano y una experiencia de desarrollo más directa.

En el momento de evaluar SvelteKit para **escritura::extendida**, encontré que el ofrecía rendimiento excelente y una **UX** muy cuidada. Sin embargo, su arquitectura asume que todo el frontend está construido en Svelte. Esto implicaba adoptar un framework único y reescribir experimentos existentes en otras tecnologías. Aunque soporta generación estática, el patrón general sigue siendo el de una aplicación que toma control del cliente.

Para un proyecto donde la interactividad debía ser puntual y localizada, este modelo resultaba más global de lo necesario. El soporte para [markdown|Markdown] existía, pero no como eje central del sistema. SvelteKit era una excelente herramienta para experiencias ricas, pero no la más directa para un sitio centrado en el documento.
