const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../models/User");
const Activity = require("../models/Activity");

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI ||
        "mongodb://localhost:27017/student-volunteer-platform",
    );
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // Clear existing data
    await Activity.deleteMany({});
    await User.deleteMany({});

    // Create sample users
    const users = await User.create([
      {
        name: "HUTECH Admin",
        email: "adminhutech@gmail.com",
        password: "123456",
        role: "admin",
        studentId: "ADMIN001",
        faculty: "Quản trị hệ thống",
        className: "ADMIN",
        gender: "other",
        birthDate: new Date("2000-01-01"),
        phone: "0909000000",
        approvalStatus: "approved",
        points: 0,
      },
      {
        name: "Nguyễn Thiện Anh",
        email: "anh.nguyen@student.edu.vn",
        password: "password123",
        role: "user",
        studentId: "SV001",
        faculty: "Khoa Công nghệ thông tin",
        className: "D21_TH01",
        gender: "male",
        birthDate: new Date("2003-03-15"),
        phone: "0901000001",
        approvalStatus: "approved",
        points: 150,
      },
      {
        name: "Phạm Minh Hoa",
        email: "hoa.pham@student.edu.vn",
        password: "password123",
        role: "user",
        studentId: "SV002",
        faculty: "Khoa Marketing",
        className: "D21_MKT01",
        gender: "female",
        birthDate: new Date("2003-07-22"),
        phone: "0901000002",
        approvalStatus: "approved",
        points: 120,
      },
      {
        name: "Trần Văn Tuấn",
        email: "tuan.tran@student.edu.vn",
        password: "password123",
        role: "user",
        studentId: "SV003",
        faculty: "Khoa Kinh tế",
        className: "D21_KT01",
        gender: "male",
        birthDate: new Date("2002-11-08"),
        phone: "0901000003",
        approvalStatus: "approved",
        points: 100,
      },
      {
        name: "Đoàn Thanh Niên Trường ĐH",
        email: "club@university.edu.vn",
        password: "password123",
        role: "club",
        clubId: "CLB001",
        unit: "Đoàn - Hội",
        phone: "0901000004",
        approvalStatus: "approved",
        points: 0,
      },
    ]);

    console.log("✅ Created sample users");

    // Create sample activities
    const activities = await Activity.create([
      {
        title: "Tình nguyện dọn vệ sinh khu vực",
        description:
          "Tham gia dọn vệ sinh môi trường xung quanh trường học. Giúp tạo môi trường sạch đẹp cho cộng đồng.",
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        location: "Khuôn viên trường ĐH",
        category: "environment",
        maxParticipants: 30,
        points: 20,
        organizer: users[3]._id,
        registeredParticipants: [users[0]._id, users[1]._id],
      },
      {
        title: "Hỗ trợ người già tại viện dưỡng lão",
        description:
          "Đến thăm, chăm sóc và nói chuyện với những cụ già. Mang đến niềm vui và sự chân thành.",
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        location: "Viện dưỡng lão Bình An",
        category: "elderly",
        maxParticipants: 20,
        points: 25,
        organizer: users[3]._id,
        registeredParticipants: [users[2]._id],
      },
      {
        title: "Dạy kèm miễn phí cho trẻ em nghèo",
        description:
          "Giúp các em học sinh chuẩn bị cho kỳ thi. Hỗ trợ giáo dục cho những em chưa có điều kiện.",
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        location: "Trung tâm dạy kèm Bần cơm",
        category: "education",
        maxParticipants: 15,
        points: 15,
        organizer: users[3]._id,
        registeredParticipants: [users[0]._id],
      },
      {
        title: "Chương trình hiến máu tình nguyện",
        description:
          "Tham gia chương trình hiến máu để giúp đỡ những bệnh nhân cần thiết. Là tấm gương sáng của tình nguyện.",
        date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
        location: "Bệnh viện Trung tâm",
        category: "health",
        maxParticipants: 40,
        points: 30,
        organizer: users[3]._id,
        registeredParticipants: [],
      },
    ]);

    console.log("✅ Created sample activities");

    // Update user registrations
    await User.updateMany(
      { _id: { $in: [users[0]._id, users[1]._id] } },
      { $push: { registeredActivities: activities[0]._id } },
    );

    console.log("✅ Database seeding completed!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

const main = async () => {
  await connectDB();
  await seedData();
};

main();
