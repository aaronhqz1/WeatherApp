import { useState } from 'react'
import Home from './components/Home'
import Login from './components/Login'
import Register from './components/Register'
import Dashboard from './components/Dashboard'

function App() {
  const [currentView, setCurrentView] = useState('home')
  const [user, setUser] = useState(null)

  const handleShowLogin = () => {
    setCurrentView('login')
  }

  const handleLogin = (userData) => {
    setUser(userData)
    setCurrentView('dashboard')
  }

  const handleLogout = () => {
    setUser(null)
    setCurrentView('home')
  }

  const handleRegisterSuccess = () => {
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