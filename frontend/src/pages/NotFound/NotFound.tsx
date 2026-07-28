import { ArrowRight, CalendarDays, Compass, Home, LifeBuoy, MapPin, Sparkles } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { Link, useLocation } from "react-router-dom";
import "./NotFound.css";

const quickLinks = [
  {
    to: "/booking",
    icon: CalendarDays,
    title: "Đặt phòng",
    description: "Tìm nơi lưu trú phù hợp cho chuyến đi của bạn.",
  },
  {
    to: "/custom-itinerary",
    icon: Sparkles,
    title: "Lịch trình riêng",
    description: "Tạo gợi ý chuyến đi phù hợp với nhu cầu của bạn.",
  },
  {
    to: "/contact",
    icon: LifeBuoy,
    title: "Liên hệ hỗ trợ",
    description: "Để ANSTAY hỗ trợ bạn tìm đúng thông tin cần thiết.",
  },
];

const NotFound = () => {
  const location = useLocation();

  return (
    <>
      <Helmet>
        <title>404 - Trang web không tồn tại | ANSTAY</title>
        <meta
          name="description"
          content="Trang bạn đang tìm kiếm không tồn tại hoặc đã được chuyển sang địa chỉ khác."
        />
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <section className="not-found-page" aria-labelledby="not-found-title">
        <div className="not-found-glow not-found-glow-left" aria-hidden="true" />
        <div className="not-found-glow not-found-glow-right" aria-hidden="true" />

        <div className="not-found-container">
          <div className="not-found-copy">
            <div className="not-found-kicker">
              <Compass size={17} aria-hidden="true" />
              <span>Bạn đang đi lạc một chút</span>
            </div>

            <p className="not-found-code">404</p>
            <h1 id="not-found-title">Trang web này không tồn tại</h1>
            <p className="not-found-description">
              Đường dẫn bạn vừa nhập có thể chưa chính xác hoặc nội dung đã được
              chuyển sang một địa chỉ mới.
            </p>

            <div className="not-found-path">
              <MapPin size={18} aria-hidden="true" />
              <span>Không tìm thấy:</span>
              <code>{location.pathname}</code>
            </div>

            <div className="not-found-actions">
              <Link to="/" className="not-found-primary-action">
                <Home size={18} aria-hidden="true" />
                <span>Về trang chủ</span>
              </Link>
              <Link to="/contact" className="not-found-secondary-action">
                <span>Nhờ hỗ trợ</span>
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className="not-found-visual" aria-hidden="true">
            <div className="not-found-sun" />
            <div className="not-found-cloud not-found-cloud-one" />
            <div className="not-found-cloud not-found-cloud-two" />
            <div className="not-found-landscape">
              <div className="not-found-sign">
                <span>404</span>
                <small>LOST ROUTE</small>
              </div>
              <div className="not-found-sign-post" />
              <div className="not-found-hill not-found-hill-back" />
              <div className="not-found-hill not-found-hill-front" />
              <div className="not-found-road" />
            </div>
          </div>
        </div>

        <nav className="not-found-quick-links" aria-label="Liên kết hữu ích">
          {quickLinks.map(({ to, icon: Icon, title, description }) => (
            <Link key={to} to={to} className="not-found-quick-link">
              <span className="not-found-quick-icon">
                <Icon size={20} aria-hidden="true" />
              </span>
              <span>
                <strong>{title}</strong>
                <small>{description}</small>
              </span>
              <ArrowRight className="not-found-quick-arrow" size={18} aria-hidden="true" />
            </Link>
          ))}
        </nav>
      </section>
    </>
  );
};

export default NotFound;
