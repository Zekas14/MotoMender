const reviewServices = require('../Apis/reviewServices');
const express = require('express');
const router = express.Router();
router.get('/',reviewServices.getAllComments);
router.post('/addcomment',reviewServices.addComment);
router.delete('/deletecomment/:commentId',reviewServices.deleteComment);
router.patch('/editcomment/:commentId',reviewServices.editComment);
module.exports =router;