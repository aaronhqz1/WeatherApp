import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

function TravelDestination({ user, onDestinationSet, onLogout }) {
  const [destination, setDestination] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!destination.trim()) {
      toast.warning('Por favor ingresa una ciudad')
      return
    }

    setLoading(true)

    try {
      // Buscar clima de la ciudad para validar y obtener coordenadas
      const response = await axios.get(
        `http://localhost:3000/api/weather/search?city=${destination}`
      )

      // Ciudad válida, enviar datos
      onDestinationSet({
        city: response.data.city,
        latitude: response.data.latitude,
        longitude: response.data.longitude
      })

      toast.success(`¡Excelente elección! Viajemos a ${response.data.city}`)
    } catch (err) {
      toast.error(err.response?.data?.error || 'Ciudad no encontrada. Intenta con otro nombre')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="travel-destination-container">
      <div className="travel-destination-card">
        <div className="travel-header">
          <h1>✈️ ¡Bienvenido, {user.username}!</h1>
          <button onClick={onLogout} className="logout-button-small">
            Cerrar Sesión
          </button>
        </div>

        <div className="travel-content">
          <div className="travel-icon">🌍</div>
          
          <h2>¿Dónde quieres viajar hoy?</h2>
          <p className="travel-subtitle">
            Ingresa el nombre de la ciudad que te gustaría visitar
          </p>

          <form onSubmit={handleSubmit} className="travel-form">
            <div className="travel-input-group">
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Ej: París, Tokio, Nueva York..."
                className="travel-input"
                autoFocus
              />
              <button type="submit" disabled={loading} className="travel-button">
                {loading ? '🔍 Buscando...' : '🚀 Viajar'}
              </button>
            </div>
          </form>

          <div className="travel-suggestions">
            <p className="suggestions-title">Destinos populares:</p>
            <div className="suggestions-grid">
              <button onClick={() => setDestination('París, Francia')} className="suggestion-btn">
                🗼 París
              </button>
              <button onClick={() => setDestination('Tokio, Japón')} className="suggestion-btn">
                🗾 Tokio
              </button>
              <button onClick={() => setDestination('Nueva York, USA')} className="suggestion-btn">
                🗽 Nueva York
              </button>
              <button onClick={() => setDestination('Londres, UK')} className="suggestion-btn">
                🏰 Londres
              </button>
              <button onClick={() => setDestination('Barcelona, España')} className="suggestion-btn">
                🏖️ Barcelona
              </button>
              <button onClick={() => setDestination('Sídney, Australia')} className="suggestion-btn">
                🦘 Sídney
              </button>
            </div>
          </div>

          <div className="travel-info">
            <p>💡 <strong>Consejo:</strong> Puedes cambiar tu destino en cualquier momento desde el panel principal</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TravelDestination