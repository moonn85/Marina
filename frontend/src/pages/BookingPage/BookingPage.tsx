import { useLocation, useSearchParams } from "react-router-dom";
import "./BookingPage.css";

interface BookingState {
  roomName: string;
  startDate: Date;
  endDate: Date;
  quantity: number;
  totalDiscounted: number;
  roomsLeft: number;
  bedType: string;
  guests: number;
  children: number;
  size: string;
  pricePerNight: number;
  priceOriginalPerNight: number;
  discountPercent: number;
  totalNights: number;
  totalOriginal: number;
  amountSaved: number;
  image: string;
}

const BookingPage = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const bookingData = {
    roomName: searchParams.get("roomName"),
    startDate: new Date(searchParams.get("startDate") || ""),
    endDate: new Date(searchParams.get("endDate") || ""),
    quantity: parseInt(searchParams.get("quantity") || "1"),
    totalDiscounted: parseInt(searchParams.get("totalDiscounted") || "0"),
    roomsLeft: parseInt(searchParams.get("roomsLeft") || "0"),
    bedType: searchParams.get("bedType"),
    guests: parseInt(searchParams.get("guests") || "0"),
    children: parseInt(searchParams.get("children") || "0"),
    size: searchParams.get("size"),
    pricePerNight: parseInt(searchParams.get("pricePerNight") || "0"),
    priceOriginalPerNight: parseInt(
      searchParams.get("priceOriginalPerNight") || "0"
    ),
    discountPercent: parseInt(searchParams.get("discountPercent") || "0"),
    totalNights: parseInt(searchParams.get("totalNights") || "0"),
    totalOriginal: parseInt(searchParams.get("totalOriginal") || "0"),
    amountSaved: parseInt(searchParams.get("amountSaved") || "0"),
    image: searchParams.get("image"),
  };

  // Save booking data to localStorage when it's available from location state
  if (location.state) {
    localStorage.setItem("bookingData", JSON.stringify(location.state));
  }

  // If no booking data is available, show message
  if (!bookingData || !bookingData.roomName) {
    return (
      <div className="booking-page">
        <h2>No booking data available</h2>
      </div>
    );
  }

  console.log("Received Booking Data:", bookingData);

  const search = location.search;
  const params = new URLSearchParams(search);
  const id = params.get("id");
  console.log("Booking Page - Received ID:", id);

  return (
    <div className="booking-page">
      <div className="booking-details">
        <h2>Booking Details</h2>
        <div className="room-summary">
          <img src={bookingData.image} alt={bookingData.roomName} />
          <div className="room-info">
            <h3>{bookingData.roomName}</h3>
            <p>Check-in: {bookingData.startDate.toLocaleDateString()}</p>
            <p>Check-out: {bookingData.endDate.toLocaleDateString()}</p>
            <p>Number of nights: {bookingData.totalNights}</p>
            <p>Room type: {bookingData.bedType}</p>
            <p>Room size: {bookingData.size}</p>
            <p>
              Max guests: {bookingData.guests} adults, {bookingData.children}{" "}
              children
            </p>
            <p>Rooms booked: {bookingData.quantity}</p>
          </div>
        </div>

        <div className="price-summary">
          <h3>Price Summary</h3>
          <div className="price-details">
            <p>
              Price per night:
              <span className="original-price">
                {bookingData.priceOriginalPerNight.toLocaleString("vi-VN")} VND
              </span>
              <span className="discounted-price">
                {bookingData.pricePerNight.toLocaleString("vi-VN")} VND
              </span>
            </p>
            <p>
              Total price:
              <span className="original-price">
                {bookingData.totalOriginal.toLocaleString("vi-VN")} VND
              </span>
              <span className="discounted-price">
                {bookingData.totalDiscounted.toLocaleString("vi-VN")} VND
              </span>
            </p>
            <p className="savings">
              You save: {bookingData.amountSaved.toLocaleString("vi-VN")} VND (
              {bookingData.discountPercent}%)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
