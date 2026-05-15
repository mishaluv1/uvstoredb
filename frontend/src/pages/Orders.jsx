import React, { useState, useEffect } from 'react'
import { useShop } from '../context/ShopContext'
import { Link, useNavigate } from 'react-router-dom'

const Orders = () => {
  const { currency, token, API_URL } = useShop()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedOrder, setExpandedOrder] = useState(null)

  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }
    fetchOrders()
  }, [token, navigate])

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_URL}/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setOrders(data)
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status) => {
    const styles = {
      'Delivered': 'badge-success',
      'Shipped': 'bg-blue-100 text-blue-700',
      'Processing': 'badge-warning',
      'Cancelled': 'badge-danger',
    }
    return styles[status] || 'bg-surface-100 text-surface-600'
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Delivered':
        return (
          <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
          </svg>
        )
      case 'Shipped':
        return (
          <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 10V3L4 14h7v7l9-11h-7z' />
          </svg>
        )
      case 'Processing':
        return (
          <svg className='w-4 h-4 animate-spin-slow' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' />
          </svg>
        )
      case 'Cancelled':
        return (
          <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
          </svg>
        )
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-[60vh]'>
        <div className='text-center'>
          <div className='w-12 h-12 mx-auto mb-4 rounded-full border-4 border-primary-200 border-t-primary-600 animate-spin' />
          <p className='text-surface-500'>Loading orders...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='page-enter max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <div className='text-center mb-10'>
        <h1 className='section-title'>
          My <span className='text-gradient'>Orders</span>
        </h1>
        <p className='section-subtitle'>
          Track and manage your orders
        </p>
      </div>

      {orders.length === 0 ? (
        <div className='text-center py-20'>
          <div className='w-24 h-24 mx-auto mb-6 rounded-full bg-surface-100 flex items-center justify-center'>
            <svg className='w-12 h-12 text-surface-300' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' />
            </svg>
          </div>
          <h2 className='text-2xl font-extrabold text-surface-900 mb-2'>No orders yet</h2>
          <p className='text-surface-500 mb-8'>Start shopping and place your first order!</p>
          <Link to='/collection' className='btn-primary inline-flex items-center gap-2'>
            Start Shopping
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 8l4 4m0 0l-4 4m4-4H3' />
            </svg>
          </Link>
        </div>
      ) : (
        <div className='space-y-4'>
          {orders.map((order, i) => (
            <div
              key={order._id}
              className='glass rounded-2xl overflow-hidden animate-fade-up'
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {/* Order Header */}
              <div className='p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
                <div className='flex items-center gap-4'>
                  <div className='w-12 h-12 rounded-xl bg-surface-100 flex items-center justify-center'>
                    <svg className='w-6 h-6 text-surface-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' />
                    </svg>
                  </div>
                  <div>
                    <p className='text-xs text-surface-400'>
                      Order #{order._id?.slice(-8).toUpperCase()}
                    </p>
                    <p className='text-sm text-surface-500'>
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>

                <div className='flex items-center gap-4 sm:gap-8'>
                  <div className='text-right'>
                    <p className='text-xs text-surface-400'>Total</p>
                    <p className='font-extrabold text-primary-600'>{currency}{order.total}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusBadge(order.status)}`}>
                    {getStatusIcon(order.status)}
                    {order.status}
                  </span>
                  <button
                    onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                    className='w-9 h-9 flex items-center justify-center rounded-lg text-surface-400 hover:text-surface-900 hover:bg-surface-100 transition-all'
                  >
                    <svg
                      className={`w-5 h-5 transition-transform duration-300 ${expandedOrder === order._id ? 'rotate-180' : ''}`}
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedOrder === order._id && (
                <div className='border-t border-surface-200 p-4 sm:p-6 bg-surface-50/50 animate-fade-down'>
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                    {/* Items */}
                    <div>
                      <h4 className='text-sm font-semibold text-surface-900 mb-3'>Items</h4>
                      <div className='space-y-3'>
                        {order.items?.map((item, idx) => (
                          <div key={idx} className='flex items-center gap-3'>
                            {item.image && (
                              <img className='w-12 h-16 object-cover rounded-lg aspect-[5/7]' src={item.image} alt={item.name} />
                            )}
                            <div className='min-w-0'>
                              <p className='text-sm font-medium text-surface-900 truncate'>{item.name}</p>
                              <p className='text-xs text-surface-400'>
                                {item.size} × {item.quantity} | {currency}{item.price}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div>
                      <h4 className='text-sm font-semibold text-surface-900 mb-3'>Shipping Address</h4>
                      {order.shippingAddress ? (
                        <div className='text-sm text-surface-500 space-y-0.5'>
                          <p className='font-medium text-surface-700'>
                            {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                          </p>
                          <p>{order.shippingAddress.street}</p>
                          <p>
                            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipcode}
                          </p>
                          <p>{order.shippingAddress.country}</p>
                          <p className='mt-1 text-surface-700'>{order.shippingAddress.phone}</p>
                        </div>
                      ) : (
                        <p className='text-sm text-surface-400'>No address provided</p>
                      )}
                    </div>

                    {/* Price Breakdown */}
                    <div>
                      <h4 className='text-sm font-semibold text-surface-900 mb-3'>Price Breakdown</h4>
                      <div className='text-sm space-y-1.5'>
                        <div className='flex justify-between'>
                          <span className='text-surface-400'>Subtotal</span>
                          <span className='text-surface-700'>{currency}{order.subtotal}</span>
                        </div>
                        <div className='flex justify-between'>
                          <span className='text-surface-400'>Delivery</span>
                          <span className='text-surface-700'>
                            {order.deliveryFee === 0 ? 'Free' : `${currency}${order.deliveryFee}`}
                          </span>
                        </div>
                        <hr className='border-surface-200' />
                        <div className='flex justify-between font-bold'>
                          <span className='text-surface-900'>Total</span>
                          <span className='text-primary-600'>{currency}{order.total}</span>
                        </div>
                      </div>
                      <div className='mt-3'>
                        <p className='text-xs text-surface-400'>Payment Method</p>
                        <p className='text-sm font-medium text-surface-700 capitalize'>{order.paymentMethod}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Orders