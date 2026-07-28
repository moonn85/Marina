import { useRef, useState, useEffect } from "react";
import { useTranslation } from "@/localization";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperClass } from "swiper/types";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
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
  location: string;
}

const Review: React.FC = () => {
  const { t } = useTranslation('home');
  const carouselRef = useRef<SwiperClass | null>(null);
  const [useFallback, setUseFallback] = useState<boolean>(false);

  // 3 màu xanh lặp lại (dùng tông đậm để chữ trắng dễ đọc hơn)
  const bgColors = ["#1f4f7a", "#036b90", "#0736ae"];

  const getBgColor = (index: number): string => {
    return bgColors[index % bgColors.length];
  };

  const reviews: ReviewItem[] = [
    {
      src: "https://i.ibb.co/7drwxYbK/35250.jpg",
      name: "Căn hộ 1",
      description: t('home.review.content1', 'Trải nghiệm rất vui và thú vị. Phòng đẹp, đầy đủ tiện nghi như bếp, máy giặt sấy. View city khá xinh, ban công rộng, thoải mái.'),
      rating: 5.0,
      reviewer: "Lim A",
      location: "Ha Long"
    },
    {
      src: "https://i.ibb.co/Lz1xDYbJ/dich-vu-skylake9.jpg",
      name: "Căn hộ 2",
      description: t('home.review.content2', 'Đặt phòng nhanh gọn nhẹ. Chỗ ở tiện nghi, thoải mái. Mình đặt lại 3 lần rồi, rất hài lòng với dịch vụ.'),
      rating: 5.0,
      reviewer: "Huyền Ngô",
      location: "Hai Phong"
    },
    {
      src: "https://i.ibb.co/bMq309YJ/z3726691497870-9b7733f818db1076cd9e16e45f434848.jpg",
      name: "Căn hộ 3",
      description: t('home.review.content3', 'Giá cả hợp lý, phục vụ tận tình. Căn hộ sạch sẽ, view đẹp. Nhân viên nhiệt tình và chu đáo.'),
      rating: 5.0,
      reviewer: "Hạnh Chi",
      location: "Bac Ninh"
    },
    {
      src: "https://i.ibb.co/DH128B0T/dich-vu-skylake5.jpg",
      name: "Căn hộ 4",
      description: t('home.review.content4', 'Nội thất bài trí đẹp, view biển tuyệt. Giường êm, phòng tắm rộng rãi, tiện nghi, thang máy riêng tư, bàn ghế rượu vang các thứ đều có, máy giặt, sấy,…'),
      rating: 5.0,
      reviewer: "Phạm Hồng Nhung",
      location: "Ha Long"
    },
    {
      src: "https://i.ibb.co/sJyDQFGC/dich-vu-skylake6.webp",
      name: "Căn hộ 5",
      description: t('home.review.content5', 'An ninh tốt, gần trung tâm. Vị trí thuận tiện đi lại. Căn hộ có đầy đủ tiện nghi cần thiết.'),
      rating: 5.0,
      reviewer: "Đỗ Thanh Tú",
      location: "Ha Noi"
    },
    {
      src: "https://i.ibb.co/sJyDQFGC/dich-vu-skylake6.webp",
      name: "Căn hộ 6",
      description: t('home.review.content5', 'An ninh tốt, gần trung tâm. Vị trí thuận tiện đi lại. Căn hộ có đầy đủ tiện nghi cần thiết.'),
      rating: 5.0,
      reviewer: "Đỗ Thanh Tú",
      location: "Ho Chi Minh"
    },
  ];

  // Nếu Swiper không init trong 400ms, rơi về lưới tĩnh
  useEffect(() => {
    const t = setTimeout(() => {
      if (!carouselRef.current) setUseFallback(true);
    }, 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="review-section">
      <div className="review-container">

        <div className="review-header">
          <h2>{t('home.review.title', 'Đánh giá của khách hàng')}</h2>
          <p>{t('home.review.subtitle', 'Chúng tôi gọi đó là “Nhà” – còn khách hàng gọi đó là cảm xúc.\nHãy nghe những chia sẻ thật từ những người đã ở tại Anstay.')}</p>
        </div>

        <div className="review-carousel-wrapper">
          {useFallback ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
              {reviews.map((item, index) => (
                <div key={index} className="review-item">
                  <div
                    className="review-quote-card"
                    style={{ backgroundColor: getBgColor(index) }}
                  >
                    <div className="quote-content">
                        <p className="quote-text">"{item.description}"</p>
                      <div className="quote-footer">
                        <span className="quote-rating" aria-label={`${item.rating} trên 5 sao`}>★★★★★</span>
                        <div className="quote-author">
                          <span className="author-name">{item.reviewer}</span>
                          <span className="author-location">{item.location}</span>
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
              onSwiper={(sw) => { carouselRef.current = sw; }}
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
                    <div
                      className="review-quote-card"
                      style={{ backgroundColor: getBgColor(index) }}
                    >
                      <div className="quote-content">
                        <p className="quote-text">"{item.description}"</p>
                        <div className="quote-footer">
                          <span className="quote-rating" aria-label={`${item.rating} trên 5 sao`}>★★★★★</span>
                          <div className="quote-author">
                            <span className="author-name">{item.reviewer}</span>
                            <span className="author-location">{item.location}</span>
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
            aria-label="Previous"
          >
            <span aria-hidden="true">‹</span>
          </button>

          <button
            className="carousel-nav carousel-nav-next"
            onClick={() => carouselRef.current?.slideNext()}
            aria-label="Next"
          >
            <span aria-hidden="true">›</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default Review;
