const mongoose = require('mongoose');
const Product = require('./productModel');

const cartProductSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: [true, 'Quantity is required'],
        default: 1,
        min: [1, 'Quantity must be at least 1']
    },
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        select: false // Exclude _id from query results
    }
});

const cartSchema = new mongoose.Schema({
    products: [cartProductSchema]
}); 

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
