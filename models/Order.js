import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        name: String,
        price: Number,
        image: String,
        size: String,
        quantity: { type: Number, required: true }
    }],
    shippingAddress: {
        firstName: String,
        lastName: String,
        email: String,
        street: String,
        city: String,
        state: String,
        zipcode: String,
        country: String,
        phone: String
    },
    paymentMethod: { type: String, enum: ['cod', 'stripe', 'razorpay'], default: 'cod' },
    subtotal: Number,
    deliveryFee: Number,
    total: Number,
    status: {
        type: String,
        enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Processing'
    },
    createdAt: { type: Date, default: Date.now }
})

const Order = mongoose.model('Order', orderSchema)
export default Order