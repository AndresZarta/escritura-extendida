---
title: arbol_del_dom
description: ""
tags: []
pubDate: 2025-12-16
upDate:
image: ""
draft: false
modified: 2025-12-16T01:20:32-05:00
---

El **árbol del DOM (Document Object Model)** es la representación estructural de un [documento HTML](/blog/programar_el_infinito_en_la_web) como una jerarquía de nodos. Cada elemento, atributo y fragmento de texto existe como un nodo relacionado por vínculos de **padre, hijo y hermano**, lo que permite que el documento sea recorrido, modificado y reordenado de manera programática.

![Diagrama del árbol del DOM](/notes/arbol_dom.svg)

Desde un punto de vista técnico, el DOM se construye por el navegador a partir del HTML inicial mediante un proceso de _parseo_ que transforma el texto plano en una estructura de objetos en memoria. Cada nodo expone una API estandarizada que permite su inspección y manipulación —creación, eliminación, clonación y reordenamiento— así como la reacción a cambios mediante eventos. Esta capa intermedia separa el documento fuente de su estado vivo en ejecución y habilita que JavaScript opere directamente sobre la estructura del texto sin necesidad de recargar la página.