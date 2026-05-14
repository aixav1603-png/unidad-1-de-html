# Evidencia de la aplicación SportClub

## Rama de trabajo
- `main-entrega-sportclub`

## Estado actual
- Frontend y backend integrados.
- Backend ejecutado correctamente en `http://localhost:3000`.
- Autenticación con JWT y `localStorage`.
- Roles disponibles: `user`, `coach`, `admin`.
- CRUD de usuarios disponible para administradores.
- Perfil editable por el propio usuario.

## Funcionalidades comprobadas

### Login
- Se inicia sesión en `login.html` con credenciales de ejemplo.
- Redirige al dashboard según el rol.
- Se guarda token y usuario en `localStorage`.

### Registro
- `register.html` crea usuarios nuevos.
- Valida que las contraseñas coincidan.
- Envía metadata deportiva al backend.

### Dashboards
- `user-dashboard.html`: muestra el perfil del usuario y permite editarlo.
- `admin-dashboard.html`: permite listar, buscar, crear, editar y eliminar usuarios.
- Ambos dashboards verifican sesión con `GET /api/auth/me`.

### Usuarios de prueba
- `user1@demo.cl` / `12345678` → rol `user`
- `coach1@demo.cl` / `12345678` → rol `coach`
- `admin1@demo.cl` / `12345678` → rol `admin`

## Pasos para validar la evidencia en laboratorio

1. Abrir la carpeta `backend`.
2. Asegurarse de tener `.env` configurado o copiar `backend/.env.example` a `backend/.env`.
3. Ejecutar en terminal:
   ```bash
   node src/server.js
   ```
4. Abrir el frontend con un servidor estático (por ejemplo, Live Server en VS Code).
5. Probar las siguientes rutas:
   - `index.html`
   - `login.html`
   - `register.html`
   - `user-dashboard.html`
   - `admin-dashboard.html`
6. Usar las cuentas de prueba para verificar roles y permisos.

## Observaciones
- La recuperación de contraseña en `recover.html` es una simulación en el frontend.
- El backend usa SQLite por defecto y crea datos semilla al arrancar.
- El diseño está hecho para ser limpio, agradable y fácil de usar.
