import { useState, useEffect } from "react";
import { activityService } from "../services/activityService";

export default function Activities() {
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [registering, setRegistering] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const data = await activityService.getAllActivities();
        setActivities(data);
        setFilteredActivities(data);
      } catch (error) {
        console.error("Failed to fetch activities:", error);
        setMessage("Không thể tải danh sách hoạt động");
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const handleRegister = async (activityId) => {
    setRegistering(activityId);
    try {
      await activityService.registerForActivity(activityId);
      setMessage("✅ Đăng ký thành công!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage("❌ Đăng ký thất bại: " + error);
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setRegistering(null);
    }
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    if (newFilter === "all") {
      setFilteredActivities(activities);
    } else {
      setFilteredActivities(activities.filter((a) => a.category === newFilter));
    }
  };

  const categories = ["all", ...new Set(activities.map((a) => a.category))];

  return (
    <div className="container page-section page-stack">
      <section className="page-hero animate-rise" style={{ padding: "2rem" }}>
        <div className="hero-kicker">📋 Volunteer activities</div>
        <h1 className="hero-title" style={{ maxWidth: "none" }}>
          Danh sách hoạt động tình nguyện
        </h1>
        <p className="hero-subtitle">
          Chọn hoạt động phù hợp, đăng ký nhanh và theo dõi điểm số của bạn ngay
          lập tức.
        </p>
      </section>

      {message && (
        <div className="notice notice--success animate-rise">{message}</div>
      )}

      <section className="section-card animate-rise">
        <h2 className="section-heading">Lọc theo danh mục</h2>
        <div className="chip-row">
          {categories.map((category) => (
            <button
              key={category}
              className={filter === category ? "chip chip--active" : "chip"}
              onClick={() => handleFilterChange(category)}
            >
              {category === "all" ? "Tất cả" : category}
            </button>
          ))}
        </div>
      </section>

      {loading ? (
        <p className="loading-state">Đang tải hoạt động...</p>
      ) : filteredActivities.length === 0 ? (
        <p className="empty-state">Không có hoạt động nào</p>
      ) : (
        <div className="grid-2">
          {filteredActivities.map((activity) => (
            <article key={activity._id} className="activity-card animate-rise">
              <div className="meta-row" style={{ marginTop: 0 }}>
                <span className="meta-pill">+{activity.points} points</span>
                <span className="meta-pill">{activity.category}</span>
              </div>
              <h3 style={{ marginTop: "0.9rem" }}>{activity.title}</h3>
              <p style={{ color: "var(--muted)", marginTop: "0.55rem" }}>
                {activity.description}
              </p>

              <div className="meta-row">
                <span className="meta-pill">📍 {activity.location}</span>
                <span className="meta-pill">
                  📅 {new Date(activity.date).toLocaleDateString("vi-VN")}
                </span>
                <span className="meta-pill">
                  👥 {activity.registeredParticipants?.length || 0}/
                  {activity.maxParticipants}
                </span>
              </div>

              <button
                className="button button--primary"
                style={{ width: "100%", marginTop: "1rem" }}
                onClick={() => handleRegister(activity._id)}
                disabled={registering === activity._id}
              >
                {registering === activity._id
                  ? "Đang đăng ký..."
                  : "Đăng ký tham gia"}
              </button>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
