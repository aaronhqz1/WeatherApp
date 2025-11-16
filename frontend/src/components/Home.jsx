import { useState, useEffect } from 'react'
import axios from 'axios'
import WeatherCard from './WeatherCard'

function Home({ onShowLogin }) {
  const [weatherData, setWeatherData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchCity, setSearchCity] = useState('')
  const [searchLoading, setSearchLoading] = useState(false)

  useEffect(() => {
    fetchRandomWeather()
  }, [])

  const fetchRandomWeather = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await axios.get('http://localhost:3000/api/weather/random')
      setWeatherData(response.data)
    } catch (err) {
      setError('Error al cargar el clima')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchCity.trim()) return

    setSearchLoading(true)
    setError('')

    try {
      const response = await axios.get(
        `http://localhost:3000/api/weather/search?city=${searchCity}`
      )
      setWeatherData(response.data)
      setSearchCity('')
    } catch (err) {
      setError(err.response?.data?.error || 'Error al buscar el clima')
    } finally {
      setSearchLoading(false)
    }
  }

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Aplicación de Clima Global</h1>
        <button onClick={onShowLogin} className="login-button">
          Iniciar Sesión
        </button>
      </header>

      <div className="home-content">
        <div className="welcome-section">
          <h2>Bienvenido</h2>
          <p>Consulta el clima de cualquier ciudad del mundo</p>
          
          <form onSubmit={handleSearch} className="home-search-form">
            <input
              type="text"
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              placeholder="Buscar ciudad (ej: Paris, Tokyo, New York)..."
              className="search-input"
            />
            <button type="submit" disabled={searchLoading}>
              {searchLoading ? 'Buscando...' : 'Buscar'}
            </button>
          </form>
          
          <p className="random-info">O mira el clima de una ciudad aleatoria</p>
        </div>

        {loading && (
          <div className="loading-message">
            <p>Cargando clima...</p>
          </div>
        )}

        {error && (
          <div className="error-message">{error}</div>
        )}

        {weatherData && !loading && (
          <WeatherCard 
            weatherData={weatherData}
            showSaveButton={false}
          />
        )}

        <div className="home-footer">
          <button onClick={fetchRandomWeather} className="refresh-button">
            Ver Otra Ciudad Aleatoria
          </button>
          <p className="login-prompt">
            Inicia sesión para guardar tus búsquedas y ver el clima de tu ciudad
          </p>
        </div>
      </div>
    </div>
  )
}

export default Home