import { useState, useEffect } from 'react'
import Home from './components/Home'
import Login from './components/Login'
import Register from './components/Register'
import RegistrationSuccess from './components/RegistrationSuccess'
import Dashboard from './components/Dashboard'

function App() {
  const [currentView, setCurrentView] = useState('home')
  const [user, setUser] = useState(null)
  const [registrationData, setRegistrationData] = useState(null)

  // Cargar sesión del usuario al iniciar
  useEffect(() => {
    const savedUser = localStorage.getItem('weatherAppUser')
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        setUser(userData)
        setCurrentView('dashboard')
      } catch (error) {
        console.error('Error al cargar sesión:', error)
        localStorage.removeItem('weatherAppUser')
      }
    }
  }, [])

  const handleShowLogin = () => {
    setCurrentView('login')
  }

  const handleLogin = (userData) => {
    setUser(userData)
    // Guardar sesión en localStorage
    localStorage.setItem('weatherAppUser', JSON.stringify(userData))
    setCurrentView('dashboard')
  }

  const handleLogout = () => {
    setUser(null)
    // Limpiar sesión
    localStorage.removeItem('weatherAppUser')
    setCurrentView('home')
  }

  const handleRegisterSuccess = (data) => {
    setRegistrationData(data)
    setCurrentView('registration-success')
  }

  const handleGoToLoginFromSuccess = () => {
    setCurrentView('login')
  }

  return (
    <div className="app">
      {currentView === 'home' && (
        <Home onShowLogin={handleShowLogin} />
      )}
      
      {currentView === 'login' && (
        <Login 
          onLogin={handleLogin} 
          onSwitchToRegister={() => setCurrentView('register')}
          onBack={() => setCurrentView('home')}
        />
      )}
      
      {currentView === 'register' && (
        <Register 
          onRegisterSuccess={handleRegisterSuccess}
          onSwitchToLogin={() => setCurrentView('login')}
        />
      )}

      {currentView === 'registration-success' && registrationData && (
        <RegistrationSuccess
          username={registrationData.username}
          homeCity={registrationData.homeCity}
          onGoToLogin={handleGoToLoginFromSuccess}
        />
      )}
      
      {currentView === 'dashboard' && user && (
        <Dashboard 
          user={user}
          onLogout={handleLogout}
        />
      )}
    </div>
  )
}

export default App