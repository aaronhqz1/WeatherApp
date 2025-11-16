# Instrucciones para Corregir el Error

## Problema: "Error al cargar el clima"

El problema estaba en cómo se importaba el módulo `https` en Node.js.

## Solución

### 1. Detener los servidores (si están corriendo)

Presiona `Ctrl+C` en ambas terminales (backend y frontend)

### 2. Eliminar node_modules del backend

```bash
cd backend
rmdir /s /q node_modules
```

### 3. Actualizar package.json

El archivo `backend/package.json` ya NO debe incluir `"https": "^1.0.0"` en dependencies.

Debe verse así:

```json
"dependencies": {
  "express": "^4.18.2",
  "sqlite3": "^5.1.6",
  "bcrypt": "^5.1.1",
  "cors": "^2.8.5"
}
```

### 4. Actualizar los archivos del controlador

En `backend/src/controllers/authController.js` y `backend/src/controllers/weatherController.js`:

**CAMBIAR:**
```javascript
const https = require('https');
```

**POR:**
```javascript
const https = require('node:https');
```

### 5. Reinstalar dependencias

```bash
cd backend
npm install
```

### 6. Iniciar de nuevo

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## Nuevas Características Implementadas

### ✅ 1. No permitir guardar la misma ciudad dos veces

- El sistema verifica si ya guardaste esa ciudad en las últimas 24 horas
- Si intentas guardar una ciudad repetida, recibirás un mensaje: "Ya guardaste esta ciudad recientemente"

### ✅ 2. Ciudad de origen opcional

- Al registrarte, puedes omitir la ciudad de origen
- Si no ingresas ciudad, verás un mensaje para configurarla después

### ✅ 3. Cambiar ciudad de origen

- En el Dashboard, haz clic en el botón "⚙️ Configuración"
- Ingresa tu nueva ciudad
- Haz clic en "Actualizar Ciudad"

### ✅ 4. Búsqueda en Homepage

- Ahora puedes buscar ciudades directamente desde la pantalla inicial
- No necesitas iniciar sesión para buscar
- Solo necesitas login para guardar búsquedas

### ✅ 5. FastAPI para pruebas

**Instalar:**
```bash
cd api_testing
pip install -r requirements.txt
```

**Ejecutar:**
```bash
python main.py
```

**Usar:**
- Documentación: http://localhost:8000/docs
- Probar geocodificación: http://localhost:8000/api/geocode/Paris
- Probar clima: http://localhost:8000/api/weather/city/Tokyo
- Probar backend: http://localhost:8000/api/test/backend

### ✅ 6. .gitignore

Archivo `.gitignore` creado en la raíz del proyecto para excluir:
- node_modules/
- *.sqlite
- dist/
- .env
- venv/
- __pycache__/
- Y más...

## Verificar que Todo Funciona

### 1. Pantalla Inicial
- Debe cargar clima aleatorio sin errores
- Debes poder buscar ciudades
- Botón "Ver Otra Ciudad Aleatoria" debe funcionar

### 2. Registro
- Puedes registrarte sin ciudad (campo opcional)
- Si ingresas ciudad, debe geocodificarla correctamente

### 3. Dashboard
- Si no tienes ciudad configurada, verás mensaje para configurarla
- Botón "Configuración" permite cambiar ciudad
- Búsquedas se guardan correctamente
- No permite guardar ciudad duplicada en 24h

### 4. FastAPI (Opcional)
- Servidor corre en puerto 8000
- Documentación en /docs funciona
- Endpoints responden correctamente

## Estructura de Puertos

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3000
- **FastAPI** (opcional): http://localhost:8000

## Archivos Modificados/Creados

### Modificados:
- backend/package.json (removido https)
- backend/requirements.txt (removido https)
- backend/src/controllers/authController.js (require('node:https'))
- backend/src/controllers/weatherController.js (require('node:https'))
- backend/src/controllers/historyController.js (validación duplicados)
- frontend/src/components/Register.jsx (ciudad opcional)
- frontend/src/components/Home.jsx (búsqueda agregada)
- frontend/src/components/Dashboard.jsx (configuración ciudad)
- frontend/src/App.css (nuevos estilos)

### Creados:
- .gitignore
- api_testing/main.py
- api_testing/requirements.txt
- api_testing/README.md
- INSTRUCCIONES_CORRECCION.md

## Problemas Comunes

**Error: EADDRINUSE en puerto 3000 o 5173**
```bash
# Windows - Matar proceso en puerto
netstat -ano | findstr :3000
taskkill /PID <numero> /F
```

**Error: Ciudad no encontrada**
- Intenta agregar el país: "San José, Costa Rica"
- Verifica ortografía
- Usa nombres en inglés si falla en español

**Error: Ya guardaste esta ciudad recientemente**
- Es normal, el sistema evita duplicados en 24 horas
- Intenta con otra ciudad

## Comandos Útiles

**Limpiar todo y reiniciar:**
```bash
# Backend
cd backend
rmdir /s /q node_modules
npm install
npm start

# Frontend  
cd frontend
rmdir /s /q node_modules
rmdir /s /q dist
npm install
npm run dev
```

**Ver logs del backend:**
Los mensajes aparecen en la terminal donde ejecutaste `npm start`

**Reiniciar base de datos:**
```bash
cd backend
del database.sqlite
npm start
```
(La base de datos se recreará automáticamente)