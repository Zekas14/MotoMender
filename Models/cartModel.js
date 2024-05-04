const mongoose = require('mongoose');
const { ProductSchema, ProductModel } = require('./productModel');

const cartProductSchema = new mongoose.Schema({
    product: { type: ProductSchema, required: true },
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

const cartSchema = mongoose.Schema({
    products: [cartProductSchema]
}, ); 

const cart = mongoose.model('cart', cartSchema);

module.exports = cart;
