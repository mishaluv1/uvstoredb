import express from 'express'
import Product from '../models/Product.js'

const router = express.Router()

// GET /api/products
router.get('/', async (req, res) => {
    try {
        const { category, subCategory, search, bestseller } = req.query
        let query = {}
        if (category) query.category = category
        if (subCategory) query.subCategory = subCategory
        if (bestseller === 'true') query.bestseller = true
        if (search) query.name = { $regex: search, $options: 'i' }
        const products = await Product.find(query).sort({ date: -1 })
        res.json(products)
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
})

// GET /api/products/:id
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        if (!product) {
            return res.status(404).json({ message: 'Product not found' })
        }
        res.json(product)
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
})

export default router