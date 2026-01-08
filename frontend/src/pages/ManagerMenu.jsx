// Manager UI to CRUD menu items.
import { useEffect, useMemo, useRef, useState } from 'react'
import api from '../api/axios.js'

const emptyItem = {
  name: '',
  description: '',
  price: '',
  categoryId: '',
  available: true,
}

const normalizeItem = (item) => ({
  ...item,
  categoryId: typeof item.categoryId === 'string' ? item.categoryId : item.categoryId?._id,
})

function ManagerMenu() {
  const [categories, setCategories] = useState([])
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState(null)
  const [form, setForm] = useState(emptyItem)
  const [editId, setEditId] = useState(null)
  const [editForm, setEditForm] = useState(emptyItem)
  const editSectionRef = useRef(null)
  const noticeRef = useRef(null)

  const categoryById = useMemo(
    () => new Map(categories.map((category) => [category._id || category.id, category.name])),
    [categories]
  )

  const loadData = async () => {
    setLoading(true)
    setError('')
    try {
      const [categoryResponse, itemResponse] = await Promise.all([
        api.get('/api/categories'),
        api.get('/api/menuitems'),
      ])
      const categoryData = Array.isArray(categoryResponse.data)
        ? categoryResponse.data
        : []
      const itemData = Array.isArray(itemResponse.data) ? itemResponse.data : []
      setCategories(categoryData)
      setItems(itemData.map(normalizeItem))
    } catch {
      setError('Unable to load menu data right now. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (!form.categoryId && categories.length > 0) {
      setForm((prev) => ({ ...prev, categoryId: categories[0]._id || categories[0].id }))
    }
  }, [categories, form.categoryId])

  useEffect(() => {
    if (notice?.type === 'success') {
      noticeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [notice])

  const updateForm = (setter) => (event) => {
    const { name, value, type, checked } = event.target
    setter((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const validatePayload = (payload) => {
    if (!payload.name.trim()) {
      return 'Name is required.'
    }
    if (!payload.categoryId) {
      return 'Category is required.'
    }
    const parsedPrice = Number.parseFloat(payload.price)
    if (Number.isNaN(parsedPrice) || parsedPrice < 0) {
      return 'Price must be a number greater than or equal to 0.'
    }
    return null
  }

  const handleCreate = async (event) => {
    event.preventDefault()
    setNotice(null)
    const validationError = validatePayload(form)
    if (validationError) {
      setNotice({ type: 'error', message: validationError })
      return
    }
    try {
      const payload = {
        ...form,
        price: Number.parseFloat(form.price),
      }
      const response = await api.post('/api/menuitems', payload)
      setItems((prev) => [...prev, normalizeItem(response.data)])
      setForm((prev) => ({
        ...emptyItem,
        categoryId: prev.categoryId || '',
      }))
      setNotice({ type: 'success', message: 'Menu item created.' })
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        'Unable to create menu item.'
      setNotice({ type: 'error', message })
    }
  }

  const startEdit = (item) => {
    setEditId(item._id)
    setEditForm({
      name: item.name || '',
      description: item.description || '',
      price: item.price?.toString() || '',
      categoryId: item.categoryId || '',
      available: item.available ?? true,
    })
    setNotice(null)
    requestAnimationFrame(() => {
      editSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  const cancelEdit = () => {
    setEditId(null)
    setEditForm(emptyItem)
  }

  const handleUpdate = async (event) => {
    event.preventDefault()
    setNotice(null)
    const validationError = validatePayload(editForm)
    if (validationError) {
      setNotice({ type: 'error', message: validationError })
      return
    }
    try {
      const payload = {
        ...editForm,
        price: Number.parseFloat(editForm.price),
      }
      const response = await api.put(`/api/menuitems/${editId}`, payload)
      setItems((prev) =>
        prev.map((item) =>
          item._id === editId ? normalizeItem(response.data) : item
        )
      )
      setNotice({ type: 'success', message: 'Menu item updated.' })
      cancelEdit()
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        'Unable to update menu item.'
      setNotice({ type: 'error', message })
    }
  }

  const handleDelete = async (itemId) => {
    const target = items.find((item) => item._id === itemId)
    const label = target?.name ? `Delete "${target.name}"?` : 'Delete this menu item?'
    if (!window.confirm(label)) {
      return
    }
    setNotice(null)
    try {
      await api.delete(`/api/menuitems/${itemId}`)
      setItems((prev) => prev.filter((item) => item._id !== itemId))
      setNotice({ type: 'success', message: 'Menu item deleted.' })
      if (editId === itemId) {
        cancelEdit()
      }
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        'Unable to delete menu item.'
      setNotice({ type: 'error', message })
    }
  }

  return (
    <main className="admin-menu">
      <header className="admin-menu__header">
        <div>
          <p className="eyebrow">Manager</p>
          <h1>Menu item manager</h1>
          <p className="description">Create, update, and remove menu items.</p>
        </div>
        <div className="admin-menu__actions" />
      </header>

      {loading && <p className="description">Loading menu data...</p>}
      {error && <p className="admin-menu__notice admin-menu__notice--error">{error}</p>}
      {notice && (
        <p
          ref={noticeRef}
          className={`admin-menu__notice ${
            notice.type === 'success'
              ? 'admin-menu__notice--success'
              : 'admin-menu__notice--error'
          }`}
        >
          {notice.message}
        </p>
      )}

      <section className="admin-menu__panel">
        <h2>Create menu item</h2>
        <form className="admin-menu__form" onSubmit={handleCreate}>
          <label className="admin-menu__label">
            Name
            <input
              className="admin-menu__input"
              name="name"
              value={form.name}
              onChange={updateForm(setForm)}
              required
            />
          </label>
          <label className="admin-menu__label">
            Description
            <textarea
              className="admin-menu__input admin-menu__input--area"
              name="description"
              value={form.description}
              onChange={updateForm(setForm)}
              rows={3}
            />
          </label>
          <div className="admin-menu__row">
            <label className="admin-menu__label">
              Price
              <input
                className="admin-menu__input"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={updateForm(setForm)}
                required
              />
            </label>
            <label className="admin-menu__label">
              Category
              <select
                className="admin-menu__select"
                name="categoryId"
                value={form.categoryId}
                onChange={updateForm(setForm)}
                required
              >
                {categories.map((category) => (
                  <option key={category._id || category.id} value={category._id || category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label className="admin-menu__checkbox">
            <input
              type="checkbox"
              name="available"
              checked={form.available}
              onChange={updateForm(setForm)}
            />
            Available for ordering
          </label>
          <button className="admin-menu__primary" type="submit">
            Create item
          </button>
        </form>
      </section>

      {editId && (
        <section ref={editSectionRef} className="admin-menu__panel">
          <h2>Edit menu item</h2>
          <form className="admin-menu__form" onSubmit={handleUpdate}>
            <label className="admin-menu__label">
              Name
              <input
                className="admin-menu__input"
                name="name"
                value={editForm.name}
                onChange={updateForm(setEditForm)}
                required
              />
            </label>
            <label className="admin-menu__label">
              Description
              <textarea
                className="admin-menu__input admin-menu__input--area"
                name="description"
                value={editForm.description}
                onChange={updateForm(setEditForm)}
                rows={3}
              />
            </label>
            <div className="admin-menu__row">
              <label className="admin-menu__label">
                Price
                <input
                  className="admin-menu__input"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={editForm.price}
                  onChange={updateForm(setEditForm)}
                  required
                />
              </label>
              <label className="admin-menu__label">
                Category
                <select
                  className="admin-menu__select"
                  name="categoryId"
                  value={editForm.categoryId}
                  onChange={updateForm(setEditForm)}
                  required
                >
                  {categories.map((category) => (
                    <option key={category._id || category.id} value={category._id || category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <label className="admin-menu__checkbox">
              <input
                type="checkbox"
                name="available"
                checked={editForm.available}
                onChange={updateForm(setEditForm)}
              />
              Available for ordering
            </label>
            <div className="admin-menu__actions">
              <button className="admin-menu__primary" type="submit">
                Save changes
              </button>
              <button className="action-button" type="button" onClick={cancelEdit}>
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="admin-menu__panel">
        <h2>Existing items</h2>
        {items.length === 0 && !loading ? (
          <p className="description">No menu items available.</p>
        ) : (
          <div className="admin-menu__list">
            {items.map((item) => (
              <article key={item._id} className="admin-menu__card">
                <div>
                  <h3>{item.name}</h3>
                  <p className="admin-menu__meta">
                    {categoryById.get(item.categoryId) || 'Unassigned category'}
                  </p>
                  <p className="admin-menu__meta">
                    Price: {Number(item.price).toFixed(2)}
                  </p>
                  {item.description && <p className="description">{item.description}</p>}
                </div>
                <div className="admin-menu__card-actions">
                  <button
                    className="action-button"
                    type="button"
                    onClick={() => startEdit(item)}
                  >
                    Edit
                  </button>
                  <button
                    className="action-button admin-menu__danger"
                    type="button"
                    onClick={() => handleDelete(item._id)}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

export default ManagerMenu
