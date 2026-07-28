import React from "react";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import "./HopTac.css";
import BeSearchForm from "../../../components/BeForms/BeSearchForm.tsx";
import { useTranslation } from "@/localization";

export default function HopTac() {
  const { t } = useTranslation('hoptac');
  return (
    <>
      <Header />
      <div className="partner-container">
        <h1>{t('hoptac.title', 'ĐỐI TÁC CHIẾN LƯỢC CÙNG ANSTAY')}</h1>

        <section>
          <h2>{t('hoptac.section1.title', 'Kết nối hệ sinh thái lưu trú – dịch vụ – du lịch chuyên nghiệp')}</h2>
          <p>
            <strong>{t('hoptac.section1.spirit', 'Với tinh thần: Thần tốc – Tận tâm – Tử tế')}</strong>
          </p>
          <p>
            {t('hoptac.section1.intro', 'Anstay chào đón các cá nhân, tổ chức, doanh nghiệp mong muốn hợp tác trong lĩnh vực lưu trú, vận hành và du lịch. Chúng tôi hướng tới xây dựng một hệ sinh thái hợp tác bền vững, nơi mỗi đối tác cùng chia sẻ giá trị, cùng phát triển, và cùng mang đến trải nghiệm tốt đẹp cho khách hàng.')}
          </p>
          <p>
            <strong>{t('hoptac.section1.coreValues', 'Giá trị cốt lõi trong hợp tác:')}</strong>
          </p>
          <ol>
            <li>{t('hoptac.section1.item1', 'Thần tốc trong phối hợp, triển khai và xử lý công việc')}</li>
            <li>{t('hoptac.section1.item2', 'Tận tâm trong phục vụ, hỗ trợ và đồng hành cùng đối tác')}</li>
            <li>{t('hoptac.section1.item3', 'Tử tế trong hành xử, minh bạch, tôn trọng cam kết và lợi ích chung')}</li>
          </ol>
        </section>

        <section>
          <h2>{t('hoptac.section2.title', 'Quyền lợi dành cho đối tác')}</h2>
          <ol>
            <li>{t('hoptac.section2.item1', 'Miễn phí đăng ký & khởi tạo hợp tác ban đầu')}</li>
            <li>{t('hoptac.section2.item2', 'Hỗ trợ chuẩn hóa hình ảnh – nội dung – hồ sơ phòng')}</li>
            <li>{t('hoptac.section2.item3', 'Phân phối đa kênh nội địa & quốc tế')}</li>
            <li>{t('hoptac.section2.item4', 'Dashboard doanh thu – booking minh bạch theo thời gian thực')}</li>
            <li>{t('hoptac.section2.item5', 'Hỗ trợ chiến lược giá & tối ưu tỷ lệ lấp phòng')}</li>
            <li>{t('hoptac.section2.item6', 'Chính sách thưởng & xếp hạng đối tác theo hiệu suất')}</li>
            <li>{t('hoptac.section2.item7', 'Chương trình đào tạo vận hành & dịch vụ khách hàng')}</li>
          </ol>
          <p>
            {t('hoptac.section2.conclusion', 'Tất cả được triển khai theo tinh thần Thần tốc – Tận tâm – Tử tế')}
          </p>
        </section>

        <section>
          <h2>{t('hoptac.section3.title', 'Đối tượng hợp tác')}</h2>
          <ol>
            <li>{t('hoptac.section3.item1', 'Chủ căn hộ dịch vụ, villa, homestay')}</li>
            <li>{t('hoptac.section3.item2', 'Nhà đầu tư khai thác lưu trú ngắn hạn')}</li>
            <li>{t('hoptac.section3.item3', 'Cộng tác viên & đối tác môi giới du lịch – lưu trú')}</li>
            <li>{t('hoptac.section3.item4', 'Đơn vị vận hành: housekeeping, lễ tân, bảo trì')}</li>
            <li>{t('hoptac.section3.item5', 'Doanh nghiệp lữ hành, đại lý du lịch, nhà cung cấp dịch vụ địa phương')}</li>
          </ol>
        </section>

        <section>
          <h2>{t('hoptac.section4.title', 'Mô hình hợp tác linh hoạt')}</h2>
          <ol>
            <li>{t('hoptac.section4.item1', 'Hợp tác phân phối phòng')}</li>
            <li>{t('hoptac.section4.item2', 'Đồng vận hành – đồng khai thác')}</li>
            <li>{t('hoptac.section4.item3', 'Ủy thác quản lý toàn phần')}</li>
            <li>{t('hoptac.section4.item4', 'Hợp tác B2B & đại lý du lịch')}</li>
            <li>{t('hoptac.section4.item5', 'Hợp tác dịch vụ hỗ trợ vận hành')}</li>
          </ol>
          <p>
            {t('hoptac.section4.intro', 'Mỗi mô hình được triển khai dựa trên nguyên tắc:')}
          </p>
          <p>
            <strong>{t('hoptac.section4.principle', '👉 Minh bạch – Hiệu quả – Win–Win – Thần tốc – Tận tâm – Tử tế')}</strong>
          </p>
        </section>

        <section>
          <h2>{t('hoptac.section5.title', 'Quy trình hợp tác tiêu chuẩn')}</h2>
          <ol>
            <li>{t('hoptac.section5.item1', 'Đăng ký thông tin đối tác')}</li>
            <li>{t('hoptac.section5.item2', 'Khảo sát & tư vấn mô hình phù hợp')}</li>
            <li>{t('hoptac.section5.item3', 'Thống nhất chính sách & ký thỏa thuận điện tử')}</li>
            <li>{t('hoptac.section5.item4', 'Đưa tài sản lên hệ thống & triển khai truyền thông')}</li>
            <li>{t('hoptac.section5.item5', 'Theo dõi hiệu quả kinh doanh qua dashboard & tối ưu doanh thu')}</li>
          </ol>
          <p>
            {t('hoptac.section5.intro', 'Mọi bước thực hiện đều được xử lý theo tinh thần:')}
          </p>
          <p>
            <strong>{t('hoptac.section5.spirit', '👉 Nhanh chóng – Tận tình – Chuẩn mực – Có trách nhiệm')}</strong>
          </p>
        </section>

        <section>
          <h2>{t('hoptac.section6.title', 'Cam kết của Anstay đối với đối tác')}</h2>
          <ol>
            <li>{t('hoptac.section6.item1', 'Minh bạch doanh thu & dữ liệu đối soát')}</li>
            <li>{t('hoptac.section6.item2', 'Đồng hành phát triển dài hạn')}</li>
            <li>{t('hoptac.section6.item3', 'Bảo mật thông tin & tuân thủ pháp lý')}</li>
            <li>{t('hoptac.section6.item4', 'Luôn hành động với tinh thần Tử tế – Tôn trọng – Chuyên nghiệp')}</li>
          </ol>
        </section>
      </div>
      <Footer />
    </>
  );
}
