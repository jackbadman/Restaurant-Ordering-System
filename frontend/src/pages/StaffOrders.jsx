import { useCallback, useEffect, useMemo, useState } from 'react'
import api from '../api/axios.js'
import { socket } from '../utils/socket.js'

const STATUS_OPTIONS = ['pending', 'preparing', 'ready', 'completed', 'cancelled']

function StaffOrders({ onBackHome, auth }) {
  const isStaff = auth?.role === 'staff'
  const [statusFilter, setStatusFilter] = useState('all')
  const [orders, setOrders] = useState([])
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [ordersError, setOrdersError] = useState('')
  const [statusEdits, setStatusEdits] = useState({})
  const [updateStatus, setUpdateStatus] = useState(null)
  const [updating, setUpdating] = useState({})

  const fetchOrders = useCallback(async () => {
    if (!isStaff) {
      return
    }
    setOrdersLoading(true)
    setOrdersError('')
    try {
      const params = statusFilter !== 'all' ? { status: statusFilter } : undefined
      const response = await api.get('/api/orders', { params })
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
  }, [isStaff, statusFilter])

  useEffect(() => {
    if (auth?.token && isStaff) {
      fetchOrders()
    }
  }, [auth?.token, fetchOrders, isStaff])

  useEffect(() => {
    setStatusEdits((prev) => {
      const next = { ...prev }
      const validIds = new Set()
      orders.forEach((order) => {
        validIds.add(order._id)
        if (!next[order._id]) {
          next[order._id] = order.status
        }
      })
      Object.keys(next).forEach((key) => {
        if (!validIds.has(key)) {
          delete next[key]
        }
      })
      return next
    })
  }, [orders])

  useEffect(() => {
    if (!isStaff) {
      return
    }
    if (!socket.connected) {
      socket.connect()
    }

    const handleStatusUpdate = (payload) => {
      if (!payload?.orderId) {
        return
      }
      if (statusFilter !== 'all') {
        fetchOrders()
        return
      }
      setOrders((prev) =>
        prev.map((order) =>
          order._id === payload.orderId
            ? { ...order, status: payload.status, updatedAt: payload.updatedAt }
            : order
        )
      )
    }

    const handleOrderCreated = () => {
      fetchOrders()
    }

    socket.on('orderStatusUpdated', handleStatusUpdate)
    socket.on('orderCreated', handleOrderCreated)

    return () => {
      socket.off('orderStatusUpdated', handleStatusUpdate)
      socket.off('orderCreated', handleOrderCreated)
      if (socket.connected) {
        socket.disconnect()
      }
    }
  }, [fetchOrders, isStaff, statusFilter])

  const handleStatusChange = (orderId, value) => {
    setStatusEdits((prev) => ({
      ...prev,
      [orderId]: value,
    }))
    setUpdateStatus(null)
  }

  const handleUpdateStatus = async (orderId) => {
    const nextStatus = statusEdits[orderId]
    if (!nextStatus) {
      return
    }
    setUpdating((prev) => ({ ...prev, [orderId]: true }))
    setUpdateStatus(null)
    try {
      await api.patch(`/api/orders/${orderId}/status`, { status: nextStatus })
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: nextStatus } : order
        )
      )
      setUpdateStatus({ type: 'success', message: 'Order status updated.' })
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        'Unable to update status right now.'
      setUpdateStatus({ type: 'error', message })
    } finally {
      setUpdating((prev) => ({ ...prev, [orderId]: false }))
    }
  }

  const orderCountLabel = useMemo(() => {
    if (ordersLoading) {
      return 'Loading orders...'
    }
    if (!orders.length) {
      return 'No orders match this filter.'
    }
    return `${orders.length} order${orders.length === 1 ? '' : 's'} found`
  }, [orders, ordersLoading])

  if (!auth?.token) {
    return (
      <main className="staff-orders">
        <header className="staff-orders__header">
          <div>
            <p className="eyebrow">Staff</p>
            <h1>Order management</h1>
            <p className="description">Please log in with a staff account.</p>
          </div>
          <button className="login__back" type="button" onClick={onBackHome}>
            ← Back to home
          </button>
        </header>
      </main>
    )
  }

  if (!isStaff) {
    return (
      <main className="staff-orders">
        <header className="staff-orders__header">
          <div>
            <p className="eyebrow">Staff</p>
            <h1>Order management</h1>
            <p className="description">This page is only available to staff users.</p>
          </div>
          <button className="login__back" type="button" onClick={onBackHome}>
            ← Back to home
          </button>
        </header>
      </main>
    )
  }

  return (
    <main className="staff-orders">
      <header className="staff-orders__header">
        <div>
          <p className="eyebrow">Staff</p>
          <h1>Order management</h1>
          <p className="description">
            Filter orders by status and update them as they move through the kitchen.
          </p>
        </div>
        <button className="login__back" type="button" onClick={onBackHome}>
          ← Back to home
        </button>
      </header>

      <section className="staff-orders__panel">
        <div className="staff-orders__toolbar">
          <label className="staff-orders__filter">
            Status
            <select
              className="staff-orders__select"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="all">All</option>
              {STATUS_OPTIONS.map((status) => (
                <option value={status} key={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>
          <button
            className="staff-orders__refresh"
            type="button"
            onClick={fetchOrders}
            disabled={ordersLoading}
          >
            {ordersLoading ? 'Loading...' : 'Refresh'}
          </button>
        </div>

        {updateStatus && (
          <div className={`staff-orders__notice staff-orders__notice--${updateStatus.type}`}>
            {updateStatus.message}
          </div>
        )}
        {ordersError && <p className="staff-orders__helper">{ordersError}</p>}
        {!ordersError && <p className="staff-orders__helper">{orderCountLabel}</p>}

        <div className="staff-orders__grid">
          {orders.map((order) => {
            const currentStatus = statusEdits[order._id] || order.status
            const isDirty = currentStatus !== order.status
            return (
              <article className="staff-orders__card" key={order._id}>
                <header className="staff-orders__card-header">
                  <div>
                    <h2>Order {order._id.slice(-6).toUpperCase()}</h2>
                    <p className="staff-orders__meta">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="staff-orders__customer">
                    <span>{order.userId?.name || 'Unknown customer'}</span>
                    <span className="staff-orders__muted">
                      {order.userId?.email || 'No email'}
                    </span>
                  </div>
                </header>

                <div className="staff-orders__items">
                  {order.items?.length ? (
                    order.items.map((item) => (
                      <div className="staff-orders__item" key={item._id}>
                        <span>{item.menuItemId?.name || 'Item'}</span>
                        <span>
                          {item.quantity} x £{Number(item.price).toFixed(2)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="staff-orders__helper">No items found on this order.</p>
                  )}
                </div>

                <div className="staff-orders__status">
                  <label className="staff-orders__status-control">
                    Update status
                    <select
                      className="staff-orders__select"
                      value={currentStatus}
                      onChange={(event) =>
                        handleStatusChange(order._id, event.target.value)
                      }
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <option value={status} key={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </label>
                  <button
                    className="staff-orders__update"
                    type="button"
                    onClick={() => handleUpdateStatus(order._id)}
                    disabled={!isDirty || updating[order._id]}
                  >
                    {updating[order._id] ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      </section>
    </main>
  )
}

export default StaffOrders
