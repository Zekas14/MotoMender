const authRoutes = require("./Routes/authRoutes");
const ReviewRoutes = require("./Routes/reviewRoutes");
const adminRoutes = require("./Routes/AdminRoutes");
const productRouter = require("./Routes/productRoutes");
const supportRouter = require("./Routes/supportRoutes");
const categoryRouter = require("./Routes/categoryRoutes");
const orderRouter = require('./Routes/order_routes');
const passport = require('./utils/googleAuth');
const favouriteRouter = require('./Routes/favoritesRoutes');
const cartRouter= require('./Routes/cartRoutes')
const express = require("express");
const app = express();
const session = require('express-session');
const path = require('path')
const http= require("http");
const server = http.createServer(app);

    app.use(express.json());
    app.use(
        session({
            secret: process.env.SESSION_SECRET,
            resave: false,
            saveUninitialized: false,
        })
    );
    app.use(passport.initialize());
    app.use(passport.session());
    app.use('/imgs/userImages', express.static(path.join(__dirname, 'public/imgs/userImages')));
    app.use("/imgs/products", express.static("public/imgs/products"));
    app.use("/auth", authRoutes);
    app.use("/admin", adminRoutes);
    app.use("/products", productRouter);
    app.use("/review", ReviewRoutes);
    app.use("/orders",orderRouter);
    app.use("/favourites",favouriteRouter);
    app.use('/cart',cartRouter);
    app.use('/categories',categoryRouter);
    app.use("/Support",supportRouter);
    module.exports ={ 
            app,
            server
        };
