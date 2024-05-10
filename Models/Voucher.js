const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const voucherSchema = new Schema({
    code: {
        type :String,
        required : [true, "A Voucher Code Can't be null "],
        unique : [true, "A Voucher Code Must Be Unique "]
        },
    discount: Number,
    validUntil: Date,
    maxUsage: Number,
    usedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});
const Voucher = mongoose.model("Voucher",voucherSchema);
module.exports = Voucher;