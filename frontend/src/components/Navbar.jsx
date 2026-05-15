import React, { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useShop } from '../context/ShopContext'
import { assets } from '../assets/assets'

const Navbar = () => {
  const { user, logout, getCartCount } = useShop()
  const navigate = useNavigate()
  const [visible, setVisible] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/collection', label: 'Collection' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ]

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
          ? 'glass shadow-glass py-2'
          : 'bg-transparent py-4'
          }`}
      >
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between'>
            {/* Logo */}
            <Link
              to='/'
              className='flex items-center gap-2 group'
              onClick={() => setMobileOpen(false)}
            >
              <img
                src={assets.logo}
                alt='UV Store'
                className='h-14 w-auto object-contain group-hover:scale-105 transition-all duration-300'
              />
            </Link>

            {/* Desktop Nav Links */}
            <div className='hidden md:flex items-center gap-1'>
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${isActive
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-surface-600 hover:text-surface-900 hover:bg-surface-100'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>

            {/* Right Side Icons */}
            <div className='flex items-center gap-2'>
              {/* Profile Dropdown */}
              <div className='relative hidden sm:block'>
                <button
                  onClick={() => setVisible(!visible)}
                  className='w-10 h-10 flex items-center justify-center rounded-xl text-surface-500 hover:text-surface-900 hover:bg-surface-100 transition-all duration-300'
                >
                  <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
                  </svg>
                </button>

                {visible && (
                  <div className='absolute right-0 mt-2 w-56 glass rounded-2xl shadow-glass-lg overflow-hidden animate-scale-in'>
                    <div className='p-2'>
                      {user ? (
                        <>
                          <div className='px-4 py-3 border-b border-surface-200'>
                            <p className='text-sm font-semibold text-surface-900'>{user.name}</p>
                            <p className='text-xs text-surface-500 truncate'>{user.email}</p>
                          </div>
                          <Link
                            to='/profile'
                            onClick={() => setVisible(false)}
                            className='flex items-center gap-3 px-4 py-2.5 text-sm text-surface-600 hover:text-surface-900 hover:bg-surface-100 rounded-lg transition-all'
                          >
                            <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' />
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
                            </svg>
                            Profile Settings
                          </Link>
                          <Link
                            to='/orders'
                            onClick={() => setVisible(false)}
                            className='flex items-center gap-3 px-4 py-2.5 text-sm text-surface-600 hover:text-surface-900 hover:bg-surface-100 rounded-lg transition-all'
                          >
                            <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' />
                            </svg>
                            My Orders
                          </Link>
                          {user.role === 'admin' && (
                            <Link
                              to='/admin'
                              onClick={() => setVisible(false)}
                              className='flex items-center gap-3 px-4 py-2.5 text-sm text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-all'
                            >
                              <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' />
                              </svg>
                              Admin Dashboard
                            </Link>
                          )}
                          <hr className='my-1 border-surface-200' />
                          <button
                            onClick={() => { handleLogout(); setVisible(false) }}
                            className='flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all'
                          >
                            <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1' />
                            </svg>
                            Sign Out
                          </button>
                        </>
                      ) : (
                        <Link
                          to='/login'
                          onClick={() => setVisible(false)}
                          className='flex items-center gap-3 px-4 py-2.5 text-sm text-surface-600 hover:text-surface-900 hover:bg-surface-100 rounded-lg transition-all'
                        >
                          <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1' />
                          </svg>
                          Sign In
                        </Link>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Cart */}
              <Link
                to='/cart'
                className='relative w-10 h-10 flex items-center justify-center rounded-xl text-surface-500 hover:text-surface-900 hover:bg-surface-100 transition-all duration-300'
              >
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' />
                </svg>
                {getCartCount() > 0 && (
                  <span className='absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-button animate-scale-in'>
                    {getCartCount()}
                  </span>
                )}
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className='md:hidden w-10 h-10 flex items-center justify-center rounded-xl text-surface-600 hover:text-surface-900 hover:bg-surface-100 transition-all duration-300'
              >
                {mobileOpen ? (
                  <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                  </svg>
                ) : (
                  <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className='fixed inset-0 z-40 md:hidden'>
          <div
            className='absolute inset-0 bg-black/40 backdrop-blur-sm'
            onClick={() => setMobileOpen(false)}
          />
          <div className='absolute right-0 top-0 bottom-0 w-72 glass shadow-glass-lg animate-slide-in-right'>
            <div className='flex flex-col h-full p-6'>
              <div className='flex items-center justify-between mb-8'>
                <img
                  src={assets.logo}
                  alt='UV Store'
                  className='h-12 w-auto object-contain'
                />
                <button
                  onClick={() => setMobileOpen(false)}
                  className='w-8 h-8 flex items-center justify-center rounded-lg text-surface-400 hover:text-surface-900 hover:bg-surface-100 transition-all'
                >
                  <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                  </svg>
                </button>
              </div>

              <div className='flex flex-col gap-1 flex-1'>
                {navLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${isActive
                        ? 'text-primary-600 bg-primary-50'
                        : 'text-surface-600 hover:text-surface-900 hover:bg-surface-100'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
              </div>

              <div className='border-t border-surface-200 pt-4 mt-auto'>
                {user ? (
                  <>
                    <div className='px-4 py-2 mb-2'>
                      <p className='text-sm font-semibold text-surface-900'>{user.name}</p>
                      <p className='text-xs text-surface-500'>{user.email}</p>
                    </div>
                    <Link
                      to='/profile'
                      onClick={() => setMobileOpen(false)}
                      className='flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-surface-600 hover:text-surface-900 hover:bg-surface-100 transition-all'
                    >
                      <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
                      </svg>
                      Profile
                    </Link>
                    <Link
                      to='/orders'
                      onClick={() => setMobileOpen(false)}
                      className='flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-surface-600 hover:text-surface-900 hover:bg-surface-100 transition-all'
                    >
                      <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' />
                      </svg>
                      Orders
                    </Link>
                    {user.role === 'admin' && (
                      <Link
                        to='/admin'
                        onClick={() => setMobileOpen(false)}
                        className='flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-primary-600 hover:text-primary-700 hover:bg-primary-50 transition-all'
                      >
                        <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' />
                        </svg>
                        Admin
                      </Link>
                    )}
                    <button
                      onClick={() => { handleLogout(); setMobileOpen(false) }}
                      className='flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm text-red-500 hover:text-red-600 hover:bg-red-50 transition-all mt-2'
                    >
                      <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1' />
                      </svg>
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Link
                    to='/login'
                    onClick={() => setMobileOpen(false)}
                    className='flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-surface-600 hover:text-surface-900 hover:bg-surface-100 transition-all'
                  >
                    <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1' />
                    </svg>
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Navbar