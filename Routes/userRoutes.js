const userServices = require('../Apis/userServices');
const express = require('express');
const router = express.Router();
router.get('',userServices.getAllUsers)
router.get('/:userId',userServices.getUserbyId);
router.post('/register',userServices.register);
router.post('/login',userServices.logIn);
router.delete('/deleteAccount/:userId',userServices.deleteAccount);
router.put('/updateAccount/:userId',userServices.updateAccount);
module.exports= router;