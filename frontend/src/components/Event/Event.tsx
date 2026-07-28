import { useTranslation } from "@/localization";
import "./Event.css";

const getCloudinaryCardImage = (src: string, width = 420, height = 280) => {
  if (!src.includes("res.cloudinary.com") || !src.includes("/upload/")) return src;
  return src.replace("/upload/", `/upload/w_${width},h_${height},c_fill,f_auto,q_auto:eco/`);
};

const Event = () => {
  const { t } = useTranslation('home');

  const destinations = [
    {
      id: 1,
      city: t('home.event.destination1', 'Du thuyền thăm vịnh'),
      image: getCloudinaryCardImage("https://res.cloudinary.com/drpqrn5jz/image/upload/v1778742643/anh9_sdtfkq.webp"),
      alt: "Du thuyền thăm vịnh"
    },
    {
      id: 2,
      city: t('home.event.destination3', 'Dù lượn'),
      image: getCloudinaryCardImage("https://res.cloudinary.com/drpqrn5jz/image/upload/v1778742669/anh5_gyr7cl.png"),
      alt: "Dù lượn trên bầu trời"
    },
    {
      id: 3,
      city: t('home.event.destination4', 'Pháo Hoa'),
      image: getCloudinaryCardImage("https://res.cloudinary.com/drpqrn5jz/image/upload/v1778742688/anh8_llfnxw.jpg"),
      alt: "Khu vực hồ bơi khách sạn sang trọng Dubai"
    },
    {
      id: 4,
      city: t('home.event.destination2', ' Nhạc Nước'),
      image: getCloudinaryCardImage("https://res.cloudinary.com/drpqrn5jz/image/upload/v1778742708/anh6_kdtxmm.jpg", 640, 420),
      alt: "Nhac nước với tầm nhìn đường chân trời"
    },
    {
      id: 5,
      city: t('home.event.destination5', 'Hang động'),
      image: getCloudinaryCardImage("https://res.cloudinary.com/drpqrn5jz/image/upload/v1778742734/anh3_lgadvv.jpg"),
      alt: "Mặt tiền khách sạn boutique Montreal"
    }
  ];

  return (
    <div className="luxury-accommodations">
      {/* Header Section */}
      <div className="header-section">
        <h2 className="main-title">
          {t('home.event.title', 'Sự kiện nổi bật')}
        </h2>
      </div>

      {/* Grid Layout */}
      <div className="destinations-grid">
        {/* London - Top Left */}
        <div className="destination-card">
          <div className="image-container">
            <img
              src={destinations[0].image}
              alt={destinations[0].alt}
              className="destination-image"
              loading="lazy"
              decoding="async"
              width="420"
              height="280"
            />
          </div>
          <h3 className="city-name">
            {destinations[0].city}
          </h3>
        </div>

        {/* New York City - Center Large */}
        <div className="destination-card large-card">
          <div className="image-container large-image">
            <img
              src={destinations[3].image}
              alt={destinations[3].alt}
              className="destination-image"
              fetchPriority="high"
              decoding="async"
              width="640"
              height="420"
            />
            <div className="image-overlay"></div>
          </div>
          <h3 className="city-name">
            {destinations[3].city}
          </h3>
        </div>

        {/* Los Angeles - Top Right */}
        <div className="destination-card">
          <div className="image-container">
            <img
              src={destinations[1].image}
              alt={destinations[1].alt}
              className="destination-image"
              loading="lazy"
              decoding="async"
              width="420"
              height="280"
            />
            <div className="image-overlay"></div>
          </div>
          <h3 className="city-name">
            {destinations[1].city}
          </h3>
        </div>

        {/* Dubai - Bottom Left */}
        <div className="destination-card">
          <div className="image-container">
            <img
              src={destinations[2].image}
              alt={destinations[2].alt}
              className="destination-image"
              loading="lazy"
              decoding="async"
              width="420"
              height="280"
            />
            <div className="image-overlay"></div>
          </div>
          <h3 className="city-name">
            {destinations[2].city}
          </h3>
        </div>

        {/* Montreal - Bottom Right */}
        <div className="destination-card">
          <div className="image-container">
            <img
              src={destinations[4].image}
              alt={destinations[4].alt}
              className="destination-image"
              loading="lazy"
              decoding="async"
              width="420"
              height="280"
            />
            <div className="image-overlay"></div>
          </div>
          <h3 className="city-name">
            {destinations[4].city}
          </h3>
        </div>
      </div>

      {/* View All Button */}
    </div>

  );
};


export default Event;
