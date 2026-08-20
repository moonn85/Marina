import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { useTranslation } from "@/localization";
import "./Event.css";

const getCloudinaryCardImage = (src: string, width = 420, height = 280) => {
  if (!src.includes("res.cloudinary.com") || !src.includes("/upload/")) {
    return src;
  }

  return src.replace(
    "/upload/",
    `/upload/w_${width},h_${height},c_fill,f_auto,q_auto:eco/`,
  );
};

const Event = () => {
  const { t } = useTranslation("home");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.overflow = selectedImage ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedImage]);

  const destinations = [
    {
      id: 1,
      city: t("home.event.destination1", "Du thuyền thăm vịnh"),
      image: getCloudinaryCardImage(
        "https://res.cloudinary.com/drpqrn5jz/image/upload/v1778742643/anh9_sdtfkq.webp",
      ),
      alt: "Du thuyền thăm vịnh",
    },
    {
      id: 2,
      city: t("home.event.destination3", "Dù lượn"),
      image: getCloudinaryCardImage(
        "https://res.cloudinary.com/drpqrn5jz/image/upload/v1778742669/anh5_gyr7cl.png",
      ),
      alt: "Dù lượn trên bầu trời",
    },
    {
      id: 3,
      city: t("home.event.destination4", "Pháo Hoa"),
      image: getCloudinaryCardImage(
        "https://res.cloudinary.com/drpqrn5jz/image/upload/v1778742688/anh8_llfnxw.jpg",
      ),
      alt: "Lịch pháo hoa Hạ Long",
    },
    {
      id: 4,
      city: t("home.event.destination2", "Nhạc Nước"),
      image: getCloudinaryCardImage(
        "https://res.cloudinary.com/drpqrn5jz/image/upload/v1778742708/anh6_kdtxmm.jpg",
        640,
        420,
      ),
      alt: "Nhạc nước với tầm nhìn đường chân trời",
    },
    {
      id: 5,
      city: t("home.event.destination5", "Hang động"),
      image: getCloudinaryCardImage(
        "https://res.cloudinary.com/drpqrn5jz/image/upload/v1778742734/anh3_lgadvv.jpg",
      ),
      alt: "Mặt tiền khách sạn boutique Montreal",
    },
  ];

  const fireworksSchedule = [
    {
      label: "Thứ 2 - Thứ 5",
      value: "21:30",
    },
    {
      label: "Thứ 6 - Thứ 7 - Chủ Nhật",
      value: "Lần 1: 20:30. Lần 2: 21:45",
    },
  ];

  const openFireworksImage = () => {
    setSelectedImage(
      "https://res.cloudinary.com/drpqrn5jz/image/upload/v1784270481/1784258113177_3076505846665479879_g730117131084084823_f55721cf0fc5b0a56e81bd8b2131498d_qttxmy.jpg",
    );
  };

  const closeFireworksImage = () => {
    setSelectedImage(null);
  };

  return (
    <div className="luxury-accommodations">
      <div className="header-section">
        <h2 className="main-title">
          {t("home.event.title", "Sự kiện nổi bật")}
        </h2>
      </div>

      <div className="destinations-grid">
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
          <h3 className="city-name">{destinations[0].city}</h3>
        </div>

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
          <h3 className="city-name">{destinations[3].city}</h3>
        </div>

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
          <h3 className="city-name">{destinations[1].city}</h3>
        </div>

        <div className="destination-card">
          <div
            className="image-container fireworks-image-container"
            onClick={openFireworksImage}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openFireworksImage();
              }
            }}
          >
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
          <h3 className="city-name">{destinations[2].city}</h3>
        </div>

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
          <h3 className="city-name">{destinations[4].city}</h3>
        </div>
      </div>

      <section className="sr-only" aria-label="Lịch pháo hoa Hạ Long">
        <h3>Lịch pháo hoa Hạ Long</h3>
        {fireworksSchedule.map((item) => (
          <p key={item.label}>
            {item.label}: {item.value}
          </p>
        ))}
      </section>

      {selectedImage &&
        createPortal(
          <div
            className="event-modal-overlay"
            onClick={closeFireworksImage}
            role="presentation"
          >
            <div
              className="event-modal-content"
              onClick={(event) => event.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label="Ảnh lịch pháo hoa Hạ Long"
            >
              <button
                type="button"
                className="event-modal-close"
                onClick={closeFireworksImage}
                aria-label="Đóng ảnh"
              >
                ×
              </button>
              <img
                src={selectedImage}
                alt="Lịch pháo hoa Hạ Long"
                loading="lazy"
              />
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
};

export default Event;
