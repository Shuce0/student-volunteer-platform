import { API_BASE_URL } from "../services/api";

export default function ActivityCard({ activity }) {
  const imageSrc = activity?.image
    ? activity.image.startsWith("http")
      ? activity.image
      : `${API_BASE_URL.replace("/api", "")}${activity.image.startsWith("/") ? "" : "/"}${activity.image}`
    : null;

  return (
    <article
      className="activity-card animate-rise"
      style={{
        display: "grid",
        gridTemplateColumns: "110px minmax(0, 1fr) auto",
        gap: "1rem",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: 110,
          height: 110,
          borderRadius: 20,
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

      <div>
        <div className="meta-row" style={{ marginTop: 0 }}>
          <span className="meta-pill">+{activity?.points} điểm</span>
          <span className="meta-pill">{activity?.category || "community"}</span>
        </div>
        <h3 style={{ marginTop: "0.85rem", fontSize: "1.15rem" }}>
          {activity?.title}
        </h3>
        <p style={{ color: "var(--muted)", marginTop: "0.45rem" }}>
          {activity?.description}
        </p>
        <div className="meta-row">
          <span className="meta-pill">📍 {activity?.location}</span>
          <span className="meta-pill">
            📅 {new Date(activity?.date).toLocaleDateString("vi-VN")}
          </span>
        </div>
      </div>

      <div style={{ display: "grid", justifyItems: "end", gap: "0.5rem" }}>
        <span
          className="meta-pill"
          style={{ background: "rgba(210,29,39,0.08)", color: "#a3121a" }}
        >
          +{activity?.points} điểm
        </span>
        <span
          className="meta-pill"
          style={{ background: "rgba(255,255,255,0.98)" }}
        >
          Sắp diễn ra
        </span>
      </div>
    </article>
  );
}
