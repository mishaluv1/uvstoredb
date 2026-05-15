import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { toast } from 'react-toastify'

export const ShopContext = createContext()

const API_URL = 'http://localhost:5000/api'

const ShopContextProvider = ({ children }) => {
    const currency = '$'
    const delivery_fee = 10
    const [search, setSearch] = useState('')
    const [showSearch, setShowSearch] = useState(false)
    const [cartItems, setCartItems] = useState({})
    const [products, setProducts] = useState([])
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(localStorage.getItem('uvstore_token'))
    const [loading, setLoading] = useState(true)

    // ==================== AUTH ====================

    const fetchUserProfile = useCallback(async () => {
        if (!token) return
        try {
            const res = await fetch(`${API_URL}/users/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (res.ok) {
                const data = await res.json()
                setUser(data)
            } else {
                localStorage.removeItem('uvstore_token')
                setToken(null)
                setUser(null)
            }
        } catch (err) {
            console.error('Failed to fetch profile:', err)
        }
    }, [token])

    useEffect(() => {
        if (token) {
            fetchUserProfile()
        }
    }, [token, fetchUserProfile])

    const login = async (email, password) => {
        try {
            const res = await fetch(`${API_URL}/users/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            })
            const data = await res.json()
            if (!res.ok) {
                toast.error(data.message || 'Login failed')
                return false
            }
            localStorage.setItem('uvstore_token', data.token)
            setToken(data.token)
            setUser({
                _id: data._id,
                name: data.name,
                email: data.email,
                role: data.role,
                phone: data.phone,
                address: data.address
            })
            toast.success('Logged in successfully!')
            return true
        } catch (err) {
            toast.error('Network error. Is the server running?')
            return false
        }
    }

    const register = async (name, email, password) => {
        try {
            const res = await fetch(`${API_URL}/users/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            })
            const data = await res.json()
            if (!res.ok) {
                toast.error(data.message || 'Registration failed')
                return false
            }
            localStorage.setItem('uvstore_token', data.token)
            setToken(data.token)
            setUser({
                _id: data._id,
                name: data.name,
                email: data.email,
                role: data.role
            })
            toast.success('Account created successfully!')
            return true
        } catch (err) {
            toast.error('Network error. Is the server running?')
            return false
        }
    }

    const logout = () => {
        localStorage.removeItem('uvstore_token')
        setToken(null)
        setUser(null)
        setCartItems({})
        toast.info('Logged out')
    }

    const updateProfile = async (profileData) => {
        try {
            const res = await fetch(`${API_URL}/users/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(profileData)
            })
            const data = await res.json()
            if (!res.ok) {
                toast.error(data.message || 'Update failed')
                return false
            }
            setUser(data)
            toast.success('Profile updated!')
            return true
        } catch (err) {
            toast.error('Network error')
            return false
        }
    }

    // ==================== PRODUCTS ====================

    const fetchProducts = useCallback(async () => {
        try {
            const res = await fetch(`${API_URL}/products`)
            if (res.ok) {
                const data = await res.json()
                if (data.length > 0) {
                    setProducts(data)
                }
            }
        } catch (err) {
            console.log('Backend not available, using local data')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchProducts()
    }, [fetchProducts])

    // ==================== CART ====================

    const addToCart = (itemId, size) => {
        if (!size) {
            toast.error('Please select a size')
            return
        }
        setCartItems((prev) => {
            const cartData = { ...prev }
            if (cartData[itemId]) {
                if (cartData[itemId][size]) {
                    cartData[itemId][size] += 1
                } else {
                    cartData[itemId][size] = 1
                }
            } else {
                cartData[itemId] = {}
                cartData[itemId][size] = 1
            }
            return cartData
        })
        toast.success('Added to cart')
    }

    const getCartCount = () => {
        let totalCount = 0
        for (const itemId in cartItems) {
            for (const size in cartItems[itemId]) {
                totalCount += cartItems[itemId][size]
            }
        }
        return totalCount
    }

    const updateQuantity = (itemId, size, quantity) => {
        setCartItems((prev) => {
            const cartData = { ...prev }
            if (quantity <= 0) {
                if (cartData[itemId]) {
                    delete cartData[itemId][size]
                    if (Object.keys(cartData[itemId]).length === 0) {
                        delete cartData[itemId]
                    }
                }
            } else {
                if (!cartData[itemId]) cartData[itemId] = {}
                cartData[itemId][size] = quantity
            }
            return cartData
        })
    }

    const getCartAmount = () => {
        let totalAmount = 0
        for (const itemId in cartItems) {
            const product = products.find((p) => p._id === itemId)
            if (!product) continue
            for (const size in cartItems[itemId]) {
                totalAmount += product.price * cartItems[itemId][size]
            }
        }
        return totalAmount
    }

    // ==================== ORDERS ====================

    const placeOrder = async (orderData) => {
        try {
            const res = await fetch(`${API_URL}/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(orderData)
            })
            const data = await res.json()
            if (!res.ok) {
                toast.error(data.message || 'Order failed')
                return null
            }
            return data
        } catch (err) {
            toast.error('Network error placing order')
            return null
        }
    }

    const value = {
        products,
        currency,
        delivery_fee,
        search,
        setSearch,
        showSearch,
        setShowSearch,
        cartItems,
        setCartItems,
        addToCart,
        getCartCount,
        updateQuantity,
        getCartAmount,
        user,
        token,
        login,
        register,
        logout,
        updateProfile,
        placeOrder,
        loading,
        API_URL
    }

    return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>
}

export const useShop = () => {
    const context = useContext(ShopContext)
    if (!context) {
        throw new Error('useShop must be used within a ShopContextProvider')
    }
    return context
}

export default ShopContextProvider