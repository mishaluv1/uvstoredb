import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useShop } from '../context/ShopContext'
import { toast } from 'react-toastify'

const Product = () => {
  const { productId } = useParams()
  const { products, currency, addToCart } = useShop()
  const [product, setProduct] = useState(null)
  const [image, setImage] = useState('')
  const [size, setSize] = useState('')
  const [activeTab, setActiveTab] = useState('description')
  const [relatedProducts, setRelatedProducts] = useState([])

  useEffect(() => {
    const found = products.find((p) => p._id === productId)
    if (found) {
      setProduct(found)
      setImage(found.image?.[0] || '')
      const related = products
        .filter((p) => p.category === found.category && p._id !== found._id)
        .slice(0, 4)
      setRelatedProducts(related)
    }
  }, [productId, products])

  const handleAddToCart = () => {
    if (!size) {
      toast.warning('Please select a size')
      return
    }
    addToCart(product._id, size)
    toast.success(`${product.name} added to cart!`)
  }

  if (!product) {
    return (
      <div className='flex items-center justify-center min-h-[60vh]'>
        <div className='text-center'>
          <div className='w-16 h-16 mx-auto mb-4 rounded-full border-4 border-primary-200 border-t-primary-600 animate-spin' />
          <p className='text-surface-500'>Loading product...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='page-enter max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      {/* Breadcrumb */}
      <nav className='flex items-center gap-2 text-sm text-surface-400 mb-8'>
        <Link to='/' className='hover:text-primary-600 transition-colors'>Home</Link>
        <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
        </svg>
        <Link to='/collection' className='hover:text-primary-600 transition-colors'>Collection</Link>
        <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
        </svg>
        <span className='text-surface-700 font-medium truncate'>{product.name}</span>
      </nav>

      <div className='flex flex-col lg:flex-row gap-10'>
        {/* Image Gallery */}
        <div className='flex-1 lg:max-w-md flex flex-col-reverse sm:flex-row gap-4'>
          {/* Thumbnails */}
          <div className='flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible'>
            {product.image?.map((img, i) => (
              <button
                key={i}
                onClick={() => setImage(img)}
                className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 ${image === img
                  ? 'border-primary-500 shadow-lg shadow-primary-500/20'
                  : 'border-surface-200 hover:border-surface-400'
                  }`}
              >
                <img className='w-full h-full object-cover aspect-square' src={img} alt={`${product.name} ${i + 1}`} />
              </button>
            ))}
          </div>

          {/* Main Image */}
          <div className='flex-1 glass rounded-3xl overflow-hidden aspect-[5/7] max-h-[500px]'>
            <img
              className='w-full h-full object-cover animate-scale-in'
              src={image}
              alt={product.name}
            />
          </div>
        </div>

        {/* Product Info */}
        <div className='flex-1 lg:max-w-md'>
          <div className='glass rounded-3xl p-8'>
            {product.bestseller && (
              <span className='badge bg-primary-600 text-white text-xs px-3 py-1 mb-4 inline-block'>
                Best Seller
              </span>
            )}

            <h1 className='text-2xl sm:text-3xl font-extrabold text-surface-900 mb-2'>
              {product.name}
            </h1>

            <div className='flex items-center gap-2 mb-4'>
              <div className='flex gap-0.5'>
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className='w-4 h-4 text-amber-400' fill='currentColor' viewBox='0 0 20 20'>
                    <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                  </svg>
                ))}
              </div>
              <span className='text-sm text-surface-400'>(4.8) • 128 reviews</span>
            </div>

            <p className='text-3xl font-extrabold text-primary-600 mb-6'>
              {currency}{product.price}
            </p>

            <p className='text-surface-500 text-sm leading-relaxed mb-8'>
              {product.description}
            </p>

            {/* Size Selector */}
            <div className='mb-8'>
              <p className='text-sm font-semibold text-surface-900 mb-3'>
                Select Size
              </p>
              <div className='flex flex-wrap gap-2'>
                {product.sizes?.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${size === s
                      ? 'bg-primary-600 text-white shadow-button'
                      : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                      }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              className='btn-primary w-full flex items-center justify-center gap-2'
            >
              <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' />
              </svg>
              Add to Cart
            </button>

            {/* Info Grid */}
            <div className='grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-surface-200'>
              <div className='flex items-center gap-3'>
                <div className='w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center'>
                  <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                  </svg>
                </div>
                <div>
                  <p className='text-xs font-semibold text-surface-900'>In Stock</p>
                  <p className='text-[10px] text-surface-400'>Ready to ship</p>
                </div>
              </div>
              <div className='flex items-center gap-3'>
                <div className='w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center'>
                  <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' />
                  </svg>
                </div>
                <div>
                  <p className='text-xs font-semibold text-surface-900'>Free Shipping</p>
                  <p className='text-[10px] text-surface-400'>Orders over $50</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className='mt-16'>
        <div className='flex gap-1 mb-8 border-b border-surface-200'>
          {['description', 'reviews'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-semibold capitalize transition-all duration-300 relative ${activeTab === tab
                ? 'text-primary-600'
                : 'text-surface-400 hover:text-surface-600'
                }`}
            >
              {tab}
              {activeTab === tab && (
                <span className='absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 rounded-full' />
              )}
            </button>
          ))}
        </div>

        {activeTab === 'description' && (
          <div className='glass rounded-2xl p-8 animate-fade-up'>
            <p className='text-surface-600 leading-relaxed'>{product.description}</p>
            <div className='mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4'>
              <div className='bg-surface-50 rounded-xl p-4'>
                <p className='text-xs text-surface-400'>Category</p>
                <p className='text-sm font-semibold text-surface-900 capitalize'>{product.category}</p>
              </div>
              <div className='bg-surface-50 rounded-xl p-4'>
                <p className='text-xs text-surface-400'>Type</p>
                <p className='text-sm font-semibold text-surface-900 capitalize'>{product.subCategory}</p>
              </div>
              <div className='bg-surface-50 rounded-xl p-4'>
                <p className='text-xs text-surface-400'>Available Sizes</p>
                <p className='text-sm font-semibold text-surface-900'>{product.sizes?.join(', ')}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className='glass rounded-2xl p-8 animate-fade-up text-center'>
            <div className='w-16 h-16 mx-auto mb-4 rounded-full bg-surface-100 flex items-center justify-center'>
              <svg className='w-8 h-8 text-surface-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' />
              </svg>
            </div>
            <p className='text-surface-500'>Reviews coming soon</p>
          </div>
        )}
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className='mt-16'>
          <h2 className='text-2xl font-extrabold text-surface-900 mb-8'>
            You May Also <span className='text-gradient'>Like</span>
          </h2>
          <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6'>
            {relatedProducts.map((p, i) => (
              <Link
                key={p._id}
                to={`/product/${p._id}`}
                className='group animate-fade-up'
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className='glass rounded-2xl overflow-hidden card-hover'>
                  <div className='relative overflow-hidden aspect-[5/7]'>
                    <img
                      className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-700'
                      src={p.image?.[0] || ''}
                      alt={p.name}
                    />
                  </div>
                  <div className='p-4'>
                    <p className='text-sm font-semibold text-surface-900 truncate'>{p.name}</p>
                    <p className='text-primary-600 font-bold mt-1'>{currency}{p.price}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

export default Product