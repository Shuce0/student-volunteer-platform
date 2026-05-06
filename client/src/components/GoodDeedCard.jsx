export default function GoodDeedCard({ goodDeed }) {
  return (
    <article
      className="deed-card animate-rise"
      style={{ display: "grid", gap: "0.85rem" }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 18,
          display: "grid",
          placeItems: "center",
          background: "linear-gradient(135deg, #d8202a, #8f0f14)",
          color: "#fff",
          fontSize: "1.4rem",
        }}
      >
        ❤️
      </div>
      <div className="meta-row" style={{ marginTop: 0 }}>
        <span className="meta-pill">+{goodDeed?.points} điểm</span>
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
          {goodDeed?.verified ? "Đã duyệt" : "Chờ duyệt"}
        </span>
      </div>
      <h3 style={{ fontSize: "1.15rem" }}>{goodDeed?.title}</h3>
      <p style={{ color: "var(--muted)" }}>{goodDeed?.description}</p>
    </article>
  );
}
