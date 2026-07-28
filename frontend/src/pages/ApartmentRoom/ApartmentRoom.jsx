import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../SearchResults/SearchResults.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import RoomCard1 from "../../components/RoomCard/RoomCard1";

const ApartmentRoom = () => {
  const [searchResults, setSearchResults] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const sliderRef = useRef(null);

  // Lấy tên căn hộ từ URL
  const pathParts = location.pathname.split("/");
  const apartmentName = decodeURIComponent(pathParts[pathParts.length - 1]);
  console.log("Tên căn hộ từ URL:", apartmentName);

  const [checkIn, setCheckIn] = useState("2025-05-10");
  const [checkOut, setCheckOut] = useState("2025-05-11");
  const [room, setRoom] = useState(1);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      if (sliderRef.current) {
        sliderRef.current.slickGoTo(0);
      }
    }, 300);
  }, []);

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const response = await fetch(
          `https://api.anstay.com.vn/api/v1/apartments/search?name=${apartmentName}`
        );
        if (!response.ok) throw new Error("Network error");
        const data = await response.json();
        setSearchResults(Array.isArray(data) ? data : []);
      } catch (error) {
        setSearchResults([]);
      }
    };

    fetchSearchResults();
  }, [apartmentName]);

  const getNights = () => {
    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);
    const diff = (outDate.getTime() - inDate.getTime()) / (1000 * 3600 * 24);
    return diff;
  };

  // Gom ảnh từ tất cả room, lọc trùng
  const uniqueImages = (() => {
    const urls = new Set();
    const result = [];
    searchResults.forEach((item) => {
      item.images?.forEach((img) => {
        if (img.imageUrl && !urls.has(img.imageUrl)) {
          urls.add(img.imageUrl);
          result.push(img.imageUrl);
        }
      });
    });
    return result;
  })();

  const propertyData = searchResults[0]
    ? {
        name: searchResults[0].name,
        rating: searchResults[0].description,
        address: searchResults[0].location,
        images: uniqueImages,
      }
    : {
        name: "",
        rating: 0,
        address: "",
        images: [],
      };

  const rooms = searchResults.map((result) => ({
    id: result.id,
    name: result.name,
    description: result.description,
    image: result.images?.[0]?.imageUrl,
    imageCount: `1/${result.images?.length || 1}`,
    guests: result.maxAdults || 2,
    beds: result.max_bed || 1,
    children: result.maxChildren || 0,
    size: result.acreage ? `${result.acreage} m²` : "chưa rõ",
    bedType: "Queen-size",
    price: result.pricePerDay?.toLocaleString() || "",
    priceOriginal: result.pricePerMonth?.toLocaleString() || "",
    nights: getNights(),
    roomsLeft: Number(result.numRooms) || 1,
    promotions: result.discountPercent > 0 ? ["SALE OFF"] : [],
    discountText:
      result.discountPercent > 0 ? `Discount ${result.discountPercent}%` : "",
    policy: [
      "Full payment is required on the day of booking.",
      "Free cancellation if you cancel 5 days before check-in. After that, 50% fee.",
    ],
    name_room: result.name_apartment,
  }));

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/search-results", {
      state: {
        checkIn,
        checkOut,
        room,
        adults,
        children,
      },
    });
  };

  // Slider settings
  const settings = {
    infinite: uniqueImages.length > 1,
    arrows: uniqueImages.length > 1,
    dots: uniqueImages.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className={location.state?.hideSearchBar ? "no-searchbar" : ""}>
      <div className="carousel-wrapper">
        {propertyData.images.length > 0 ? (
          <Slider ref={sliderRef} {...settings}>
            {propertyData.images.map((src, i) => (
              <div key={i} className="carousel-slide">
                <div className="image-wrapper">
                  <img 
                    src={src} 
                    alt={`Slide ${i}`}
                    loading={i === 0 ? "eager" : "lazy"}
                    fetchPriority={i === 0 ? "high" : "low"}
                  />
                </div>
              </div>
            ))}
          </Slider>
        ) : (
          <div className="carousel-slide">
            <div className="image-wrapper">
              <img 
                src="/default-image.jpg" 
                alt="No image"
                loading="eager"
                fetchPriority="high"
              />
            </div>
          </div>
        )}

        <div className="carousel-info">
          <h3 className="carousel-title">{apartmentName}</h3>
          <div className="carousel-address">🗺️ {propertyData.address}</div>
          <div className="carousel-address">💬 {propertyData.rating}</div>
        </div>
      </div>

      <div>
        {rooms.map((room) => (
          <RoomCard1 key={room.id} data={room} />
        ))}
      </div>
    </div>
  );
};

export default ApartmentRoom;
