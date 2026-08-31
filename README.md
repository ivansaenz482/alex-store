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

## 🌐 Desplegar en producción (VPS con Docker + Nginx + HTTPS)

La tienda guarda fotos y estadísticas en el disco, por lo que necesita un servidor **con disco escribible**. El esquema más robusto es **Docker Compose** con la app, Nginx (proxy) y Certbot (HTTPS automático).

### 1. Clona el repo en tu VPS

```bash
git clone https://github.com/ivansaenz482/alex-store.git
cd alex-store
```

### 2. Configura el dominio y las credenciales

- Edita `nginx/conf.d/alexstore.conf` y reemplaza **`alexstore.MIDOMINIO.com`** por tu dominio (en los dos bloques `server`).
- Apunta el DNS del dominio (registro A) a la **IP pública** de tu VPS.
- Crea un archivo `.env` en la raíz (copia de `.env.docker.example`) con tu contraseña de admin:

```bash
cp .env.docker.example .env
nano .env      # cambia ADMIN_PASSWORD y ADMIN_SECRET
```

### 3. Levanta los contenedores

```bash
sudo docker compose up -d --build
```

### 4. Emite el certificado HTTPS (Let's Encrypt)

```bash
# Sustituye el dominio por el tuyo
DOMAIN=alexstore.MIDOMINIO.com

sudo docker compose run --rm certbot certonly \
  --webroot -w /var/www/certbot \
  -d $DOMAIN --email tu-email@correo.com \
  --agree-tos --no-eff-email

# Recarga Nginx para tomar el certificado
sudo docker compose exec nginx nginx -s reload
```

> Certbot renovará el certificado automáticamente cada 12h (servicio `certbot` del compose).

### 5. Abre tu tienda 🎉

- Catálogo público: `https://alexstore.MIDOMINIO.com`
- Panel admin: `https://alexstore.MIDOMINIO.com/admin`

**Las fotos subidas y los contadores de visitas quedan guardados** en volúmenes Docker (`store_data`, `uploads_data`), así que sobreviven a reinicios y actualizaciones.

> 📌 Si quieres probar solo el frontend sin VPS, puedes usar **Vercel**, pero ahí las fotos del admin y las estadísticas **no persisten** (sistema de archivos de solo lectura).

## 🔁 Despliegue automático con GitHub Actions (CI/CD)

Cada `git push` a `main` **construye la imagen, la publica en GitHub Container Registry (GHCR) y redepliega en tu VPS automáticamente** (sin pasos manuales ni construir en el servidor).

**Cómo funciona** (`.github/workflows/deploy.yml`):
1. Build de la imagen Docker en GitHub.
2. Push a `ghcr.io/ivansaenz482/alex-store:latest`.
3. SSH a la VPS → `git pull` + `docker compose pull` + `docker compose up -d` (conserva fotos y estadísticas en los volúmenes).

**Secretos que debes configurar** en GitHub → Settings → Secrets and variables → Actions:

| Secreto        | Ejemplo                          | Descripción                          |
| -------------- | -------------------------------- | ------------------------------------ |
| `VPS_HOST`     | `203.0.113.10`                   | IP o dominio de tu VPS               |
| `VPS_USER`     | `deploy`                         | Usuario con permiso de Docker        |
| `VPS_SSH_KEY`  | `-----BEGIN OPENSSH...`          | Clave privada SSH (una sola línea)   |
| `VPS_PATH`     | `/home/deploy/alex-store`        | Ruta del proyecto en la VPS          |
| `VPS_PORT`     | `22` (opcional)                  | Puerto SSH                           |

> La primera vez configura la VPS a mano (sección de arriba). Después, cada push redepliega solo.
> El primer push de GitHub Actions puede pedir que **actives los Actions** en la pestaña *Actions* del repo.



## 🖼️ Imágenes de ejemplo

La tienda arranca con imágenes de marca (SVG) generadas automáticamente para que se vea completa. Son **ejemplos**; reemplázalas desde el panel Admin subiendo tus fotos reales.

Para regenerarlas desde el código:

```bash
node scripts/generate-demo-images.mjs
```

## 📁 Estructura de datos

- `data/store.json` — contenido de la tienda (editable desde el panel).
- `data/analytics.json` — contadores de visitas/productos (runtime, reiniciable desde el admin).
- `public/uploads/` — imágenes subidas desde el admin (persisten en el volumen Docker).
- `public/demo/` — imágenes de ejemplo incluidas en el repo.

## 🛠️ Personalización visual

Colores y marca en `app/globals.css` (paleta `--volt`, `--magenta`, `--violet`). Tipografía en `app/layout.tsx`.
