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
  const { user, loading, logout, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [activitiesLoading, setActivitiesLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [registering, setRegistering] = useState(null);
  const [toast, setToast] = useState(null);
  const [approvedHistory, setApprovedHistory] = useState([]);
  const [approvedHistoryLoading, setApprovedHistoryLoading] = useState(true);
  const initials = user?.name
    ? user.name
        .split(" ")
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase()
    : "?";

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

  useEffect(() => {
    if (!loading && user) {
      fetchActivities();
    }

    if (!loading && !user) {
      setActivitiesLoading(false);
    }
  }, [loading, user]);

  useEffect(() => {
    if (!toast) return undefined;

    const timer = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const handleCancel = async (activity) => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (new Date(activity.date).getTime() <= Date.now()) {
      setToast({ type: "danger", message: "Không thể hủy hoạt động đã diễn ra." });
      return;
    }

    setRegistering(activity._id);
    try {
      const response = await activityService.cancelRegistrationForActivity(activity._id);
      await Promise.all([fetchActivities(), refreshUser()]);
      setToast({ type: "success", message: response.message || "Đã hủy đăng ký thành công." });
    } catch (error) {
      setToast({ type: "danger", message: "Hủy đăng ký thất bại: " + error });
    } finally {
      setRegistering(null);
    }
  };

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

  const fetchApprovedHistory = async () => {
    if (!user) return;
    setApprovedHistoryLoading(true);
    try {
      const regs = await activityService.getUserRegistrations("approved");
      setApprovedHistory(Array.isArray(regs) ? regs : []);
    } catch (error) {
      console.error("Failed to load approved history:", error);
      setApprovedHistory([]);
    } finally {
      setApprovedHistoryLoading(false);
    }
  };

  useEffect(() => {
    if (!loading && user) {
      fetchApprovedHistory();
    }
  }, [loading, user]);


  if (loading) {
    return <p className="loading-state">Đang tải hồ sơ...</p>;
  }

  if (!user) {
    return (
      <div className="container page-section page-stack">
        <section className="page-hero animate-rise">
          <div className="hero-grid">
            <div>
              <div className="hero-kicker">🔒 Đăng ký của tôi</div>
              <h1 className="hero-title" style={{ maxWidth: "none" }}>
                Cần đăng nhập để xem đăng ký của bạn
              </h1>
              <p className="hero-subtitle">
                Mục này hiển thị hoạt động đã đăng ký và lịch sử tham gia. Hãy
                đăng nhập để xem dữ liệu cá nhân của bạn.
              </p>
              <div className="hero-actions">
                <button
                  className="button button--primary"
                  type="button"
                  onClick={() => navigate("/login")}
                >
                  Đăng nhập ngay
                </button>
                <button
                  className="button button--secondary"
                  type="button"
                  onClick={() => navigate("/activities")}
                >
                  Xem hoạt động
                </button>
              </div>
            </div>

            <div className="hero-panel hero-panel--muted">
              <div className="hero-panel__title">Trạng thái truy cập</div>
              <div
                className="dashboard-stats"
                style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}
              >
                <div className="dashboard-stat">
                  <div className="dashboard-stat__label">Đăng ký của tôi</div>
                  <div className="dashboard-stat__value">Khóa</div>
                </div>
                <div className="dashboard-stat">
                  <div className="dashboard-stat__label">Lịch sử</div>
                  <div className="dashboard-stat__value">Ẩn</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="container page-section page-stack">
      {toast && (
        <div
          className={
            toast.type === "success"
              ? "profile-toast profile-toast--success animate-rise"
              : "profile-toast profile-toast--danger animate-rise"
          }
        >
          <div>
            <div className="profile-toast__title">
              {toast.type === "success" ? "Thành công" : "Thông báo"}
            </div>
            <div className="profile-toast__body">{toast.message}</div>
          </div>
          <button
            type="button"
            className="profile-toast__close"
            aria-label="Đóng thông báo"
            onClick={() => setToast(null)}
          >
            ×
          </button>
        </div>
      )}
      <section className="page-hero animate-rise">
        <div className="hero-grid">
          <div>
            <div className="hero-kicker">📋 Đăng ký của tôi</div>
            <h1 className="hero-title" style={{ maxWidth: "none" }}>
              Hoạt động đã đăng ký và lịch sử tham gia được duyệt
            </h1>
            <p className="hero-subtitle">
              Danh sách hoạt động bạn đã đăng ký và lịch sử các hoạt động đã được
              CLB/admin duyệt cộng điểm.
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
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "1rem" }}>
            {registeredActivities.map((activity) => {
              const isUpcoming = new Date(activity.date).getTime() >= Date.now();
              return (
                <div
                  key={activity._id}
                  className="page-stack"
                  style={{ gap: "0.85rem" }}
                >
                  <ActivityCard
                    activity={activity}
                    statusLabel={isUpcoming ? "Sắp diễn ra" : "Đã tham gia"}
                  />
                  <div
                    className="activity-actions"
                    style={{ gap: "0.75rem" }}
                  >
                    <button
                      className="button button--secondary activity-action-button"
                      type="button"
                      onClick={() => navigate(`/activities/${activity._id}`)}
                    >
                      Xem chi tiết
                    </button>
                    {isUpcoming ? (
                      <button
                        className={`button button--ghost activity-action-button`}
                        type="button"
                        onClick={() => handleCancel(activity)}
                        disabled={registering === activity._id}
                      >
                        Hủy đăng ký
                      </button>
                    ) : (
                      <button
                        className={`button button--ghost activity-action-button`}
                        type="button"
                        disabled
                      >
                        Đã tham gia
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="section-card animate-rise page-stack" style={{ marginTop: "1.5rem" }}>
        <div>
          <h2 className="section-heading">Lịch sử được duyệt</h2>
          <p className="section-copy">
            Danh sách các hoạt động đã được CLB/admin duyệt và cộng điểm.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "0.75rem", alignItems: "baseline" }}>
          <span style={{ color: "var(--muted)", fontWeight: 600 }}>Tổng cộng:</span>
          <span style={{ fontSize: "1.15rem", fontWeight: 700 }}>{approvedHistory.length} hoạt động</span>
        </div>

        {approvedHistoryLoading ? (
          <p className="loading-state">Đang tải lịch sử đã duyệt...</p>
        ) : approvedHistory.length === 0 ? (
          <p className="empty-state">Chưa có hoạt động nào được duyệt để hiển thị.</p>
        ) : (
          <div className="page-stack" style={{ gap: "0.6rem", marginTop: "0.75rem" }}>
            {approvedHistory.map((registration) => {
              const activity = registration?.activity;
              if (!activity) return null;

              return (
                <article
                  key={registration._id}
                  style={{
                    padding: "0.7rem 0.9rem",
                    borderRadius: "8px",
                    background: "#f8f9fa",
                    display: "grid",
                    gridTemplateColumns: "minmax(0, 1fr) auto",
                    gap: "0.75rem",
                    alignItems: "center",
                    fontSize: "0.95rem",
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <h4 style={{ margin: "0 0 0.25rem", fontSize: "0.98rem", fontWeight: 600, wordBreak: "break-word" }}>
                      {activity.title || "Hoạt động không xác định"}
                    </h4>
                    <p style={{ color: "var(--muted)", margin: "0.2rem 0 0", fontSize: "0.85rem" }}>
                      {activity.organizer?.name || "Đơn vị tổ chức"} · {formatDisplayDate(activity.date)}
                    </p>
                  </div>

                  <div style={{ whiteSpace: "nowrap", fontWeight: 700, color: "#d21d27", fontSize: "0.95rem" }}>
                    +{activity.points || 0}pt
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
