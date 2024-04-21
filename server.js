const app = require('./app');
const connectToDb = require('./config/database');

connectToDb();

app.listen(800, () => {
    console.log("Server is ruuning on port 800!");
})