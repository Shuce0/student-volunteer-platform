export default function GoodDeedCard({ goodDeed }) {
  return (
    <article className="deed-card animate-rise">
      <div className="meta-row" style={{ marginTop: 0 }}>
        <span className="meta-pill">+{goodDeed?.points} points</span>
        <span className="meta-pill">{goodDeed?.category}</span>
        <span
          className="meta-pill"
          style={{
            background: goodDeed?.verified
              ? "rgba(22, 163, 74, 0.1)"
              : "rgba(217, 119, 6, 0.1)",
            color: goodDeed?.verified ? "#166534" : "#92400e",
          }}
        >
          {goodDeed?.verified ? "Verified" : "Pending"}
        </span>
      </div>
      <h3 style={{ marginTop: "0.9rem", fontSize: "1.15rem" }}>
        {goodDeed?.title}
      </h3>
      <p style={{ color: "var(--muted)", marginTop: "0.55rem" }}>
        {goodDeed?.description}
      </p>
    </article>
  );
}
