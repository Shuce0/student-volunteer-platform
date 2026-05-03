import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await login(email, password);
      console.log("Login successful:", response);
      navigate("/");
    } catch (err) {
      setError(err);
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <section className="auth-shell animate-rise">
        <div className="page-hero auth-hero">
          <div className="hero-kicker">🔐 Welcome back</div>
          <h1 className="auth-title">Login để tiếp tục hành trình</h1>
          <p className="auth-hint">
            Đăng nhập để đăng ký hoạt động, ghi nhận việc tốt và xem bảng xếp
            hạng của bạn.
          </p>
          <div className="hero-actions">
            <span
              className="chip"
              style={{ background: "rgba(255,255,255,0.1)", color: "#fff" }}
            >
              Fast access
            </span>
            <span
              className="chip"
              style={{ background: "rgba(255,255,255,0.1)", color: "#fff" }}
            >
              Student focused
            </span>
          </div>
        </div>

        <div className="auth-card">
          <form className="auth-form" onSubmit={handleSubmit}>
            <div>
              <h2 className="section-heading">Đăng nhập</h2>
              <p className="section-copy">
                Dùng email sinh viên để truy cập đầy đủ tính năng.
              </p>
            </div>

            {error && <div className="notice notice--danger">{error}</div>}

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              required
              disabled={loading}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              required
              disabled={loading}
            />
            <button
              type="submit"
              className="button button--primary"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
