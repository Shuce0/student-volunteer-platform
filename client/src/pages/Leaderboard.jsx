import { useState, useEffect } from "react";
import api from "../services/api";
import LeaderboardItem from "../components/LeaderboardItem";

export default function Leaderboard() {
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

  return (
    <div className="container page-section page-stack">
      <section className="page-hero animate-rise" style={{ padding: "2rem" }}>
        <div className="hero-kicker">🏆 Leaderboard</div>
        <h1 className="hero-title" style={{ maxWidth: "none" }}>
          Bảng xếp hạng nổi bật
        </h1>
        <p className="hero-subtitle">
          Ghi nhận những sinh viên năng nổ nhất và lan tỏa tinh thần cống hiến
          trong cộng đồng.
        </p>
      </section>

      {loading ? (
        <p className="loading-state">Đang tải bảng xếp hạng...</p>
      ) : leaderboard.length === 0 ? (
        <p className="empty-state">Chưa có dữ liệu. Hãy bắt đầu tham gia!</p>
      ) : (
        <div className="page-stack">
          {leaderboard.slice(0, 3).length > 0 && (
            <section className="section-card animate-rise">
              <h2 className="section-heading">Top 3 podium</h2>
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
            <h2 className="section-heading">Full ranking</h2>
            <div className="page-stack">
              {leaderboard.map((user, index) => (
                <LeaderboardItem key={user._id} rank={index + 1} user={user} />
              ))}
            </div>
          </section>

          <section
            className="page-hero animate-rise"
            style={{ padding: "2rem" }}
          >
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
