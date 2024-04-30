const mongoose = require("mongoose");
const url = process.env.MONGO_ATLAS_URI;
// const url = process.env.MONGO_LOCAL_URI;
function connectToDB() {
  mongoose.connect(url).then(() => {
    console.log("Connected Successfully");
  });
}
module.exports = connectToDB;
