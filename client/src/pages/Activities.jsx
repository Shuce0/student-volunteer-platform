import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ActivityCard from "../components/ActivityCard";
import { useAuth } from "../hooks/useAuth";
import { activityService } from "../services/activityService";

function getParticipantId(participant) {
  if (!participant) return null;
  if (typeof participant === "string") return participant;
  return participant._id || participant.id || null;
}

export default function Activities() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewTab, setViewTab] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [registering, setRegistering] = useState(null);
  const [toast, setToast] = useState(null);

  const currentUserId = user?._id || user?.id || null;
  const isAnonymous = !user;
  const now = Date.now();

  const loadActivities = async () => {
    try {
      const data = await activityService.getAllActivities();
      const newestActivities = [...data].sort(
        (left, right) =>
          new Date(right.createdAt || right.date) -
          new Date(left.createdAt || left.date),
      );
      setActivities(newestActivities);
    } catch (error) {
      console.error("Failed to fetch activities:", error);
      setToast({
        type: "danger",
        message: "Không thể tải danh sách hoạt động",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActivities();
  }, []);

  useEffect(() => {
    if (!toast) return undefined;

    const timer = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const isUpcoming = (activity) => new Date(activity.date).getTime() >= now;

  const isRegistered = (activity) => {
    if (!currentUserId) return false;

    return activity.registeredParticipants?.some(
      (participant) =>
        getParticipantId(participant)?.toString() === currentUserId.toString(),
    );
  };

  const isParticipated = (activity) =>
    isRegistered(activity) && !isUpcoming(activity);

  const isFull = (activity) =>
    (activity.registeredParticipants?.length || 0) >=
    (activity.maxParticipants || 0);

  const categories = useMemo(
    () => ["all", ...new Set(activities.map((activity) => activity.category))],
    [activities],
  );

  const viewTabs = useMemo(() => {
    const upcomingCount = activities.filter((activity) =>
      isUpcoming(activity),
    ).length;
    const participatedCount = activities.filter((activity) =>
      isParticipated(activity),
    ).length;

    return [
      { id: "upcoming", label: "Sắp diễn ra", count: upcomingCount },
      { id: "participated", label: "Đã tham gia", count: participatedCount },
      { id: "all", label: "Tất cả", count: activities.length },
    ];
  }, [activities, currentUserId]);

  const visibleActivities = useMemo(() => {
    let next = activities;

    if (viewTab === "upcoming") {
      next = next.filter((activity) => isUpcoming(activity));
    } else if (viewTab === "participated") {
      next = next.filter((activity) => isParticipated(activity));
    }

    if (categoryFilter !== "all") {
      next = next.filter((activity) => activity.category === categoryFilter);
    }

    if (searchQuery.trim()) {
      const normalizedQuery = searchQuery.trim().toLowerCase();
      next = next.filter((activity) =>
        activity.title?.toLowerCase().includes(normalizedQuery),
      );
    }

    return next;
  }, [activities, categoryFilter, searchQuery, viewTab]);

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

  const handleRegister = async (activity) => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!isUpcoming(activity)) {
      setToast({ type: "danger", message: "Hoạt động này đã diễn ra." });
      return;
    }

    if (isRegistered(activity)) {
      setToast({
        type: "success",
        message: "Bạn đã đăng ký hoạt động này rồi.",
      });
      return;
    }

    if (isFull(activity)) {
      setToast({ type: "danger", message: "Hoạt động đã đầy chỗ." });
      return;
    }

    setRegistering(activity._id);
    try {
      const response = await activityService.registerForActivity(activity._id);
      await Promise.all([loadActivities(), refreshUser()]);
      setToast({
        type: "success",
        message:
          response.message ||
          "Đăng ký thành công. Nút đã chuyển sang trạng thái đã đăng ký.",
      });
    } catch (error) {
      setToast({ type: "danger", message: "Đăng ký thất bại: " + error });
    } finally {
      setRegistering(null);
    }
  };

  const handleCancel = async (activity) => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!isRegistered(activity)) {
      setToast({ type: "danger", message: "Hoạt động này chưa được đăng ký." });
      return;
    }

    if (!isUpcoming(activity)) {
      setToast({
        type: "danger",
        message: "Chỉ có thể hủy các hoạt động sắp diễn ra.",
      });
      return;
    }

    setRegistering(activity._id);
    try {
      const response = await activityService.cancelRegistrationForActivity(
        activity._id,
      );
      await Promise.all([loadActivities(), refreshUser()]);
      setToast({
        type: "success",
        message: response.message || "Đã hủy đăng ký thành công.",
      });
    } catch (error) {
      setToast({ type: "danger", message: "Hủy đăng ký thất bại: " + error });
    } finally {
      setRegistering(null);
    }
  };

  const getStatusLabel = (activity) => {
    if (isParticipated(activity)) return "Đã tham gia";
    if (isUpcoming(activity)) return "Sắp diễn ra";
    return "Đã diễn ra";
  };

  const getPrimaryAction = (activity) => {
    // Primary action toggles between Đăng ký / Hủy đăng ký depending on state
    if (isParticipated(activity)) {
      return {
        label: "Đã tham gia",
        className: "button button--ghost",
        onClick: () => {},
        disabled: true,
      };
    }

    if (isRegistered(activity)) {
      return {
        label: "Hủy đăng ký",
        className: "button button--ghost",
        onClick: () => handleCancel(activity),
        disabled: registering === activity._id,
      };
    }

    return {
      label: "Đăng ký",
      className: "button button--primary",
      onClick: () => handleRegister(activity),
      disabled: isFull(activity) || registering === activity._id,
    };
  };

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
            <div className="hero-kicker">📋 Hoạt động tình nguyện</div>
            <h1 className="hero-title" style={{ maxWidth: "none" }}>
              Danh sách hoạt động HUTECH
            </h1>
            <p className="hero-subtitle">
              Duyệt hoạt động theo tab, xem chi tiết trên trang riêng và đăng ký
              hoặc hủy đăng ký ngay từ đây.
            </p>
            <div className="hero-actions">
              <button
                className="button button--primary"
                type="button"
                onClick={() => setCategoryFilter("all")}
              >
                Xem tất cả danh mục
              </button>
              <button
                className="button button--secondary"
                type="button"
                onClick={() =>
                  isAnonymous ? navigate("/login") : navigate("/profile")
                }
              >
                {isAnonymous
                  ? "Đăng nhập để theo dõi của tôi"
                  : "Xem lịch sử của tôi"}
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

      {isAnonymous && (
        <section className="section-card animate-rise">
          <div className="dashboard-section-title">
            <div>
              <h2 className="section-heading" style={{ marginBottom: 0 }}>
                Chế độ xem công khai
              </h2>
              <p className="section-copy" style={{ marginBottom: 0 }}>
                Bạn vẫn có thể xem danh sách hoạt động, lọc, tìm kiếm và mở chi
                tiết. Chỉ cần đăng nhập khi muốn đăng ký hoặc hủy đăng ký.
              </p>
            </div>
            <button
              className="button button--secondary"
              type="button"
              onClick={() => navigate("/login")}
            >
              Đăng nhập
            </button>
          </div>
        </section>
      )}

      <section className="section-card animate-rise activity-filter-panel">
        <div className="dashboard-section-title activity-filter-panel__header">
          <div>
            <h2 className="section-heading" style={{ marginBottom: 0 }}>
              Bộ lọc hoạt động
            </h2>
            <p className="section-copy" style={{ marginBottom: 0 }}>
              Lọc theo trạng thái, danh mục và tên hoạt động trong một khối.
            </p>
          </div>
          <button
            type="button"
            className="button button--ghost"
            onClick={() => {
              setViewTab("upcoming");
              setCategoryFilter("all");
              setSearchQuery("");
            }}
          >
            Đặt lại bộ lọc
          </button>
        </div>

        <div className="activity-filter-panel__body">
          <label className="activity-search activity-search--panel">
            <span>🔎</span>
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Tìm theo tên hoạt động..."
              aria-label="Tìm kiếm hoạt động theo tên"
            />
          </label>

          <div className="activity-filter-group">
            <div className="activity-filter-group__title">Chế độ xem</div>
            <div className="chip-row">
              {viewTabs.map((tab) => (
                <button
                  key={tab.id}
                  className={viewTab === tab.id ? "chip chip--active" : "chip"}
                  onClick={() => setViewTab(tab.id)}
                  type="button"
                >
                  {tab.label} · {tab.count}
                </button>
              ))}
            </div>
          </div>

          <div className="activity-filter-group">
            <div className="activity-filter-group__title">Danh mục</div>
            <div className="chip-row">
              {categories.map((category) => (
                <button
                  key={category}
                  className={
                    categoryFilter === category ? "chip chip--active" : "chip"
                  }
                  onClick={() => setCategoryFilter(category)}
                  type="button"
                >
                  {category === "all" ? "Tất cả" : category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {loading ? (
        <p className="loading-state">Đang tải hoạt động...</p>
      ) : visibleActivities.length === 0 ? (
        <p className="empty-state">Không có hoạt động nào phù hợp.</p>
      ) : (
        <div className="grid-2">
          {visibleActivities.map((activity) => {
            const action = getPrimaryAction(activity);

            return (
              <div
                key={activity._id}
                className="page-stack"
                style={{ gap: "0.85rem" }}
              >
                <ActivityCard
                  activity={activity}
                  statusLabel={getStatusLabel(activity)}
                />
                <div className="activity-actions" style={{ gap: "0.75rem" }}>
                  <button
                    className="button button--secondary activity-action-button"
                    type="button"
                    onClick={() => navigate(`/activities/${activity._id}`)}
                  >
                    Xem chi tiết
                  </button>
                  <button
                    className={`${action.className} activity-action-button`}
                    onClick={action.onClick}
                    disabled={action.disabled}
                    type="button"
                  >
                    {action.label}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
