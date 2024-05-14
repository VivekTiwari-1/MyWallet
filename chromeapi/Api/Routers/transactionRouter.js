const express = require("express");
const authController = require("../Controllers/authController");

const router = express.Router();

router.get("/getTransaction", authController.getTransaction);
router.post("/createTransaction", authController.createTransaction);

module.exports = router;