const mongoose = require("mongoose");
const validator = require("validator");

const productSchema = mongoose.Schema({
  productId: {
    type: String,
    default: function () {
      return this._id.toHexString();
    },
    alias: "_id",
  },
  name: {
    type: String,
    required: [true, "product must have a name"],
  },
  description: {
    type: String,
    required: [true, "product must have a description"],
  },
  price: {
    type: Number,
    required: [true, "product must have a price"],
    min: [0, "price must be greater than 0"],
  },
  category: {
    type:mongoose.Types.ObjectId,
    ref : 'Category',
    required: [true, "product must have a category"],
    // enum: {
    //   values: [
    //     "Maintenance & Repair",
    //     "Car Wash & Detailing",
    //     "Towing & Roadside Assistance",
    //     "Other Services",
    //   ],
    //   message:
    //     "Category must be one of the following: Maintenance & Repair, Car Wash & Detailing, Towing & Roadside Assistance, Other Services",
    // },
  },
  imagePath: {
    type: String,
    default: "https://via.placeholder.com/150",
    validator: {
      validator: function (path) {
        return validator.isURL(path);
      },
      message: "image path must be a valid URL",
    },
  },
    orderQuantity: {
      type: Number
    },
  
  ratingAverage: {
    type: Number,
    default: 0,
  },
 
});
const Product = mongoose.model("Product", productSchema);


module.exports = Product;
