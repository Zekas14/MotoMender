const express = require('express');
const router = express.Router();
const SupportServices= require('../Apis/SupportServices');

// Define routes
router.post('/create', SupportServices.createChatRoom);
router.post('/send', SupportServices.sendMessage);
router.get('/get',SupportServices.getChatRoomMessages)

module.exports = router;
