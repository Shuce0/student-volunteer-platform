const express = require("express");
const router = express.Router();
const goodDeedController = require("../controllers/goodDeedController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.get("/", goodDeedController.getAllGoodDeeds);
router.get(
  "/pending",
  authMiddleware,
  roleMiddleware(["admin"]),
  goodDeedController.getPendingGoodDeeds,
);
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["user", "admin"]),
  goodDeedController.createGoodDeed,
);
router.get("/user/:userId", goodDeedController.getUserGoodDeeds);
router.put(
  "/:id/verify",
  authMiddleware,
  roleMiddleware(["admin"]),
  goodDeedController.verifyGoodDeed,
);

module.exports = router;
