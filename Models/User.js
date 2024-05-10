const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;
const userSchema = new Schema({
  googleId: {
    type: String,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    length: 25,
  },
  email: {
    type: String,
    required: true,
    index: true,
    validate: {
      validator: function (email) {
        return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
      },
      message: (props) => `${props.value} is not a valid email address!`,
    },
    
  },
  password: {
    type: String,
    required: true,
    min: 8,
    max: 20,
    validate: {
      validator: function (password) {
        return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/.test(password);
      },
      message: (props) => `${props.value} is not a valid Password!`,
    },
  },
  phone: {
    type: String,
    required: true,
    length: 11,
    validate: {
      validator: function (phone) {
        return /^[0-9]{11}$/.test(phone);
      },
      message: (props) => `${props.value} is not a valid phone number`,
    },
  },
  address: {
    type: String,
    required: true,
    length: 100,
  },
  role: {
    type: String,
    required: true,
    enum: ["user", "admin", "provider"],
    default: "user",
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
  profileImage: {
    type: String,
    default:
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  },
    favorites: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  emailVerify: {
    type: String,
  },
  isVerified:{
    type : Boolean,
    default : false
  },
  resetPasswordOTP: {
    type: String,
  },
  resetPasswordExpires: {
    type: Date,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
const User = mongoose.model("User", userSchema);

module.exports = User;
