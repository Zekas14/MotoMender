const cartServices = require('./../Apis/cartServices');
const express = require("express");
const { post } = require('./order_routes');

const router = express.Router();

router.route('/')
.post(cartServices.addToCart)
.delete(cartServices.removeFromCart)
.get(cartServices.getUserCartProducts)  


router.route('/products/increment')
.post(cartServices.incrementQuantity)

router.route('/products/decrement')
.post(cartServices.decrementQuantity)



module.exports=router;