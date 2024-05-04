const cart = require('./../Models/cartModel');
const APIProductFeatures = require("../utils/APIProductFeatures");

exports.getUserCart = async (req, res) => {
    try {
        const data = await cart.find().select("-__v").select("-_id");

        res.status(200).json({
            status: 200,
            data: {
                data
            }
        });

    } catch (e) {
        res.status(404).json({
            status: 404,
            message: e.message
        });
    }
}

exports.addToCart = async (req, res) => {
    try {
        const data = await cart.create(req.body);
        res.status(201).json({
            status: 201,
            data: {
                data
            }
        });

    } catch (e) {
        res.status(404).json({
            status: 404,
            message: e.message
        });
    }
}
