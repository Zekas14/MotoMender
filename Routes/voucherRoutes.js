const express = require("express");
const voucherServices = require('../Apis/voucherServices');
const authServices = require("../Apis/authServices");

router = express.Router();
router.use(authServices.protect);
router.use(authServices.retrictTo("admin"));
router.post("/addVoucher", voucherServices.addVoucher);
router.delete("/deleteVoucher/:id", voucherServices.deleteVoucher);
router.get("/getAllVouchers", voucherServices.getAllVouchers);
router.post("/redeemVoucher", authServices.retrictTo("user"), voucherServices.redeemVoucher);
module.exports = router;


