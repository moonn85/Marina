import React from "react";
import "./ChamSoc.css";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";

export default function ChamSoc() {
  return (
    <>
      <Header />
      <div className="support-container">
        <h1>Chăm Sóc Khách Hàng</h1>

        <section>
          <h2>1. Cam kết hỗ trợ 24/7</h2>
          <p>
            Anstay luôn đặt sự hài lòng của khách hàng làm trung tâm trong mọi
            hoạt động. Đội ngũ chăm sóc khách hàng (CSKH) của chúng tôi luôn sẵn
            sàng hỗ trợ bạn 24/7, bao gồm các ngày lễ, cuối tuần và giờ cao
            điểm.
          </p>
          <p>
            Tất cả các thắc mắc, phản ánh, khiếu nại hoặc góp ý đều được tiếp
            nhận và xử lý nhanh chóng thông qua các kênh liên hệ chính thức.
          </p>
        </section>

        <section>
          <h2>2. Kênh liên hệ chính thức</h2>
          <ul>
            <li>
              Zalo CSKH: <strong>(+84) 384945614</strong>
            </li>
            <li>
              Messenger Facebook:{" "}
              <a
                href="https://www.facebook.com/Anstayalacarte/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <strong>À La Carte Halong Bay Managed by Anstay </strong>
              </a>
            </li>
            <li>
              Hotline: <strong>(+84) 84 227 2772 </strong> ( lễ tân 8am - 6pm )
            </li>
            <li>
              Email: <strong>anstayresidence1@gmail.com</strong>
            </li>
          </ul>
        </section>

        <section>
          <h2>3. Quy trình tiếp nhận & xử lý yêu cầu</h2>
          <ol>
            <li>Tiếp nhận yêu cầu từ khách hàng qua các kênh hỗ trợ.</li>
            <li>Phân loại mức độ ưu tiên (khẩn cấp, bình thường, góp ý).</li>
            <li>
              Phản hồi trong vòng <strong>30 phút</strong> (tối đa 2 giờ với các
              trường hợp ngoài giờ).
            </li>
            <li>
              Chuyển bộ phận liên quan xử lý (kỹ thuật, booking, tài chính...).
            </li>
            <li>Theo dõi và cập nhật kết quả xử lý cho khách hàng.</li>
            <li>Lưu trữ phản hồi và đánh giá nội bộ để cải tiến dịch vụ.</li>
          </ol>
        </section>

        <section>
          <h2>4. Phản hồi & góp ý từ khách hàng</h2>
          <p>
            Anstay luôn khuyến khích khách hàng đưa ra nhận xét, góp ý hoặc phản
            hồi để hoàn thiện trải nghiệm. Bạn có thể gửi đánh giá qua các kênh
            sau:
          </p>
          <ul>
            <li>Trang "Đánh giá & Góp ý" trên website</li>
            <li>
              Email: <strong> anstayresidence1@gmail.com</strong>
            </li>
            <li>Giao diện chat Zalo hoặc Messenger (mục “Đánh giá dịch vụ”)</li>
          </ul>
        </section>

        <section>
          <h2>5. Chính sách hoàn/hủy & hỗ trợ đặt phòng</h2>
          <p>
            Tất cả yêu cầu liên quan đến hủy/đổi/hoàn tiền sẽ được xử lý theo
            chính sách nền tảng mà bạn đã đặt:
          </p>
          <ul>
            <li>
              Anstay: tuân theo chính sách được ghi rõ trong mỗi phòng đặt.
            </li>
            <li>
              Airbnb/Booking.com: theo điều kiện từng nhà cung cấp & quy định
              nền tảng.
            </li>
            <li>
              Trường hợp khách không đến (no-show): xử lý theo điều khoản thanh
              toán của từng booking.
            </li>
          </ul>
          <p>
            Để được hỗ trợ nhanh chóng, hãy chuẩn bị mã đặt phòng, email đặt, và
            nội dung yêu cầu cụ thể.
          </p>
        </section>
      </div>
      <Footer />
    </>
  );
}
