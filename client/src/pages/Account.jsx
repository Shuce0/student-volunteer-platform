import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const facultyOptions = [
  "Khoa Công nghệ Thông tin",
  "Khoa Dược",
  "Khoa Điều dưỡng và Xét nghiệm",
  "Khoa Hàn Quốc học",
  "Khoa Hệ thống thông tin Quản lý",
  "Khoa Khoa học Xã hội và Quan hệ công chúng",
  "Khoa Kiến trúc - Mỹ thuật",
  "Khoa Luật",
  "Khoa Marketing - Kinh doanh Quốc tế",
  "Khoa Nhật Bản học",
  "Khoa Quản trị DL - NH- KS",
  "Khoa Quản trị kinh doanh",
  "Khoa Tài chính - Thương mại",
  "Khoa Thú Y - Chăn Nuôi",
  "Khoa Tiếng Anh",
  "Khoa Trung Quốc học",
  "Khoa Truyền Thông - Thiết Kế",
  "Khoa Xây Dựng",
  "Viện Âm nhạc và Nghệ thuật",
  "Viện Công nghệ Việt - Hàn",
  "Viện Công nghệ Việt - Nhật",
  "Viện Đào tạo quốc tế",
  "Viện Khoa học ứng dụng HUTECH",
  "Viện Kỹ thuật HUTECH",
];

function formatDateInput(value) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const adjusted = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return adjusted.toISOString().slice(0, 10);
}

export default function Account() {
  const { user, loading, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    studentId: "",
    faculty: "",
    className: "",
    gender: "male",
    birthDate: "",
    unit: "",
    password: "",
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!user) return;

    setFormData({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      studentId: user.studentId || "",
      faculty: user.faculty || "",
      className: user.className || "",
      gender: user.gender || "male",
      birthDate: formatDateInput(user.birthDate),
      unit: user.unit || "",
      password: "",
    });
  }, [user]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      };

      if (user?.role === "club") {
        payload.unit = formData.unit;
      } else {
        payload.studentId = formData.studentId;
        payload.faculty = formData.faculty;
        payload.className = formData.className;
        payload.gender = formData.gender;
        payload.birthDate = formData.birthDate;
      }

      if (formData.password.trim()) {
        payload.password = formData.password;
      }

      const response = await updateUser(payload);
      setMessage(response.message || "Cập nhật hồ sơ thành công");
      setFormData((previous) => ({ ...previous, password: "" }));
    } catch (error) {
      setMessage(error);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading || !user) {
    return <p className="loading-state">Đang tải hồ sơ...</p>;
  }

  return (
    <div className="container page-section page-stack">
      <section className="page-hero animate-rise">
        <div className="hero-grid">
          <div>
            <div className="hero-kicker">👤 Hồ sơ tài khoản</div>
            <h1 className="hero-title" style={{ maxWidth: "none" }}>
              Cập nhật thông tin cá nhân
            </h1>
            <p className="hero-subtitle">
              Bạn có thể đổi tên, email, số điện thoại, mật khẩu và các thông
              tin học tập ngay tại đây.
            </p>
            <div className="hero-actions">
              <button
                className="button button--secondary"
                type="button"
                onClick={() => navigate("/profile")}
              >
                Xem hoạt động đã đăng ký
              </button>
              <button
                className="button button--ghost"
                type="button"
                onClick={handleLogout}
              >
                Đăng xuất
              </button>
            </div>
          </div>

          <div className="hero-panel hero-panel--muted">
            <div className="hero-panel__title">Tổng quan nhanh</div>
            <div
              className="dashboard-stats"
              style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}
            >
              <div className="dashboard-stat">
                <div className="dashboard-stat__label">Điểm</div>
                <div className="dashboard-stat__value">{user.points || 0}</div>
              </div>
              <div className="dashboard-stat">
                <div className="dashboard-stat__label">Hoạt động</div>
                <div className="dashboard-stat__value">
                  {user.registeredActivities?.length || 0}
                </div>
              </div>
              <div className="dashboard-stat">
                <div className="dashboard-stat__label">Việc tốt</div>
                <div className="dashboard-stat__value">
                  {user.goodDeeds?.length || 0}
                </div>
              </div>
              <div className="dashboard-stat">
                <div className="dashboard-stat__label">Vai trò</div>
                <div className="dashboard-stat__value">{user.role}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {message && (
        <div className="notice notice--success animate-rise">{message}</div>
      )}

      <section className="section-card animate-rise">
        <h2 className="section-heading">Chỉnh sửa hồ sơ</h2>
        <p className="section-copy">
          Cập nhật thông tin cá nhân, liên hệ và mật khẩu của bạn tại đây.
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="grid-2">
            <label className="page-stack" style={{ gap: "0.45rem" }}>
              <span>Họ và tên</span>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input"
                required
              />
            </label>

            <label className="page-stack" style={{ gap: "0.45rem" }}>
              <span>Email</span>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="input"
                required
              />
            </label>
          </div>

          <div className="grid-2">
            <label className="page-stack" style={{ gap: "0.45rem" }}>
              <span>Số điện thoại</span>
              <input
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className="input"
                required
              />
            </label>

            <label className="page-stack" style={{ gap: "0.45rem" }}>
              <span>Mật khẩu mới</span>
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Để trống nếu không đổi"
                className="input"
              />
            </label>
          </div>

          {user.role === "club" ? (
            <label className="page-stack" style={{ gap: "0.45rem" }}>
              <span>Đơn vị / Khoa viện</span>
              <input
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className="input"
                required
              />
            </label>
          ) : (
            <>
              <div className="grid-2">
                <label className="page-stack" style={{ gap: "0.45rem" }}>
                  <span>Mã số sinh viên</span>
                  <input
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleChange}
                    className="input"
                    required
                  />
                </label>

                <label className="page-stack" style={{ gap: "0.45rem" }}>
                  <span>Khoa / Viện</span>
                  <select
                    name="faculty"
                    value={formData.faculty}
                    onChange={handleChange}
                    className="select"
                    required
                  >
                    <option value="">Chọn Khoa / Viện</option>
                    {facultyOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="grid-2">
                <label className="page-stack" style={{ gap: "0.45rem" }}>
                  <span>Lớp</span>
                  <input
                    name="className"
                    value={formData.className}
                    onChange={handleChange}
                    className="input"
                    required
                  />
                </label>

                <label className="page-stack" style={{ gap: "0.45rem" }}>
                  <span>Giới tính</span>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="select"
                    required
                  >
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                    <option value="other">Khác</option>
                  </select>
                </label>
              </div>

              <label className="page-stack" style={{ gap: "0.45rem" }}>
                <span>Ngày sinh</span>
                <input
                  name="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={handleChange}
                  className="input"
                  required
                />
              </label>
            </>
          )}

          <button
            className="button button--primary"
            type="submit"
            disabled={saving}
          >
            {saving ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </form>
      </section>
    </div>
  );
}
