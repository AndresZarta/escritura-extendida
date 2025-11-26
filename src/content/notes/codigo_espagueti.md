---
title: codigo_espagueti
description: "Una comparación entre el código espagueti con GOTO y la desorientación en sistemas de hipertexto ricos en enlaces."
tags: []
pubDate: 2025-11-25
upDate:
image: ""
draft: false
modified: 2025-11-25T22:38:18-05:00
---

Imagina este fragmento de programa en BASIC donde se usa `GOTO` indiscriminadamente:

```basic
10   INPUT "Número de elementos a ordenar: "; T
20   DIM n(T)
30   FOR i = 1 TO T
40     PRINT "ELEMENTO "; i; ":"
50     INPUT n(i)
60   NEXT i
70   C = T
80 E180:
90   C = INT(C / 2)
100  IF C = 0 THEN GOTO C330
110  D = T - C
120  E = 1
130 I220:
140     f = E
150 F230:
160         g = f + C
170         IF n(f) > n(g) THEN SWAP n(f), n(g)
180         f = f - C
190         IF f > 0 THEN GOTO F230
200     E = E + 1
210     IF E > D THEN GOTO E180
220     GOTO I220
230 C330:
240   PRINT "Lista ordenada:"
250   FOR i = 1 TO T
260       PRINT n(i)
270   NEXT i
280   END
```

Este código funciona, pero su flujo de ejecución está lleno de saltos que hacen difícil seguir «dónde estoy» y «cómo llegué aquí». 

Este desorden refleja lo que [[van_dam_navegacion|Andries van Dam]] advertía: "cuanto más rico es el hipertexto, mayor es el problema de navegación", y al compararlo con un `GOTO` que genera "espagueti", subraya cómo los vínculos sin estructura pueden desembocar en una experiencia de **desorientación** similar.