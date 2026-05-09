import { API_BASE_URL } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function ActivityCard({
  activity,
  statusLabel,
  variant = "default",
}) {
  const imageSrc = activity?.image
    ? activity.image.startsWith("http")
      ? activity.image
      : `${API_BASE_URL.replace("/api", "")}${activity.image.startsWith("/") ? "" : "/"}${activity.image}`
    : null;
  const registeredCount = activity?.registeredParticipants?.length || 0;
  const maxParticipants = activity?.maxParticipants || 0;
  const remainingSlots = Math.max(maxParticipants - registeredCount, 0);

  if (variant === "featured") {
    return (
      <article className="activity-card activity-card--featured animate-rise">
        <div className="activity-card--featured__image">
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={activity?.title || "Activity"}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <div className="activity-card--featured__placeholder">📋</div>
          )}
          <div className="activity-card--featured__badge">
            +{activity?.points} điểm
          </div>
        </div>

        <div className="activity-card--featured__content">
          <div className="meta-row" style={{ marginTop: 0 }}>
            <span className="meta-pill">
              {activity?.category || "community"}
            </span>
            <span className="meta-pill">
              {statusLabel ||
                (remainingSlots > 0 ? "Sắp diễn ra" : "Đã đầy chỗ")}
            </span>
          </div>

          <h3 className="activity-card--featured__title">{activity?.title}</h3>

          <div className="activity-card--featured__meta">
            <span className="meta-pill">📍 {activity?.location}</span>
            <span className="meta-pill">
              📅 {new Date(activity?.date).toLocaleDateString("vi-VN")}
            </span>
          </div>

          <div className="activity-card--featured__footer">
            <span className="meta-pill">
              {registeredCount}/{maxParticipants || "?"} đã đăng ký
            </span>
            <span className="meta-pill">
              {remainingSlots > 0 ? `Còn ${remainingSlots} chỗ` : "Đã đầy chỗ"}
            </span>
          </div>
        </div>
      </article>
    );
  }

  if (variant === "home-featured") {
    const organizerName = activity?.organizer?.name || "Đơn vị tổ chức";
    const dateLabel = activity?.date
      ? `${new Date(activity.date).toLocaleDateString("vi-VN")} - ${activity?.endDate ? new Date(activity.endDate).toLocaleDateString("vi-VN") : new Date(activity.date).toLocaleDateString("vi-VN")}`
      : "Đang cập nhật";

    return (
      <article className="activity-card activity-card--home-featured animate-rise">
        <div className="activity-card--home-featured__image">
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={activity?.title || "Activity"}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <div className="activity-card--home-featured__placeholder">📋</div>
          )}
          <div className="activity-card--home-featured__badge">Sắp diễn ra</div>
        </div>

        <div className="activity-card--home-featured__content">
          <h3 className="activity-card--home-featured__title">
            {activity?.title}
          </h3>
          <p className="activity-card--home-featured__organizer">
            {organizerName}
          </p>

          <div className="activity-card--home-featured__meta">
            <span className="meta-pill">📅 {dateLabel}</span>
            <span className="meta-pill">📍 {activity?.location}</span>
          </div>
        </div>

        <div className="activity-card--home-featured__action">
          <HomeFeaturedAction
            activityId={activity?._id}
            registeredCount={registeredCount}
            maxParticipants={maxParticipants}
          />
        </div>
      </article>
    );
  }

  return (
    <article
      className="activity-card activity-card--list animate-rise"
      style={{
        display: "grid",
        gridTemplateColumns: "160px minmax(0, 1fr) auto",
        gap: "1rem",
        alignItems: "stretch",
        minHeight: "250px",
      }}
    >
      <div
        style={{
          width: 160,
          height: 160,
          borderRadius: 14,
          overflow: "hidden",
          background: "linear-gradient(135deg, #d8202a, #f8b8bd)",
          boxShadow: "0 14px 28px rgba(210, 29, 39, 0.22)",
        }}
      >
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={activity?.title || "Activity"}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "grid",
              placeItems: "center",
              color: "#fff",
              fontSize: "2rem",
            }}
          >
            📋
          </div>
        )}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          minWidth: 0,
        }}
      >
        <div className="meta-row" style={{ marginTop: 0 }}>
          <span className="meta-pill">+{activity?.points} điểm</span>
          <span className="meta-pill">{activity?.category || "community"}</span>
        </div>
        <h3 className="activity-card__title" style={{ marginTop: "0.85rem" }}>
          {activity?.title}
        </h3>
        <div className="meta-row activity-card__meta">
          <span className="meta-pill activity-card__location">
            📍 {activity?.location}
          </span>
          <span className="meta-pill">
            📅 {new Date(activity?.date).toLocaleDateString("vi-VN")}
          </span>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          justifyItems: "end",
          alignContent: "center",
          gap: "0.5rem",
        }}
      >
        <span
          className="meta-pill"
          style={{ background: "rgba(210,29,39,0.06)", color: "#8f0f14" }}
        >
          {statusLabel || (remainingSlots > 0 ? "Sắp diễn ra" : "Đã đầy chỗ")}
        </span>
        <span
          className="meta-pill"
          style={{ background: "rgba(210,29,39,0.08)", color: "#a3121a" }}
        >
          {registeredCount}/{maxParticipants || "?"} đã đăng ký
        </span>
        <span
          className="meta-pill"
          style={{ background: "rgba(255,255,255,0.98)" }}
        >
          {remainingSlots > 0 ? `Còn ${remainingSlots} chỗ` : "Đã đầy chỗ"}
        </span>
      </div>
    </article>
  );
}

function HomeFeaturedAction({ activityId, registeredCount, maxParticipants }) {
  const navigate = useNavigate();

  return (
    <>
      <button
        type="button"
        className="button button--primary"
        onClick={() => navigate(`/activities/${activityId}`)}
      >
        Xem chi tiết
      </button>
      <p className="activity-card--home-featured__capacity">
        {registeredCount}/{maxParticipants || "?"} người
      </p>
    </>
  );
}
