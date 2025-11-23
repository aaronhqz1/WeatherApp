import { useState } from 'react'
import axios from 'axios'

function ClothingRecommendation({ weatherData }) {
  const [isOpen, setIsOpen] = useState(false)
  const [clothingStyle, setClothingStyle] = useState('casual')
  const [recommendation, setRecommendation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGetRecommendation = async () => {
    if (!weatherData) {
      setError('Por favor, busca el clima de una ciudad primero')
      return
    }

    setLoading(true)
    setError('')
    setRecommendation(null)

    try {
      const response = await axios.post('http://localhost:3000/api/ai/clothing-recommendation', {
        city: weatherData.city,
        temperature: weatherData.temperature,
        weatherCode: weatherData.weather_code,
        humidity: weatherData.humidity,
        windSpeed: weatherData.wind_speed,
        clothingStyle: clothingStyle
      })

      setRecommendation(response.data)
    } catch (err) {
      setError(err.response?.data?.error || 'Error al obtener recomendación. Verifica que OpenAI esté configurado.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Botón flotante - SIEMPRE visible */}
      <button 
        className="clothing-fab"
        onClick={() => setIsOpen(!isOpen)}
        title="Recomendación de Vestimenta con IA"
      >
        👔
      </button>

      {/* Panel lateral */}
      {isOpen && (
        <>
          <div className="clothing-overlay" onClick={() => setIsOpen(false)} />
          <div className="clothing-panel">
            <div className="clothing-header">
              <h3>🤖 Recomendación de Vestimenta</h3>
              <button className="close-panel" onClick={() => setIsOpen(false)}>
                ✕
              </button>
            </div>

            <div className="clothing-content">
              {weatherData ? (
                <>
                  <div className="weather-summary">
                    <h4>📍 {weatherData.city}</h4>
                    <p>🌡️ {weatherData.temperature}°C</p>
                    <p>💧 Humedad: {weatherData.humidity}%</p>
                    <p>💨 Viento: {weatherData.wind_speed} km/h</p>
                  </div>

                  <div className="style-selector">
                    <label>Estilo de vestimenta:</label>
                    <div className="style-buttons">
                      <button
                        className={`style-btn ${clothingStyle === 'formal' ? 'active' : ''}`}
                        onClick={() => setClothingStyle('formal')}
                      >
                        👔 Formal
                      </button>
                      <button
                        className={`style-btn ${clothingStyle === 'casual' ? 'active' : ''}`}
                        onClick={() => setClothingStyle('casual')}
                      >
                        👕 Casual
                      </button>
                      <button
                        className={`style-btn ${clothingStyle === 'athletic' ? 'active' : ''}`}
                        onClick={() => setClothingStyle('athletic')}
                      >
                        🏃 Deportivo
                      </button>
                    </div>
                  </div>

                  <button
                    className="get-recommendation-btn"
                    onClick={handleGetRecommendation}
                    disabled={loading}
                  >
                    {loading ? '⏳ Generando...' : '✨ Obtener Recomendación'}
                  </button>
                </>
              ) : (
                <div className="no-weather-message">
                  <p>📍 No hay datos de clima disponibles</p>
                  <p>Por favor:</p>
                  <ol>
                    <li>Busca el clima de una ciudad</li>
                    <li>Luego vuelve aquí para obtener recomendaciones</li>
                  </ol>
                </div>
              )}

              {error && (
                <div className="recommendation-error">
                  <p>⚠️ {error}</p>
                  {error.includes('OpenAI') && (
                    <small>Asegúrate de configurar OPENAI_API_KEY en el backend</small>
                  )}
                </div>
              )}

              {recommendation && (
                <div className="recommendation-result">
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
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default ClothingRecommendation