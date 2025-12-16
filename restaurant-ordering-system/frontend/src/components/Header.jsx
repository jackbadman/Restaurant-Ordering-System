import logo from '../assets/logo.svg'

function Header({ onLogin, onBasket }) {
  return (
    <header className="top-bar">
      <div className="brand">
        <img src={logo} alt="Restaurant logo" className="brand__logo" />
        <span className="brand__name">King Kebab</span>
      </div>
      <div className="actions">
        <button className="action-button" type="button" onClick={onLogin}>
          Login
        </button>
        <button className="icon-button" type="button" aria-label="Basket" onClick={onBasket}>
          🧺
        </button>
      </div>
    </header>
  )
}

export default Header
