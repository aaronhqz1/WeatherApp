import { useState, useEffect } from 'react'
import axios from 'axios'
import WeatherCard from './WeatherCard'
import ClothingRecommendation from './ClothingRecommendation'

function Dashboard({ user, onLogout }) {
  const [homeWeather, setHomeWeather] = useState(null)
  const [recentSearches, setRecentSearches] = useState([])
  const [searchCity, setSearchCity] = useState('')
  const [searchResult, setSearchResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchLoading, setSearchLoading] = useState(false)
  const [error, setError] = useState('')
  const [saveMessage, setSaveMessage] = useState('')
  const [showSettings, setShowSettings] = useState(false)
  const [newHomeCity, setNewHomeCity] = useState('')
  const [settingsLoading, setSettingsLoading] = useState(false)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      // Solo cargar clima de origen si tiene ciudad configurada
      if (user.homeLatitude && user.homeLongitude) {
        const weatherResponse = await axios.get(
          `http://localhost:3000/api/weather/coordinates?lat=${user.homeLatitude}&lon=${user.homeLongitude}`
        )
        setHomeWeather({
          ...weatherResponse.data,
          city: user.homeCity,
          latitude: user.homeLatitude,
          longitude: user.homeLongitude
        })
      }

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
      const errorMsg = err.response?.data?.error || 'Error al guardar en el historial'
      setError(errorMsg)
      setTimeout(() => setError(''), 5000)
    }
  }

  const handleUpdateHomeCity = async (e) => {
    e.preventDefault()
    if (!newHomeCity.trim()) return

    setSettingsLoading(true)
    setError('')

    try {
      const response = await axios.put(
        `http://localhost:3000/api/user/${user.userId}/home`,
        { homeCity: newHomeCity }
      )

      // Actualizar datos del usuario
      user.homeCity = response.data.homeCity
      user.homeLatitude = response.data.homeLatitude
      user.homeLongitude = response.data.homeLongitude

      setSaveMessage('Ciudad de origen actualizada')
      setShowSettings(false)
      setNewHomeCity('')
      
      // Recargar datos
      await loadDashboardData()

      setTimeout(() => setSaveMessage(''), 3000)
    } catch (err) {
      setError(err.response?.data?.error || 'Error al actualizar ciudad')
    } finally {
      setSettingsLoading(false)
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
          <button onClick={() => setShowSettings(!showSettings)} className="settings-button">
            ⚙️ Configuración
          </button>
          <button onClick={onLogout} className="logout-button">
            Cerrar Sesión
          </button>
        </div>
      </header>

      {showSettings && (
        <section className="settings-section">
          <h2>Configurar Ciudad de Origen</h2>
          <form onSubmit={handleUpdateHomeCity} className="settings-form">
            <input
              type="text"
              value={newHomeCity}
              onChange={(e) => setNewHomeCity(e.target.value)}
              placeholder={user.homeCity || "Ingresa tu ciudad (ej: San José, Costa Rica)"}
              className="search-input"
            />
            <div className="settings-buttons">
              <button type="submit" disabled={settingsLoading}>
                {settingsLoading ? 'Guardando...' : 'Actualizar Ciudad'}
              </button>
              <button type="button" onClick={() => setShowSettings(false)} className="cancel-button">
                Cancelar
              </button>
            </div>
          </form>
        </section>
      )}

      <div className="dashboard-content">
        {/* Clima de ciudad de origen */}
        {user.homeCity ? (
          <section className="home-weather-section">
            <h2>Tu Ciudad: {user.homeCity}</h2>
            {homeWeather && (
              <WeatherCard weatherData={homeWeather} showSaveButton={false} />
            )}
          </section>
        ) : (
          <section className="home-weather-section">
            <h2>Ciudad de Origen No Configurada</h2>
            <p className="no-data">
              Configura tu ciudad de origen para ver el clima al iniciar sesión.
              Haz clic en "Configuración" arriba.
            </p>
          </section>
        )}

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