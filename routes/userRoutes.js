import express from 'express'
import User from '../models/User.js'
import { generateToken, protect } from '../middleware/auth.js'

const router = express.Router()

// POST /api/users/register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' })
        }
        const user = await User.create({ name, email, password })
        const token = generateToken(user._id)
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token
        })
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
})

// POST /api/users/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' })
        }
        const isMatch = await user.comparePassword(password)
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' })
        }
        const token = generateToken(user._id)
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
            address: user.address,
            token
        })
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
})

// GET /api/users/profile
router.get('/profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
            address: user.address,
            createdAt: user.createdAt
        })
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
})

// PUT /api/users/profile
router.put('/profile', protect, async (req, res) => {
    try {
        const { name, phone, address } = req.body
        const user = await User.findById(req.user._id)
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }
        if (name) user.name = name
        if (phone !== undefined) user.phone = phone
        if (address) user.address = { ...user.address, ...address }
        const updatedUser = await user.save()
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            phone: updatedUser.phone,
            address: updatedUser.address,
            createdAt: updatedUser.createdAt
        })
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
})

export default router