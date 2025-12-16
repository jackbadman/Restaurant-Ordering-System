import './App.css'

import homeImage from './assets/KebabHome.svg'
import logo from './assets/logo.svg'

function App() {
  const handleLogin = () => {
    // Placeholder for authentication flow
    console.log('Navigate to login')
  }

  const handleBasket = () => {
    // Placeholder for opening basket
    console.log('Open basket')
  }

  return (
    <div className="page">
      <header className="top-bar">
        <div className="brand">
          <img src={logo} alt="Restaurant logo" className="brand__logo" />
          <span className="brand__name">King Kebab</span>
        </div>
        <div className="actions">
          <button className="action-button" type="button" onClick={handleLogin}>
            Login
          </button>
          <button
            className="icon-button"
            type="button"
            aria-label="Basket"
            onClick={handleBasket}
          >
            🧺
          </button>
        </div>
      </header>

      <main className="kebab">
        <div className="home__image">
          <img src={homeImage} alt="Restaurant dish" />
        </div>
        <div className="home__content">
          <p className="eyebrow">Home</p>
          <h1>Enjoy quick ordering from the comfort of your home</h1>
          <p className="description">
            Browse the latest menu, customise your meal, and keep an eye on your order in
            one place. Start your next order with just a few taps.
          </p>
        </div>
      </main>

      <nav className="cta-row" aria-label="Primary">
        <a className="nav-button" href="/menu">
          View Menu
        </a>
        <a className="nav-button nav-button--secondary" href="/order">
          Go to Ordering
        </a>
      </nav>
    </div>
  )
}

export default App
