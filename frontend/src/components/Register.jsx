import { useState } from 'react'
import axios from 'axios'

function Register({ onRegisterSuccess, onSwitchToLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [homeCity, setHomeCity] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false)

  // Validar fortaleza de contraseña en tiempo real
  const getPasswordStrength = () => {
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    }
    return checks
  }

  const passwordChecks = getPasswordStrength()
  const isPasswordStrong = Object.values(passwordChecks).every(check => check)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    if (!isPasswordStrong) {
      setError('La contraseña no cumple con los requisitos de seguridad')
      return
    }

    setLoading(true)

    try {
      const response = await axios.post('http://localhost:3000/api/auth/register', {
        username,
        password,
        homeCity: homeCity.trim() || null
      })

      // Pasar datos al componente de éxito
      onRegisterSuccess({
        username: response.data.username,
        homeCity: response.data.homeCity
      })
    } catch (err) {
      setError(err.response?.data?.error || 'Error al registrar usuario')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Aplicación de Clima</h1>
        <h2>Crear Cuenta</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Usuario</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength={3}
              placeholder="Mínimo 3 caracteres"
            />
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setShowPasswordRequirements(true)}
              required
              placeholder="Crea una contraseña segura"
            />
            
            {showPasswordRequirements && password.length > 0 && (
              <div className="password-requirements">
                <p className="requirements-title">Requisitos de contraseña:</p>
                <ul>
                  <li className={passwordChecks.length ? 'valid' : 'invalid'}>
                    {passwordChecks.length ? '✓' : '○'} Mínimo 8 caracteres
                  </li>
                  <li className={passwordChecks.uppercase ? 'valid' : 'invalid'}>
                    {passwordChecks.uppercase ? '✓' : '○'} Al menos una mayúscula
                  </li>
                  <li className={passwordChecks.lowercase ? 'valid' : 'invalid'}>
                    {passwordChecks.lowercase ? '✓' : '○'} Al menos una minúscula
                  </li>
                  <li className={passwordChecks.number ? 'valid' : 'invalid'}>
                    {passwordChecks.number ? '✓' : '○'} Al menos un número
                  </li>
                  <li className={passwordChecks.special ? 'valid' : 'invalid'}>
                    {passwordChecks.special ? '✓' : '○'} Al menos un carácter especial (!@#$%...)
                  </li>
                </ul>
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Confirmar Contraseña</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirme su contraseña"
            />
          </div>

          <div className="form-group">
            <label>Ciudad de Origen (Opcional)</label>
            <input
              type="text"
              value={homeCity}
              onChange={(e) => setHomeCity(e.target.value)}
              placeholder="Ej: San José, Costa Rica"
            />
            <small className="form-help">
              Puedes configurarla después desde tu perfil
            </small>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" disabled={loading || !isPasswordStrong}>
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>

        <div className="auth-switch">
          <p>¿Ya tienes cuenta?</p>
          <button onClick={onSwitchToLogin} className="link-button">
            Iniciar sesión
          </button>
        </div>
      </div>
    </div>
  )
}

export default Register