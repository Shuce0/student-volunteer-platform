import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import api from "../services/api";
import LeaderboardItem from "../components/LeaderboardItem";

export default function Leaderboard() {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await api.get("/leaderboard");
        setLeaderboard(response.data);
      } catch (error) {
        console.error("Failed to fetch leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const totalUsers = leaderboard.length;
  const topScore = leaderboard[0]?.points || 0;
  const totalPoints = leaderboard.reduce(
    (sum, user) => sum + (user.points || 0),
    0,
  );
  const averageScore = totalUsers ? Math.round(totalPoints / totalUsers) : 0;

  return (
    <div className="container page-section page-stack">
      <section className="page-hero animate-rise">
        <div className="hero-grid">
          <div>
            <div className="hero-kicker">🏆 Bảng xếp hạng HUTECH</div>
            <h1 className="hero-title" style={{ maxWidth: "none" }}>
              Ghi nhận sinh viên năng nổ nhất
            </h1>
            <p className="hero-subtitle">
              Xem những gương mặt dẫn đầu, theo dõi điểm số và lan tỏa tinh thần
              cống hiến trong cộng đồng.
            </p>
            {!user && (
              <div
                className="meta-pill"
                style={{
                  marginTop: "1rem",
                  display: "inline-flex",
                  background: "rgba(255,255,255,0.14)",
                  color: "#fff",
                  borderColor: "rgba(255,255,255,0.22)",
                }}
              >
                Bảng xếp hạng công khai, không cần đăng nhập để xem
              </div>
            )}
          </div>

          <div className="hero-panel hero-panel--muted">
            <div className="hero-panel__title">Thống kê nhanh</div>
            <div
              className="dashboard-stats"
              style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}
            >
              <div className="dashboard-stat">
                <div className="dashboard-stat__label">Thành viên</div>
                <div className="dashboard-stat__value">{totalUsers}</div>
              </div>
              <div className="dashboard-stat">
                <div className="dashboard-stat__label">Điểm cao nhất</div>
                <div className="dashboard-stat__value">{topScore}</div>
              </div>
              <div className="dashboard-stat">
                <div className="dashboard-stat__label">Tổng điểm</div>
                <div className="dashboard-stat__value">{totalPoints}</div>
              </div>
              <div className="dashboard-stat">
                <div className="dashboard-stat__label">Trung bình</div>
                <div className="dashboard-stat__value">{averageScore}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {loading ? (
        <p className="loading-state">Đang tải bảng xếp hạng...</p>
      ) : leaderboard.length === 0 ? (
        <p className="empty-state">Chưa có dữ liệu. Hãy bắt đầu tham gia!</p>
      ) : (
        <div className="page-stack">
          {leaderboard.slice(0, 3).length > 0 && (
            <section className="section-card animate-rise">
              <div className="dashboard-section-title">
                <h2 className="section-heading" style={{ marginBottom: 0 }}>
                  Top 3 podium
                </h2>
                <span className="meta-pill">Cập nhật theo thời gian thực</span>
              </div>
              <div className="podium-grid">
                {leaderboard[1] && (
                  <div
                    className="podium-card podium-card--silver"
                    style={{ minHeight: "190px" }}
                  >
                    <div className="podium-rank">🥈</div>
                    <div className="podium-name">{leaderboard[1].name}</div>
                    <div className="podium-points">
                      {leaderboard[1].points} pts
                    </div>
                  </div>
                )}
                {leaderboard[0] && (
                  <div
                    className="podium-card podium-card--gold"
                    style={{ minHeight: "220px" }}
                  >
                    <div className="podium-rank">🥇</div>
                    <div className="podium-name">{leaderboard[0].name}</div>
                    <div className="podium-points">
                      {leaderboard[0].points} pts
                    </div>
                  </div>
                )}
                {leaderboard[2] && (
                  <div
                    className="podium-card podium-card--bronze"
                    style={{ minHeight: "170px" }}
                  >
                    <div className="podium-rank">🥉</div>
                    <div className="podium-name">{leaderboard[2].name}</div>
                    <div className="podium-points">
                      {leaderboard[2].points} pts
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          <section className="section-card animate-rise">
            <div className="dashboard-section-title">
              <h2 className="section-heading" style={{ marginBottom: 0 }}>
                Full ranking
              </h2>
              <span className="meta-pill">{leaderboard.length} thành viên</span>
            </div>
            <div className="page-stack">
              {leaderboard.map((user, index) => (
                <LeaderboardItem key={user._id} rank={index + 1} user={user} />
              ))}
            </div>
          </section>

          <section className="page-hero animate-rise">
            <h2
              className="hero-title"
              style={{
                maxWidth: "none",
                fontSize: "clamp(1.7rem, 3vw, 2.4rem)",
              }}
            >
              Làm theo lời Bác, làm điều có ích mỗi ngày
            </h2>
            <p className="hero-subtitle">
              Mỗi hoạt động và mỗi việc tốt đều cộng vào hành trình của bạn.
              Điểm số cập nhật tự động.
            </p>
          </section>
        </div>
      )}
    </div>
  );
}
