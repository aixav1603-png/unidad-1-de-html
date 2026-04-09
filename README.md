# Club Deportivo Pro - Sistema de Gestión de Usuarios

## 📋 Objetivo del Trabajo

Desarrollar tres páginas web utilizando **HTML5 y CSS3**, aplicando estructura semántica, estilos visuales y buenas prácticas de organización del proyecto, en el contexto de un sistema web para un club deportivo.

### Capacidades evaluadas:
- ✅ Interpretar requerimientos de un cliente
- ✅ Diseñar interfaces web básicas
- ✅ Aplicar estilos con CSS
- ✅ Organizar un proyecto web
- ✅ Utilizar herramientas de control de versiones (Git)
- ✅ Incorporar el uso responsable de Inteligencia Artificial

---

## 🎯 Contexto del Problema

El cliente desea implementar un sistema web que permita gestionar usuarios dentro de su club deportivo. Para ello, se requiere desarrollar las siguientes páginas:

1. **Login de usuario** - Autenticación de usuarios existentes
2. **Registro de nuevos usuarios** - Inscripción con información personal y deportiva
3. **Recuperación de contraseña** - Proceso de recuperación de acceso

Estas páginas deben ser claras, funcionales y visualmente coherentes entre sí.

---

## 📄 Requerimientos por Página

### 1. **Página de Inicio** (index.html)
Página principal del sistema que permite navegación a las demás secciones.

**Incluye:**
- Título y descripción del sistema
- Logo y branding del club
- Acceso directo a Login, Registro y Recuperación de contraseña
- Navegación consistente

---

### 2. **Página Login** (login.html)
Permite a usuarios existentes iniciar sesión en el sistema.

**Campos:**
- ✅ Correo electrónico (obligatorio)
- ✅ Contraseña (obligatorio)

**Elementos:**
- ✅ Botón "Iniciar sesión"
- ✅ Link "¿Olvidaste tu contraseña?" → lleva a recover.html
- ✅ Link "Registrarse" → lleva a register.html
- ✅ Logo del sistema

---

### 3. **Página Registro** (register.html)
Permite a nuevos usuarios crear una cuenta en el sistema.

**Campos Obligatorios:**
- ✅ Correo electrónico
- ✅ Contraseña
- ✅ Confirmación de contraseña

**Campos Opcionales:**
- ✅ Nombre completo
- ✅ Edad
- ✅ ¿Practica deporte? (Sí/No)
- ✅ Tipo de deporte
- ✅ Objetivo personal
- ✅ Nivel de experiencia (Principiante/Intermedio/Avanzado)

**Elementos:**
- ✅ Botón "Registrarse"
- ✅ Link "¿Ya tienes cuenta? Inicia sesión aquí"
- ✅ Validación de contraseñas coincidentes
- ✅ Diseño simple y claro

---

### 4. **Recuperación de Contraseña** (recover.html)
Permite a usuarios recuperar acceso a su cuenta.

**Campos:**
- ✅ Correo electrónico (obligatorio)

**Elementos:**
- ✅ Botón "Recuperar Contraseña"
- ✅ Mensaje visual de confirmación (simulado): "Se ha enviado un enlace de recuperación a su correo"
- ✅ Link "Volver a Iniciar Sesión" → regresa a login.html
- ✅ Simulación de envío con JavaScript

---

## 📁 Estructura del Proyecto

```
unidad-1-de-html/
├── index.html              # Página de inicio
├── login.html              # Página de login
├── register.html           # Página de registro
├── recover.html            # Página de recuperación de contraseña
├── styles.css              # Estilos CSS compartidos
├── README.md               # Este archivo
└── .git/                   # Control de versiones Git
```

---

## 🛠️ Tecnologías Utilizadas

- **HTML5**: Estructura semántica, formularios y validación nativa
- **CSS3**: Estilos visuales, animaciones, gradientes y diseño responsivo
- **JavaScript**: Interactividad y simulación de funcionalidades
- **Git**: Control de versiones

---

## ✨ Características Implementadas

### HTML5
✅ Estructura semántica (header, main, section, article, footer)
✅ Metaetiquetas correctas (charset, viewport para responsividad)
✅ Formularios con validación nativa HTML5
✅ Campos de entrada apropiados (email, password, number, text, select, textarea)
✅ Plantillas semanticas por página

### CSS3
✅ Gradientes lineales (fondo y botones)
✅ Animaciones suaves (slideIn, fadeIn)
✅ Flexbox para layouts responsivos
✅ Transiciones en elementos interactivos
✅ Diseño adaptable a dispositivos móviles
✅ Estilos coherentes y consistentes en todas las páginas
✅ Paleta de colores uniforme (púrpura, gradiente azul)

