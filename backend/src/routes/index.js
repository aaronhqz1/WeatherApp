const express = require('express');
const { register, login } = require('../controllers/authController');
const { getWeather } = require('../controllers/weatherController');
const { saveHistory, getHistory } = require('../controllers/historyController');

const router = express.Router();

// Rutas de autenticación
router.post('/auth/register', register);
router.post('/auth/login', login);

// Rutas de clima
router.get('/weather', getWeather);

// Rutas de historial
router.post('/history', saveHistory);
router.get('/history/:userId', getHistory);

module.exports = router;