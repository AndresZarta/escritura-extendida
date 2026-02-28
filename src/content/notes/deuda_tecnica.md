---
title: deuda_tecnica
description: "Deuda técnica: la complejidad acumulada en un sistema de software como consecuencia de decisiones razonables que, con el tiempo, dificultan el mantenimiento."
tags: [ingeniería, software]
pubDate: 2026-02-28
draft: false
---

**Deuda técnica** es un concepto acuñado por Ward Cunningham en 1992 para describir la complejidad que se acumula en un sistema de software cuando se toman decisiones que funcionan en el momento pero que, con el tiempo, dificultan la modificación y el mantenimiento del código.

La metáfora financiera es deliberada: como una deuda monetaria, la deuda técnica cobra intereses. Cada cambio futuro se vuelve más costoso porque debe navegar las capas de decisiones anteriores. No pagarla no produce un fallo inmediato, pero incrementa progresivamente el costo de cualquier intervención.

Es importante distinguir la deuda técnica de un error de programación. No se trata de código incorrecto, sino de código que fue razonable en su momento y que se vuelve problemático a medida que el sistema crece o cambian los requisitos. Por ejemplo, estilos CSS organizados para un solo tamaño de pantalla que necesitan ser reestructurados cuando el sitio debe funcionar en múltiples dispositivos.

La deuda técnica se gestiona mediante [[refactoring]]: la práctica de reorganizar código existente sin alterar su comportamiento externo.

### Referencias
Cunningham, W. (1992). The WyCash Portfolio Management System. OOPSLA '92 Experience Report. http://c2.com/doc/oopsla92.html
