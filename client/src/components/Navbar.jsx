import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import hutechLogo from "../assets/logo-hutech.png";

const navItems = [
  { to: "/", label: "Trang chủ", icon: "home" },
  { to: "/activities", label: "Hoạt động", icon: "calendar" },
  { to: "/profile", label: "Đăng ký của tôi", icon: "user" },
  { to: "/good-deeds", label: "Việc tốt", icon: "heart" },
  { to: "/leaderboard", label: "Bảng xếp hạng", icon: "trophy" },
  { to: "/clubs", label: "CLB kết nối", icon: "users" },
];

function formatRole(role) {
  if (role === "admin") return "Quản trị";
  if (role === "club") return "CLB tổ chức";
  return "Người dùng";
}

function NavIcon({ name }) {
  const commonProps = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  switch (name) {
    case "calendar":
      return (
        <svg {...commonProps}>
          <rect x="3" y="5" width="18" height="16" rx="3" />
          <path d="M8 3v4M16 3v4M3 10h18" />
        </svg>
      );
    case "user":
      return (
        <svg {...commonProps}>
          <path d="M20 21a8 8 0 0 0-16 0" />
          <circle cx="12" cy="8" r="4" />
        </svg>
      );
    case "heart":
      return (
        <svg {...commonProps}>
          <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
        </svg>
      );
    case "trophy":
      return (
        <svg {...commonProps}>
          <path d="M8 4h8v3a4 4 0 0 1-8 0V4Z" />
          <path d="M6 6H4a2 2 0 0 0 2 4" />
          <path d="M18 6h2a2 2 0 0 1-2 4" />
          <path d="M12 11v4" />
          <path d="M8 20h8" />
          <path d="M10 15h4v5h-4z" />
        </svg>
      );
    case "users":
      return (
        <svg {...commonProps}>
          <path d="M17 21a5 5 0 0 0-10 0" />
          <circle cx="12" cy="8" r="4" />
          <path d="M21 21a4 4 0 0 0-3-3.9" />
          <path d="M17.5 4.5a4 4 0 0 1 0 7" />
        </svg>
      );
    case "info":
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 10.5v5" />
          <path d="M12 7.5h.01" />
        </svg>
      );
    default:
      return (
        <svg {...commonProps}>
          <path d="M3 12h18" />
          <path d="M12 3v18" />
        </svg>
      );
  }
}

export default function Navbar({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isLoginPage = location.pathname === "/login";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const firstName = user?.name?.split(" ")?.[0] || "Sinh viên";
  const initials = user?.name
    ? user.name
        .split(" ")
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase()
    : "SV";

  if (isLoginPage) {
    return (
      <div className="login-shell">
        <div className="login-shell__brand">
          <Link to="/" className="brand-lockup">
            <img src={hutechLogo} alt="HUTECH" className="brand-lockup__logo" />
            <span className="brand-lockup__accent" aria-hidden="true" />
          </Link>
          <div className="login-shell__brand-copy">
            <span className="login-shell__kicker">
              Cổng tình nguyện sinh viên
            </span>
            <h1>Dashboard HUTECH</h1>
            <p>
              Đăng nhập để tiếp tục đăng ký hoạt động, ghi nhận việc tốt và theo
              dõi bảng xếp hạng.
            </p>
          </div>
          <div className="login-shell__art">
            <div className="login-shell__flag">🇻🇳</div>
            <div className="login-shell__quote">
              <p>
                “Tuổi trẻ là mùa xuân của xã hội, là tương lai của đất nước.”
              </p>
              <span>Chủ tịch Hồ Chí Minh</span>
            </div>
          </div>
        </div>
        <div className="login-shell__content">{children}</div>
      </div>
    );
  }

  return (
    <div className="dashboard-shell">
      <aside className="dashboard-sidebar">
        <Link to="/" className="dashboard-brand">
          <img
            src={hutechLogo}
            alt="HUTECH"
            className="dashboard-brand__logo"
          />
          <span className="dashboard-brand__accent" aria-hidden="true" />
        </Link>

        <nav className="dashboard-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive
                  ? "dashboard-nav__link is-active"
                  : "dashboard-nav__link"
              }
            >
              <span className="dashboard-nav__icon">
                <NavIcon name={item.icon} />
              </span>
              <span>{item.label}</span>
            </NavLink>
          ))}

          <a href="/#guide" className="dashboard-nav__link">
            <span className="dashboard-nav__icon">
              <NavIcon name="info" />
            </span>
            <span>Hướng dẫn</span>
          </a>

          {(user?.role === "admin" || user?.role === "club") && (
            <NavLink
              to="/manage"
              className={({ isActive }) =>
                isActive
                  ? "dashboard-nav__link is-active"
                  : "dashboard-nav__link"
              }
            >
              <span className="dashboard-nav__icon">
                <NavIcon name="calendar" />
              </span>
              <span>Quản lý</span>
            </NavLink>
          )}
        </nav>

        <div className="dashboard-sidebar__promo">
          <div className="dashboard-sidebar__promo-title">Tuổi trẻ HUTECH</div>
          <p>Làm theo lời Bác, cống hiến và lan tỏa việc tốt mỗi ngày.</p>
        </div>

        {!user && (
          <div className="dashboard-signin-card">
            <div className="dashboard-signin-card__title">Sign in</div>
            <p>
              Đăng nhập để tham gia hoạt động, gửi việc tốt và theo dõi điểm số.
            </p>
            <Link to="/login" className="dashboard-signin-card__button">
              Đăng Ký Ngay!
            </Link>
          </div>
        )}
      </aside>

      <div className="dashboard-main">
        <header className="dashboard-topbar">
          <div className="dashboard-topbar__left">
            <button
              className="dashboard-icon-button"
              type="button"
              aria-label="Menu"
            >
              ☰
            </button>
            <div>
              <p className="dashboard-topbar__greeting">
                Xin chào, {firstName}! 👋
              </p>
              <p className="dashboard-topbar__sub">
                Hãy tiếp tục hành trình tình nguyện hôm nay
              </p>
            </div>
          </div>

          <label className="dashboard-search">
            <span>🔎</span>
            <input
              type="search"
              placeholder="Tìm kiếm hoạt động..."
              aria-label="Tìm kiếm hoạt động"
            />
          </label>

          <div className="dashboard-topbar__actions">
            <button
              className="dashboard-icon-button dashboard-icon-button--badge"
              type="button"
              aria-label="Thông báo"
            >
              🔔
              <span>3</span>
            </button>

            {user ? (
              <>
                <Link to="/profile" className="dashboard-user-chip">
                  <span className="dashboard-user-chip__avatar">
                    {initials}
                  </span>
                  <span className="dashboard-user-chip__meta">
                    <strong>{user.name}</strong>
                    <small>
                      {formatRole(user?.role)} · {user.points || 0} điểm
                    </small>
                  </span>
                </Link>
                <button
                  className="dashboard-logout"
                  onClick={handleLogout}
                  type="button"
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <Link to="/login" className="dashboard-login-link">
                Đăng Nhập
              </Link>
            )}
          </div>
        </header>

        <main className="dashboard-content">{children}</main>
      </div>
    </div>
  );
}
