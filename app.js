const authRoutes = require("./Routes/authRoutes");
const ReviewRoutes = require("./Routes/reviewRoutes");
const adminRoutes = require("./Routes/AdminRoutes");
const productRouter = require("./Routes/productRoutes");
const express = require("express");
const path = require('path')
const app = express();
app.use(express.json());
app.use('/imgs/userImages', express.static(path.join(__dirname, 'public/imgs/userImages')));
app.use("/imgs/products", express.static("public/imgs/products"));
app.use("/user", authRoutes);
app.use("/admin", adminRoutes);
app.use("/products", productRouter);
app.use("/review", ReviewRoutes);

module.exports = app;
