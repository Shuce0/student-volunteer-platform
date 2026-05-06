const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    studentId: {
      type: String,
      required: function () {
        return this.role !== "club";
      },
      unique: true,
      sparse: true,
      trim: true,
    },
    clubId: {
      type: String,
      unique: true,
      sparse: true,
      default: function () {
        if (this.role !== "club") return undefined;

        return `CLB-${Date.now().toString(36).toUpperCase()}-${Math.random()
          .toString(36)
          .slice(2, 6)
          .toUpperCase()}`;
      },
    },
    faculty: {
      type: String,
      required: function () {
        return this.role !== "club";
      },
      trim: true,
    },
    unit: {
      type: String,
      required: function () {
        return this.role === "club";
      },
      trim: true,
    },
    className: {
      type: String,
      required: function () {
        return this.role !== "club";
      },
      trim: true,
    },
    gender: {
      type: String,
      required: function () {
        return this.role !== "club";
      },
      enum: ["male", "female", "other"],
    },
    birthDate: {
      type: Date,
      required: function () {
        return this.role !== "club";
      },
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin", "club"],
      default: "user",
    },
    approvalStatus: {
      type: String,
      enum: ["approved", "pending"],
      default: "approved",
    },
    points: {
      type: Number,
      default: 0,
    },
    registeredActivities: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Activity",
      },
    ],
    goodDeeds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "GoodDeed",
      },
    ],
  },
  { timestamps: true },
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
