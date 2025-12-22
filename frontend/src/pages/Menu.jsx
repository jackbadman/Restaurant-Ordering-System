import MenuCard from '../components/MenuCard.jsx'

function Menu({ categories, onSelectCategory, onBackHome, isLoading, error }) {
  return (
    <main className="menu">
      <header className="menu__header">
        <div>
          <p className="eyebrow">Menu</p>
          <h1>Pick a category</h1>
          <p className="description">Tap a category to see the dishes inside.</p>
        </div>
        <button className="login__back" type="button" onClick={onBackHome}>
          ← Back to home
        </button>
      </header>
      {isLoading && <p className="description">Loading menu…</p>}
      {!isLoading && error && <p className="description">{error}</p>}
      {!isLoading && !error && categories.length === 0 && (
        <p className="description">No categories available right now.</p>
      )}
      {!isLoading && !error && categories.length > 0 && (
        <div className="menu-grid">
          {categories.map((category) => (
            <MenuCard key={category.id} category={category} onSelect={onSelectCategory} />
          ))}
        </div>
      )}
    </main>
  )
}

export default Menu
