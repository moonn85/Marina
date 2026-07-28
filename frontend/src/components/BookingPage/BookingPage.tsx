import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./BookingPage.css";

const BookingPage = () => {
  const [apartments, setApartments] = useState([]);
  const [bookingData, setBookingData] = useState(null);
  const [guestCounts, setGuestCounts] = useState({
    adults: 1,
    children: 1,
    babies: 0,
  });
  const [modifiedGuestType, setModifiedGuestType] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showAtVenueSuccess, setShowAtVenueSuccess] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600);
  const [holdResult, setHoldResult] = useState(null);
  const [roomHeld, setRoomHeld] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const animationFrameIdRef = useRef(null);
  const endTimeRef = useRef(null);
  const holdTimeoutRef = useRef(null);

  // Thông tin khách vãng lai (input controlled)
  const [guestInfo, setGuestInfo] = useState({
    guestName: "",
    guestPhone: "",
    guestEmail: "",
    guestIdentityNumber: "",
    guestBirthday: "",
    guestNationality: "Việt Nam",
  });

  // ================== ĐỒNG HỒ ĐẶT PHÒNG ==================
  const startCountdown = () => {
    if (animationFrameIdRef.current) {
      cancelAnimationFrame(animationFrameIdRef.current);
    }
    const newEndTime = Date.now() + 10 * 60 * 1000;
    localStorage.setItem("bookingEndTime", newEndTime.toString());
    endTimeRef.current = newEndTime;
    setTimeLeft(600);

    const updateTime = () => {
      const now = Date.now();
      const diff = Math.max(0, Math.floor((endTimeRef.current - now) / 1000));
      setTimeLeft(diff);
      if (diff <= 0) {
        localStorage.removeItem("bookingEndTime");
        cancelAnimationFrame(animationFrameIdRef.current);
        animationFrameIdRef.current = null;
        return;
      }
      animationFrameIdRef.current = requestAnimationFrame(updateTime);
    };

    animationFrameIdRef.current = requestAnimationFrame(updateTime);
  };

  useEffect(() => {
    const storedEndTime = localStorage.getItem("bookingEndTime");
    if (storedEndTime) {
      endTimeRef.current = Number(storedEndTime);
      const updateTime = () => {
        const now = Date.now();
        const diff = Math.max(0, Math.floor((endTimeRef.current - now) / 1000));
        setTimeLeft(diff);
        if (diff <= 0) {
          localStorage.removeItem("bookingEndTime");
          cancelAnimationFrame(animationFrameIdRef.current);
          animationFrameIdRef.current = null;
          return;
        }
        animationFrameIdRef.current = requestAnimationFrame(updateTime);
      };
      animationFrameIdRef.current = requestAnimationFrame(updateTime);
    } else {
      startCountdown();
    }
    return () => {
      if (animationFrameIdRef.current)
        cancelAnimationFrame(animationFrameIdRef.current);
    };
  }, []);

  useEffect(() => {
    if (bookingData) {
      startCountdown();
      setRoomHeld(false);
      setHoldResult(null);
    }
  }, [bookingData]);

  // ================== LẤY DATA BOOKING & PHÒNG ==================
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roomIdParam = params.get("id");
    const locationParam = params.get("location");
    const bookingDataTemp = {
      name: params.get("roomName") || "",
      address: locationParam || "",
      checkIn: params.get("startDate") || "",
      checkOut: params.get("endDate") || "",
      guests: {
        adults: Number(params.get("maxAdults")) || 0,
        children: Number(params.get("maxChildren")) || 0,
        babies: 0,
      },
      price: Number(params.get("totalDiscounted")) || 0,
      roomId: roomIdParam ? Number(roomIdParam) : null,
    };
    setBookingData(bookingDataTemp);
    setGuestCounts({
      adults: Number(params.get("maxAdults")) || 0,
      children: Number(params.get("maxChildren")) || 0,
      babies: 0,
    });

    if (locationParam) {
      fetch(`https://api.anstay.com.vn/api/v1/apartments/search?name=${locationParam}`)
        .then((res) => res.json())
        .then((data) => setApartments(data))
        .catch((err) => {
          setApartments([
            {
              id: 1,
              name: locationParam || "Default Apartment",
              rooms: [{ id: roomIdParam ? Number(roomIdParam) : 1 }],
            },
          ]);
        });
    } else {
      setApartments([
        {
          id: 1,
          name: "Default Apartment",
          rooms: [{ id: roomIdParam ? Number(roomIdParam) : 1 }],
        },
      ]);
    }
  }, []);

  // ================== HÀM XỬ LÝ THANH TOÁN MOMO ==================
  const handleMomoPayment = async () => {
    try {
      // 1. Tạo booking trước
      const bookingRes = await axios.post(
        "https://anstay.com.vn/api/apartment-bookings",
        {
          apartmentId: apartments[0]?.id || 1,
          roomId: bookingData.roomId,
          userId: null, // hoặc userId nếu có
          checkIn: bookingData.checkIn,
          checkOut: bookingData.checkOut,
          totalPrice: (bookingData.price || 0) + calculateSurcharge(),
          status: "HOLD",
          guestName: guestInfo.guestName,
          guestPhone: guestInfo.guestPhone,
          guestEmail: guestInfo.guestEmail,
          guestIdentityNumber: guestInfo.guestIdentityNumber,
          guestBirthday: guestInfo.guestBirthday,
          guestNationality: guestInfo.guestNationality,
        }
      );
      const bookingId = bookingRes.data.id;

      // 2. Gọi thanh toán MOMO
      const paymentData = {
        bookingType: "APARTMENT",
        bookingId: bookingId,
        userId: null,
        amount: (bookingData.price || 0) + calculateSurcharge(),
        paymentMethod: "MOMO",
        guestName: guestInfo.guestName,
        guestPhone: guestInfo.guestPhone,
        guestEmail: guestInfo.guestEmail,
        guestIdentityNumber: guestInfo.guestIdentityNumber,
        guestBirthday: guestInfo.guestBirthday,
        guestNationality: guestInfo.guestNationality,
      };
      const res = await axios.post(
        "https://anstay.com.vn/api/payments/momo",
        paymentData
      );
      const payUrl = res.data.payUrl;
      if (payUrl) {
        window.location.href = payUrl;
      } else {
        alert("Không lấy được link thanh toán Momo!");
      }
    } catch (err) {
      alert("Có lỗi khi tạo booking hoặc thanh toán Momo!");
      console.error(err);
    }
  };

  // ================== HÀM XỬ LÝ THANH TOÁN TẠI CHỖ (CASH) ==================
  const handleSubmitCash = async () => {
    try {
      // 1. Tạo booking trước
      const bookingPayload = {
        apartmentId: apartments[0]?.id || 1,
        roomId: bookingData.roomId,
        userId: null,
        checkIn: bookingData.checkIn,
        checkOut: bookingData.checkOut,
        totalPrice: (bookingData.price || 0) + calculateSurcharge(),
        status: "PENDING",
        guestName: guestInfo.guestName,
        guestPhone: guestInfo.guestPhone,
        guestEmail: guestInfo.guestEmail,
        guestIdentityNumber: guestInfo.guestIdentityNumber,
        guestBirthday: guestInfo.guestBirthday,
        guestNationality: guestInfo.guestNationality,
      };

      console.log("Booking payload:", bookingPayload);

      const bookingRes = await axios
        .post("https://anstay.com.vn/api/apartment-bookings", bookingPayload)
        .catch((error) => {
          console.error("Booking API Error:", {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
          });
          throw error;
        });

      console.log("Booking API Response:", bookingRes.data);
      const bookingId = bookingRes.data.id;

      // 2. Gọi thanh toán CASH
      const cashPaymentData = {
        bookingType: "APARTMENT",
        bookingId: bookingId,
        userId: null,
        amount: (bookingData.price || 0) + calculateSurcharge(),
        guestName: guestInfo.guestName,
        guestPhone: guestInfo.guestPhone,
        guestEmail: guestInfo.guestEmail,
        guestIdentityNumber: guestInfo.guestIdentityNumber,
        guestBirthday: guestInfo.guestBirthday,
        guestNationality: guestInfo.guestNationality,
      };

      console.log("Cash payment payload:", cashPaymentData);

      const cashResponse = await axios
        .post("https://anstay.com.vn/api/payments/cash", cashPaymentData)
        .catch((error) => {
          console.error("Cash Payment API Error:", {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
          });
          throw error;
        });

      console.log("Cash Payment API Response:", cashResponse.data);

      setShowPaymentModal(false);
      setShowAtVenueSuccess(true);
    } catch (err) {
      console.error("Full error object:", err);
      alert("Có lỗi khi giữ chỗ hoặc thanh toán tại chỗ!");
    }
  };

  // ================== CÁC HÀM PHỤ ==================
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const calculateSurcharge = () => {
    if (!bookingData) return 0;
    const addAdults = Math.max(
      0,
      guestCounts.adults - bookingData.guests.adults
    );
    const addChildren = Math.max(
      0,
      guestCounts.children - bookingData.guests.children
    );
    const chargeAdults = addAdults * 200000;
    const chargeChildren = addChildren * 100000;
    return chargeAdults + chargeChildren;
  };

  const updateGuestCount = (type, delta) => {
    if (modifiedGuestType && modifiedGuestType !== type) return;
    setGuestCounts((prev) => {
      const newVal = Math.max(0, prev[type] + delta);
      if (newVal !== prev[type]) setModifiedGuestType(type);
      if (newVal === (bookingData?.guests[type] || 0))
        setModifiedGuestType(null);
      return { ...prev, [type]: newVal };
    });
  };

  const formatDateVN = (dateStr) => {
    if (!dateStr) return "Chưa chọn";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  const apartment = bookingData || {
    name: "",
    address: "",
    checkIn: "",
    checkOut: "",
    guests: { adults: 0, children: 0, babies: 0 },
    price: 0,
  };

  const handlePaymentClick = () => setShowPaymentModal(true);
  const closePaymentModal = () => setShowPaymentModal(false);
  const retryHoldRoom = () => {
    setRoomHeld(false);
    setHoldResult(null);
    // holdRoom(); // Nếu muốn giữ phòng cứng thì gọi lại API giữ phòng ở đây.
  };

  // ================== JSX ==================
  return (
    <div className="booking-page">
      <div className="expire-warning">
        <i className="bi bi-clock"></i>
        <span>Đặt phòng của bạn sẽ không còn hiệu lực sau <strong>{formatTime(timeLeft)}</strong></span>
      </div>

      {isLoading && (
        <div className="loading-message">
          <i className="bi bi-hourglass-split"></i>
          <span>Đang xử lý...</span>
        </div>
      )}

      {holdResult && (
        <div className={`result-message ${holdResult.success ? 'success' : 'error'}`}>
          <i className={`bi ${holdResult.success ? 'bi-check-circle' : 'bi-exclamation-triangle'}`}></i>
          <span>{holdResult.message}</span>
          {!holdResult.success && (
            <button className="retry-button" onClick={retryHoldRoom}>
              <i className="bi bi-arrow-clockwise"></i>
              Thử lại
            </button>
          )}
        </div>
      )}

      <div className="booking-grid">
        <div className="booking-left">
          <section className="card hotel-info">
            <h3>
              <i className="bi bi-house-door"></i>
              Thông tin đặt phòng
            </h3>
            <h2>{apartment.address || "Đang tải..."}</h2>
            <h3 style={{ margin: "6px 0", fontWeight: "normal" }}>
              {apartment.name || "Đang tải..."}
            </h3>
            <div className="summary-box">
              <p><i className="bi bi-calendar-check"></i> Ngày nhận phòng: {formatDateVN(apartment.checkIn)}</p>
              <p><i className="bi bi-calendar-x"></i> Ngày trả phòng: {formatDateVN(apartment.checkOut)}</p>
            </div>
            <p>
              <strong>
                <div className="guest-controls">
                  {/* Người lớn */}
                  <div className="guest-row">
                    <button
                      onClick={() => updateGuestCount("adults", -1)}
                      disabled={
                        modifiedGuestType && modifiedGuestType !== "adults"
                      }
                    >
                      <i className="bi bi-dash"></i>
                    </button>
                    <span><i className="bi bi-person"></i> {guestCounts.adults} người lớn</span>
                    <button
                      onClick={() => updateGuestCount("adults", 1)}
                      disabled={
                        modifiedGuestType && modifiedGuestType !== "adults"
                      }
                    >
                      <i className="bi bi-plus"></i>
                    </button>
                  </div>
                  {/* Trẻ em */}
                  <div className="guest-row">
                    <button
                      onClick={() => updateGuestCount("children", -1)}
                      disabled={
                        modifiedGuestType && modifiedGuestType !== "children"
                      }
                    >
                      <i className="bi bi-dash"></i>
                    </button>
                    <span><i className="bi bi-person-heart"></i> {guestCounts.children} trẻ em</span>
                    <button
                      onClick={() => updateGuestCount("children", 1)}
                      disabled={
                        modifiedGuestType && modifiedGuestType !== "children"
                      }
                    >
                      <i className="bi bi-plus"></i>
                    </button>
                  </div>
                  {/* Em bé */}
                  <div className="guest-row">
                    <button
                      onClick={() => updateGuestCount("babies", -1)}
                      disabled={
                        modifiedGuestType && modifiedGuestType !== "babies"
                      }
                    >
                      <i className="bi bi-dash"></i>
                    </button>
                    <span><i className="bi bi-baby"></i> {guestCounts.babies} em bé</span>
                    <button
                      onClick={() => updateGuestCount("babies", 1)}
                      disabled={
                        modifiedGuestType && modifiedGuestType !== "babies"
                      }
                    >
                      <i className="bi bi-plus"></i>
                    </button>
                  </div>
                </div>
              </strong>
            </p>
          </section>
        </div>

        <div className="booking-right">
          <section className="card customer-form">
            <h4>
              <i className="bi bi-person-lines-fill"></i>
              Thông tin của bạn
            </h4>
            <input
              type="text"
              placeholder="Họ và tên*"
              value={guestInfo.guestName}
              onChange={(e) =>
                setGuestInfo((info) => ({ ...info, guestName: e.target.value }))
              }
            />
            <input
              type="text"
              placeholder="Số điện thoại"
              value={guestInfo.guestPhone}
              onChange={(e) =>
                setGuestInfo((info) => ({
                  ...info,
                  guestPhone: e.target.value,
                }))
              }
            />
            <input
              type="email"
              placeholder="Email*"
              value={guestInfo.guestEmail}
              onChange={(e) =>
                setGuestInfo((info) => ({
                  ...info,
                  guestEmail: e.target.value,
                }))
              }
            />

            <select
              value={guestInfo.guestNationality}
              onChange={(e) =>
                setGuestInfo((info) => ({
                  ...info,
                  guestNationality: e.target.value,
                }))
              }
            >
              <option>Việt Nam</option>
              <option>Quốc tịch khác</option>
            </select>
          </section>
        </div>
      </div>

      <div className="payment-section card">
        <h4>
          <i className="bi bi-credit-card"></i>
          Thông tin thanh toán
        </h4>
        <table>
          <thead>
            <tr>
              <th>Chi tiết</th>
              <th>Giá (₫)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Phòng: {apartment.name || "Đang tải..."}</td>
              <td>{(apartment.price || 0).toLocaleString()}</td>
            </tr>
            <tr>
              <td>Phụ thu</td>
              <td>{calculateSurcharge().toLocaleString()}</td>
            </tr>
            <tr className="total-row">
              <td>
                <strong>Tổng cộng</strong>
              </td>
              <td>
                <strong>
                  {(
                    (apartment.price || 0) + calculateSurcharge()
                  ).toLocaleString()}
                </strong>
              </td>
            </tr>
          </tbody>
        </table>
        <div className="payment-button">
          <button
            className="btn-pay"
            onClick={handlePaymentClick}
            // Có thể mở modal khi phòng đã được hold/giữ thành công
          >
            <i className="bi bi-wallet2"></i>
            Thanh toán
          </button>
        </div>
      </div>

      {/* ==== MODAL chọn phương thức thanh toán ==== */}
      {showPaymentModal && (
        <div className="payment-modal-overlay">
        <div className="payment-modal">
          <h3>
            <i className="bi bi-credit-card-2-front"></i>
            Chọn phương thức thanh toán
          </h3>
            <div className="payment-options">
              <button
                className="payment-option active"
                onClick={handleMomoPayment}
              >
                <img src="/momo-icon.png" alt="Momo" /> Momo
              </button>
              <button className="payment-option" disabled>
                <img src="/tpbank-icon.png" alt="TPBank" /> TPBank
              </button>
              <button className="payment-option" disabled>
                <img src="/paypal-icon.png" alt="PayPal" /> PayPal
              </button>
              <button
                className="payment-option"
                onClick={handleSubmitCash}
                type="button"
              >
                <i className="bi bi-cash-coin"></i>
                Thanh toán tại chỗ
              </button>
            </div>
            <div className="modal-actions">
              <button onClick={closePaymentModal}>
                <i className="bi bi-x-circle"></i>
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==== POPUP thành công khi chọn "Thanh toán tại chỗ" ==== */}
      {showAtVenueSuccess && (
        <div className="payment-modal-overlay">
        <div className="payment-modal">
          <h3>
            <i className="bi bi-check-circle-fill"></i>
            Giữ chỗ thành công
          </h3>
            <div style={{ margin: "18px 0" }}>
              Chúng tôi đã nhận được yêu cầu đặt phòng.
              <br />
              <b>
                Anstay sẽ liên hệ với bạn để xác nhận trong thời gian sớm nhất.
              </b>
              <br />
              <b>Hotline CSKH : 038 494 5614</b>
            </div>
            <div className="modal-actions">
              <button onClick={() => (window.location.href = "/")}>
                <i className="bi bi-house"></i>
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingPage;
