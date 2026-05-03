const User = require("../models/User");

exports.getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await User.find({ role: "student" })
      .select("name email points")
      .sort({ points: -1 })
      .limit(100);

    res.json(leaderboard);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch leaderboard", error: error.message });
  }
};

exports.getUserRank = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const rank = await User.countDocuments({
      points: { $gt: user.points },
      role: "student",
    });

    res.json({
      user: { name: user.name, email: user.email, points: user.points },
      rank: rank + 1,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch rank", error: error.message });
  }
};
