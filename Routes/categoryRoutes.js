const CategoryServices = require('../Apis/categoryServices');
const express = require('express');
const router = express.Router();

router.get('/', CategoryServices.getAllCategories);
router.get('/:id', CategoryServices.getOneCategory);
router.post('/', CategoryServices.createCategory);
router.put('/:id', CategoryServices.updateCategory);
module.exports = router ;