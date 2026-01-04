import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import api from '../api/axios.js'
import { socket } from '../utils/socket.js'

function Orders({ onBackHome, auth }) {
  const userId = auth?.userId || ''
  const [activeTab, setActiveTab] = useState('new')
  const [orders, setOrders] = useState([])
  const [ordersError, setOrdersError] = useState('')
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [menuItems, setMenuItems] = useState([])
  const [categories, setCategories] = useState([])
  const [menuError, setMenuError] = useState('')
  const [menuLoading, setMenuLoading] = useState(false)
  const [quantities, setQuantities] = useState({})
  const [orderStatus, setOrderStatus] = useState(null)
  const noticeRef = useRef(null)
  const historyTopRef = useRef(null)

  useEffect(() => {
    const loadMenuItems = async () => {
      setMenuLoading(true)
      setMenuError('')
      try {
        const [menuResult, categoriesResult] = await Promise.allSettled([
          api.get('/api/menuitems'),
          api.get('/api/categories'),
        ])
        if (menuResult.status === 'fulfilled') {
          const data = Array.isArray(menuResult.value.data) ? menuResult.value.data : []
          setMenuItems(data)
        } else {
          setMenuItems([])
          setMenuError('Unable to load menu items right now.')
        }

        if (categoriesResult.status === 'fulfilled') {
          const categoryData = Array.isArray(categoriesResult.value.data)
            ? categoriesResult.value.data
            : []
          setCategories(categoryData)
        } else {
          setCategories([])
        }
      } catch (err) {
        console.error('Menu load failed', err)
        setMenuItems([])
        setCategories([])
        setMenuError('Unable to load menu items right now.')
      } finally {
        setMenuLoading(false)
      }
    }

    loadMenuItems()
  }, [auth?.userId])

  const fetchOrders = useCallback(async () => {
    if (!userId.trim()) {
      setOrdersError('Please login to view orders.')
      return
    }
    setOrdersLoading(true)
    setOrdersError('')
    try {
      const response = await api.get(`/api/orders/user/${userId.trim()}`)
      const data = Array.isArray(response.data?.orders) ? response.data.orders : []
      setOrders(data)
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        'Unable to load orders right now.'
      setOrdersError(message)
    } finally {
      setOrdersLoading(false)
    }
  }, [userId])

  useEffect(() => {
    if (!auth?.token) {
      return
    }
    if (!socket.connected) {
      socket.connect()
    }

    const handleStatusUpdate = (payload) => {
      if (!payload?.orderId) {
        return
      }
      setOrders((prev) =>
        prev.map((order) =>
          order._id === payload.orderId
            ? { ...order, status: payload.status, updatedAt: payload.updatedAt }
            : order
        )
      )
      fetchOrders()
    }

    socket.on('orderStatusUpdated', handleStatusUpdate)

    return () => {
      socket.off('orderStatusUpdated', handleStatusUpdate)
      if (socket.connected) {
        socket.disconnect()
      }
    }
  }, [auth?.token, fetchOrders])

  useEffect(() => {
    if (auth?.token && activeTab === 'history') {
      fetchOrders()
      historyTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [auth?.token, activeTab, fetchOrders])

  useEffect(() => {
    if (auth?.token) {
      fetchOrders()
    }
  }, [auth?.token, fetchOrders])


  const parsedQuantities = useMemo(() => {
    const entries = Object.entries(quantities).map(([id, value]) => [
      id,
      Number.isNaN(Number(value)) ? 0 : Math.max(0, Number(value)),
    ])
    return Object.fromEntries(entries)
  }, [quantities])

  const selectedItems = useMemo(() => {
    return menuItems
      .filter((item) => parsedQuantities[item._id] > 0)
      .map((item) => ({
        menuItemId: item._id,
        quantity: parsedQuantities[item._id],
        price: item.price,
        name: item.name,
      }))
  }, [menuItems, parsedQuantities])

  const groupedMenuItems = useMemo(() => {
    const categoryNameById = new Map()
    const itemsByCategoryId = new Map()
    const uncategorized = []
    const seenCategoryIds = new Set()

    categories.forEach((category) => {
      const id = category._id || category.id
      if (!id) return
      seenCategoryIds.add(id)
      categoryNameById.set(id, category.name || 'Category')
    })

    menuItems.forEach((item) => {
      const rawCategory = item.categoryId
      const categoryId = typeof rawCategory === 'string' ? rawCategory : rawCategory?._id
      const categoryName =
        typeof rawCategory === 'object' && rawCategory?.name
          ? rawCategory.name
          : null

      if (!categoryId) {
        uncategorized.push(item)
        return
      }

      if (!itemsByCategoryId.has(categoryId)) {
        itemsByCategoryId.set(categoryId, [])
      }
      itemsByCategoryId.get(categoryId).push(item)

      if (categoryName && !categoryNameById.has(categoryId)) {
        categoryNameById.set(categoryId, categoryName)
      }
    })

    const orderedCategories = categories
      .map((category) => ({
        id: category._id || category.id,
        name: category.name || 'Category',
      }))
      .filter((category) => category.id)

    const grouped = []

    orderedCategories.forEach((category) => {
      const items = itemsByCategoryId.get(category.id) || []
      if (items.length > 0) {
        grouped.push({ id: category.id, name: category.name, items })
      }
    })

    Array.from(itemsByCategoryId.keys()).forEach((categoryId) => {
      if (!seenCategoryIds.has(categoryId)) {
        const name = categoryNameById.get(categoryId) || 'Other'
        grouped.push({ id: categoryId, name, items: itemsByCategoryId.get(categoryId) })
      }
    })

    if (uncategorized.length > 0) {
      grouped.push({ id: 'uncategorized', name: 'Uncategorized', items: uncategorized })
    }

    return grouped
  }, [categories, menuItems])

  const orderTotal = selectedItems.reduce(
    (total, item) => total + item.quantity * item.price,
    0
  )

  const handleQuantityChange = (itemId, value) => {
    setQuantities((prev) => ({
      ...prev,
      [itemId]: value,
    }))
    setOrderStatus(null)
  }

  const handleCreateOrder = async () => {
    if (!userId.trim()) {
      setOrderStatus({ type: 'error', message: 'Please login to place an order.' })
      noticeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }
    if (selectedItems.length === 0) {
      setOrderStatus({ type: 'error', message: 'Select at least one item.' })
      noticeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }

    try {
      const payload = {
        userId: userId.trim(),
        items: selectedItems.map(({ menuItemId, quantity, price }) => ({
          menuItemId,
          quantity,
          price,
        })),
      }
      await api.post('/api/orders', payload)
      setOrderStatus({ type: 'success', message: 'Order created successfully.' })
      setQuantities({})
      await fetchOrders()
      setActiveTab('history')
      noticeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'Unable to place order right now.'
      setOrderStatus({ type: 'error', message })
      noticeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <main className="orders">
      <header className="orders__header">
        <div>
          <p className="eyebrow">Orders</p>
          <h1>Track your orders</h1>
          <p className="description">
            View previous orders and create a new one from the latest menu items.
          </p>
        </div>
        <button className="login__back" type="button" onClick={onBackHome}>
          ← Back to home
        </button>
      </header>

      <section className="orders__panel">
        <div className="orders__toolbar">
          <div className="orders__tabs">
            <button
              className={`orders__tab ${activeTab === 'history' ? 'orders__tab--active' : ''}`}
              type="button"
              onClick={() => setActiveTab('history')}
            >
              Past orders
            </button>
            <button
              className={`orders__tab ${activeTab === 'new' ? 'orders__tab--active' : ''}`}
              type="button"
              onClick={() => setActiveTab('new')}
            >
              New order
            </button>
          </div>
        </div>

        {activeTab === 'history' && (
          <div className="orders__section" ref={historyTopRef}>
            <div className="orders__actions">
              {orderStatus?.type === 'success' && (
                <div className={`orders__notice orders__notice--${orderStatus.type}`}>
                  {orderStatus.message}
                </div>
              )}
              {ordersLoading && <p className="orders__helper">Loading orders...</p>}
              {ordersError && <p className="orders__helper">{ordersError}</p>}
            </div>

            {orders.length === 0 && !ordersLoading && !ordersError && (
              <p className="orders__helper">No orders found yet.</p>
            )}

            <div className="orders__cards">
              {orders.map((order) => (
                <article className="orders__card" key={order._id}>
                  <header className="orders__card-header">
                    <div>
                      <h2>Order {order._id.slice(-6).toUpperCase()}</h2>
                      <p className="orders__meta">
                        {order.status} • {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </header>
                  <div className="orders__items">
                    {order.items?.length ? (
                      order.items.map((item) => (
                        <div className="orders__item" key={item._id}>
                          <span>{item.menuItemId?.name || 'Item'}</span>
                          <span>
                            {item.quantity} x £{Number(item.price).toFixed(2)}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="orders__helper">No items found on this order.</p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'new' && (
          <div className="orders__section">
            <div className="orders__actions" ref={noticeRef}>
              {orderStatus && (
                <div className={`orders__notice orders__notice--${orderStatus.type}`}>
                  {orderStatus.message}
                </div>
              )}
              {menuError && <p className="orders__helper">{menuError}</p>}
            </div>

            <div className="orders__menu">
              {menuLoading && <p className="orders__helper">Loading menu...</p>}
              {!menuLoading && menuItems.length === 0 && (
                <p className="orders__helper">No menu items available.</p>
              )}
              {!menuLoading && menuItems.length > 0 && (
                <div className="orders__menu-list">
                  {groupedMenuItems.map((group) => (
                    <section className="orders__menu-category" key={group.id}>
                      <h3 className="orders__menu-heading">{group.name}</h3>
                      <div className="orders__menu-grid">
                        {group.items.map((item) => (
                          <article className="orders__menu-card" key={item._id}>
                            <div>
                              <h3>{item.name}</h3>
                              <p className="orders__meta">£{Number(item.price).toFixed(2)}</p>
                              {item.description && (
                                <p className="orders__helper">{item.description}</p>
                              )}
                            </div>
                            <label className="orders__qty">
                              Qty
                              <input
                                className="orders__input"
                                type="number"
                                min="0"
                                step="1"
                                value={parsedQuantities[item._id] ?? 0}
                                onChange={(event) =>
                                  handleQuantityChange(item._id, event.target.value)
                                }
                              />
                            </label>
                          </article>
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              )}
            </div>

            <div className="orders__summary">
              <span>Total: £{orderTotal.toFixed(2)}</span>
              <button className="orders__primary" type="button" onClick={handleCreateOrder}>
                Place order
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  )
}

export default Orders
