import { useEffect, useMemo, useState } from "react";
import { activityService } from "../services/activityService";
import ActivityCard from "../components/ActivityCard";

export default function Clubs() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClubId, setSelectedClubId] = useState("");

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

  useEffect(() => {
    if (!selectedClubId && clubs.length > 0) {
      setSelectedClubId(clubs[0]._id);
    }
  }, [clubs, selectedClubId]);

  const selectedClub =
    clubs.find((club) => club._id === selectedClubId) || clubs[0];
  const selectedClubActivities = selectedClub?.activities || [];
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
              Bấm vào từng CLB để xem chi tiết các hoạt động mà CLB đó đăng tải
              cùng danh sách người đã đăng ký.
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
        <div className="grid-2">
          <section className="section-card animate-rise">
            <div className="dashboard-section-title">
              <h2 className="section-heading" style={{ marginBottom: 0 }}>
                Danh sách CLB
              </h2>
              <span className="meta-pill">{clubs.length} CLB</span>
            </div>

            <div className="page-stack">
              {clubs.map((club) => {
                const activityCount = club.activities.length;
                const registeredCount = club.activities.reduce(
                  (sum, activity) =>
                    sum + (activity.registeredParticipants?.length || 0),
                  0,
                );

                const isActive = selectedClub?._id === club._id;

                return (
                  <button
                    key={club._id}
                    type="button"
                    onClick={() => setSelectedClubId(club._id)}
                    className="section-card"
                    style={{
                      textAlign: "left",
                      border: isActive
                        ? "1px solid rgba(210, 29, 39, 0.35)"
                        : "1px solid rgba(210, 29, 39, 0.12)",
                      boxShadow: isActive
                        ? "0 16px 34px rgba(210, 29, 39, 0.14)"
                        : undefined,
                      cursor: "pointer",
                    }}
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
                      <span className="meta-pill">
                        {activityCount} hoạt động
                      </span>
                      <span className="meta-pill">
                        {registeredCount} lượt đăng ký
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="section-card animate-rise">
            <div className="dashboard-section-title">
              <div>
                <h2 className="section-heading" style={{ marginBottom: 0 }}>
                  {selectedClub?.name || "Chi tiết CLB"}
                </h2>
                <p className="section-copy" style={{ marginBottom: 0 }}>
                  {selectedClub?.email || "Chọn một CLB để xem hoạt động"}
                </p>
              </div>
              <span className="meta-pill">Hoạt động đã đăng</span>
            </div>

            {selectedClubActivities.length === 0 ? (
              <p className="empty-state">CLB này chưa đăng hoạt động nào.</p>
            ) : (
              <div className="page-stack">
                {selectedClubActivities.map((activity) => (
                  <article
                    key={activity._id}
                    className="page-stack"
                    style={{ gap: "0.85rem" }}
                  >
                    <ActivityCard activity={activity} />

                    <div className="page-stack" style={{ gap: "0.6rem" }}>
                      <h3 style={{ fontSize: "1.05rem" }}>Người đã đăng ký</h3>
                      {activity.registeredParticipants?.length > 0 ? (
                        <div className="chip-row">
                          {activity.registeredParticipants.map(
                            (participant) => (
                              <span
                                key={participant._id}
                                className="chip chip--active"
                              >
                                {participant.name}
                              </span>
                            ),
                          )}
                        </div>
                      ) : (
                        <p
                          className="empty-state"
                          style={{ padding: "0.5rem 0 0" }}
                        >
                          Chưa có ai đăng ký hoạt động này.
                        </p>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
