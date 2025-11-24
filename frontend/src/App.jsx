import { useState, useEffect } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Home from './components/Home'
import Login from './components/Login'
import Register from './components/Register'
import RegistrationSuccess from './components/RegistrationSuccess'
import Dashboard from './components/Dashboard'
import TravelDestination from './components/TravelDestination'

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
        
        // Si no tiene destino de viaje, ir a selección de destino
        if (!userData.travelDestination) {
          setCurrentView('travel-destination')
        } else {
          setCurrentView('dashboard')
        }
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
    localStorage.setItem('weatherAppUser', JSON.stringify(userData))
    
    // Siempre ir a selección de destino primero
    setCurrentView('travel-destination')
  }

  const handleTravelDestinationSet = (destinationData) => {
    // Actualizar usuario con destino
    const updatedUser = {
      ...user,
      travelDestination: destinationData.city,
      destinationLatitude: destinationData.latitude,
      destinationLongitude: destinationData.longitude
    }
    
    setUser(updatedUser)
    localStorage.setItem('weatherAppUser', JSON.stringify(updatedUser))
    setCurrentView('dashboard')
  }

  const handleLogout = () => {
    setUser(null)
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
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      
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
          onGoToLogin={handleGoToLoginFromSuccess}
        />
      )}

      {currentView === 'travel-destination' && user && (
        <TravelDestination
          user={user}
          onDestinationSet={handleTravelDestinationSet}
          onLogout={handleLogout}
        />
      )}
      
      {currentView === 'dashboard' && user && (
        <Dashboard 
          user={user}
          onLogout={handleLogout}
          onChangeDestination={() => setCurrentView('travel-destination')}
        />
      )}
    </div>
  )
}

export default App