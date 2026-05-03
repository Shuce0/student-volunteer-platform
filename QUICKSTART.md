# 🚀 QUICK REFERENCE - Bắt đầu nhanh trong 5 phút

## 📋 Yêu cầu

- ✅ Node.js (v14+)
- ✅ MongoDB (local hoặc Atlas cloud)
- ✅ Git (tuỳ chọn)

## ⚡ Bước 1: Setup MongoDB (TRƯỚC TIÊN)

### Option A: Cloud (Nhanh nhất - khuyến khích)

1. Truy cập: https://www.mongodb.com/cloud/atlas
2. Tạo account → Create Organization
3. Create Project → Create Cluster (Free tier)
4. Nhấp "Connect" → Copy connection string
5. Dán vào `server/.env` tại dòng `MONGODB_URI=...`

### Option B: Local

```bash
# Windows: Download từ https://www.mongodb.com/try/download/community
# Chạy installer → Bỏ qua nếu có lỗi

# Kiểm tra MongoDB chạy
mongosh
```

## ⚡ Bước 2: Install Dependencies

### Terminal 1 - Backend

```bash
cd server
npm install
```

### Terminal 2 - Frontend

```bash
cd client
npm install
```

## ⚡ Bước 3: Chạy Ứng dụng

### Terminal 1 - Backend

```bash
cd server
npm run dev
```

✅ Output: `Server running on port 5000`

### Terminal 2 - Frontend (mở terminal mới)

```bash
cd client
npm run dev
```

✅ Output: `Local: http://localhost:5173/`

## ⚡ Bước 4: Mở Browser

```
http://localhost:5173
```

## 🧪 Test tài khoản (sau khi chạy `npm run seed`)

```
Email: anh.nguyen@student.edu.vn
Password: password123
```

## 📊 Tạo Sample Data (Tuỳ chọn)

```bash
cd server
npm run seed
```

Tạo:

- 4 users (với điểm khác nhau)
- 4 hoạt động mẫu
- Registrations

## 🎯 Quick Test Checklist

- [ ] Trang Home hiện lời dạy + hoạt động
- [ ] Vào Activities → thấy danh sách
- [ ] Click "Đăng ký" → xem điểm cộng (check Database)
- [ ] Vào Good Deeds → gửi việc tốt
- [ ] Vào Leaderboard → thấy bảng xếp hạng

## 🔧 Troubleshooting Nhanh

| Lỗi                      | Giải pháp                                             |
| ------------------------ | ----------------------------------------------------- |
| MongoDB connection error | Kiểm tra MongoDB chạy, copy đúng connection string    |
| Port 5000 in use         | Tìm process: `netstat -ano \| findstr :5000`, kill nó |
| npm install failed       | `npm cache clean --force` → `npm install`             |
| Module not found         | Kiểm tra `npm install` trong đúng folder              |

## 📚 Docs

1. **[SETUP.md](./SETUP.md)** - Hướng dẫn chi tiết
2. **[PROGRESS.md](./PROGRESS.md)** - Danh sách hoàn thành
3. **[README.md](./README.md)** - Project info

## 🎨 File Cần Chỉnh Sửa

Nếu lỗi connection:

- `server/.env` - Set `MONGODB_URI` đúng
- `server/config/db.js` - Check connection string

## 📱 Browser DevTools

Nếu có lỗi:

1. Mở F12 → Console tab
2. Xem error message
3. Kiểm tra backend console

## ✅ Công việc Hoàn tất

- ✅ 5 trang MVP (Home, Activities, Good Deeds, Leaderboard, Login)
- ✅ Backend API full
- ✅ Database models
- ✅ Authentication
- ✅ Points system
- ✅ Sample data generator

## 🚀 Ready to Deploy!

Sau khi test OK, bạn có thể:

- ✅ Nộp bài (đủ điểm rồi!)
- ✅ Deploy lên cloud (Vercel, Render, Railway)
- ✅ Thêm features mới

---

**Need Help?** Xem SETUP.md - có troubleshooting section

**Happy Coding!** 🎉
