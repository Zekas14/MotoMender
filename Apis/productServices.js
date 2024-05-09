const { filter } = require("lodash");
const Product = require("./../Models/productModel");
const APIProductFeatures = require("../utils/APIProductFeatures");
const multer = require("multer");
const fs = require("fs");

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/imgs/products");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `product-${Date.now()}.${ext}`);
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Not an image! Please upload only images."), false);
  }
};

const imgUpload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadProductImg = imgUpload.single("photo");

exports.getProduct = async (req, res) => {
  try {
    if (Object.keys(req.query).length > 0) {
      const features = new APIProductFeatures(Product.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
      const products = await features.query;
      // const [result, count] = await Promise.all([
      //   features.query,
      //   features.count(),
      // ]);
      if (products.length > 0) {
        res.status(200).json({
          status: "success",
          // count,
          data: {
            products,
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
exports.getProductsByCategories = async(req,res)=>{
  try {
    const products= Product.find({category : req.params.category});
    if(!products){
      return res.status(404).json({
         status : 404 , 
         message : "no products found related to this categories"
      })
    }
    res.status(200).json({
      status : 400,
      products 
    })    ;
  } catch (error) {
    res.status(500).json({
      status : 500,
      message : error.message
    })
  }
}
exports.createProduct = async (req, res) => {
  try {
    const filteredObject = filterObject(
      req.body,
      "name",
      "description",
      "price",
      "category"
    );
    if (req.file) {
      filteredObject.imagePath = `http://${req.get("host")}/imgs/products/${
        req.file.filename
      }`;
    }
    const product = await Product.create(filteredObject);

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
    const filteredObject = filterObject(
      req.body,
      "name",
      "description",
      "price",
      "category"
    );
    if (req.file) {
      filteredObject.imagePath = `http://${req.get("host")}/imgs/products/${
        req.file.filename
      }`;
    }
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      filteredObject,
      {
        runValidators: true,
      }
    );
    if (!product) {
      return res.status(404).json({
        status: "fail",
        message: "Product not found",
      });
    }
    fs.unlink(
      `public/imgs/products/${product.imagePath.split("/")[5]}`,
      (err) => {
        if (err) {
          console.log(err.message);
        }
      }
    );
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

function filterObject(obj, ...allowedFields) {
  const newObj = {};
  Object.keys(obj).forEach((key) => {
    if (allowedFields.includes(key)) newObj[key] = obj[key];
  });
  return newObj;
}
