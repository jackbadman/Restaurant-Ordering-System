import { useState } from 'react'
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

function App() {
  const [view, setView] = useState('home')
  const [activeCategory, setActiveCategory] = useState(null)
  const { categories, isLoadingMenu, menuError } = useMenu()
  const { handleLoginSubmit, handleSignupSubmit, signupStatus, clearSignupStatus } =
    useAuthForm({ setView })

  const handleLogin = () => {
    clearSignupStatus()
    setView('login')
  }

  const handleBasket = () => {
    // Placeholder for opening basket
    console.log('Open basket')
  }

  const handleBackHome = () => {
    clearSignupStatus()
    setView('home')
  }

  const goToSignup = () => {
    clearSignupStatus()
    setView('signup')
  }

  const goToMenu = () => {
    setActiveCategory(null)
    setView('menu')
  }

  const goToOrders = () => {
    setView('orders')
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
      <Header onLogin={handleLogin} onBasket={handleBasket} onOrders={goToOrders} />

      {view === 'login' && (
        <Login
          onSubmit={handleLoginSubmit}
          onSignup={goToSignup}
          onBack={handleBackHome}
          notice={signupStatus}
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
        <Orders onBackHome={handleBackHome} />
      )}
    </div>
  )
}

export default App
