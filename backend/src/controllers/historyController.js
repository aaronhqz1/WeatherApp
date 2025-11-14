const db = require('../config/database');

const saveHistory = (req, res) => {
  const { userId, city, temperature, condition, humidity, wind_speed, forecast } = req.body;

  if (!userId || !city) {
    return res.status(400).json({ error: 'Datos incompletos' });
  }

  const forecastJSON = JSON.stringify(forecast);

  db.run(
    `INSERT INTO weather_history 
     (user_id, city, temperature, condition, humidity, wind_speed, forecast) 
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [userId, city, temperature, condition, humidity, wind_speed, forecastJSON],
    function (err) {
      if (err) {
        console.error('Error al guardar en historial:', err);
        return res.status(500).json({ error: 'Error al guardar en historial' });
      }

      res.status(201).json({
        message: 'Consulta guardada en historial',
        id: this.lastID
      });
    }
  );
};

const getHistory = (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: 'ID de usuario requerido' });
  }

  db.all(
    `SELECT * FROM weather_history 
     WHERE user_id = ? 
     ORDER BY query_time DESC`,
    [userId],
    (err, rows) => {
      if (err) {
        console.error('Error al obtener historial:', err);
        return res.status(500).json({ error: 'Error al obtener historial' });
      }

      const history = rows.map(row => ({
        id: row.id,
        city: row.city,
        temperature: row.temperature,
        condition: row.condition,
        humidity: row.humidity,
        wind_speed: row.wind_speed,
        forecast: JSON.parse(row.forecast),
        query_time: row.query_time
      }));

      res.json(history);
    }
  );
};

module.exports = { saveHistory, getHistory };