import { useEffect, useState } from 'react'
import './App.css'
import Header from './components/Header.jsx'
import Home from './pages/Home.jsx'
import Menu from './pages/Menu.jsx'
import Category from './pages/Category.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import api from './api/axios.js'
import defaultCategoryImage from './assets/KebabHome.svg'
import shishImage from './assets/shish_mixed.svg'
import donerImage from './assets/donner_mixed.svg'
import kofteImage from './assets/kofte_mixed.svg'
import sideImage from './assets/salad.svg'
import drinkImage from './assets/drinks.svg'
import sauceImage from './assets/sauce.svg'

function App() {
  const [view, setView] = useState('home')
  const [activeCategory, setActiveCategory] = useState(null)
  const [categories, setCategories] = useState([])
  const [isLoadingMenu, setIsLoadingMenu] = useState(false)
  const [menuError, setMenuError] = useState('')

  useEffect(() => {
    const loadMenu = async () => {
      setIsLoadingMenu(true)
      setMenuError('')
      try {
        const [categoriesResponse, itemsResponse] = await Promise.all([
          api.get('/api/categories'),
          api.get('/api/menuitems'),
        ])
        const categoryData = Array.isArray(categoriesResponse.data)
          ? categoriesResponse.data
          : []
        const itemData = Array.isArray(itemsResponse.data) ? itemsResponse.data : []

        const itemsByCategoryId = new Map()
        itemData.forEach((item) => {
          const rawCategory = item.categoryId
          const categoryId =
            typeof rawCategory === 'string' ? rawCategory : rawCategory?._id
          if (!categoryId) {
            return
          }
          if (!itemsByCategoryId.has(categoryId)) {
            itemsByCategoryId.set(categoryId, [])
          }
          itemsByCategoryId.get(categoryId).push(item)
        })

        const hydratedCategories = categoryData.map((category) => {
          const categoryId = category._id || category.id
          const itemsForCategory = itemsByCategoryId.get(categoryId) || []
          const categoryKey = (category.slug || category.name || '').trim().toLowerCase()
          const categoryImages = {
            shish: shishImage,
            doner: donerImage,
            donner: donerImage,
            kofte: kofteImage,
            sides: sideImage,
            side: sideImage,
            salad: sideImage,
            drinks: drinkImage,
            drink: drinkImage,
            sauce: sauceImage,
            sauces: sauceImage,
          }
          const coverImage =
            category.imageURL ||
            category.image ||
            categoryImages[categoryKey] ||
            itemsForCategory.find((item) => item.imageURL)?.imageURL ||
            defaultCategoryImage

          return {
            id: categoryId,
            name: category.name,
            description: category.description || '',
            image: coverImage,
            items: itemsForCategory.map((item) => ({
              name: item.name,
              description: item.description || '',
              price: item.price,
              imageURL: item.imageURL || '',
            })),
          }
        })

        setCategories(hydratedCategories)
      } catch (err) {
        setMenuError('Unable to load the menu right now. Please try again soon.')
      } finally {
        setIsLoadingMenu(false)
      }
    }

    loadMenu()
  }, [])

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
        <Home onMenu={goToMenu} />
      )}
    </div>
  )
}

export default App
