const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "userId is required"]   
     },
    products: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: [true, "productId is required"]
        },
        quantity: {
            type: Number,
            default: 1
        }
    }]
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