### JavaScript
✅ Simulación de login con validación
✅ Validación de contraseñas coincidentes en registro
✅ Simulación de recuperación de contraseña con mensaje de éxito
✅ Experiencia interactiva sin recargar la página

### Funcionalidad
✅ Navegación intuitiva entre páginas
✅ Links de contexto disponibles en cada página
✅ Validación de formularios
✅ Mensajes de feedback al usuario
✅ Responsive design para todos los tamaños de pantalla

---

## 🎨 Diseño Visual

### Paleta de Colores
- **Primario**: #5a2d82 (Púrpura oscuro - header/footer)
- **Secundario**: #6f42c1 (Púrpura - botones)
- **Acento**: #4b0082 (Púrpura más oscuro - títulos)
- **Fondo**: Gradiente #eaf0ff → #f5e9ff
- **Éxito**: #d4edda (Verde suave)
- **Error**: #f8d7da (Rojo suave)

### Tipografía
- Familia: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif
- Headings: Font-weight 700
- Body text: Font-weight 400-600

### Espaciado y Sombras
- Tarjetas: box-shadow: 0 10px 25px rgba(48, 21, 84, 0.18)
- Bordes redondeados: 8px (inputs) a 14px (tarjetas)
- Padding consistente: 30px en tarjetas, 10-12px en inputs

---

## 🚀 Cómo Usar

1. **Abrir la aplicación**: 
   - Abre `index.html` en tu navegador preferido
   
2. **Navegar el sistema**:
   - Desde la página de inicio, accede a cualquiera de las tres secciones
   
3. **Crear una cuenta**:
   - Haz clic en "Crear Cuenta"
   - Completa los campos obligatorios (correo y contraseña)
   - Opcionalmente, agrega información adicional
   - Haz clic en "Registrarse"
   
4. **Iniciar sesión**:
   - Ingresa tu correo y contraseña
   - Haz clic en "Iniciar sesión"
   
5. **Recuperar contraseña**:
   - Si olvidas tu contraseña, haz clic en "¿Olvidaste tu contraseña?"
   - Ingresa tu correo electrónico
   - Recibirás un mensaje confirmando el envío

---

## 📱 Responsividad

El proyecto está optimizado para todos los dispositivos:

- **Desktop**: Pantallas grandes con tarjetas centradas
- **Tablet**: Ajuste de padding y márgenes
- **Mobile**: Stack vertical, texto reducido, botones optimizados

**Media Queries implementadas:**
- `@media (max-width: 600px)` - Tabletas y dispositivos medianos
- `@media (max-width: 400px)` - Teléfonos pequeños

---

## 🔒 Notas de Seguridad

⚠️ **Este es un proyecto educativo con simulaciones**
- Los formularios no se conectan a un servidor real
- Las contraseñas se validan solo en el cliente (no recomendado en producción)
- La recuperación de contraseña es una simulación
- En producción, se requiere un backend seguro

---

## 🧠 Uso de Inteligencia Artificial

Este proyecto fue desarrollado incorporando responsablemente:
- Generación de ideas de diseño
- Sugerencias de estructura HTML
- Optimizaciones de estilos CSS
- Revisión y mejora de código

Manteniendo siempre una revisión crítica del código generado y asegurando que cumple con los requerimientos y buenas prácticas.

---

## 📝 Información del Proyecto

- **Materia**: Unidad 1 - HTML5 y CSS3
- **Institución**: Educación Virtual
- **Año**: 2026
- **Tema**: Sistema de Gestión de Usuarios para Club Deportivo

---

## 👨‍💻 Instrucciones para Desarrollador

### Estructura de carpetas recomendada (futura expansión)

```
proyecto/
├── index.html
├── pages/
│   ├── login.html
│   ├── register.html
│   └── recover.html
├── css/
│   ├── styles.css
│   ├── responsive.css    # Futura adición
│   └── components.css    # Futura adición
├── js/
│   └── main.js          # Futura adición para scripts
├── assets/
│   ├── images/          # Logos, iconos
│   └── fonts/           # Fuentes personalizadas
└── README.md
```

### Próximas mejoras sugeridas

- [ ] Agregar animaciones CSS más complejas
- [ ] Implementar validación más robusta con regex
- [ ] Agregar modal de confirmación
- [ ] Integración con backend (Node.js, Django, etc.)
- [ ] Base de datos para almacenar usuarios
- [ ] Sistema de autenticación real (JWT, cookies)
- [ ] Página de dashboard para usuarios autenticados
- [ ] Recuperación de contraseña real con email

---

## 📄 Licencia

© 2026 Club Deportivo Pro. Todos los derechos reservados.

Proyecto educativo desarrollado como parte del plan de estudios.
html, etc
