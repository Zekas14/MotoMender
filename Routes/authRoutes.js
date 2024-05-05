const express = require("express");
const authServices = require("../Apis/authServices");

const router = express.Router();
router.post("/register", authServices.register);

router.patch('/verfiyEmail',authServices.emailVerfied);
router.post("/forgetPassword", authServices.forgetPassword);
router.patch("/resetPassword", authServices.resetPassword);
router.post("/login", authServices.logIn);
router.post("/resendEmailVerification", authServices.resendEmailVerification);

router.post("/google",authServices.signUpWithGoogle);

router.use(authServices.protect);
router.use(authServices.retrictTo("admin"));

router.delete("/deleteAccount/:userId", authServices.deleteAccount);
router.put("/updateAccount", authServices.updateAccount);
router.use(authServices.retrictTo("admin", "user"));

router.post("/uploadProfileImage/:userId", authServices.uploadProfileImage);
router.patch("/updatePassword", authServices.updatePassword);
module.exports = router;
