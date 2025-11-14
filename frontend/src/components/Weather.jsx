import { useState } from 'react'
import axios from 'axios'
import History from './History'

function Weather({ user, onLogout }) {
  const [city, setCity] = useState('')
  const [weatherData, setWeatherData] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!city.trim()) return

    setError('')
    setLoading(true)
    setWeatherData(null)
    setSaveMessage('')

    try {
      const response = await axios.get(`http://localhost:3000/api/weather?city=${city}`)
      setWeatherData(response.data)
    } catch (err) {
      setError(err.response?.data?.error || 'Error al buscar el clima')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveToHistory = async () => {
    if (!weatherData) return

    try {
      await axios.post('http://localhost:3000/api/history', {
        userId: user.userId,
        city: weatherData.location.name,
        temperature: weatherData.current.temp_c,
        condition: weatherData.current.condition,
        humidity: weatherData.current.humidity,
        wind_speed: weatherData.current.wind_kph,
        forecast: weatherData.forecast.slice(0, 6)
      })

      setSaveMessage('Consulta guardada en el historial')
      setTimeout(() => setSaveMessage(''), 3000)
    } catch (err) {
      setError('Error al guardar en el historial')
    }
  }

  return (
    <div className="weather-container">
      <header className="weather-header">
        <h1>Consulta del Clima</h1>
        <div className="header-info">
          <span>Usuario: {user.username}</span>
          <button onClick={() => setShowHistory(!showHistory)} className="secondary-button">
            {showHistory ? 'Ocultar Historial' : 'Ver Historial'}
          </button>
          <button onClick={onLogout} className="logout-button">
            Cerrar Sesión
          </button>
        </div>
      </header>

      {showHistory ? (
        <History userId={user.userId} onClose={() => setShowHistory(false)} />
      ) : (
        <div className="weather-content">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Ingrese nombre de ciudad (ej: San José)"
              className="search-input"
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Buscando...' : 'Buscar Clima'}
            </button>
          </form>

          {error && <div className="error-message">{error}</div>}
          {saveMessage && <div className="success-message">{saveMessage}</div>}

          {weatherData && (
            <div className="weather-result">
              <div className="weather-main">
                <h2>{weatherData.location.name}, {weatherData.location.country}</h2>
                <p className="local-time">Hora local: {weatherData.location.localtime}</p>
                
                <div className="current-weather">
                  <img 
                    src={`https:${weatherData.current.icon}`} 
                    alt={weatherData.current.condition}
                    className="weather-icon-large"
                  />
                  <div className="temperature-display">
                    <span className="temperature">{weatherData.current.temp_c}°C</span>
                    <span className="condition">{weatherData.current.condition}</span>
                  </div>
                </div>

                <div className="weather-details">
                  <div className="detail-item">
                    <span className="detail-label">Humedad</span>
                    <span className="detail-value">{weatherData.current.humidity}%</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Viento</span>
                    <span className="detail-value">{weatherData.current.wind_kph} km/h</span>
                  </div>
                </div>

                <button onClick={handleSaveToHistory} className="save-button">
                  Guardar en Historial
                </button>
              </div>

              <div className="forecast-section">
                <h3>Pronóstico por Hora</h3>
                <div className="forecast-grid">
                  {weatherData.forecast.slice(0, 6).map((hour, index) => (
                    <div key={index} className="forecast-item">
                      <span className="forecast-time">
                        {new Date(hour.time).toLocaleTimeString('es-ES', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                      <img 
                        src={`https:${hour.icon}`} 
                        alt={hour.condition}
                        className="weather-icon-small"
                      />
                      <span className="forecast-temp">{hour.temp_c}°C</span>
                      <span className="forecast-condition">{hour.condition}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Weather