import { useState } from "react";
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

export default function Login() {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [studentId, setStudentId] = useState("");
  const [faculty, setFaculty] = useState("");
  const [unit, setUnit] = useState("");
  const [className, setClassName] = useState("");
  const [gender, setGender] = useState("male");
  const [birthDate, setBirthDate] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (mode === "login") {
        await login(email, password);
        navigate("/");
      } else {
        const data = await register({
          name,
          email,
          password,
          role,
          studentId,
          faculty,
          unit,
          className,
          gender,
          birthDate,
          phone,
        });

        if (data.token) {
          navigate("/");
        } else {
          setSuccess(data.message || "Đã gửi yêu cầu đăng ký");
          setMode("login");
        }
      }
    } catch (err) {
      setError(err);
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="auth-card animate-rise"
      style={{ width: "min(520px, 100%)" }}
    >
      <div
        className="hero-kicker"
        style={{
          color: "#a3121a",
          background: "rgba(210,29,39,0.08)",
          borderColor: "rgba(210,29,39,0.12)",
        }}
      >
        🔐 {mode === "login" ? "Đăng nhập HUTECH" : "Đăng ký tài khoản HUTECH"}
      </div>
      <h2 className="section-heading" style={{ fontSize: "2rem" }}>
        {mode === "login" ? "Chào mừng trở lại" : "Tạo tài khoản mới"}
      </h2>
      <p className="section-copy">
        {mode === "login"
          ? "Đăng nhập để đăng ký hoạt động, ghi nhận việc tốt và xem bảng xếp hạng của bạn."
          : "Đăng ký để chọn vai trò phù hợp: user, hoặc CLB tổ chức chương trình."}
      </p>

      {error && <div className="notice notice--danger">{error}</div>}
      {success && <div className="notice notice--success">{success}</div>}

      <form className="auth-form" onSubmit={handleSubmit}>
        {mode === "register" && (
          <>
            <input
              type="text"
              placeholder="Họ và tên"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
              required
              disabled={loading}
            />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="select"
              disabled={loading}
            >
              <option value="user">Sinh viên</option>
              <option value="club">Người tổ chức (chờ admin duyệt)</option>
            </select>

            {role === "club" ? (
              <>
                <div className="grid-2">
                  <input
                    type="text"
                    placeholder="Đơn vị / Khoa viện"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="input"
                    required
                    disabled={loading}
                  />
                  <input
                    type="tel"
                    placeholder="Số điện thoại"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="input"
                    required
                    disabled={loading}
                  />
                </div>
                <p className="section-copy" style={{ marginTop: "-0.25rem" }}>
                  ID CLB sẽ được hệ thống tự sinh sau khi đăng ký và chỉ admin
                  nhìn thấy để quản lý.
                </p>
              </>
            ) : (
              <>
                <div className="grid-2">
                  <input
                    type="text"
                    placeholder="Mã số sinh viên"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    className="input"
                    required
                    disabled={loading}
                  />
                  <select
                    value={faculty}
                    onChange={(e) => setFaculty(e.target.value)}
                    className="select"
                    required
                    disabled={loading}
                  >
                    <option value="">Chọn Khoa / Viện</option>
                    {facultyOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid-2">
                  <input
                    type="text"
                    placeholder="Lớp"
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    className="input"
                    required
                    disabled={loading}
                  />
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="select"
                    required
                    disabled={loading}
                  >
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                    <option value="other">Khác</option>
                  </select>
                </div>
                <div className="grid-2">
                  <input
                    type="date"
                    placeholder="mm/dd/yyyy"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="input"
                    required
                    disabled={loading}
                  />
                  <input
                    type="tel"
                    placeholder="Số điện thoại"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="input"
                    required
                    disabled={loading}
                  />
                </div>
              </>
            )}
          </>
        )}
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
          placeholder="Mật khẩu"
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
          {loading
            ? mode === "login"
              ? "Đang đăng nhập..."
              : "Đang tạo tài khoản..."
            : mode === "login"
              ? "Đăng nhập"
              : "Đăng ký"}
        </button>
      </form>

      <button
        type="button"
        className="button button--secondary"
        style={{ width: "100%", marginTop: "0.75rem" }}
        onClick={() => {
          setError("");
          setMode(mode === "login" ? "register" : "login");
        }}
        disabled={loading}
      >
        {mode === "login"
          ? "Chưa có tài khoản? Đăng ký"
          : "Đã có tài khoản? Đăng nhập"}
      </button>
    </div>
  );
}
