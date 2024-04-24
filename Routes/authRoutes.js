const authServices = require('../Apis/authServices');
const express = require('express');
const router = express.Router();
router.post('/register',authServices.register);
router.post('/login',authServices.logIn);
router.delete('/deleteAccount/:userId',authServices.deleteAccount);
router.put('/updateAccount/:userId',authServices.updateAccount);

module.exports= router;