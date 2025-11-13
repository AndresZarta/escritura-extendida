# Protección de Rama y Verificación de Versión

Guía para asegurar que toda fusión a `main` requiera pasar las pruebas de calidad y actualizar la versión del sitio.

---

## Workflows Clave

### 1. `ci.yml`
- **Trigger:** PRs y push a `main`
- **Función:** Verifica calidad del código
- **Incluye:** Lint (ESLint), Type-check (TypeScript), Tests (Vitest)

### 2. `version-check.yml`
- **Trigger:** PRs a `main`
- **Función:** Comprueba que `site-version.json` haya sido incrementado  
- **Reglas:**  
  - Si se marca `NO REQUIERE`, omite el check  
  - Si se marca `PATCH`, `MINOR` o `MAJOR`, valida el cambio y el formato semver (`x.y.z`)

### 3. `deploy.yml`
- **Trigger:** Push a `main` o éxito del CI  
- **Función:** Despliega solo si la versión cambió  
- **Etapas:**  
  1. Verifica incremento de versión  
  2. Construye con `withastro/action@v5`  
  3. Publica en GitHub Pages  

## Uso del PR Template

1. Indica tipo de cambio (`PATCH`, `MINOR`, `MAJOR`, `NO REQUIERE`)  
2. Actualiza `site-version.json` con la nueva versión  
3. Marca “He actualizado site-version.json”

Ejemplo:
```bash
# Crear branch y hacer cambios
git checkout -b feature/nueva-funcionalidad

# Actualizar versión
echo '{ "version": "0.2.0" }' > site-version.json
git add site-version.json
git commit -m "chore: bump version to 0.2.0"
git push origin feature/nueva-funcionalidad
