import express from 'express'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import Product from '../models/Product.js'
import Order from '../models/Order.js'
import User from '../models/User.js'
import { protect, adminOnly } from '../middleware/auth.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const router = express.Router()

// Multer config for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', 'uploads'))
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
        const ext = path.extname(file.originalname)
        cb(null, uniqueSuffix + ext)
    }
})

const fileFilter = (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
    if (allowed.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(new Error('Only JPEG, PNG, WebP, GIF, and AVIF images are allowed'), false)
    }
}

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB
})

// All admin routes require authentication + admin role
router.use(protect, adminOnly)

// ==================== IMAGE UPLOAD ====================

// POST /api/admin/upload - Upload product images (single or multiple)
router.post('/upload', upload.array('images', 10), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No images uploaded' })
        }
        const urls = req.files.map((file) => `/uploads/${file.filename}`)
        res.json({ urls })
    } catch (error) {
        res.status(500).json({ message: 'Upload failed', error: error.message })
    }
})

// ==================== PRODUCT MANAGEMENT ====================

// GET /api/admin/products - Get all products
router.get('/products', async (req, res) => {
    try {
        const products = await Product.find({}).sort({ date: -1 })
        res.json(products)
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
})

// POST /api/admin/products - Create a product
router.post('/products', async (req, res) => {
    try {
        const { name, description, price, image, category, subCategory, sizes, bestseller, stock } = req.body
        const product = await Product.create({
            name, description, price, image, category, subCategory, sizes, bestseller, stock
        })
        res.status(201).json(product)
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
})

// PUT /api/admin/products/:id - Update a product
router.put('/products/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        )
        if (!product) {
            return res.status(404).json({ message: 'Product not found' })
        }
        res.json(product)
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
})

// DELETE /api/admin/products/:id - Delete a product
router.delete('/products/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id)
        if (!product) {
            return res.status(404).json({ message: 'Product not found' })
        }
        res.json({ message: 'Product deleted successfully' })
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
})

// ==================== ORDER MANAGEMENT ====================

// GET /api/admin/orders - Get all orders
router.get('/orders', async (req, res) => {
    try {
        const orders = await Order.find({})
            .sort({ createdAt: -1 })
            .populate('user', 'name email phone')
            .populate('items.product', 'name price image')
        res.json(orders)
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
})

// PUT /api/admin/orders/:id - Update order status
router.put('/orders/:id', async (req, res) => {
    try {
        const { status } = req.body
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        ).populate('user', 'name email')
        if (!order) {
            return res.status(404).json({ message: 'Order not found' })
        }
        res.json(order)
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
})

// DELETE /api/admin/orders/:id - Delete an order
router.delete('/orders/:id', async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id)
        if (!order) {
            return res.status(404).json({ message: 'Order not found' })
        }
        res.json({ message: 'Order deleted successfully' })
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
})

// ==================== USER MANAGEMENT ====================

// GET /api/admin/users - Get all users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find({}).select('-password').sort({ createdAt: -1 })
        res.json(users)
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
})

// PUT /api/admin/users/:id - Update user (role, etc.)
router.put('/users/:id', async (req, res) => {
    try {
        const { name, email, role, phone } = req.body
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { name, email, role, phone },
            { new: true, runValidators: true }
        ).select('-password')
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }
        res.json(user)
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
})

// DELETE /api/admin/users/:id - Delete a user
router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }
        res.json({ message: 'User deleted successfully' })
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
})

// ==================== DASHBOARD STATS ====================

// GET /api/admin/stats - Get dashboard statistics
router.get('/stats', async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments()
        const totalOrders = await Order.countDocuments()
        const totalUsers = await User.countDocuments()
        const recentOrders = await Order.find({}).sort({ createdAt: -1 }).limit(5)
            .populate('user', 'name email')

        const revenue = await Order.aggregate([
            { $match: { status: { $ne: 'Cancelled' } } },
            { $group: { _id: null, total: { $sum: '$total' } } }
        ])

        res.json({
            totalProducts,
            totalOrders,
            totalUsers,
            totalRevenue: revenue.length > 0 ? revenue[0].total : 0,
            recentOrders
        })
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
})

export default router