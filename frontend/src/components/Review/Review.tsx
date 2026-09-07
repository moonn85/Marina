import { useRef, useState, useEffect } from "react";
import { useTranslation } from "@/localization";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperClass } from "swiper/types";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Link } from "react-router-dom";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./Review.css";

interface ReviewItem {
  src: string;
  name: string;
  description: string;
  rating: number;
  reviewer: string;
  source: string;
  avatarUrl: string;
}

interface PlatformItem {
  name: string;
  rating: string;
  reviews: string;
  cta: string;
  href?: string;
  icon: string;
  accentClass: string;
}

const sourceBadgeIcons: Record<string, string> = {
  "Google Maps": "https://res.cloudinary.com/drpqrn5jz/image/upload/v1784532929/download_bdqmd6.webp",
  Booking: "https://res.cloudinary.com/drpqrn5jz/image/upload/v1784532872/booking-logo_ytm1vx.avif",
  Agoda: "https://res.cloudinary.com/drpqrn5jz/image/upload/v1784533510/Agoda_qzntmw.png",
};

const Review: React.FC = () => {
  const { t } = useTranslation("home");
  const carouselRef = useRef<SwiperClass | null>(null);
  const [useFallback, setUseFallback] = useState<boolean>(false);

  const platforms: PlatformItem[] = [
    {
      name: "Google",
      rating: "—",
      reviews: t("home.review.updating", "Đang cập nhật"),
      cta: t("home.review.viewGoogle", "Xem trên Google Maps"),
      href: "https://maps.app.goo.gl/bjM5VjPPnfWszPUVA",
      icon: "https://res.cloudinary.com/drpqrn5jz/image/upload/v1784532929/download_bdqmd6.webp",
      accentClass: "platform-google",
    },
    {
      name: "Booking",
      rating: "9,9/10",
      reviews: t("home.review.updating", "Đang cập nhật"),
      cta: t("home.review.viewDetails", "Xem thông tin"),
      icon: "https://res.cloudinary.com/drpqrn5jz/image/upload/v1784532872/booking-logo_ytm1vx.avif",
      accentClass: "platform-booking",
    },
    {
      name: "Agoda",
      rating: "—",
      reviews: t("home.review.updating", "Đang cập nhật"),
      cta: t("home.review.viewDetails", "Xem thông tin"),
      icon: "https://res.cloudinary.com/drpqrn5jz/image/upload/v1784533510/Agoda_qzntmw.png",
      accentClass: "platform-agoda",
    },
  ];

  const reviews: ReviewItem[] = [
    {
      src: "",
      name: "Dương",
      description: t("home.review.marinaContent1", "Giá hợp lý và phòng sạch sẽ."),
      rating: 5.0,
      reviewer: "Dương",
      source: "Booking",
      avatarUrl: "https://res.cloudinary.com/drpqrn5jz/image/upload/v1784535479/unnamed_6_cjteay.png",
    },
    {
      src: "",
      name: "Lai Ly Van",
      description: t("home.review.marinaContent2", "Giường rộng, tiện nghi mới, nhân viên thân thiện, phù hợp cho kỳ nghỉ gia đình."),
      rating: 5.0,
      reviewer: "Lai Ly Van",
      source: "Booking",
      avatarUrl: "https://res.cloudinary.com/drpqrn5jz/image/upload/v1784535348/unnamed_4_bu5ctr.png",
    },
    {
      src: "",
      name: "THI NGUYET VU",
      description: t("home.review.marinaContent3", "Phòng sạch, thoáng, khách sạn mới và hỗ trợ rất nhiệt tình trong suốt thời gian lưu trú."),
      rating: 5.0,
      reviewer: "THI NGUYET VU",
      source: "Booking",
      avatarUrl: "https://res.cloudinary.com/drpqrn5jz/image/upload/v1784535315/unnamed_3_qk2zrv.png",
    },
  ];

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!carouselRef.current) setUseFallback(true);
    }, 400);
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="review-section">
      <div className="review-container">
        <div className="review-header">
          <div className="review-header-kicker"></div>
          <h2>{t("home.review.marinaTitle", "Khách hàng nói gì về Anstay Marina?")}</h2>
          <p>
            {t(
              "home.review.marinaSubtitle",
              "Từ vị trí, độ sạch sẽ đến trải nghiệm lưu trú, đây là những chia sẻ thực tế từ khách đã đặt phòng tại Anstay Marina Hotel Ha Long.",
            )}
          </p>
        </div>

        <div className="review-platform-grid">
          {platforms.map((platform) => {
            const content = (
              <div className={`platform-card ${platform.accentClass}`}>
                <div className="platform-logo" aria-hidden="true">
                  <img src={platform.icon} alt={platform.name} />
                </div>
                <div className="platform-content">
                  <div className="platform-name">{platform.name}</div>
                  <div className="platform-rating-row">
                    <span className="platform-rating">{platform.rating}</span>
                    <span className="platform-stars">★★★★★</span>
                  </div>
                  <div className="platform-reviews">{platform.reviews}</div>
                </div>
                <div className="platform-cta">{platform.cta}</div>
              </div>
            );

            if (platform.href) {
              return (
                <a
                  key={platform.name}
                  className="platform-link"
                  href={platform.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={t("home.review.openPlatform", "Mở đánh giá {{platform}}", { platform: platform.name })}
                >
                  {content}
                </a>
              );
            }

            return (
              <div
                key={platform.name}
                className="platform-link platform-link-disabled"
                aria-disabled="true"
              >
                {content}
              </div>
            );
          })}
        </div>

        <div className="review-carousel-wrapper">
          {useFallback ? (
            <div className="review-grid-fallback">
              {reviews.map((item, index) => (
                <div key={index} className="review-item">
                  <div className="review-quote-card">
                    <div className="quote-content">
                      <div className="quote-top-row">
                        <img className="quote-platform-badge" src={sourceBadgeIcons[item.source]} alt={item.source} />
                        <span className="quote-rating" aria-label={t("home.review.rating", "{{rating}} trên 5 sao", { rating: item.rating })}>
                          ★★★★★
                        </span>
                      </div>
                      <p className="quote-text">"{item.description}"</p>
                      <div className="quote-footer">
                        <div className="quote-author-row">
                          <img className="quote-avatar" src={item.avatarUrl} alt={item.reviewer} />
                          <div className="quote-author">
                            <span className="author-name">{item.reviewer}</span>
                            <span className="author-source">{t("home.review.source", "Nguồn: {{source}}", { source: item.source })}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              onSwiper={(sw) => {
                carouselRef.current = sw;
              }}
              spaceBetween={16}
              slidesPerView={3}
              breakpoints={{
                0: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              pagination={{ clickable: true }}
              autoplay={false}
              loop
            >
              {reviews.map((item, index) => (
                <SwiperSlide key={index}>
                  <div className="review-item">
                    <div className="review-quote-card">
                      <div className="quote-content">
                        <div className="quote-top-row">
                          <img className="quote-platform-badge" src={sourceBadgeIcons[item.source]} alt={item.source} />
                          <span className="quote-rating" aria-label={t("home.review.rating", "{{rating}} trên 5 sao", { rating: item.rating })}>
                            ★★★★★
                          </span>
                        </div>
                        <p className="quote-text">"{item.description}"</p>
                        <div className="quote-footer">
                          <div className="quote-author-row">
                            <img className="quote-avatar" src={item.avatarUrl} alt={item.reviewer} />
                            <div className="quote-author">
                              <span className="author-name">{item.reviewer}</span>
                              <span className="author-source">{t("home.review.source", "Nguồn: {{source}}", { source: item.source })}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}

          <button
            className="carousel-nav carousel-nav-prev"
            onClick={() => carouselRef.current?.slidePrev()}
            aria-label={t("home.review.previous", "Đánh giá trước")}
          >
            <span aria-hidden="true">‹</span>
          </button>

          <button
            className="carousel-nav carousel-nav-next"
            onClick={() => carouselRef.current?.slideNext()}
            aria-label={t("home.review.next", "Đánh giá tiếp theo")}
          >
            <span aria-hidden="true">›</span>
          </button>
        </div>

        <div className="review-footer-cta">
          <Link to="/booking" className="review-main-cta">
            {t("home.review.bookDirect", "ĐẶT PHÒNG TRỰC TIẾP - GIÁ TỐT")}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Review;
