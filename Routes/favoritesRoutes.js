const express = require("express");
const favoriteServices = require("../Apis/favoriteServices");
const router = express.Router();
router.get("/getFavoriteProducts/:userId/favoriteProducts",favoriteServices.getAllFavoriteProduct)
router.post("/addToFavorites",favoriteServices.addToFavorites);
router.delete("/removeFromFavorites",favoriteServices.removeFromFavorites);
module.exports = router;