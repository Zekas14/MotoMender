const User = require("../Models/User");
const Product = require('../Models/productModel');
const Cart = require('../Models/cartModel');
exports.getUserCartProducts = async (req, res) => {
  try {
      const userId = req.body.userId;
      const user = await User.findById(userId);

      if (!user) {
          return res.status(404).json({ status: 404, message: 'User not found' });
      }

      const cart = await Cart.findOne({ userId: userId });

      if (!cart) {
          return res.status(404).json({ status: 404, message: 'No Cart found' });
      }

      // Populate products before sending the response
      await cart.populate('products.productId');

      res.status(200).json({
          products: cart.products
      });

  } catch (error) {
      console.error(error);
      res.status(500).json({ status: 500, message: 'Error fetching cart products for user' });
  }
};

  exports.addToCart = async (req, res) => {
    try {
      const { userId, productId } = req.body;
      const user = await User.findById(userId);
  
      if (!user) {
        throw new Error('User not found');
      }
  
      let cartItem = await Cart.findOne({ userId: userId });
  
      if (cartItem) {
        const productIndex = cartItem.products.findIndex(product => String(product.productId) === String(productId));
  
        if (productIndex !== -1) {
          cartItem.products[productIndex].quantity += 1;
        } else {
          cartItem.products.push({ productId: productId, quantity: 1 });

        }
        await cartItem.populate('products.productId');
        cartItem = await cartItem.save();
        res.status(200).json(cartItem);
      } else {
        const newCartItem = new Cart({ userId: userId, products: [{ productId: productId, quantity: 1 }] });

        const savedCartItem = await newCartItem.save();
        res.status(200).json(savedCartItem);
      }
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: error.message
      });
    }
  };
  
  exports.removeFromCart = async (req, res) => {
    try {
      const { userId, productId } = req.body;
  
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }
  
      const cart = await Cart.findOne({ userId: userId });
  
      if (!cart) {
        throw new Error('Cart not found');
      }
  
      const productIndex = cart.products.findIndex(product => String(product.productId) === String(productId));
  
      if (productIndex === -1) {
        throw new Error('Product not found in cart');
      }
  
      cart.products.splice(productIndex, 1);
  
      await cart.save();
  
      res.status(204).json({
        status: 204,
        message: 'Product removed successfully'
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: 'Error removing product from cart: ' + error.message
      });
    }
  };exports.incrementQuantity = async (req, res) => {
    try {
      const { userId, productId } = req.body;
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }
  
      const cartItem = await Cart.findOne({ userId: userId });
  
      if (!cartItem) {
        throw new Error('Cart item not found');
      }
  
      const productIndex = cartItem.products.findIndex(product => String(product.productId) === String(productId));
  
      if (productIndex === -1) {
        throw new Error('Product not found in cart');
      }
  
      // Increment the quantity of the specific product
     cartItem.products[productIndex].quantity += 1;
     const incrementedProduct= cartItem.products[productIndex]
      // Save the updated cart item
      await cartItem.save();
  
      res.status(200).json(incrementedProduct);
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: 'Error incrementing quantity: ' + error.message
      });
    }
  }; 
  
  
  exports.decrementQuantity = async (req, res) => {
    try {
      const { userId, productId } = req.body;
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }
  
      const cartItem = await Cart.findOne({ userId: userId });
      if (!cartItem) {
        throw new Error('Cart item not found');
      }
  
      const productIndex = cartItem.products.findIndex(product => String(product.productId) === String(productId));
  
      if (productIndex === -1) {
        throw new Error('Product not found in cart');
      }
  
      if (cartItem.products[productIndex].quantity === 1) {
        // If the quantity is 1, remove the product from the cart
        cartItem.products.splice(productIndex, 1);
      } else {
        // Decrement the quantity of the specific product
        cartItem.products[productIndex].quantity -= 1;
      }
  
      // Save the updated cart item
      await cartItem.save();
  
      res.status(200).json(cartItem.products[productIndex]);
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: 'Error decrementing quantity: ' + error.message
      });
    }
  };
  
