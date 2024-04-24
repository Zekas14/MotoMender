const app = require('./app');

const connectToDb = require('./config/database');
const port = process.env.PORT || 800;

// Connecting to database
connectToDb();

app.listen(port, () => {
    console.log("Server is ruuning on port 800!");
})