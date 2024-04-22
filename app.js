const userRoutes = require("./Routes/userRoutes");
const productRouter = require("./Routes/productRoutes");
const express = require("express");
const app = express();
app.use(express.json());
app.use("/user", userRoutes);
app.use("/products", productRouter);
module.exports = app;
