import React, { useState } from 'react'
import { useShop } from '../context/ShopContext'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const PlaceOrder = () => {
  const {
    products,
    currency,
    cartItems,
    getCartAmount,
    delivery_fee,
    setCartItems,
    token,
    placeOrder
  } = useShop()
  const [method, setMethod] = useState('cod')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: '',
  })

  const onChangeHandler = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const cartData = []
  for (const itemId in cartItems) {
    for (const size in cartItems[itemId]) {
      const product = products.find((p) => p._id === itemId)
      if (product) {
        cartData.push({
          product: itemId,
          name: product.name,
          price: product.price,
          image: product.image?.[0] || '',
          size,
          quantity: cartItems[itemId][size],
        })
      }
    }
  }

  const subtotal = getCartAmount()
  const total = subtotal + delivery_fee

  const onSubmitHandler = async (e) => {
    e.preventDefault()

    if (cartData.length === 0) {
      toast.error('Your cart is empty')
      return
    }

    if (!token) {
      toast.error('Please login to place an order')
      navigate('/login')
      return
    }

    setSubmitting(true)

    const orderData = {
      items: cartData,
      shippingAddress: formData,
      paymentMethod: method,
      subtotal,
      deliveryFee: delivery_fee,
      total
    }

    const result = await placeOrder(orderData)
    setSubmitting(false)

    if (result) {
      toast.success('Order placed successfully!')
      setCartItems({})
      navigate('/orders')
    }
  }

  const paymentMethods = [
    {
      id: 'stripe',
      name: 'Stripe',
      icon: assets.stripe_logo,
      desc: 'Pay with credit/debit card',
    },
    {
      id: 'razorpay',
      name: 'Razorpay',
      icon: assets.razorpay_logo,
      desc: 'Pay with UPI, cards, netbanking',
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      icon: null,
      desc: 'Pay when you receive',
    },
  ]

  if (cartData.length === 0) {
    return (
      <div className='page-enter max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='text-center py-20'>
          <div className='w-24 h-24 mx-auto mb-6 rounded-full bg-surface-100 flex items-center justify-center'>
            <svg className='w-12 h-12 text-surface-300' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' />
            </svg>
          </div>
          <h2 className='text-2xl font-extrabold text-surface-900 mb-2'>Your cart is empty</h2>
          <p className='text-surface-500'>Add items before placing an order.</p>
        </div>
      </div>
    )
  }

  return (
    <div className='page-enter max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <div className='text-center mb-10'>
        <h1 className='section-title'>
          Place <span className='text-gradient'>Order</span>
        </h1>
        <p className='section-subtitle'>
          Complete your purchase by filling in the details below
        </p>
      </div>

      <form onSubmit={onSubmitHandler}>
        <div className='flex flex-col lg:flex-row gap-8'>
          {/* Left - Delivery Info */}
          <div className='flex-1'>
            <div className='glass rounded-3xl p-6 sm:p-8'>
              <div className='flex items-center gap-3 mb-8'>
                <div className='w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center'>
                  <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' />
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
                  </svg>
                </div>
                <div>
                  <h2 className='text-lg font-bold text-surface-900'>Delivery Information</h2>
                  <p className='text-sm text-surface-400'>Where should we ship your order?</p>
                </div>
              </div>

              <div className='space-y-4'>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-semibold text-surface-700 mb-1.5'>First Name</label>
                    <input
                      required
                      onChange={onChangeHandler}
                      name='firstName'
                      value={formData.firstName}
                      className='input-modern'
                      type='text'
                      placeholder='John'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-semibold text-surface-700 mb-1.5'>Last Name</label>
                    <input
                      required
                      onChange={onChangeHandler}
                      name='lastName'
                      value={formData.lastName}
                      className='input-modern'
                      type='text'
                      placeholder='Doe'
                    />
                  </div>
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-semibold text-surface-700 mb-1.5'>Email</label>
                    <input
                      required
                      onChange={onChangeHandler}
                      name='email'
                      value={formData.email}
                      className='input-modern'
                      type='email'
                      placeholder='john@example.com'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-semibold text-surface-700 mb-1.5'>Phone</label>
                    <input
                      required
                      onChange={onChangeHandler}
                      name='phone'
                      value={formData.phone}
                      className='input-modern'
                      type='text'
                      placeholder='(415) 555-0132'
                    />
                  </div>
                </div>

                <div>
                  <label className='block text-sm font-semibold text-surface-700 mb-1.5'>Street Address</label>
                  <input
                    required
                    onChange={onChangeHandler}
                    name='street'
                    value={formData.street}
                    className='input-modern'
                    type='text'
                    placeholder='123 Main Street, Apt 4B'
                  />
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-semibold text-surface-700 mb-1.5'>City</label>
                    <input
                      required
                      onChange={onChangeHandler}
                      name='city'
                      value={formData.city}
                      className='input-modern'
                      type='text'
                      placeholder='New York'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-semibold text-surface-700 mb-1.5'>State</label>
                    <input
                      required
                      onChange={onChangeHandler}
                      name='state'
                      value={formData.state}
                      className='input-modern'
                      type='text'
                      placeholder='NY'
                    />
                  </div>
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-semibold text-surface-700 mb-1.5'>Zip Code</label>
                    <input
                      required
                      onChange={onChangeHandler}
                      name='zipcode'
                      value={formData.zipcode}
                      className='input-modern'
                      type='text'
                      placeholder='10001'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-semibold text-surface-700 mb-1.5'>Country</label>
                    <input
                      required
                      onChange={onChangeHandler}
                      name='country'
                      value={formData.country}
                      className='input-modern'
                      type='text'
                      placeholder='United States'
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Order Summary & Payment */}
          <div className='lg:w-96 space-y-6'>
            {/* Order Summary */}
            <div className='glass rounded-3xl p-6'>
              <div className='flex items-center gap-3 mb-6'>
                <div className='w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center'>
                  <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' />
                  </svg>
                </div>
                <h2 className='text-lg font-bold text-surface-900'>Order Summary</h2>
              </div>

              <div className='space-y-3 text-sm mb-6'>
                {cartData.map((item, i) => (
                  <div key={i} className='flex items-center gap-3'>
                    <img
                      className='w-12 h-16 object-cover rounded-lg aspect-[5/7]'
                      src={item.image}
                      alt={item.name}
                    />
                    <div className='flex-1 min-w-0'>
                      <p className='font-medium text-surface-900 truncate'>{item.name}</p>
                      <p className='text-surface-400 text-xs'>
                        {item.size} × {item.quantity}
                      </p>
                    </div>
                    <p className='font-semibold text-surface-900'>
                      {currency}{item.price * item.quantity}
                    </p>
                  </div>
                ))}
              </div>

              <div className='space-y-2 text-sm border-t border-surface-200 pt-4'>
                <div className='flex justify-between'>
                  <span className='text-surface-500'>Subtotal</span>
                  <span className='font-semibold text-surface-900'>{currency}{subtotal}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-surface-500'>Delivery Fee</span>
                  <span className='font-semibold text-surface-900'>
                    {delivery_fee === 0 ? (
                      <span className='text-emerald-600'>Free</span>
                    ) : (
                      `${currency}${delivery_fee}`
                    )}
                  </span>
                </div>
                <hr className='border-surface-200' />
                <div className='flex justify-between text-base'>
                  <span className='font-bold text-surface-900'>Total</span>
                  <span className='font-extrabold text-primary-600'>{currency}{total}</span>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className='glass rounded-3xl p-6'>
              <div className='flex items-center gap-3 mb-6'>
                <div className='w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center'>
                  <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' />
                  </svg>
                </div>
                <h2 className='text-lg font-bold text-surface-900'>Payment Method</h2>
              </div>

              <div className='space-y-3'>
                {paymentMethods.map((pm) => (
                  <button
                    key={pm.id}
                    type='button'
                    onClick={() => setMethod(pm.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-300 ${method === pm.id
                      ? 'border-primary-500 bg-primary-50 shadow-lg shadow-primary-500/10'
                      : 'border-surface-200 hover:border-surface-300'
                      }`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${method === pm.id ? 'border-primary-500' : 'border-surface-300'
                      }`}>
                      {method === pm.id && (
                        <div className='w-2.5 h-2.5 rounded-full bg-primary-500' />
                      )}
                    </div>
                    {pm.icon ? (
                      <img className='h-7' src={pm.icon} alt={pm.name} />
                    ) : (
                      <div className='h-7 flex items-center'>
                        <span className='text-sm font-semibold text-surface-700'>{pm.name}</span>
                      </div>
                    )}
                    <span className='text-xs text-surface-400 ml-auto hidden sm:block'>{pm.desc}</span>
                  </button>
                ))}
              </div>

              <button
                type='submit'
                disabled={submitting}
                className='btn-primary w-full mt-6 flex items-center justify-center gap-2'
              >
                {submitting ? (
                  <>
                    <div className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                    Placing Order...
                  </>
                ) : (
                  <>
                    Place Order
                    <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default PlaceOrder