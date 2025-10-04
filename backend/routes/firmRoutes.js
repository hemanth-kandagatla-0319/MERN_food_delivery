const express = require("express");
const router = express.Router();    
const firmController = require("../controllers/firmController");
const verifyToken = require("../middlewares/verifyToken");

router.post("/add-firm", verifyToken, firmController.addFirm);
router.delete("/delete-firm/:id", verifyToken, firmController.deleteFirmById);

module.exports = router;