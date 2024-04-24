const { max } = require('lodash');
const mongoose = require('mongoose');

const Schema =  mongoose.Schema;
const reviewSchema = new Schema({
    content :{
        type :String , 
        required : true,
        max : 400
    },
    userId :{
        type: String , 
        required : true
    },
    productId : 
    {
        type : String ,
        required : true
    },
    reviewDate : {
        type : Date,
        default : Date.now,
}
});
const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;