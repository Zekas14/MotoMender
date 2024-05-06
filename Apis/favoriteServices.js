const User = require("../Models/User");
const Product  = require('../Models/productModel')

exports.getAllFavoriteProduct = async (req, res) => {
    try {
        const userId = req.body.userId;
        const user = await User.findById(userId).populate('favorites');
        if (!user) {
          return res.status(404).json({status: 404, message: 'User not found' });
        }
        const favoriteProducts = user.favorites;    
        res.status(200).json({
          products : favoriteProducts
        });
    } catch (error) {
      res.status(500).json({ status: 500,message: 'Error fetching favorite products for user' });
    }
;}
exports.addToFavorites = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    const user = await User.findById(userId);
    const product= await Product.findById(productId);
    if (!user) {
      throw new Error('User not found');
    }
    if (!user.favorites.includes(req.productId)) {
      user.favorites.push(productId);
      await user.save();
      res.status(200).json(
         product
      )
    }
  } catch (error) {
    res.status(500).json({
        status : 500,
       message: error.message
    });
  }
};

 exports.removeFromFavorites = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    user.favorites = user.favorites.filter(id => id.toString() !== productId.toString());
    await user.save();

    res.status(204).json({
      status:204,
      message :'Favorites Delete Successfuly'
    })
    return user;
  } catch (error) {
    throw new Error('Error removing product from favorites: ' + error.message);
  }
};
