---
title: refactoring
description: "Refactoring: la práctica de reestructurar código existente sin cambiar su comportamiento externo, para mejorar su claridad y mantenibilidad."
tags: [ingeniería, software]
pubDate: 2026-02-28
draft: false
---

**Refactoring** es la práctica de modificar la estructura interna de un programa sin alterar su comportamiento observable. El término fue popularizado por Martin Fowler en su libro *Refactoring: Improving the Design of Existing Code* (1999), aunque la práctica es tan antigua como la programación misma.

El objetivo no es agregar funcionalidad nueva ni corregir errores, sino mejorar la organización del código para que sea más legible, más fácil de modificar y menos propenso a acumular [[deuda_tecnica]]. Un refactoring exitoso deja el sistema funcionando exactamente igual que antes, pero con una estructura interna más clara.

Ejemplos comunes incluyen: renombrar variables para que su nombre refleje mejor su propósito, reorganizar la disposición de archivos, simplificar condicionales complejos o reestructurar estilos CSS de una arquitectura desktop-first a una que contemple múltiples tamaños de pantalla.

La práctica requiere una red de seguridad: tests automatizados o verificación visual que confirmen que el comportamiento no cambió después de la reestructuración.

### Referencias
Fowler, M. (2018). *Refactoring: Improving the Design of Existing Code* (2nd ed.). Addison-Wesley.
