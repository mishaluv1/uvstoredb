import express from 'express'
import Order from '../models/Order.js'
import Product from '../models/Product.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

// POST /api/orders - Place a new order
router.post('/', protect, async (req, res) => {
    try {
        const { items, shippingAddress, paymentMethod, subtotal, deliveryFee, total } = req.body

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'No order items' })
        }

        // Populate product details for each item
        const orderItems = await Promise.all(
            items.map(async (item) => {
                const product = await Product.findById(item.product)
                return {
                    product: item.product,
                    name: product ? product.name : item.name,
                    price: product ? product.price : item.price,
                    image: product && product.image ? product.image[0] : item.image,
                    size: item.size,
                    quantity: item.quantity
                }
            })
        )

        const order = await Order.create({
            user: req.user._id,
            items: orderItems,
            shippingAddress,
            paymentMethod,
            subtotal,
            deliveryFee,
            total
        })

        res.status(201).json(order)
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
})

// GET /api/orders - Get user's orders
router.get('/', protect, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .populate('items.product', 'name price image')
        res.json(orders)
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
})

// GET /api/orders/:id - Get single order
router.get('/:id', protect, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('items.product', 'name price image')
        if (!order) {
            return res.status(404).json({ message: 'Order not found' })
        }
        if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' })
        }
        res.json(order)
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
})

export default router