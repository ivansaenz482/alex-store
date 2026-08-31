# ALEX.STORE 🛍️

Tienda virtual de **camisas de fútbol** ⚽ y **perfumes** 🧴 con panel de administración para editar todo (productos, categorías, fotos y WhatsApp) sin tocar código.

- ⚡ Next.js 16 + TypeScript + Tailwind CSS v4
- 🎬 Framer Motion para animaciones fluidas
- 🎠 Carruseles (Embma) para mostrar varios ángulos de cada producto
- 🔐 Panel admin protegido con contraseña
- 💬 Botón flotante de WhatsApp
- 📁 Contenido editable 100% mediante archivos JSON locales

## 🚀 Puesta en marcha (local)

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## 🔐 Panel de administración

Entra en **`http://localhost:3000/admin`** y usa la contraseña definida en `.env.local` (por defecto `alexstore`).

Desde ahí puedes:
- ➕ Crear/editar/eliminar **productos** y subir varias **fotos** (carrusel de ángulos).
- 🗂️ Editar **categorías** y sus colores/portadas.
- ⚙️ Cambiar nombre, eslogan, anuncio, redes y el **número de WhatsApp**.

> ⚠️ Cambia `ADMIN_PASSWORD` en `.env.local` antes de publicar.

## 📤 Subir a GitHub

```bash
git init
git add .
git commit -m "ALEX.STORE - tienda con panel admin"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/ALEX.STORE.git
git push -u origin main
```

## 🌐 Desplegar en producción

Al ser un proyecto con **edición en vivo de fotos/productos** (archivos `data/store.json` y `public/uploads/`), la tienda necesita un servidor con **disco escribible en ejecución**:

- **VPS / servidor propio** (recomendado para que la edición persista):

  ```bash
  npm run build
  npm run start   # corre en http://localhost:3000 (puerto 3000)
  ```

  Súbelo detrás de Nginx/Caddy con HTTPS para que funcione el botón y el login.

- **Vercel / servidores sin disco persistente**: perfecto para ver el frontend, pero las fotos y los cambios del admin **no se guardan** entre despliegues (el sistema de archivos es de solo lectura). Para edición persistente usa un VPS.

## 📁 Estructura de datos

- `data/store.json` — contenido de la tienda (editable desde el panel).
- `public/uploads/` — imágenes subidas desde el admin.

## 🛠️ Personalización visual

Colores y marca en `app/globals.css` (paleta `--volt`, `--magenta`, `--violet`). Tipografía en `app/layout.tsx`.
