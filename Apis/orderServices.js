const Order = require('../Models/orderModel');
const ApiFeatures = require('./../utils/APIProductFeatures');
const User = require('./../Models/User');


exports.placeNewOrder = async (req, res) => {
    try { 
        const { userId } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('Please Sign in to Continue');
        }
      
        const order = await Order.create(req.body);
        res.status(201).json({
            status: 201, 
            message: 'Order Placed Successfully',
            data: {
                order
            }
        });
    } catch(e) {
        if (e.name === 'CastError') {
            res.status(404).json({
                status: 404,
                message: 'Please Sign in to Continue'
            });
        } else {
            console.log(e.message);
            res.status(404).json({
                status: 404,
                message: e.message
            });
        }
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        const features = new ApiFeatures(Order.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();

            let orders = await features.query.populate({
                path: 'products',
                select: '-_id -__v'
            }).select('-_id');

        res.status(200).json({
            status: 'Success',
            count: orders.length,
            orders :orders, 
            
        });
    } catch (e) {
        res.status(404).json({
            status: "Failed",
            message: e.message
        });
    }
};


exports.getUserOrders = async (req,res) => {
    
    try { 
        const {userId} =req.body
        const features = new ApiFeatures(Order.find({userId :userId}), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();

        
        let orders = await features.query.populate({
            path: 'products.productId',
            select: '-_id -__v'
        }).select('-_id');
        
        res.status(200).json({
            status: 'Success',
            count : orders.length,
            orders :orders, 

        })


    }catch(e) {
        res.status(404).json({
            status:"Failed",
            message: e.message
        })  
    }
}



exports.getOrderById = async (req, res) => {
    try { 
        const {orderId}=req.body
        const order = await Order.findOne({orderId: orderId});
        if (!order) {
            return res.status(404).json({
                status: 'Failed',
                message: 'Order not found'
            });
        }

        res.status(200).json({
            status: 'Success',
            data: {
                order
            }
        });
    } catch (e) {
        res.status(500).json({
            status: 'Failed',
            message: e.message
        });
    }
};

exports.deleteOrderById = async(req,res)=> {
    try{ 
    const {orderId} = req.body
       await Order.findOneAndDelete({orderId :orderId});
       res.status(204).json({
        status:"Success" ,
        data: null
       })

    }catch(e){
        res.status(404).json({
            status:'Failed',
            message: e.message
        })
    }
}

exports.getSellerOrders = async (req, res) => {
    try {
        const sellerId = req.params.id;

        const products = await Order.aggregate([
            { $unwind: "$products" }, // Unwind the products array to access each product separately
            { $match: { "products.sellerId": sellerId } } // Match products where sellerId matches params.id
        ]);

        res.status(200).json({
            status: 'Success',
            count: products.length,
            data: {
                products: products
            }
        });
    } catch (e) {
        res.status(404).json({
            status: 'Failed',
            message: e.message
        });
    }
}
