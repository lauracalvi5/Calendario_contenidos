# 📚 Guía de Migración: Frontend + Backend + MongoDB

## 🎯 Estado Actual

✅ **Backend**: Corriendo en http://localhost:5000
✅ **MongoDB**: Conectado en localhost:27017
✅ **API Cliente**: Disponible en `calendar-api.js`

---

## 📋 Próximos Pasos

### Fase 1: Integración Básica del Frontend

El archivo `calendar-api.js` que está en tu carpeta de frontend es un cliente HTTP que reemplaza localStorage. 

#### Paso 1.1: Cargar el script en index.html

En tu `index.html`, agrega esto **antes** del cierre `</body>`:

```html
<!-- API Client -->
<script src="calendar-api.js"></script>
```

#### Paso 1.2: Cambiar la forma de cargar datos

**ANTES (localStorage):**
```javascript
function loadState() {
  const stored = localStorage.getItem(APP_STATE_KEY);
  // ...
}
```

**DESPUÉS (API):**
```javascript
async function loadState() {
  try {
    const clients = await api.getClients();
    // Actualizar UI con los clientes
    return clients;
  } catch (error) {
    console.error('Error cargando clientes:', error);
  }
}
```

---

### Fase 2: Migración de Funciones Clave

Identifiqué estas funciones en tu código que necesitan cambios:

#### 1️⃣ **Guardar Estado (saveState)**
```javascript
// VIEJO
localStorage.setItem(APP_STATE_KEY, JSON.stringify({ clients, potentialClients, posts }));

// NUEVO
async function saveState(clients, potentialClients, posts) {
  try {
    // Guardar cada cliente
    for (let client of clients) {
      if (client._id) {
        await api.updateClient(client._id, client);
      } else {
        await api.createClient(client);
      }
    }
    
    // Guardar cada post
    for (let post of posts) {
      if (post._id) {
        await api.updatePost(post._id, post);
      } else {
        post.clientId = selectedClient;
        await api.createPost(post);
      }
    }
  } catch (error) {
    console.error('Error guardando:', error);
  }
}
```

#### 2️⃣ **Crear Nueva Publicación**
```javascript
// NUEVO
async function savePost() {
  const postData = {
    clientId: selectedClient,
    title: document.getElementById('postTitle').value,
    caption: document.getElementById('postCaption').value,
    date: document.getElementById('postDate').value,
    networks: selectedNetworks,
    status: selectedStatus,
    isAd: isAdActive,
    postType: document.getElementById('postType').value,
    stats: {
      reach: parseInt(document.getElementById('postReach').value) || 0,
      inquiries: parseInt(document.getElementById('postInquiries').value) || 0,
      followers: parseInt(document.getElementById('postFollowers').value) || 0
    },
    note: document.getElementById('postNote').value
  };

  try {
    if (editingPostId) {
      await api.updatePost(editingPostId, postData);
    } else {
      await api.createPost(postData);
    }
    closeModal();
    loadState(); // Recargar datos
  } catch (error) {
    alert('Error guardando publicación: ' + error.message);
  }
}
```

#### 3️⃣ **Agregar Cliente**
```javascript
// NUEVO
async function saveClient() {
  const clientData = {
    name: document.getElementById('newClientName').value
  };

  try {
    await api.createClient(clientData);
    closeAddClientModal();
    loadState(); // Recargar datos
  } catch (error) {
    alert('Error creando cliente: ' + error.message);
  }
}
```

#### 4️⃣ **Generar Link Compartible**
```javascript
// NUEVO
async function generateShareCode() {
  try {
    const duration = parseInt(document.getElementById('shareDuration').value);
    const response = await api.generateShareCode(selectedClient, duration);
    
    const link = `${window.location.origin}?share=${response.code}`;
    document.getElementById('shareResultLink').value = link;
    document.getElementById('shareResultField').style.display = 'block';
  } catch (error) {
    alert('Error generando link: ' + error.message);
  }
}
```

---

## 🔄 Flujo Completo de Datos

```
Usuario crea post en Frontend
    ↓
JavaScript llama a api.createPost(datos)
    ↓
calendar-api.js hace fetch POST a http://localhost:5000/api/posts
    ↓
Backend Express recibe la petición
    ↓
Mongoose valida y guarda en MongoDB
    ↓
Respuesta vuelve al Frontend
    ↓
Frontend actualiza la UI
```

---

## ⚠️ Cambios Importantes

### 1. IDs ahora son MongoDB ObjectIds
- **Antes**: IDs eran strings generados por `Math.random()` o similares
- **Ahora**: Son ObjectIds de MongoDB (`_id`)

```javascript
// En lugar de acceder a post.id
// Ahora es: post._id
```

### 2. Funciones async/await
- Todas las operaciones de datos ahora son **asincrónicas**
- Necesitas usar `async/await` o `.then()`

```javascript
// ❌ NO FUNCIONA
const posts = api.getPostsByClient(clientId);

// ✅ CORRECTO
const posts = await api.getPostsByClient(clientId);
```

### 3. Manejo de errores
```javascript
// Siempre envuelve en try/catch
try {
  const data = await api.getClients();
} catch (error) {
  console.error('Error:', error);
  // Mostrar mensaje al usuario
}
```

---

## 🧪 Testing de la API

### Test 1: Crear un cliente
```javascript
// En la consola del navegador:
await api.createClient({ name: "Test Client" })
```

### Test 2: Obtener todos los clientes
```javascript
await api.getClients()
```

### Test 3: Health check
```javascript
await api.healthCheck()
```

---

## 📤 Próximo Paso: Desplegar a Render

Una vez todo funcione localmente, puedes desplegar:

1. **Sube a GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Crea cuenta en Render.com**

3. **Conecta tu repo**

4. **Configura variables de entorno en Render:**
   - `MONGODB_URI`: Connection string de MongoDB Atlas
   - `PORT`: 10000
   - `NODE_ENV`: production
   - `FRONTEND_URL`: Tu dominio Vercel/Netlify

---

## 🆘 Solución de Problemas

### Error: "Failed to fetch"
- El backend no está corriendo
- Verifica que `npm start` esté ejecutándose en `/calendario-backend`

### Error: "CORS error"
- La URL del frontend no está en la lista de CORS
- Actualiza `FRONTEND_URL` en `.env`

### Error: "Cannot connect to MongoDB"
- MongoDB no está corriendo
- En Windows: `mongod` debe estar ejecutándose

---

## 📝 Checklist de Implementación

- [ ] Script `calendar-api.js` cargado en `index.html`
- [ ] Función `loadState()` actualizada a async
- [ ] `savePost()` usa `api.createPost()`
- [ ] `saveClient()` usa `api.createClient()`
- [ ] `generateShareCode()` usa `api.generateShareCode()`
- [ ] Todos los IDs usan `_id` en lugar de `id`
- [ ] Manejo de errores en todas las funciones async
- [ ] Probado en navegador (consola sin errores)
- [ ] Probado en Postman/API tester
- [ ] Listo para desplegar

---

**Estoy disponible para ayudarte con cualquier paso específico. ¿Por dónde empezamos?**
