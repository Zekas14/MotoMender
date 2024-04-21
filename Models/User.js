const mongoose = require('mongoose');
const { validate } = require('./Review');

const Schema =  mongoose.Schema;
const userSchema = new Schema({
    name : {
        type: String ,
        required: true,
        length : 25,

    },
    email : {
        type : String ,
        required : true,
        index : true,
        validate :{
        validator:
        function(email) {
        return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
    },
    message: props => `${props.value} is not a valid email address!`
        }
},
    password : {
        type : String, 
        required : true,
        min : 8,
        max : 20,
        validate : {
        validator:
        function(password) {
            return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/.test(password);

    },
    message: props => `${props.value} is not a valid Password!`
    }
    },
    phone :{
        type :String , 
        required : true,
        length:11,
        validate:{
            validator: function(phone) {
                return /^[0-9]{11}$/.test(phone);
            },
            message: props => `${props.value} is not a valid phone number`
        }
    },
    address: {
        type : String,
        required : true,
        length:100
    }
});

const User = mongoose.model('User',userSchema);

module.exports = User;  