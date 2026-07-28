import React from 'react';
import './bookroom.css';
import BeBookingForm from "../BeForms/BeBookingForm.tsx";

const Booking: React.FC = () => {
  return (
    <main className="booking-page">
      <section className="booking-seo-content sr-only">
        <h1>Đặt phòng Anstay Hạ Long</h1>

        <p>
          Kiểm tra phòng trống và đặt phòng tại Anstay Hạ Long, A La Carte Hạ Long,
          Anstay Marina Hotel Ha Long và các căn hộ nghỉ dưỡng do Anstay vận hành.
        </p>

        <p>
          Anstay cung cấp căn hộ studio, căn hộ 1 phòng ngủ, căn hộ 2 phòng ngủ
          và phòng nghỉ gần biển tại khu vực Bãi Cháy, Hạ Long.
        </p>

        <p>
          Quý khách có thể đặt phòng trực tuyến, nhận hỗ trợ check-in, tự check-in,
          thuê xe, đặt tour vịnh Hạ Long và liên hệ qua Hotline, Zalo hoặc WhatsApp.
        </p>

        <p>
          Hotline/Zalo/WhatsApp hỗ trợ đặt phòng Anstay: +84 384 945 614.
        </p>
      </section>

      <section className="booking-form-section" aria-label="Công cụ đặt phòng Anstay">
        <BeBookingForm />
      </section>
    </main>
  );
};

export default Booking;