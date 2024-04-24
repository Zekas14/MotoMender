const adminServices = require('../Apis/adminServices');
const express = require('express');
const router = express.Router();
router.get('/',adminServices.getAllUsers);
router.get('/:userId',adminServices.getOneUser);
router.patch('/blockUser/:userId',adminServices.blockUser);
router.delete('/deleteUser/:userId',adminServices.deleteUser);
module.exports = router ;