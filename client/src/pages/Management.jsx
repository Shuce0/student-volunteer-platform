import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { authService } from "../services/authService";
import { activityService } from "../services/activityService";
import { goodDeedService } from "../services/goodDeedService";
import { API_BASE_URL } from "../services/api";

const initialActivityForm = {
  title: "",
  description: "",
  date: "",
  location: "",
  category: "community",
  maxParticipants: 20,
  points: 10,
};

function roleLabel(role) {
  if (role === "admin") return "Quản trị hệ thống";
  if (role === "club") return "CLB tổ chức chương trình";
  return "Người dùng";
}

function resolveActivityImage(image) {
  if (!image) return null;
  if (image.startsWith("http")) return image;
  return `${API_BASE_URL.replace("/api", "")}${image.startsWith("/") ? "" : "/"}${image}`;
}

export default function Management() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [activities, setActivities] = useState([]);
  const [pendingGoodDeeds, setPendingGoodDeeds] = useState([]);
  const [pendingClubs, setPendingClubs] = useState([]);
  const [activityForm, setActivityForm] = useState(initialActivityForm);
  const [savingActivity, setSavingActivity] = useState(false);
  const [verifyingId, setVerifyingId] = useState(null);
  const [approvingClubId, setApprovingClubId] = useState(null);
  const [loadingData, setLoadingData] = useState(true);
  const [message, setMessage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const canManageActivities = user?.role === "admin" || user?.role === "club";
  const canVerifyGoodDeeds = user?.role === "admin";
  const canApproveClubs = user?.role === "admin";
  const canAccess = canManageActivities || canVerifyGoodDeeds;

  useEffect(() => {
    if (!authLoading && (!user || !canAccess)) {
      navigate("/");
    }
  }, [authLoading, user, canAccess, navigate]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [activitiesData, pendingData] = await Promise.all([
          activityService.getAllActivities(),
          canVerifyGoodDeeds
            ? goodDeedService.getPendingGoodDeeds()
            : Promise.resolve([]),
        ]);

        setActivities(activitiesData);
        setPendingGoodDeeds(pendingData);
        setPendingClubs(
          canApproveClubs ? await authService.getPendingClubs() : [],
        );
      } catch (error) {
        setMessage(error);
      } finally {
        setLoadingData(false);
      }
    };

    if (user && canAccess) {
      loadData();
    }
  }, [user, canAccess, canVerifyGoodDeeds, canApproveClubs]);

  const stats = useMemo(() => {
    const openSlots = activities.reduce(
      (sum, activity) =>
        sum +
        Math.max(
          (activity.maxParticipants || 0) -
            (activity.registeredParticipants?.length || 0),
          0,
        ),
      0,
    );

    return {
      activities: activities.length,
      openSlots,
      pendingGoodDeeds: pendingGoodDeeds.length,
    };
  }, [activities, pendingGoodDeeds]);

  const handleActivityChange = (e) => {
    const { name, value } = e.target;
    setActivityForm((prev) => ({
      ...prev,
      [name]:
        name === "maxParticipants" || name === "points" ? Number(value) : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    setImagePreview(file ? URL.createObjectURL(file) : "");
  };

  const handleCreateActivity = async (e) => {
    e.preventDefault();
    setSavingActivity(true);
    setMessage("");

    try {
      const payload = new FormData();
      Object.entries(activityForm).forEach(([key, value]) => {
        if (key === "date") {
          payload.append(key, new Date(value).toISOString());
        } else {
          payload.append(key, value);
        }
      });

      if (imageFile) {
        payload.append("image", imageFile);
      }

      await activityService.createActivity(payload);
      setMessage("✅ Tạo hoạt động thành công");
      setActivityForm(initialActivityForm);
      setImageFile(null);
      setImagePreview("");
      setActivities(await activityService.getAllActivities());
    } catch (error) {
      setMessage(error);
    } finally {
      setSavingActivity(false);
    }
  };

  const handleVerifyGoodDeed = async (id) => {
    setVerifyingId(id);
    setMessage("");

    try {
      await goodDeedService.verifyGoodDeed(id);
      setMessage("✅ Đã duyệt việc tốt");
      setPendingGoodDeeds((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      setMessage(error);
    } finally {
      setVerifyingId(null);
    }
  };

  const handleApproveClub = async (id) => {
    setApprovingClubId(id);
    setMessage("");

    try {
      await authService.approveClub(id);
      setMessage("✅ Đã cấp quyền CLUB");
      setPendingClubs((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      setMessage(error);
    } finally {
      setApprovingClubId(null);
    }
  };

  if (authLoading || !user) {
    return <p className="loading-state">Đang tải trang quản lý...</p>;
  }

  return (
    <div className="container page-section page-stack">
      <section className="page-hero animate-rise">
        <div className="hero-grid">
          <div>
            <div className="hero-kicker">🛠️ Khu quản lý</div>
            <h1 className="hero-title" style={{ maxWidth: "none" }}>
              {roleLabel(user.role)}
            </h1>
            <p className="hero-subtitle">
              Tạo hoạt động, duyệt việc tốt và theo dõi dữ liệu vận hành ngay
              trên một màn hình.
            </p>
          </div>

          <div className="hero-panel hero-panel--muted">
            <div className="hero-panel__title">Tổng quan</div>
            <div
              className="dashboard-stats"
              style={{ gridTemplateColumns: "repeat(1, minmax(0, 1fr))" }}
            >
              <div className="dashboard-stat">
                <div className="dashboard-stat__label">Hoạt động hiện có</div>
                <div className="dashboard-stat__value">{stats.activities}</div>
              </div>
              <div className="dashboard-stat">
                <div className="dashboard-stat__label">Chỗ trống</div>
                <div className="dashboard-stat__value">{stats.openSlots}</div>
              </div>
              {canVerifyGoodDeeds && (
                <div className="dashboard-stat">
                  <div className="dashboard-stat__label">
                    Việc tốt chờ duyệt
                  </div>
                  <div className="dashboard-stat__value">
                    {stats.pendingGoodDeeds}
                  </div>
                </div>
              )}
              {canApproveClubs && (
                <div className="dashboard-stat">
                  <div className="dashboard-stat__label">CLB chờ duyệt</div>
                  <div className="dashboard-stat__value">
                    {pendingClubs.length}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {message && (
        <div className="notice notice--success animate-rise">{message}</div>
      )}

      {canManageActivities && (
        <section className="section-card animate-rise">
          <div className="dashboard-section-title">
            <h2 className="section-heading" style={{ marginBottom: 0 }}>
              Tạo hoạt động
            </h2>
            <span className="meta-pill">Dành cho admin / club</span>
          </div>

          <form className="auth-form" onSubmit={handleCreateActivity}>
            <div className="grid-2">
              <input
                name="title"
                className="input"
                placeholder="Tên hoạt động"
                value={activityForm.title}
                onChange={handleActivityChange}
                required
              />
              <input
                name="location"
                className="input"
                placeholder="Địa điểm"
                value={activityForm.location}
                onChange={handleActivityChange}
                required
              />
            </div>
            <label className="page-stack" style={{ gap: "0.45rem" }}>
              <span>Hình ảnh hoạt động</span>
              <input
                type="file"
                accept="image/*"
                className="input"
                onChange={handleImageChange}
              />
              {imagePreview && (
                <div
                  style={{
                    width: "100%",
                    maxWidth: 360,
                    aspectRatio: "16 / 9",
                    borderRadius: 18,
                    overflow: "hidden",
                    border: "1px solid rgba(210, 29, 39, 0.12)",
                    boxShadow: "0 12px 24px rgba(210, 29, 39, 0.12)",
                  }}
                >
                  <img
                    src={imagePreview}
                    alt="Preview hoạt động"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
              )}
            </label>
            <textarea
              name="description"
              className="textarea"
              rows="4"
              placeholder="Mô tả hoạt động"
              value={activityForm.description}
              onChange={handleActivityChange}
              required
            />
            <div className="grid-2">
              <input
                name="date"
                type="date"
                className="input"
                value={activityForm.date}
                onChange={handleActivityChange}
                required
              />
              <select
                name="category"
                className="select"
                value={activityForm.category}
                onChange={handleActivityChange}
              >
                <option value="community">Cộng đồng</option>
                <option value="environment">Môi trường</option>
                <option value="education">Giáo dục</option>
                <option value="health">Sức khỏe</option>
                <option value="elderly">Người cao tuổi</option>
              </select>
            </div>
            <div className="grid-2">
              <input
                name="maxParticipants"
                type="number"
                className="input"
                min="1"
                value={activityForm.maxParticipants}
                onChange={handleActivityChange}
              />
              <input
                name="points"
                type="number"
                className="input"
                min="1"
                value={activityForm.points}
                onChange={handleActivityChange}
              />
            </div>
            <button
              type="submit"
              className="button button--primary"
              disabled={savingActivity}
            >
              {savingActivity ? "Đang tạo..." : "Tạo hoạt động"}
            </button>
          </form>
        </section>
      )}

      {canVerifyGoodDeeds && (
        <section className="section-card animate-rise">
          <div className="dashboard-section-title">
            <h2 className="section-heading" style={{ marginBottom: 0 }}>
              Duyệt việc tốt
            </h2>
            <span className="meta-pill">Admin only</span>
          </div>

          {loadingData ? (
            <p className="loading-state">Đang tải dữ liệu...</p>
          ) : pendingGoodDeeds.length === 0 ? (
            <p className="empty-state">Không có việc tốt nào đang chờ duyệt.</p>
          ) : (
            <div className="page-stack">
              {pendingGoodDeeds.map((item) => (
                <article key={item._id} className="activity-card">
                  <div className="meta-row" style={{ marginTop: 0 }}>
                    <span className="meta-pill">{item.category}</span>
                    <span className="meta-pill">+{item.points} điểm</span>
                  </div>
                  <h3 style={{ marginTop: "0.75rem" }}>{item.title}</h3>
                  <p style={{ color: "var(--muted)", marginTop: "0.5rem" }}>
                    {item.description}
                  </p>
                  <div className="meta-row">
                    <span className="meta-pill">👤 {item.user?.name}</span>
                    <span className="meta-pill">✉️ {item.user?.email}</span>
                  </div>
                  <button
                    className="button button--primary"
                    type="button"
                    onClick={() => handleVerifyGoodDeed(item._id)}
                    disabled={verifyingId === item._id}
                    style={{ marginTop: "1rem" }}
                  >
                    {verifyingId === item._id
                      ? "Đang duyệt..."
                      : "Duyệt việc tốt"}
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>
      )}

      {canApproveClubs && (
        <section className="section-card animate-rise">
          <div className="dashboard-section-title">
            <h2 className="section-heading" style={{ marginBottom: 0 }}>
              Duyệt tài khoản CLB
            </h2>
            <span className="meta-pill">Admin only</span>
          </div>

          {loadingData ? (
            <p className="loading-state">Đang tải dữ liệu...</p>
          ) : pendingClubs.length === 0 ? (
            <p className="empty-state">
              Không có tài khoản CLB nào đang chờ duyệt.
            </p>
          ) : (
            <div className="grid-2">
              {pendingClubs.map((club) => (
                <article key={club._id} className="leaderboard-card">
                  <h3>{club.name}</h3>
                  <p style={{ color: "var(--muted)", marginTop: "0.5rem" }}>
                    {club.email}
                  </p>
                  <div className="meta-row">
                    <span className="meta-pill">ID CLB: {club.clubId}</span>
                    <span className="meta-pill">{club.unit}</span>
                  </div>
                  <div className="meta-row">
                    <span className="meta-pill">SĐT: {club.phone}</span>
                  </div>
                  <button
                    className="button button--primary"
                    type="button"
                    onClick={() => handleApproveClub(club._id)}
                    disabled={approvingClubId === club._id}
                    style={{ marginTop: "1rem" }}
                  >
                    {approvingClubId === club._id
                      ? "Đang cấp quyền..."
                      : "Cấp quyền CLUB"}
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>
      )}

      <section className="section-card animate-rise">
        <div className="dashboard-section-title">
          <h2 className="section-heading" style={{ marginBottom: 0 }}>
            Dữ liệu hoạt động
          </h2>
          <span className="meta-pill">{activities.length} bản ghi</span>
        </div>

        {loadingData ? (
          <p className="loading-state">Đang tải dữ liệu...</p>
        ) : activities.length === 0 ? (
          <p className="empty-state">Chưa có dữ liệu hoạt động.</p>
        ) : (
          <div className="grid-2">
            {activities.map((activity) => (
              <article key={activity._id} className="leaderboard-card">
                {resolveActivityImage(activity.image) && (
                  <div
                    style={{
                      width: "100%",
                      aspectRatio: "16 / 9",
                      borderRadius: 16,
                      overflow: "hidden",
                      marginBottom: "0.85rem",
                    }}
                  >
                    <img
                      src={resolveActivityImage(activity.image)}
                      alt={activity.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                )}
                <h3>{activity.title}</h3>
                <p style={{ color: "var(--muted)", marginTop: "0.5rem" }}>
                  {activity.location} ·{" "}
                  {new Date(activity.date).toLocaleDateString("vi-VN")}
                </p>
                <div className="meta-row">
                  <span className="meta-pill">
                    👥 {activity.registeredParticipants?.length || 0}/
                    {activity.maxParticipants}
                  </span>
                  <span className="meta-pill">+{activity.points} điểm</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
