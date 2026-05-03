export default function LeaderboardItem({ rank, user }) {
  return (
    <article
      className="leaderboard-card animate-rise"
      style={{ display: "flex", alignItems: "center", gap: "1rem" }}
    >
      <span
        className="meta-pill"
        style={{ minWidth: "56px", justifyContent: "center" }}
      >
        #{rank}
      </span>
      <div style={{ flex: 1 }}>
        <h4 style={{ fontSize: "1.02rem" }}>{user?.name}</h4>
        <p style={{ color: "var(--muted)", fontSize: "0.92rem" }}>
          {user?.email}
        </p>
      </div>
      <span
        className="stat-value"
        style={{ fontSize: "1.35rem", marginTop: 0 }}
      >
        {user?.points}
      </span>
    </article>
  );
}
