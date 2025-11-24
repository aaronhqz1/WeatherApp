import { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import WeatherCard from './WeatherCard'

function Dashboard({ user, onLogout, onChangeDestination }) {
  const [destinationWeather, setDestinationWeather] = useState(null)
  const [searchCity, setSearchCity] = useState('')
  const [searchResult, setSearchResult] = useState(null)
  const [recentSearches, setRecentSearches] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchLoading, setSearchLoading] = useState(false)
  const [clothingStyle, setClothingStyle] = useState('casual')
  const [recommendation, setRecommendation] = useState(null)
  const [loadingRecommendation, setLoadingRecommendation] = useState(false)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      // Cargar clima del destino de viaje
      if (user.destinationLatitude && user.destinationLongitude) {
        const weatherResponse = await axios.get(
          `http://localhost:3000/api/weather/coordinates?lat=${user.destinationLatitude}&lon=${user.destinationLongitude}`
        )
        setDestinationWeather({
          ...weatherResponse.data,
          city: user.travelDestination,
          latitude: user.destinationLatitude,
          longitude: user.destinationLongitude
        })
      }

      // Cargar últimas 3 búsquedas
      const historyResponse = await axios.get(
        `http://localhost:3000/api/history/${user.userId}/recent`
      )
      setRecentSearches(historyResponse.data)
    } catch (err) {
      toast.error('Error al cargar los datos')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchCity.trim()) {
      toast.warning('Por favor ingresa una ciudad')
      return
    }

    setSearchLoading(true)
    setSearchResult(null)

    try {
      const response = await axios.get(
        `http://localhost:3000/api/weather/search?city=${searchCity}`
      )
      setSearchResult(response.data)
      toast.success(`Clima de ${response.data.city} cargado`)
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error al buscar el clima')
    } finally {
      setSearchLoading(false)
    }
  }

  const handleSaveToHistory = async () => {
    if (!searchResult) {
      toast.warning('Primero busca una ciudad')
      return
    }

    try {
      await axios.post('http://localhost:3000/api/history', {
        userId: user.userId,
        city: searchResult.city,
        latitude: searchResult.latitude,
        longitude: searchResult.longitude,
        temperature: searchResult.temperature,
        humidity: searchResult.humidity,
        wind_speed: searchResult.wind_speed,
        weather_code: searchResult.weather_code
      })

      toast.success('Consulta guardada en el historial')
      
      // Recargar historial
      const historyResponse = await axios.get(
        `http://localhost:3000/api/history/${user.userId}/recent`
      )
      setRecentSearches(historyResponse.data)
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error al guardar en el historial')
    }
  }

  const handleGetRecommendation = async () => {
    if (!destinationWeather) {
      toast.warning('No hay datos de clima disponibles')
      return
    }

    setLoadingRecommendation(true)
    setRecommendation(null)

    try {
      const response = await axios.post('http://localhost:3000/api/ai/clothing-recommendation', {
        city: destinationWeather.city,
        temperature: destinationWeather.temperature,
        weatherCode: destinationWeather.weather_code,
        humidity: destinationWeather.humidity,
        windSpeed: destinationWeather.wind_speed,
        clothingStyle: clothingStyle
      })

      setRecommendation(response.data)
      toast.success('Recomendación generada')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error al obtener recomendación. Verifica que OpenAI esté configurado')
    } finally {
      setLoadingRecommendation(false)
    }
  }

  if (loading) {
    return (
      <div className="dashboard-container">
        <p className="loading-message">Cargando tu panel...</p>
      </div>
    )
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-left">
          <h1>Panel de Clima</h1>
          <span className="username-display">Usuario: {user.username}</span>
        </div>
        <div className="header-actions">
          <button onClick={onLogout} className="logout-button">
            Cerrar Sesión
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        {/* Destino de Viaje */}
        <section className="destination-section">
          <div className="destination-header">
            <h2>✈️ Tu Destino: {user.travelDestination}</h2>
            <button onClick={onChangeDestination} className="change-destination-btn">
              Cambiar Destino
            </button>
          </div>
          
          {destinationWeather && (
            <>
              <WeatherCard weatherData={destinationWeather} showSaveButton={false} />
              
              {/* Radio buttons y botón de recomendación */}
              <div className="recommendation-controls">
                <div className="style-selector-inline">
                  <label>¿Qué vestimenta buscas?</label>
                  <div className="radio-group">
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="clothingStyle"
                        value="casual"
                        checked={clothingStyle === 'casual'}
                        onChange={(e) => setClothingStyle(e.target.value)}
                      />
                      <span>👕 Casual</span>
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="clothingStyle"
                        value="formal"
                        checked={clothingStyle === 'formal'}
                        onChange={(e) => setClothingStyle(e.target.value)}
                      />
                      <span>👔 Formal</span>
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="clothingStyle"
                        value="athletic"
                        checked={clothingStyle === 'athletic'}
                        onChange={(e) => setClothingStyle(e.target.value)}
                      />
                      <span>🏃 Deportivo</span>
                    </label>
                  </div>
                </div>
                
                <button
                  onClick={handleGetRecommendation}
                  disabled={loadingRecommendation}
                  className="recommendation-button"
                >
                  {loadingRecommendation ? '⏳ Generando...' : '✨ Obtener Recomendación de Vestimenta'}
                </button>
              </div>

              {/* Mostrar recomendación */}
              {recommendation && (
                <div className="recommendation-result-inline">
                  <div className="result-header">
                    <span className="style-badge">{recommendation.clothingStyle.toUpperCase()}</span>
                    <span className="ai-badge">Powered by OpenAI</span>
                  </div>
                  
                  <div className="recommendation-text">
                    {recommendation.recommendation.split('\n').map((line, index) => (
                      line.trim() && <p key={index}>{line}</p>
                    ))}
                  </div>

                  <div className="recommendation-footer">
                    <small>
                      Generado: {new Date(recommendation.timestamp).toLocaleTimeString('es-ES')}
                    </small>
                  </div>
                </div>
              )}
            </>
          )}
        </section>

        {/* Búsqueda de clima */}
        <section className="search-section">
          <h2>Buscar Clima de Otra Ciudad</h2>
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              placeholder="Ej: New York, Paris, Tokyo..."
              className="search-input"
            />
            <button type="submit" disabled={searchLoading}>
              {searchLoading ? 'Buscando...' : 'Buscar'}
            </button>
          </form>

          {searchResult && (
            <>
              <WeatherCard 
                weatherData={searchResult} 
                showSaveButton={true}
                onSave={handleSaveToHistory}
              />
            </>
          )}
        </section>

        {/* Últimas búsquedas */}
        <section className="recent-searches-section">
          <h2>Tus Últimas 3 Búsquedas</h2>
          {recentSearches.length === 0 ? (
            <p className="no-data">Aún no tienes búsquedas guardadas</p>
          ) : (
            <div className="recent-searches-grid">
              {recentSearches.map((search) => (
                <WeatherCard 
                  key={search.id} 
                  weatherData={search} 
                  showSaveButton={false}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default Dashboard