# Aplicación de Consulta de Clima

## Información del Proyecto

**Integrante:** Aaron Henriquez Leiva

**Descripción:** Aplicación web para consultar el clima actual y pronóstico de cualquier ciudad, con funcionalidad de registro de usuarios y almacenamiento del historial de consultas.

## Arquitectura del Sistema

### Tecnologías Utilizadas

**Frontend:**
- React 18.3
- Vite 5.4
- Axios para peticiones HTTP
- CSS moderno

**Backend:**
- Node.js 18+
- Express 4.18
- SQLite3 para base de datos
- Cors para comunicación cross-origin
- Bcrypt para encriptación de contraseñas

**API Externa:**
- WeatherAPI (https://www.weatherapi.com/)

## Requisitos Previos

- Node.js versión 18 o superior
- npm (incluido con Node.js)
- Git (opcional, para clonar el repositorio)
- Sistema Operativo: Windows 11

## Instalación y Configuración

### 1. Preparar el Proyecto

Extraer el archivo ZIP del proyecto en una ubicación de su preferencia.

### 2. Instalación del Backend

Abrir una terminal de comandos (CMD o PowerShell) y navegar a la carpeta del backend:

```bash
cd backend
```

Instalar las dependencias necesarias:

```bash
npm install
```

Esto instalará automáticamente todas las dependencias listadas en `package.json`:
- express
- sqlite3
- bcrypt
- cors
- dotenv

### 3. Instalación del Frontend

Abrir una nueva terminal y navegar a la carpeta del frontend:

```bash
cd frontend
```

Instalar las dependencias:

```bash
npm install
```

Esto instalará:
- react
- react-dom
- axios
- vite

## Ejecución del Sistema

### Iniciar el Backend

Desde la carpeta `backend`, ejecutar:

```bash
npm start
```

El servidor backend estará disponible en: `http://localhost:3000`

### Iniciar el Frontend

Desde la carpeta `frontend`, ejecutar:

```bash
npm run dev
```

La aplicación frontend estará disponible en: `http://localhost:5173`

## Manual de Usuario

### Registro de Usuario

1. Al abrir la aplicación, verá un formulario de inicio de sesión
2. Haga clic en el botón "Crear cuenta nueva"
3. Complete el formulario con:
   - Nombre de usuario (mínimo 3 caracteres)
   - Contraseña (mínimo 6 caracteres)
4. Haga clic en "Registrarse"

### Inicio de Sesión

1. Ingrese su nombre de usuario y contraseña
2. Haga clic en "Iniciar Sesión"
3. Si las credenciales son correctas, accederá a la aplicación

### Consultar el Clima

1. Una vez autenticado, verá un campo de búsqueda
2. Ingrese el nombre de una ciudad (ejemplo: "San José", "New York", "London")
3. Haga clic en "Buscar Clima"
4. Se mostrará:
   - Temperatura actual
   - Condición del clima (soleado, nublado, etc.)
   - Humedad
   - Velocidad del viento
   - Pronóstico para las próximas horas

### Guardar Consulta en el Historial

1. Después de realizar una búsqueda exitosa
2. Haga clic en el botón "Guardar en Historial"
3. La consulta se almacenará con:
   - Ciudad consultada
   - Fecha y hora de la consulta
   - Temperatura y condiciones climáticas
   - Pronóstico

### Ver Historial de Consultas

1. Haga clic en el botón "Ver Historial"
2. Se mostrará una lista de todas sus consultas anteriores
3. Cada entrada muestra la ciudad, fecha, hora y clima consultado

### Cerrar Sesión

1. Haga clic en el botón "Cerrar Sesión" en la esquina superior derecha
2. Será redirigido a la pantalla de inicio de sesión

## Manual Técnico

### Estructura de Carpetas

```
proyecto-clima/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── weatherController.js
│   │   │   └── historyController.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── weatherRoutes.js
│   │   │   └── historyRoutes.js
│   │   └── server.js
│   ├── package.json
│   ├── requirements.txt
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Weather.jsx
│   │   │   └── History.jsx
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── package.json
│   ├── requirements.txt
│   └── vite.config.js
└── README.md
```

### Base de Datos

**Motor:** SQLite3

**Ubicación:** `backend/database.sqlite`

**Tablas:**

**users**
- id: INTEGER PRIMARY KEY AUTOINCREMENT
- username: TEXT UNIQUE NOT NULL
- password: TEXT NOT NULL (encriptada con bcrypt)
- created_at: DATETIME DEFAULT CURRENT_TIMESTAMP

**weather_history**
- id: INTEGER PRIMARY KEY AUTOINCREMENT
- user_id: INTEGER (Foreign Key a users.id)
- city: TEXT NOT NULL
- temperature: REAL
- condition: TEXT
- humidity: INTEGER
- wind_speed: REAL
- forecast: TEXT (JSON string)
- query_time: DATETIME DEFAULT CURRENT_TIMESTAMP

### API Endpoints

**Autenticación**

```
POST /api/auth/register
Body: { username, password }
Response: { message, userId }

POST /api/auth/login
Body: { username, password }
Response: { message, userId, username }
```

**Clima**

```
GET /api/weather?city={cityName}
Response: { 
  location, 
  current: { temp_c, condition, humidity, wind_kph },
  forecast: [...]
}
```

**Historial**

```
POST /api/history
Body: { userId, city, temperature, condition, humidity, wind_speed, forecast }
Response: { message, id }

GET /api/history/{userId}
Response: [{ id, city, temperature, condition, ... }]
```

### Flujo de Datos

1. Usuario se registra/inicia sesión
2. Backend valida credenciales contra la base de datos SQLite
3. Usuario busca clima de una ciudad
4. Frontend envía petición al backend
5. Backend consulta WeatherAPI con la API Key
6. Backend retorna datos al frontend
7. Usuario guarda la consulta
8. Backend almacena en tabla weather_history
9. Usuario puede ver su historial consultando la base de datos

### Variables de Entorno

En `backend/.env`:

```
WEATHER_API_KEY=027383edfe9c4095b88180204251411
PORT=3000
```

### Seguridad

- Contraseñas encriptadas con bcrypt (factor 10)
- Validación de datos en backend
- CORS configurado para permitir solo el origen del frontend
- SQL preparado para prevenir inyecciones SQL

## Preparación para Entrega

### Exportar el Proyecto

Para generar un archivo ZIP sin archivos binarios ni dependencias:

**Backend:**

```bash
cd backend
rmdir /s /q node_modules
```

**Frontend:**

```bash
cd frontend
rmdir /s /q node_modules
rmdir /s /q dist
```

Luego comprimir toda la carpeta del proyecto en formato ZIP.

### Reinstalar Dependencias (Después de Extraer)

El receptor del proyecto deberá:

1. Extraer el ZIP
2. Ejecutar en backend: `npm install`
3. Ejecutar en frontend: `npm install`
4. Seguir las instrucciones de ejecución descritas anteriormente

## Solución de Problemas

**Error: Puerto 3000 en uso**
- Cerrar otras aplicaciones que usen el puerto 3000
- O cambiar el puerto en backend/.env

**Error: Cannot find module**
- Verificar que ejecutó `npm install` en ambas carpetas

**Error de conexión a API**
- Verificar conexión a internet
- Verificar que la API Key es válida

**Base de datos no se crea**
- Verificar permisos de escritura en la carpeta backend
- La base de datos se crea automáticamente en el primer inicio

## Notas Adicionales

- La base de datos SQLite se crea automáticamente al iniciar el backend por primera vez
- Los datos persisten entre reinicios del servidor
- La API Key está configurada para uso educativo
- El proyecto cumple con todos los requisitos académicos especificados

## Contacto

Aaron Henriquez Leiva