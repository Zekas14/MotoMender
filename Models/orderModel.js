const mongoose = require('mongoose');
const Product = require('./productModel');

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
    products: [{
        productCode: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        sellerId: {
            type: String,
            required: [true, "SellerId is required"]
        },
        imgUrl: {
            type: String,
            required: [true, "imgUrl is required"]
        },
        price: {
            type: Number,
            required: [true, 'price is required'],
        },
        quantity: {
            type: Number,
            required: [true, 'Product Quantity is required']
        },
    }]
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
