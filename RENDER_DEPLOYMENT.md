# Instrucciones para desplegar en Render

## Pasos para desplegar

### 1. Preparar MongoDB Atlas (Base de Datos)
1. Ve a [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Crea una cuenta (o inicia sesión)
3. Crea un cluster gratuito
4. En "Security" → "Database Access", crea un usuario
5. En "Network Access", agrega `0.0.0.0/0` (permitir desde cualquier lugar)
6. En tu cluster, clickea "Connect" y copia la connection string
7. La connection string se verá como: `mongodb+srv://usuario:contraseña@cluster.mongodb.net/calendario`

### 2. Desplegar en Render
1. Ve a [render.com](https://render.com)
2. Conecta tu repositorio de GitHub
3. Crea un nuevo **Web Service**
4. Configuración:
   - **Repository**: Selecciona tu repo (calendario-backend)
   - **Build Command**: `cd calendario-backend && npm install`
   - **Start Command**: `cd calendario-backend && node server.js`
   - **Instance Type**: Free

### 3. Agregar Variables de Entorno en Render
En la sección "Environment", añade:

| Key | Value |
|-----|-------|
| `MONGODB_URI` | Tu connection string de MongoDB Atlas |
| `NODE_ENV` | `production` |
| `PORT` | Déjalo vacío (Render asigna uno automáticamente) |

### 4. Desplegar
1. Clickea **"Deploy"**
2. Espera a que compile (3-5 minutos)
3. Cuando esté listo, verás tu URL: `https://tu-app.onrender.com`

### 5. Acceder a tu aplicación
- Frontend: `https://tu-app.onrender.com`
- API: `https://tu-app.onrender.com/api`
- Health check: `https://tu-app.onrender.com/health`

## Estructura del Proyecto
```
calendario-backend/
├── server.js          ← Lee variables de entorno
├── .env.example       ← Ejemplo de variables
├── package.json
├── models/
├── routes/
└── ...

frontend/
├── index.html
├── calendar-api.js    ← Auto-detecta la URL correcta
└── ...
```

## Notas Importantes

✅ **El backend ahora sirve el frontend** (archivos estáticos)
- Solo necesitas desplegar el backend
- El frontend se sirve automáticamente en `/`

✅ **Las URLs se detectan automáticamente**
- `calendar-api.js` detecta si está en local o en Render
- Funciona en ambos casos sin cambios

✅ **Variables de Entorno**
- Solo necesitas configurar `MONGODB_URI` en Render
- El puerto se asigna automáticamente

## Solución de Problemas

**Error: "Cannot find module"**
- Asegúrate de que en "Build Command" está: `cd calendario-backend && npm install`

**Error: "MONGODB_URI is not defined"**
- Verifica que agregaste la variable en Render (Environment)
- Que sea la connection string correcta de MongoDB Atlas

**Frontend no carga**
- Verifica que el `frontend/` esté en el mismo nivel que `calendario-backend/`
- El backend debe servir los archivos estáticos correctamente

**Los cambios no aparecen**
- Render redeploya automáticamente cuando haces push a GitHub
- Si no, clickea "Manual Deploy"
