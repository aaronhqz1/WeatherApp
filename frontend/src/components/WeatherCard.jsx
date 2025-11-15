// Función para interpretar códigos de clima WMO
function getWeatherDescription(code) {
  const descriptions = {
    0: 'Despejado',
    1: 'Mayormente despejado',
    2: 'Parcialmente nublado',
    3: 'Nublado',
    45: 'Niebla',
    48: 'Niebla con escarcha',
    51: 'Llovizna ligera',
    53: 'Llovizna moderada',
    55: 'Llovizna intensa',
    56: 'Llovizna helada ligera',
    57: 'Llovizna helada intensa',
    61: 'Lluvia ligera',
    63: 'Lluvia moderada',
    65: 'Lluvia intensa',
    66: 'Lluvia helada ligera',
    67: 'Lluvia helada intensa',
    71: 'Nevada ligera',
    73: 'Nevada moderada',
    75: 'Nevada intensa',
    77: 'Granos de nieve',
    80: 'Chubascos ligeros',
    81: 'Chubascos moderados',
    82: 'Chubascos violentos',
    85: 'Chubascos de nieve ligeros',
    86: 'Chubascos de nieve intensos',
    95: 'Tormenta',
    96: 'Tormenta con granizo ligero',
    99: 'Tormenta con granizo intenso'
  };
  
  return descriptions[code] || 'Desconocido';
}

function getWeatherIcon(code) {
  if (code === 0) return '☀️';
  if (code >= 1 && code <= 3) return '⛅';
  if (code >= 45 && code <= 48) return '🌫️';
  if (code >= 51 && code <= 57) return '🌦️';
  if (code >= 61 && code <= 67) return '🌧️';
  if (code >= 71 && code <= 77) return '❄️';
  if (code >= 80 && code <= 82) return '🌧️';
  if (code >= 85 && code <= 86) return '🌨️';
  if (code >= 95 && code <= 99) return '⛈️';
  return '🌍';
}

function WeatherCard({ weatherData, showSaveButton = false, onSave }) {
  return (
    <div className="weather-card">
      <div className="weather-card-header">
        <h2>{weatherData.city}</h2>
        {weatherData.query_time && (
          <p className="query-time">
            {new Date(weatherData.query_time).toLocaleString('es-ES', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        )}
      </div>

      <div className="weather-card-main">
        <div className="weather-icon-large">
          {getWeatherIcon(weatherData.weather_code)}
        </div>
        <div className="weather-main-info">
          <div className="temperature-big">
            {weatherData.temperature}°C
          </div>
          <div className="condition-text">
            {getWeatherDescription(weatherData.weather_code)}
          </div>
        </div>
      </div>

      <div className="weather-card-details">
        <div className="detail-box">
          <span className="detail-icon">💧</span>
          <div>
            <span className="detail-label">Humedad</span>
            <span className="detail-value">{weatherData.humidity}%</span>
          </div>
        </div>
        <div className="detail-box">
          <span className="detail-icon">💨</span>
          <div>
            <span className="detail-label">Viento</span>
            <span className="detail-value">{weatherData.wind_speed} km/h</span>
          </div>
        </div>
      </div>

      {weatherData.hourly_forecast && weatherData.hourly_forecast.length > 0 && (
        <div className="hourly-forecast">
          <h3>Pronóstico por Hora</h3>
          <div className="hourly-grid">
            {weatherData.hourly_forecast.slice(0, 8).map((hour, index) => (
              <div key={index} className="hourly-item">
                <span className="hourly-time">
                  {new Date(hour.time).toLocaleTimeString('es-ES', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
                <span className="hourly-icon">
                  {getWeatherIcon(hour.weather_code)}
                </span>
                <span className="hourly-temp">{hour.temperature}°C</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {showSaveButton && onSave && (
        <button onClick={onSave} className="save-weather-button">
          ¿Guardar Ciudad?
        </button>
      )}
    </div>
  )
}

export default WeatherCard