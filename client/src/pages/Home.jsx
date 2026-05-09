import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { activityService } from "../services/activityService";
import ActivityCard from "../components/ActivityCard";
import { useAuth } from "../hooks/useAuth";
import hcmBanner1 from "../assets/hcm-banner1.png";
import hcmBanner2 from "../assets/hcm-banner2.png";
import hcmBanner3 from "../assets/hcm-banner3.png";

// Ho Chi Minh quotes (random selection)
const QUOTES = [
  {
    text: "Chúng ta phải tận dụng tình thương yêu đối với quê hương, dân tộc để thực hiện công cuộc độc lập.",
    author: "Chủ tịch Hồ Chí Minh",
  },
  {
    text: "Có công mài sắt có ngày nên kim.",
    author: "Chủ tịch Hồ Chí Minh",
  },
  {
    text: "Khi còn sống, ta phải làm những việc có ích cho đất nước, cho dân tộc.",
    author: "Chủ tịch Hồ Chí Minh",
  },
  {
    text: "Tổ quốc trước, bản thân sau.",
    author: "Chủ tịch Hồ Chí Minh",
  },
  {
    text: "Độc lập, tự do, hạnh phúc là lý tưởng tối cao của nhân loại.",
    author: "Chủ tịch Hồ Chí Minh",
  },
];

const BANNERS = [hcmBanner1, hcmBanner2, hcmBanner3];

