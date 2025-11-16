import { useState } from 'react'
import axios from 'axios'

function ClothingRecommendation({ weatherData }) {
  const [isOpen, setIsOpen] = useState(false)
  const [clothingStyle, setClothingStyle] = useState('casual')
  const [recommendation, setRecommendation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGetRecommendation = async () => {
    if (!weatherData) return

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

  if (!weatherData) return null

  return (
    <>
      {/* Botón flotante */}
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
              <div className="weather-summary">
                <h4>📍 {weatherData.city}</h4>
                <p>🌡️ {weatherData.temperature}°C</p>
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

              {error && (
                <div className="recommendation-error">
                  <p>⚠️ {error}</p>
                  <small>Asegúrate de configurar OPENAI_API_KEY en el backend</small>
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