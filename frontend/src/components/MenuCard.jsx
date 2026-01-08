// Category card used on the menu page.
function MenuCard({ category, onSelect }) {
  return (
    <article
      className="menu-card"
      onClick={() => onSelect(category.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect(category.id)}
    >
      <img src={category.image} alt={category.name} className="menu-card__image" />
      <div className="menu-card__body">
        <h2>{category.name}</h2>
        <p>{category.description}</p>
        <span className="menu-card__cta">View items →</span>
      </div>
    </article>
  )
}

export default MenuCard
