# mi-proyecto

Página web de presentación personal hecha con HTML, CSS y JavaScript puros (sin dependencias).

## Características

- Diseño moderno y responsivo (móvil, tablet y escritorio)
- Modo oscuro / claro: recuerda tu elección y, si no eliges, sigue el tema del sistema
- Efecto de escritura en el encabezado
- Barras de habilidades y contadores animados al hacer scroll
- Proyectos filtrables por categoría con efecto 3D al pasar el ratón
- Formulario de contacto con validación (abre tu cliente de correo)
- Menú móvil, botón "volver arriba" y respeto por `prefers-reduced-motion`

## Archivos

| Archivo      | Contenido                          |
|--------------|------------------------------------|
| `index.html` | Estructura y textos de la página   |
| `styles.css` | Estilos y colores de ambos temas   |
| `script.js`  | Interactividad                     |

## Cómo verla

Abre `index.html` en tu navegador. Para publicarla gratis, activa **GitHub Pages**
en *Settings → Pages* del repositorio (rama `main`, carpeta raíz).

## Personalízala

- **Nombre, textos y proyectos:** edita `index.html` (busca "Tu Nombre" y "TN").
- **Frases del efecto de escritura:** el arreglo `roles` en `script.js`.
- **Correo del formulario:** la constante `CONTACT_EMAIL` en `script.js` y el enlace `mailto:` en `index.html`.
- **Redes sociales:** los enlaces de GitHub y LinkedIn en `index.html`.
- **Colores:** las variables `--primary` y `--primary-2` al inicio de `styles.css`.
