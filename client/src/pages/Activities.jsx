import { useState, useEffect } from "react";
import { activityService } from "../services/activityService";
import ActivityCard from "../components/ActivityCard";

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
  const totalActivities = activities.length;
  const openSlots = activities.reduce(
    (sum, activity) =>
      sum +
      Math.max(
        (activity.maxParticipants || 0) -
          (activity.registeredParticipants?.length || 0),
        0,
      ),
    0,
  );
  const totalPoints = activities.reduce(
    (sum, activity) => sum + (activity.points || 0),
    0,
  );

  return (
    <div className="container page-section page-stack">
      <section className="page-hero animate-rise">
        <div className="hero-grid">
          <div>
            <div className="hero-kicker">📋 Hoạt động tình nguyện</div>
            <h1 className="hero-title" style={{ maxWidth: "none" }}>
              Danh sách hoạt động HUTECH
            </h1>
            <p className="hero-subtitle">
              Chọn hoạt động phù hợp, đăng ký nhanh và theo dõi điểm số ngay
              trong một giao diện dashboard gọn gàng.
            </p>
            <div className="hero-actions">
              <button
                className="button button--primary"
                type="button"
                onClick={() => handleFilterChange("all")}
              >
                Xem tất cả
              </button>
              <button
                className="button button--secondary"
                type="button"
                onClick={() => handleFilterChange(categories[1] || "all")}
              >
                Lọc nhanh
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
                <div className="dashboard-stat__label">Hoạt động</div>
                <div className="dashboard-stat__value">{totalActivities}</div>
              </div>
              <div className="dashboard-stat">
                <div className="dashboard-stat__label">Chỗ trống</div>
                <div className="dashboard-stat__value">{openSlots}</div>
              </div>
              <div className="dashboard-stat">
                <div className="dashboard-stat__label">Điểm tích lũy</div>
                <div className="dashboard-stat__value">{totalPoints}</div>
              </div>
              <div className="dashboard-stat">
                <div className="dashboard-stat__label">Danh mục</div>
                <div className="dashboard-stat__value">
                  {categories.length - 1}
                </div>
              </div>
            </div>
          </div>
        </div>
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
            <div
              key={activity._id}
              className="page-stack"
              style={{ gap: "0.85rem" }}
            >
              <ActivityCard activity={activity} />
              <button
                className="button button--primary"
                style={{ width: "100%" }}
                onClick={() => handleRegister(activity._id)}
                disabled={registering === activity._id}
              >
                {registering === activity._id
                  ? "Đang đăng ký..."
                  : "Đăng ký tham gia"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
