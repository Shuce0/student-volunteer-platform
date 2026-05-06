export default function LeaderboardItem({ rank, user }) {
  return (
    <article
      className="leaderboard-card animate-rise"
      style={{ display: "flex", alignItems: "center", gap: "1rem" }}
    >
      <span
        style={{
          minWidth: "58px",
          height: "58px",
          borderRadius: "50%",
          display: "grid",
          placeItems: "center",
          background:
            rank === 1
              ? "linear-gradient(135deg, #f8b84d, #f59e0b)"
              : rank === 2
                ? "linear-gradient(135deg, #d1d5db, #9ca3af)"
                : rank === 3
                  ? "linear-gradient(135deg, #c56f2c, #8f0f14)"
                  : "linear-gradient(135deg, #d8202a, #8f0f14)",
          color: "#fff",
          fontWeight: 800,
          boxShadow: "0 12px 24px rgba(210,29,39,0.16)",
        }}
      >
        {rank}
      </span>
      <div style={{ flex: 1 }}>
        <h4 style={{ fontSize: "1.02rem" }}>{user?.name}</h4>
        <p style={{ color: "var(--muted)", fontSize: "0.92rem" }}>
          {user?.email}
        </p>
      </div>
      <span
        className="meta-pill"
        style={{
          background: "rgba(210,29,39,0.08)",
          color: "#a3121a",
          fontSize: "1rem",
          padding: "0.7rem 0.9rem",
        }}
      >
        {user?.points} điểm
      </span>
    </article>
  );
}
