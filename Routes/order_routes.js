const orderController = require('./../Apis/orderServices')
const express = require('express');

const router= express.Router();


router.route('/')
.get(orderController.getAllOrders)
.post(orderController.placeNewOrder);



router.route('/:id')
.get(orderController.getOrderById)
.delete(orderController.deleteOrderById)

router.route('/buyer/:id')
.get(orderController.getUserOrders);

router.route('/seller/:id')
.get(orderController.getSellerOrders);


module.exports= router;