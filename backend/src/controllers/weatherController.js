const https = require('https');
require('dotenv').config();

const getWeather = (req, res) => {
  const { city } = req.query;

  if (!city) {
    return res.status(400).json({ error: 'El nombre de la ciudad es requerido' });
  }

  const apiKey = process.env.WEATHER_API_KEY;
  const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(city)}&days=1&lang=es`;

  https.get(url, (apiRes) => {
    let data = '';

    apiRes.on('data', (chunk) => {
      data += chunk;
    });

    apiRes.on('end', () => {
      try {
        const weatherData = JSON.parse(data);

        if (weatherData.error) {
          return res.status(404).json({ error: 'Ciudad no encontrada' });
        }

        const response = {
          location: {
            name: weatherData.location.name,
            country: weatherData.location.country,
            localtime: weatherData.location.localtime
          },
          current: {
            temp_c: weatherData.current.temp_c,
            condition: weatherData.current.condition.text,
            humidity: weatherData.current.humidity,
            wind_kph: weatherData.current.wind_kph,
            icon: weatherData.current.condition.icon
          },
          forecast: weatherData.forecast.forecastday[0].hour.map(hour => ({
            time: hour.time,
            temp_c: hour.temp_c,
            condition: hour.condition.text,
            icon: hour.condition.icon
          }))
        };

        res.json(response);
      } catch (error) {
        res.status(500).json({ error: 'Error al procesar datos del clima' });
      }
    });
  }).on('error', (err) => {
    res.status(500).json({ error: 'Error al conectar con la API del clima' });
  });
};

module.exports = { getWeather };