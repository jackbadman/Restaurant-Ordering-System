// Menu item display row.
function MenuItem({ item }) {
  return (
    <div className="menu-item">
      <div>
        <h3>{item.name}</h3>
        <p className="description">{item.description}</p>
      </div>
      <span className="menu-item__price">£{item.price.toFixed(2)}</span>
    </div>
  )
}

export default MenuItem
