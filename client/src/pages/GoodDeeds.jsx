import { useState, useEffect } from "react";
import { goodDeedService } from "../services/goodDeedService";
import GoodDeedCard from "../components/GoodDeedCard";

export default function GoodDeeds() {
  const [goodDeeds, setGoodDeeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "community",
    points: 10,
  });

  useEffect(() => {
    fetchGoodDeeds();
  }, []);

  const fetchGoodDeeds = async () => {
    try {
      const data = await goodDeedService.getAllGoodDeeds();
      setGoodDeeds(data);
    } catch (error) {
      console.error("Failed to fetch good deeds:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await goodDeedService.createGoodDeed(formData);
      setMessage(
        "✅ Gửi việc tốt thành công! Admin sẽ duyệt trong thời gian sớm.",
      );
      setFormData({
        title: "",
        description: "",
        category: "community",
        points: 10,
      });
      setShowForm(false);
      fetchGoodDeeds();
      setTimeout(() => setMessage(""), 4000);
    } catch (error) {
      setMessage("❌ Gửi thất bại: " + error);
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const approvedCount = goodDeeds.length;
  const totalPoints = goodDeeds.reduce(
    (sum, deed) => sum + (deed.points || 0),
    0,
  );
  const categories = new Set(goodDeeds.map((deed) => deed.category));

  return (
    <div className="container page-section page-stack">
      <section className="page-hero animate-rise">
        <div className="hero-grid">
          <div>
            <div className="hero-kicker">💚 Việc tốt của bạn</div>
            <h1 className="hero-title" style={{ maxWidth: "none" }}>
              Ghi nhận việc tốt theo phong cách HUTECH
            </h1>
            <p className="hero-subtitle">
              Ghi lại những việc tốt, lan tỏa cảm hứng tích cực và để hệ thống
              tự động tổng hợp điểm số của bạn.
            </p>
            <div className="hero-actions">
              <button
                className="button button--primary"
                onClick={() => setShowForm((value) => !value)}
                type="button"
              >
                {showForm ? "Đóng form" : "Gửi việc tốt"}
              </button>
            </div>
          </div>

          <div className="hero-panel hero-panel--muted">
            <div className="hero-panel__title">Tổng quan nhanh</div>
            <div
              className="dashboard-stats"
              style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}
            >
              <div className="dashboard-stat">
                <div className="dashboard-stat__label">Đã duyệt</div>
                <div className="dashboard-stat__value">{approvedCount}</div>
              </div>
              <div className="dashboard-stat">
                <div className="dashboard-stat__label">Tổng điểm</div>
                <div className="dashboard-stat__value">{totalPoints}</div>
              </div>
              <div className="dashboard-stat">
                <div className="dashboard-stat__label">Danh mục</div>
                <div className="dashboard-stat__value">{categories.size}</div>
              </div>
              <div className="dashboard-stat">
                <div className="dashboard-stat__label">Trạng thái</div>
                <div className="dashboard-stat__value">OK</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {message && (
        <div className="notice notice--success animate-rise">{message}</div>
      )}

      <section className="section-card animate-rise">
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="page-stack"
            style={{ marginTop: "1.25rem" }}
          >
            <div>
              <h3 style={{ marginBottom: "0.35rem" }}>
                Kể cho chúng tôi về việc tốt bạn đã làm
              </h3>
              <p className="section-copy">
                Một mô tả rõ ràng sẽ giúp admin duyệt nhanh hơn.
              </p>
            </div>

            <div className="grid-2">
              <label className="page-stack" style={{ gap: "0.45rem" }}>
                <span>Tiêu đề *</span>
                <input
                  type="text"
                  name="title"
                  placeholder="VD: Giúp cô chú qua đường"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="input"
                />
              </label>

              <label className="page-stack" style={{ gap: "0.45rem" }}>
                <span>Điểm dự kiến</span>
                <input
                  type="number"
                  name="points"
                  value={formData.points}
                  onChange={handleInputChange}
                  min="5"
                  max="100"
                  className="input"
                />
              </label>
            </div>

            <label className="page-stack" style={{ gap: "0.45rem" }}>
              <span>Mô tả chi tiết *</span>
              <textarea
                name="description"
                placeholder="Hãy kể chi tiết về việc tốt này..."
                value={formData.description}
                onChange={handleInputChange}
                required
                rows="5"
                className="textarea"
              />
            </label>

            <label className="page-stack" style={{ gap: "0.45rem" }}>
              <span>Danh mục</span>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="select"
              >
                <option value="community">Cộng đồng</option>
                <option value="environment">Môi trường</option>
                <option value="elderly">Người cao tuổi</option>
                <option value="education">Giáo dục</option>
                <option value="health">Sức khỏe</option>
                <option value="other">Khác</option>
              </select>
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="button button--primary"
            >
              {submitting ? "Đang gửi..." : "Gửi việc tốt"}
            </button>
          </form>
        )}
      </section>

      <section className="section-card animate-rise">
        <h2 className="section-heading">✨ Việc tốt đã được duyệt</h2>
        {loading ? (
          <p className="loading-state">Đang tải...</p>
        ) : goodDeeds.length === 0 ? (
          <p className="empty-state">
            Chưa có việc tốt nào. Hãy là người đầu tiên!
          </p>
        ) : (
          <div className="grid-3">
            {goodDeeds.map((deed) => (
              <GoodDeedCard key={deed._id} goodDeed={deed} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
