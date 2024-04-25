const express = require("express");
const productController = require("../Apis/productServices");

const productRouter = express.Router();

productRouter
  .route("/")
  .get(productController.getProduct)
  .post(productController.createProduct);
productRouter
  .route("/:id")
  .patch(productController.updateProduct)
  .delete(productController.deleteProduct);
module.exports = productRouter;
