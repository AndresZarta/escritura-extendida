## Descripción

<!-- Describe brevemente los cambios. Ejemplos:
- "Nuevo post sobre [tema]"
- "Corrige typo en el artículo X"
- "Mejora el diseño del header"
- "Actualiza configuración de CI"
-->

## Tipo de cambio

<!-- Marca con una 'x' el tipo de cambio que aplica -->

- [ ] ✍️ Nuevo contenido (post, artículo, página)
- [ ] 🐛 Corrección (typo, bug, error en contenido)
- [ ] 🎨 Diseño/UI (estilos, layout, componentes visuales)
- [ ] ✨ Nueva funcionalidad del sitio (componente, feature)
- [ ] � Documentación (README, guías, comentarios)
- [ ] � Configuración (CI/CD, workflows, dependencias)
- [ ] ♻️ Refactorización (mejora de código sin cambios visibles)
- [ ] ⚡️ Rendimiento (optimización, SEO)

## Bump de versión requerido

<!-- ⚠️ IMPORTANTE: Debes seleccionar UNA opción -->
<!-- Versión actual del sitio: consulta site-version.json -->

Este blog sigue [versionado semántico](https://semver.org/lang/es/). Selecciona el tipo de bump:

- [ ] **PATCH** (0.0.x) - Correcciones de typos, bugs menores, ajustes de estilo
- [ ] **MINOR** (0.x.0) - Nuevo post/artículo, nueva funcionalidad del sitio
- [ ] **MAJOR** (x.0.0) - Rediseño completo, cambios estructurales importantes
- [ ] **NO REQUIERE** - Cambios internos que no afectan el sitio publicado (CI, README, tests, docs)

## Checklist

<!-- Marca con 'x' cuando hayas completado cada item -->

- [ ] He actualizado `site-version.json` con la nueva versión (si requiere bump)
- [ ] El sitio se ve correctamente en `npm run dev`
- [ ] He revisado que no haya enlaces rotos o imágenes faltantes
- [ ] El código pasa lint y type-check (`npm run lint && npm run check:types`)
- [ ] Los tests pasan (`npm test`)

## Contexto adicional

<!-- Aquí puedes añadir:
- Screenshots del cambio visual
- Motivación detrás del post o feature
- Enlaces a referencias o inspiración
- Cualquier consideración especial para el review
-->
