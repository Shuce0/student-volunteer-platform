const User = require("../models/User");
const jwt = require("jsonwebtoken");

const mapUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  studentId: user.studentId,
  clubId: user.clubId,
  faculty: user.faculty,
  unit: user.unit,
  className: user.className,
  gender: user.gender,
  birthDate: user.birthDate,
  phone: user.phone,
  approvalStatus: user.approvalStatus,
  points: user.points,
  registeredActivities: user.registeredActivities,
  goodDeeds: user.goodDeeds,
  createdAt: user.createdAt,
});

exports.register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      studentId,
      faculty,
      unit,
      organization,
      className,
      gender,
      birthDate,
      phone,
    } = req.body;

    const normalizedRole = (role || "user").toLowerCase();

    if (!["user", "club"].includes(normalizedRole)) {
      return res.status(400).json({
        message: "Only user or club roles can be registered directly",
      });
    }

    const isClub = normalizedRole === "club";
    const missingStudentFields =
      !name ||
      !email ||
      !password ||
      !studentId ||
      !faculty ||
      !className ||
      !gender ||
      !birthDate ||
      !phone;
    const clubUnit = unit || organization;
    const missingClubFields =
      !name || !email || !password || !phone || !clubUnit;

    if ((isClub && missingClubFields) || (!isClub && missingStudentFields)) {
      return res.status(400).json({
        message: isClub
          ? "Vui lòng điền đầy đủ thông tin đăng ký CLB"
          : "Vui lòng điền đầy đủ thông tin đăng ký",
      });
    }

    const existingUser = isClub
      ? await User.findOne({ email })
      : await User.findOne({ $or: [{ email }, { studentId }] });

    if (existingUser) {
      return res.status(400).json({
        message:
          existingUser.email === email
            ? "Email already registered"
            : "Mã số sinh viên đã tồn tại",
      });
    }

    const approvalStatus = isClub ? "pending" : "approved";
    const user = new User({
      name,
      email,
      password,
      role: normalizedRole,
      studentId: isClub ? undefined : studentId,
      faculty: isClub ? undefined : faculty,
      unit: isClub ? clubUnit : undefined,
      className: isClub ? undefined : className,
      gender: isClub ? undefined : gender,
      birthDate: isClub ? undefined : birthDate,
      phone,
      approvalStatus,
    });

    await user.save();

    const response = {
      message: isClub
        ? "Đã gửi yêu cầu đăng ký CLB, vui lòng chờ admin duyệt"
        : "User registered successfully",
      user: mapUser(user),
    };

    if (!isClub) {
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      response.token = token;
    }

    res.status(201).json(response);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Registration failed", error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    if (user.approvalStatus === "pending") {
      return res.status(403).json({
        message: "Tài khoản CLB đang chờ admin duyệt",
      });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      message: "Login successful",
      user: mapUser(user),
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch user", error: error.message });
  }
};

exports.updateCurrentUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      studentId,
      faculty,
      className,
      gender,
      birthDate,
      unit,
    } = req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser._id.toString() !== user._id.toString()) {
        return res.status(400).json({ message: "Email already registered" });
      }
      user.email = email;
    }

    if (studentId && user.role !== "club" && studentId !== user.studentId) {
      const existingStudent = await User.findOne({ studentId });
      if (
        existingStudent &&
        existingStudent._id.toString() !== user._id.toString()
      ) {
        return res.status(400).json({ message: "Mã số sinh viên đã tồn tại" });
      }
      user.studentId = studentId;
    }

    if (name) {
      user.name = name;
    }

    if (phone) {
      user.phone = phone;
    }

    if (user.role !== "club") {
      if (faculty) {
        user.faculty = faculty;
      }

      if (className) {
        user.className = className;
      }

      if (gender) {
        user.gender = gender;
      }

      if (birthDate) {
        user.birthDate = birthDate;
      }
    }

    if (unit && user.role === "club") {
      user.unit = unit;
    }

    if (password) {
      user.password = password;
    }

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user: mapUser(user),
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update profile", error: error.message });
  }
};

exports.getPendingClubApplications = async (req, res) => {
  try {
    const pendingClubs = await User.find({
      role: "club",
      approvalStatus: "pending",
    })
      .select("-password")
      .sort({ createdAt: -1 });

    res.json(pendingClubs);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch pending club applications",
      error: error.message,
    });
  }
};

exports.approveClubApplication = async (req, res) => {
  try {
    const club = await User.findOne({
      _id: req.params.id,
      role: "club",
      approvalStatus: "pending",
    });

    if (!club) {
      return res.status(404).json({ message: "Club application not found" });
    }

    club.approvalStatus = "approved";
    await club.save();

    res.json({
      message: "Club approved successfully",
      user: mapUser(club),
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to approve club application",
      error: error.message,
    });
  }
};
