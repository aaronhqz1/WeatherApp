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
- Bcrypt para encriptación de contraseñas (factor 12)
- OpenAI API para recomendaciones inteligentes
- Dotenv para variables de entorno

**API Testing (Opcional):**
- FastAPI (Python)
- Uvicorn
- HTTPX para peticiones asíncronas

**API Externa:**
- Open-Meteo (https://open-meteo.com/) - API gratuita de clima sin necesidad de API Key
- Geocoding API (https://geocoding-api.open-meteo.com/) - Para búsqueda de ciudades

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

### 4. Configuracion de OpenAI

1. Crear archivo .env

En el directorio:

```bash
WeatherApp/backend
```

crea un archivo llamado:

```bash
.env
```

2. Agregar las variables de entorno

Dentro del archivo .env, agrega lo siguiente:

```ini
PORT=3000
OPENAI_API_KEY=TU_API_KEY_AQUI
```

Nota: Reemplaza TU_API_KEY_AQUI con tu clave real de la API de OpenAI.

## Ejecución del Sistema

### Iniciar el Backend

Desde la carpeta `backend`, ejecutar:

```bash
npm start
```

El servidor backend estará disponible en: `http://localhost:3000`

La base de datos SQLite se creará automáticamente en `backend/database.sqlite`

### Iniciar el Frontend

Desde la carpeta `frontend`, ejecutar:

```bash
npm run dev
```

La aplicación frontend estará disponible en: `http://localhost:5173`

## Manual de Usuario

### Pantalla Inicial (Home)

1. Al abrir la aplicación, verá el clima de una ciudad aleatoria del mundo
2. Puede buscar cualquier ciudad usando el campo de búsqueda
3. El clima se actualiza cada vez que busca o hace clic en "Ver Otra Ciudad Aleatoria"
4. En la esquina superior derecha hay un botón "Iniciar Sesión"

### Registro de Usuario

1. Haga clic en "Iniciar Sesión"
2. En la pantalla de login, haga clic en "Crear cuenta nueva"
3. Complete el formulario con:
   - Nombre de usuario (mínimo 3 caracteres)
   - Contraseña (mínimo 6 caracteres)
   - Ciudad de origen (OPCIONAL - puede omitirla y configurarla después)
4. Haga clic en "Registrarse"
5. El sistema guardará su ciudad si la proporcionó

### Inicio de Sesión

1. Ingrese su nombre de usuario y contraseña
2. Haga clic en "Iniciar Sesión"
3. Si las credenciales son correctas, accederá a su panel personalizado

### Panel de Usuario (Después de Iniciar Sesión)

Al iniciar sesión verá:
- Clima actual de su ciudad de origen
- Las últimas 3 búsquedas realizadas
- Campo de búsqueda para consultar otras ciudades

### Consultar el Clima

1. Una vez autenticado, ingrese el nombre de una ciudad en el campo de búsqueda
2. Puede buscar ciudades de todo el mundo (ejemplo: "New York", "Tokyo", "London")
3. Haga clic en "Buscar Clima"
4. Se mostrará:
   - Temperatura actual
   - Condición del clima
   - Humedad relativa
   - Velocidad del viento
   - Pronóstico por horas para el día actual

### Guardar Consulta en el Historial

1. Después de realizar una búsqueda exitosa
2. Haga clic en el botón "Guardar en Historial"
3. La consulta se almacenará automáticamente
4. **Nota**: No se puede guardar la misma ciudad dos veces en 24 horas

### Ver Últimas Búsquedas

- Las últimas 3 búsquedas se muestran automáticamente en su panel
- Haga clic en cualquier ciudad del historial para ver los detalles guardados

### Cambiar Ciudad de Origen

1. Una vez autenticado, haga clic en "Configuración" (⚙️) en la esquina superior derecha
2. Ingrese una nueva ciudad de origen
3. Haga clic en "Actualizar Ciudad"
4. La próxima vez que inicie sesión, verá el clima de la nueva ciudad
5. Si omitió la ciudad al registrarse, puede configurarla aquí

### Cerrar Sesión

1. Haga clic en el botón "Cerrar Sesión" en la esquina superior derecha
2. Será redirigido a la pantalla inicial con clima aleatorio

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
│   │   │   └── index.js
│   │   └── server.js
│   ├── package.json
│   ├── requirements.txt
│   └── database.sqlite (se crea automáticamente)
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── WeatherCard.jsx
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── requirements.txt
│   └── vite.config.js
├── api_testing/ (OPCIONAL)
│   ├── main.py
│   ├── requirements.txt
│   └── README.md
├── .gitignore
└── README.md
```

### Base de Datos

**Motor:** SQLite3

**Ubicación:** `backend/database.sqlite`

**Tablas:**

**users**
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  home_city TEXT,
  home_latitude REAL,
  home_longitude REAL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

**weather_history**
```sql
CREATE TABLE weather_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  city TEXT NOT NULL,
  latitude REAL,
  longitude REAL,
  temperature REAL,
  humidity INTEGER,
  wind_speed REAL,
  weather_code INTEGER,
  query_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
)
```

### API Endpoints

**Autenticación**

```
POST /api/auth/register
Body: { username, password, homeCity }
Response: { message, userId }

POST /api/auth/login
Body: { username, password }
Response: { message, userId, username, homeCity, homeLatitude, homeLongitude }
```

**Clima**

```
GET /api/weather/random
Response: { city, latitude, longitude, temperature, humidity, wind_speed, weather_code }

GET /api/weather/search?city={cityName}
Response: { city, latitude, longitude, temperature, humidity, wind_speed, weather_code, hourly_forecast }

GET /api/weather/coordinates?lat={lat}&lon={lon}
Response: { temperature, humidity, wind_speed, weather_code, hourly_forecast }
```

**Historial**

```
POST /api/history
Body: { userId, city, latitude, longitude, temperature, humidity, wind_speed, weather_code }
Response: { message, id }

GET /api/history/:userId/recent
Response: [últimas 3 consultas]
```

**Configuración**

```
PUT /api/user/:userId/home
Body: { homeCity }
Response: { message, homeLatitude, homeLongitude }
```

### Flujo de Datos

**Usuario No Autenticado:**
1. Sistema obtiene ciudad aleatoria de lista predefinida
2. Backend consulta coordenadas usando Geocoding API
3. Backend consulta clima usando Open-Meteo API
4. Frontend muestra clima con botón de login

**Registro:**
1. Usuario ingresa credenciales y ciudad de origen
2. Backend geocodifica la ciudad para obtener coordenadas
3. Backend encripta contraseña y guarda usuario con coordenadas
4. Usuario es redirigido al login

**Login:**
1. Usuario ingresa credenciales
2. Backend valida y retorna datos del usuario incluyendo coordenadas de ciudad origen
3. Frontend carga dashboard con clima de ciudad origen
4. Frontend carga últimas 3 búsquedas del historial

**Búsqueda de Clima:**
1. Usuario busca una ciudad
2. Backend geocodifica la ciudad
3. Backend consulta clima actual y pronóstico por hora
4. Frontend muestra resultados
5. Usuario puede guardar en historial

### Códigos de Clima (WMO Weather Interpretation Codes)

Open-Meteo usa códigos WMO estándar:
- 0: Despejado
- 1-3: Parcialmente nublado
- 45, 48: Niebla
- 51-57: Llovizna
- 61-67: Lluvia
- 71-77: Nieve
- 80-82: Chubascos
- 85-86: Chubascos de nieve
- 95-99: Tormenta

### Ciudades Aleatorias Predefinidas

El sistema incluye una lista de 50 ciudades famosas del mundo para la pantalla inicial:
- San José, Costa Rica
- New York, USA
- Tokyo, Japan
- London, UK
- Paris, France
- Y 45 más...

### Seguridad

- Contraseñas encriptadas con bcrypt (factor 10)
- Validación de datos en backend
- CORS configurado para permitir solo el origen del frontend
- Prepared statements para prevenir inyecciones SQL
- No se requiere API Key (Open-Meteo es completamente gratuito)

## Preparación para Entrega

### Exportar el Proyecto

Para generar un archivo ZIP sin archivos binarios ni dependencias:

**Backend:**

```bash
cd backend
rmdir /s /q node_modules
del database.sqlite
```

**Frontend:**

```bash
cd frontend
rmdir /s /q node_modules
rmdir /s /q dist
```

**API Testing (si se incluye):**

```bash
cd api_testing
rmdir /s /q venv
del /s /q __pycache__
```

Luego comprimir toda la carpeta del proyecto en formato ZIP.

### Reinstalar Dependencias (Después de Extraer)

El receptor del proyecto deberá:

1. Extraer el ZIP
2. Ejecutar en backend: `npm install`
3. Ejecutar en frontend: `npm install`
4. Seguir las instrucciones de ejecución descritas anteriormente
5. La base de datos se creará automáticamente al iniciar el backend

## Solución de Problemas

**Error: Puerto 3000 en uso**
- Cerrar otras aplicaciones que usen el puerto 3000
- O cambiar el puerto en backend/src/server.js

**Error: Cannot find module**
- Verificar que ejecutó `npm install` en ambas carpetas

**Error de conexión a API**
- Verificar conexión a internet
- Open-Meteo es gratuito y no requiere API Key

**Base de datos no se crea**
- Verificar permisos de escritura en la carpeta backend
- La base de datos se crea automáticamente en el primer inicio

**Ciudad no encontrada**
- Verificar ortografía del nombre de la ciudad
- Intentar con el nombre en inglés
- Agregar el nombre del país (ej: "San José, Costa Rica")

## Características Técnicas Destacadas

- Sin necesidad de API Key (completamente gratuito)
- Geocodificación automática de ciudades
- Pronóstico por horas para el día actual
- Almacenamiento de ubicación de origen del usuario (opcional)
- Ciudad de origen puede ser omitida al registrarse
- Historial persistente de búsquedas (sin duplicados en 24h)
- Interfaz responsive para dispositivos móviles
- Base de datos SQLite embebida (sin configuración adicional)
- Búsqueda de ciudades desde la pantalla inicial
- Configuración de ciudad de origen desde el panel de usuario
- FastAPI incluido para pruebas y desarrollo de APIs
- .gitignore completo para control de versiones

## Notas Adicionales

- La base de datos SQLite se crea automáticamente al iniciar el backend por primera vez
- Los datos persisten entre reinicios del servidor
- Open-Meteo es un servicio gratuito y de código abierto
- El proyecto cumple con todos los requisitos académicos especificados
- La aplicación funciona completamente sin conexión a servicios de pago

## Contacto

Aaron Henriquez Leiva