export default function Home() {
  const [featuredActivities, setFeaturedActivities] = useState([]);
  const [leaderboardPreview, setLeaderboardPreview] = useState([]);
  const [loading, setLoading] = useState(true);
  const [leaderboardLoading, setLeaderboardLoading] = useState(true);
  const [homeError, setHomeError] = useState("");
  const [randomQuote, setRandomQuote] = useState(QUOTES[0]);
  const [bannerIndex, setBannerIndex] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    setRandomQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);

    const fetchActivities = async () => {
      try {
        const data = await activityService.getAllActivities();
        const newestActivities = [...data].sort(
          (left, right) =>
            new Date(right.createdAt || right.date) -
            new Date(left.createdAt || left.date),
        );
        setFeaturedActivities(newestActivities.slice(0, 3));
      } catch (error) {
        console.error("Failed to fetch activities:", error);
        setHomeError("Không tải được danh sách hoạt động công khai.");
      } finally {
        setLoading(false);
      }
    };

    const fetchLeaderboard = async () => {
      try {
        const response = await api.get("/leaderboard");
        setLeaderboardPreview(response.data.slice(0, 4));
      } catch (error) {
        console.error("Failed to fetch leaderboard preview:", error);
        setHomeError(
          (previous) => previous || "Không tải được bảng xếp hạng công khai.",
        );
      } finally {
        setLeaderboardLoading(false);
      }
    };

    fetchActivities();
    fetchLeaderboard();
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setBannerIndex((currentIndex) => (currentIndex + 1) % BANNERS.length);
    }, 3000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="container page-section page-stack">
      <section className="dashboard-hero-grid dashboard-hero-grid--feature animate-rise">
        <div className="dashboard-hero-banner dashboard-hero-banner--slideshow">
          <img
            key={bannerIndex}
            className="dashboard-hero-banner__image"
            src={BANNERS[bannerIndex]}
            alt="Hồ Chí Minh và cờ Việt Nam"
          />
          <div className="dashboard-hero-banner__dots" aria-hidden="true">
            {BANNERS.map((_, index) => (
              <span
                key={index}
                className={index === bannerIndex ? "is-active" : ""}
              />
            ))}
          </div>
        </div>

        <div className="dashboard-hero-quote">
          <div className="dashboard-hero-quote__title">
            <span>Lời Bác dạy</span>
          </div>
          <div className="dashboard-hero-quote__body">
            <span className="dashboard-hero-quote__ornament dashboard-hero-quote__ornament--open">
              ❝
            </span>
            <p className="dashboard-hero-quote__quote">{randomQuote.text}</p>
            <span className="dashboard-hero-quote__ornament dashboard-hero-quote__ornament--close">
              ❞
            </span>
            <p className="dashboard-hero-quote__author">
              — {randomQuote.author}
            </p>
          </div>
          <div className="chip-row" style={{ marginTop: "1rem" }}>
            <span className="chip chip--active">HUTECH</span>
            <span className="chip">Tinh thần tình nguyện</span>
            <span className="chip">Làm theo lời Bác</span>
          </div>
        </div>
      </section>

      <section
        className="dashboard-hero-grid animate-rise"
        style={{ gridTemplateColumns: "minmax(0, 1.1fr) minmax(280px, 0.9fr)" }}
      >
        <div className="dashboard-hero-banner dashboard-hero-banner--content">
          <div
            className="hero-kicker"
            style={{
              color: "#a3121a",
              borderColor: "rgba(210,29,39,0.12)",
              background: "rgba(210,29,39,0.06)",
            }}
          >
            {user ? `Xin chào, ${user.name}` : "HUTECH Volunteer"}
          </div>
          <h1
            className="hero-title"
            style={{ maxWidth: "none", color: "#7b0f15" }}
          >
            {user
              ? `Bạn đang có ${user.points || 0} điểm. Tiếp tục bứt phá nhé!`
              : "Tình nguyện sinh viên HUTECH"}
          </h1>
          <p
            className="hero-subtitle"
            style={{ color: "var(--muted)", maxWidth: "none" }}
          >
            {user
              ? "Cập nhật hồ sơ, theo dõi đăng ký của bạn và tiếp tục tích lũy điểm cho bảng xếp hạng."
              : "Theo dõi hoạt động, ghi nhận việc tốt và xếp hạng sinh viên trong một giao diện đỏ năng động."}
          </p>
          <div className="hero-actions">
            <Link to="/activities" className="button button--primary">
              Khám phá hoạt động
            </Link>
            {user && (
              <Link to="/profile" className="button button--secondary">
                Đăng ký của tôi
              </Link>
            )}
            <Link to="/leaderboard" className="button button--secondary">
              Xem bảng xếp hạng
            </Link>
          </div>
        </div>

        <div className="dashboard-hero-side">
          <div className="dashboard-hero-side__title">
            <span>Bảng xếp hạng</span>
            <span>Top 4</span>
          </div>
          {leaderboardLoading ? (
            <p className="empty-state">Đang tải bảng xếp hạng...</p>
          ) : leaderboardPreview.length > 0 ? (
            <div className="page-stack" style={{ gap: "0.75rem" }}>
              {leaderboardPreview.map((member, index) => (
                <div
                  key={member._id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    padding: "0.8rem",
                    borderRadius: "16px",
                    background: index === 0 ? "rgba(210,29,39,0.08)" : "#fff",
                    border: "1px solid rgba(210,29,39,0.1)",
                  }}
                >
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: "50%",
                      display: "grid",
                      placeItems: "center",
                      background:
                        index === 0
                          ? "linear-gradient(135deg, #d8202a, #8f0f14)"
                          : "#f3e2e1",
                      color: index === 0 ? "#fff" : "#8f0f14",
                      fontWeight: 800,
                    }}
                  >
                    {index + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <strong>{member.name}</strong>
                    <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
                      {member.points} điểm
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-state">
              Chưa có dữ liệu bảng xếp hạng công khai.
            </p>
          )}
        </div>
      </section>

      <section className="dashboard-stats">
        <div className="dashboard-stat animate-rise">
          <p className="dashboard-stat__label">Hoạt động</p>
          <p className="dashboard-stat__value">12+</p>
        </div>
        <div className="dashboard-stat animate-rise">
          <p className="dashboard-stat__label">Sinh viên</p>
          <p className="dashboard-stat__value">250+</p>
        </div>
        <div className="dashboard-stat animate-rise">
          <p className="dashboard-stat__label">Việc tốt</p>
          <p className="dashboard-stat__value">98+</p>
        </div>
        <div className="dashboard-stat animate-rise">
          <p className="dashboard-stat__label">Xếp hạng của bạn</p>
          <p className="dashboard-stat__value">24</p>
        </div>
      </section>

      <section className="section-card animate-rise">
        <div className="dashboard-section-title">
          <div>
            <h2 className="section-heading">Hoạt động nổi bật</h2>
            <p className="section-copy">
              Các hoạt động được chọn để bạn bắt đầu ngay hôm nay.
            </p>
          </div>
          <Link to="/activities">Xem tất cả →</Link>
        </div>

        {loading ? (
          <p className="loading-state">Đang tải hoạt động...</p>
        ) : featuredActivities.length > 0 ? (
          <div className="page-stack home-featured-list">
            {featuredActivities.map((activity) => (
              <ActivityCard
                key={activity._id}
                activity={activity}
                variant="home-featured"
              />
            ))}
          </div>
        ) : (
          <p className="empty-state">Chưa có dữ liệu hoạt động công khai.</p>
        )}
      </section>

      <section
        className="dashboard-hero-grid animate-rise"
        id="guide"
        style={{ gridTemplateColumns: "repeat(4, minmax(0, 1fr))" }}
      >
        {[
          {
            icon: "🤝",
            title: "Gửi việc tốt",
            text: "Chia sẻ hành động đẹp của bạn",
          },
          {
            icon: "👥",
            title: "Khám phá CLB",
            text: "Kết nối với các CLB trong trường",
          },
          {
            icon: "📘",
            title: "Hướng dẫn",
            text: "Tìm hiểu cách tham gia hoạt động",
          },
          {
            icon: "❤️",
            title: "Cộng đồng",
            text: "Tham gia cộng đồng tình nguyện viên",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="dashboard-hero-side"
            style={{ display: "grid", gap: "0.5rem" }}
          >
            <div style={{ fontSize: "1.6rem" }}>{item.icon}</div>
            <strong>{item.title}</strong>
            <p style={{ color: "var(--muted)", lineHeight: 1.5 }}>
              {item.text}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}
