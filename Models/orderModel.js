const mongoose = require('mongoose');
const { ProductSchema, Product } = require('./productModel');

const orderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        default: function () {
            return this._id.toHexString();
        },
        alias: "_id",
    },
    orderDate: {
        type: Date, 
        default: Date.now
    },
    buyerId: {
        type: String,
        required: [true, 'BuyerId is required'],
    },
    products: []
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
