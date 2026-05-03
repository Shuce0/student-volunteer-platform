const express = require("express");
const router = express.Router();
const activityController = require("../controllers/activityController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", activityController.getAllActivities);
router.get("/:id", activityController.getActivityById);
router.post("/", authMiddleware, activityController.createActivity);
router.post(
  "/:id/register",
  authMiddleware,
  activityController.registerForActivity,
);

module.exports = router;
