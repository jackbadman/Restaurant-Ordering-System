import MenuItem from '../components/MenuItem.jsx'

function Category({ category, onBackCategories, onBackHome }) {
  return (
    <main className="menu">
      <header className="menu__header">
        <div>
          <p className="eyebrow">{category.name}</p>
          <h1>Menu items</h1>
          <p className="description">{category.description}</p>
        </div>
        <div className="menu__header-actions">
          <button className="login__back" type="button" onClick={onBackCategories}>
            ← Back to categories
          </button>
          <button className="login__back" type="button" onClick={onBackHome}>
            Home
          </button>
        </div>
      </header>
      <div className="menu-items">
        {category.items.map((item) => (
          <MenuItem key={item.name} item={item} />
        ))}
      </div>
    </main>
  )
}

export default Category
