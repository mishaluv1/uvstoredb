import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useShop } from '../context/ShopContext'
import { toast } from 'react-toastify'

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, getCartAmount, delivery_fee, token } = useShop()
  const navigate = useNavigate()
  const [promoCode, setPromoCode] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)

  const cartData = []
  for (const itemId in cartItems) {
    for (const size in cartItems[itemId]) {
      const product = products.find((p) => p._id === itemId)
      if (product) {
        cartData.push({
          _id: itemId,
          size,
          quantity: cartItems[itemId][size],
          ...product,
        })
      }
    }
  }

  const subtotal = getCartAmount()
  const discount = promoApplied ? Math.round(subtotal * 0.1) : 0
  const total = subtotal - discount + delivery_fee

  const applyPromo = () => {
    if (promoCode.toUpperCase() === 'UVSTORE10') {
      setPromoApplied(true)
      toast.success('Promo code applied! 10% off')
    } else {
      toast.error('Invalid promo code')
    }
  }

  const handleCheckout = () => {
    if (!token) {
      toast.error('Please login to checkout')
      navigate('/login')
      return
    }
    navigate('/place-order')
  }

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
          <p className='text-surface-500 mb-8'>Looks like you haven't added anything yet</p>
          <Link to='/collection' className='btn-primary inline-flex items-center gap-2'>
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 8l4 4m0 0l-4 4m4-4H3' />
            </svg>
            Start Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className='page-enter max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <div className='text-center mb-10'>
        <h1 className='section-title'>
          Shopping <span className='text-gradient'>Cart</span>
        </h1>
        <p className='section-subtitle'>
          {cartData.length} {cartData.length === 1 ? 'item' : 'items'} in your cart
        </p>
      </div>

      <div className='flex flex-col lg:flex-row gap-8'>
        {/* Cart Items */}
        <div className='flex-1 space-y-4'>
          {cartData.map((item, i) => (
            <div
              key={`${item._id}-${item.size}`}
              className='glass rounded-2xl p-4 sm:p-6 flex gap-4 sm:gap-6 animate-fade-up'
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <Link to={`/product/${item._id}`} className='flex-shrink-0'>
                <img
                  className='w-24 h-32 sm:w-28 sm:h-36 object-cover rounded-xl aspect-[5/7]'
                  src={item.image?.[0] || ''}
                  alt={item.name}
                />
              </Link>

              <div className='flex-1 flex flex-col justify-between'>
                <div>
                  <Link to={`/product/${item._id}`}>
                    <h3 className='font-semibold text-surface-900 hover:text-primary-600 transition-colors'>
                      {item.name}
                    </h3>
                  </Link>
                  <div className='flex items-center gap-3 mt-1'>
                    <span className='text-sm text-surface-500'>Size: <b className='text-surface-700'>{item.size}</b></span>
                    <span className='text-surface-300'>|</span>
                    <span className='text-primary-600 font-bold'>{currency}{item.price}</span>
                  </div>
                </div>

                <div className='flex items-center justify-between mt-3'>
                  <div className='flex items-center gap-1 bg-surface-100 rounded-xl p-1'>
                    <button
                      onClick={() => updateQuantity(item._id, item.size, Math.max(1, item.quantity - 1))}
                      className='w-8 h-8 flex items-center justify-center rounded-lg text-surface-500 hover:text-surface-900 hover:bg-white transition-all'
                    >
                      <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M20 12H4' />
                      </svg>
                    </button>
                    <span className='w-10 text-center text-sm font-semibold text-surface-900'>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item._id, item.size, item.quantity + 1)}
                      className='w-8 h-8 flex items-center justify-center rounded-lg text-surface-500 hover:text-surface-900 hover:bg-white transition-all'
                    >
                      <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
                      </svg>
                    </button>
                  </div>

                  <button
                    onClick={() => updateQuantity(item._id, item.size, 0)}
                    className='w-9 h-9 flex items-center justify-center rounded-lg text-surface-400 hover:text-red-500 hover:bg-red-50 transition-all'
                  >
                    <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Cart Summary */}
        <div className='lg:w-96'>
          <div className='glass rounded-2xl p-6 sticky top-24'>
            <h3 className='text-lg font-bold text-surface-900 mb-6'>Order Summary</h3>

            {/* Promo Code */}
            <div className='mb-6'>
              <p className='text-sm font-semibold text-surface-700 mb-2'>Promo Code</p>
              <div className='flex gap-2'>
                <input
                  type='text'
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder='Enter code'
                  className='flex-1 px-4 py-2.5 bg-surface-50 border-2 border-surface-200 rounded-xl text-sm outline-none focus:border-primary-500 transition-all'
                  disabled={promoApplied}
                />
                <button
                  onClick={applyPromo}
                  disabled={promoApplied}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${promoApplied
                    ? 'bg-emerald-50 text-emerald-600 border-2 border-emerald-200'
                    : 'bg-surface-900 text-white hover:bg-surface-800'
                    }`}
                >
                  {promoApplied ? 'Applied' : 'Apply'}
                </button>
              </div>
              {promoApplied && (
                <p className='text-xs text-emerald-600 mt-1'>10% discount applied!</p>
              )}
            </div>

            <div className='space-y-3 text-sm'>
              <div className='flex justify-between'>
                <span className='text-surface-500'>Subtotal</span>
                <span className='font-semibold text-surface-900'>{currency}{subtotal}</span>
              </div>
              {promoApplied && (
                <div className='flex justify-between text-emerald-600'>
                  <span>Discount (10%)</span>
                  <span>-{currency}{discount}</span>
                </div>
              )}
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

            <button
              onClick={handleCheckout}
              className='btn-primary w-full mt-6 flex items-center justify-center gap-2'
            >
              Proceed to Checkout
              <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 8l4 4m0 0l-4 4m4-4H3' />
              </svg>
            </button>

            <Link
              to='/collection'
              className='flex items-center justify-center gap-2 mt-4 text-sm text-surface-500 hover:text-primary-600 transition-colors'
            >
              <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M7 16l-4-4m0 0l4-4m-4 4h18' />
              </svg>
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart