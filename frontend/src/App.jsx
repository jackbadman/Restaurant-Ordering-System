import { useEffect, useMemo, useState } from 'react'
import './App.css'
import Header from './components/Header.jsx'
import Home from './pages/Home.jsx'
import Menu from './pages/Menu.jsx'
import Category from './pages/Category.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Orders from './pages/Orders.jsx'
import useAuthForm from './hooks/useAuthForm.js'
import useMenu from './hooks/useMenu.js'
import api from './api/axios.js'
import { decodeJwt } from './utils/decodeJwt.js'

function App() {
  const [view, setView] = useState('home')
  const [activeCategory, setActiveCategory] = useState(null)
  const [loginNotice, setLoginNotice] = useState(null)
  const [auth, setAuth] = useState({ token: null, userId: null, role: null })
  const { categories, isLoadingMenu, menuError } = useMenu()
  const {
    handleLoginSubmit,
    handleSignupSubmit,
    signupStatus,
    loginStatus,
    clearSignupStatus,
  } = useAuthForm({ setView, setAuth, setLoginNotice })

  useEffect(() => {
    const stored = localStorage.getItem('authToken')
    if (stored) {
      const decoded = decodeJwt(stored)
      if (decoded?.userId) {
        setAuth({
          token: stored,
          userId: decoded.userId,
          role: decoded.role || null,
        })
      } else {
        localStorage.removeItem('authToken')
      }
    }
  }, [])

  useEffect(() => {
    if (auth.token) {
      api.defaults.headers.common.Authorization = `Bearer ${auth.token}`
    } else {
      delete api.defaults.headers.common.Authorization
    }
  }, [auth.token])

  const handleLogin = () => {
    clearSignupStatus()
    setLoginNotice(null)
    setView('login')
  }

  const handleBasket = () => {
    // Placeholder for opening basket
    console.log('Open basket')
  }

  const handleBackHome = () => {
    clearSignupStatus()
    setLoginNotice(null)
    setView('home')
  }

  const goToSignup = () => {
    clearSignupStatus()
    setLoginNotice(null)
    setView('signup')
  }

  const goToMenu = () => {
    setActiveCategory(null)
    setView('menu')
  }

  const goToOrders = () => {
    if (!auth.token) {
      setLoginNotice({ type: 'error', message: 'Please login to view your orders.' })
      setView('login')
      return
    }
    setView('orders')
  }

  const handleLogout = () => {
    setAuth({ token: null, userId: null, role: null })
    localStorage.removeItem('authToken')
    setView('home')
  }

  const goToLogin = () => {
    clearSignupStatus()
    setView('login')
  }

  const openCategory = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId)
    if (category) {
      setActiveCategory(category)
      setView('category')
    }
  }

  return (
    <div className="page">
      <Header
        onLogin={handleLogin}
        onBasket={handleBasket}
        onOrders={goToOrders}
        onLogout={handleLogout}
        isLoggedIn={Boolean(auth.token)}
      />

      {view === 'login' && (
        <Login
          onSubmit={handleLoginSubmit}
          onSignup={goToSignup}
          onBack={handleBackHome}
          notice={loginNotice || loginStatus || signupStatus}
        />
      )}

      {view === 'signup' && (
        <Signup
          onSubmit={handleSignupSubmit}
          onBackLogin={goToLogin}
          onBackHome={handleBackHome}
          notice={signupStatus}
        />
      )}

      {view === 'menu' && (
        <Menu
          categories={categories}
          onSelectCategory={openCategory}
          onBackHome={handleBackHome}
          isLoading={isLoadingMenu}
          error={menuError}
        />
      )}

      {view === 'category' && activeCategory && (
        <Category
          category={activeCategory}
          onBackCategories={() => setView('menu')}
          onBackHome={handleBackHome}
        />
      )}

      {view === 'home' && (
        <Home onMenu={goToMenu} onOrders={goToOrders} />
      )}

      {view === 'orders' && (
        <Orders onBackHome={handleBackHome} auth={auth} />
      )}
    </div>
  )
}

export default App
