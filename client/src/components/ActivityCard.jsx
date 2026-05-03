export default function ActivityCard({ activity }) {
  return (
    <article className="activity-card animate-rise">
      <div className="meta-row" style={{ marginTop: 0 }}>
        <span className="meta-pill">+{activity?.points} points</span>
        <span className="meta-pill">{activity?.category || "community"}</span>
      </div>
      <h3 style={{ marginTop: "0.9rem", fontSize: "1.2rem" }}>
        {activity?.title}
      </h3>
      <p style={{ color: "var(--muted)", marginTop: "0.55rem" }}>
        {activity?.description}
      </p>
      <div className="meta-row">
        <span className="meta-pill">📍 {activity?.location}</span>
        <span className="meta-pill">
          📅 {new Date(activity?.date).toLocaleDateString("vi-VN")}
        </span>
      </div>
    </article>
  );
}
