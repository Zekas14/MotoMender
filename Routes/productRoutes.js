const express = require("express");
const productController = require("../Apis/productServices");
const authServices = require("../Apis/authServices");

const productRouter = express.Router();

productRouter
  .route("/")
  .get(productController.getProduct)
  .post(
    authServices.protect,
    authServices.retrictTo("admin"),
    productController.uploadProductImg,
    productController.createProduct
  );
productRouter.use(authServices.protect, authServices.retrictTo("admin"));
productRouter
  .route("/:id")
  .get(productController.getProductsByCategories)
  .patch(
    authServices.protect,
    productController.uploadProductImg,
    productController.updateProduct
  )
  .delete(productController.deleteProduct);
module.exports = productRouter;
