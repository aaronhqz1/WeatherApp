const https = require('https');

// Lista de ciudades aleatorias para la pantalla inicial
const randomCities = [
  'San José, Costa Rica',
  'New York, USA',
  'Tokyo, Japan',
  'London, UK',
  'Paris, France',
  'Berlin, Germany',
  'Madrid, Spain',
  'Rome, Italy',
  'Sydney, Australia',
  'Toronto, Canada',
  'Mexico City, Mexico',
  'Buenos Aires, Argentina',
  'São Paulo, Brazil',
  'Lima, Peru',
  'Santiago, Chile',
  'Bogotá, Colombia',
  'Caracas, Venezuela',
  'Miami, USA',
  'Los Angeles, USA',
  'Chicago, USA',
  'Moscow, Russia',
  'Beijing, China',
  'Seoul, South Korea',
  'Bangkok, Thailand',
  'Singapore',
  'Dubai, UAE',
  'Istanbul, Turkey',
  'Cairo, Egypt',
  'Nairobi, Kenya',
  'Cape Town, South Africa',
  'Mumbai, India',
  'Delhi, India',
  'Karachi, Pakistan',
  'Manila, Philippines',
  'Jakarta, Indonesia',
  'Ho Chi Minh City, Vietnam',
  'Barcelona, Spain',
  'Amsterdam, Netherlands',
  'Vienna, Austria',
  'Zurich, Switzerland',
  'Stockholm, Sweden',
  'Oslo, Norway',
  'Copenhagen, Denmark',
  'Helsinki, Finland',
  'Warsaw, Poland',
  'Prague, Czech Republic',
  'Athens, Greece',
  'Lisbon, Portugal',
  'Dublin, Ireland',
  'Brussels, Belgium'
];

// Función para geocodificar una ciudad
function geocodeCity(cityName) {
  return new Promise((resolve, reject) => {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=es&format=json`;
    
    https.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (result.results && result.results.length > 0) {
            const location = result.results[0];
            resolve({
              city: `${location.name}, ${location.country}`,
              latitude: location.latitude,
              longitude: location.longitude
            });
          } else {
            reject(new Error('Ciudad no encontrada'));
          }
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// Función para obtener clima de coordenadas
function getWeatherByCoordinates(latitude, longitude) {
  return new Promise((resolve, reject) => {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&hourly=temperature_2m,weather_code&timezone=auto&forecast_days=1`;
    
    https.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const weatherData = JSON.parse(data);
          
          const response = {
            temperature: weatherData.current.temperature_2m,
            humidity: weatherData.current.relative_humidity_2m,
            wind_speed: weatherData.current.wind_speed_10m,
            weather_code: weatherData.current.weather_code,
            hourly_forecast: weatherData.hourly.time.map((time, index) => ({
              time: time,
              temperature: weatherData.hourly.temperature_2m[index],
              weather_code: weatherData.hourly.weather_code[index]
            })).slice(0, 24)
          };
          
          resolve(response);
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// Obtener clima de una ciudad aleatoria
const getRandomWeather = async (req, res) => {
  try {
    const randomCity = randomCities[Math.floor(Math.random() * randomCities.length)];
    const location = await geocodeCity(randomCity);
    const weather = await getWeatherByCoordinates(location.latitude, location.longitude);
    
    res.json({
      city: location.city,
      latitude: location.latitude,
      longitude: location.longitude,
      ...weather
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener clima aleatorio' });
  }
};

// Buscar clima por nombre de ciudad
const searchWeather = async (req, res) => {
  const { city } = req.query;

  if (!city) {
    return res.status(400).json({ error: 'El nombre de la ciudad es requerido' });
  }

  try {
    const location = await geocodeCity(city);
    const weather = await getWeatherByCoordinates(location.latitude, location.longitude);
    
    res.json({
      city: location.city,
      latitude: location.latitude,
      longitude: location.longitude,
      ...weather
    });
  } catch (error) {
    if (error.message === 'Ciudad no encontrada') {
      return res.status(404).json({ error: 'Ciudad no encontrada' });
    }
    res.status(500).json({ error: 'Error al obtener clima' });
  }
};

// Obtener clima por coordenadas
const getWeatherByCoords = async (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: 'Latitud y longitud son requeridas' });
  }

  try {
    const weather = await getWeatherByCoordinates(parseFloat(lat), parseFloat(lon));
    res.json(weather);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener clima' });
  }
};

module.exports = { 
  getRandomWeather, 
  searchWeather, 
  getWeatherByCoords 
};