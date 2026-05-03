# 🚀 Hướng dẫn thiết lập hệ thống

## 1. Chuẩn bị

### Yêu cầu

- **Node.js**: v14 hoặc cao hơn
- **MongoDB**: chạy cục bộ hoặc MongoDB Atlas
- **Git**: cho version control

### Kiểm tra phiên bản

```bash
node --version
npm --version
```

## 2. Thiết lập Backend (Server)

### Bước 1: Vào thư mục server

```bash
cd server
```

### Bước 2: Cài đặt dependencies

```bash
npm install
```

### Bước 3: Tạo file .env

```bash
cp .env.example .env
```

### Bước 4: Cấu hình MongoDB

Mở file `server/.env` và cập nhật:

```
MONGODB_URI=mongodb://localhost:27017/student-volunteer-platform
JWT_SECRET=your_super_secret_key_change_this
PORT=5000
NODE_ENV=development
```

**🔧 Nếu dùng MongoDB Atlas (cloud):**

- Truy cập [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Tạo account và cluster
- Copy connection string
- Thay thế MONGODB_URI: `mongodb+srv://user:password@cluster.mongodb.net/student-volunteer-platform`

### Bước 5: Tạo dữ liệu sample (tuỳ chọn)

```bash
npm run seed
```

Lệnh này sẽ:

- ✅ Tạo 4 user mẫu
- ✅ Tạo 4 hoạt động mẫu
- ✅ Cập nhật điểm cho người dùng

### Bước 6: Chạy server

```bash
npm run dev
```

**Output mong đợi:**

```
Server running on port 5000
MongoDB connected: localhost
```

## 3. Thiết lập Frontend (Client)

### Bước 1: Mở terminal mới, vào thư mục client

```bash
cd client
```

### Bước 2: Cài đặt dependencies

```bash
npm install
```

### Bước 3: Chạy development server

```bash
npm run dev
```

**Output mong đợi:**

```
  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

## 4. Truy cập ứng dụng

Mở trình duyệt và truy cập: **http://localhost:5173/**

## 5. Tài khoản mẫu

Nếu bạn chạy `npm run seed`, dùng tài khoản này:

### Sinh viên

- **Email**: `anh.nguyen@student.edu.vn`
- **Password**: `password123`
- **Thao tác**: xem hoạt động, đăng ký, gửi việc tốt

### CLB/Tổ chức

- **Email**: `club@university.edu.vn`
- **Password**: `password123`
- **Thao tác**: tạo hoạt động, quản lý

## 6. Các endpoint API chính

### Authentication

```
POST   /api/auth/register        - Đăng ký
POST   /api/auth/login           - Đăng nhập
GET    /api/auth/me              - Lấy thông tin hiện tại
```

### Hoạt động

```
GET    /api/activities           - Danh sách tất cả
GET    /api/activities/:id       - Chi tiết
POST   /api/activities           - Tạo mới (cần auth)
POST   /api/activities/:id/register - Đăng ký (cần auth)
```

### Việc tốt

```
GET    /api/good-deeds           - Danh sách được duyệt
POST   /api/good-deeds           - Gửi việc tốt (cần auth)
GET    /api/good-deeds/user/:userId - Việc tốt của người dùng
PUT    /api/good-deeds/:id/verify    - Duyệt (admin)
```

### Bảng xếp hạng

```
GET    /api/leaderboard          - Top 10
GET    /api/leaderboard/user/:userId/rank - Xem rank của người dùng
```

## 7. Cấu trúc thư mục

```
server/
├── controllers/     # Logic xử lý
├── models/         # Schema MongoDB
├── routes/         # API endpoints
├── middleware/     # Kiểm tra auth, role
├── config/         # Config database
├── utils/          # Helper functions
├── scripts/        # Seed data
└── server.js       # Main file

client/
├── src/
│   ├── components/ # React components
│   ├── pages/      # Các trang
│   ├── services/   # API calls
│   ├── context/    # Auth context
│   ├── hooks/      # Custom hooks
│   ├── utils/      # Helper functions
│   └── styles/     # CSS
└── package.json
```

## 8. Troubleshooting

### ❌ MongoDB connection error

**Lỗi**: `Error connecting to MongoDB`

**Giải pháp**:

1. Kiểm tra MongoDB đang chạy: `mongosh`
2. Kiểm tra MONGODB_URI trong .env
3. Nếu dùng MongoDB Atlas, kiểm tra IP whitelist

### ❌ Port đã được sử dụng

**Lỗi**: `EADDRINUSE: address already in use :::5000`

**Giải pháp**:

```bash
# Tìm process sử dụng port 5000
netstat -ano | findstr :5000
# Kill process (thay xxxx với PID)
taskkill /PID xxxx /F
```

### ❌ npm install failed

**Giải pháp**:

```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### ❌ Frontend không kết nối được backend

**Giải pháp**:

- Kiểm tra backend chạy trên port 5000
- Kiểm tra CORS configuration trong `server.js`
- Mở DevTools (F12) → xem Console tab có lỗi không

## 9. Các lệnh hữu ích

### Server

```bash
npm run dev          # Dev mode (auto-reload)
npm start            # Production mode
npm run seed         # Tạo dữ liệu sample
```

### Client

```bash
npm run dev          # Chạy dev server
npm run build        # Build for production
npm run preview      # Xem production build
```

## 10. Deployment (tùy chọn)

### Deploy Backend (Render, Heroku, Railway)

1. Push code lên GitHub
2. Connect repository đến Render/Heroku
3. Set environment variables
4. Deploy

### Deploy Frontend (Vercel, Netlify)

```bash
npm run build
# Upload dist/ folder to Vercel/Netlify
```

## 11. Tiếp theo

✅ Hệ thống đã sẵn sàng!

- Xem [README.md](./README.md) để biết thêm thông tin
- Bắt đầu phát triển features mới
- Test các chức năng MVP

---

**Nếu gặp lỗi, hãy:**

1. Kiểm tra terminal output
2. Xem DevTools Console (client)
3. Kiểm tra logs MongoDB
4. Tìm kiếm error message trên Stack Overflow hoặc GitHub Issues
