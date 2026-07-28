import React, { useState, useEffect, useCallback, useRef } from "react";
import "./RoomCard.css";
import {
  FaUser,
  FaBed,
  FaChild,
  FaRulerCombined,
  FaTag,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate, useLocation } from "react-router-dom";
import { vi } from "date-fns/locale/vi";

registerLocale("vi", vi);

interface RoomData {
  id: number;
  apartmentId?: number;
  name: string;
  description: string | null;
  capacity?: number;
  price: number | string;
  maxRooms?: number;
  maxAdults?: number;
  maxChildren?: number;
  discount?: number;
  name_room?: string;
  imageCount?: string;
  guests?: number;
  beds?: number;
  children?: number;
  size?: string;
  bedType?: string;
  priceOriginal?: number | string;
  nights?: number;
  roomsLeft?: number;
  promotions?: string[];
  discountText?: string;
  policy?: string[];
  image?: string;
}

interface RoomCardProps {
  data: RoomData;
}

const RoomCardWithProps: React.FC<RoomCardProps> = ({ data }) => {
  const [quantity, setQuantity] = useState(1);
  const [dateRanges, setDateRanges] = useState<{ [roomId: number]: { startDate: Date | null; endDate: Date | null } }>({});
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const [bookedDatesByRoom, setBookedDatesByRoom] = useState<{
    [roomId: number]: { start: Date; end: Date }[];
  }>({});
  const [loadingBookedDates, setLoadingBookedDates] = useState(false);
  const [roomImages, setRoomImages] = useState<{ [roomId: number]: string[] }>({});
  const [currentImageIndex, setCurrentImageIndex] = useState<{
    [roomId: number]: number;
  }>({});
  const intervalsRef = useRef<{ [roomId: number]: ReturnType<typeof setTimeout> }>({});

  const navigate = useNavigate();
  const location = useLocation();

  // Use the data prop instead of fetching
  const room = data;
  
  // Convert price to number if it's a string
  const priceNumber = typeof room.price === 'string' ? parseInt(room.price.replace(/,/g, '')) : room.price;

  useEffect(() => {
    // Fetch booked dates for this room
    const fetchBookedDates = async () => {
      setLoadingBookedDates(true);
      try {
        const res = await fetch(
          `https://anstay.com.vn/api/apartment-bookings/by-room?roomId=${room.id}`
        );
        const bookings = await res.json();
        const validStatuses = ["HOLD", "CONFIRMED", "PENDING"];
        const periods = bookings
          .filter((b: any) => validStatuses.includes(b.status))
          .map((b: any) => ({
            start: new Date(b.checkIn),
            end: new Date(b.checkOut),
          }));
        setBookedDatesByRoom({ [room.id]: periods });
      } catch (error) {
        console.error("Error fetching booked dates:", error);
      }
      setLoadingBookedDates(false);
    };

    fetchBookedDates();
  }, [room.id]);

  useEffect(() => {
    // Fetch images for this room
    const fetchImages = async () => {
      try {
        const imgRes = await fetch(
          `https://anstay.com.vn/api/room-images/room/${room.id}`
        );
        const imgJson = await imgRes.json();
        const imgs =
          Array.isArray(imgJson) && typeof imgJson[0] === "string"
            ? imgJson
            : imgJson.map((img: any) => img.url || img.imageUrl || img.path || "");
        setRoomImages({
          [room.id]: imgs && imgs.length > 0 ? imgs : ["https://placeholder.com/300x200"],
        });
      } catch (error) {
        setRoomImages({
          [room.id]: ["https://placeholder.com/300x200"],
        });
      }
    };

    fetchImages();
  }, [room.id]);

  const handlePrevImage = (roomId: number) => {
    setCurrentImageIndex((prev) => {
      const currentIndex = prev[roomId] || 0;
      const images = roomImages[roomId] || [];
      const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
      return { ...prev, [roomId]: newIndex };
    });
  };

  const handleNextImage = (roomId: number) => {
    setCurrentImageIndex((prev) => {
      const currentIndex = prev[roomId] || 0;
      const images = roomImages[roomId] || [];
      const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
      return { ...prev, [roomId]: newIndex };
    });
  };

  const getNightCount = (roomId: number) => {
    const range = dateRanges[roomId];
    if (!range?.startDate || !range?.endDate) return 0;
    const diffTime = Math.abs(range.endDate.getTime() - range.startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleDateChange = (
    roomId: number,
    dates: [Date | null, Date | null]
  ) => {
    setDateRanges((prev) => ({
      ...prev,
      [roomId]: { startDate: dates[0], endDate: dates[1] },
    }));
  };

  const isSameDay = (d1: Date, d2: Date) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  const filterDate = (roomId: number, date: Date) => {
    const bookedDates = bookedDatesByRoom[roomId] || [];
    return !bookedDates.some((period) => {
      const start = new Date(period.start);
      const end = new Date(period.end);
      return date >= start && date <= end;
    });
  };

  const pad = (num: number) => String(num).padStart(2, "0");
  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
  };

  const handleBooking = () => {
    const range = dateRanges[room.id];
    if (!range?.startDate || !range?.endDate) {
      alert("Vui lòng chọn ngày đến và ngày đi");
      return;
    }

    const nights = getNightCount(room.id);
    const totalPrice = (typeof priceNumber === 'number' ? priceNumber : 0) * nights * quantity;

    const queryParams = new URLSearchParams({
      roomId: room.id.toString(),
      checkIn: range.startDate.toISOString().split("T")[0],
      checkOut: range.endDate.toISOString().split("T")[0],
      quantity: quantity.toString(),
      totalPrice: totalPrice.toString(),
    }).toString();

    navigate(`/booking?${queryParams}`);
  };

  const images = roomImages[room.id] || [];
  const currentIndex = currentImageIndex[room.id] || 0;
  const currentImage = images[currentIndex] || "https://placeholder.com/300x200";

  return (
    <div className="room-card">
      <div className="room-image-container">
        <img src={currentImage} alt={room.name} className="room-image" />
        {images.length > 1 && (
          <>
            <button
              className="image-nav-btn prev-btn"
              onClick={() => handlePrevImage(room.id)}
            >
              <FaChevronLeft />
            </button>
            <button
              className="image-nav-btn next-btn"
              onClick={() => handleNextImage(room.id)}
            >
              <FaChevronRight />
            </button>
            <div className="image-indicators">
              {images.map((_, index) => (
                <span
                  key={index}
                  className={`indicator ${index === currentIndex ? "active" : ""}`}
                  onClick={() => setCurrentImageIndex(prev => ({ ...prev, [room.id]: index }))}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="room-content">
        <h3 className="room-name">{room.name}</h3>
        <p className="room-description">{room.description}</p>

        <div className="room-details">
          <div className="detail-item">
            <FaUser />
            <span>{room.guests || room.capacity || 2} người</span>
          </div>
          <div className="detail-item">
            <FaBed />
            <span>{room.beds || room.maxAdults || 1} giường</span>
          </div>
          <div className="detail-item">
            <FaChild />
            <span>{room.children || room.maxChildren || 0} trẻ em</span>
          </div>
          <div className="detail-item">
            <FaRulerCombined />
            <span>{room.size || "N/A"}</span>
          </div>
        </div>

        <div className="room-price">
          <span className="price">
            {typeof priceNumber === 'number' ? priceNumber.toLocaleString("vi-VN") : priceNumber}đ/đêm
          </span>
          {room.discount && (
            <span className="discount">
              <FaTag /> Giảm {room.discount}%
            </span>
          )}
        </div>

        <div className="date-picker-container">
          <DatePicker
            selected={dateRanges[room.id]?.startDate}
            onChange={(dates) => handleDateChange(room.id, dates)}
            startDate={dateRanges[room.id]?.startDate}
            endDate={dateRanges[room.id]?.endDate}
            selectsRange
            inline
            filterDate={(date) => filterDate(room.id, date)}
            placeholderText="Chọn ngày đến và ngày đi"
            locale="vi"
            minDate={new Date()}
          />
        </div>

        <div className="quantity-selector">
          <label>Số phòng:</label>
          <div className="quantity-controls">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
            >
              -
            </button>
            <span>{quantity}</span>
            <button
              onClick={() => setQuantity(Math.min(room.roomsLeft || room.maxRooms || 1, quantity + 1))}
              disabled={quantity >= (room.roomsLeft || room.maxRooms || 1)}
            >
              +
            </button>
          </div>
        </div>

        <button
          className="booking-btn"
          onClick={handleBooking}
          disabled={!dateRanges[room.id]?.startDate || !dateRanges[room.id]?.endDate}
        >
          Đặt phòng
        </button>
      </div>
    </div>
  );
};

export default RoomCardWithProps; 