import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { activityService } from "../services/activityService";

export default function Clubs() {
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const data = await activityService.getAllActivities();
        setActivities(data);
      } catch (error) {
        console.error("Failed to fetch club activities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const clubs = useMemo(() => {
    const clubMap = activities.reduce((map, activity) => {
      const organizer = activity.organizer;
      if (!organizer || organizer.role !== "club") return map;

      const existing = map.get(organizer._id) || {
        ...organizer,
        activities: [],
      };

      existing.activities.push(activity);
      map.set(organizer._id, existing);
      return map;
    }, new Map());

    return Array.from(clubMap.values()).sort((left, right) =>
      left.name.localeCompare(right.name, "vi"),
    );
  }, [activities]);

  const totalActivities = activities.length;
  const totalRegistered = activities.reduce(
    (sum, activity) => sum + (activity.registeredParticipants?.length || 0),
    0,
  );

  return (
    <div className="container page-section page-stack">
      <section className="page-hero animate-rise">
        <div className="hero-grid">
          <div>
            <div className="hero-kicker">🏫 Khu CLB</div>
            <h1 className="hero-title" style={{ maxWidth: "none" }}>
              CLB đăng hoạt động và người tham gia
            </h1>
            <p className="hero-subtitle">
              Bấm vào từng CLB để chuyển sang trang riêng và xem bài đăng của
              CLB đó.
            </p>
          </div>

          <div className="hero-panel hero-panel--muted">
            <div className="hero-panel__title">Thống kê nhanh</div>
            <div
              className="dashboard-stats"
              style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}
            >
              <div className="dashboard-stat">
                <div className="dashboard-stat__label">Hoạt động</div>
                <div className="dashboard-stat__value">{totalActivities}</div>
              </div>
              <div className="dashboard-stat">
                <div className="dashboard-stat__label">Lượt đăng ký</div>
                <div className="dashboard-stat__value">{totalRegistered}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {loading ? (
        <p className="loading-state">Đang tải dữ liệu CLB...</p>
      ) : clubs.length === 0 ? (
        <p className="empty-state">Chưa có tài khoản CLB nào đăng hoạt động.</p>
      ) : (
        <section className="section-card animate-rise page-stack">
          <div className="dashboard-section-title">
            <div>
              <h2 className="section-heading" style={{ marginBottom: 0 }}>
                Danh sách CLB
              </h2>
              <p className="section-copy" style={{ marginBottom: 0 }}>
                Bấm vào một CLB để mở trang chi tiết riêng của CLB đó.
              </p>
            </div>
            <span className="meta-pill">{clubs.length} CLB</span>
          </div>

          <div className="clubs-grid">
            {clubs.map((club) => {
              const activityCount = club.activities.length;
              const registeredCount = club.activities.reduce(
                (sum, activity) =>
                  sum + (activity.registeredParticipants?.length || 0),
                0,
              );

              return (
                <div
                  key={club._id}
                  role="button"
                  tabIndex={0}
                  onClick={() => navigate(`/clubs/${club._id}`)}
                  onKeyDown={(e) => {
                    if (
                      e.key === "Enter" ||
                      e.key === " " ||
                      e.key === "Spacebar"
                    ) {
                      e.preventDefault();
                      navigate(`/clubs/${club._id}`);
                    }
                  }}
                  className="section-card club-card"
                >
                  <div
                    className="dashboard-section-title"
                    style={{ marginBottom: 0 }}
                  >
                    <div>
                      <h3 style={{ marginBottom: 0 }}>{club.name}</h3>
                      <p className="section-copy" style={{ marginBottom: 0 }}>
                        {club.email}
                      </p>
                    </div>
                    <span className="meta-pill">CLB</span>
                  </div>

                  <div className="meta-row" style={{ marginTop: "0.75rem" }}>
                    <span className="meta-pill">{activityCount} hoạt động</span>
                    <span className="meta-pill">
                      {registeredCount} lượt đăng ký
                    </span>
                  </div>

                  <div
                    style={{
                      marginTop: "0.85rem",
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    <button
                      type="button"
                      className="button button--primary"
                      onClick={(ev) => {
                        ev.stopPropagation();
                        navigate(`/clubs/${club._id}`);
                      }}
                    >
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
