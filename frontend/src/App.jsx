import { useEffect, useState } from 'react'
import './App.css'
import Header from './components/Header.jsx'
import Home from './pages/Home.jsx'
import Menu from './pages/Menu.jsx'
import Category from './pages/Category.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Orders from './pages/Orders.jsx'
import StaffOrders from './pages/StaffOrders.jsx'
import useAuthForm from './hooks/useAuthForm.js'
import useMenu from './hooks/useMenu.js'
import api from './api/axios.js'
import { decodeJwt } from './utils/decodeJwt.js'

function App() {
  const [view, setView] = useState('home')
  const [activeCategory, setActiveCategory] = useState(null)
  const [loginNotice, setLoginNotice] = useState(null)
  const [auth, setAuth] = useState(() => {
    const stored = localStorage.getItem('authToken')
    if (!stored) {
      return { token: null, userId: null, role: null }
    }
    const decoded = decodeJwt(stored)
    if (decoded?.userId) {
      return { token: stored, userId: decoded.userId, role: decoded.role || null }
    }
    localStorage.removeItem('authToken')
    return { token: null, userId: null, role: null }
  })
  const { categories, isLoadingMenu, menuError } = useMenu()
  const isStaff = auth.role === 'staff'
  const {
    handleLoginSubmit,
    handleSignupSubmit,
    signupStatus,
    loginStatus,
    clearSignupStatus,
  } = useAuthForm({ setView, setAuth, setLoginNotice })

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


  const handleBackHome = () => {
    clearSignupStatus()
    setLoginNotice(null)
    setView(isStaff ? 'staff-orders' : 'home')
  }

  const goToSignup = () => {
    clearSignupStatus()
    setLoginNotice(null)
    setView('signup')
  }

  const goToMenu = () => {
    if (isStaff) {
      setView('staff-orders')
      return
    }
    setActiveCategory(null)
    setView('menu')
  }

  const goToOrders = () => {
    if (isStaff) {
      setView('staff-orders')
      return
    }
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

  const goToStaffOrders = () => {
    setView('staff-orders')
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
        onOrders={isStaff ? null : goToOrders}
        onStaffOrders={auth.role === 'staff' ? goToStaffOrders : null}
        onLogout={handleLogout}
        isLoggedIn={Boolean(auth.token)}
        isStaff={isStaff}
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

      {!isStaff && view === 'menu' && (
        <Menu
          categories={categories}
          onSelectCategory={openCategory}
          onBackHome={handleBackHome}
          isLoading={isLoadingMenu}
          error={menuError}
        />
      )}

      {!isStaff && view === 'category' && activeCategory && (
        <Category
          category={activeCategory}
          onBackCategories={() => setView('menu')}
          onBackHome={handleBackHome}
        />
      )}

      {!isStaff && view === 'home' && (
        <Home onMenu={goToMenu} onOrders={goToOrders} />
      )}

      {!isStaff && view === 'orders' && (
        <Orders onBackHome={handleBackHome} auth={auth} />
      )}

      {isStaff && <StaffOrders onBackHome={handleBackHome} auth={auth} />}
    </div>
  )
}

export default App
