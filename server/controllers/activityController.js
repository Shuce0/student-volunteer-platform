const Activity = require("../models/Activity");
const User = require("../models/User");

exports.getAllActivities = async (req, res) => {
  try {
    const activities = await Activity.find()
      .populate("organizer", "name email role")
      .populate("registeredParticipants", "name");

    res.json(activities);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch activities", error: error.message });
  }
};

exports.getActivityById = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id)
      .populate("organizer", "name email role")
      .populate("registeredParticipants", "name email");

    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    res.json(activity);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch activity", error: error.message });
  }
};

exports.createActivity = async (req, res) => {
  try {
    const {
      title,
      description,
      date,
      location,
      category,
      maxParticipants,
      points,
    } = req.body;

    const activity = new Activity({
      title,
      description,
      image: req.file ? `/uploads/${req.file.filename}` : req.body.image,
      date,
      location,
      category,
      maxParticipants,
      points,
      organizer: req.userId,
    });

    await activity.save();
    res
      .status(201)
      .json({ message: "Activity created successfully", activity });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create activity", error: error.message });
  }
};

exports.registerForActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    if (activity.registeredParticipants.includes(req.userId)) {
      return res
        .status(400)
        .json({ message: "Already registered for this activity" });
    }

    if (activity.registeredParticipants.length >= activity.maxParticipants) {
      return res.status(400).json({ message: "Activity is full" });
    }

    activity.registeredParticipants.push(req.userId);
    await activity.save();

    // Update user points
    await User.findByIdAndUpdate(req.userId, {
      $inc: { points: activity.points },
    });

    res.json({ message: "Successfully registered for activity" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to register", error: error.message });
  }
};
