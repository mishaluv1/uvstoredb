import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useShop } from '../context/ShopContext'

const Login = () => {
  const { login, register } = useShop()
  const navigate = useNavigate()
  const [currState, setCurrState] = useState('Login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      let result
      if (currState === 'Sign Up') {
        result = await register(name, email, password)
      } else {
        result = await login(email, password)
      }

      if (result) {
        navigate('/')
      } else {
        setError(currState === 'Login' ? 'Invalid email or password' : 'Registration failed. Please try again.')
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-[calc(100vh-5rem)] flex'>
      {/* Left - Brand Panel */}
      <div className='hidden lg:flex lg:w-1/2 relative overflow-hidden bg-surface-950'>
        <div className='absolute inset-0 bg-grid opacity-10' />
        <div className='absolute top-20 left-20 w-96 h-96 bg-primary-600/20 rounded-full blur-[120px]' />
        <div className='absolute bottom-20 right-20 w-80 h-80 bg-accent-600/20 rounded-full blur-[100px]' />

        <div className='relative flex flex-col justify-center px-16'>
          <div className='mb-8'>
            <div className='w-14 h-14 bg-primary-600 rounded-2xl flex items-center justify-center shadow-button mb-6'>
              <span className='text-white font-extrabold text-2xl'>UV</span>
            </div>
            <h1 className='text-5xl font-extrabold text-white leading-tight mb-4'>
              Welcome to{' '}
              <span className='text-primary-400'>UV Store</span>
            </h1>
            <p className='text-surface-400 text-lg leading-relaxed max-w-md'>
              Your premium fashion destination. Discover the latest trends with quality you can trust.
            </p>
          </div>

          <div className='grid grid-cols-2 gap-4 mt-8'>
            {[
              { value: '50K+', label: 'Happy Customers' },
              { value: '500+', label: 'Products' },
              { value: '24/7', label: 'Support' },
              { value: '99%', label: 'Satisfaction' },
            ].map((stat, i) => (
              <div key={i} className='glass-dark rounded-2xl p-5'>
                <p className='text-2xl font-extrabold text-primary-400'>{stat.value}</p>
                <p className='text-surface-500 text-sm mt-1'>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right - Form Panel */}
      <div className='w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-8 py-12'>
        <div className='w-full max-w-md'>
          {/* Mobile Logo */}
          <div className='lg:hidden text-center mb-10'>
            <div className='w-14 h-14 bg-primary-600 rounded-2xl flex items-center justify-center shadow-button mx-auto mb-4'>
              <span className='text-white font-extrabold text-2xl'>UV</span>
            </div>
            <h2 className='text-2xl font-extrabold text-surface-900'>
              UV<span className='text-primary-600'>STORE</span>
            </h2>
          </div>

          <div className='glass rounded-3xl p-8 sm:p-10 shadow-glass-lg'>
            <div className='text-center mb-8'>
              <h2 className='text-2xl font-extrabold text-surface-900'>
                {currState === 'Login' ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className='text-surface-500 text-sm mt-2'>
                {currState === 'Login'
                  ? 'Sign in to your account to continue'
                  : 'Join us and start shopping'}
              </p>
            </div>

            {error && (
              <div className='mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 animate-fade-down'>
                <svg className='w-5 h-5 text-red-500 flex-shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
                </svg>
                <p className='text-sm text-red-600'>{error}</p>
              </div>
            )}

            <form onSubmit={onSubmitHandler} className='space-y-4'>
              {currState === 'Sign Up' && (
                <div>
                  <label className='block text-sm font-semibold text-surface-700 mb-1.5'>Full Name</label>
                  <input
                    type='text'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className='input-modern'
                    placeholder='John Doe'
                    required
                  />
                </div>
              )}

              <div>
                <label className='block text-sm font-semibold text-surface-700 mb-1.5'>Email Address</label>
                <input
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='input-modern'
                  placeholder='you@example.com'
                  required
                />
              </div>

              <div>
                <label className='block text-sm font-semibold text-surface-700 mb-1.5'>Password</label>
                <input
                  type='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className='input-modern'
                  placeholder='••••••••'
                  required
                />
              </div>

              {currState === 'Login' && (
                <div className='text-right'>
                  <button type='button' className='text-sm text-primary-600 hover:text-primary-700 font-medium'>
                    Forgot password?
                  </button>
                </div>
              )}

              <button
                type='submit'
                disabled={loading}
                className='btn-primary w-full flex items-center justify-center gap-2 mt-2'
              >
                {loading ? (
                  <>
                    <div className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                    Please wait...
                  </>
                ) : currState === 'Login' ? (
                  'Sign In'
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            <div className='mt-6 text-center'>
              <p className='text-sm text-surface-500'>
                {currState === 'Login' ? "Don't have an account?" : 'Already have an account?'}{' '}
                <button
                  onClick={() => {
                    setCurrState(currState === 'Login' ? 'Sign Up' : 'Login')
                    setError('')
                  }}
                  className='text-primary-600 hover:text-primary-700 font-semibold'
                >
                  {currState === 'Login' ? 'Sign Up' : 'Sign In'}
                </button>
              </p>
            </div>

            {/* Demo Credentials */}
            <div className='mt-6 pt-6 border-t border-surface-200'>
              <p className='text-xs text-surface-400 text-center mb-3'>Demo Credentials</p>
              <div className='grid grid-cols-2 gap-2'>
                <button
                  type='button'
                  onClick={() => {
                    setEmail('admin@uvstore.com')
                    setPassword('admin123')
                    setCurrState('Login')
                  }}
                  className='text-xs px-3 py-2 rounded-lg bg-surface-100 text-surface-600 hover:bg-primary-50 hover:text-primary-600 transition-all'
                >
                  Admin Account
                </button>
                <button
                  type='button'
                  onClick={() => {
                    setEmail('user@uvstore.com')
                    setPassword('user123')
                    setCurrState('Login')
                  }}
                  className='text-xs px-3 py-2 rounded-lg bg-surface-100 text-surface-600 hover:bg-primary-50 hover:text-primary-600 transition-all'
                >
                  User Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login