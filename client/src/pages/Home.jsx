import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { activityService } from "../services/activityService";
import ActivityCard from "../components/ActivityCard";
import { useAuth } from "../hooks/useAuth";

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

export default function Home() {
  const [featuredActivities, setFeaturedActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [randomQuote, setRandomQuote] = useState(QUOTES[0]);
  const { user } = useAuth();

  useEffect(() => {
    setRandomQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);

    const fetchActivities = async () => {
      try {
        const data = await activityService.getAllActivities();
        setFeaturedActivities(data.slice(0, 3));
      } catch (error) {
        console.error("Failed to fetch activities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  return (
    <div className="container page-section page-stack">
      <section className="page-hero animate-rise">
        <div className="hero-kicker">
          ✨ Student Volunteer Platform
          {user ? ` • Chào mừng, ${user.name?.split(" ")[0]}` : ""}
        </div>
        <h1 className="hero-title">
          {user
            ? `Chào mừng trở lại, ${user.name}`
            : "Tình nguyện theo phong cách sinh viên hiện đại"}
        </h1>
        <p className="hero-subtitle">
          {user
            ? `Bạn đang có ${user.points || 0} điểm. Hôm nay hãy tiếp tục góp một việc tốt hoặc đăng ký thêm một hoạt động mới.`
            : "Một không gian để đăng ký hoạt động, ghi nhận việc tốt và leo bảng xếp hạng với cảm giác nhanh, rõ ràng, và truyền cảm hứng hơn."}
        </p>

        <div className="hero-actions">
          <Link to="/activities" className="button button--primary">
            Khám phá hoạt động
          </Link>
          {user && (
            <Link to="/profile" className="button button--secondary">
              Hồ sơ của tôi
            </Link>
          )}
          <Link to="/leaderboard" className="button button--secondary">
            Xem bảng xếp hạng
          </Link>
        </div>

        <div className="hero-grid">
          <div className="hero-panel">
            <p className="hero-panel__title">
              {user ? "Personal progress" : "Quote of the day"}
            </p>
            <p className="quote-text">“{randomQuote.text}”</p>
            <p className="quote-author">— {randomQuote.author}</p>
          </div>
          <div className="hero-panel hero-panel--muted">
            <p className="hero-panel__title">Why it feels different</p>
            <div className="chip-row">
              <span className="chip">Responsive</span>
              <span className="chip">Clean UI</span>
              <span className="chip">Fast actions</span>
              <span className="chip">Point tracking</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section-card animate-rise">
        <h2 className="section-heading">🌟 Hoạt động nổi bật</h2>
        <p className="section-copy">
          Các hoạt động được chọn để bạn bắt đầu ngay hôm nay.
        </p>
        {loading ? (
          <p className="loading-state">Đang tải hoạt động...</p>
        ) : featuredActivities.length > 0 ? (
          <div className="grid-3">
            {featuredActivities.map((activity) => (
              <ActivityCard key={activity._id} activity={activity} />
            ))}
          </div>
        ) : (
          <p className="empty-state">
            Chưa có hoạt động nào. Hãy quay lại sau!
          </p>
        )}
      </section>

      <section className="grid-3">
        <div className="stat-card animate-rise">
          <p className="stat-label">Hoạt động</p>
          <p className="stat-value">12+</p>
        </div>
        <div className="stat-card animate-rise">
          <p className="stat-label">Sinh viên</p>
          <p className="stat-value">250+</p>
        </div>
        <div className="stat-card animate-rise">
          <p className="stat-label">Việc tốt</p>
          <p className="stat-value">98+</p>
        </div>
      </section>

      <section className="page-hero animate-rise" style={{ padding: "2rem" }}>
        <h2
          className="hero-title"
          style={{ maxWidth: "none", fontSize: "clamp(1.7rem, 3vw, 2.6rem)" }}
        >
          {user
            ? "Bạn đã sẵn sàng để bứt tốc hôm nay chưa?"
            : "Bạn đã sẵn sàng để tạo dấu ấn chưa?"}
        </h2>
        <p className="hero-subtitle">
          {user
            ? "Mở hồ sơ của bạn để cập nhật thông tin, xem điểm và quản lý tài khoản ngay trong một chỗ."
            : "Tham gia, ghi nhận, và nhìn thành quả của bạn lan tỏa trong cộng đồng sinh viên."}
        </p>
        <div className="hero-actions">
          <Link to="/activities" className="button button--primary">
            Đi tới hoạt động
          </Link>
          <Link to="/good-deeds" className="button button--secondary">
            Gửi việc tốt
          </Link>
        </div>
      </section>
    </div>
  );
}
