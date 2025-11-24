import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

function Login({ onLogin, onSwitchToRegister, onBack }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await axios.post('http://localhost:3000/api/auth/login', {
        username,
        password
      })

      toast.success(`Bienvenido, ${response.data.username}!`)

      onLogin({
        userId: response.data.userId,
        username: response.data.username
      })
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header-with-back">
          <button onClick={onBack} className="back-button">
            ← Volver
          </button>
        </div>
        
        <h1>Aplicación de Clima</h1>
        <h2>Iniciar Sesión</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Usuario</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Ingrese su usuario"
            />
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Ingrese su contraseña"
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="auth-switch">
          <p>¿No tienes cuenta?</p>
          <button onClick={onSwitchToRegister} className="link-button">
            Crear cuenta nueva
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login