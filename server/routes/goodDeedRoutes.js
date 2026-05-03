const express = require("express");
const router = express.Router();
const goodDeedController = require("../controllers/goodDeedController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", goodDeedController.getAllGoodDeeds);
router.post("/", authMiddleware, goodDeedController.createGoodDeed);
router.get("/user/:userId", goodDeedController.getUserGoodDeeds);
router.put("/:id/verify", authMiddleware, goodDeedController.verifyGoodDeed);

module.exports = router;
