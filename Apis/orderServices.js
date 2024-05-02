const Order = require('../Models/orderModel');
const ApiFeatures = require('./../utils/APIProductFeatures')


exports.placeNewOrder =async (req,res) => {
    
    try { 
        const order= await Order.create(req.body) ;
        res.status(201).json({
            status: 'Success', 
            data : {
                order
            }
        })  

    }catch(e){
        console.log(e.message)
        res.status(404).json({
            status:'Failed',
            message: e.message
        })
    }

}

exports.getAllOrders =async (req,res) => {
    try{ 
        const features = new ApiFeatures(Order.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();

       
        const query = await features.query;
        const orders= query;
        
        res.status(200).json({
            status: 'Success',
            count : orders.length,
            data: {
                orders
            }
        })

    }catch(e){ 
        res.status(404).json({
            status : "Failed",
            message : e.message
        })
    }
}

exports.getUserOrders = async (req,res) => {
    try { 
        const orders=await Order.find({buyerId :req.params.id})
        res.status(200).json({
            status: 'Success',
            count : orders.length,
            data: {
                orders
            }
        })


    }catch(e) {
        res.status(404).json({
            status:"Failed",
            message: e.message
        })
    }
}

exports.getOrderById =async (req,res)=>{
    try { 
        const orders=await Order.findById(req.params.id)
        res.status(200).json({
            status: 'Success',
            data: {
                orders
            }
        })

    }catch(e) {
        res.status(404).json({
            status:"Failed",
            message: e.message
        })
    }
}

exports.deleteOrderById = async(req,res)=> {
    try{ 
       await Order.findByIdAndDelete(req.params.id);
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
