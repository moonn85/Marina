import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Typography,
  Row,
  Col,
  Button,
  Form,
  Input,
  DatePicker,
  InputNumber,
  notification,
} from "antd";
import "./ApartmentDetail.css";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

interface Owner {
  id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
}

interface Image {
  id: number;
  apartmentId: number;
  imageUrl: string;
  featured: boolean;
}

interface Apartment {
  id: number;
  name: string;
  location: string;
  ownerId: number;
  pricePerDay: number;
  pricePerMonth: number;
  discountPercent: number;
  description: string;
  maxAdults: number;
  maxChildren: number;
  numRooms: number;
  status: string;
  owners: Owner[];
  images: Image[];
  area: string;
}

const ApartmentDetail = () => {
  const location = window.location.pathname;
  const location1 = useLocation();
  const listingId = location1.state?.listingId;
  const pathParts = location.split("/");
  const rawApartmentName = pathParts[2]; // Get the apartment name from the URL
  const apartmentName = rawApartmentName
    ?.replace(/[^\w\s-]/g, "")
    .replace(/-/g, " ")
    .trim();
  console.log("Apartment Name1:", apartmentName);
  console.log("ID:", listingId);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [apartment, setApartment] = useState<Apartment | null>(null);
  const [numNights, setNumNights] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [form] = Form.useForm();
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [checkInOut, setCheckInOut] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);

  useEffect(() => {
    const fetchApartment = async () => {
      if (!apartmentName) {
        console.error("No apartment name provided");
        return;
      }

      try {
        console.log("Fetching apartment with name:", apartmentName);
        const response = await fetch(
          `https://api.anstay.com.vn/api/v1/apartments/search?name=${encodeURIComponent(
            apartmentName
          )}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Raw API Response:", data);

        // Check if data is an array and has items
        if (Array.isArray(data) && data.length > 0) {
          const apartment = data[0]; // Get first matching apartment

          if (!apartment.id) {
            throw new Error("Invalid apartment data - missing ID");
          }

          console.log("Valid apartment data received:", {
            id: apartment.id,
            name: apartment.name,
          });

          setApartment(apartment);
          setTotalPrice(apartment.pricePerDay);
        } else {
          throw new Error("No apartment found");
        }
      } catch (error) {
        console.error("Error fetching apartment:", error);
        notification.error({
          message: "Lỗi",
          description: "Không thể tìm thấy thông tin căn hộ",
          duration: 3,
        });
      }
    };

    fetchApartment();
  }, [apartmentName]);

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? apartment.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === apartment.images.length - 1 ? 0 : prev + 1
    );
  };

  const handleDateChange = (dates) => {
    if (dates && dates[0] && dates[1] && apartment) {
      setCheckInOut([dates[0].toDate(), dates[1].toDate()]);
      const nights = dates[1].diff(dates[0], "days");
      setNumNights(nights);
      setTotalPrice(apartment.pricePerDay * nights);
    }
  };

  const handleSubmit = async (values: any) => {
    if (!apartment || !checkInOut[0] || !checkInOut[1]) {
      notification.open({
        message: "Thiếu thông tin",
        description: "Vui lòng chọn thời gian thuê phòng",
        type: "warning",
        duration: 3,
      });
      return;
    }

    try {
      const payload = {
        fullName: values.fullName,
        phoneNumber: values.phoneNumber,
        email: values.email,
        checkIn: checkInOut[0].toISOString().split("T")[0],
        checkOut: checkInOut[1].toISOString().split("T")[0],
        adults: adults,
        children: children,
        message: values.message || "",
        pricePerNight: apartment.pricePerDay,
        totalPrice: totalPrice,
      };
      const response = await fetch(
        `https://api.anstay.com.vn/api/v1/apartments/${listingId}/send-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.status === 200) {
        // Show success notification
        notification.open({
          message: "Đặt phòng thành công",
          description: "Thông tin đặt phòng đã được gửi đến email của bạn",
          type: "success",
          duration: 3,
        });

        // Reset all form fields and states
        form.resetFields();
        form.setFieldValue("dateRange", null); // Reset date picker explicitly
        setCheckInOut([null, null]);
        setNumNights(1);
        setTotalPrice(apartment.pricePerDay);
        setAdults(1);
        setChildren(0);
      } else {
        throw new Error("Failed to send booking request");
      }
    } catch (error) {
      // Show error notification
      notification.open({
        message: "Đặt phòng thất bại",
        description: "Có lỗi xảy ra, vui lòng thử lại sau",
        type: "error",
        duration: 3,
      });
    }
  };

  if (!apartment) return <div>Loading...</div>;

  return (
    <div className="apartment-detail-container">
      <Row gutter={[24, 24]}>
        <Col span={14} xs={24} md={14}>
          <div className="main-image-container">
            <img
              src={apartment.images[currentImageIndex]?.imageUrl}
              alt={apartment.name}
              className="main-image"
              loading="lazy"
            />
            <button className="nav-btn prev" onClick={handlePrevImage}>
              ❮
            </button>
            <button className="nav-btn next" onClick={handleNextImage}>
              ❯
            </button>
          </div>

          <div className="thumbnail-container">
            {apartment.images.map((image, index) => (
              <div
                key={index}
                className={`thumbnail ${currentImageIndex === index ? "active" : ""
                  }`}
                onClick={() => setCurrentImageIndex(index)}
              >
                <img src={image.imageUrl} alt={`Thumbnail ${index + 1}`} loading="lazy" />
              </div>
            ))}
          </div>
        </Col>

        <Col span={10} xs={24} md={10}>
          <div className="booking-form">
            <Title level={3}>{apartment.name}</Title>
            <Text>Địa chỉ: {apartment.location}</Text>
            {/* <Text>Khu vực: {apartment.area}</Text> */}
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
              <Form.Item
                label="Họ và tên"
                name="fullName"
                rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
              >
                <Input placeholder="Nhập họ và tên của bạn" />
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Vui lòng nhập email" },
                  { type: "email", message: "Email không hợp lệ" },
                ]}
              >
                <Input type="email" placeholder="Nhập email của bạn" />
              </Form.Item>

              <Form.Item
                label="Số điện thoại"
                name="phoneNumber"
                rules={[
                  { required: true, message: "Vui lòng nhập số điện thoại" },
                ]}
              >
                <Input placeholder="Nhập số điện thoại của bạn" />
              </Form.Item>

              <Form.Item label="Thời gian thuê" name="dateRange" required>
                <RangePicker
                  showTime={{ format: "HH:mm" }}
                  format="YYYY-MM-DD HH:mm"
                  placeholder={["Ngày đến", "Ngày đi"]}
                  className="date-picker"
                  onChange={handleDateChange}
                />
              </Form.Item>

              {/* <div className="booking-summary">
                <div className="booking-detail">
                  <span>Thời gian ở:</span>
                  <span>{numNights} đêm</span>
                </div>
                <div className="booking-detail">
                  <span>Giá mỗi đêm:</span>
                  <span>{apartment.pricePerDay.toLocaleString("vi-VN")}đ</span>
                </div>
                <div className="booking-detail">
                  <span>Tổng tiền:</span>
                  <span>{totalPrice.toLocaleString("vi-VN")}đ</span>
                </div>
              </div> */}

              <Form.Item label="Số người lớn">
                <InputNumber
                  min={1}
                  max={apartment.maxAdults}
                  defaultValue={1}
                  onChange={(value) => setAdults(value)}
                  style={{ width: "100%" }}
                />
              </Form.Item>

              <Form.Item label="Số trẻ em">
                <InputNumber
                  min={0}
                  max={apartment.maxChildren}
                  defaultValue={0}
                  onChange={(value) => setChildren(value)}
                  style={{ width: "100%" }}
                />
              </Form.Item>

              <Form.Item label="Yêu cầu đặc biệt" name="message">
                <Input.TextArea
                  rows={4}
                  placeholder="Nhập các yêu cầu đặc biệt của bạn (nếu có)"
                />
              </Form.Item>

              <Button type="primary" size="large" block htmlType="submit">
                Xác nhận
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default ApartmentDetail;
