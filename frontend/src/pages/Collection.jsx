import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useShop } from '../context/ShopContext'

const Collection = () => {
  const { products, currency } = useShop()
  const [filteredProducts, setFilteredProducts] = useState([])
  const [category, setCategory] = useState([])
  const [subCategory, setSubCategory] = useState([])
  const [sortType, setSortType] = useState('relevant')
  const [showFilters, setShowFilters] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const toggleCategory = (e) => {
    const value = e.target.value
    setCategory((prev) =>
      prev.includes(value) ? prev.filter((c) => c !== value) : [...prev, value]
    )
  }

  const toggleSubCategory = (e) => {
    const value = e.target.value
    setSubCategory((prev) =>
      prev.includes(value) ? prev.filter((c) => c !== value) : [...prev, value]
    )
  }

  const applySorting = (productList) => {
    const sorted = [...productList]
    switch (sortType) {
      case 'low-high':
        return sorted.sort((a, b) => a.price - b.price)
      case 'high-low':
        return sorted.sort((a, b) => b.price - a.price)
      default:
        return sorted
    }
  }

  useEffect(() => {
    let filtered = [...products]

    if (searchTerm) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (category.length > 0) {
      filtered = filtered.filter((p) => category.includes(p.category))
    }

    if (subCategory.length > 0) {
      filtered = filtered.filter((p) => subCategory.includes(p.subCategory))
    }

    setFilteredProducts(applySorting(filtered))
  }, [products, category, subCategory, sortType, searchTerm])

  const categories = [...new Set(products.map((p) => p.category))]
  const subCategories = [...new Set(products.map((p) => p.subCategory))]

  return (
    <div className='page-enter max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      {/* Header */}
      <div className='text-center mb-10'>
        <h1 className='section-title'>
          Our <span className='text-gradient'>Collection</span>
        </h1>
        <p className='section-subtitle'>
          Browse our curated selection of premium fashion
        </p>
      </div>

      <div className='flex flex-col lg:flex-row gap-8'>
        {/* Mobile Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className='lg:hidden flex items-center gap-2 glass rounded-xl px-4 py-3 text-sm font-medium text-surface-700'
        >
          <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z' />
          </svg>
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>

        {/* Sidebar Filters */}
        <div className={`lg:w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden'} lg:block`}>
          <div className='glass rounded-2xl p-6 sticky top-24'>
            {/* Search */}
            <div className='mb-6'>
              <div className='relative'>
                <svg className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
                </svg>
                <input
                  type='text'
                  placeholder='Search products...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='w-full pl-10 pr-4 py-2.5 bg-surface-50 border-2 border-surface-200 rounded-xl text-sm outline-none focus:border-primary-500 focus:bg-white transition-all duration-300'
                />
              </div>
            </div>

            {/* Categories */}
            <div className='mb-6'>
              <h3 className='text-sm font-semibold text-surface-900 mb-3 flex items-center gap-2'>
                <span className='w-1 h-4 bg-primary-500 rounded-full' />
                Categories
              </h3>
              <div className='space-y-1.5'>
                {categories.map((cat) => (
                  <label
                    key={cat}
                    className='flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-surface-50 cursor-pointer transition-all group'
                  >
                    <input
                      type='checkbox'
                      value={cat}
                      checked={category.includes(cat)}
                      onChange={toggleCategory}
                      className='w-4 h-4 rounded border-surface-300 text-primary-600 focus:ring-primary-500'
                    />
                    <span className='text-sm text-surface-600 group-hover:text-surface-900 capitalize'>
                      {cat}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Sub Categories */}
            <div>
              <h3 className='text-sm font-semibold text-surface-900 mb-3 flex items-center gap-2'>
                <span className='w-1 h-4 bg-accent-500 rounded-full' />
                Type
              </h3>
              <div className='space-y-1.5'>
                {subCategories.map((sub) => (
                  <label
                    key={sub}
                    className='flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-surface-50 cursor-pointer transition-all group'
                  >
                    <input
                      type='checkbox'
                      value={sub}
                      checked={subCategory.includes(sub)}
                      onChange={toggleSubCategory}
                      className='w-4 h-4 rounded border-surface-300 text-primary-600 focus:ring-primary-500'
                    />
                    <span className='text-sm text-surface-600 group-hover:text-surface-900 capitalize'>
                      {sub}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className='flex-1'>
          {/* Sort Bar */}
          <div className='flex items-center justify-between mb-6'>
            <p className='text-sm text-surface-500'>
              Showing <span className='font-semibold text-surface-900'>{filteredProducts.length}</span> products
            </p>
            <select
              value={sortType}
              onChange={(e) => setSortType(e.target.value)}
              className='px-4 py-2.5 bg-surface-50 border-2 border-surface-200 rounded-xl text-sm outline-none focus:border-primary-500 transition-all cursor-pointer'
            >
              <option value='relevant'>Sort by: Relevant</option>
              <option value='low-high'>Price: Low to High</option>
              <option value='high-low'>Price: High to Low</option>
            </select>
          </div>

          {/* Products */}
          {filteredProducts.length === 0 ? (
            <div className='text-center py-20'>
              <div className='w-20 h-20 mx-auto mb-6 rounded-full bg-surface-100 flex items-center justify-center'>
                <svg className='w-10 h-10 text-surface-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
                </svg>
              </div>
              <p className='text-surface-500 text-lg'>No products found</p>
              <p className='text-surface-400 text-sm mt-1'>Try adjusting your filters</p>
            </div>
          ) : (
            <div className='grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6'>
              {filteredProducts.map((product, i) => (
                <Link
                  key={product._id}
                  to={`/product/${product._id}`}
                  className='group animate-fade-up'
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <div className='glass rounded-2xl overflow-hidden card-hover'>
                    <div className='relative overflow-hidden aspect-[5/7] max-h-[400px]'>
                      <img
                        className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out'
                        src={product.image?.[0] || ''}
                        alt={product.name}
                      />
                      {product.bestseller && (
                        <span className='absolute top-3 left-3 badge bg-primary-600 text-white text-[10px] px-2 py-1'>
                          Best Seller
                        </span>
                      )}
                      <div className='absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
                    </div>
                    <div className='p-4'>
                      <p className='text-sm font-semibold text-surface-900 truncate'>{product.name}</p>
                      <div className='flex items-center justify-between mt-1.5'>
                        <p className='text-primary-600 font-bold'>{currency}{product.price}</p>
                        <span className='text-[10px] text-surface-400 capitalize'>{product.category}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Collection