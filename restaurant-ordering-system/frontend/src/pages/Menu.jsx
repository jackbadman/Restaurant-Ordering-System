import MenuCard from '../components/MenuCard.jsx'

function Menu({ categories, onSelectCategory, onBackHome }) {
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
      <div className="menu-grid">
        {categories.map((category) => (
          <MenuCard key={category.id} category={category} onSelect={onSelectCategory} />
        ))}
      </div>
    </main>
  )
}

export default Menu
