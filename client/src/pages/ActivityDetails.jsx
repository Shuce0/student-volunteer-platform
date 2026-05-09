import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ActivityCard from "../components/ActivityCard";
import { useAuth } from "../hooks/useAuth";
import { activityService } from "../services/activityService";

function formatDate(value) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString("vi-VN");
}

function getParticipantId(participant) {
  if (!participant) return null;
  if (typeof participant === "string") return participant;
  return participant._id || participant.id || null;
}

export default function ActivityDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const currentUserId = user?._id || user?.id || null;
  const isUpcoming = activity
    ? new Date(activity.date).getTime() >= Date.now()
    : false;
  const isRegistered = Boolean(
    activity &&
    currentUserId &&
    activity.registeredParticipants?.some(
      (participant) =>
        getParticipantId(participant)?.toString() === currentUserId.toString(),
    ),
  );
  const isFull = Boolean(
    activity &&
    (activity.registeredParticipants?.length || 0) >=
      (activity.maxParticipants || 0),
  );

  const loadActivity = async () => {
    try {
      const data = await activityService.getActivityById(id);
      setActivity(data);
    } catch (error) {
      setToast({
        type: "danger",
        message: "Không thể tải chi tiết hoạt động: " + error,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActivity();
  }, [id]);

  useEffect(() => {
    if (!toast) return undefined;

    const timer = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const handleRegister = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!activity || !isUpcoming || isRegistered || isFull) return;

    setSaving(true);
    try {
      const response = await activityService.registerForActivity(activity._id);
      await Promise.all([loadActivity(), refreshUser()]);
      setToast({
        type: "success",
        message: response.message || "Đăng ký thành công.",
      });
    } catch (error) {
      setToast({ type: "danger", message: "Đăng ký thất bại: " + error });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!activity || !isUpcoming || !isRegistered) return;

    setSaving(true);
    try {
      const response = await activityService.cancelRegistrationForActivity(
        activity._id,
      );
      await Promise.all([loadActivity(), refreshUser()]);
      setToast({
        type: "success",
        message: response.message || "Đã hủy đăng ký thành công.",
      });
    } catch (error) {
      setToast({ type: "danger", message: "Hủy đăng ký thất bại: " + error });
    } finally {
      setSaving(false);
    }
  };

  const getActionConfig = () => {
    if (!user) {
      return {
        label: "Đăng nhập để đăng ký",
        className: "button button--secondary",
        onClick: () => navigate("/login"),
        disabled: false,
      };
    }

    if (!activity) {
      return {
        label: "Đang tải...",
        className: "button button--ghost",
        disabled: true,
      };
    }

    if (isRegistered && isUpcoming) {
      return {
        label: saving ? "Đang hủy..." : "Hủy đăng ký",
        className: "button button--danger",
        onClick: handleCancel,
        disabled: saving,
      };
    }

    if (!isUpcoming) {
      return {
        label: isRegistered ? "Đã tham gia" : "Hoạt động đã diễn ra",
        className: "button button--ghost",
        disabled: true,
      };
    }

    if (isFull) {
      return {
        label: "Đã đầy chỗ",
        className: "button button--ghost",
        disabled: true,
      };
    }

    return {
      label: saving ? "Đang đăng ký..." : "Đăng ký tham gia",
      className: "button button--primary",
      onClick: handleRegister,
      disabled: saving,
    };
  };

  const action = getActionConfig();

  const statusLabel = !activity
    ? ""
    : isRegistered && isUpcoming
      ? "Đã đăng ký"
      : !isUpcoming
        ? "Đã tham gia"
        : "Sắp diễn ra";

  const participants = activity?.registeredParticipants || [];

  if (loading) {
    return <p className="loading-state">Đang tải chi tiết hoạt động...</p>;
  }

  if (!activity) {
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
        <p className="empty-state">Không tìm thấy hoạt động.</p>
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
            <div className="hero-kicker">🔎 Chi tiết hoạt động</div>
            <h1 className="hero-title" style={{ maxWidth: "none" }}>
              {activity.title}
            </h1>
            <p className="hero-subtitle">{activity.description}</p>
            <div className="hero-actions">
              <button
                className="button button--secondary"
                type="button"
                onClick={() => navigate(-1)}
              >
                Quay lại
              </button>
              <button
                className={action.className}
                type="button"
                onClick={action.onClick}
                disabled={action.disabled}
              >
                {action.label}
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
                <div className="dashboard-stat__label">Trạng thái</div>
                <div className="dashboard-stat__value">{statusLabel}</div>
              </div>
              <div className="dashboard-stat">
                <div className="dashboard-stat__label">Điểm</div>
                <div className="dashboard-stat__value">{activity.points}</div>
              </div>
              <div className="dashboard-stat">
                <div className="dashboard-stat__label">Đã đăng ký</div>
                <div className="dashboard-stat__value">
                  {activity.registeredParticipants?.length || 0}
                </div>
              </div>
              <div className="dashboard-stat">
                <div className="dashboard-stat__label">Tối đa</div>
                <div className="dashboard-stat__value">
                  {activity.maxParticipants || 0}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="activity-details-layout">
        <section className="section-card animate-rise activity-details-hero">
          <div className="activity-details-hero__imageWrap">
            <ActivityCard
              activity={activity}
              statusLabel={statusLabel}
              variant="featured"
            />
          </div>
        </section>

        <section className="section-card animate-rise page-stack">
          <div>
            <h2 className="section-heading">Thông tin chi tiết</h2>
            <p className="section-copy">
              Tất cả dữ liệu cần thiết để bạn quyết định đăng ký hoặc hủy đăng
              ký.
            </p>
          </div>

          <div className="activity-modal__grid">
            <div className="activity-modal__info">
              <span>Ngày diễn ra</span>
              <strong>{formatDate(activity.date)}</strong>
            </div>
            <div className="activity-modal__info">
              <span>Địa điểm</span>
              <strong>{activity.location}</strong>
            </div>
            <div className="activity-modal__info">
              <span>Người tổ chức</span>
              <strong>{activity.organizer?.name || "Ban tổ chức"}</strong>
            </div>
            <div className="activity-modal__info">
              <span>Chỗ còn lại</span>
              <strong>
                {Math.max(
                  (activity.maxParticipants || 0) -
                    (activity.registeredParticipants?.length || 0),
                  0,
                )}
              </strong>
            </div>
          </div>

          <div className="page-stack" style={{ gap: "0.65rem" }}>
            <div className="activity-details-ctaRow">
              <button
                className="button button--secondary"
                type="button"
                onClick={() => navigate("/activities")}
              >
                Danh sách hoạt động
              </button>
              <button
                className={action.className}
                type="button"
                onClick={action.onClick}
                disabled={action.disabled}
              >
                {action.label}
              </button>
            </div>

            <div>
              <h3 className="section-copy" style={{ marginBottom: "0.35rem" }}>
                Người đã tham gia
              </h3>
              <p className="section-copy" style={{ marginBottom: 0 }}>
                Danh sách người đã đăng ký hoặc đã hoàn thành hoạt động này.
              </p>
            </div>

            {participants.length === 0 ? (
              <p
                className="empty-state"
                style={{ padding: "1rem", textAlign: "left" }}
              >
                Chưa có ai tham gia hoạt động này.
              </p>
            ) : (
              <div className="activity-participants">
                {participants.map((participant) => (
                  <div
                    key={getParticipantId(participant) || participant.name}
                    className="activity-participants__item"
                  >
                    <div className="activity-participants__avatar">
                      {(participant?.name || "?")
                        .split(" ")
                        .slice(0, 2)
                        .map((part) => part[0])
                        .join("")
                        .toUpperCase()}
                    </div>
                    <div>
                      <strong>{participant?.name || "Người tham gia"}</strong>
                      <p>{participant?.email || "Đang cập nhật"}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </section>
    </div>
  );
}
