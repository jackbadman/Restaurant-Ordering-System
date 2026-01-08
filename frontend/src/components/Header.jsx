// App header with auth/navigation actions.
import logo from '../assets/logo.svg'

function Header({ onLogin, onOrders, onStaffOrders, onLogout, isLoggedIn, isStaff }) {
  return (
    <header className="top-bar">
      <div className="brand">
        <img src={logo} alt="Restaurant logo" className="brand__logo" />
        <span className="brand__name">King Kebab</span>
      </div>
      <div className="actions">
        {!isLoggedIn ? (
          <button className="action-button" type="button" onClick={onLogin}>
            Login
          </button>
        ) : (
          <button className="action-button" type="button" onClick={onLogout}>
            Logout
          </button>
        )}
        {isStaff && onStaffOrders && (
          <button className="action-button" type="button" onClick={onStaffOrders}>
            Staff orders
          </button>
        )}
        {onOrders && (
          <button className="action-button" type="button" onClick={onOrders}>
            Orders
          </button>
        )}
      </div>
    </header>
  )
}

export default Header
