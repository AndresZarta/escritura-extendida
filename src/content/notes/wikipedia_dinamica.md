---
title: wikipedia_dinamica
description: "Explicación técnica de cómo Wikipedia genera páginas dinámicamente desde bases de datos relacionales, en contraste con HTML estático."
tags: []
pubDate: 2025-12-01
upDate:
image: ""
draft: false
modified: 2025-12-01T23:18:17-05:00
---

A diferencia de los archivos HTML tradicionales, que son documentos estáticos escritos de antemano y almacenados como archivos individuales en un servidor, una página generada dinámicamente desde una base de datos relacional no existe como archivo fijo. 

En su lugar, el contenido (texto, estructura, metadatos) se guarda en tablas de una base de datos, y el servidor construye la página en tiempo real cada vez que alguien la solicita. Este enfoque permite mayor flexibilidad, ya que se pueden integrar plantillas, módulos y enlaces de forma dinámica, adaptando la presentación del contenido según el contexto, el idioma o las actualizaciones más recientes.

**Por Ejemplo:**

Un archivo HTML tradicional podría verse así:

```html
<!-- archivo: historia.html -->
<html>
  <head><title>Historia</title></head>
  <body>
    <h1>La Revolución Francesa</h1>
    <p>La Revolución Francesa comenzó en 1789...</p>
  </body>
</html>
```

Este archivo es estático: siempre muestra el mismo contenido, guardado tal cual.

En cambio, en un sitio como Wikipedia que genera contenido dinámicamente, no existe un archivo `historia.html`. Cuando alguien accede al artículo, el servidor ejecuta código (por ejemplo, en PHP) que consulta la base de datos, recupera el título, el cuerpo del texto, los enlaces, las plantillas y los convierte en HTML como este:

```php
<?php
//pseudocodigo simplificado

// Conexión a la base de datos
$mysqli = new mysqli("localhost", "usuario", "contraseña", "wiki");

// Obtener el parámetro de la URL, por ejemplo: index.php?page=Revolucion_Francesa
$page_title = $_GET['page'] ?? 'Portada';

// Preparar y ejecutar la consulta
$stmt = $mysqli->prepare("SELECT title, content FROM pages WHERE title = ?");
$stmt->bind_param("s", $page_title);
$stmt->execute();
$result = $stmt->get_result();

// Verificar si se encontró la página
if ($row = $result->fetch_assoc()) {
    // Plantilla básica de renderizado
    echo "<html>";
    echo "<head><title>" . htmlspecialchars($row['title']) . "</title></head>";
    echo "<body>";
    echo "<h1>" . htmlspecialchars($row['title']) . "</h1>";
    echo "<div>" . parseWikiText($row['content']) . "</div>";
    echo "</body></html>";
} else {
    // Página no encontrada
    echo "<h1>Página no encontrada</h1>";
}
?>

```

Así, el artículo se **construye en tiempo real** a partir de múltiples fuentes (base de datos, plantillas, imágenes), lo que permite integraciones automáticas, actualizaciones instantáneas y una navegación mucho más rica.