import React from "react";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import "./BaoMat.css";
import BeSearchForm from "../../../components/BeForms/BeSearchForm.tsx";
import { useTranslation } from "@/localization";

export default function BaoMat() {
  const { t } = useTranslation('baomat');
  return (
    <>
      <Header />
      <div className="container">
        <h1>{t('baomat.title', 'CHÍNH SÁCH QUYỀN RIÊNG TƯ')}</h1>

        <section>
          <h2>{t('baomat.section1.title', 'Nguyên tắc chung về bảo vệ dữ liệu')}</h2>
          <p>
            {t('baomat.section1.intro', 'Anstay cam kết tuân thủ các nguyên tắc bảo mật theo chuẩn quốc tế, bao gồm:')}
          </p>
          <ol>
            <li>{t('baomat.section1.item1', 'Minh bạch trong việc thu thập và sử dụng dữ liệu')}</li>
            <li>{t('baomat.section1.item2', 'Chỉ thu thập thông tin cần thiết và hợp pháp')}</li>
            <li>{t('baomat.section1.item3', 'Bảo mật, mã hóa và quản trị quyền truy cập')}</li>
            <li>{t('baomat.section1.item4', 'Tôn trọng quyền riêng tư của khách hàng')}</li>
            <li>{t('baomat.section1.item5', 'Không chia sẻ dữ liệu trái phép hoặc vì mục đích thương mại')}</li>
          </ol>
          <p>
            {t('baomat.section1.conclusion', 'Chính sách này áp dụng cho toàn bộ khách hàng, đối tác, nhà cung cấp, nhân sự và hệ thống liên quan đến hoạt động kinh doanh của Anstay.')}
          </p>
        </section>

        <section>
          <h2>{t('baomat.section2.title', 'Mục đích thu thập và cơ sở pháp lý xử lý dữ liệu')}</h2>
          <p>
            {t('baomat.section2.intro1', 'Thông tin cá nhân được thu thập và sử dụng cho các mục đích sau:')}
          </p>
          <ol>
            <li>{t('baomat.section2.item1', 'Xử lý đặt phòng, thanh toán, xác nhận dịch vụ')}</li>
            <li>{t('baomat.section2.item2', 'Nhận diện và xác thực khách hàng')}</li>
            <li>{t('baomat.section2.item3', 'Hỗ trợ, chăm sóc khách hàng và xử lý khiếu nại')}</li>
            <li>{t('baomat.section2.item4', 'Nâng cao chất lượng dịch vụ và trải nghiệm người dùng')}</li>
            <li>{t('baomat.section2.item5', 'Gửi thông báo vận hành, ưu đãi, chương trình chăm sóc khách hàng (khi được đồng ý)')}</li>
            <li>{t('baomat.section2.item6', 'Đảm bảo tuân thủ nghĩa vụ kế toán, thuế và pháp luật')}</li>
          </ol>
          <p>
            {t('baomat.section2.intro2', 'Việc xử lý dữ liệu dựa trên các cơ sở:')}
          </p>
          <ol>
            <li>{t('baomat.section2.basis1', 'Đồng ý của khách hàng')}</li>
            <li>{t('baomat.section2.basis2', 'Thực hiện hợp đồng')}</li>
            <li>{t('baomat.section2.basis3', 'Nghĩa vụ pháp lý')}</li>
            <li>{t('baomat.section2.basis4', 'Lợi ích hợp pháp liên quan đến vận hành dịch vụ')}</li>
          </ol>
        </section>

        <section>
          <h2>{t('baomat.section3.title', 'Phạm vi và cách thức sử dụng thông tin')}</h2>
          <p>
            {t('baomat.section3.intro1', 'Thông tin chỉ được sử dụng trong phạm vi cần thiết:')}
          </p>
          <ol>
            <li>{t('baomat.section3.item1', 'Quản lý đặt phòng, lưu trú, thanh toán, an ninh lưu trú')}</li>
            <li>{t('baomat.section3.item2', 'Vận hành PMS, Channel Manager, OTA, CRM')}</li>
            <li>{t('baomat.section3.item3', 'Phân tích dữ liệu phục vụ cải tiến sản phẩm & dịch vụ')}</li>
            <li>{t('baomat.section3.item4', 'Ngăn chặn gian lận giao dịch và bảo vệ quyền lợi khách hàng')}</li>
          </ol>
          <p>
            {t('baomat.section3.intro2', 'Dữ liệu được xử lý theo nguyên tắc:')}
          </p>
          <ol>
            <li>{t('baomat.section3.principle1', 'Hạn chế truy cập theo vai trò (Role-Based Access)')}</li>
            <li>{t('baomat.section3.principle2', 'Ghi nhận lịch sử truy cập hệ thống (Audit Log)')}</li>
            <li>{t('baomat.section3.principle3', 'Không sử dụng dữ liệu ngoài mục đích đã thông báo')}</li>
          </ol>
        </section>

        <section>
          <h2>{t('baomat.section4.title', 'Lưu trữ và thời hạn bảo quản thông tin')}</h2>
          <p>
            {t('baomat.section4.intro1', 'Dữ liệu cá nhân được lưu trữ:')}
          </p>
          <ol>
            <li>{t('baomat.section4.item1', 'Theo thời hạn cần thiết cho mục đích dịch vụ')}</li>
            <li>{t('baomat.section4.item2', 'Theo quy định của pháp luật hiện hành')}</li>
            <li>{t('baomat.section4.item3', 'Hoặc cho đến khi khách hàng yêu cầu xóa dữ liệu (trừ trường hợp pháp luật yêu cầu lưu giữ)')}</li>
          </ol>
          <p>
            {t('baomat.section4.intro2', 'Sau thời hạn, dữ liệu sẽ:')}
          </p>
          <ol>
            <li>{t('baomat.section4.after1', 'Được xóa an toàn')}</li>
            <li>{t('baomat.section4.after2', 'Hoặc ẩn danh (anonymization)')}</li>
          </ol>
        </section>

        <section>
          <h2>{t('baomat.section5.title', 'Bảo mật và an toàn thông tin')}</h2>
          <p>
            {t('baomat.section5.intro1', 'Anstay áp dụng các biện pháp bảo mật theo chuẩn quốc tế:')}
          </p>
          <ol>
            <li>{t('baomat.section5.item1', 'Giao thức HTTPS & SSL/TLS')}</li>
            <li>{t('baomat.section5.item2', 'Mã hóa dữ liệu nhạy cảm')}</li>
            <li>{t('baomat.section5.item3', 'Sao lưu định kỳ và hệ thống lưu trữ an toàn')}</li>
            <li>{t('baomat.section5.item4', 'Phân quyền truy cập nhiều lớp')}</li>
            <li>{t('baomat.section5.item5', 'Kiểm soát và giám sát an ninh hệ thống')}</li>
            <li>{t('baomat.section5.item6', 'Đào tạo nhân sự về bảo mật thông tin')}</li>
            <li>{t('baomat.section5.item7', 'Cam kết bảo mật dữ liệu với nhân viên & đối tác')}</li>
          </ol>
          <p>
            {t('baomat.section5.intro2', 'Trong trường hợp có sự cố rò rỉ dữ liệu, Anstay sẽ:')}
          </p>
          <ol>
            <li>{t('baomat.section5.incident1', 'Kích hoạt quy trình ứng phó sự cố')}</li>
            <li>{t('baomat.section5.incident2', 'Thông báo cho khách hàng và cơ quan có thẩm quyền theo quy định')}</li>
          </ol>
        </section>

        <section>
          <h2>{t('baomat.section6.title', 'Quyền của khách hàng đối với dữ liệu cá nhân')}</h2>
          <p>
            {t('baomat.section6.intro', 'Khách hàng có quyền:')}
          </p>
          <ol>
            <li>{t('baomat.section6.item1', 'Yêu cầu xem, truy cập hoặc nhận bản sao dữ liệu cá nhân')}</li>
            <li>{t('baomat.section6.item2', 'Chỉnh sửa, cập nhật dữ liệu không chính xác')}</li>
            <li>{t('baomat.section6.item3', 'Yêu cầu hạn chế hoặc ngừng xử lý dữ liệu')}</li>
            <li>{t('baomat.section6.item4', 'Rút lại sự đồng ý')}</li>
            <li>{t('baomat.section6.item5', 'Yêu cầu xóa dữ liệu (khi phù hợp pháp luật)')}</li>
            <li>{t('baomat.section6.item6', 'Khiếu nại liên quan đến việc bảo mật dữ liệu')}</li>
          </ol>
          <p>
            {t('baomat.section6.conclusion', 'Mọi yêu cầu có thể gửi qua bộ phận chăm sóc khách hàng của Anstay.')}
          </p>
        </section>

        <section>
          <h2>{t('baomat.section7.title', 'Chia sẻ dữ liệu với bên thứ ba')}</h2>
          <p>
            {t('baomat.section7.intro1', 'Anstay không bán hoặc trao đổi dữ liệu cá nhân cho bên thứ ba.')}
          </p>
          <p>
            {t('baomat.section7.intro2', 'Dữ liệu chỉ được chia sẻ khi:')}
          </p>
          <ol>
            <li>{t('baomat.section7.item1', 'Có sự đồng ý rõ ràng của khách hàng')}</li>
            <li>{t('baomat.section7.item2', 'Phục vụ việc cung cấp dịch vụ (ví dụ: cổng thanh toán, OTA, ngân hàng, nhà cung cấp PMS/CRM, đối tác lưu trú)')}</li>
            <li>{t('baomat.section7.item3', 'Theo yêu cầu hợp pháp của cơ quan nhà nước')}</li>
            <li>{t('baomat.section7.item4', 'Khi cần thiết để bảo vệ quyền lợi hợp pháp của khách hàng và Anstay')}</li>
          </ol>
          <p>
            {t('baomat.section7.intro3', 'Tất cả đối tác liên quan phải tuân thủ:')}
          </p>
          <ol>
            <li>{t('baomat.section7.compliance1', 'Thỏa thuận bảo mật dữ liệu (DPA / NDA)')}</li>
            <li>{t('baomat.section7.compliance2', 'Tiêu chuẩn bảo mật của Anstay')}</li>
          </ol>
        </section>

        <section>
          <h2>{t('baomat.section8.title', 'Truyền dữ liệu xuyên biên giới (nếu có)')}</h2>
          <p>
            {t('baomat.section8.intro', 'Trong trường hợp dữ liệu được lưu trữ hoặc xử lý trên máy chủ quốc tế:')}
          </p>
          <ol>
            <li>{t('baomat.section8.item1', 'Việc truyền dữ liệu tuân thủ quy định pháp luật')}</li>
            <li>{t('baomat.section8.item2', 'Áp dụng cơ chế bảo vệ tương đương chuẩn quốc tế')}</li>
            <li>{t('baomat.section8.item3', 'Chỉ sử dụng nhà cung cấp hạ tầng đạt tiêu chuẩn bảo mật')}</li>
          </ol>
        </section>

        <section>
          <h2>{t('baomat.section9.title', 'Chính sách Cookie và công nghệ theo dõi')}</h2>
          <p>
            {t('baomat.section9.intro1', 'Website có thể sử dụng:')}
          </p>
          <ol>
            <li>{t('baomat.section9.item1', 'Cookie chức năng')}</li>
            <li>{t('baomat.section9.item2', 'Cookie phân tích hành vi người dùng')}</li>
            <li>{t('baomat.section9.item3', 'Công cụ đo lường & trải nghiệm người dùng')}</li>
          </ol>
          <p>
            {t('baomat.section9.intro2', 'Người dùng có thể:')}
          </p>
          <ol>
            <li>{t('baomat.section9.user1', 'Tắt cookie trên trình duyệt')}</li>
            <li>{t('baomat.section9.user2', 'Nhưng một số chức năng có thể bị hạn chế')}</li>
          </ol>
          <p>
            {t('baomat.section9.conclusion', 'Dữ liệu cookie chỉ phục vụ mục đích vận hành và cải thiện dịch vụ, không chia sẻ thương mại trái phép.')}
          </p>
        </section>

        <section>
          <h2>{t('baomat.section10.title', 'Dữ liệu của trẻ vị thành niên')}</h2>
          <p>
            {t('baomat.section10.intro', 'Anstay không cố ý thu thập dữ liệu của trẻ dưới độ tuổi pháp lý trừ trường hợp:')}
          </p>
          <ol>
            <li>{t('baomat.section10.item1', 'Có sự đồng ý của người giám hộ')}</li>
            <li>{t('baomat.section10.item2', 'Phục vụ mục đích lưu trú theo quy định')}</li>
          </ol>
        </section>

        <section>
          <h2>{t('baomat.section11.title', 'Cập nhật chính sách')}</h2>
          <p>
            {t('baomat.section11.intro', 'Chính sách có thể được cập nhật định kỳ để:')}
          </p>
          <ol>
            <li>{t('baomat.section11.item1', 'Phù hợp pháp luật')}</li>
            <li>{t('baomat.section11.item2', 'Nâng cao chuẩn bảo mật')}</li>
          </ol>
          <p>
            {t('baomat.section11.dateLabel', 'Ngày cập nhật gần nhất:')} <strong>{t('baomat.section11.date', '3/1/2026')}</strong>.
          </p>
        </section>
      </div>
      <Footer />
    </>
  );
}
