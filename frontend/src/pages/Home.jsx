import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useShop } from '../context/ShopContext'
import { assets } from '../assets/assets'

const Home = () => {
  const { products, currency } = useShop()
  const [bestsellers, setBestsellers] = useState([])

  useEffect(() => {
    if (products.length > 0) {
      const filtered = products.filter((p) => p.bestseller).slice(0, 8)
      setBestsellers(filtered)
    }
  }, [products])

  const stats = [
    { value: '50K+', label: 'Happy Customers' },
    { value: '500+', label: 'Products' },
    { value: '24/7', label: 'Support' },
    { value: '99%', label: 'Satisfaction' },
  ]

  const features = [
    {
      icon: (
        <svg className='w-8 h-8' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4' />
        </svg>
      ),
      title: 'Free Shipping',
      desc: 'On orders over $50',
    },
    {
      icon: (
        <svg className='w-8 h-8' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' />
        </svg>
      ),
      title: 'Secure Payment',
      desc: '100% protected checkout',
    },
    {
      icon: (
        <svg className='w-8 h-8' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' />
        </svg>
      ),
      title: 'Easy Returns',
      desc: '30-day free returns',
    },
    {
      icon: (
        <svg className='w-8 h-8' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z' />
        </svg>
      ),
      title: '24/7 Support',
      desc: 'Always here to help',
    },
  ]

  return (
    <div className='page-enter'>
      {/* Hero Section */}
      <section className='relative overflow-hidden bg-surface-50'>
        {/* Background decorations */}
        <div className='absolute inset-0 bg-grid' />
        <div className='absolute top-20 left-10 w-72 h-72 bg-primary-400/10 rounded-full blur-[100px]' />
        <div className='absolute bottom-20 right-10 w-96 h-96 bg-accent-400/10 rounded-full blur-[120px]' />
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-300/5 rounded-full blur-[150px]' />

        <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex flex-col lg:flex-row items-center gap-12 py-16 lg:py-24'>
            {/* Left Content */}
            <div className='flex-1 text-center lg:text-left'>
              <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 text-primary-600 text-sm font-medium mb-6 animate-fade-down'>
                <span className='w-2 h-2 rounded-full bg-primary-500 animate-pulse-soft' />
                New Collection 2026
              </div>
              <h1 className='text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-surface-900 leading-[1.1] mb-6'>
                Elevate Your{' '}
                <span className='text-gradient'>Style</span>
              </h1>
              <p className='text-surface-500 text-lg sm:text-xl max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed'>
                Discover premium fashion that defines your personality. From timeless classics to bold statements — we have it all.
              </p>
              <div className='flex flex-col sm:flex-row gap-4 justify-center lg:justify-start'>
                <Link to='/collection' className='btn-primary text-center'>
                  Shop Now
                  <svg className='w-5 h-5 inline ml-2 -mt-0.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 8l4 4m0 0l-4 4m4-4H3' />
                  </svg>
                </Link>
                <Link to='/about' className='btn-outline text-center'>
                  Learn More
                </Link>
              </div>
            </div>

            {/* Right Image */}
            <div className='flex-1 relative'>
              <div className='relative'>
                <div className='absolute inset-0 bg-gradient-to-br from-primary-400/20 to-accent-400/20 rounded-[3rem] blur-2xl transform rotate-6' />
                <img
                  className='relative w-full max-w-lg mx-auto aspect-square object-cover rounded-[3rem] shadow-glass-lg animate-float'
                  src={assets.hero_img}
                  alt='Hero'
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className='relative -mt-8 pb-8'>
        <div className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='glass rounded-3xl p-8 shadow-glass-lg'>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-8'>
              {stats.map((stat, i) => (
                <div key={i} className='text-center'>
                  <p className='text-3xl sm:text-4xl font-extrabold text-gradient'>{stat.value}</p>
                  <p className='text-surface-500 text-sm mt-1 font-medium'>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bestsellers Section */}
      <section className='py-16 lg:py-24'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-14'>
            <h2 className='section-title'>
              Best <span className='text-gradient'>Sellers</span>
            </h2>
            <p className='section-subtitle'>
              Our most loved pieces, handpicked for you
            </p>
          </div>

          <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6'>
            {bestsellers.map((product, i) => (
              <Link
                key={product._id}
                to={`/product/${product._id}`}
                className='group'
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className='glass rounded-2xl overflow-hidden card-hover animate-fade-up'>
                  <div className='relative overflow-hidden aspect-[5/7] max-h-[400px]'>
                    <img
                      className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out'
                      src={product.image?.[0] || ''}
                      alt={product.name}
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
                    <div className='absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500'>
                      <span className='inline-block bg-white/90 backdrop-blur-sm text-surface-900 text-xs font-semibold px-3 py-1.5 rounded-full'>
                        Quick View
                      </span>
                    </div>
                  </div>
                  <div className='p-4'>
                    <p className='text-sm font-semibold text-surface-900 truncate'>{product.name}</p>
                    <p className='text-primary-600 font-bold mt-1'>
                      {currency}{product.price}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className='text-center mt-12'>
            <Link to='/collection' className='btn-outline inline-flex items-center gap-2'>
              View All Products
              <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 8l4 4m0 0l-4 4m4-4H3' />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className='py-16 lg:py-24 bg-surface-100/50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-14'>
            <h2 className='section-title'>
              Why <span className='text-gradient'>Choose Us</span>
            </h2>
            <p className='section-subtitle'>
              We make your shopping experience exceptional
            </p>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
            {features.map((feature, i) => (
              <div
                key={i}
                className='glass rounded-2xl p-8 text-center card-hover animate-fade-up'
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <div className='w-16 h-16 mx-auto mb-5 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center'>
                  {feature.icon}
                </div>
                <h3 className='text-lg font-semibold text-surface-900 mb-2'>{feature.title}</h3>
                <p className='text-surface-500 text-sm'>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className='py-16 lg:py-24'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <div className='glass rounded-3xl p-10 sm:p-14 shadow-glass-lg relative overflow-hidden'>
            <div className='absolute top-0 right-0 w-40 h-40 bg-primary-400/10 rounded-full blur-[60px]' />
            <div className='absolute bottom-0 left-0 w-40 h-40 bg-accent-400/10 rounded-full blur-[60px]' />
            <div className='relative'>
              <h2 className='text-3xl sm:text-4xl font-extrabold text-surface-900 mb-4'>
                Stay in the <span className='text-gradient'>Loop</span>
              </h2>
              <p className='text-surface-500 mb-8 max-w-md mx-auto'>
                Subscribe to get special offers, free giveaways, and new arrivals straight to your inbox.
              </p>
              <form
                onSubmit={(e) => e.preventDefault()}
                className='flex flex-col sm:flex-row gap-3 max-w-md mx-auto'
              >
                <input
                  type='email'
                  placeholder='Enter your email'
                  className='input-modern flex-1'
                  required
                />
                <button type='submit' className='btn-primary whitespace-nowrap'>
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home