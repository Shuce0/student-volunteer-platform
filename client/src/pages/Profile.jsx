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
      <section className="page-hero animate-rise" style={{ padding: "2rem" }}>
        <div className="hero-kicker">👤 My profile</div>
        <h1 className="hero-title" style={{ maxWidth: "none" }}>
          Hồ sơ của tôi
        </h1>
        <p className="hero-subtitle">
          Quản lý tài khoản, cập nhật thông tin cá nhân và giữ cho hồ sơ của bạn
          luôn mới.
        </p>
      </section>

      {message && (
        <div className="notice notice--success animate-rise">{message}</div>
      )}

      <section className="grid-2">
        <div className="section-card animate-rise">
          <div className="meta-row" style={{ marginTop: 0 }}>
            <span className="meta-pill">{user.role}</span>
            <span className="meta-pill">{user.points || 0} points</span>
            <span className="meta-pill">
              Member since{" "}
              {new Date(user.createdAt).toLocaleDateString("vi-VN")}
            </span>
          </div>

          <div style={{ marginTop: "1rem" }}>
            <h2 style={{ fontSize: "1.4rem" }}>{user.name}</h2>
            <p style={{ color: "var(--muted)", marginTop: "0.25rem" }}>
              {user.email}
            </p>
          </div>

          <div className="grid-2" style={{ marginTop: "1rem" }}>
            <div className="stat-card">
              <p className="stat-label">Registered activities</p>
              <p className="stat-value" style={{ fontSize: "2rem" }}>
                {user.registeredActivities?.length || 0}
              </p>
            </div>
            <div className="stat-card">
              <p className="stat-label">Good deeds</p>
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
