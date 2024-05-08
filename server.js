const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const connectToDb = require("./config/database");
const {app,server} = require("./app");
const socketIo = require('./utils/sockeIo');
const port = process.env.PORT || 800;

// Connecting to database
connectToDb();
//Socket Io 
socketIo(server);
app.listen(port, () => {
  console.log("Server is ruuning on port 800!");
});
