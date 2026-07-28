import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./ApartmentList.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

interface Apartment {
  id: number;
  name: string;
  location: string;
  description: string;
  images: {
    image: string;
    imageUrl: string;
  }[];
}

const ApartmentList = () => {
  const navigate = useNavigate();
  const { locationSlug } = useParams();
  console.log("Slug hiện tại:", locationSlug);

  const LOCATION_MAP: Record<string, string> = {
    "ha-noi": "Hà Nội",
    "ha-long": "Hạ Long",
  };

  const removeVietnameseTones = (str: string) =>
    str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");

  const normalizeToSlug = (text: string) =>
    removeVietnameseTones(text || "")
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "");

  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchApartments = async () => {
      try {
        const res = await fetch("https://api.anstay.com.vn/api/v1/apartments");
        const data = await res.json();

        if (Array.isArray(data)) {
          const filtered = data.filter((apt) => {
            const aptLocation = (apt.location || "").toLowerCase();
            if (locationSlug === "ha-long") {
              return (
                aptLocation.includes("hạ long") ||
                aptLocation.includes("ha long") ||
                aptLocation.includes("quảng ninh") ||
                aptLocation.includes("quang ninh")
              );
            }
            if (locationSlug === "ha-noi") {
              return (
                aptLocation.includes("hà nội") || aptLocation.includes("ha noi")
              );
            }
            return false;
          });

          setApartments(filtered);
        }
      } catch (err) {
        console.error("Lỗi khi fetch danh sách căn hộ:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchApartments();
  }, [locationSlug]);

  const handleClick = (name: string) => {
    const slug = name.toLowerCase().replace(/\s+/g, "-");
    navigate(`/apartment/${slug}/view`);
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    adaptiveHeight: true,
  };
  const locationName = LOCATION_MAP[locationSlug || "ha-noi"] || "Hà Nội";

  return (
    <div className="apartment-list-container">
      <h2 className="list-title">Danh sách căn hộ {locationName}</h2>

      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <div className="apartment-list-vertical">
          {apartments.map((apt) => (
            <div key={apt.id} className="apartment-card-wrapper">
              <div
                className="apartment-full-card"
                onClick={() => handleClick(apt.name)}
              >
                <Slider {...sliderSettings}>
                  {apt.images?.map((img, index) => (
                    <img
                      key={index}
                      src={img.imageUrl || img.image || ""}
                      alt={`Ảnh ${index + 1}`}
                      className="apartment-main-image"
                      loading={index === 0 ? "eager" : "lazy"}
                      fetchPriority={index === 0 ? "high" : "low"}
                    />
                  ))}
                </Slider>

                <div className="apartment-full-info">
                  <h3 className="apartment-title">{apt.name}</h3>
                  <p className="apartment-line">
                    📍 <span>{apt.location}</span>
                  </p>
                  <p className="apartment-line">
                    💬 <span>{apt.description}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApartmentList;
