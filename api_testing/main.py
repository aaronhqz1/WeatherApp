"""
FastAPI para consultas y pruebas de APIs
Permite probar los endpoints de Open-Meteo y el backend de Node.js
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import httpx
from typing import Optional
from pydantic import BaseModel

app = FastAPI(
    title="Weather API Testing Tool",
    description="Herramienta para probar y consultar las APIs de clima",
    version="1.0.0"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelos de datos
class CityRequest(BaseModel):
    city: str

class CoordinatesRequest(BaseModel):
    latitude: float
    longitude: float


@app.get("/")
async def root():
    """Endpoint de bienvenida"""
    return {
        "message": "Weather API Testing Tool",
        "version": "2.0.0",
        "endpoints": {
            "geocode": "/api/geocode/{city}",
            "weather_by_city": "/api/weather/city/{city}",
            "weather_by_coords": "/api/weather/coords?lat=X&lon=Y",
            "random_weather": "/api/weather/random",
            "cities_list": "/api/cities/list",
            "cities_stats": "/api/cities/stats",
            "test_backend": "/api/test/backend",
            "test_backend_cities": "/api/test/backend/cities",
            "docs": "/docs"
        }
    }


@app.get("/api/geocode/{city}")
async def geocode_city(city: str):
    """
    Geocodificar una ciudad usando Open-Meteo Geocoding API
    """
    try:
        async with httpx.AsyncClient() as client:
            url = f"https://geocoding-api.open-meteo.com/v1/search?name={city}&count=5&language=es&format=json"
            response = await client.get(url)
            
            if response.status_code != 200:
                raise HTTPException(status_code=response.status_code, detail="Error al consultar API de geocodificación")
            
            data = response.json()
            
            if "results" not in data or not data["results"]:
                raise HTTPException(status_code=404, detail="Ciudad no encontrada")
            
            return {
                "success": True,
                "results": data["results"]
            }
    except httpx.RequestError as e:
        raise HTTPException(status_code=500, detail=f"Error de conexión: {str(e)}")


@app.get("/api/weather/city/{city}")
async def get_weather_by_city(city: str):
    """
    Obtener clima de una ciudad (geocodifica primero, luego obtiene clima)
    """
    try:
        # Primero geocodificar
        async with httpx.AsyncClient() as client:
            geocode_url = f"https://geocoding-api.open-meteo.com/v1/search?name={city}&count=1&language=es&format=json"
            geocode_response = await client.get(geocode_url)
            
            if geocode_response.status_code != 200:
                raise HTTPException(status_code=geocode_response.status_code, detail="Error al geocodificar")
            
            geocode_data = geocode_response.json()
            
            if "results" not in geocode_data or not geocode_data["results"]:
                raise HTTPException(status_code=404, detail="Ciudad no encontrada")
            
            location = geocode_data["results"][0]
            lat = location["latitude"]
            lon = location["longitude"]
            
            # Obtener clima
            weather_url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&hourly=temperature_2m,weather_code&timezone=auto&forecast_days=1"
            weather_response = await client.get(weather_url)
            
            if weather_response.status_code != 200:
                raise HTTPException(status_code=weather_response.status_code, detail="Error al obtener clima")
            
            weather_data = weather_response.json()
            
            return {
                "success": True,
                "location": {
                    "name": location["name"],
                    "country": location["country"],
                    "latitude": lat,
                    "longitude": lon
                },
                "current": weather_data["current"],
                "hourly": weather_data["hourly"]
            }
    except httpx.RequestError as e:
        raise HTTPException(status_code=500, detail=f"Error de conexión: {str(e)}")


@app.get("/api/weather/coords")
async def get_weather_by_coordinates(lat: float, lon: float):
    """
    Obtener clima por coordenadas
    """
    try:
        async with httpx.AsyncClient() as client:
            url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&hourly=temperature_2m,weather_code&timezone=auto&forecast_days=1"
            response = await client.get(url)
            
            if response.status_code != 200:
                raise HTTPException(status_code=response.status_code, detail="Error al obtener clima")
            
            data = response.json()
            
            return {
                "success": True,
                "data": data
            }
    except httpx.RequestError as e:
        raise HTTPException(status_code=500, detail=f"Error de conexión: {str(e)}")


@app.get("/api/weather/random")
async def get_random_weather():
    """
    Obtener clima de una ciudad aleatoria
    """
    import random
    
    cities = [
        "San José, Costa Rica", "New York, USA", "Tokyo, Japan",
        "London, UK", "Paris, France", "Berlin, Germany",
        "Madrid, Spain", "Rome, Italy", "Sydney, Australia",
        "Toronto, Canada"
    ]
    
    random_city = random.choice(cities)
    
    try:
        async with httpx.AsyncClient() as client:
            # Geocodificar
            geocode_url = f"https://geocoding-api.open-meteo.com/v1/search?name={random_city}&count=1&language=es&format=json"
            geocode_response = await client.get(geocode_url)
            geocode_data = geocode_response.json()
            
            if "results" not in geocode_data or not geocode_data["results"]:
                raise HTTPException(status_code=404, detail="Error al obtener ciudad aleatoria")
            
            location = geocode_data["results"][0]
            lat = location["latitude"]
            lon = location["longitude"]
            
            # Obtener clima
            weather_url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&hourly=temperature_2m,weather_code&timezone=auto&forecast_days=1"
            weather_response = await client.get(weather_url)
            weather_data = weather_response.json()
            
            return {
                "success": True,
                "city": random_city,
                "location": location,
                "weather": weather_data
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/test/backend")
async def test_backend():
    """
    Probar conexión con el backend de Node.js
    """
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get("http://localhost:3000/")
            
            if response.status_code != 200:
                raise HTTPException(status_code=response.status_code, detail="Backend no responde correctamente")
            
            return {
                "success": True,
                "backend_status": "online",
                "backend_response": response.json()
            }
    except httpx.ConnectError:
        raise HTTPException(status_code=503, detail="No se puede conectar al backend. Asegúrese de que esté corriendo en http://localhost:3000")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/test/backend/weather/random")
async def test_backend_random_weather():
    """
    Probar endpoint de clima aleatorio del backend
    """
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get("http://localhost:3000/api/weather/random")
            
            if response.status_code != 200:
                raise HTTPException(status_code=response.status_code, detail="Error en backend")
            
            return {
                "success": True,
                "data": response.json()
            }
    except httpx.ConnectError:
        raise HTTPException(status_code=503, detail="Backend no disponible")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)