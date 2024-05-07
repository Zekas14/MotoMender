const mongoose = require('mongoose');
const Product = require('./productModel');
const User = require('./User')

const orderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        default: function () {
          return this._id.toHexString();
        },
        alias: "_id",
      },
    userId : {
        type:  mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: [true, "userId is required"],
    },
    orderDate: {
        type: Date, 
        default: Date.now
    },
    status : {
        type: String,
        default : "preparing"
    },
    products: [{
        productId :{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: [true, "productId is required"],

        },
        quantity: {
            type :Number,
            default :1
        }
    }]
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
