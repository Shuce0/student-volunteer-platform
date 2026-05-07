const Activity = require("../models/Activity");
const Registration = require("../models/Registration");
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

    const alreadyRegistered = activity.registeredParticipants.some(
      (participantId) => participantId.toString() === req.userId.toString(),
    );

    if (alreadyRegistered) {
      return res
        .status(400)
        .json({ message: "Already registered for this activity" });
    }

    if (activity.registeredParticipants.length >= activity.maxParticipants) {
      return res.status(400).json({ message: "Activity is full" });
    }

    activity.registeredParticipants.push(req.userId);
    await activity.save();

    await Registration.create({
      user: req.userId,
      activity: activity._id,
      status: "pending",
    });

    await User.findByIdAndUpdate(req.userId, {
      $addToSet: { registeredActivities: activity._id },
    });

    res.json({
      message:
        "Successfully registered for activity. Points will be added after approval.",
      registrationStatus: "pending",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to register", error: error.message });
  }
};

exports.getPendingRegistrations = async (req, res) => {
  try {
    const query = { status: "pending" };

    if (req.userRole === "club") {
      const managedActivities = await Activity.find({
        organizer: req.userId,
      }).select("_id");
      query.activity = {
        $in: managedActivities.map((activity) => activity._id),
      };
    }

    const registrations = await Registration.find(query)
      .populate("user", "name email phone studentId role")
      .populate("activity", "title date location category points organizer")
      .sort({ createdAt: -1 });

    res.json(registrations);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Failed to fetch pending registrations",
        error: error.message,
      });
  }
};

exports.approveRegistration = async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id)
      .populate("activity")
      .populate("user");

    if (!registration) {
      return res.status(404).json({ message: "Registration not found" });
    }

    if (registration.status !== "pending") {
      return res.status(400).json({ message: "Registration is not pending" });
    }

    const activity = registration.activity;

    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    const canApprove =
      req.userRole === "admin" ||
      (req.userRole === "club" &&
        activity.organizer?.toString() === req.userId.toString());

    if (!canApprove) {
      return res.status(403).json({ message: "Access denied" });
    }

    registration.status = "approved";
    await registration.save();

    await User.findByIdAndUpdate(registration.user._id, {
      $inc: { points: activity.points || 0 },
    });

    res.json({
      message: "Registration approved and points awarded successfully",
      registration,
    });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Failed to approve registration",
        error: error.message,
      });
  }
};

exports.cancelRegistrationForActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    if (new Date(activity.date).getTime() <= Date.now()) {
      return res.status(400).json({
        message: "Cannot cancel registration after the activity date",
      });
    }

    const registered = activity.registeredParticipants.some(
      (participantId) => participantId.toString() === req.userId.toString(),
    );

    if (!registered) {
      return res
        .status(400)
        .json({ message: "You are not registered for this activity" });
    }

    activity.registeredParticipants = activity.registeredParticipants.filter(
      (participantId) => participantId.toString() !== req.userId.toString(),
    );
    await activity.save();

    const registration = await Registration.findOne({
      user: req.userId,
      activity: activity._id,
      status: { $in: ["pending", "approved"] },
    });

    const wasApproved = registration?.status === "approved";

    if (registration) {
      registration.status = "cancelled";
      await registration.save();
    }

    const pointAdjustment = wasApproved ? -activity.points : 0;

    await User.findByIdAndUpdate(req.userId, {
      ...(pointAdjustment ? { $inc: { points: pointAdjustment } } : {}),
      $pull: { registeredActivities: activity._id },
    });

    res.json({ message: "Registration cancelled successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to cancel registration", error: error.message });
  }
};
