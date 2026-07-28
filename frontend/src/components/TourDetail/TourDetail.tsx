import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Typography, Row, Col, Button, Form, Input, Modal } from "antd";
import "./TourDetail.css";
import TravelDescription from "../TravelDescription/TravelDescription";
import { useLocation } from "react-router-dom";

const { Title, Text } = Typography;

interface Image {
  id: number;
  tourId: number;
  imageUrl: string;
  isFeatured: boolean;
  featured: boolean;
}

interface TourDataType {
  id: number;
  name: string;
  description: string;
  price: number;
  durationDays: number;
  discountPercent: number;
  createdAt: string;
  images: Array<Image | string>;
  area: string;
  transportation: string;
  hotel: string;
}

const TourDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const listingId = location.state?.listingId;
  console.log("listingId:", listingId);
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isContactModalVisible, setIsContactModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [tourData, setTourData] = useState<TourDataType | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDisabled, setIsDisabled] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Hỗ trợ cả kiểu { imageUrl } và chuỗi URL đơn
  const resolveImageUrl = (img: any): string => {
    if (!img) return "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b";
    if (typeof img === "string") return img;
    return img.imageUrl || "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b";
  };

  useEffect(() => {
    const fetchTourData = async () => {
      try {
        // 1) Ưu tiên API chính
        try {
          const response = await fetch(`https://anstay.com.vn/api/tours/${listingId}`);
          if (response.ok) {
            const json = await response.json();
            const tour = Array.isArray(json) ? json[0] : json;
            if (tour) {
              setTourData(tour);
              return;
            }
          }
        } catch (err) {
          console.warn("API tour detail lỗi, thử fallback shared/local", err);
        }

        // 2) Fallback shared JSON (tìm theo id)
        try {
          const resp = await fetch(`/shared-tours.json?t=${Date.now()}`);
          if (resp.ok) {
            const text = await resp.text();
            let tours;
            try { tours = JSON.parse(text); } catch { tours = null; }
            if (Array.isArray(tours)) {
              const tour = tours.find((t: any) => String(t.id) === String(listingId));
              if (tour) {
                setTourData(tour);
                return;
              }
            }
          }
        } catch {}

        // 3) localStorage
        try {
          const savedTours = localStorage.getItem('anstay_tours');
          if (savedTours) {
            const tours = JSON.parse(savedTours);
            if (Array.isArray(tours)) {
              const tour = tours.find((t: any) => String(t.id) === String(listingId));
              if (tour) {
                setTourData(tour);
                return;
              }
            }
          }
        } catch {}
      } catch (error) {
        console.error("Error fetching tour data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTourData();
  }, [id]);

  const handleNextImage = () => {
    if (!tourData) return;
    setCurrentImageIndex((prev) =>
      prev === tourData.images.length - 1 ? 0 : prev + 1
    );
  };

  const handlePrevImage = () => {
    if (!tourData) return;
    setCurrentImageIndex((prev) =>
      prev === 0 ? tourData.images.length - 1 : prev - 1
    );
  };

  const handleBooking = () => {
    navigate(`/booking`);
    ``;
  };

  const showContactModal = () => {
    setIsContactModalVisible(true);
  };

  const handleContactSubmit = async (values: any) => {
    setSubmitLoading(true);
    try {
      const response = await fetch(
        `https://anstay.com.vn/api/tours/${listingId}/contact`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: values.name,
            email: values.email,
            phone: values.phone,
            message: values.note,
          }),
        }
      );

      if (response.ok) {
        Modal.success({
          title: "Thành công",
          content: "Thông tin của bạn đã được gửi thành công!",
        });
        form.resetFields();
        setIsContactModalVisible(false);
      } else {
        throw new Error("Failed to submit");
      }
    } catch (error) {
      Modal.error({
        title: "Lỗi",
        content: "Có lỗi xảy ra khi gửi thông tin. Vui lòng thử lại!",
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!tourData) {
    return <div>Tour not found</div>;
  }

  return (
    <div className="tour-detail-container">
      <Row gutter={[24, 24]} className="row-tour-details">
        <Col span={14} xs={24} md={14} className="col-tour-details">
          <div className="main-image-container">
            <img
              src={resolveImageUrl(tourData?.images?.[currentImageIndex])}
              alt={tourData.name}
              className="main-image"
            />
            <button className="nav-btn prev" onClick={handlePrevImage}>
              ❮
            </button>
            <button className="nav-btn next" onClick={handleNextImage}>
              ❯
            </button>
          </div>

          <div className="thumbnail-container">
            {tourData?.images?.map((image: any, index: number) => (
              <div
                key={index}
                className={`thumbnail ${
                  currentImageIndex === index ? "active" : ""
                }`}
                onClick={() => setCurrentImageIndex(index)}
              >
                <img src={resolveImageUrl(image)} alt={`Thumbnail ${index + 1}`} />
              </div>
            ))}
          </div>
        </Col>

        <Col xs={24} md={10} span={10}>
          <div className="tour-info">
            <Title level={3}>Thông tin Tour</Title>
            <div className="tour-details">
              <Title level={2}>{tourData.name}</Title>
              <div>⏱️ {tourData.durationDays} ngày</div>
              <div>🚗 {tourData.transportation}</div>
              <div>🏨 {tourData.hotel}</div>
              <div className="tour-price">
                💰 {tourData.price.toLocaleString("vi-VN")}đ/người
              </div>
              {tourData.discountPercent > 0 && (
                <div className="discount">
                  Giảm giá: {tourData.discountPercent}%
                </div>
              )}
              <Button
                type="primary"
                size="large"
                className="booking-button"
                onClick={handleBooking}
                disabled={isDisabled}
              >
                {isDisabled ? "Đặt Tour" : "Đặt Tour"}
              </Button>
              <p>
                Hoặc Quý khách có thể để lại thông tin liên hệ điện thoại chúng
                tôi sẽ liên hệ trực tiếp tư vấn Quý khách ạ.
              </p>
              <Button
                type="default"
                size="large"
                className="contact-button"
                onClick={showContactModal}
              >
                Để Lại Thông Tin Tư Vấn
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      <TravelDescription description={tourData.description} />

      <Modal
        title="Để lại thông tin liên hệ"
        open={isContactModalVisible}
        onCancel={() => setIsContactModalVisible(false)}
        footer={null}
        className="modal-tour"
      >
        <Form form={form} layout="vertical" onFinish={handleContactSubmit}>
          <Form.Item
            name="name"
            label="Họ và tên"
            rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { type: "email", message: "Email không hợp lệ!" },
              { required: true, message: "Vui lòng nhập email!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="note" label="Ghi chú">
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={submitLoading}
            >
              Gửi thông tin
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TourDetail;
