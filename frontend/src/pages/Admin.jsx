import React, { useState, useEffect, useRef } from 'react'
import { useShop } from '../context/ShopContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const API_URL = 'http://localhost:5000/api'

const Admin = () => {
    const { user, token } = useShop()
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState('dashboard')

    // Dashboard state
    const [stats, setStats] = useState(null)
    const [statsLoading, setStatsLoading] = useState(true)

    // Products state
    const [products, setProducts] = useState([])
    const [productsLoading, setProductsLoading] = useState(false)
    const [showProductForm, setShowProductForm] = useState(false)
    const [editingProduct, setEditingProduct] = useState(null)
    const [productForm, setProductForm] = useState({
        name: '', description: '', price: '', image: '', category: '',
        subCategory: '', sizes: '', bestseller: false, stock: ''
    })
    const [productSaving, setProductSaving] = useState(false)

    // Image upload state
    const [imageFiles, setImageFiles] = useState([])
    const [imagePreviews, setImagePreviews] = useState([])
    const [uploadedUrls, setUploadedUrls] = useState([])
    const [uploading, setUploading] = useState(false)
    const galleryInputRef = useRef(null)
    const cameraInputRef = useRef(null)

    // Orders state
    const [orders, setOrders] = useState([])
    const [ordersLoading, setOrdersLoading] = useState(false)
    const [expandedOrder, setExpandedOrder] = useState(null)

    // Users state
    const [users, setUsers] = useState([])
    const [usersLoading, setUsersLoading] = useState(false)

    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
    }

    // Redirect non-admins
    useEffect(() => {
        if (!token) {
            navigate('/login')
            return
        }
        if (user && user.role !== 'admin') {
            toast.error('Access denied. Admin only.')
            navigate('/')
        }
    }, [user, token, navigate])

    // ==================== DASHBOARD ====================
    const fetchStats = async () => {
        setStatsLoading(true)
        try {
            const res = await fetch(`${API_URL}/admin/stats`, { headers })
            if (res.ok) {
                const data = await res.json()
                setStats(data)
            } else if (res.status === 401 || res.status === 403) {
                toast.error('Admin access required')
                navigate('/')
            }
        } catch (err) {
            toast.error('Failed to load stats')
        } finally {
            setStatsLoading(false)
        }
    }

    useEffect(() => {
        if (user?.role === 'admin') {
            fetchStats()
        }
    }, [user])

    // ==================== PRODUCTS ====================
    const fetchProducts = async () => {
        setProductsLoading(true)
        try {
            const res = await fetch(`${API_URL}/admin/products`, { headers })
            if (res.ok) {
                const data = await res.json()
                setProducts(data)
            }
        } catch (err) {
            toast.error('Failed to load products')
        } finally {
            setProductsLoading(false)
        }
    }

    const resetProductForm = () => {
        setProductForm({
            name: '', description: '', price: '', image: '', category: '',
            subCategory: '', sizes: '', bestseller: false, stock: ''
        })
        setEditingProduct(null)
        setShowProductForm(false)
        setImageFiles([])
        setImagePreviews([])
        setUploadedUrls([])
    }

    // ==================== IMAGE HANDLING ====================

    const handleImageSelect = (e) => {
        const files = Array.from(e.target.files)
        if (files.length === 0) return

        // Create previews
        const newPreviews = files.map((file) => URL.createObjectURL(file))
        setImagePreviews((prev) => [...prev, ...newPreviews])
        setImageFiles((prev) => [...prev, ...files])
    }

    const removeImage = (index) => {
        URL.revokeObjectURL(imagePreviews[index])
        setImagePreviews((prev) => prev.filter((_, i) => i !== index))
        setImageFiles((prev) => prev.filter((_, i) => i !== index))
        setUploadedUrls((prev) => prev.filter((_, i) => i !== index))
    }

    const uploadImages = async () => {
        if (imageFiles.length === 0) return []
        setUploading(true)
        try {
            const formData = new FormData()
            imageFiles.forEach((file) => {
                formData.append('images', file)
            })
            const res = await fetch(`${API_URL}/admin/upload`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData
            })
            if (res.ok) {
                const data = await res.json()
                setUploadedUrls(data.urls)
                return data.urls
            } else {
                const data = await res.json()
                toast.error(data.message || 'Image upload failed')
                return []
            }
        } catch (err) {
            toast.error('Image upload network error')
            return []
        } finally {
            setUploading(false)
        }
    }

    const openAddProduct = () => {
        resetProductForm()
        setShowProductForm(true)
    }

    const openEditProduct = (product) => {
        setEditingProduct(product)
        setProductForm({
            name: product.name || '',
            description: product.description || '',
            price: product.price || '',
            image: Array.isArray(product.image) ? product.image.join(', ') : product.image || '',
            category: product.category || '',
            subCategory: product.subCategory || '',
            sizes: Array.isArray(product.sizes) ? product.sizes.join(', ') : product.sizes || '',
            bestseller: product.bestseller || false,
            stock: product.stock ?? ''
        })
        setShowProductForm(true)
    }

    const handleProductFormChange = (e) => {
        const { name, value, type, checked } = e.target
        setProductForm((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    const saveProduct = async () => {
        setProductSaving(true)
        try {
            // Upload images first if any selected
            let imageUrls = uploadedUrls
            if (imageFiles.length > 0 && uploadedUrls.length === 0) {
                imageUrls = await uploadImages()
                if (imageUrls.length === 0 && imageFiles.length > 0) {
                    toast.error('Please wait for images to upload or remove them')
                    setProductSaving(false)
                    return
                }
            }

            // Combine uploaded URLs with any manually entered URLs
            const manualUrls = productForm.image
                ? productForm.image.split(',').map((s) => s.trim()).filter(Boolean)
                : []
            const allImageUrls = [...imageUrls, ...manualUrls]

            const body = {
                ...productForm,
                price: Number(productForm.price),
                stock: Number(productForm.stock),
                image: allImageUrls,
                sizes: productForm.sizes.split(',').map((s) => s.trim()).filter(Boolean)
            }

            const url = editingProduct
                ? `${API_URL}/admin/products/${editingProduct._id}`
                : `${API_URL}/admin/products`
            const method = editingProduct ? 'PUT' : 'POST'

            const res = await fetch(url, {
                method,
                headers,
                body: JSON.stringify(body)
            })

            if (res.ok) {
                toast.success(editingProduct ? 'Product updated!' : 'Product created!')
                resetProductForm()
                fetchProducts()
                fetchStats()
            } else {
                const data = await res.json()
                toast.error(data.message || 'Failed to save product')
            }
        } catch (err) {
            toast.error('Network error')
        } finally {
            setProductSaving(false)
        }
    }

    const deleteProduct = async (id) => {
        if (!window.confirm('Delete this product?')) return
        try {
            const res = await fetch(`${API_URL}/admin/products/${id}`, {
                method: 'DELETE',
                headers
            })
            if (res.ok) {
                toast.success('Product deleted')
                fetchProducts()
                fetchStats()
            } else {
                toast.error('Failed to delete')
            }
        } catch (err) {
            toast.error('Network error')
        }
    }

    // ==================== ORDERS ====================
    const fetchOrders = async () => {
        setOrdersLoading(true)
        try {
            const res = await fetch(`${API_URL}/admin/orders`, { headers })
            if (res.ok) {
                const data = await res.json()
                setOrders(data)
            }
        } catch (err) {
            toast.error('Failed to load orders')
        } finally {
            setOrdersLoading(false)
        }
    }

    const updateOrderStatus = async (id, status) => {
        try {
            const res = await fetch(`${API_URL}/admin/orders/${id}`, {
                method: 'PUT',
                headers,
                body: JSON.stringify({ status })
            })
            if (res.ok) {
                toast.success(`Order ${status.toLowerCase()}`)
                fetchOrders()
                fetchStats()
            } else {
                toast.error('Failed to update order')
            }
        } catch (err) {
            toast.error('Network error')
        }
    }

    const deleteOrder = async (id) => {
        if (!window.confirm('Delete this order?')) return
        try {
            const res = await fetch(`${API_URL}/admin/orders/${id}`, {
                method: 'DELETE',
                headers
            })
            if (res.ok) {
                toast.success('Order deleted')
                fetchOrders()
                fetchStats()
            } else {
                toast.error('Failed to delete')
            }
        } catch (err) {
            toast.error('Network error')
        }
    }

    // ==================== USERS ====================
    const fetchUsers = async () => {
        setUsersLoading(true)
        try {
            const res = await fetch(`${API_URL}/admin/users`, { headers })
            if (res.ok) {
                const data = await res.json()
                setUsers(data)
            }
        } catch (err) {
            toast.error('Failed to load users')
        } finally {
            setUsersLoading(false)
        }
    }

    const updateUserRole = async (id, role) => {
        try {
            const res = await fetch(`${API_URL}/admin/users/${id}`, {
                method: 'PUT',
                headers,
                body: JSON.stringify({ role })
            })
            if (res.ok) {
                toast.success('User updated')
                fetchUsers()
            } else {
                toast.error('Failed to update user')
            }
        } catch (err) {
            toast.error('Network error')
        }
    }

    const deleteUser = async (id) => {
        if (!window.confirm('Delete this user? This cannot be undone.')) return
        try {
            const res = await fetch(`${API_URL}/admin/users/${id}`, {
                method: 'DELETE',
                headers
            })
            if (res.ok) {
                toast.success('User deleted')
                fetchUsers()
                fetchStats()
            } else {
                toast.error('Failed to delete user')
            }
        } catch (err) {
            toast.error('Network error')
        }
    }

    // Load data when tab changes
    useEffect(() => {
        if (activeTab === 'products') fetchProducts()
        if (activeTab === 'orders') fetchOrders()
        if (activeTab === 'users') fetchUsers()
    }, [activeTab])

    const getStatusColor = (status) => {
        switch (status) {
            case 'Delivered': return 'bg-emerald-50 text-emerald-700 border-emerald-200'
            case 'Shipped': return 'bg-blue-50 text-blue-700 border-blue-200'
            case 'Processing': return 'bg-amber-50 text-amber-700 border-amber-200'
            case 'Cancelled': return 'bg-red-50 text-red-700 border-red-200'
            default: return 'bg-surface-100 text-surface-600 border-surface-200'
        }
    }

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Delivered':
                return <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
            case 'Shipped':
                return <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 10V3L4 14h7v7l9-11h-7z' />
            case 'Processing':
                return <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' />
            case 'Cancelled':
                return <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
            default:
                return <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
        }
    }

    const tabs = [
        {
            key: 'dashboard', label: 'Dashboard', icon: (
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' />
            )
        },
        {
            key: 'products', label: 'Products', icon: (
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' />
            )
        },
        {
            key: 'orders', label: 'Orders', icon: (
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' />
            )
        },
        {
            key: 'users', label: 'Users', icon: (
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' />
            )
        }
    ]

    // Stats card definitions
    const statCards = [
        {
            label: 'Total Products',
            value: stats?.totalProducts ?? '—',
            icon: <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' />,
            gradient: 'from-blue-500 to-cyan-500',
            bgLight: 'bg-blue-50',
            textColor: 'text-blue-600'
        },
        {
            label: 'Total Orders',
            value: stats?.totalOrders ?? '—',
            icon: <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' />,
            gradient: 'from-violet-500 to-purple-500',
            bgLight: 'bg-violet-50',
            textColor: 'text-violet-600'
        },
        {
            label: 'Total Users',
            value: stats?.totalUsers ?? '—',
            icon: <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' />,
            gradient: 'from-emerald-500 to-green-500',
            bgLight: 'bg-emerald-50',
            textColor: 'text-emerald-600'
        },
        {
            label: 'Total Revenue',
            value: stats?.totalRevenue != null ? `$${stats.totalRevenue.toFixed(2)}` : '—',
            icon: <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />,
            gradient: 'from-amber-500 to-orange-500',
            bgLight: 'bg-amber-50',
            textColor: 'text-amber-600'
        }
    ]

    if (!user || user.role !== 'admin') {
        return (
            <div className='flex items-center justify-center min-h-[60vh]'>
                <div className='flex flex-col items-center gap-4'>
                    <div className='w-10 h-10 border-2 border-primary-500 border-t-transparent rounded-full animate-spin'></div>
                    <p className='text-surface-400 text-lg'>Checking permissions...</p>
                </div>
            </div>
        )
    }

    return (
        <div className='page-enter'>
            {/* Hero Header */}
            <div className='relative overflow-hidden bg-surface-950 py-12 mb-10'>
                <div className='absolute inset-0 bg-grid opacity-10'></div>
                <div className='absolute top-0 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl'></div>
                <div className='absolute bottom-0 left-0 w-64 h-64 bg-accent-500/10 rounded-full blur-3xl'></div>
                <div className='relative max-w-7xl mx-auto px-4'>
                    <p className='text-surface-400 text-sm uppercase tracking-widest mb-3 animate-fade-down'>
                        Management Console
                    </p>
                    <h1 className='text-4xl md:text-5xl font-bold text-white animate-fade-up'>
                        Admin <span className='text-gradient'>Panel</span>
                    </h1>
                </div>
            </div>

            <div className='max-w-7xl mx-auto px-4 pb-20'>
                {/* Tabs */}
                <div className='glass rounded-2xl p-1.5 mb-8 flex gap-1 overflow-x-auto animate-fade-up'>
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 whitespace-nowrap ${activeTab === tab.key
                                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                                    : 'text-surface-500 hover:text-surface-700 hover:bg-surface-100'
                                }`}
                        >
                            <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                {tab.icon}
                            </svg>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* ==================== DASHBOARD TAB ==================== */}
                {activeTab === 'dashboard' && (
                    <div className='animate-fade-up'>
                        {statsLoading ? (
                            <div className='flex items-center justify-center py-20'>
                                <div className='flex flex-col items-center gap-4'>
                                    <div className='w-10 h-10 border-2 border-primary-500 border-t-transparent rounded-full animate-spin'></div>
                                    <p className='text-surface-400'>Loading statistics...</p>
                                </div>
                            </div>
                        ) : stats ? (
                            <>
                                {/* Stats Grid */}
                                <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10'>
                                    {statCards.map((card, idx) => (
                                        <div
                                            key={idx}
                                            className='glass rounded-2xl p-5 md:p-6 card-hover group'
                                        >
                                            <div className='flex items-start justify-between mb-4'>
                                                <div className={`w-12 h-12 rounded-xl ${card.bgLight} flex items-center justify-center`}>
                                                    <svg className={`w-6 h-6 ${card.textColor}`} fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                                        {card.icon}
                                                    </svg>
                                                </div>
                                                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                                            </div>
                                            <p className='text-sm text-surface-400 font-medium mb-1'>{card.label}</p>
                                            <p className='text-3xl font-bold text-surface-900'>{card.value}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Recent Orders */}
                                <div className='glass rounded-2xl p-6 md:p-8'>
                                    <div className='flex items-center justify-between mb-6'>
                                        <h3 className='text-lg font-semibold text-surface-900'>Recent Orders</h3>
                                        <button
                                            onClick={() => setActiveTab('orders')}
                                            className='text-sm text-primary-600 hover:text-primary-700 font-medium link-underline'
                                        >
                                            View All
                                        </button>
                                    </div>
                                    {stats.recentOrders?.length > 0 ? (
                                        <div className='overflow-x-auto'>
                                            <table className='w-full text-sm'>
                                                <thead>
                                                    <tr className='border-b border-surface-200'>
                                                        <th className='py-3 pr-4 text-left text-xs font-medium text-surface-400 uppercase tracking-wider'>Order ID</th>
                                                        <th className='py-3 pr-4 text-left text-xs font-medium text-surface-400 uppercase tracking-wider'>Customer</th>
                                                        <th className='py-3 pr-4 text-left text-xs font-medium text-surface-400 uppercase tracking-wider'>Total</th>
                                                        <th className='py-3 pr-4 text-left text-xs font-medium text-surface-400 uppercase tracking-wider'>Status</th>
                                                        <th className='py-3 pr-4 text-left text-xs font-medium text-surface-400 uppercase tracking-wider'>Date</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {stats.recentOrders.map((order) => (
                                                        <tr key={order._id} className='border-b border-surface-100 hover:bg-surface-50/50 transition-colors'>
                                                            <td className='py-3 pr-4'>
                                                                <span className='font-mono text-xs text-surface-500'>#{order._id.slice(-8)}</span>
                                                            </td>
                                                            <td className='py-3 pr-4 font-medium text-surface-800'>{order.user?.name || 'N/A'}</td>
                                                            <td className='py-3 pr-4 font-semibold text-surface-900'>${order.total?.toFixed(2)}</td>
                                                            <td className='py-3 pr-4'>
                                                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                                                                    <svg className='w-3 h-3' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                                                        {getStatusIcon(order.status)}
                                                                    </svg>
                                                                    {order.status}
                                                                </span>
                                                            </td>
                                                            <td className='py-3 pr-4 text-surface-400 text-xs'>
                                                                {new Date(order.createdAt).toLocaleDateString()}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <div className='text-center py-12'>
                                            <div className='w-16 h-16 rounded-2xl bg-surface-100 flex items-center justify-center mx-auto mb-4'>
                                                <svg className='w-8 h-8 text-surface-300' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' />
                                                </svg>
                                            </div>
                                            <p className='text-surface-400'>No orders yet.</p>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className='text-center py-20'>
                                <p className='text-surface-400'>Failed to load statistics.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* ==================== PRODUCTS TAB ==================== */}
                {activeTab === 'products' && (
                    <div className='animate-fade-up'>
                        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6'>
                            <h3 className='text-lg font-semibold text-surface-900'>
                                All Products <span className='text-surface-400 font-normal'>({products.length})</span>
                            </h3>
                            <button
                                onClick={openAddProduct}
                                className='btn-primary flex items-center gap-2 text-sm'
                            >
                                <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
                                </svg>
                                Add Product
                            </button>
                        </div>

                        {/* Product Form Modal */}
                        {showProductForm && (
                            <div className='fixed inset-0 bg-surface-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in'>
                                <div className='bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl shadow-glass-xl p-6 md:p-8 animate-scale-in'>
                                    <div className='flex items-center justify-between mb-6'>
                                        <h3 className='text-lg font-semibold text-surface-900'>
                                            {editingProduct ? 'Edit Product' : 'Add New Product'}
                                        </h3>
                                        <button
                                            onClick={resetProductForm}
                                            className='w-8 h-8 rounded-lg hover:bg-surface-100 flex items-center justify-center transition-colors'
                                        >
                                            <svg className='w-5 h-5 text-surface-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                                            </svg>
                                        </button>
                                    </div>
                                    <div className='space-y-4'>
                                        <div>
                                            <label className='text-xs font-medium text-surface-400 uppercase tracking-wider mb-1.5 block'>Name</label>
                                            <input name='name' value={productForm.name} onChange={handleProductFormChange}
                                                className='input-modern' placeholder='Product name' />
                                        </div>
                                        <div>
                                            <label className='text-xs font-medium text-surface-400 uppercase tracking-wider mb-1.5 block'>Description</label>
                                            <textarea name='description' value={productForm.description} onChange={handleProductFormChange}
                                                rows='2' className='input-modern resize-none' placeholder='Product description' />
                                        </div>
                                        <div className='grid grid-cols-2 gap-4'>
                                            <div>
                                                <label className='text-xs font-medium text-surface-400 uppercase tracking-wider mb-1.5 block'>Price ($)</label>
                                                <input name='price' type='number' step='0.01' value={productForm.price} onChange={handleProductFormChange}
                                                    className='input-modern' placeholder='0.00' />
                                            </div>
                                            <div>
                                                <label className='text-xs font-medium text-surface-400 uppercase tracking-wider mb-1.5 block'>Stock</label>
                                                <input name='stock' type='number' value={productForm.stock} onChange={handleProductFormChange}
                                                    className='input-modern' placeholder='0' />
                                            </div>
                                        </div>

                                        {/* Image Upload Section */}
                                        <div>
                                            <label className='text-xs font-medium text-surface-400 uppercase tracking-wider mb-2 block'>Product Images</label>

                                            {/* Hidden file inputs */}
                                            <input
                                                ref={galleryInputRef}
                                                type='file'
                                                accept='image/*'
                                                multiple
                                                onChange={handleImageSelect}
                                                className='hidden'
                                            />
                                            <input
                                                ref={cameraInputRef}
                                                type='file'
                                                accept='image/*'
                                                capture='environment'
                                                onChange={handleImageSelect}
                                                className='hidden'
                                            />

                                            {/* Camera & Gallery Buttons */}
                                            <div className='flex gap-2 mb-3'>
                                                <button
                                                    type='button'
                                                    onClick={() => galleryInputRef.current?.click()}
                                                    className='flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-surface-200 text-sm font-medium text-surface-600 hover:border-primary-300 hover:text-primary-600 hover:bg-primary-50/50 transition-all duration-300'
                                                >
                                                    <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' />
                                                    </svg>
                                                    Gallery
                                                </button>
                                                <button
                                                    type='button'
                                                    onClick={() => cameraInputRef.current?.click()}
                                                    className='flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-surface-200 text-sm font-medium text-surface-600 hover:border-primary-300 hover:text-primary-600 hover:bg-primary-50/50 transition-all duration-300'
                                                >
                                                    <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z' />
                                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 13a3 3 0 11-6 0 3 3 0 016 0z' />
                                                    </svg>
                                                    Camera
                                                </button>
                                            </div>

                                            {/* Image Previews */}
                                            {imagePreviews.length > 0 && (
                                                <div className='flex flex-wrap gap-2 mb-3'>
                                                    {imagePreviews.map((preview, idx) => (
                                                        <div key={idx} className='relative group'>
                                                            <img
                                                                src={preview}
                                                                alt={`Preview ${idx + 1}`}
                                                                className='w-20 h-20 object-cover rounded-xl border-2 border-surface-200'
                                                            />
                                                            <button
                                                                type='button'
                                                                onClick={() => removeImage(idx)}
                                                                className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 transition-colors shadow-lg'
                                                            >
                                                                ×
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Upload status */}
                                            {uploadedUrls.length > 0 && (
                                                <p className='text-xs text-emerald-600 font-medium mb-2 flex items-center gap-1'>
                                                    <svg className='w-3.5 h-3.5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                                                    </svg>
                                                    {uploadedUrls.length} image{uploadedUrls.length > 1 ? 's' : ''} uploaded
                                                </p>
                                            )}
                                            {uploading && (
                                                <p className='text-xs text-primary-600 font-medium mb-2 flex items-center gap-1'>
                                                    <div className='w-3 h-3 border-2 border-primary-500 border-t-transparent rounded-full animate-spin'></div>
                                                    Uploading images...
                                                </p>
                                            )}

                                            {/* Manual URL input */}
                                            <label className='text-xs text-surface-400 block mb-1'>Or paste image URLs (comma separated)</label>
                                            <input name='image' value={productForm.image} onChange={handleProductFormChange}
                                                className='input-modern' placeholder='https://example.com/image1.jpg, https://example.com/image2.jpg' />
                                        </div>

                                        <div className='grid grid-cols-2 gap-4'>
                                            <div>
                                                <label className='text-xs font-medium text-surface-400 uppercase tracking-wider mb-1.5 block'>Category</label>
                                                <select name='category' value={productForm.category} onChange={handleProductFormChange}
                                                    className='input-modern'>
                                                    <option value=''>Select</option>
                                                    <option value='Men'>Men</option>
                                                    <option value='Women'>Women</option>
                                                    <option value='Kids'>Kids</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className='text-xs font-medium text-surface-400 uppercase tracking-wider mb-1.5 block'>SubCategory</label>
                                                <select name='subCategory' value={productForm.subCategory} onChange={handleProductFormChange}
                                                    className='input-modern'>
                                                    <option value=''>Select</option>
                                                    <option value='Topwear'>Topwear</option>
                                                    <option value='Bottomwear'>Bottomwear</option>
                                                    <option value='Winterwear'>Winterwear</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div>
                                            <label className='text-xs font-medium text-surface-400 uppercase tracking-wider mb-1.5 block'>Sizes (comma separated)</label>
                                            <input name='sizes' value={productForm.sizes} onChange={handleProductFormChange}
                                                className='input-modern' placeholder='S, M, L, XL' />
                                        </div>
                                        <label className='flex items-center gap-3 text-sm cursor-pointer group'>
                                            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${productForm.bestseller
                                                    ? 'bg-primary-500 border-primary-500'
                                                    : 'border-surface-300 group-hover:border-primary-400'
                                                }`}>
                                                {productForm.bestseller && (
                                                    <svg className='w-3 h-3 text-white' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={3} d='M5 13l4 4L19 7' />
                                                    </svg>
                                                )}
                                            </div>
                                            <input
                                                type='checkbox'
                                                name='bestseller'
                                                checked={productForm.bestseller}
                                                onChange={handleProductFormChange}
                                                className='hidden'
                                            />
                                            <span className='text-surface-700 font-medium'>Mark as Bestseller</span>
                                        </label>
                                    </div>
                                    <div className='flex gap-3 mt-8'>
                                        <button onClick={saveProduct} disabled={productSaving}
                                            className='btn-primary flex-1 py-2.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'>
                                            {productSaving ? (
                                                <>
                                                    <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                                                    SAVING...
                                                </>
                                            ) : editingProduct ? 'UPDATE PRODUCT' : 'CREATE PRODUCT'}
                                        </button>
                                        <button onClick={resetProductForm}
                                            className='btn-outline px-6 py-2.5 text-sm'>
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Products Table */}
                        {productsLoading ? (
                            <div className='flex items-center justify-center py-20'>
                                <div className='flex flex-col items-center gap-4'>
                                    <div className='w-10 h-10 border-2 border-primary-500 border-t-transparent rounded-full animate-spin'></div>
                                    <p className='text-surface-400'>Loading products...</p>
                                </div>
                            </div>
                        ) : (
                            <div className='glass rounded-2xl overflow-hidden'>
                                <div className='overflow-x-auto'>
                                    <table className='w-full text-sm'>
                                        <thead>
                                            <tr className='border-b border-surface-200 bg-surface-50/50'>
                                                <th className='py-3.5 px-4 text-left text-xs font-medium text-surface-400 uppercase tracking-wider'>Product</th>
                                                <th className='py-3.5 px-4 text-left text-xs font-medium text-surface-400 uppercase tracking-wider'>Category</th>
                                                <th className='py-3.5 px-4 text-left text-xs font-medium text-surface-400 uppercase tracking-wider'>Price</th>
                                                <th className='py-3.5 px-4 text-left text-xs font-medium text-surface-400 uppercase tracking-wider'>Stock</th>
                                                <th className='py-3.5 px-4 text-left text-xs font-medium text-surface-400 uppercase tracking-wider'>Bestseller</th>
                                                <th className='py-3.5 px-4 text-left text-xs font-medium text-surface-400 uppercase tracking-wider'>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {products.map((product) => (
                                                <tr key={product._id} className='border-b border-surface-100 hover:bg-surface-50/50 transition-colors'>
                                                    <td className='py-3 px-4'>
                                                        <div className='flex items-center gap-3'>
                                                            <img
                                                                src={product.image?.[0] || 'https://via.placeholder.com/40'}
                                                                alt={product.name}
                                                                className='w-10 h-10 object-cover rounded-lg aspect-square'
                                                            />
                                                            <span className='font-medium text-surface-800 max-w-[200px] truncate'>{product.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className='py-3 px-4'>
                                                        <span className='text-surface-500 text-xs'>
                                                            {product.category} / {product.subCategory}
                                                        </span>
                                                    </td>
                                                    <td className='py-3 px-4 font-semibold text-surface-900'>${product.price?.toFixed(2)}</td>
                                                    <td className='py-3 px-4'>
                                                        <span className={`text-xs font-medium ${(product.stock ?? 0) > 10 ? 'text-emerald-600' :
                                                                (product.stock ?? 0) > 0 ? 'text-amber-600' : 'text-red-600'
                                                            }`}>
                                                            {product.stock ?? 'N/A'}
                                                        </span>
                                                    </td>
                                                    <td className='py-3 px-4'>
                                                        {product.bestseller ? (
                                                            <span className='inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-xs font-medium border border-amber-200'>
                                                                <svg className='w-3 h-3' fill='currentColor' viewBox='0 0 20 20'>
                                                                    <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                                                                </svg>
                                                                Best
                                                            </span>
                                                        ) : (
                                                            <span className='text-surface-300'>—</span>
                                                        )}
                                                    </td>
                                                    <td className='py-3 px-4'>
                                                        <div className='flex items-center gap-1'>
                                                            <button
                                                                onClick={() => openEditProduct(product)}
                                                                className='px-3 py-1.5 rounded-lg text-xs font-medium text-primary-600 hover:bg-primary-50 transition-colors'
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                onClick={() => deleteProduct(product._id)}
                                                                className='px-3 py-1.5 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 transition-colors'
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                {products.length === 0 && (
                                    <div className='text-center py-16'>
                                        <div className='w-16 h-16 rounded-2xl bg-surface-100 flex items-center justify-center mx-auto mb-4'>
                                            <svg className='w-8 h-8 text-surface-300' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' />
                                            </svg>
                                        </div>
                                        <p className='text-surface-400 mb-2'>No products found.</p>
                                        <button onClick={openAddProduct} className='text-primary-600 text-sm font-medium link-underline'>
                                            Add your first product
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* ==================== ORDERS TAB ==================== */}
                {activeTab === 'orders' && (
                    <div className='animate-fade-up'>
                        <h3 className='text-lg font-semibold text-surface-900 mb-6'>
                            All Orders <span className='text-surface-400 font-normal'>({orders.length})</span>
                        </h3>
                        {ordersLoading ? (
                            <div className='flex items-center justify-center py-20'>
                                <div className='flex flex-col items-center gap-4'>
                                    <div className='w-10 h-10 border-2 border-primary-500 border-t-transparent rounded-full animate-spin'></div>
                                    <p className='text-surface-400'>Loading orders...</p>
                                </div>
                            </div>
                        ) : (
                            <div className='glass rounded-2xl overflow-hidden'>
                                <div className='overflow-x-auto'>
                                    <table className='w-full text-sm'>
                                        <thead>
                                            <tr className='border-b border-surface-200 bg-surface-50/50'>
                                                <th className='py-3.5 px-4 text-left text-xs font-medium text-surface-400 uppercase tracking-wider'>Order ID</th>
                                                <th className='py-3.5 px-4 text-left text-xs font-medium text-surface-400 uppercase tracking-wider'>Customer</th>
                                                <th className='py-3.5 px-4 text-left text-xs font-medium text-surface-400 uppercase tracking-wider'>Items</th>
                                                <th className='py-3.5 px-4 text-left text-xs font-medium text-surface-400 uppercase tracking-wider'>Total</th>
                                                <th className='py-3.5 px-4 text-left text-xs font-medium text-surface-400 uppercase tracking-wider'>Payment</th>
                                                <th className='py-3.5 px-4 text-left text-xs font-medium text-surface-400 uppercase tracking-wider'>Status</th>
                                                <th className='py-3.5 px-4 text-left text-xs font-medium text-surface-400 uppercase tracking-wider'>Date</th>
                                                <th className='py-3.5 px-4 text-left text-xs font-medium text-surface-400 uppercase tracking-wider'>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orders.map((order) => (
                                                <React.Fragment key={order._id}>
                                                    <tr className={`border-b border-surface-100 hover:bg-surface-50/50 transition-colors ${expandedOrder === order._id ? 'bg-surface-50/80' : ''
                                                        }`}>
                                                        <td className='py-3 px-4'>
                                                            <span className='font-mono text-xs text-surface-500'>#{order._id.slice(-8)}</span>
                                                        </td>
                                                        <td className='py-3 px-4'>
                                                            <button
                                                                onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                                                                className='text-primary-600 hover:text-primary-700 font-medium text-left flex items-center gap-1'
                                                            >
                                                                {order.user?.name || 'N/A'}
                                                                <svg className={`w-3.5 h-3.5 transition-transform duration-300 ${expandedOrder === order._id ? 'rotate-180' : ''
                                                                    }`} fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                                                                </svg>
                                                            </button>
                                                        </td>
                                                        <td className='py-3 px-4 text-surface-600'>{order.items?.length || 0}</td>
                                                        <td className='py-3 px-4 font-semibold text-surface-900'>${order.total?.toFixed(2)}</td>
                                                        <td className='py-3 px-4'>
                                                            <span className='text-xs font-medium text-surface-500 uppercase'>{order.paymentMethod}</span>
                                                        </td>
                                                        <td className='py-3 px-4'>
                                                            <select
                                                                value={order.status}
                                                                onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                                                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border cursor-pointer ${getStatusColor(order.status)}`}
                                                            >
                                                                <option value='Processing'>Processing</option>
                                                                <option value='Shipped'>Shipped</option>
                                                                <option value='Delivered'>Delivered</option>
                                                                <option value='Cancelled'>Cancelled</option>
                                                            </select>
                                                        </td>
                                                        <td className='py-3 px-4 text-surface-400 text-xs'>
                                                            {new Date(order.createdAt).toLocaleDateString()}
                                                        </td>
                                                        <td className='py-3 px-4'>
                                                            <button
                                                                onClick={() => deleteOrder(order._id)}
                                                                className='px-3 py-1.5 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 transition-colors'
                                                            >
                                                                Delete
                                                            </button>
                                                        </td>
                                                    </tr>
                                                    {/* Expanded shipping details */}
                                                    {expandedOrder === order._id && (
                                                        <tr key={`${order._id}-details`} className='border-b border-surface-200 bg-surface-50/50'>
                                                            <td colSpan={8} className='py-5 px-6'>
                                                                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                                                                    {/* Shipping Address */}
                                                                    <div className='bg-white rounded-xl p-4 border border-surface-200'>
                                                                        <h4 className='text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3 flex items-center gap-2'>
                                                                            <svg className='w-3.5 h-3.5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                                                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' />
                                                                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
                                                                            </svg>
                                                                            Shipping Address
                                                                        </h4>
                                                                        <div className='text-sm space-y-1'>
                                                                            <p className='font-semibold text-surface-800'>
                                                                                {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
                                                                            </p>
                                                                            <p className='text-surface-600'>{order.shippingAddress?.street}</p>
                                                                            <p className='text-surface-600'>
                                                                                {order.shippingAddress?.city}{order.shippingAddress?.state ? `, ${order.shippingAddress.state}` : ''}
                                                                                {order.shippingAddress?.zipcode ? ` ${order.shippingAddress.zipcode}` : ''}
                                                                            </p>
                                                                            <p className='text-surface-600'>{order.shippingAddress?.country}</p>
                                                                        </div>
                                                                    </div>
                                                                    {/* Contact Info */}
                                                                    <div className='bg-white rounded-xl p-4 border border-surface-200'>
                                                                        <h4 className='text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3 flex items-center gap-2'>
                                                                            <svg className='w-3.5 h-3.5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                                                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
                                                                            </svg>
                                                                            Contact
                                                                        </h4>
                                                                        <div className='text-sm space-y-2'>
                                                                            <div className='flex items-center gap-2 text-surface-600'>
                                                                                <svg className='w-4 h-4 text-surface-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                                                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
                                                                                </svg>
                                                                                {order.shippingAddress?.email || order.user?.email || 'N/A'}
                                                                            </div>
                                                                            <div className='flex items-center gap-2 text-surface-600'>
                                                                                <svg className='w-4 h-4 text-surface-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                                                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' />
                                                                                </svg>
                                                                                {order.shippingAddress?.phone || order.user?.phone || 'N/A'}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    {/* Order Items */}
                                                                    <div className='bg-white rounded-xl p-4 border border-surface-200'>
                                                                        <h4 className='text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3 flex items-center gap-2'>
                                                                            <svg className='w-3.5 h-3.5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                                                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' />
                                                                            </svg>
                                                                            Items
                                                                        </h4>
                                                                        <div className='text-sm space-y-1.5'>
                                                                            {order.items?.map((item, idx) => (
                                                                                <div key={idx} className='flex justify-between text-surface-600'>
                                                                                    <span className='truncate max-w-[180px]'>
                                                                                        {item.name || item.product?.name || 'Product'} {item.size && `(${item.size})`}
                                                                                    </span>
                                                                                    <span className='text-surface-400 ml-2'>x{item.quantity}</span>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                        {order.subtotal != null && (
                                                                            <div className='text-xs text-surface-400 mt-3 pt-3 border-t border-surface-100 space-y-1'>
                                                                                <div className='flex justify-between'>
                                                                                    <span>Subtotal</span>
                                                                                    <span>${order.subtotal?.toFixed(2)}</span>
                                                                                </div>
                                                                                <div className='flex justify-between'>
                                                                                    <span>Delivery</span>
                                                                                    <span>${order.deliveryFee?.toFixed(2) || '0.00'}</span>
                                                                                </div>
                                                                                <div className='flex justify-between font-semibold text-surface-800'>
                                                                                    <span>Total</span>
                                                                                    <span>${order.total?.toFixed(2)}</span>
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </React.Fragment>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                {orders.length === 0 && (
                                    <div className='text-center py-16'>
                                        <div className='w-16 h-16 rounded-2xl bg-surface-100 flex items-center justify-center mx-auto mb-4'>
                                            <svg className='w-8 h-8 text-surface-300' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' />
                                            </svg>
                                        </div>
                                        <p className='text-surface-400'>No orders found.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* ==================== USERS TAB ==================== */}
                {activeTab === 'users' && (
                    <div className='animate-fade-up'>
                        <h3 className='text-lg font-semibold text-surface-900 mb-6'>
                            All Users <span className='text-surface-400 font-normal'>({users.length})</span>
                        </h3>
                        {usersLoading ? (
                            <div className='flex items-center justify-center py-20'>
                                <div className='flex flex-col items-center gap-4'>
                                    <div className='w-10 h-10 border-2 border-primary-500 border-t-transparent rounded-full animate-spin'></div>
                                    <p className='text-surface-400'>Loading users...</p>
                                </div>
                            </div>
                        ) : (
                            <div className='glass rounded-2xl overflow-hidden'>
                                <div className='overflow-x-auto'>
                                    <table className='w-full text-sm'>
                                        <thead>
                                            <tr className='border-b border-surface-200 bg-surface-50/50'>
                                                <th className='py-3.5 px-4 text-left text-xs font-medium text-surface-400 uppercase tracking-wider'>User</th>
                                                <th className='py-3.5 px-4 text-left text-xs font-medium text-surface-400 uppercase tracking-wider'>Email</th>
                                                <th className='py-3.5 px-4 text-left text-xs font-medium text-surface-400 uppercase tracking-wider'>Role</th>
                                                <th className='py-3.5 px-4 text-left text-xs font-medium text-surface-400 uppercase tracking-wider'>Phone</th>
                                                <th className='py-3.5 px-4 text-left text-xs font-medium text-surface-400 uppercase tracking-wider'>Joined</th>
                                                <th className='py-3.5 px-4 text-left text-xs font-medium text-surface-400 uppercase tracking-wider'>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.map((u) => (
                                                <tr key={u._id} className='border-b border-surface-100 hover:bg-surface-50/50 transition-colors'>
                                                    <td className='py-3 px-4'>
                                                        <div className='flex items-center gap-3'>
                                                            <div className='w-9 h-9 rounded-xl bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center text-white text-xs font-bold shadow-sm'>
                                                                {u.name?.charAt(0)?.toUpperCase() || '?'}
                                                            </div>
                                                            <span className='font-medium text-surface-800'>{u.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className='py-3 px-4 text-surface-500'>{u.email}</td>
                                                    <td className='py-3 px-4'>
                                                        <select
                                                            value={u.role}
                                                            onChange={(e) => updateUserRole(u._id, e.target.value)}
                                                            className={`px-2.5 py-1 rounded-full text-xs font-medium border cursor-pointer ${u.role === 'admin'
                                                                    ? 'bg-primary-50 text-primary-700 border-primary-200'
                                                                    : 'bg-surface-100 text-surface-600 border-surface-200'
                                                                }`}
                                                        >
                                                            <option value='user'>User</option>
                                                            <option value='admin'>Admin</option>
                                                        </select>
                                                    </td>
                                                    <td className='py-3 px-4 text-surface-500'>{u.phone || 'N/A'}</td>
                                                    <td className='py-3 px-4 text-surface-400 text-xs'>
                                                        {new Date(u.createdAt).toLocaleDateString()}
                                                    </td>
                                                    <td className='py-3 px-4'>
                                                        <button
                                                            onClick={() => deleteUser(u._id)}
                                                            className='px-3 py-1.5 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 transition-colors'
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                {users.length === 0 && (
                                    <div className='text-center py-16'>
                                        <div className='w-16 h-16 rounded-2xl bg-surface-100 flex items-center justify-center mx-auto mb-4'>
                                            <svg className='w-8 h-8 text-surface-300' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' />
                                            </svg>
                                        </div>
                                        <p className='text-surface-400'>No users found.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Admin