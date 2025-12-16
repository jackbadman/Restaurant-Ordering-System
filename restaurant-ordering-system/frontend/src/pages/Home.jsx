import homeImage from '../assets/KebabHome1.svg'

function Home({ onMenu }) {
  return (
    <>
      <main className="hero">
        <div className="hero__image">
          <img src={homeImage} alt="Restaurant dish" />
        </div>
        <div className="hero__content">
          <p className="eyebrow">Home</p>
          <h1>Welcome, we are the king of kebabs</h1>
          <p className="description">
            Browse the latest menu, customise your meal, and keep an eye on your order in one
            place. Start your next order with just a few taps.
          </p>
        </div>
      </main>

      <nav className="cta-row" aria-label="Primary">
        <button className="nav-button" type="button" onClick={onMenu}>
          View Menu
        </button>
        <a className="nav-button nav-button--secondary" href="/order">
          Go to Ordering
        </a>
      </nav>
    </>
  )
}

export default Home
