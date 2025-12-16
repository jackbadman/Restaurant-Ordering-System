import { useState } from 'react'
import './App.css'
import Header from './components/Header.jsx'
import categories from './data/categories.js'
import Home from './pages/Home.jsx'
import Menu from './pages/Menu.jsx'
import Category from './pages/Category.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'

function App() {
  const [view, setView] = useState('home')
  const [activeCategory, setActiveCategory] = useState(null)

  const handleLogin = () => {
    setView('login')
  }

  const handleBasket = () => {
    // Placeholder for opening basket
    console.log('Open basket')
  }

  const handleLoginSubmit = (event) => {
    event.preventDefault()
    // Placeholder for authentication flow
    console.log('Submit login')
  }

  const handleSignupSubmit = (event) => {
    event.preventDefault()
    // Placeholder for registration flow
    console.log('Submit signup')
  }

  const handleBackHome = () => {
    setView('home')
  }

  const goToSignup = () => {
    setView('signup')
  }

  const goToMenu = () => {
    setActiveCategory(null)
    setView('menu')
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
      <Header onLogin={handleLogin} onBasket={handleBasket} />

      {view === 'login' && (
        <Login onSubmit={handleLoginSubmit} onSignup={goToSignup} onBack={handleBackHome} />
      )}

      {view === 'signup' && (
        <Signup
          onSubmit={handleSignupSubmit}
          onBackLogin={() => setView('login')}
          onBackHome={handleBackHome}
        />
      )}

      {view === 'menu' && (
        <Menu categories={categories} onSelectCategory={openCategory} onBackHome={handleBackHome} />
      )}

      {view === 'category' && activeCategory && (
        <Category
          category={activeCategory}
          onBackCategories={() => setView('menu')}
          onBackHome={handleBackHome}
        />
      )}

      {view === 'home' && (
        <Home onMenu={goToMenu} />
      )}
    </div>
  )
}

export default App
