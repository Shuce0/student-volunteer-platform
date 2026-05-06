const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/me", authMiddleware, authController.getCurrentUser);
router.put("/me", authMiddleware, authController.updateCurrentUser);
router.get(
  "/pending-clubs",
  authMiddleware,
  roleMiddleware(["admin"]),
  authController.getPendingClubApplications,
);
router.put(
  "/clubs/:id/approve",
  authMiddleware,
  roleMiddleware(["admin"]),
  authController.approveClubApplication,
);

module.exports = router;
