function RegistrationSuccess({ username, onGoToLogin }) {
  return (
    <div className="auth-container">
      <div className="success-card">
        <div className="success-icon">✓</div>
        <h1>¡Registro Exitoso!</h1>
        
        <div className="success-details">
          <h2>Cuenta creada correctamente</h2>
          <div className="user-info">
            <div className="info-item">
              <span className="info-label">Usuario:</span>
              <span className="info-value">{username}</span>
            </div>
          </div>
          
          <div className="next-steps">
            <h3>Próximos Pasos:</h3>
            <ul>
              <li>✓ Tu cuenta ha sido creada con éxito</li>
              <li>✓ Tu contraseña está encriptada de forma segura</li>
              <li>→ Al iniciar sesión, selecciona tu destino de viaje</li>
              <li>→ Podrás cambiar tu destino en cualquier momento</li>
            </ul>
          </div>
        </div>

        <button onClick={onGoToLogin} className="success-button">
          Ir a Iniciar Sesión
        </button>

        <div className="security-note">
          <p>🔒 Tu información está protegida con encriptación de nivel bancario</p>
        </div>
      </div>
    </div>
  )
}

export default RegistrationSuccess