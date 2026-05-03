import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/activities", label: "Activities" },
  { to: "/good-deeds", label: "Good Deeds" },
  { to: "/leaderboard", label: "Leaderboard" },
  { to: "/clubs", label: "Clubs" },
  { to: "/login", label: "Login" },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="app-nav">
      <div className="app-nav__inner">
        <Link to="/" className="app-brand">
          <span className="app-brand__title">Student Volunteer Platform</span>
          <span className="app-brand__subtitle">
            Campus service, reimagined for Gen Z
          </span>
        </Link>

        <div className="app-nav__links">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive
                  ? "app-nav__link app-nav__link--active"
                  : "app-nav__link"
              }
            >
              {item.label}
            </NavLink>
          ))}

          {user ? (
            <>
              <Link
                to="/profile"
                className="app-nav__link app-nav__link--active"
              >
                👋 {user.name?.split(" ")[0] || "Profile"} · {user.points || 0}{" "}
                pts
              </Link>
              <button
                className="app-nav__link"
                onClick={handleLogout}
                type="button"
              >
                Logout
              </button>
            </>
          ) : null}
        </div>
      </div>
    </nav>
  );
}
