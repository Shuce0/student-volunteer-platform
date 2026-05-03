# 🌟 Nền tảng Tình nguyện Sinh viên

Một platform toàn diện cho sinh viên thực hiện các hoạt động tình nguyện, theo lời dạy của Chủ tịch Hồ Chí Minh "Làm theo lời Bác".

**Mục tiêu**: Kết nối sinh viên với các hoạt động tình nguyện, ghi nhận công đức, xây dựng cộng đồng tốt lành.

## 🎯 MVP Features (5 Chức năng Cốt lõi)

### ✅ 1. Trang chủ (Home)
- Hiển thị lời dạy ngẫu nhiên của Bác Hồ
- Hiển thị 3 hoạt động nổi bật
- Thống kê tổng quan (số hoạt động, sinh viên, việc tốt)
- Call-to-action để truy cập danh sách hoạt động

### ✅ 2. Danh sách Hoạt động (Activities)
- **Xem danh sách**: Tất cả hoạt động tình nguyện
- **Thông tin chi tiết**: Tên, thời gian, địa điểm, số người, điểm
- **Lọc theo danh mục**: Environment, Elderly, Education, Health, Community
- **Đăng ký tham gia**: Nút "Đăng ký" để sinh viên tham gia

### ✅ 3. Đăng ký Hoạt động (Registration) ⭐ **QUAN TRỌNG NHẤT**
- Sinh viên bấm nút "Đăng ký tham gia"
- Hệ thống tự động cộng điểm
- Lưu registrations vào Database
- Hiển thị số người đã đăng ký

### ✅ 4. Gửi Việc tốt (Good Deeds)
- **Form gửi việc tốt**: Tiêu đề, mô tả, danh mục, điểm dự kiến
- **Lưu vào DB**: Chưa được duyệt (pending)
- **Hiển thị danh sách**: Những việc tốt được duyệt
- **Trạng thái**: Verified / Pending

### ✅ 5. Bảng Xếp hạng (Leaderboard)
- **Top 3**: Hiển thị đọc lệ (Gold, Silver, Bronze medals)
- **Ranking**: Danh sách sinh viên theo điểm (từ cao đến thấp)
- **Tự động cập nhật**: Khi đăng ký hoạt động hoặc việc tốt được duyệt

## 🏗️ Tech Stack

### Frontend
- **React** 18 - UI library
- **React Router** - Navigation
- **Axios** - HTTP client
- **Vite** - Build tool & dev server

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **JWT** - Token-based authentication
- **Bcrypt** - Password hashing

## 📂 Project Structure

```
student-volunteer-platform/
├── client/                 # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── context/        # Auth context
│   │   ├── hooks/          # Custom hooks
│   │   └── styles/         # CSS
│
├── server/                 # Backend (Node.js + Express)
│   ├── controllers/        # Business logic
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API routes
│   ├── middleware/         # Auth, role
│   ├── config/             # Database config
│   ├── scripts/            # Seed data
│   └── server.js
│
├── SETUP.md               # 🚀 Detailed setup guide
└── README.md              # This file
```

## 🚀 Quick Start (2 phút)

### 1️⃣ Backend Setup
```bash
cd server
npm install
cp .env.example .env
npm run dev
```

### 2️⃣ Frontend Setup (terminal mới)
```bash
cd client
npm install
npm run dev
```

### 3️⃣ Truy cập
Mở browser: **http://localhost:5173/**

**Test Tài khoản**:
- Email: `anh.nguyen@student.edu.vn`
- Password: `password123`

## 📡 API Endpoints

### Activities ⭐
```
GET    /api/activities           - Danh sách tất cả
POST   /api/activities/:id/register - Đăng ký
```

### Good Deeds ⭐
```
GET    /api/good-deeds           - Danh sách
POST   /api/good-deeds           - Gửi việc tốt
```

### Leaderboard ⭐
```
GET    /api/leaderboard          - Top 100
```

## 🔑 Phân quyền

| Chức năng | Student | Club | Admin |
|-----------|---------|------|-------|
| Xem hoạt động | ✅ | ✅ | ✅ |
| Đăng ký | ✅ | ✅ | ✅ |
| Gửi việc tốt | ✅ | ✅ | ✅ |
| Duyệt việc tốt | ❌ | ❌ | ✅ |
| Tạo hoạt động | ❌ | ✅ | ✅ |

## 💡 Luồng Hoạt động Chính

```
1. CLB đăng hoạt động
   └→ POST /api/activities

2. Sinh viên xem + đăng ký
   └→ GET /api/activities
   └→ POST /api/activities/:id/register (+20 điểm)

3. Gửi việc tốt
   └→ POST /api/good-deeds

4. Admin duyệt
   └→ PUT /api/good-deeds/:id/verify (+10 điểm)

5. Xem BXH
   └→ GET /api/leaderboard
```

## 📊 Database Models

### User
- name, email, password (hashed)
- role (student|club|admin)
- points (tự động cập nhật)
- registeredActivities, goodDeeds

### Activity
- title, description, date, location
- category, maxParticipants
- points (10-30)
- organizer (Club ID)
- registeredParticipants []

### GoodDeed
- user, title, description
- category, points
- verified (admin duyệt)

## 🛠️ Development

### Dependencies Installed
✅ Backend: express, mongoose, jwt, bcryptjs, cors, multer
✅ Frontend: react, react-router-dom, axios, vite

### Sample Data
Chạy để tạo 4 user + 4 hoạt động mẫu:
```bash
npm run seed
```

## 📚 Documentation

- **[SETUP.md](./SETUP.md)** - Hướng dẫn chi tiết cài đặt
- **[README.md](./README.md)** - Tài liệu này

## ⚙️ Environment Variables

**Backend (.env)**
```
MONGODB_URI=mongodb://localhost:27017/student-volunteer-platform
JWT_SECRET=change_this_to_random_string
PORT=5000
```

## 🎨 Features Bổ sung (có thể thêm)

- [ ] Image upload cho việc tốt
- [ ] Google login
- [ ] Email notifications
- [ ] PDF certificates
- [ ] Volunteer hours statistics
- [ ] Chat giữa clubs & students

## ✅ What's Included

- ✅ Complete project structure
- ✅ All 5 MVP features implemented
- ✅ Sample data generator
- ✅ API endpoints ready
- ✅ Authentication system
- ✅ Role-based access
- ✅ Responsive UI

## ⚠️ Important Notes

❌ DON'T ADD:
- Chat realtime
- AI features
- Excessive animations
- Redux/Microservices
- Docker/Kubernetes

✅ FOCUS ON:
- Core MVP features
- Database integrity
- User experience
- Code quality
- Testing

## 🐛 Troubleshooting

### MongoDB error
```bash
# Kiểm tra MongoDB chạy
mongosh
```

### Port 5000 in use
```bash
# Kill process
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### npm install failed
```bash
npm cache clean --force
rm -rf node_modules
npm install
```

## 📞 Support

Xem [SETUP.md](./SETUP.md) để hướng dẫn chi tiết.

## 📄 License

ISC

---

**Made with ❤️ for the Student Volunteer Community**

Làm theo lời Bác - Xây dựng tương lai tươi sáng! 🌟
