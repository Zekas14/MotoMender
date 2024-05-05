const User = require("../Models/User");

exports.getAllFavoriteProduct = async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId).populate('favorites');
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        const favoriteProducts = user.favorites;    
        res.status(200).json({
          products : favoriteProducts
        });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching favorite products for user' });
    }
;}
exports.addToFavorites = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    if (!user.favorites.includes(req.productId)) {
      user.favorites.push(productId);
      await user.save();
      res.status(200).json({
        status : 200,
        message : "Product added to favorites",
        data : {
          user
        }
      })
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
    res.status(200).json(
      {
        status : 200,
        massage : "Product removed to favorites",
        data : {
          user
        }
      }
    )
    return user;
  } catch (error) {
    throw new Error('Error removing product from favorites: ' + error.message);
  }
};
