import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ActivityCard from "../components/ActivityCard";
import { useAuth } from "../hooks/useAuth";
import { activityService } from "../services/activityService";

function formatDisplayDate(value) {
  if (!value) return "Chưa cập nhật";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Chưa cập nhật";

  return date.toLocaleDateString("vi-VN");
}

export default function Profile() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [activitiesLoading, setActivitiesLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
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
    const fetchActivities = async () => {
      if (!user) return;

      try {
        const data = await activityService.getAllActivities();
        setActivities(Array.isArray(data) ? data : []);
      } catch (error) {
        setErrorMessage(error);
      } finally {
        setActivitiesLoading(false);
      }
    };

    if (!loading && user) {
      fetchActivities();
    }

    if (!loading && !user) {
      setActivitiesLoading(false);
    }
  }, [loading, user]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const registeredActivityIds = new Set(user?.registeredActivities || []);
  const registeredActivities = activities.filter((activity) =>
    registeredActivityIds.has(activity._id),
  );
  const upcomingActivities = registeredActivities
    .filter((activity) => new Date(activity.date).getTime() >= Date.now())
    .sort((left, right) => new Date(left.date) - new Date(right.date));
  const pastActivities = registeredActivities
    .filter((activity) => new Date(activity.date).getTime() < Date.now())
    .sort((left, right) => new Date(right.date) - new Date(left.date));

  const historyItems = [...pastActivities, ...upcomingActivities].sort(
    (left, right) => new Date(right.date) - new Date(left.date),
  );

  if (loading || !user) {
    return <p className="loading-state">Đang tải hồ sơ...</p>;
  }

  return (
    <div className="container page-section page-stack">
      <section className="page-hero animate-rise">
        <div className="hero-grid">
          <div>
            <div className="hero-kicker">📋 Đăng ký của tôi</div>
            <h1 className="hero-title" style={{ maxWidth: "none" }}>
              Hoạt động đã đăng ký và lịch sử tham gia
            </h1>
            <p className="hero-subtitle">
              Trang này chỉ hiển thị các hoạt động bạn đã đăng ký, cùng lịch sử
              tham gia theo thời gian để bạn dễ theo dõi.
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
                  {registeredActivities.length}
                </div>
              </div>
              <div className="dashboard-stat">
                <div className="dashboard-stat__label">Sắp diễn ra</div>
                <div className="dashboard-stat__value">
                  {upcomingActivities.length}
                </div>
              </div>
              <div className="dashboard-stat">
                <div className="dashboard-stat__label">Đã tham gia</div>
                <div className="dashboard-stat__value">
                  {pastActivities.length}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {errorMessage && (
        <div className="notice notice--danger animate-rise">{errorMessage}</div>
      )}

      <section className="grid-2">
        <section className="section-card animate-rise page-stack">
          <div>
            <h2 className="section-heading">Hoạt động đã đăng ký</h2>
            <p className="section-copy">
              Các hoạt động bạn đã bấm đăng ký, sắp xếp theo thời gian diễn ra.
            </p>
          </div>

          {activitiesLoading ? (
            <p className="loading-state">Đang tải hoạt động...</p>
          ) : registeredActivities.length === 0 ? (
            <p className="empty-state">Bạn chưa đăng ký hoạt động nào.</p>
          ) : (
            <div className="page-stack">
              {upcomingActivities.length > 0 && (
                <div className="page-stack" style={{ gap: "0.85rem" }}>
                  <h3 className="section-copy" style={{ marginBottom: 0 }}>
                    Sắp diễn ra
                  </h3>
                  {upcomingActivities.map((activity) => (
                    <ActivityCard key={activity._id} activity={activity} />
                  ))}
                </div>
              )}

              {pastActivities.length > 0 && (
                <div className="page-stack" style={{ gap: "0.85rem" }}>
                  <h3 className="section-copy" style={{ marginBottom: 0 }}>
                    Đã tham gia
                  </h3>
                  {pastActivities.map((activity) => (
                    <ActivityCard key={activity._id} activity={activity} />
                  ))}
                </div>
              )}
            </div>
          )}
        </section>

        <section className="section-card animate-rise page-stack">
          <div>
            <h2 className="section-heading">Lịch sử tham gia</h2>
            <p className="section-copy">
              Nhật ký các hoạt động đã đăng ký, bao gồm cả hoạt động đã hoàn
              thành và hoạt động sắp diễn ra.
            </p>
          </div>

          <div className="stat-card">
            <p className="stat-label">Tổng lượt hoạt động</p>
            <p className="stat-value" style={{ fontSize: "2rem" }}>
              {historyItems.length}
            </p>
          </div>

          {activitiesLoading ? (
            <p className="loading-state">Đang tải lịch sử...</p>
          ) : historyItems.length === 0 ? (
            <p className="empty-state">Chưa có lịch sử tham gia để hiển thị.</p>
          ) : (
            <div className="page-stack" style={{ gap: "0.85rem" }}>
              {historyItems.map((activity) => {
                const isPast = new Date(activity.date).getTime() < Date.now();

                return (
                  <article
                    key={activity._id}
                    className="activity-card"
                    style={{ padding: "1rem 1.1rem" }}
                  >
                    <div className="meta-row" style={{ marginTop: 0 }}>
                      <span className="meta-pill">
                        {isPast ? "Đã tham gia" : "Sắp diễn ra"}
                      </span>
                      <span className="meta-pill">+{activity.points} điểm</span>
                    </div>
                    <h3 style={{ marginTop: "0.8rem", fontSize: "1.08rem" }}>
                      {activity.title}
                    </h3>
                    <p style={{ color: "var(--muted)", marginTop: "0.35rem" }}>
                      {activity.location} · {formatDisplayDate(activity.date)}
                    </p>
                    <div className="meta-row" style={{ marginTop: "0.8rem" }}>
                      <span className="meta-pill">{activity.category}</span>
                      <span className="meta-pill">
                        {isPast ? "Đã hoàn thành" : "Đang chờ tham gia"}
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </section>
    </div>
  );
}
