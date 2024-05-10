const express = require("express");
const passport = require("../utils/googleAuth");
const authServices = require("../Apis/authServices");
const router = express.Router();
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get('/logout', (req, res) => {
    req.logout(); 
    req.session.destroy((err) => {
        if (err) {
            console.error("Error destroying session:", err);
            return res.status(500).json({
                status : 500,
                message :"Internal Server Error"}
            );
        }
        res.status(200).json({
            status : 200,
            message : "Logged Out , Session Destoried"
        })
    });
});
router.post("/register", authServices.register);
router.patch('/verfiyEmail',authServices.emailVerified);
router.post("/forgetPassword", authServices.forgetPassword);
router.patch("/resetPassword", authServices.resetPassword);
router.post("/login", authServices.logIn);
router.post("/resendEmailVerification", authServices.resendEmailVerification);
router.use(authServices.protect);
router.use(authServices.retrictTo("admin"));
router.delete("/deleteAccount/:userId", authServices.deleteAccount);
router.put("/updateAccount", authServices.updateAccount);
router.use(authServices.retrictTo("admin", "user"));
router.post("/uploadProfileImage/:userId", authServices.uploadProfileImage);
router.patch("/updatePassword", authServices.updatePassword);
module.exports = router;
