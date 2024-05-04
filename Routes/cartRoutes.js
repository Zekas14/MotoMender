const cartServices = require('./../Apis/cartServices');
const express = require("express");

const router = express.Router();


router.route('/')
.get(cartServices.getUserCart)
.post(cartServices.addToCart);

module.exports=router;