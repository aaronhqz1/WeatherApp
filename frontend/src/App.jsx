import { useState } from 'react'
import Login from './components/Login'
import Register from './components/Register'
import Weather from './components/Weather'

function App() {
  const [currentView, setCurrentView] = useState('login')
  const [user, setUser] = useState(null)

  const handleLogin = (userData) => {
    setUser(userData)
    setCurrentView('weather')
  }

  const handleLogout = () => {
    setUser(null)
    setCurrentView('login')
  }

  const handleRegisterSuccess = () => {
    setCurrentView('login')
  }

  return (
    <div className="app">
      {currentView === 'login' && (
        <Login 
          onLogin={handleLogin} 
          onSwitchToRegister={() => setCurrentView('register')}
        />
      )}
      
      {currentView === 'register' && (
        <Register 
          onRegisterSuccess={handleRegisterSuccess}
          onSwitchToLogin={() => setCurrentView('login')}
        />
      )}
      
      {currentView === 'weather' && user && (
        <Weather 
          user={user}
          onLogout={handleLogout}
        />
      )}
    </div>
  )
}

export default App