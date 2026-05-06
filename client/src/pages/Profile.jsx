import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Profile() {
  const { user, loading, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const initials = user?.name
    ? user.name
        .split(" ")
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase()
    : "?";

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [loading, user, navigate]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        password: "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
      };

      if (formData.password.trim()) {
        payload.password = formData.password;
      }

      const response = await updateUser(payload);
      setMessage(response.message || "Cập nhật hồ sơ thành công");
      setFormData((prev) => ({ ...prev, password: "" }));
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
            <div className="hero-kicker">👤 Hồ sơ sinh viên</div>
            <h1 className="hero-title" style={{ maxWidth: "none" }}>
              Quản lý tài khoản của bạn
            </h1>
            <p className="hero-subtitle">
              Cập nhật thông tin cá nhân, theo dõi điểm số và giữ hồ sơ đồng bộ
              với hệ thống tình nguyện.
            </p>
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
                <div className="dashboard-stat__value">SV</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {message && (
        <div className="notice notice--success animate-rise">{message}</div>
      )}

      <section className="grid-2">
        <div className="section-card animate-rise">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              marginBottom: "1rem",
            }}
          >
            <div
              style={{
                width: "72px",
                height: "72px",
                borderRadius: "22px",
                display: "grid",
                placeItems: "center",
                color: "#fff",
                fontSize: "1.5rem",
                fontWeight: 800,
                background: "linear-gradient(135deg, #d8202a, #8f0f14)",
                boxShadow: "0 16px 30px rgba(210, 29, 39, 0.28)",
              }}
            >
              {initials}
            </div>

            <div>
              <p className="section-copy" style={{ marginBottom: "0.25rem" }}>
                Chào mừng trở lại
              </p>
              <h2 style={{ fontSize: "1.4rem" }}>{user.name}</h2>
              <p style={{ color: "var(--muted)", marginTop: "0.25rem" }}>
                {user.email}
              </p>
            </div>
          </div>

          <div className="meta-row" style={{ marginTop: 0 }}>
            <span className="meta-pill">{user.role}</span>
            <span className="meta-pill">{user.points || 0} điểm</span>
            <span className="meta-pill">
              Tham gia từ {new Date(user.createdAt).toLocaleDateString("vi-VN")}
            </span>
          </div>

          <div className="grid-2" style={{ marginTop: "1rem" }}>
            <div className="stat-card">
              <p className="stat-label">Hoạt động đã đăng ký</p>
              <p className="stat-value" style={{ fontSize: "2rem" }}>
                {user.registeredActivities?.length || 0}
              </p>
            </div>
            <div className="stat-card">
              <p className="stat-label">Việc tốt đã gửi</p>
              <p className="stat-value" style={{ fontSize: "2rem" }}>
                {user.goodDeeds?.length || 0}
              </p>
            </div>
          </div>

          <div className="hero-actions" style={{ marginTop: "1rem" }}>
            <button
              className="button button--secondary"
              onClick={() => navigate("/")}
            >
              Về trang chủ
            </button>
            <button className="button button--ghost" onClick={handleLogout}>
              Đăng xuất
            </button>
          </div>
        </div>

        <section className="section-card animate-rise">
          <h2 className="section-heading">Chỉnh sửa hồ sơ</h2>
          <p className="section-copy">
            Cập nhật tên, email và mật khẩu của bạn tại đây.
          </p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label className="page-stack" style={{ gap: "0.45rem" }}>
              <span>Họ và tên</span>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input"
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

            <button
              className="button button--primary"
              type="submit"
              disabled={saving}
            >
              {saving ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </form>
        </section>
      </section>
    </div>
  );
}
