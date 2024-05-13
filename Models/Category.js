const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const categorySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: [true , 'Name Can\'t be repeated']
    },
}

);
const Category = mongoose.model('Category', categorySchema);
module.exports = Category;