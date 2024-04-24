const Product = require("../Models/productModel");
const APIProductFeatures = require("../utils/APIProductFeatures");

exports.getProduct = async (req, res) => {
  try {
    if (Object.keys(req.query).length > 0) {
      const features = new APIProductFeatures(Product.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
      const result = await features.query;
      // const [result, count] = await Promise.all([
      //   features.query,
      //   features.count(),
      // ]);
      if (result.length > 0) {
        res.status(200).json({
          status: "success",
          // count,
          data: {
            result,
          },
        });
      } else {
        res.status(404).json({
          status: "fail",
          message: "Product not found",
        });
      }
    } else {
      const productsQuery = Product.find();
      productsQuery.select("-__v");
      const products = await productsQuery;

      res.status(200).json({
        status: "success",
        data: {
          products,
        },
      });
    }
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);

    delete product["__v"];
    res.status(201).json({
      status: "success",
      massage: "Product created",
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      return res.status(404).json({
        status: "fail",
        message: "Product not found",
      });
    }
    res.status(200).json({
      status: "success",
      data: {
        product,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({
        status: "fail",
        message: "Product not found",
      });
    }
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};
