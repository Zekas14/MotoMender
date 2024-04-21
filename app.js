const userRoutes = require('./Routes/userRoutes');
const express = require('express');
const app = express();
app.use(express.json());
app.use('/user',userRoutes);

module.exports = app;