import { useState, useEffect } from 'react'
import axios from 'axios'

function History({ userId, onClose }) {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/history/${userId}`)
      setHistory(response.data)
    } catch (err) {
      setError('Error al cargar el historial')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="history-container">
      <div className="history-header">
        <h2>Historial de Consultas</h2>
        <button onClick={onClose} className="close-button">
          Cerrar
        </button>
      </div>

      {loading && <p>Cargando historial...</p>}
      {error && <div className="error-message">{error}</div>}

      {!loading && history.length === 0 && (
        <p className="no-history">No hay consultas guardadas aún</p>
      )}

      {!loading && history.length > 0 && (
        <div className="history-list">
          {history.map((item) => (
            <div key={item.id} className="history-item">
              <div className="history-main-info">
                <h3>{item.city}</h3>
                <p className="history-date">
                  {new Date(item.query_time).toLocaleString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>

              <div className="history-weather-info">
                <div className="history-detail">
                  <span className="history-label">Temperatura:</span>
                  <span className="history-value">{item.temperature}°C</span>
                </div>
                <div className="history-detail">
                  <span className="history-label">Condición:</span>
                  <span className="history-value">{item.condition}</span>
                </div>
                <div className="history-detail">
                  <span className="history-label">Humedad:</span>
                  <span className="history-value">{item.humidity}%</span>
                </div>
                <div className="history-detail">
                  <span className="history-label">Viento:</span>
                  <span className="history-value">{item.wind_speed} km/h</span>
                </div>
              </div>

              {item.forecast && item.forecast.length > 0 && (
                <div className="history-forecast">
                  <h4>Pronóstico guardado:</h4>
                  <div className="history-forecast-grid">
                    {item.forecast.slice(0, 3).map((hour, index) => (
                      <div key={index} className="history-forecast-item">
                        <span>{new Date(hour.time).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</span>
                        <span>{hour.temp_c}°C</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default History