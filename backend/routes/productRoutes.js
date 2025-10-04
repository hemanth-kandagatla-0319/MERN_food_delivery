const express = require("express");
const router = express.Router();    
const productController = require("../controllers/productController");
const verifyToken = require("../middlewares/verifyToken");

router.post("/add-product/:id", verifyToken, productController.addProduct);
router.get("/:id/get-products", productController.getProductByFirmID);
router.delete("/delete-product/:id", verifyToken, productController.deleteProductById);

module.exports = router;