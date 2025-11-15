import { useState, useEffect } from 'react'
import axios from 'axios'
import WeatherCard from './WeatherCard'

function Dashboard({ user, onLogout }) {
  const [homeWeather, setHomeWeather] = useState(null)
  const [recentSearches, setRecentSearches] = useState([])
  const [searchCity, setSearchCity] = useState('')
  const [searchResult, setSearchResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchLoading, setSearchLoading] = useState(false)
  const [error, setError] = useState('')
  const [saveMessage, setSaveMessage] = useState('')

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      // Cargar clima de la ciudad de origen
      const weatherResponse = await axios.get(
        `http://localhost:3000/api/weather/coordinates?lat=${user.homeLatitude}&lon=${user.homeLongitude}`
      )
      setHomeWeather({
        ...weatherResponse.data,
        city: user.homeCity,
        latitude: user.homeLatitude,
        longitude: user.homeLongitude
      })

      // Cargar últimas 3 búsquedas
      const historyResponse = await axios.get(
        `http://localhost:3000/api/history/${user.userId}/recent`
      )
      setRecentSearches(historyResponse.data)
    } catch (err) {
      setError('Error al cargar los datos')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchCity.trim()) return

    setSearchLoading(true)
    setError('')
    setSaveMessage('')
    setSearchResult(null)

    try {
      const response = await axios.get(
        `http://localhost:3000/api/weather/search?city=${searchCity}`
      )
      setSearchResult(response.data)
    } catch (err) {
      setError(err.response?.data?.error || 'Error al buscar el clima')
    } finally {
      setSearchLoading(false)
    }
  }

  const handleSaveToHistory = async () => {
    if (!searchResult) return

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

      setSaveMessage('Consulta guardada en el historial')
      
      // Recargar historial
      const historyResponse = await axios.get(
        `http://localhost:3000/api/history/${user.userId}/recent`
      )
      setRecentSearches(historyResponse.data)

      setTimeout(() => setSaveMessage(''), 3000)
    } catch (err) {
      setError('Error al guardar en el historial')
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
        <button onClick={onLogout} className="logout-button">
          Cerrar Sesión
        </button>
      </header>

      <div className="dashboard-content">
        {/* Clima de ciudad de origen */}
        <section className="home-weather-section">
          <h2>Tu Ciudad: {user.homeCity}</h2>
          {homeWeather && (
            <WeatherCard weatherData={homeWeather} showSaveButton={false} />
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

          {error && <div className="error-message">{error}</div>}
          {saveMessage && <div className="success-message">{saveMessage}</div>}

          {searchResult && (
            <WeatherCard 
              weatherData={searchResult} 
              showSaveButton={true}
              onSave={handleSaveToHistory}
            />
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