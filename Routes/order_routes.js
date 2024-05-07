const orderController = require('./../Apis/orderServices')
const express = require('express');

const router= express.Router();


router.route('/')
.get(orderController.getAllOrders)
.post(orderController.placeNewOrder);



router.route('/getOrder')
.get(orderController.getOrderById)
.delete(orderController.deleteOrderById)

router.route('/user')
.get(orderController.getUserOrders);



module.exports= router;