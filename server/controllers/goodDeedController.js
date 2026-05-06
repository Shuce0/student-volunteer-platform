const GoodDeed = require("../models/GoodDeed");
const User = require("../models/User");

exports.getAllGoodDeeds = async (req, res) => {
  try {
    const goodDeeds = await GoodDeed.find({ verified: true })
      .populate("user", "name")
      .populate("verifiedBy", "name");
    res.json(goodDeeds);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch good deeds", error: error.message });
  }
};

exports.getPendingGoodDeeds = async (req, res) => {
  try {
    const goodDeeds = await GoodDeed.find({ verified: false })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(goodDeeds);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Failed to fetch pending good deeds",
        error: error.message,
      });
  }
};

exports.createGoodDeed = async (req, res) => {
  try {
    const { title, description, category, points } = req.body;

    const goodDeed = new GoodDeed({
      user: req.userId,
      title,
      description,
      category,
      points,
    });

    await goodDeed.save();
    res.status(201).json({ message: "Good deed recorded", goodDeed });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create good deed", error: error.message });
  }
};

exports.getUserGoodDeeds = async (req, res) => {
  try {
    const goodDeeds = await GoodDeed.find({ user: req.params.userId });
    res.json(goodDeeds);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch good deeds", error: error.message });
  }
};

exports.verifyGoodDeed = async (req, res) => {
  try {
    const goodDeed = await GoodDeed.findByIdAndUpdate(
      req.params.id,
      {
        verified: true,
        verifiedBy: req.userId,
      },
      { new: true },
    );

    if (!goodDeed) {
      return res.status(404).json({ message: "Good deed not found" });
    }

    // Update user points
    await User.findByIdAndUpdate(goodDeed.user, {
      $inc: { points: goodDeed.points },
    });

    res.json({ message: "Good deed verified", goodDeed });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to verify good deed", error: error.message });
  }
};
