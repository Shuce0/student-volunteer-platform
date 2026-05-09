import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ActivityCard from "../components/ActivityCard";
import { activityService } from "../services/activityService";

export default function ClubDetails() {
  const { clubId } = useParams();
  const navigate = useNavigate();
  const [club, setClub] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadClubActivities = async () => {
      try {
        const data = await activityService.getClubActivitiesById(clubId);
        setClub(data.club || null);
        setActivities(Array.isArray(data.activities) ? data.activities : []);
      } catch (fetchError) {
        setError(fetchError);
      } finally {
        setLoading(false);
      }
    };

    loadClubActivities();
  }, [clubId]);

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
              {club?.name || "Chi tiết CLB"}
            </h1>
            <p className="hero-subtitle">
              {club?.email || "Đang tải dữ liệu CLB..."}
            </p>
            <div className="hero-actions">
              <button
                className="button button--secondary"
                type="button"
                onClick={() => navigate("/clubs")}
              >
                Quay lại danh sách CLB
              </button>
            </div>
          </div>

          <div className="hero-panel hero-panel--muted">
            <div className="hero-panel__title">Thống kê nhanh</div>
            <div
              className="dashboard-stats"
              style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}
            >
              <div className="dashboard-stat">
                <div className="dashboard-stat__label">Hoạt động</div>
                <div className="dashboard-stat__value">{activities.length}</div>
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
        <p className="loading-state">Đang tải bài đăng của CLB...</p>
      ) : error ? (
        <p className="empty-state">{error}</p>
      ) : activities.length === 0 ? (
        <p className="empty-state">CLB này chưa đăng hoạt động nào.</p>
      ) : (
        <div className="page-stack">
          {activities.map((activity) => (
            <ActivityCard key={activity._id} activity={activity} />
          ))}
        </div>
      )}
    </div>
  );
}
