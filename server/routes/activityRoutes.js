const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const activityController = require("../controllers/activityController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed"));
    }
    cb(null, true);
  },
});

router.get("/", activityController.getAllActivities);
router.get("/:id", activityController.getActivityById);
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["admin", "club"]),
  upload.single("image"),
  activityController.createActivity,
);
router.post(
  "/:id/register",
  authMiddleware,
  activityController.registerForActivity,
);

module.exports = router;
